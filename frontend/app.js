// ToolTag Pro - Sistema de Préstamo de Herramientas RFID & Gamificación
// Aplicación Full-Stack en React 18

const { useState, useEffect, useRef, useMemo } = React;

// ==========================================
// COMPONENTES DE ICONOS SVG (LUCIDE EQUIVALENT)
// ==========================================
const IconWrench = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
);

const IconRadio = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
        <circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
        <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
    </svg>
);

const IconShield = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const IconUser = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

const IconClock = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

const IconTrophy = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
);

const IconAlertTriangle = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const IconCheckCircle = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const IconXCircle = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);

const IconPlus = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);

const IconRefreshCw = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
);

const IconSearch = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);

const IconLogOut = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

const IconSliders = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
        <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
    </svg>
);

const IconVolume2 = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
);

const IconSparkles = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
    </svg>
);

const IconLock = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const IconEye = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

const IconEyeOff = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
);

const IconClipboard = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
);

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
function App() {
    // Usuario activo en sesión: persistente en localStorage para que no se cierre al refrescar
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('tooltag_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    // Modales de Autenticación inicial
    // 'user_login' | 'admin_login' | 'user_register' | 'admin_register' | null
    const [authModal, setAuthModal] = useState(null);

    // Pestañas según el rol (recordadas al refrescar la página)
    const [userTab, setUserTab] = useState(() => {
        try {
            return localStorage.getItem('tooltag_user_tab') || 'catalog';
        } catch (e) {
            return 'catalog';
        }
    });
    const [adminTab, setAdminTab] = useState(() => {
        try {
            return localStorage.getItem('tooltag_admin_tab') || 'requests';
        } catch (e) {
            return 'requests';
        }
    });

    // Guardar estado de sesión en localStorage para persistir entre refrescos
    useEffect(() => {
        try {
            if (currentUser) {
                localStorage.setItem('tooltag_user', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('tooltag_user');
            }
        } catch (e) {}
    }, [currentUser]);

    useEffect(() => {
        try {
            if (userTab) localStorage.setItem('tooltag_user_tab', userTab);
        } catch (e) {}
    }, [userTab]);

    useEffect(() => {
        try {
            if (adminTab) localStorage.setItem('tooltag_admin_tab', adminTab);
        } catch (e) {}
    }, [adminTab]);

    // Estado del Kiosco RFID
    const [kioskUser, setKioskUser] = useState(null);
    const [kioskTab, setKioskTab] = useState('checkout');
    const [kioskTimeout, setKioskTimeout] = useState(30);
    const [selectedToolToCheckout, setSelectedToolToCheckout] = useState(null);

    // Modales de Administración
    const [toolModalOpen, setToolModalOpen] = useState(false);
    const [editingTool, setEditingTool] = useState(null);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [adjustPointsModalOpen, setAdjustPointsModalOpen] = useState(false);
    const [targetUserForPoints, setTargetUserForPoints] = useState(null);
    const [pointAdjustAmount, setPointAdjustAmount] = useState(10);
    const [pointAdjustReason, setPointAdjustReason] = useState("");
    const [adminProfileOpen, setAdminProfileOpen] = useState(false);

    // Modal de Solicitud de Préstamo (para Operarios)
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [toolForRequest, setToolForRequest] = useState(null);

    // PIN de seguridad para préstamos
    const [pinModalOpen, setPinModalOpen] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState("");
    const [pendingCheckout, setPendingCheckout] = useState(null);
    const [returnModal, setReturnModal] = useState(null);

    // Datos globales
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [tools, setTools] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loanRequests, setLoanRequests] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [settings, setSettings] = useState({});

    // Simulador RFID Flotante
    const [simulatorOpen, setSimulatorOpen] = useState(false);
    const [customTagInput, setCustomTagInput] = useState("");
    const [lastScannedTag, setLastScannedTag] = useState(null);

    // Modal de Feedback de Gamificación
    const [gamificationModal, setGamificationModal] = useState(null);

    // Toast de notificaciones
    const [toast, setToast] = useState(null);
    const showToast = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ==========================================
    // CARGA DE DATOS & SSE
    // ==========================================
    const isRefreshingRef = useRef(false);

    const refreshAllData = async () => {
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;
        try {
            // Intento prioritario por /api/sync unificado (un solo viaje de red)
            let syncData = null;
            try {
                const res = await fetch('/api/sync');
                if (res.ok) {
                    syncData = await res.json();
                }
            } catch (e) {}

            if (syncData && syncData.stats) {
                setStats(syncData.stats);
                setUsers(syncData.users || []);
                setTools(syncData.tools || []);
                setLoans(syncData.loans || []);
                setLeaderboard(syncData.leaderboard || []);
                setSettings(syncData.settings || {});
                setTransactions(syncData.transactions || []);
                setLoanRequests(syncData.requests || []);

                if (currentUser && syncData.users) {
                    const refreshed = syncData.users.find(u => u.id === currentUser.id);
                    if (refreshed) {
                        setCurrentUser(prev => ({ ...prev, ...refreshed }));
                    }
                }
            } else {
                // Fallback de seguridad si /api/sync no estuviera listo
                const [statsRes, usersRes, toolsRes, loansRes, leadRes, setRes, txRes, reqsRes] = await Promise.all([
                    fetch('/api/stats').then(r => r.json()),
                    fetch('/api/users').then(r => r.json()),
                    fetch('/api/tools').then(r => r.json()),
                    fetch('/api/loans').then(r => r.json()),
                    fetch('/api/leaderboard').then(r => r.json()),
                    fetch('/api/settings').then(r => r.json()),
                    fetch('/api/transactions').then(r => r.json()),
                    fetch('/api/requests').then(r => r.json())
                ]);
                setStats(statsRes);
                setUsers(usersRes);
                setTools(toolsRes);
                setLoans(loansRes);
                setLeaderboard(leadRes);
                setSettings(setRes);
                setTransactions(txRes);
                setLoanRequests(reqsRes);

                if (currentUser) {
                    const refreshed = usersRes.find(u => u.id === currentUser.id);
                    if (refreshed) {
                        setCurrentUser(prev => ({ ...prev, ...refreshed }));
                    }
                }
            }
        } catch (err) {
            console.error("Error al cargar datos:", err);
        } finally {
            isRefreshingRef.current = false;
        }
    };

    useEffect(() => {
        refreshAllData();

        // 1. Polling inteligente: solo si la pestaña está activa y visible
        const pollInterval = setInterval(() => {
            if (document.hidden) return;
            refreshAllData();
        }, 8000);

        // 2. Conexión SSE para recepción inmediata de eventos en tiempo real
        let evtSource = null;
        try {
            evtSource = new EventSource('/api/events');
            const handleEvent = () => {
                refreshAllData();
            };
            evtSource.onmessage = handleEvent;
            evtSource.addEventListener('message', handleEvent);
            evtSource.addEventListener('user_created', handleEvent);
            evtSource.addEventListener('user_deleted', handleEvent);
            evtSource.addEventListener('loan_updated', handleEvent);
            evtSource.addEventListener('tool_updated', handleEvent);
            evtSource.onerror = () => {
                // El polling de respaldo mantiene la reactividad si SSE se reconecta
            };
        } catch (e) {}

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                refreshAllData();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(pollInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (evtSource) {
                try { evtSource.close(); } catch (e) {}
            }
        };
    }, []);

    // Temporizador Kiosco
    useEffect(() => {
        if (!kioskUser) return;
        const interval = setInterval(() => {
            setKioskTimeout(prev => {
                if (prev <= 1) {
                    setKioskUser(null);
                    showToast("Sesión del Kiosco finalizada por inactividad", "info");
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [kioskUser]);

    // Listener Global Hardware RFID HID Keyboard
    useEffect(() => {
        let buffer = "";
        let lastCharTime = Date.now();

        const handleKeyDown = (e) => {
            if (e.target && e.target.dataset && e.target.dataset.noscan) return;
            const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
            const now = Date.now();
            const timeDiff = now - lastCharTime;
            lastCharTime = now;

            if (e.key === 'Enter') {
                if (buffer.length >= 3) {
                    const scannedTag = buffer.trim();
                    buffer = "";
                    e.preventDefault();
                    processRfidScan(scannedTag);
                }
                buffer = "";
                return;
            }

            if (e.key.length === 1) {
                if (timeDiff > 120 && buffer.length > 0) {
                    buffer = "";
                }
                buffer += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [kioskUser, currentUser]);

    // Procesador RFID
    const processRfidScan = async (tagUid) => {
        tagUid = tagUid.trim();
        setLastScannedTag(tagUid);
        window.rfidAudio.playRfidBeep();

        try {
            const res = await fetch('/api/rfid/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag_uid: tagUid })
            });
            const data = await res.json();

            if (!res.ok) {
                window.rfidAudio.playError();
                showToast(`Tag no registrado: ${tagUid}`, "error");
                return;
            }

            if (data.target === 'user') {
                const user = data.data;
                // Si no hay sesión, iniciar sesión con este usuario
                if (!currentUser) {
                    setCurrentUser(user);
                    if (user.rol === 'admin') {
                        setAdminTab('requests');
                    } else {
                        setUserTab('catalog');
                    }
                    window.rfidAudio.playSuccess();
                    showToast(`Bienvenido ${user.nombre} (${user.rol.toUpperCase()})`, "success");
                    return;
                }

                // Si ya estamos en Kiosco
                setKioskUser({
                    ...user,
                    active_loans: data.active_loans,
                    bloqueado_por_puntos: data.bloqueado,
                    has_pin: data.has_pin,
                    require_pin: data.require_pin
                });
                setKioskTimeout(30);

                if (data.bloqueado) {
                    window.rfidAudio.playWarning();
                    showToast(`¡Atención! ${user.nombre} tiene acceso bloqueado para nuevos préstamos`, "warning");
                } else {
                    window.rfidAudio.playSuccess();
                    showToast(`Identificado en Kiosco: ${user.nombre}`, "success");
                }
                return;
            }

            if (data.target === 'tool') {
                const tool = data.data;
                if (kioskUser) {
                    const loan = kioskUser.active_loans?.find(l => l.tool_id === tool.id || (l.tool_tag && l.tool_tag.toUpperCase() === tagUid.toUpperCase()));
                    if (loan) {
                        handleCheckin(loan.id);
                        return;
                    }

                    if (tool.estado === 'disponible') {
                        if (kioskUser.bloqueado_por_puntos) {
                            window.rfidAudio.playError();
                            showToast(`Préstamo bloqueado por puntaje insuficiente`, "error");
                            return;
                        }
                        handleCheckout(kioskUser.id, tool.id);
                        return;
                    } else {
                        showToast(`Herramienta '${tool.nombre}' no disponible (${tool.estado})`, "warning");
                    }
                } else {
                    showToast(`Herramienta: ${tool.nombre} [${tool.estado}]`, "info");
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Operaciones de Préstamo y Devolución
    const handleCheckout = async (userId, toolId, customHours = null, pin = null) => {
        const alreadyAuthenticated = kioskUser?.authenticated_via_password === true;
        if (kioskUser && kioskUser.require_pin && !pin && !alreadyAuthenticated) {
            const _ids = Array.isArray(toolId) ? toolId : [toolId];
            const _names = tools.filter(t => _ids.includes(t.id)).map(t => t.nombre).join(', ');
            setPendingCheckout({ userId, toolId, customHours, tool: Array.isArray(toolId) ? { nombre: _names } : selectedToolToCheckout });
            setPinInput("");
            setPinError("");
            setPinModalOpen(true);
            return;
        }

        if (pin) {
            try {
                const verifyRes = await fetch('/api/verify-pin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, pin: pin })
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok || !verifyData.verified) {
                    setPinError(verifyData.message || "PIN incorrecto");
                    window.rfidAudio.playError();
                    return;
                }
            } catch (err) {
                setPinError("Error de verificación");
                return;
            }
        }

        setPinModalOpen(false);
        setPendingCheckout(null);

        try {
            const isMulti = Array.isArray(toolId);
            const res = await fetch(isMulti ? '/api/loans/checkout-multi' : '/api/loans/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isMulti
                    ? { user_id: userId, tool_ids: toolId, custom_hours: customHours }
                    : { user_id: userId, tool_id: toolId, custom_hours: customHours })
            });
            const data = await res.json();
            if (!res.ok) {
                window.rfidAudio.playError();
                showToast(data.error || "Error al realizar préstamo", "error");
                return false;
            }

            const nombres = isMulti ? data.loans.map(l => l.tool.nombre).join(' y ') : data.tool.nombre;
            const limite = isMulti ? data.fecha_limite : data.fecha_limite;
            const horas = isMulti ? data.loans[0].tiempo_horas : data.tiempo_horas;
            const dias = Math.round(horas / 24 * 10) / 10;

            window.rfidAudio.playSuccess();
            setSelectedToolToCheckout(null);
            showToast(`¡Préstamo registrado! Devuelve antes de: ${limite}`, "success");
            setGamificationModal({
                type: 'checkout',
                title: "¡Préstamo Registrado!",
                message: `Has retirado: ${nombres}`,
                subtext: `Fecha límite de devolución: ${limite} (${dias} ${dias === 1 ? 'día' : 'días'})`,
                bonus: "Devuelve a tiempo y en buen estado para sumar puntos",
                color: "text-blue-700"
            });
            refreshAllData();
            return true;
        } catch (err) {
            showToast("Error de conexión", "error");
            return false;
        }
    };

    // Al devolver, primero se pregunta en qué estado regresa la herramienta
    const handleCheckin = (loanId, simulateLateHours = null) => {
        setReturnModal({ loanId, simulateLateHours });
    };

    const doCheckin = async (loanId, simulateLateHours = null, condicion = 'bien', notas = '') => {
        try {
            const res = await fetch('/api/loans/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loan_id: loanId, simulate_late_hours: simulateLateHours, condicion, notas })
            });
            const data = await res.json();
            if (!res.ok) {
                window.rfidAudio.playError();
                showToast(data.error || "Error al devolver", "error");
                return;
            }

            const isOntime = data.estado === 'devuelto_a_tiempo';
            if (isOntime) {
                window.rfidAudio.playSuccess();
            } else {
                window.rfidAudio.playWarning();
            }

            setGamificationModal({
                type: 'checkin',
                title: isOntime ? "¡Devolución a Tiempo!" : "¡Devolución con Retraso!",
                toolName: data.tool_nombre,
                puntosDelta: data.puntos_delta,
                nuevoSaldo: data.nuevo_saldo,
                horasRetraso: data.horas_retraso,
                motivo: data.motivo,
                isOntime: isOntime
            });

            refreshAllData();
        } catch (err) {
            showToast("Error al procesar devolución", "error");
        }
    };

    // Solicitudes de Préstamo (Workflow Operario -> Admin)
    const handleSendLoanRequest = async (toolIds, motivo) => {
        if (!currentUser) return false;
        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    tool_ids: toolIds,
                    motivo: motivo || ""
                })
            });
            const data = await res.json();
            if (res.ok) {
                window.rfidAudio.playSuccess();
                showToast(toolIds.length > 1 ? "¡Solicitud de " + toolIds.length + " herramientas enviada!" : "¡Solicitud enviada al Administrador!", "success");
                refreshAllData();
                return true;
            }
            window.rfidAudio.playError();
            showToast(data.error || "Error al enviar solicitud", "error");
            return false;
        } catch (e) {
            showToast("Error de comunicación", "error");
            return false;
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            const res = await fetch(`/api/requests/${requestId}/approve`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                window.rfidAudio.playSuccess();
                showToast("Solicitud aprobada. Entrega el material para que empiece el plazo.", "success");
                refreshAllData();
            } else {
                window.rfidAudio.playError();
                showToast(data.error || "Error al aprobar", "error");
            }
        } catch (e) {
            showToast("Error de comunicación", "error");
        }
    };

    const handleDeliverRequest = async (requestId) => {
        try {
            const res = await fetch(`/api/requests/${requestId}/deliver`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                window.rfidAudio.playSuccess();
                showToast("Material entregado. El plazo empezó a contar.", "success");
                refreshAllData();
            } else {
                window.rfidAudio.playError();
                showToast(data.error || "Error al entregar", "error");
            }
        } catch (e) {
            showToast("Error de comunicación", "error");
        }
    };

    const handleRejectRequest = async (requestId, motivo) => {
        try {
            const res = await fetch(`/api/requests/${requestId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motivo })
            });
            if (res.ok) {
                showToast("Solicitud rechazada", "info");
                refreshAllData();
            }
        } catch (e) {
            showToast("Error al rechazar", "error");
        }
    };

    // Ajuste Manual de Puntos (Admin)
    const submitAdjustPoints = async () => {
        if (!targetUserForPoints || !pointAdjustReason) {
            showToast("Debes ingresar el motivo del ajuste", "error");
            return;
        }
        try {
            const res = await fetch('/api/points/adjust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: targetUserForPoints.id,
                    delta: parseInt(pointAdjustAmount),
                    motivo: pointAdjustReason
                })
            });
            const data = await res.json();
            if (res.ok) {
                window.rfidAudio.playSuccess();
                showToast(`Puntos actualizados para ${targetUserForPoints.nombre}`, "success");
                setAdjustPointsModalOpen(false);
                setPointAdjustReason("");
                refreshAllData();
            } else {
                showToast(data.error || "Error al ajustar puntos", "error");
            }
        } catch (err) {
            showToast("Error al procesar", "error");
        }
    };

    // Reinicio del sistema
    const handleResetSeed = async () => {
        if (!confirm("¿Deseas reiniciar la base de datos a los datos de prueba oficiales?")) return;
        try {
            const res = await fetch('/api/seed/reset', { method: 'POST' });
            if (res.ok) {
                window.rfidAudio.playSuccess();
                showToast("Base de datos reiniciada con éxito", "success");
                setCurrentUser(null);
                setKioskUser(null);
                refreshAllData();
            }
        } catch (e) {}
    };

    // Cierre de Sesión
    const handleLogout = () => {
        try {
            localStorage.removeItem('tooltag_user');
            localStorage.removeItem('tooltag_admin_tab');
            localStorage.removeItem('tooltag_user_tab');
        } catch (e) {}
        setCurrentUser(null);
        setKioskUser(null);
        showToast("Sesión cerrada", "info");
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
            {/* PANTALLA INICIAL: SELECCIÓN DE ROL (SI NO HAY SESIÓN INICIADA) */}
            {!currentUser && (
                <RoleLandingView
                    onOpenLogin={(role) => setAuthModal(role === 'admin' ? 'admin_login' : 'user_login')}
                    onOpenRegister={(role) => setAuthModal(role === 'admin' ? 'admin_register' : 'user_register')}
                    onQuickLogin={async (email, password) => {
                        try {
                            const res = await fetch('/api/auth/login', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ identifier: email, password })
                            });
                            const data = await res.json();
                            if (res.ok && data.success) {
                                window.rfidAudio.playSuccess();
                                setCurrentUser(data.user);
                                showToast(`Bienvenido ${data.user.nombre}`, "success");
                            }
                        } catch (e) {}
                    }}
                    onOpenKioskDirectly={() => {
                        // Acceso al Kiosco sin login fijo
                        setCurrentUser({ id: 0, nombre: "Operador de Kiosco", rol: "kiosk_standalone" });
                    }}
                    onToggleSimulator={() => setSimulatorOpen(!simulatorOpen)}
                    simulatorOpen={simulatorOpen}
                    onResetSeed={handleResetSeed}
                />
            )}

            {/* VISTA PARA USUARIO / OPERARIO (ROL = 'USER') */}
            {currentUser && currentUser.rol === 'user' && (
                <UserPortalView
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    userTab={userTab}
                    setUserTab={setUserTab}
                    tools={tools}
                    activeLoans={loans.filter(l => l.user_id === currentUser.id && l.estado === 'activo')}
                    myRequests={loanRequests.filter(r => r.user_id === currentUser.id)}
                    transactions={transactions.filter(t => t.user_id === currentUser.id)}
                    leaderboard={leaderboard}
                    onSendRequest={handleSendLoanRequest}
                    onToggleSimulator={() => setSimulatorOpen(!simulatorOpen)}
                    simulatorOpen={simulatorOpen}
                />
            )}

            {/* VISTA PARA ADMINISTRADOR (ROL = 'ADMIN') */}
            {currentUser && currentUser.rol === 'admin' && (
                <div className="flex flex-col min-h-screen">
                    {/* Header Admin */}
                    <header className="border-b border-slate-200 bg-slate-50/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img 
                                    src="/static/logo_yecapixtla.png?v=20261120_v19" 
                                    alt="EES Yecapixtla" 
                                    className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-slate-300 shadow-md"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-bold text-base sm:text-lg tracking-tight text-slate-900">EES Yecapixtla</h1>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300">
                                            Admin &bull; UAEM
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 hidden sm:block">Sesión: {currentUser.nombre} ({currentUser.email})</p>
                                </div>
                            </div>

                            {/* Navegación Admin */}
                            <nav className="flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
                                <button
                                    onClick={() => setAdminTab('requests')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'requests' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <IconClipboard className="w-3.5 h-3.5" />
                                    <span>Solicitudes</span>
                                    {loanRequests.filter(r => r.estado === 'pendiente').length > 0 && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                                            {loanRequests.filter(r => r.estado === 'pendiente').length}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setAdminTab('loans')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'loans' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <IconClock className="w-3.5 h-3.5" />
                                    <span>Herramientas Prestadas ({loans.filter(l => l.estado === 'activo').length})</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('history')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'history' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <IconClipboard className="w-3.5 h-3.5" />
                                    <span>Historial</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('inventory')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'inventory' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <IconWrench className="w-3.5 h-3.5" />
                                    <span>Editar Catálogo ({tools.length})</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('users')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'users' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <IconUser className="w-3.5 h-3.5" />
                                    <span>Usuarios & Puntajes ({users.length})</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('settings')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'settings' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <IconSliders className="w-3.5 h-3.5" />
                                    <span>Reglas</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('kiosk')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'kiosk' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <IconRadio className="w-3.5 h-3.5" />
                                    <span>Kiosco RFID</span>
                                </button>
                            </nav>

                            {/* Controles de Utilidad */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSimulatorOpen(!simulatorOpen)}
                                    className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                        simulatorOpen ? 'bg-blue-600 text-white border-slate-300 shadow-md ' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-100'
                                    }`}
                                    title="Alternar Simulador RFID"
                                >
                                    <IconRadio className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => setAdminProfileOpen(true)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 text-slate-700 border border-slate-300"
                                    title="Editar Perfil de Administrador"
                                >
                                    <IconUser className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all"
                                    title="Cerrar Sesión"
                                >
                                    <IconLogOut className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Salir</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Contenido Admin */}
                    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28">
                        <AdminDashboard
                            adminTab={adminTab}
                            setAdminTab={setAdminTab}
                            stats={stats}
                            tools={tools}
                            users={users}
                            loans={loans}
                            loanRequests={loanRequests}
                            settings={settings}
                            onApproveRequest={handleApproveRequest}
                            onDeliverRequest={handleDeliverRequest}
                            onRejectRequest={handleRejectRequest}
                            onCheckin={handleCheckin}
                            onOpenAdjustPoints={(u) => {
                                setTargetUserForPoints(u);
                                setAdjustPointsModalOpen(true);
                            }}
                            onSaveSettings={async (newSettings) => {
                                await fetch('/api/settings', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(newSettings)
                                });
                                showToast("Reglas de gamificación guardadas", "success");
                                refreshAllData();
                            }}
                            onDeleteTool={async (id) => {
                                if (confirm("¿Eliminar esta herramienta permanentemente?")) {
                                    await fetch(`/api/tools/${id}`, { method: 'DELETE' });
                                    showToast("Herramienta eliminada", "info");
                                    refreshAllData();
                                }
                            }}
                            onDeleteUser={async (id) => {
                                if (confirm("¿Eliminar este usuario?")) {
                                    await fetch(`/api/users/${id}`, { method: 'DELETE' });
                                    showToast("Usuario eliminado", "info");
                                    refreshAllData();
                                }
                            }}
                            onEditTool={(t) => { setEditingTool(t); setToolModalOpen(true); }}
                            onNewTool={() => { setEditingTool(null); setToolModalOpen(true); }}
                            onEditUser={(u) => { setEditingUser(u); setUserModalOpen(true); }}
                            onNewUser={() => { setEditingUser(null); setUserModalOpen(true); }}
                            // Props de Kiosco integrado
                            kioskUser={kioskUser}
                            setKioskUser={setKioskUser}
                            kioskTab={kioskTab}
                            setKioskTab={setKioskTab}
                            kioskTimeout={kioskTimeout}
                            onCheckout={handleCheckout}
                            onScanSimulated={processRfidScan}
                            selectedToolToCheckout={selectedToolToCheckout}
                            setSelectedToolToCheckout={setSelectedToolToCheckout}
                        />
                    </main>
                </div>
            )}

            {/* VISTA KIOSCO STANDALONE (SI SE ACCEDIÓ SIN SESIÓN FIJA) */}
            {currentUser && currentUser.rol === 'kiosk_standalone' && (
                <div className="flex flex-col min-h-screen">
                    <header className="border-b border-slate-200 bg-white/90 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <IconRadio className="w-6 h-6 text-blue-700" />
                            <h2 className="font-bold text-slate-900 text-base">Estación Kiosco RFID Independiente</h2>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all"
                        >
                            Volver al Portal Principal
                        </button>
                    </header>
                    <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
                        <KioskView
                            kioskUser={kioskUser}
                            setKioskUser={setKioskUser}
                            kioskTab={kioskTab}
                            setKioskTab={setKioskTab}
                            kioskTimeout={kioskTimeout}
                            setKioskTimeout={setKioskTimeout}
                            tools={tools}
                            loans={loans}
                            onCheckout={handleCheckout}
                            onCheckin={handleCheckin}
                            onScanSimulated={processRfidScan}
                            users={users}
                            selectedToolToCheckout={selectedToolToCheckout}
                            setSelectedToolToCheckout={setSelectedToolToCheckout}
                        />
                    </main>
                </div>
            )}

            {/* MODAL DE INICIO DE SESIÓN */}
            {(authModal === 'user_login' || authModal === 'admin_login') && (
                <LoginAuthModal
                    targetRole={authModal === 'admin_login' ? 'admin' : 'user'}
                    onClose={() => setAuthModal(null)}
                    onSuccess={(user) => {
                        window.rfidAudio.playSuccess();
                        setCurrentUser(user);
                        setAuthModal(null);
                        showToast(`Bienvenido ${user.nombre}`, "success");
                    }}
                    onSwitchToRegister={authModal === 'admin_login' ? null : () => setAuthModal('user_register')}
                />
            )}

            {/* MODAL DE REGISTRO DE USUARIO / OPERARIO */}
            {authModal === 'user_register' && (
                <UserRegisterModal
                    onClose={() => setAuthModal(null)}
                    onSuccess={(user) => {
                        window.rfidAudio.playSuccess();
                        setCurrentUser(user);
                        setAuthModal(null);
                        showToast(`Registro completo. ¡Bienvenido ${user.nombre}!`, "success");
                        refreshAllData();
                    }}
                    onSwitchToLogin={() => setAuthModal('user_login')}
                />
            )}

            {/* WIDGET FLOTANTE DEL SIMULADOR RFID */}
            <RFIDSimulatorDrawer
                isOpen={simulatorOpen}
                onClose={() => setSimulatorOpen(false)}
                onScan={processRfidScan}
                users={users}
                tools={tools}
                customInput={customTagInput}
                setCustomInput={setCustomTagInput}
                lastTag={lastScannedTag}
                activeKioskUser={kioskUser}
            />

            {/* MODAL: ESTADO DE LA HERRAMIENTA AL DEVOLVER */}
            {returnModal && (
                <ReturnConditionModal
                    onCancel={() => setReturnModal(null)}
                    onConfirm={(condicion, notas) => {
                        const m = returnModal;
                        setReturnModal(null);
                        doCheckin(m.loanId, m.simulateLateHours, condicion, notas);
                    }}
                />
            )}

            {/* MODAL DE RESULTADO DE GAMIFICACIÓN */}
            {gamificationModal && (
                <GamificationModal
                    data={gamificationModal}
                    onClose={() => setGamificationModal(null)}
                />
            )}

            {/* MODAL DE PIN DE SEGURIDAD PARA PRÉSTAMO */}
            {pinModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 max-w-sm w-full shadow-lg text-center space-y-4">
                        <div className="flex justify-center mb-1">
                            <img src="/static/logo_yecapixtla.png?v=20261120_v19" alt="EES Yecapixtla UAEM" className="w-14 h-14 rounded-lg object-contain bg-white p-1 border-2 border-slate-300 shadow-md" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Verificación de Seguridad</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Ingresa tu PIN personal de 4 dígitos para autorizar el préstamo.
                            </p>
                        </div>

                        {pendingCheckout?.tool && (
                            <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                Herramienta: <strong className="text-slate-900">{pendingCheckout.tool.nombre}</strong>
                            </div>
                        )}

                        <div>
                            <input
                                type="password"
                                maxLength="8"
                                autoFocus
                                value={pinInput}
                                onChange={(e) => { setPinInput(e.target.value); setPinError(""); }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && pinInput.length >= 4 && pendingCheckout) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleCheckout(pendingCheckout.userId, pendingCheckout.toolId, pendingCheckout.customHours, pinInput);
                                    }
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl font-mono text-slate-900 tracking-[0.5em] focus:border-blue-300 focus:outline-none"
                                placeholder="• • • •"
                            />
                            {pinError && (
                                <p className="text-xs text-rose-700 font-bold mt-2 flex items-center justify-center gap-1">
                                    <IconXCircle className="w-3.5 h-3.5" /> {pinError}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => { setPinModalOpen(false); setPendingCheckout(null); setPinInput(""); }}
                                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (pendingCheckout && pinInput.length >= 4) {
                                        handleCheckout(pendingCheckout.userId, pendingCheckout.toolId, pendingCheckout.customHours, pinInput);
                                    } else {
                                        setPinError("El PIN debe tener al menos 4 dígitos");
                                    }
                                }}
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            >
                                Verificar y Prestar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE EDICIÓN DE PERFIL DE ADMIN */}
            {adminProfileOpen && (
                <AdminProfileModal
                    users={users}
                    onClose={() => setAdminProfileOpen(false)}
                    onSave={async () => {
                        showToast("Perfil actualizado correctamente", "success");
                        setAdminProfileOpen(false);
                        refreshAllData();
                    }}
                    showToast={showToast}
                />
            )}

            {/* MODAL DE AJUSTE MANUAL DE PUNTOS */}
            {adjustPointsModalOpen && targetUserForPoints && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/static/logo_yecapixtla.png?v=20261120_v19" alt="EES Yecapixtla UAEM" className="w-12 h-12 rounded-lg object-contain bg-white p-1 border-2 border-slate-300 shadow-md" />
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Ajuste Manual de Puntos</h3>
                                <p className="text-xs text-slate-500">Usuario: {targetUserForPoints.nombre} (Saldo: {targetUserForPoints.puntos} pts)</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Variación (+ para bono, - para penalización)
                                </label>
                                <input
                                    type="number"
                                    value={pointAdjustAmount}
                                    onChange={(e) => setPointAdjustAmount(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-base focus:border-blue-300 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Motivo Obligatorio (Auditoría del Ledger)
                                </label>
                                <textarea
                                    value={pointAdjustReason}
                                    onChange={(e) => setPointAdjustReason(e.target.value)}
                                    rows="3"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-blue-300 focus:outline-none"
                                    placeholder="Ej: Reconocimiento por excelencia en el cuidado de herramienta"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setAdjustPointsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={submitAdjustPoints}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                                >
                                    Aplicar al Ledger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CREAR/EDITAR HERRAMIENTA */}
            {toolModalOpen && (
                <ToolFormModal
                    tool={editingTool}
                    onClose={() => setToolModalOpen(false)}
                    onSave={async (formData) => {
                        const url = editingTool ? `/api/tools/${editingTool.id}` : '/api/tools';
                        const method = editingTool ? 'PUT' : 'POST';
                        const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                        if (res.ok) {
                            showToast("Herramienta guardada con éxito", "success");
                            setToolModalOpen(false);
                            refreshAllData();
                        } else {
                            const err = await res.json();
                            showToast(err.error || "Error al guardar", "error");
                        }
                    }}
                />
            )}

            {/* MODAL CREAR/EDITAR USUARIO */}
            {userModalOpen && (
                <UserFormModal
                    user={editingUser}
                    onClose={() => setUserModalOpen(false)}
                    onSave={async (formData) => {
                        const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
                        const method = editingUser ? 'PUT' : 'POST';
                        const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                        if (res.ok) {
                            showToast("Usuario guardado con éxito", "success");
                            setUserModalOpen(false);
                            refreshAllData();
                        } else {
                            const err = await res.json();
                            showToast(err.error || "Error al guardar usuario", "error");
                        }
                    }}
                />
            )}

            {/* TOAST DE NOTIFICACIONES */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all transform  ${
                    toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                    toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                    'bg-white border-slate-300 text-slate-800'
                }`}>
                    {toast.type === 'success' && <IconCheckCircle className="w-5 h-5 text-emerald-700" />}
                    {toast.type === 'error' && <IconXCircle className="w-5 h-5 text-rose-700" />}
                    {toast.type === 'warning' && <IconAlertTriangle className="w-5 h-5 text-amber-700" />}
                    {toast.type === 'info' && <IconRadio className="w-5 h-5 text-blue-700" />}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}
        </div>
    );
}

// ==========================================
// VISTA: PANTALLA INICIAL DE SELECCIÓN DE ROL
// ==========================================
function RoleLandingView({ onOpenLogin, onOpenRegister, onQuickLogin, onOpenKioskDirectly, onToggleSimulator, simulatorOpen, onResetSeed }) {
    return (
        <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-slate-50 relative overflow-hidden">
            {/* Luces y resplandores morados institucionales */}
            {/* Barra superior institucional */}
            <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <img 
                        src="/static/logo_yecapixtla.png?v=20261120_v20" 
                        alt="Logo EES Yecapixtla UAEM" 
                        className="w-12 h-12 object-contain"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
                                EES Yecapixtla &bull; UAEM
                            </h1>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300">
                                RFID Tools
                            </span>
                        </div>
                        <p className="text-xs text-slate-600">Escuela de Estudios Superiores de Yecapixtla</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleSimulator}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            simulatorOpen ? 'bg-blue-600 text-white border-slate-300 shadow-md ' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Simulador de Lecturas RFID"
                    >
                        <IconRadio className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Simulador RFID</span>
                    </button>

                </div>
            </div>

            {/* Contenido Central: ¿Eres Administrador o Usuario? */}
            <div className="max-w-4xl w-full mx-auto py-8 sm:py-12 space-y-8 text-center">
                {/* Gran Escudo de Venado Yecapixtla libre sin cuadro */}
                <div className="flex justify-center mb-2">
                    <img 
                        src="/static/logo_yecapixtla.png?v=20261120_v20" 
                        alt="Logo Escuela de Estudios Superiores de Yecapixtla" 
                        className="w-36 h-36 sm:w-48 sm:h-48 object-contain transition-transform duration-300 hover:scale-105"
                    />
                </div>

                <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-300 px-3.5 py-1 rounded-full inline-block">
                        Escuela de Estudios Superiores de Yecapixtla &bull; UAEM
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                        Sistema de Préstamo de Herramientas
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                        Control con tags RFID/NFC y sistema de gamificación por puntualidad para talleres y laboratorios.
                    </p>
                </div>

                {/* Las Dos Grandes Tarjetas de Elección (Morado con Negro) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* TARJETA 1: USUARIO / ALUMNO */}
                    <div className="bg-white/95 border-2 border-slate-200 hover:border-slate-300 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg transition-all group">
                        <div className="space-y-4">
                            <div className="w-14 h-14 rounded-lg bg-blue-50 border border-slate-300 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform shadow-inner">
                                <IconUser className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Soy Usuario / Alumno</h3>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    Consulta existencias de equipo, manda solicitudes de préstamo para tus prácticas, revisa tus puntos de gamificación y cuándo debes regresar tus herramientas.
                                </p>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-700 pt-2">
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                                    <span>Catálogo de herramientas disponibles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                                    <span>Mandar solicitud de préstamo para talleres</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>Saldo de puntos acumulados por puntualidad</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-200">
                            <button
                                onClick={() => onOpenLogin('user')}
                                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                <IconLock className="w-4 h-4" />
                                <span>Iniciar Sesión como Usuario</span>
                            </button>

                            <button
                                onClick={() => onOpenRegister('user')}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                            >
                                <IconPlus className="w-3.5 h-3.5" />
                                <span>Registrarme como alumno</span>
                            </button>
                        </div>
                    </div>

                    {/* TARJETA 2: ADMINISTRADOR / ENCARGADO DE TALLER */}
                    <div className="bg-white/95 border-2 border-slate-200 hover:border-slate-300 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg transition-all group">
                        <div className="space-y-4">
                            <div className="w-14 h-14 rounded-lg bg-blue-50 border border-slate-300 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform shadow-inner">
                                <IconShield className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Soy Administrador</h3>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    Supervisa el inventario total del laboratorio, aprueba o rechaza solicitudes de préstamo, controla los tags RFID físicos y revisa los préstamos activos.
                                </p>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-700 pt-2">
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>Aprobar o rechazar solicitudes de alumnos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>Control de entregas y fechas límite exactas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>Edición de catálogo y vinculación de tags RFID</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-200">
                            <button
                                onClick={() => onOpenLogin('admin')}
                                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                <IconShield className="w-4 h-4" />
                                <span>Iniciar Sesión como Administrador</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Opción para usar la Estación Kiosco RFID directamente */}
                <div className="pt-4">
                    <button
                        onClick={onOpenKioskDirectly}
                        className="text-xs text-slate-600 hover:text-slate-900 underline flex items-center justify-center gap-1.5 mx-auto font-medium transition-colors"
                    >
                        <IconRadio className="w-4 h-4 text-slate-600" />
                        <span>Abrir Modo Kiosco para escanear con Lector RFID físico en el mostrador</span>
                    </button>
                </div>
            </div>

            {/* Footer Institucional */}
            <div className="max-w-6xl w-full mx-auto pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
                Escuela de Estudios Superiores de Yecapixtla &bull; Universidad Autónoma del Estado de Morelos (UAEM)
            </div>
        </div>
    );
}

// ==========================================
// VISTA: PORTAL RESTRINGIDO DEL OPERARIO (USUARIO)
// ==========================================
function UserPortalView({ currentUser, onLogout, userTab, setUserTab, tools, activeLoans, myRequests, transactions, leaderboard, onSendRequest, onToggleSimulator, simulatorOpen }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [cart, setCart] = useState([]);
    const [requestOpen, setRequestOpen] = useState(false);
    const [portalSettings, setPortalSettings] = useState({});
    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(setPortalSettings).catch(() => {});
    }, []);
    const maxTools = parseInt(portalSettings.max_tools_per_request || 2, 10);
    const loanDays = currentUser.dias_prestamo || parseInt(portalSettings.loan_days_default || 1, 10);
    const pendingCount = (myRequests || []).filter(r => r.estado === 'pendiente').length;
    const slotsLeft = Math.max(0, maxTools - (activeLoans || []).length - pendingCount);
    // Si una herramienta deja de estar disponible, sale de la selección
    useEffect(() => {
        setCart(prev => prev.filter(c => tools.find(t => t.id === c.id && t.estado === 'disponible')));
    }, [tools]);
    const toggleCart = (tool) => {
        setCart(prev => {
            if (prev.find(c => c.id === tool.id)) return prev.filter(c => c.id !== tool.id);
            if (prev.length >= slotsLeft) return prev;
            return [...prev, tool];
        });
    };

    const categories = useMemo(() => {
        const set = new Set(tools.map(t => t.categoria));
        return ["Todas", ...Array.from(set)];
    }, [tools]);

    const filteredTools = useMemo(() => {
        return tools.filter(t => {
            const matchesCat = selectedCategory === "Todas" || t.categoria === selectedCategory;
            const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  t.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [tools, selectedCategory, searchTerm]);

    const isBlocked = currentUser.puntos < 20 || currentUser.estado === 'bloqueado';

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header del Operario */}
            <header className="border-b border-slate-200 bg-slate-50/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261120_v19" 
                            alt="EES Yecapixtla" 
                            className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-slate-300 shadow-md"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-base text-slate-900">{currentUser.nombre}</h2>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                    currentUser.puntos >= 130 ? 'bg-blue-50 text-slate-600 border-slate-300' :
                                    currentUser.puntos >= 110 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    currentUser.puntos >= 90 ? 'bg-slate-100 text-slate-700 border-slate-300' :
                                    'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                    🏆 {currentUser.puntos} Pts
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 hidden sm:block">{currentUser.email} &bull; EES Yecapixtla UAEM</p>
                        </div>
                    </div>

                    {/* Navegación Restringida del Usuario */}
                    <nav className="flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-200 overflow-x-auto">
                        <button
                            onClick={() => setUserTab('catalog')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'catalog' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <IconWrench className="w-3.5 h-3.5" />
                            <span>Catálogo de Herramientas</span>
                        </button>

                        <button
                            onClick={() => setUserTab('my_loans')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'my_loans' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <IconClock className="w-3.5 h-3.5" />
                            <span>Mis Préstamos ({activeLoans.length})</span>
                            {myRequests.filter(r => r.estado === 'pendiente').length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                                    {myRequests.filter(r => r.estado === 'pendiente').length} pend.
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setUserTab('profile')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'profile' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <IconUser className="w-3.5 h-3.5" />
                            <span>Mi Perfil & Puntos</span>
                        </button>

                        <button
                            onClick={() => setUserTab('leaderboard')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'leaderboard' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <IconTrophy className="w-3.5 h-3.5 text-amber-700" />
                            <span>Leaderboard</span>
                        </button>
                    </nav>

                    {/* Botón Salir */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleSimulator}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                simulatorOpen ? 'bg-blue-600 text-white border-slate-300 shadow-md ' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                            title="Simulador RFID"
                        >
                            <IconRadio className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all"
                            title="Cerrar Sesión"
                        >
                            <IconLogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido Principal del Operario */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28">
                {/* Banner de Bloqueo por Puntos Insuficientes si aplica */}
                {isBlocked && (
                    <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-rose-800 shadow-md">
                        <IconAlertTriangle className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                            <strong className="text-sm font-bold text-rose-700 block">
                                ATENCIÓN: SOLICITUDES DE PRÉSTAMO BLOQUEADAS (Tienes {currentUser.puntos} de 20 pts mínimos requeridos)
                            </strong>
                            <p>
                                Tu saldo de puntos se encuentra por debajo del umbral de seguridad debido a penalizaciones de retrasos acumulados. No puedes solicitar nuevas herramientas hasta devolver tus herramientas activas o acudir a supervisión con el Administrador.
                            </p>
                        </div>
                    </div>
                )}

                {/* PESTAÑA 1: CATÁLOGO DE HERRAMIENTAS DISPONIBLES */}
                {userTab === 'catalog' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Catálogo de Herramientas del Taller</h3>
                                <p className="text-xs text-slate-500">Elige hasta {maxTools} herramientas y mándalas en una sola solicitud. Puedes pedir {slotsLeft} más ahora.</p>
                            </div>

                            {/* Buscador y Categorías */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <div className="relative">
                                    <IconSearch className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Buscar herramienta..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-300 w-full sm:w-56"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-300"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Grid de Herramientas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTools.map(tool => {
                                const isAvailable = tool.estado === 'disponible';
                                return (
                                    <div
                                        key={tool.id}
                                        className={`bg-white border rounded-lg p-4 flex flex-col justify-between transition-all ${
                                            isAvailable
                                                ? 'border-slate-200 hover:border-blue-300 shadow-sm '
                                                : 'border-slate-200 opacity-70 bg-slate-50/40'
                                        }`}
                                    >
                                        <div className="space-y-3">
                                            <div className="relative h-40 rounded-xl overflow-hidden bg-slate-50">
                                                <img
                                                    src={tool.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300"}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow ${
                                                        tool.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        tool.estado === 'prestada' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                        {tool.estado}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-blue-700 border border-slate-300">
                                                    {tool.codigo_inventario}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{tool.categoria}</span>
                                                <h4 className="font-bold text-sm text-slate-900 line-clamp-1 mt-0.5">{tool.nombre}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{tool.descripcion}</p>
                                            </div>

                                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <IconClock className="w-3.5 h-3.5 text-blue-700" />
                                                    <span>Plazo: {loanDays} {loanDays === 1 ? 'día' : 'días'}</span>
                                                </span>
                                                <span className="text-[11px] text-slate-500">
                                                    {tool.ubicacion}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2">
                                            {isAvailable ? (
                                                <button
                                                    onClick={() => toggleCart(tool)}
                                                    disabled={isBlocked || (!cart.find(c => c.id === tool.id) && cart.length >= slotsLeft)}
                                                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                                                        cart.find(c => c.id === tool.id)
                                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white '
                                                            : 'bg-blue-600 hover:bg-blue-700 text-white '
                                                    }`}
                                                >
                                                    <IconClipboard className="w-4 h-4" />
                                                    <span>{cart.find(c => c.id === tool.id) ? '✓ En mi solicitud (quitar)' : 'Agregar a mi solicitud'}</span>
                                                </button>
                                            ) : (
                                                <div className="text-center py-2 px-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-medium border border-slate-200">
                                                    {tool.estado === 'prestada' ? 'Actualmente en Préstamo' : 'En Mantenimiento Preventivo'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {userTab === 'catalog' && cart.length > 0 && (
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl bg-white border border-slate-300 rounded-lg p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-700">
                            <strong className="text-slate-900">{cart.length} de {slotsLeft}</strong> seleccionadas: {cart.map(c => c.nombre).join(' · ')}
                        </div>
                        <button onClick={() => setRequestOpen(true)} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md whitespace-nowrap">
                            Enviar solicitud
                        </button>
                    </div>
                )}

                {requestOpen && cart.length > 0 && (
                    <RequestCartModal
                        tools={cart}
                        loanDays={loanDays}
                        onClose={() => setRequestOpen(false)}
                        onRemove={(id) => setCart(prev => prev.filter(c => c.id !== id))}
                        onSubmit={async (motivo) => {
                            const ok = await onSendRequest(cart.map(c => c.id), motivo);
                            if (ok) { setCart([]); setRequestOpen(false); }
                        }}
                    />
                )}

                {/* PESTAÑA 2: MIS PRÉSTAMOS & SOLICITUDES */}
                {userTab === 'my_loans' && (
                    <div className="space-y-8">
                        {/* 1. Herramientas que tiene actualmente en su poder */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <IconWrench className="w-5 h-5 text-blue-700" />
                                    <span>Herramientas en tu Poder ({activeLoans.length})</span>
                                </h3>
                                <span className="text-xs text-slate-500">Revisa la fecha límite de devolución para no perder puntos.</span>
                            </div>

                            {activeLoans.length === 0 ? (
                                <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                                    No tienes ninguna herramienta prestada en este momento.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeLoans.map(loan => {
                                        const isOverdue = loan.vencido === 1;
                                        return (
                                            <div
                                                key={loan.id}
                                                className={`p-5 rounded-lg border flex flex-col justify-between space-y-4 ${
                                                    isOverdue
                                                        ? 'bg-rose-50 border-rose-300'
                                                        : 'bg-white border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <span className="font-mono text-xs text-blue-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                                            {loan.codigo_inventario}
                                                        </span>
                                                        <h4 className="font-bold text-base text-slate-900 mt-1.5">{loan.tool_nombre}</h4>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                                        isOverdue
                                                            ? 'bg-rose-50 text-rose-700 border-rose-200 '
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    }`}>
                                                        {isOverdue ? '¡VENCIDO!' : 'EN PLAZO'}
                                                    </span>
                                                </div>

                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                                                    <div className="flex justify-between text-slate-500">
                                                        <span>Fecha de salida:</span>
                                                        <span className="font-mono text-slate-700">{loan.fecha_prestamo}</span>
                                                    </div>
                                                    <div className="flex justify-between text-slate-500">
                                                        <span>Fecha límite de entrega:</span>
                                                        <span className={`font-mono font-bold ${isOverdue ? 'text-rose-700' : 'text-slate-800'}`}>
                                                            {loan.fecha_limite}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-[11px] text-slate-500 italic">
                                                    {isOverdue
                                                        ? "⚠️ Entrega lo antes posible en el mostrador o Kiosco para detener penalizaciones."
                                                        : "¡Entrégala a tiempo para sumar +10 puntos a tu ranking!"}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* 2. Solicitudes de Préstamo enviadas */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <IconClipboard className="w-5 h-5 text-blue-700" />
                                <span>Historial de Solicitudes Enviadas ({myRequests.length})</span>
                            </h3>

                            {myRequests.length === 0 ? (
                                <div className="p-8 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                                    No has enviado solicitudes de préstamo recientemente.
                                </div>
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                                            <tr>
                                                <th className="py-3 px-4">Herramienta</th>
                                                <th className="py-3 px-4">Fecha Solicitud</th>
                                                <th className="py-3 px-4">Horas</th>
                                                <th className="py-3 px-4">Motivo de Uso</th>
                                                <th className="py-3 px-4 text-right">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {myRequests.map(r => (
                                                <tr key={r.id} className="hover:bg-slate-100">
                                                    <td className="py-3 px-4 font-semibold text-slate-900">{r.tool_nombre}</td>
                                                    <td className="py-3 px-4 font-mono text-slate-500">{r.fecha_solicitud}</td>
                                                    <td className="py-3 px-4 text-slate-700">{r.tiempo_horas}h</td>
                                                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">{r.motivo}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                            r.estado === 'pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200 ' :
                                                            r.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                            'bg-rose-50 text-rose-700 border border-rose-200'
                                                        }`}>
                                                            {r.estado === 'aprobada' ? (r.loan_id ? 'entregada' : 'aprobada · pasa por tu material') : r.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PESTAÑA 3: MI PERFIL & HISTORIAL DE PUNTOS (LEDGER) */}
                {userTab === 'profile' && (
                    <div className="space-y-6">
                        {/* Hero Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex items-center gap-5">
                                <img
                                    src={currentUser.avatar_url || "/static/logo_yecapixtla.png"}
                                    className="w-20 h-20 rounded-lg object-contain bg-white p-0.5 border-2 border-blue-200 shadow-sm"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-bold text-slate-900">{currentUser.nombre}</h3>
                                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-50 text-blue-700 border border-slate-200">
                                            {currentUser.tag_uid}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
                                    <div className="mt-3 flex gap-3 text-xs">
                                        <span className="text-slate-500">Rol: <strong className="text-slate-900 uppercase">Operario</strong></span>
                                        <span className="text-slate-500">Estado: <strong className="text-emerald-700 uppercase">{currentUser.estado}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Saldo de Puntos */}
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center min-w-[180px]">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Tus Puntos Actuales</span>
                                <span className="text-4xl font-bold text-blue-700 font-mono">{currentUser.puntos}</span>
                                <span className="text-[11px] text-slate-500 block mt-1">Saldo de Gamificación</span>
                            </div>
                        </div>

                        {/* Historial de Puntos (Ledger) */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                <IconTrophy className="w-4 h-4 text-amber-700" />
                                <span>Historial Contable de Puntos (Ledger de Auditoría)</span>
                            </h4>
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                                        <tr>
                                            <th className="py-3 px-4">Fecha</th>
                                            <th className="py-3 px-4">Variación</th>
                                            <th className="py-3 px-4">Motivo / Evento</th>
                                            <th className="py-3 px-4 text-right">Saldo Resultante</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {transactions.map(tx => (
                                            <tr key={tx.id} className="hover:bg-slate-100">
                                                <td className="py-3 px-4 font-mono text-slate-500">{tx.fecha}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                                        tx.cantidad > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                        'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}>
                                                        {tx.cantidad > 0 ? `+${tx.cantidad}` : tx.cantidad} pts
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-800">{tx.motivo}</td>
                                                <td className="py-3 px-4 font-mono font-bold text-right text-slate-700">
                                                    {tx.saldo_resultante} pts
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* PESTAÑA 4: LEADERBOARD GENERAL */}
                {userTab === 'leaderboard' && (
                    <LeaderboardView leaderboard={leaderboard} />
                )}
            </main>
        </div>
    );
}

// ==========================================
// VISTA: PANEL COMPLETO DE ADMINISTRADOR
// ==========================================
function AdminDashboard({
    adminTab, setAdminTab,
    stats, tools, users, loans, loanRequests, settings,
    onApproveRequest, onDeliverRequest, onRejectRequest, onCheckin,
    onOpenAdjustPoints, onSaveSettings, onDeleteTool, onDeleteUser,
    onEditTool, onNewTool, onEditUser, onNewUser,
    // Kiosco
    kioskUser, setKioskUser, kioskTab, setKioskTab, kioskTimeout,
    onCheckout, onScanSimulated, selectedToolToCheckout, setSelectedToolToCheckout
}) {
    const [localSettings, setLocalSettings] = useState(settings);
    useEffect(() => setLocalSettings(settings), [settings]);

    const pendingRequests = loanRequests.filter(r => r.estado === 'pendiente');
    // Aprobadas que aún no se han entregado (el plazo todavía no cuenta)
    const readyGroups = Object.values(
        loanRequests.filter(r => r.estado === 'aprobada' && !r.loan_id).reduce((acc, r) => {
            const k = r.grupo || ('s' + r.id);
            (acc[k] = acc[k] || []).push(r);
            return acc;
        }, {})
    );
    const resolvedRequests = loanRequests.filter(r => r.estado !== 'pendiente');
    const activeLoans = loans.filter(l => l.estado === 'activo');

    return (
        <div className="space-y-6">
            {/* KPI METRICS CARDS */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Solicitudes Pendientes</div>
                        <div className="text-2xl font-bold text-amber-700 mt-1">{stats.requests?.pendientes || 0}</div>
                        <div className="text-[11px] text-slate-500 mt-1">esperando tu aprobación</div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Préstamos Activos</div>
                        <div className="text-2xl font-bold text-blue-700 mt-1">{activeLoans.length}</div>
                        <div className="text-[11px] text-slate-500 mt-1">en poder de operarios</div>
                    </div>

                    <div className={`bg-white border rounded-lg p-4 shadow-sm ${stats.loans?.vencidos > 0 ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                            <span>Préstamos Vencidos</span>
                            {stats.loans?.vencidos > 0 && <span className="w-2 h-2 rounded-full bg-rose-600"></span>}
                        </div>
                        <div className={`text-2xl font-bold mt-1 ${stats.loans?.vencidos > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                            {stats.loans?.vencidos || 0}
                        </div>
                        <div className="text-[11px] text-rose-700 mt-1">con penalización activa</div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Herramientas Total</div>
                        <div className="text-2xl font-bold text-slate-900 mt-1">{tools.length}</div>
                        <div className="text-[11px] text-emerald-700 mt-1">{tools.filter(t => t.estado === 'disponible').length} disponibles</div>
                    </div>
                </div>
            )}

            {/* SECCIÓN 1: SOLICITUDES DE PRÉSTAMO (ACEPTAR / RECHAZAR) */}
            {adminTab === 'requests' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <IconClipboard className="w-5 h-5 text-blue-700" />
                                <span>Solicitudes de Préstamo Pendientes ({pendingRequests.length})</span>
                            </h3>
                            <p className="text-xs text-slate-500">Revisa la identidad del operario, sus puntos y autoriza la entrega del equipo.</p>
                        </div>
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="p-10 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500 space-y-2">
                            <IconCheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                            <h4 className="font-bold text-slate-800 text-sm">No hay solicitudes pendientes en este momento</h4>
                            <p className="text-slate-500">Todas las solicitudes de los operarios han sido atendidas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingRequests.map(req => {
                                const userAtRisk = req.user_puntos < 20;
                                return (
                                    <div key={req.id} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-md">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={req.user_avatar || "/static/logo_yecapixtla.png"}
                                                    className="w-12 h-12 rounded-xl object-contain bg-white p-0.5 border border-slate-300"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{req.user_nombre}</h4>
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                                        userAtRisk ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                        {req.user_puntos} pts {userAtRisk && "(Puntaje Bajo)"}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                                {req.fecha_solicitud}
                                            </span>
                                        </div>

                                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Herramienta solicitada:</span>
                                                <strong className="text-slate-900">{req.tool_nombre}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Código de inventario:</span>
                                                <span className="font-mono text-blue-700">{req.codigo_inventario}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Plazo de entrega:</span>
                                                <span className="font-bold text-slate-800">{Math.round(req.tiempo_horas / 24 * 10) / 10} {Math.round(req.tiempo_horas / 24 * 10) / 10 === 1 ? 'día' : 'días'}</span>
                                            </div>
                                            {req.grupo && (
                                                <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                                                    Pedido junto con {pendingRequests.filter(r => r.grupo === req.grupo).length - 1} herramienta(s) más: se aprueba o rechaza todo junto.
                                                </div>
                                            )}
                                            <div className="pt-2 border-t border-slate-200">
                                                <span className="text-slate-500 block text-[11px] mb-0.5">Motivo de uso:</span>
                                                <p className="text-slate-700 italic">{req.motivo}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onApproveRequest(req.id)}
                                                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <IconCheckCircle className="w-4 h-4" />
                                                <span>Aceptar solicitud</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const motivo = prompt("Motivo del rechazo (opcional):", "Herramienta reservada para mantenimiento");
                                                    if (motivo !== null) onRejectRequest(req.id, motivo);
                                                }}
                                                className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {readyGroups.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-200">
                            <h4 className="font-bold text-slate-900 text-sm">Listas para entregar ({readyGroups.length})</h4>
                            <p className="text-xs text-slate-500">Ya aprobadas. Cuando le des el material al alumno, pulsa Entregar: ahí empieza a contar su plazo.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {readyGroups.map(group => (
                                    <div key={group[0].id} className="bg-white border border-emerald-200 rounded-lg p-5 space-y-3 shadow-md">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{group[0].user_nombre}</h4>
                                            <span className="text-[10px] font-mono text-slate-500">{group[0].user_email}</span>
                                        </div>
                                        <ul className="text-xs text-slate-800 space-y-1 list-disc pl-4">
                                            {group.map(r => <li key={r.id}>{r.tool_nombre} <span className="font-mono text-blue-700 text-[10px]">{r.codigo_inventario}</span></li>)}
                                        </ul>
                                        <button
                                            onClick={() => onDeliverRequest(group[0].id)}
                                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                                        >
                                            Entregar material (inicia el plazo)
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Historial reciente de solicitudes resueltas */}
                    {resolvedRequests.length > 0 && (
                        <div className="pt-6 border-t border-slate-200 space-y-3">
                            <h4 className="font-bold text-slate-900 text-sm">Historial de Solicitudes Resueltas</h4>
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                                        <tr>
                                            <th className="py-3 px-4">Operario</th>
                                            <th className="py-3 px-4">Herramienta</th>
                                            <th className="py-3 px-4">Fecha Solicitud</th>
                                            <th className="py-3 px-4">Resolución</th>
                                            <th className="py-3 px-4 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {resolvedRequests.slice(0, 10).map(r => (
                                            <tr key={r.id} className="hover:bg-slate-100">
                                                <td className="py-3 px-4 font-semibold text-slate-900">{r.user_nombre}</td>
                                                <td className="py-3 px-4 text-slate-700">{r.tool_nombre}</td>
                                                <td className="py-3 px-4 font-mono text-slate-500">{r.fecha_solicitud}</td>
                                                <td className="py-3 px-4 text-slate-500">{r.respuesta_admin || r.fecha_resolucion || "Aprobada"}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        r.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                        'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}>
                                                        {r.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SECCIÓN 2: HERRAMIENTAS PRESTADAS & DEVOLUCIONES */}
            {adminTab === 'loans' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <IconClock className="w-5 h-5 text-blue-700" />
                            <span>Herramientas Prestadas y Fecha de Regreso ({activeLoans.length})</span>
                        </h3>
                        <p className="text-xs text-slate-500">Supervisa qué usuario tiene cada equipo y cuándo debe regresarlo.</p>
                    </div>

                    {activeLoans.length === 0 ? (
                        <div className="p-10 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                            No hay préstamos activos en este momento. Todas las herramientas están en inventario.
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                                    <tr>
                                        <th className="py-3 px-4">Operario Responsable</th>
                                        <th className="py-3 px-4">Puntaje</th>
                                        <th className="py-3 px-4">Herramienta</th>
                                        <th className="py-3 px-4">Fecha Salida</th>
                                        <th className="py-3 px-4">Fecha Prevista de Regreso</th>
                                        <th className="py-3 px-4">Estado Plazo</th>
                                        <th className="py-3 px-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {activeLoans.map(l => (
                                        <tr key={l.id} className="hover:bg-slate-100 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900">{l.user_nombre}</div>
                                                <div className="text-[10px] text-slate-500">{l.user_email}</div>
                                            </td>
                                            <td className="py-3 px-4 font-mono font-bold text-blue-700">{l.user_puntos} pts</td>
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-slate-800">{l.tool_nombre}</div>
                                                <span className="text-[10px] font-mono text-slate-500">{l.codigo_inventario}</span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-500">{l.fecha_prestamo}</td>
                                            <td className="py-3 px-4 font-mono font-bold">
                                                <span className={l.vencido === 1 ? 'text-rose-700' : 'text-slate-800'}>
                                                    {l.fecha_limite}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {l.vencido === 1 ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        ¡VENCIDO!
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        EN PLAZO
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => onCheckin(l.id)}
                                                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                                                >
                                                    Registrar Devolución
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {adminTab === 'history' && <HistoryView />}

            {/* SECCIÓN 3: INVENTARIO DE HERRAMIENTAS (CRUD) */}
            {adminTab === 'inventory' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Edición del Catálogo de Herramientas</h3>
                            <p className="text-xs text-slate-500">Agrega, edita, cambia existencias y define tiempos máximos de préstamo.</p>
                        </div>
                        <button
                            onClick={onNewTool}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                        >
                            <IconPlus className="w-4 h-4" />
                            <span>Agregar Nueva Herramienta</span>
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Herramienta</th>
                                    <th className="py-3 px-4">Código</th>
                                    <th className="py-3 px-4">Tag RFID</th>
                                    <th className="py-3 px-4">Categoría</th>
                                    <th className="py-3 px-4">Tiempo Máx</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {tools.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-100">
                                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                                            <img src={t.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100"} className="w-8 h-8 rounded-lg object-cover" />
                                            <span className="truncate max-w-xs">{t.nombre}</span>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-blue-700">{t.codigo_inventario}</td>
                                        <td className="py-3 px-4 font-mono text-slate-500">{t.tag_uid || <span className="text-slate-400">Sin Tag</span>}</td>
                                        <td className="py-3 px-4 text-slate-700">{t.categoria}</td>
                                        <td className="py-3 px-4 text-slate-700">{t.tiempo_prestamo_horas}h</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                t.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                t.estado === 'prestada' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}>
                                                {t.estado}
                                            </span>
                                            {t.estado === 'prestada' && (t.current_borrower_name || t.prestada_a_nombre) && (
                                                <div className="text-[10px] text-amber-700 mt-1">Con: {t.current_borrower_name || t.prestada_a_nombre}</div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <button
                                                onClick={() => onEditTool(t)}
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => onDeleteTool(t.id)}
                                                className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SECCIÓN 4: LISTA DE USUARIOS & PUNTAJES */}
            {adminTab === 'users' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Lista de Usuarios y Puntajes</h3>
                            <p className="text-xs text-slate-500">Supervisa saldos de puntos, nombres completos y vinculación de tarjetas RFID.</p>
                        </div>
                        <button
                            onClick={onNewUser}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                        >
                            <IconPlus className="w-4 h-4" />
                            <span>Registrar Nuevo Operario</span>
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Operario (Nombres y Apellidos)</th>
                                    <th className="py-3 px-4">Rol</th>
                                    <th className="py-3 px-4">Tag RFID</th>
                                    <th className="py-3 px-4">Puntaje Gamificado</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-100">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-900">{u.nombre}</div>
                                            <div className="text-[10px] text-slate-500">{u.email}</div>
                                        </td>
                                        <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-500">{u.rol}</td>
                                        <td className="py-3 px-4 font-mono text-blue-700">{u.tag_uid || "Sin Tag"}</td>
                                        <td className="py-3 px-4">
                                            <span className={`font-mono font-bold text-sm ${
                                                u.puntos >= 110 ? 'text-emerald-700' :
                                                u.puntos >= 50 ? 'text-amber-700' :
                                                'text-rose-700 font-bold'
                                            }`}>
                                                {u.puntos} pts
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                u.estado === 'activo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                'bg-rose-50 text-rose-700 border border-rose-200'
                                            }`}>
                                                {u.estado}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <button
                                                onClick={() => onOpenAdjustPoints(u)}
                                                className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-50 text-amber-700 font-bold border border-amber-200"
                                            >
                                                Ajustar Pts
                                            </button>
                                            <button
                                                onClick={() => onEditUser(u)}
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold transition-all"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SECCIÓN 5: REGLAS DE GAMIFICACIÓN */}
            {adminTab === 'settings' && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-md max-w-2xl space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-slate-900">Parámetros del Sistema de Gamificación</h3>
                        <p className="text-xs text-slate-500 mt-1">Configura las bonificaciones, penalizaciones y umbrales de seguridad para préstamos.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Puntos Iniciales al Registrarse</label>
                            <input
                                type="number"
                                value={localSettings.initial_points || 100}
                                onChange={(e) => setLocalSettings({ ...localSettings, initial_points: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Bono por Entrega a Tiempo (+)</label>
                            <input
                                type="number"
                                value={localSettings.on_time_bonus || 10}
                                onChange={(e) => setLocalSettings({ ...localSettings, on_time_bonus: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Penalización Base por Retraso (-)</label>
                            <input
                                type="number"
                                value={localSettings.late_penalty_base || 15}
                                onChange={(e) => setLocalSettings({ ...localSettings, late_penalty_base: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Penalización por Hora de Retraso (-)</label>
                            <input
                                type="number"
                                value={localSettings.late_penalty_hourly || 5}
                                onChange={(e) => setLocalSettings({ ...localSettings, late_penalty_hourly: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Umbral Mínimo para Bloquear Préstamos</label>
                            <input
                                type="number"
                                value={localSettings.min_points_threshold || 20}
                                onChange={(e) => setLocalSettings({ ...localSettings, min_points_threshold: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Días de préstamo (para todos)</label>
                            <input
                                type="number" min="1"
                                value={localSettings.loan_days_default || 1}
                                onChange={(e) => setLocalSettings({ ...localSettings, loan_days_default: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">A una persona se le puede dar otro plazo desde su perfil.</p>
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Máximo de herramientas por alumno</label>
                            <input
                                type="number" min="1"
                                value={localSettings.max_tools_per_request || 2}
                                onChange={(e) => setLocalSettings({ ...localSettings, max_tools_per_request: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Resta si regresa con detalles (-)</label>
                            <input
                                type="number" min="0"
                                value={localSettings.damage_penalty_minor || 10}
                                onChange={(e) => setLocalSettings({ ...localSettings, damage_penalty_minor: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Resta si regresa dañada (-)</label>
                            <input
                                type="number" min="0"
                                value={localSettings.damage_penalty_major || 30}
                                onChange={(e) => setLocalSettings({ ...localSettings, damage_penalty_major: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end">
                        <button
                            onClick={() => onSaveSettings(localSettings)}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                        >
                            Guardar Parámetros de Gamificación
                        </button>
                    </div>
                </div>
            )}

            {/* SECCIÓN 6: KIOSCO RFID INTEGRADO */}
            {adminTab === 'kiosk' && (
                <KioskView
                    kioskUser={kioskUser}
                    setKioskUser={setKioskUser}
                    kioskTab={kioskTab}
                    setKioskTab={setKioskTab}
                    kioskTimeout={kioskTimeout}
                    tools={tools}
                    loans={loans}
                    onCheckout={onCheckout}
                    onCheckin={onCheckin}
                    onScanSimulated={onScanSimulated}
                    users={users}
                    selectedToolToCheckout={selectedToolToCheckout}
                    setSelectedToolToCheckout={setSelectedToolToCheckout}
                />
            )}
        </div>
    );
}

// ==========================================
// MODAL: MANDAR SOLICITUD DE PRÉSTAMO (OPERARIO)
// ==========================================
// VISTA: HISTORIAL DE PRÉSTAMOS (con filtros y descarga a Excel)
// ==========================================
function HistoryView() {
    const [filters, setFilters] = useState({ q: '', estado: '', condicion: '', desde: '', hasta: '' });
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const qs = () => new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([k, v]) => v))).toString();

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/history?' + qs());
                setRows(await res.json());
            } catch (e) {
                setRows([]);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [JSON.stringify(filters)]);

    const set = (k, v) => setFilters(prev => ({ ...prev, [k]: v }));
    const inputCls = "bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-300";
    const resultado = (r) => r.estado === 'activo'
        ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">EN PRÉSTAMO</span>
        : r.estado === 'devuelto_a_tiempo'
            ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">A TIEMPO</span>
            : <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">TARDE</span>;
    const condTxt = { bien: 'Buen estado', con_detalles: 'Con detalles', danada: 'Dañada' };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="font-bold text-slate-900 text-base">Historial de Préstamos ({rows.length})</h3>
                    <p className="text-xs text-slate-500">Todos los préstamos: quién, qué herramienta, cuándo salió y cuándo regresó.</p>
                </div>
                <a
                    href={'/api/history.csv?' + qs()}
                    download
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md text-center"
                >
                    Descargar para Excel
                </a>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                <input
                    type="text"
                    data-noscan="1"
                    value={filters.q}
                    onChange={(e) => set('q', e.target.value)}
                    placeholder="Alumno, matrícula o herramienta"
                    className={inputCls + " col-span-2 lg:col-span-1"}
                />
                <select value={filters.estado} onChange={(e) => set('estado', e.target.value)} className={inputCls}>
                    <option value="">Todos los resultados</option>
                    <option value="activo">En préstamo</option>
                    <option value="devuelto_a_tiempo">Devuelto a tiempo</option>
                    <option value="devuelto_tarde">Devuelto tarde</option>
                </select>
                <select value={filters.condicion} onChange={(e) => set('condicion', e.target.value)} className={inputCls}>
                    <option value="">Cualquier estado</option>
                    <option value="bien">Buen estado</option>
                    <option value="con_detalles">Con detalles</option>
                    <option value="danada">Dañada</option>
                </select>
                <label className="text-[10px] text-slate-500">Desde
                    <input type="date" value={filters.desde} onChange={(e) => set('desde', e.target.value)} className={inputCls + " w-full mt-0.5"} />
                </label>
                <label className="text-[10px] text-slate-500">Hasta
                    <input type="date" value={filters.hasta} onChange={(e) => set('hasta', e.target.value)} className={inputCls + " w-full mt-0.5"} />
                </label>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-md">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-4">Alumno</th>
                            <th className="py-3 px-4">Herramienta</th>
                            <th className="py-3 px-4">Salida</th>
                            <th className="py-3 px-4">Fecha límite</th>
                            <th className="py-3 px-4">Regreso</th>
                            <th className="py-3 px-4">Resultado</th>
                            <th className="py-3 px-4">Estado</th>
                            <th className="py-3 px-4 text-right">Puntos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {rows.length === 0 && (
                            <tr><td colSpan="8" className="py-8 text-center text-slate-500">{loading ? 'Cargando...' : 'No hay préstamos con esos filtros.'}</td></tr>
                        )}
                        {rows.map(r => (
                            <tr key={r.id} className="hover:bg-slate-100">
                                <td className="py-3 px-4">
                                    <div className="font-bold text-slate-900">{r.alumno}</div>
                                    <div className="text-[10px] font-mono text-slate-500">{r.matricula || r.email}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-slate-800 font-semibold">{r.herramienta}</div>
                                    <div className="text-[10px] font-mono text-blue-700">{r.codigo}</div>
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-500">{r.fecha_prestamo}</td>
                                <td className="py-3 px-4 font-mono text-slate-500">{r.fecha_limite}</td>
                                <td className="py-3 px-4 font-mono text-slate-700">{r.fecha_devolucion || '—'}</td>
                                <td className="py-3 px-4">{resultado(r)}</td>
                                <td className="py-3 px-4 text-slate-700" title={r.notas_devolucion || ''}>
                                    {condTxt[r.condicion] || '—'}{r.notas_devolucion ? ' 📝' : ''}
                                </td>
                                <td className={`py-3 px-4 text-right font-mono font-bold ${r.puntos > 0 ? 'text-emerald-700' : r.puntos < 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                                    {r.puntos === null || r.puntos === undefined ? '—' : (r.puntos > 0 ? '+' : '') + r.puntos}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ==========================================
// MODAL: ENVIAR SOLICITUD DE PRÉSTAMO (UNA O VARIAS HERRAMIENTAS)
// ==========================================
function RequestCartModal({ tools, loanDays, onClose, onRemove, onSubmit }) {
    const [motivo, setMotivo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(motivo.trim());
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-7 max-w-md w-full shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            Solicitud de préstamo
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                            {tools.length === 1 ? "1 herramienta" : tools.length + " herramientas"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <ul className="space-y-1.5">
                    {tools.map(t => (
                        <li key={t.id} className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div>
                                <div className="font-bold text-slate-900">{t.nombre}</div>
                                <div className="text-[10px] font-mono text-blue-700">{t.codigo_inventario}</div>
                            </div>
                            <button type="button" onClick={() => onRemove(t.id)} className="text-rose-700 hover:text-rose-800 text-[11px] font-semibold">Quitar</button>
                        </li>
                    ))}
                </ul>

                <p className="text-xs text-blue-700 font-bold">
                    Plazo de entrega: {loanDays} {loanDays === 1 ? 'día' : 'días'}. Devuélvelas a tiempo y en buen estado para sumar puntos.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">Motivo <span className="text-slate-500 font-normal">(opcional)</span></label>
                        <textarea
                            rows="2"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Si quieres, di para qué las necesitas"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-slate-700 font-semibold">
                            Seguir eligiendo
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-60">
                            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ==========================================
// MODAL: LOGIN GENÉRICO (USUARIO O ADMIN)
// ==========================================
function LoginAuthModal({ targetRole, onClose, onSuccess, onSwitchToRegister }) {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                // Verificar que el usuario corresponda al rol buscado si aplica
                if (targetRole === 'admin' && data.user.rol !== 'admin') {
                    setError("Esta cuenta no tiene privilegios de Administrador.");
                    return;
                }
                onSuccess(data.user);
            } else {
                setError(data.error || "Credenciales incorrectas");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg space-y-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261120_v19" 
                            alt="EES Yecapixtla UAEM" 
                            className="w-12 h-12 rounded-lg object-contain bg-white p-1 border-2 border-slate-300 shadow-md"
                        />
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300">
                                Acceso {targetRole === 'admin' ? 'Administrador' : 'Alumno / Operario'}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 mt-1">Iniciar Sesión</h3>
                            <p className="text-[11px] text-slate-600">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">Correo, matrícula o número de tag</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder={targetRole === 'admin' ? "admin@taller.io" : "tu correo o matrícula"}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:border-blue-300 focus:outline-none"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">Contraseña / PIN</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-slate-900 font-mono tracking-wider focus:border-blue-300 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
                            >
                                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs shadow-sm transition-all bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Verificando..." : "Entrar al Sistema"}
                    </button>
                </form>

                {onSwitchToRegister && (<div className="pt-3 border-t border-slate-200 text-center">
                    <button
                        onClick={onSwitchToRegister}
                        className="text-xs text-slate-600 hover:text-slate-700 underline font-semibold"
                    >
                        ¿No tienes cuenta? Regístrate aquí
                    </button>
                </div>)}
            </div>
        </div>
    );
}

// ==========================================
// MODAL: REGISTRO DE CUENTA DE USUARIO
// ==========================================
// MODAL: REGISTRO DE ALUMNO (nombre, matrícula, correo y tag)
// ==========================================
function UserRegisterModal({ onClose, onSuccess, onSwitchToLogin }) {
    const [nombres, setNombres] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [matricula, setMatricula] = useState("");
    const [email, setEmail] = useState("");
    const [tagUid, setTagUid] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombres,
                    apellido_paterno: apellidoPaterno,
                    apellido_materno: apellidoMaterno,
                    matricula: matricula.trim(),
                    email: email.trim().toLowerCase(),
                    tag_uid: tagUid.trim(),
                    password: pin.trim()
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                onSuccess(data.user);
            } else {
                setError(data.error || "No se pudo completar el registro");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900";

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300">
                            Registro de alumno
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">Registrarme</h3>
                        <p className="text-[11px] text-slate-600">Tu tag es tu llave: con él te identificas para pedir y devolver herramientas.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">Nombre(s) *</label>
                        <input type="text" value={nombres} onChange={(e) => setNombres(e.target.value)} className={inputCls} required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Apellido paterno *</label>
                            <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} className={inputCls} required />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Apellido materno</label>
                            <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} className={inputCls} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Matrícula *</label>
                            <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} className={inputCls + " font-mono"} required />
                        </div>
                        <div>
                            <label className="block text-slate-700 font-semibold mb-1">Correo *</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
                        </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-1.5">
                        <label className="block text-slate-700 font-semibold">Tag RFID / NFC *</label>
                        <input
                            type="text"
                            data-noscan="1"
                            value={tagUid}
                            onChange={(e) => setTagUid(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            placeholder="Haz clic aquí y acerca tu tag al lector"
                            className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-slate-900 font-mono tracking-wider text-center"
                            required
                        />
                        <p className="text-[10px] text-slate-500">
                            El lector escribe el número del tag aquí solo. Si no tienes lector, escribe el número que viene en el tag.
                        </p>
                    </div>

                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">PIN (opcional, mínimo 4 dígitos)</label>
                        <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className={inputCls + " font-mono"} placeholder="••••" />
                    </div>

                    {error && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm mt-2 transition-all disabled:opacity-60"
                    >
                        {isLoading ? "Registrando..." : "Registrarme"}
                    </button>
                </form>

                <div className="pt-2 border-t border-slate-200 text-center">
                    <button onClick={onSwitchToLogin} className="text-xs text-slate-500 hover:text-slate-900">
                        ¿Ya estás registrado? Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// VISTA: KIOSCO DE PRÉSTAMO Y DEVOLUCIÓN (STANDALONE / INTEGRADO)
// ==========================================
function KioskView({
    kioskUser, setKioskUser,
    kioskTab, setKioskTab,
    kioskTimeout, setKioskTimeout,
    tools, loans,
    onCheckout, onCheckin,
    onScanSimulated, users,
    selectedToolToCheckout, setSelectedToolToCheckout
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [kioskSettings, setKioskSettings] = useState({});
    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(setKioskSettings).catch(() => {});
    }, []);
    const maxTools = parseInt(kioskSettings.max_tools_per_request || 2, 10);
    const loanDays = parseInt(kioskSettings.loan_days_default || 1, 10);
    // Si una herramienta deja de estar disponible, sale del carrito
    useEffect(() => {
        setCart(prev => prev.filter(c => tools.find(t => t.id === c.id && t.estado === 'disponible')));
    }, [tools]);
    useEffect(() => { if (!kioskUser) { setCart([]); setCartOpen(false); } }, [kioskUser]);
    const toggleCart = (tool) => {
        setCart(prev => {
            if (prev.find(c => c.id === tool.id)) return prev.filter(c => c.id !== tool.id);
            if (prev.length >= maxTools) return prev;
            return [...prev, tool];
        });
    };

    const categories = useMemo(() => {
        const set = new Set(tools.map(t => t.categoria));
        return ["Todas", ...Array.from(set)];
    }, [tools]);

    const filteredTools = useMemo(() => {
        return tools.filter(t => {
            const matchesCat = selectedCategory === "Todas" || t.categoria === selectedCategory;
            const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  t.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [tools, selectedCategory, searchTerm]);

    if (!kioskUser) {
        return (
            <div className="flex flex-col items-center justify-center py-10 px-4 min-h-[60vh]">
                <div className="max-w-xl w-full text-center space-y-8">
                    <div className="relative mx-auto w-44 h-44 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-300"></div>
                        <div className="absolute inset-4 rounded-full border-2 border-slate-300"></div>
                        <div className="w-36 h-36 rounded-full bg-slate-100 border-2 border-slate-300 flex flex-col items-center justify-center shadow-lg backdrop-blur p-2">
                            <img src="/static/logo_yecapixtla.png?v=20261120_v19" alt="EES Yecapixtla" className="w-16 h-16 rounded-full object-contain bg-white p-1 mb-1" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">RFID READY</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full">
                            EES Yecapixtla &bull; UAEM
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
                            Estación Kiosco de Préstamo
                        </h2>
                        <p className="text-slate-600 text-sm max-w-md mx-auto">
                            Acerca tu credencial o tag <strong className="text-slate-600 font-bold">RFID / NFC</strong> al lector para identificarte en el mostrador.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                        <p className="text-xs uppercase font-bold tracking-wider text-slate-600 mb-3">
                            o selecciona un usuario para simular tag:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {users.filter(u => u.rol === 'user').map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => onScanSimulated(u.tag_uid)}
                                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all text-left"
                                >
                                    <img src={u.avatar_url || "/static/logo_yecapixtla.png"} className="w-8 h-8 rounded-full object-contain bg-white p-0.5" />
                                    <div className="truncate">
                                        <div className="text-xs font-bold text-slate-900 truncate">{u.nombre}</div>
                                        <div className="text-[10px] font-mono text-blue-700">{u.puntos} pts</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isBlocked = kioskUser.bloqueado_por_puntos || kioskUser.estado === 'bloqueado';
    const activeLoans = kioskUser.active_loans || [];

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img src={kioskUser.avatar_url || "/static/logo_yecapixtla.png"} className="w-16 h-16 rounded-lg object-contain bg-white p-0.5 border-2 border-blue-300 shadow-md" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900">{kioskUser.nombre}</h2>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-300">
                                    TAG: {kioskUser.tag_uid}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">{kioskUser.email}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                                    🏆 {kioskUser.puntos} Puntos
                                </span>
                                <span className="text-xs text-slate-500">
                                    Herramientas activas: <strong className="text-slate-900">{activeLoans.length}</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Cierre automático</div>
                            <div className="font-mono text-xs font-bold text-blue-700">{kioskTimeout}s</div>
                        </div>
                        <button
                            onClick={() => setKioskUser(null)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 transition-all"
                        >
                            <IconLogOut className="w-4 h-4" />
                            <span>Finalizar Sesión</span>
                        </button>
                    </div>
                </div>

                {isBlocked && (
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
                        <IconAlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                        <div>
                            <strong className="font-bold text-rose-700 block">PRÉSTAMOS BLOQUEADOS POR PUNTAJE INSUFICIENTE</strong>
                            <p>Tienes menos de 20 puntos. Solo puedes devolver herramientas activas.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex border-b border-slate-200 gap-4">
                <button
                    onClick={() => setKioskTab('checkout')}
                    disabled={isBlocked}
                    className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        isBlocked ? 'opacity-40 cursor-not-allowed border-transparent text-slate-500' :
                        kioskTab === 'checkout' ? 'border-slate-300 text-slate-600 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <IconPlus className="w-4 h-4" />
                    <span>1. Pedir Herramienta (Check-out)</span>
                </button>

                <button
                    onClick={() => setKioskTab('checkin')}
                    className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        kioskTab === 'checkin' ? 'border-slate-300 text-slate-600 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <IconCheckCircle className="w-4 h-4" />
                    <span>2. Devolver Herramienta (Check-in) ({activeLoans.length})</span>
                </button>
            </div>

            {kioskTab === 'checkout' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTools.map(tool => (
                            <div key={tool.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <img src={tool.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300"} className="w-full h-32 rounded-xl object-cover" />
                                    <h4 className="font-bold text-sm text-slate-900">{tool.nombre}</h4>
                                    <p className="text-xs text-slate-500">{tool.categoria} &bull; Plazo: {loanDays} {loanDays === 1 ? 'día' : 'días'}</p>
                                </div>
                                <div className="mt-3 pt-2">
                                    {tool.estado === 'disponible' ? (
                                        <button
                                            onClick={() => toggleCart(tool)}
                                            disabled={!cart.find(c => c.id === tool.id) && cart.length >= maxTools}
                                            className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md disabled:opacity-40 ${
                                                cart.find(c => c.id === tool.id)
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white '
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white '}`}
                                        >
                                            {cart.find(c => c.id === tool.id) ? '✓ Seleccionada (quitar)' : 'Seleccionar'}
                                        </button>
                                    ) : (
                                        <div className="text-center py-1.5 text-xs text-slate-500">{tool.estado}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {kioskTab === 'checkin' && (
                <div className="space-y-4">
                    {activeLoans.length === 0 ? (
                        <div className="text-center py-10 bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
                            No tienes herramientas prestadas activas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activeLoans.map(loan => (
                                <div key={loan.id} className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900 text-sm">{loan.tool_nombre}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${loan.vencido === 1 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                            {loan.vencido === 1 ? 'VENCIDO' : 'A TIEMPO'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">Fecha límite: <span className="font-mono text-slate-900">{loan.fecha_limite}</span></p>
                                    <button
                                        onClick={() => onCheckin(loan.id)}
                                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                                    >
                                        Registrar Devolución Ahora
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {kioskTab === 'checkout' && cart.length > 0 && (
                <div className="sticky bottom-4 z-40 bg-white border border-slate-300 rounded-lg p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-700">
                        <strong className="text-slate-900">{cart.length} de {maxTools}</strong> herramientas: {cart.map(c => c.nombre).join(' · ')}
                    </div>
                    <button onClick={() => setCartOpen(true)} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
                        Pedir {cart.length === 1 ? 'esta herramienta' : 'estas herramientas'}
                    </button>
                </div>
            )}

            {cartOpen && cart.length > 0 && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-300 rounded-lg p-6 max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-slate-900 text-base">Confirmar Préstamo</h3>
                        <ul className="text-xs text-slate-700 list-disc pl-4 space-y-1">
                            {cart.map(c => <li key={c.id}>{c.nombre}</li>)}
                        </ul>
                        <p className="text-xs text-blue-700 font-bold">
                            Plazo de entrega: {kioskUser.dias_prestamo || loanDays} {(kioskUser.dias_prestamo || loanDays) === 1 ? 'día' : 'días'}. Devuélvelas a tiempo y en buen estado para sumar puntos.
                        </p>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setCartOpen(false)} className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold">Cancelar</button>
                            <button
                                onClick={async () => {
                                    const ok = await onCheckout(kioskUser.id, cart.map(c => c.id));
                                    if (ok) { setCart([]); }
                                    setCartOpen(false);
                                }}
                                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                            >Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==========================================
// VISTA: LEADERBOARD DE GAMIFICACIÓN
// ==========================================
function LeaderboardView({ leaderboard }) {
    const topThree = leaderboard.slice(0, 3);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                    <IconTrophy className="w-8 h-8 text-amber-700" />
                    <span>Leaderboard de Puntualidad</span>
                </h2>
                <p className="text-sm text-slate-500">
                    Ranking de operarios con mayor cuidado y puntualidad en entrega de herramientas.
                </p>
            </div>

            {/* Podio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4">
                {topThree[1] && (
                    <div className="bg-white border border-slate-300 rounded-lg p-5 text-center order-2 sm:order-1">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold text-slate-700">2</div>
                        <h4 className="font-bold text-slate-900 text-sm">{topThree[1].nombre}</h4>
                        <div className="text-xl font-bold text-slate-700 font-mono mt-1">{topThree[1].puntos} pts</div>
                    </div>
                )}
                {topThree[0] && (
                    <div className="bg-white border-2 border-amber-300 rounded-lg p-6 text-center order-1 sm:order-2 relative -translate-y-2">
                        <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto mb-2 text-base font-bold">1</div>
                        <h4 className="font-bold text-slate-900 text-base">{topThree[0].nombre}</h4>
                        <div className="text-3xl font-bold text-amber-700 font-mono mt-1">{topThree[0].puntos} pts</div>
                    </div>
                )}
                {topThree[2] && (
                    <div className="bg-white border border-slate-200 rounded-lg p-5 text-center order-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-amber-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold text-amber-700">3</div>
                        <h4 className="font-bold text-slate-900 text-sm">{topThree[2].nombre}</h4>
                        <div className="text-xl font-bold text-amber-700 font-mono mt-1">{topThree[2].puntos} pts</div>
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-4">Posición</th>
                            <th className="py-3 px-4">Operario</th>
                            <th className="py-3 px-4">Entregas a Tiempo</th>
                            <th className="py-3 px-4">Puntualidad</th>
                            <th className="py-3 px-4 text-right">Puntaje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {leaderboard.map(item => (
                            <tr key={item.id} className="hover:bg-slate-100">
                                <td className="py-3 px-4 font-mono font-bold text-blue-700">#{item.ranking}</td>
                                <td className="py-3 px-4 font-semibold text-slate-900">{item.nombre}</td>
                                <td className="py-3 px-4 text-slate-700">{item.entregas_a_tiempo} de {(item.entregas_a_tiempo || 0) + (item.entregas_tarde || 0)}</td>
                                <td className="py-3 px-4 font-mono text-slate-700">{item.tasa_puntualidad}%</td>
                                <td className="py-3 px-4 font-mono font-bold text-right text-base text-slate-900">{item.puntos} pts</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ==========================================
// SIMULADOR VISUAL DE HARDWARE RFID
// ==========================================
function RFIDSimulatorDrawer({ isOpen, onClose, onScan, users, tools, customInput, setCustomInput, lastTag, activeKioskUser }) {
    if (!isOpen) return null;

    return (
        <aside aria-label="Simulador de Hardware RFID / NFC" className="fixed bottom-4 left-4 z-40 max-w-sm w-full bg-white/95 border border-slate-300 rounded-lg shadow-lg p-4 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <img src="/static/logo_yecapixtla.png?v=20261120_v19" alt="EES Yecapixtla" className="w-5 h-5 rounded object-contain bg-white p-0.5" />
                    <IconRadio className="w-4 h-4 text-slate-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Simulador RFID &bull; EES Yecapixtla</h4>
                </div>
                <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                    <IconXCircle className="w-4 h-4" />
                </button>
            </div>

            <p className="text-[11px] text-slate-600">Haz clic en una tarjeta para simular el acercamiento al lector USB:</p>

            <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Credenciales de Usuarios:</div>
                <div className="grid grid-cols-2 gap-1.5">
                    {users.map(u => (
                        <button
                            key={u.id}
                            onClick={() => onScan(u.tag_uid)}
                            className={`p-1.5 rounded-xl text-left border text-xs truncate ${
                                activeKioskUser?.id === u.id ? 'bg-blue-50 border-slate-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <div className="font-semibold truncate">{u.nombre}</div>
                            <div className="font-mono text-[10px] text-slate-600">{u.tag_uid}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Tags de Herramientas:</div>
                <div className="grid grid-cols-1 gap-1">
                    {tools.slice(0, 4).map(t => (
                        <button
                            key={t.id}
                            onClick={() => onScan(t.tag_uid)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs flex justify-between text-slate-700"
                        >
                            <span className="truncate">{t.nombre}</span>
                            <span className="font-mono text-[10px] text-slate-600 shrink-0 ml-2">{t.tag_uid}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex gap-1.5">
                <input
                    type="text"
                    placeholder="UID manual"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono"
                />
                <button
                    onClick={() => { if (customInput) onScan(customInput); }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                    Escanear
                </button>
            </div>
        </aside>
    );
}

// ==========================================
// MODAL DE GAMIFICACIÓN (FEEDBACK)
// ==========================================
// MODAL: ¿EN QUÉ ESTADO REGRESA LA HERRAMIENTA?
// ==========================================
function ReturnConditionModal({ onCancel, onConfirm }) {
    const [condicion, setCondicion] = useState('bien');
    const [notas, setNotas] = useState('');
    const opciones = [
        { id: 'bien', titulo: 'En buen estado', detalle: 'Sin problemas. Suma puntos si llega a tiempo.', cls: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
        { id: 'con_detalles', titulo: 'Con detalles', detalle: 'Desgaste o algo menor. Resta puntos.', cls: 'border-amber-300 bg-amber-50 text-amber-800' },
        { id: 'danada', titulo: 'Dañada', detalle: 'Pasa a mantenimiento. Resta más puntos.', cls: 'border-rose-300 bg-rose-50 text-rose-800' },
    ];
    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-300 rounded-lg p-6 max-w-sm w-full space-y-4">
                <h3 className="font-bold text-slate-900 text-base">¿Cómo regresa la herramienta?</h3>
                <div className="space-y-2">
                    {opciones.map(o => (
                        <button
                            key={o.id}
                            type="button"
                            onClick={() => setCondicion(o.id)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${condicion === o.id ? o.cls + ' ring-2 ring-blue-300' : 'border-slate-300 text-slate-700 hover:border-slate-300'}`}
                        >
                            <div className="font-bold">{o.titulo}</div>
                            <div className="opacity-80">{o.detalle}</div>
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    data-noscan="1"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Nota (opcional): qué le pasó, qué falta..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
                />
                <div className="flex gap-2 pt-1">
                    <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold">Cancelar</button>
                    <button onClick={() => onConfirm(condicion, notas.trim())} className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">Registrar devolución</button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
function GamificationModal({ data, onClose }) {
    const isCheckout = data.type === 'checkout';

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg text-center space-y-4">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                    isCheckout ? 'bg-blue-50 text-blue-700 border-2 border-blue-300' :
                    data.isOntime ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300' :
                    'bg-rose-50 text-rose-700 border-2 border-rose-300'
                }`}>
                    {isCheckout ? <IconWrench className="w-10 h-10" /> :
                     data.isOntime ? <IconTrophy className="w-10 h-10 text-amber-700" /> :
                     <IconAlertTriangle className="w-10 h-10 text-rose-700" />}
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-slate-900">{data.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{data.toolName || data.message}</p>
                </div>

                {!isCheckout && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                        <div className="text-xs text-slate-500">Variación de Puntos:</div>
                        <div className={`text-4xl font-bold font-mono ${data.isOntime ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {data.puntosDelta > 0 ? `+${data.puntosDelta}` : data.puntosDelta} PUNTOS
                        </div>
                        <div className="text-xs text-slate-700 font-semibold">{data.motivo}</div>
                        <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                            Nuevo Saldo de Puntos: <strong className="text-slate-900 font-mono">{data.nuevoSaldo} pts</strong>
                        </div>
                    </div>
                )}

                {isCheckout && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
                        <p>{data.subtext}</p>
                        <p className="font-bold text-blue-700">{data.bonus}</p>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
}

// ==========================================
// MODALES FORMULARIOS: HERRAMIENTAS Y USUARIOS
// ==========================================
function ToolFormModal({ tool, onClose, onSave }) {
    const [formData, setFormData] = useState({
        nombre: tool?.nombre || "",
        codigo_inventario: tool?.codigo_inventario || "",
        tag_uid: tool?.tag_uid || "",
        categoria: tool?.categoria || "Herramientas Eléctricas",
        tiempo_prestamo_horas: tool?.tiempo_prestamo_horas || 8,
        ubicacion: tool?.ubicacion || "Taller Central",
        imagen_url: tool?.imagen_url || "",
        descripcion: tool?.descripcion || "",
        estado: tool?.estado || "disponible"
    });

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <img src="/static/logo_yecapixtla.png?v=20261120_v19" alt="EES Yecapixtla UAEM" className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-300" />
                        <div>
                            <h3 className="font-bold text-base text-slate-900">{tool ? "Editar Herramienta" : "Nueva Herramienta"}</h3>
                            <p className="text-[10px] text-slate-600">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                        <label className="block text-slate-500 mb-1">Nombre de la Herramienta</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-500 mb-1">Código de Inventario</label>
                        <input
                            type="text"
                            value={formData.codigo_inventario}
                            onChange={e => setFormData({ ...formData, codigo_inventario: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-500 mb-1">Tag RFID UID</label>
                        <input
                            type="text"
                            value={formData.tag_uid}
                            onChange={e => setFormData({ ...formData, tag_uid: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                            placeholder="TAG-TL-001"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-500 mb-1">Categoría</label>
                        <select
                            value={formData.categoria}
                            onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        >
                            <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                            <option value="Medición y Diagnóstico">Medición y Diagnóstico</option>
                            <option value="Herramientas Manuales">Herramientas Manuales</option>
                            <option value="Soldadura">Soldadura</option>
                            <option value="Seguridad">Seguridad</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-500 mb-1">Horas Máximas de Préstamo</label>
                        <input
                            type="number"
                            value={formData.tiempo_prestamo_horas}
                            onChange={e => setFormData({ ...formData, tiempo_prestamo_horas: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-500 mb-1">Ubicación Física</label>
                        <input
                            type="text"
                            value={formData.ubicacion}
                            onChange={e => setFormData({ ...formData, ubicacion: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-500 mb-1">Estado</label>
                        <select
                            value={formData.estado}
                            onChange={e => setFormData({ ...formData, estado: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        >
                            <option value="disponible">disponible</option>
                            <option value="prestada">prestada</option>
                            <option value="mantenimiento">mantenimiento</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-slate-500 mb-1">URL de Imagen</label>
                        <input
                            type="text"
                            value={formData.imagen_url}
                            onChange={e => setFormData({ ...formData, imagen_url: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-700">
                        Cancelar
                    </button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md">
                        Guardar Herramienta
                    </button>
                </div>
            </div>
        </div>
    );
}

function UserFormModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({
        nombre: user?.nombre || "",
        email: user?.email || "",
        rol: user?.rol || "user",
        tag_uid: user?.tag_uid || "",
        matricula: user?.matricula || "",
        dias_prestamo: user?.dias_prestamo || "",
        puntos: user?.puntos || 100,
        estado: user?.estado || "activo",
        pin: ""
    });

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <img src="/static/logo_yecapixtla.png?v=20261120_v19" alt="EES Yecapixtla UAEM" className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-300" />
                        <div>
                            <h3 className="font-bold text-base text-slate-900">{user ? "Editar Operario / Usuario" : "Nuevo Operario"}</h3>
                            <p className="text-[10px] text-slate-600">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-500 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-500">Correo Electrónico</label>
                        </div>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="correo@ejemplo.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-500 mb-1">Matrícula</label>
                            <input
                                type="text"
                                value={formData.matricula}
                                onChange={e => setFormData({ ...formData, matricula: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 mb-1">Días de préstamo (solo esta persona)</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.dias_prestamo}
                                onChange={e => setFormData({ ...formData, dias_prestamo: e.target.value })}
                                placeholder="Vacío = el general"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-500 mb-1">UID del Tag RFID Personal</label>
                        <input
                            type="text"
                            value={formData.tag_uid}
                            onChange={e => setFormData({ ...formData, tag_uid: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-500 mb-1">Rol</label>
                            <select
                                value={formData.rol}
                                onChange={e => setFormData({ ...formData, rol: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                            >
                                <option value="user">Operario / User</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-500 mb-1">Estado</label>
                            <select
                                value={formData.estado}
                                onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                            >
                                <option value="activo">Activo</option>
                                <option value="bloqueado">Bloqueado</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                        <label className="block text-slate-500 mb-1">PIN / Contraseña de Seguridad (Opcional)</label>
                        <input
                            type="password"
                            value={formData.pin}
                            onChange={e => setFormData({ ...formData, pin: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                            placeholder="Dejar vacío para no modificar"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-700">
                        Cancelar
                    </button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md">
                        Guardar Usuario
                    </button>
                </div>
            </div>
        </div>
    );
}

function AdminProfileModal({ users, onClose, onSave, showToast }) {
    const adminUser = users.find(u => u.rol === 'admin') || users[0];
    const [nombre, setNombre] = useState(adminUser?.nombre || "");
    const [email, setEmail] = useState(adminUser?.email || "");
    const [avatarUrl, setAvatarUrl] = useState(adminUser?.avatar_url || "");
    const [tagUid, setTagUid] = useState(adminUser?.tag_uid || "");
    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    const handleSave = async () => {
        try {
            await fetch(`/api/users/${adminUser.id}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, avatar_url: avatarUrl, tag_uid: tagUid })
            });

            if (newPin) {
                if (newPin !== confirmPin) {
                    showToast("Los PINs no coinciden", "error");
                    return;
                }
                await fetch(`/api/users/${adminUser.id}/pin`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ current_pin: currentPin, pin: newPin })
                });
            }

            onSave();
        } catch (e) {
            showToast("Error al guardar perfil", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <img src="/static/logo_yecapixtla.png?v=20261120_v19" alt="EES Yecapixtla UAEM" className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-300" />
                        <div>
                            <h3 className="font-bold text-base text-slate-900">Perfil de Administrador</h3>
                            <p className="text-[10px] text-slate-600">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-semibold mb-1">Tag RFID Personal</label>
                        <input
                            type="text"
                            value={tagUid}
                            onChange={e => setTagUid(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                        />
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                        <label className="block text-slate-700 font-semibold mb-1">Cambiar Contraseña / PIN (Opcional)</label>
                        <input
                            type="password"
                            placeholder="PIN actual (0000)"
                            value={currentPin}
                            onChange={e => setCurrentPin(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="password"
                                placeholder="Nuevo PIN"
                                value={newPin}
                                onChange={e => setNewPin(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                            />
                            <input
                                type="password"
                                placeholder="Confirmar PIN"
                                value={confirmPin}
                                onChange={e => setConfirmPin(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md">
                        Guardar Perfil
                    </button>
                </div>
            </div>
        </div>
    );
}

// Montar aplicación en el elemento raíz
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
