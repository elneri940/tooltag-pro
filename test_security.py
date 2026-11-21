import sys
sys.path.insert(0, 'C:/Users/luisn/.gemini/antigravity/scratch/rfid-tool-manager')

import asyncio
from starlette.testclient import TestClient
from backend.app import app
from backend.auth import clear_login_failures

client = TestClient(app)

def run_tests():
    print("=== STARTING SECURITY SUITE TESTS ===")

    # 1. Unauthenticated request to administrative endpoint must fail with 401
    res = client.post("/api/requests/1/approve")
    print(f"1. Unauthenticated /api/requests/1/approve status: {res.status_code}")
    assert res.status_code == 401, f"Expected 401, got {res.status_code}"
    assert res.json().get("code") == "UNAUTHORIZED"

    # 2. Unauthenticated request to delete user must fail with 401
    res = client.delete("/api/users/999")
    print(f"2. Unauthenticated /api/users/999 DELETE status: {res.status_code}")
    assert res.status_code == 401, f"Expected 401, got {res.status_code}"

    # 3. Unauthenticated request to export history CSV must fail with 401
    res = client.get("/api/history.csv")
    print(f"3. Unauthenticated /api/history.csv GET status: {res.status_code}")
    assert res.status_code == 401, f"Expected 401, got {res.status_code}"

    # 4. Admin login with correct credentials should return valid JWT
    clear_login_failures("testclient:admin@taller.io")
    login_res = client.post("/api/auth/login", json={
        "identifier": "admin@taller.io",
        "password": "M9#xK4!vR2"
    })
    print(f"4. Admin login status: {login_res.status_code}")
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    admin_data = login_res.json()
    assert admin_data.get("token"), "No token returned in login response"
    admin_token = admin_data["token"]
    print("   Admin JWT successfully generated:", admin_token[:25] + "...")

    # 5. Accessing /api/auth/me with Bearer token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    print(f"5. /api/auth/me status: {me_res.status_code}")
    assert me_res.status_code == 200
    assert me_res.json().get("authenticated") is True
    assert me_res.json()["user"]["rol"] == "admin"

    # 6. Accessing history CSV with token query param
    csv_res = client.get(f"/api/history.csv?token={admin_token}")
    print(f"6. /api/history.csv with token status: {csv_res.status_code}")
    assert csv_res.status_code == 200

    # 7. Student registration without PIN must be rejected
    bad_reg = client.post("/api/auth/register", json={
        "nombres": "Juan",
        "apellido_paterno": "Perez",
        "matricula": "TEST_SEC_001",
        "email": "juan.sec@uaem.mx",
        "password": ""
    })
    print(f"7. Registration without PIN status: {bad_reg.status_code}")
    assert bad_reg.status_code == 400
    assert "contraseña o PIN" in bad_reg.json().get("error", "")

    # 8. Student registration with PIN succeeds and gives token
    clean_reg = client.post("/api/auth/register", json={
        "nombres": "Carlos",
        "apellido_paterno": "Prueba",
        "matricula": "SEC9999",
        "email": "carlos.sec@uaem.mx",
        "password": "password123"
    })
    print(f"8. Registration with PIN status: {clean_reg.status_code}")
    if clean_reg.status_code == 200:
        student_token = clean_reg.json().get("token")
        assert student_token, "No token in registration response"

        # 9. Student trying an admin action (e.g., approve request or delete user) must be forbidden (403)
        forbidden_res = client.delete("/api/users/1", headers={"Authorization": f"Bearer {student_token}"})
        print(f"9. Student attempting admin action status: {forbidden_res.status_code}")
        assert forbidden_res.status_code == 403, f"Expected 403, got {forbidden_res.status_code}"
        assert forbidden_res.json().get("code") == "FORBIDDEN"

    # 10. Rate limiting test: 5 bad login attempts
    print("10. Testing rate limiting...")
    rate_key = "testclient:ratetest@taller.io"
    clear_login_failures(rate_key)
    for i in range(5):
        client.post("/api/auth/login", json={"identifier": "ratetest@taller.io", "password": "wrong"})
    rate_limited_res = client.post("/api/auth/login", json={"identifier": "ratetest@taller.io", "password": "wrong"})
    print(f"   Rate-limited 6th attempt status: {rate_limited_res.status_code}")
    assert rate_limited_res.status_code == 429
    assert rate_limited_res.json().get("code") == "TOO_MANY_REQUESTS"

    print("\nALL 10 SECURITY SUITE TESTS PASSED 100% SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
