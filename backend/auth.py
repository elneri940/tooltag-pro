import os
import time
import json
import base64
import hmac
import hashlib
from starlette.responses import JSONResponse
from .database import query_db

JWT_SECRET = os.environ.get("JWT_SECRET", "ees_yecapixtla_taller_secret_key_2026_super_secure")

# In-memory rate limiting tracker: { key: [timestamp1, timestamp2, ...] }
_failed_login_attempts = {}

def _clean_old_attempts(now: float, window_seconds: int = 60):
    to_delete = []
    for k, timestamps in _failed_login_attempts.items():
        valid = [t for t in timestamps if now - t < window_seconds]
        if valid:
            _failed_login_attempts[k] = valid
        else:
            to_delete.append(k)
    for k in to_delete:
        _failed_login_attempts.pop(k, None)

def is_rate_limited(key: str, max_attempts: int = 5, window_seconds: int = 60) -> bool:
    now = time.time()
    _clean_old_attempts(now, window_seconds)
    attempts = _failed_login_attempts.get(key, [])
    return len(attempts) >= max_attempts

def record_login_failure(key: str):
    now = time.time()
    if key not in _failed_login_attempts:
        _failed_login_attempts[key] = []
    _failed_login_attempts[key].append(now)

def clear_login_failures(key: str):
    _failed_login_attempts.pop(key, None)

# ==========================================
# JWT (JSON WEB TOKEN) - RFC 7519 COMPLIANT
# ==========================================

def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')

def _b64url_decode(s: str) -> bytes:
    padding = '=' * ((4 - len(s) % 4) % 4)
    return base64.urlsafe_b64decode((s + padding).encode('ascii'))

def create_access_token(user_id: int, rol: str, email: str, expires_in_seconds: int = 86400 * 7) -> str:
    """Genera un JWT firmado con HMAC-SHA256 válido por el tiempo especificado (default: 7 días)."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user_id,
        "rol": rol,
        "email": email,
        "iat": int(time.time()),
        "exp": int(time.time()) + expires_in_seconds
    }
    header_b64 = _b64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    signing_input = f"{header_b64}.{payload_b64}".encode('ascii')
    sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64url_encode(sig)
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_access_token(token: str) -> dict | None:
    """Verifica la firma y expiración del JWT. Retorna el payload decodificado o None."""
    if not token or not isinstance(token, str):
        return None
    try:
        parts = token.strip().split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('ascii')
        expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = _b64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        payload = json.loads(_b64url_decode(payload_b64).decode('utf-8'))
        if payload.get("exp") and time.time() > payload["exp"]:
            return None  # Expirado
        return payload
    except Exception:
        return None

def get_current_user_from_request(request) -> dict | None:
    """Extrae y valida el usuario actual a partir del token Bearer en Authorization o query param."""
    token = None
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    if auth_header:
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
        else:
            token = auth_header.strip()
    if not token:
        token = request.headers.get("X-Auth-Token") or request.headers.get("x-auth-token")
    if not token and hasattr(request, "query_params"):
        token = request.query_params.get("token")

    if not token:
        return None

    payload = verify_access_token(token)
    if not payload or not payload.get("sub"):
        return None

    user = query_db("""
        SELECT id, nombre, email, rol, matricula, puntos, estado 
        FROM users 
        WHERE id = ?
    """, (payload["sub"],), one=True)

    if not user or user.get("estado") == "bloqueado":
        return None

    return user

def require_auth(request, allowed_roles: list[str] | None = None):
    """
    Middleware/Guard para verificar autenticación y autorización por roles.
    Retorna (user, None) si es válido.
    Retorna (None, JSONResponse) si es inválido o no autorizado.
    """
    user = get_current_user_from_request(request)
    if not user:
        return None, JSONResponse({
            "error": "Acceso denegado: se requiere autenticación válida.",
            "code": "UNAUTHORIZED"
        }, status_code=401)

    if allowed_roles:
        user_role = (user.get("rol") or "user").lower()
        allowed = [r.lower() for r in allowed_roles]
        if user_role not in allowed:
            return None, JSONResponse({
                "error": f"Permisos insuficientes: acción reservada para {', '.join(allowed_roles)}.",
                "code": "FORBIDDEN"
            }, status_code=403)

    return user, None
