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
            setPendingCheckout({ userId, toolId, customHours, tool: selectedToolToCheckout });
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
            const res = await fetch('/api/loans/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, tool_id: toolId, custom_hours: customHours })
            });
            const data = await res.json();
            if (!res.ok) {
                window.rfidAudio.playError();
                showToast(data.error || "Error al realizar préstamo", "error");
                return;
            }

            window.rfidAudio.playSuccess();
            setSelectedToolToCheckout(null);
            showToast(`¡Préstamo autorizado! Retorno antes de: ${data.fecha_limite}`, "success");
            setGamificationModal({
                type: 'checkout',
                title: "¡Préstamo Registrado!",
                message: `Has retirado: ${data.tool.nombre}`,
                subtext: `Fecha límite de devolución: ${data.fecha_limite} (${data.tiempo_horas} horas)`,
                bonus: "Recuerda entregar a tiempo para sumar +10 puntos a tu ranking",
                color: "text-cyan-400"
            });
            refreshAllData();
        } catch (err) {
            showToast("Error de conexión", "error");
        }
    };

    const handleCheckin = async (loanId, simulateLateHours = null) => {
        try {
            const res = await fetch('/api/loans/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loan_id: loanId, simulate_late_hours: simulateLateHours })
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
    const handleSendLoanRequest = async (toolId, hours, motivo) => {
        if (!currentUser) return;
        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    tool_id: toolId,
                    tiempo_horas: hours,
                    motivo: motivo
                })
            });
            const data = await res.json();
            if (res.ok) {
                window.rfidAudio.playSuccess();
                showToast("¡Solicitud enviada al Administrador con éxito!", "success");
                setRequestModalOpen(false);
                refreshAllData();
            } else {
                window.rfidAudio.playError();
                showToast(data.error || "Error al enviar solicitud", "error");
            }
        } catch (e) {
            showToast("Error de comunicación", "error");
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            const res = await fetch(`/api/requests/${requestId}/approve`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                window.rfidAudio.playSuccess();
                showToast("Solicitud aprobada: Préstamo activado", "success");
                refreshAllData();
            } else {
                window.rfidAudio.playError();
                showToast(data.error || "Error al aprobar", "error");
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
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
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
                    onRequestTool={(tool) => {
                        setToolForRequest(tool);
                        setRequestModalOpen(true);
                    }}
                    onToggleSimulator={() => setSimulatorOpen(!simulatorOpen)}
                    simulatorOpen={simulatorOpen}
                />
            )}

            {/* VISTA PARA ADMINISTRADOR (ROL = 'ADMIN') */}
            {currentUser && currentUser.rol === 'admin' && (
                <div className="flex flex-col min-h-screen">
                    {/* Header Admin */}
                    <header className="border-b border-purple-950/80 bg-[#0a0414]/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img 
                                    src="/static/logo_yecapixtla.png?v=20261119_v14" 
                                    alt="EES Yecapixtla" 
                                    className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-purple-500/40 shadow-md shadow-purple-600/30"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white">EES Yecapixtla</h1>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                            Admin &bull; UAEM
                                        </span>
                                    </div>
                                    <p className="text-xs text-purple-300/70 hidden sm:block">Sesión: {currentUser.nombre} ({currentUser.email})</p>
                                </div>
                            </div>

                            {/* Navegación Admin */}
                            <nav className="flex items-center gap-1 bg-[#06020c]/80 p-1 rounded-xl border border-purple-950/80 overflow-x-auto max-w-full">
                                <button
                                    onClick={() => setAdminTab('requests')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'requests' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                                    }`}
                                >
                                    <IconClipboard className="w-3.5 h-3.5" />
                                    <span>Solicitudes</span>
                                    {loanRequests.filter(r => r.estado === 'pendiente').length > 0 && (
                                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                                            {loanRequests.filter(r => r.estado === 'pendiente').length}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setAdminTab('loans')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'loans' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                                    }`}
                                >
                                    <IconClock className="w-3.5 h-3.5" />
                                    <span>Herramientas Prestadas ({loans.filter(l => l.estado === 'activo').length})</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('inventory')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'inventory' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                                    }`}
                                >
                                    <IconWrench className="w-3.5 h-3.5" />
                                    <span>Editar Catálogo ({tools.length})</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('users')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'users' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                                    }`}
                                >
                                    <IconUser className="w-3.5 h-3.5" />
                                    <span>Usuarios & Puntajes ({users.length})</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('settings')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'settings' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                                    }`}
                                >
                                    <IconSliders className="w-3.5 h-3.5" />
                                    <span>Reglas</span>
                                </button>

                                <button
                                    onClick={() => setAdminTab('kiosk')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                        adminTab === 'kiosk' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
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
                                        simulatorOpen ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30' : 'bg-purple-950/60 text-purple-200 border-purple-500/40 hover:bg-purple-900'
                                    }`}
                                    title="Alternar Simulador RFID"
                                >
                                    <IconRadio className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => setAdminProfileOpen(true)}
                                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-500/40"
                                    title="Editar Perfil de Administrador"
                                >
                                    <IconUser className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all"
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
                    <header className="border-b border-slate-800 bg-slate-900/90 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <IconRadio className="w-6 h-6 text-cyan-400" />
                            <h2 className="font-bold text-white text-base">Estación Kiosco RFID Independiente</h2>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-semibold transition-all"
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
                    onSwitchToRegister={() => setAuthModal(authModal === 'admin_login' ? 'admin_register' : 'user_register')}
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
                        showToast(`Cuenta de Operario creada. ¡Bienvenido ${user.nombre}!`, "success");
                        refreshAllData();
                    }}
                    onSwitchToLogin={() => setAuthModal('user_login')}
                />
            )}

            {/* MODAL DE REGISTRO DE ADMINISTRADOR (CON AUTORIZACIÓN DEL PRIMER ADMIN) */}
            {authModal === 'admin_register' && (
                <AdminRegisterModal
                    onClose={() => setAuthModal(null)}
                    onSuccess={(user) => {
                        window.rfidAudio.playSuccess();
                        setCurrentUser(user);
                        setAuthModal(null);
                        showToast(`Cuenta de Administrador autorizada y creada con éxito.`, "success");
                        refreshAllData();
                    }}
                    onSwitchToLogin={() => setAuthModal('admin_login')}
                />
            )}

            {/* MODAL DE SOLICITUD DE PRÉSTAMO DE HERRAMIENTA */}
            {requestModalOpen && toolForRequest && (
                <ToolRequestModal
                    tool={toolForRequest}
                    currentUser={currentUser}
                    onClose={() => { setRequestModalOpen(false); setToolForRequest(null); }}
                    onSubmit={handleSendLoanRequest}
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

            {/* MODAL DE RESULTADO DE GAMIFICACIÓN */}
            {gamificationModal && (
                <GamificationModal
                    data={gamificationModal}
                    onClose={() => setGamificationModal(null)}
                />
            )}

            {/* MODAL DE PIN DE SEGURIDAD PARA PRÉSTAMO */}
            {pinModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 shadow-purple-600/20">
                        <div className="flex justify-center mb-1">
                            <img src="/static/logo_yecapixtla.png?v=20261119_v14" alt="EES Yecapixtla UAEM" className="w-14 h-14 rounded-2xl object-contain bg-white p-1 border-2 border-purple-500/40 shadow-md shadow-purple-600/30" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Verificación de Seguridad</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Ingresa tu PIN personal de 4 dígitos para autorizar el préstamo.
                            </p>
                        </div>

                        {pendingCheckout?.tool && (
                            <div className="text-xs text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800">
                                Herramienta: <strong className="text-white">{pendingCheckout.tool.nombre}</strong>
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
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-2xl font-mono text-white tracking-[0.5em] focus:border-cyan-500 focus:outline-none"
                                placeholder="• • • •"
                            />
                            {pinError && (
                                <p className="text-xs text-rose-400 font-bold mt-2 flex items-center justify-center gap-1">
                                    <IconXCircle className="w-3.5 h-3.5" /> {pinError}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => { setPinModalOpen(false); setPendingCheckout(null); setPinInput(""); }}
                                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200"
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
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30"
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
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 shadow-purple-600/20">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/static/logo_yecapixtla.png?v=20261119_v14" alt="EES Yecapixtla UAEM" className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border-2 border-purple-500/40 shadow-md shadow-purple-600/30" />
                            <div>
                                <h3 className="font-bold text-lg text-white">Ajuste Manual de Puntos</h3>
                                <p className="text-xs text-slate-400">Usuario: {targetUserForPoints.nombre} (Saldo: {targetUserForPoints.puntos} pts)</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-300 mb-1">
                                    Variación (+ para bono, - para penalización)
                                </label>
                                <input
                                    type="number"
                                    value={pointAdjustAmount}
                                    onChange={(e) => setPointAdjustAmount(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-base focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-300 mb-1">
                                    Motivo Obligatorio (Auditoría del Ledger)
                                </label>
                                <textarea
                                    value={pointAdjustReason}
                                    onChange={(e) => setPointAdjustReason(e.target.value)}
                                    rows="3"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
                                    placeholder="Ej: Reconocimiento por excelencia en el cuidado de herramienta"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setAdjustPointsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={submitAdjustPoints}
                                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/30"
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
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all transform animate-bounce ${
                    toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' :
                    toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' :
                    toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/40 text-amber-200' :
                    'bg-slate-900 border-slate-700 text-slate-200'
                }`}>
                    {toast.type === 'success' && <IconCheckCircle className="w-5 h-5 text-emerald-400" />}
                    {toast.type === 'error' && <IconXCircle className="w-5 h-5 text-rose-400" />}
                    {toast.type === 'warning' && <IconAlertTriangle className="w-5 h-5 text-amber-400" />}
                    {toast.type === 'info' && <IconRadio className="w-5 h-5 text-cyan-400" />}
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
        <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-[#06020c] relative overflow-hidden">
            {/* Luces y resplandores morados institucionales */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 right-10 w-[450px] h-[350px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* Barra superior institucional */}
            <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-purple-950/70">
                <div className="flex items-center gap-3">
                    <img 
                        src="/static/logo_yecapixtla.png?v=20261119_v14" 
                        alt="Logo EES Yecapixtla UAEM" 
                        className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border-2 border-purple-500/40 shadow-lg shadow-purple-600/25"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
                                EES Yecapixtla &bull; UAEM
                            </h1>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                RFID Tools
                            </span>
                        </div>
                        <p className="text-xs text-purple-300/70">Escuela de Estudios Superiores de Yecapixtla</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleSimulator}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            simulatorOpen ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/40' : 'bg-[#0d061a] border-purple-900/60 text-purple-300 hover:text-white hover:bg-purple-950/60'
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
                {/* Gran Escudo de Venado Yecapixtla */}
                <div className="flex justify-center mb-2">
                    <div className="relative group">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261119_v14" 
                            alt="Logo Escuela de Estudios Superiores de Yecapixtla" 
                            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-contain bg-white p-2 border-2 border-purple-500/40 shadow-2xl shadow-purple-600/35 transition-transform group-hover:scale-105"
                        />
                        <div className="absolute -inset-2 rounded-3xl bg-purple-600/20 blur-xl -z-10 animate-pulse"></div>
                    </div>
                </div>

                <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-purple-300 bg-purple-950/80 border border-purple-500/40 px-3.5 py-1 rounded-full inline-block">
                        Escuela de Estudios Superiores de Yecapixtla &bull; UAEM
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Sistema de Préstamo de Herramientas
                    </h2>
                    <p className="text-sm text-purple-300/80 max-w-xl mx-auto leading-relaxed">
                        Control con tags RFID/NFC y sistema de gamificación por puntualidad para talleres y laboratorios.
                    </p>
                </div>

                {/* Las Dos Grandes Tarjetas de Elección (Morado con Negro) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* TARJETA 1: USUARIO / ALUMNO */}
                    <div className="bg-[#0e071c]/95 border-2 border-purple-950 hover:border-purple-500/70 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all hover:shadow-purple-600/20 group">
                        <div className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shadow-inner">
                                <IconUser className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-white">Soy Usuario / Alumno</h3>
                                <p className="text-xs text-purple-300/80 mt-1 leading-relaxed">
                                    Consulta existencias de equipo, manda solicitudes de préstamo para tus prácticas, revisa tus puntos de gamificación y cuándo debes regresar tus herramientas.
                                </p>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-300 pt-2">
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Catálogo de herramientas disponibles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Mandar solicitud de préstamo para talleres</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span>Saldo de puntos acumulados por puntualidad</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-purple-950/80">
                            <button
                                onClick={() => onOpenLogin('user')}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                            >
                                <IconLock className="w-4 h-4" />
                                <span>Iniciar Sesión como Usuario</span>
                            </button>

                            <button
                                onClick={() => onOpenRegister('user')}
                                className="w-full py-2.5 px-4 rounded-xl bg-[#06020c] hover:bg-purple-950/70 text-purple-300 hover:text-white border border-purple-900/60 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                            >
                                <IconPlus className="w-3.5 h-3.5" />
                                <span>Crear Cuenta (@uaem.edu.mx)</span>
                            </button>
                        </div>
                    </div>

                    {/* TARJETA 2: ADMINISTRADOR / ENCARGADO DE TALLER */}
                    <div className="bg-[#0e071c]/95 border-2 border-purple-950 hover:border-violet-500/70 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all hover:shadow-violet-600/20 group">
                        <div className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform shadow-inner">
                                <IconShield className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-white">Soy Administrador</h3>
                                <p className="text-xs text-purple-300/80 mt-1 leading-relaxed">
                                    Supervisa el inventario total del laboratorio, aprueba o rechaza solicitudes de préstamo, controla los tags RFID físicos y revisa los préstamos activos.
                                </p>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-300 pt-2">
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span>Aprobar o rechazar solicitudes de alumnos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span>Control de entregas y fechas límite exactas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <IconCheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span>Edición de catálogo y vinculación de tags RFID</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-purple-950/80">
                            <button
                                onClick={() => onOpenLogin('admin')}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-700/30 transition-all flex items-center justify-center gap-2"
                            >
                                <IconShield className="w-4 h-4" />
                                <span>Iniciar Sesión como Administrador</span>
                            </button>

                            <button
                                onClick={() => onOpenRegister('admin')}
                                className="w-full py-2.5 px-4 rounded-xl bg-[#06020c] hover:bg-purple-950/70 text-purple-300 hover:text-white border border-purple-900/60 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                            >
                                <IconLock className="w-3.5 h-3.5 text-purple-400" />
                                <span>Registrar Nuevo Admin (con Clave Maestra)</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Opción para usar la Estación Kiosco RFID directamente */}
                <div className="pt-4">
                    <button
                        onClick={onOpenKioskDirectly}
                        className="text-xs text-purple-300 hover:text-white underline flex items-center justify-center gap-1.5 mx-auto font-medium transition-colors"
                    >
                        <IconRadio className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span>Abrir Modo Kiosco para escanear con Lector RFID físico en el mostrador</span>
                    </button>
                </div>
            </div>

            {/* Footer Institucional */}
            <div className="max-w-6xl w-full mx-auto pt-6 border-t border-purple-950/60 text-center text-xs text-purple-400/60">
                Escuela de Estudios Superiores de Yecapixtla &bull; Universidad Autónoma del Estado de Morelos (UAEM)
            </div>
        </div>
    );
}

// ==========================================
// VISTA: PORTAL RESTRINGIDO DEL OPERARIO (USUARIO)
// ==========================================
function UserPortalView({ currentUser, onLogout, userTab, setUserTab, tools, activeLoans, myRequests, transactions, leaderboard, onRequestTool, onToggleSimulator, simulatorOpen }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");

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
            <header className="border-b border-purple-950/80 bg-[#0a0414]/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261119_v14" 
                            alt="EES Yecapixtla" 
                            className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-purple-500/40 shadow-md shadow-purple-600/30"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-extrabold text-base text-white">{currentUser.nombre}</h2>
                                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${
                                    currentUser.puntos >= 130 ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                                    currentUser.puntos >= 110 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                    currentUser.puntos >= 90 ? 'bg-slate-400/10 text-slate-300 border-slate-400/30' :
                                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                }`}>
                                    🏆 {currentUser.puntos} Pts
                                </span>
                            </div>
                            <p className="text-xs text-purple-300/70 hidden sm:block">{currentUser.email} &bull; EES Yecapixtla UAEM</p>
                        </div>
                    </div>

                    {/* Navegación Restringida del Usuario */}
                    <nav className="flex items-center gap-1 bg-[#06020c]/80 p-1 rounded-xl border border-purple-950/80 overflow-x-auto">
                        <button
                            onClick={() => setUserTab('catalog')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'catalog' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                            }`}
                        >
                            <IconWrench className="w-3.5 h-3.5" />
                            <span>Catálogo de Herramientas</span>
                        </button>

                        <button
                            onClick={() => setUserTab('my_loans')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'my_loans' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                            }`}
                        >
                            <IconClock className="w-3.5 h-3.5" />
                            <span>Mis Préstamos ({activeLoans.length})</span>
                            {myRequests.filter(r => r.estado === 'pendiente').length > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                                    {myRequests.filter(r => r.estado === 'pendiente').length} pend.
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setUserTab('profile')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'profile' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                            }`}
                        >
                            <IconUser className="w-3.5 h-3.5" />
                            <span>Mi Perfil & Puntos</span>
                        </button>

                        <button
                            onClick={() => setUserTab('leaderboard')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                userTab === 'leaderboard' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-purple-300/70 hover:text-white hover:bg-purple-950/50'
                            }`}
                        >
                            <IconTrophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>Leaderboard</span>
                        </button>
                    </nav>

                    {/* Botón Salir */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleSimulator}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                simulatorOpen ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30' : 'bg-purple-950/60 text-purple-200 border-purple-500/40 hover:bg-purple-900'
                            }`}
                            title="Simulador RFID"
                        >
                            <IconRadio className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all"
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
                    <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3.5 text-rose-200 shadow-xl">
                        <IconAlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                            <strong className="text-sm font-bold text-rose-300 block">
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
                                <h3 className="text-xl font-bold text-white">Catálogo de Herramientas del Taller</h3>
                                <p className="text-xs text-slate-400">Consulta existencias y envía una solicitud de préstamo al Administrador.</p>
                            </div>

                            {/* Buscador y Categorías */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <div className="relative">
                                    <IconSearch className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar herramienta..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-56"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                                        className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                                            isAvailable
                                                ? 'border-slate-800 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/5'
                                                : 'border-slate-800/40 opacity-70 bg-slate-950/40'
                                        }`}
                                    >
                                        <div className="space-y-3">
                                            <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950">
                                                <img
                                                    src={tool.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300"}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow ${
                                                        tool.estado === 'disponible' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                                                        tool.estado === 'prestada' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                                                        'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                                    }`}>
                                                        {tool.estado}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-slate-700">
                                                    {tool.codigo_inventario}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{tool.categoria}</span>
                                                <h4 className="font-bold text-sm text-white line-clamp-1 mt-0.5">{tool.nombre}</h4>
                                                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{tool.descripcion}</p>
                                            </div>

                                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <IconClock className="w-3.5 h-3.5 text-cyan-400" />
                                                    <span>Máx: {tool.tiempo_prestamo_horas} horas</span>
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {tool.ubicacion}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2">
                                            {isAvailable ? (
                                                <button
                                                    onClick={() => onRequestTool(tool)}
                                                    disabled={isBlocked}
                                                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                                                        isBlocked
                                                            ? 'bg-purple-950/40 text-purple-400/50 border border-purple-950 cursor-not-allowed'
                                                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                                                    }`}
                                                >
                                                    <IconClipboard className="w-4 h-4" />
                                                    <span>Mandar Solicitud de Préstamo</span>
                                                </button>
                                            ) : (
                                                <div className="text-center py-2 px-3 rounded-xl bg-slate-950 text-slate-500 text-xs font-medium border border-slate-800">
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

                {/* PESTAÑA 2: MIS PRÉSTAMOS & SOLICITUDES */}
                {userTab === 'my_loans' && (
                    <div className="space-y-8">
                        {/* 1. Herramientas que tiene actualmente en su poder */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <IconWrench className="w-5 h-5 text-cyan-400" />
                                    <span>Herramientas en tu Poder ({activeLoans.length})</span>
                                </h3>
                                <span className="text-xs text-slate-400">Revisa la fecha límite de devolución para no perder puntos.</span>
                            </div>

                            {activeLoans.length === 0 ? (
                                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
                                    No tienes ninguna herramienta prestada en este momento.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeLoans.map(loan => {
                                        const isOverdue = loan.vencido === 1;
                                        return (
                                            <div
                                                key={loan.id}
                                                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                                                    isOverdue
                                                        ? 'bg-rose-950/20 border-rose-500/50'
                                                        : 'bg-slate-900 border-slate-800'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <span className="font-mono text-xs text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                                            {loan.codigo_inventario}
                                                        </span>
                                                        <h4 className="font-bold text-base text-white mt-1.5">{loan.tool_nombre}</h4>
                                                    </div>
                                                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                                                        isOverdue
                                                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                                                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                    }`}>
                                                        {isOverdue ? '¡VENCIDO!' : 'EN PLAZO'}
                                                    </span>
                                                </div>

                                                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                                                    <div className="flex justify-between text-slate-400">
                                                        <span>Fecha de salida:</span>
                                                        <span className="font-mono text-slate-300">{loan.fecha_prestamo}</span>
                                                    </div>
                                                    <div className="flex justify-between text-slate-400">
                                                        <span>Fecha límite de entrega:</span>
                                                        <span className={`font-mono font-bold ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                                                            {loan.fecha_limite}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-[11px] text-slate-400 italic">
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
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <IconClipboard className="w-5 h-5 text-cyan-400" />
                                <span>Historial de Solicitudes Enviadas ({myRequests.length})</span>
                            </h3>

                            {myRequests.length === 0 ? (
                                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
                                    No has enviado solicitudes de préstamo recientemente.
                                </div>
                            ) : (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                                            <tr>
                                                <th className="py-3 px-4">Herramienta</th>
                                                <th className="py-3 px-4">Fecha Solicitud</th>
                                                <th className="py-3 px-4">Horas</th>
                                                <th className="py-3 px-4">Motivo de Uso</th>
                                                <th className="py-3 px-4 text-right">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {myRequests.map(r => (
                                                <tr key={r.id} className="hover:bg-slate-800/40">
                                                    <td className="py-3 px-4 font-semibold text-white">{r.tool_nombre}</td>
                                                    <td className="py-3 px-4 font-mono text-slate-400">{r.fecha_solicitud}</td>
                                                    <td className="py-3 px-4 text-slate-300">{r.tiempo_horas}h</td>
                                                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{r.motivo}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                            r.estado === 'pendiente' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                                                            r.estado === 'aprobada' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                                            'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                                        }`}>
                                                            {r.estado}
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
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex items-center gap-5">
                                <img
                                    src={currentUser.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                                    className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-extrabold text-white">{currentUser.nombre}</h3>
                                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                                            {currentUser.tag_uid}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{currentUser.email}</p>
                                    <div className="mt-3 flex gap-3 text-xs">
                                        <span className="text-slate-400">Rol: <strong className="text-white uppercase">Operario</strong></span>
                                        <span className="text-slate-400">Estado: <strong className="text-emerald-400 uppercase">{currentUser.estado}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Saldo de Puntos */}
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center min-w-[180px]">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Tus Puntos Actuales</span>
                                <span className="text-4xl font-extrabold text-cyan-400 font-mono">{currentUser.puntos}</span>
                                <span className="text-[11px] text-slate-400 block mt-1">Saldo de Gamificación</span>
                            </div>
                        </div>

                        {/* Historial de Puntos (Ledger) */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-white text-base flex items-center gap-2">
                                <IconTrophy className="w-4 h-4 text-amber-400" />
                                <span>Historial Contable de Puntos (Ledger de Auditoría)</span>
                            </h4>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                                        <tr>
                                            <th className="py-3 px-4">Fecha</th>
                                            <th className="py-3 px-4">Variación</th>
                                            <th className="py-3 px-4">Motivo / Evento</th>
                                            <th className="py-3 px-4 text-right">Saldo Resultante</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {transactions.map(tx => (
                                            <tr key={tx.id} className="hover:bg-slate-800/40">
                                                <td className="py-3 px-4 font-mono text-slate-400">{tx.fecha}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                                        tx.cantidad > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                                        'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                                    }`}>
                                                        {tx.cantidad > 0 ? `+${tx.cantidad}` : tx.cantidad} pts
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-200">{tx.motivo}</td>
                                                <td className="py-3 px-4 font-mono font-bold text-right text-slate-300">
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
    onApproveRequest, onRejectRequest, onCheckin,
    onOpenAdjustPoints, onSaveSettings, onDeleteTool, onDeleteUser,
    onEditTool, onNewTool, onEditUser, onNewUser,
    // Kiosco
    kioskUser, setKioskUser, kioskTab, setKioskTab, kioskTimeout,
    onCheckout, onScanSimulated, selectedToolToCheckout, setSelectedToolToCheckout
}) {
    const [localSettings, setLocalSettings] = useState(settings);
    useEffect(() => setLocalSettings(settings), [settings]);

    const pendingRequests = loanRequests.filter(r => r.estado === 'pendiente');
    const resolvedRequests = loanRequests.filter(r => r.estado !== 'pendiente');
    const activeLoans = loans.filter(l => l.estado === 'activo');

    return (
        <div className="space-y-6">
            {/* KPI METRICS CARDS */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Solicitudes Pendientes</div>
                        <div className="text-2xl font-extrabold text-amber-400 mt-1">{stats.requests?.pendientes || 0}</div>
                        <div className="text-[11px] text-slate-400 mt-1">esperando tu aprobación</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Préstamos Activos</div>
                        <div className="text-2xl font-extrabold text-cyan-400 mt-1">{activeLoans.length}</div>
                        <div className="text-[11px] text-slate-400 mt-1">en poder de operarios</div>
                    </div>

                    <div className={`bg-slate-900 border rounded-2xl p-4 shadow-sm ${stats.loans?.vencidos > 0 ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'}`}>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Préstamos Vencidos</span>
                            {stats.loans?.vencidos > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
                        </div>
                        <div className={`text-2xl font-extrabold mt-1 ${stats.loans?.vencidos > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                            {stats.loans?.vencidos || 0}
                        </div>
                        <div className="text-[11px] text-rose-300 mt-1">con penalización activa</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Herramientas Total</div>
                        <div className="text-2xl font-extrabold text-white mt-1">{tools.length}</div>
                        <div className="text-[11px] text-emerald-400 mt-1">{tools.filter(t => t.estado === 'disponible').length} disponibles</div>
                    </div>
                </div>
            )}

            {/* SECCIÓN 1: SOLICITUDES DE PRÉSTAMO (ACEPTAR / RECHAZAR) */}
            {adminTab === 'requests' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <IconClipboard className="w-5 h-5 text-cyan-400" />
                                <span>Solicitudes de Préstamo Pendientes ({pendingRequests.length})</span>
                            </h3>
                            <p className="text-xs text-slate-400">Revisa la identidad del operario, sus puntos y autoriza la entrega del equipo.</p>
                        </div>
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-2">
                            <IconCheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                            <h4 className="font-bold text-slate-200 text-sm">No hay solicitudes pendientes en este momento</h4>
                            <p className="text-slate-500">Todas las solicitudes de los operarios han sido atendidas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingRequests.map(req => {
                                const userAtRisk = req.user_puntos < 20;
                                return (
                                    <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={req.user_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                                                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{req.user_nombre}</h4>
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                                        userAtRisk ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-cyan-500/10 text-cyan-400'
                                                    }`}>
                                                        {req.user_puntos} pts {userAtRisk && "(Puntaje Bajo)"}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded">
                                                {req.fecha_solicitud}
                                            </span>
                                        </div>

                                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Herramienta solicitada:</span>
                                                <strong className="text-white">{req.tool_nombre}</strong>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Código de inventario:</span>
                                                <span className="font-mono text-cyan-400">{req.codigo_inventario}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Tiempo de préstamo:</span>
                                                <span className="font-bold text-slate-200">{req.tiempo_horas} horas</span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-800">
                                                <span className="text-slate-400 block text-[11px] mb-0.5">Motivo de uso:</span>
                                                <p className="text-slate-300 italic">{req.motivo}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onApproveRequest(req.id)}
                                                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <IconCheckCircle className="w-4 h-4" />
                                                <span>Aceptar y Autorizar Préstamo</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const motivo = prompt("Motivo del rechazo (opcional):", "Herramienta reservada para mantenimiento");
                                                    if (motivo !== null) onRejectRequest(req.id, motivo);
                                                }}
                                                className="py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold text-xs border border-rose-800/40"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Historial reciente de solicitudes resueltas */}
                    {resolvedRequests.length > 0 && (
                        <div className="pt-6 border-t border-slate-800 space-y-3">
                            <h4 className="font-bold text-white text-sm">Historial de Solicitudes Resueltas</h4>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                                        <tr>
                                            <th className="py-3 px-4">Operario</th>
                                            <th className="py-3 px-4">Herramienta</th>
                                            <th className="py-3 px-4">Fecha Solicitud</th>
                                            <th className="py-3 px-4">Resolución</th>
                                            <th className="py-3 px-4 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {resolvedRequests.slice(0, 10).map(r => (
                                            <tr key={r.id} className="hover:bg-slate-800/40">
                                                <td className="py-3 px-4 font-semibold text-white">{r.user_nombre}</td>
                                                <td className="py-3 px-4 text-slate-300">{r.tool_nombre}</td>
                                                <td className="py-3 px-4 font-mono text-slate-400">{r.fecha_solicitud}</td>
                                                <td className="py-3 px-4 text-slate-400">{r.respuesta_admin || r.fecha_resolucion || "Aprobada"}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                        r.estado === 'aprobada' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                                        'bg-rose-500/20 text-rose-300 border border-rose-500/40'
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
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <IconClock className="w-5 h-5 text-cyan-400" />
                            <span>Herramientas Prestadas y Fecha de Regreso ({activeLoans.length})</span>
                        </h3>
                        <p className="text-xs text-slate-400">Supervisa qué usuario tiene cada equipo y cuándo debe regresarlo.</p>
                    </div>

                    {activeLoans.length === 0 ? (
                        <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
                            No hay préstamos activos en este momento. Todas las herramientas están en inventario.
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
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
                                <tbody className="divide-y divide-slate-800">
                                    {activeLoans.map(l => (
                                        <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-white">{l.user_nombre}</div>
                                                <div className="text-[10px] text-slate-400">{l.user_email}</div>
                                            </td>
                                            <td className="py-3 px-4 font-mono font-bold text-cyan-400">{l.user_puntos} pts</td>
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-slate-200">{l.tool_nombre}</div>
                                                <span className="text-[10px] font-mono text-slate-500">{l.codigo_inventario}</span>
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-400">{l.fecha_prestamo}</td>
                                            <td className="py-3 px-4 font-mono font-bold">
                                                <span className={l.vencido === 1 ? 'text-rose-400' : 'text-slate-200'}>
                                                    {l.fecha_limite}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {l.vencido === 1 ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                                                        ¡VENCIDO!
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                                        EN PLAZO
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => onCheckin(l.id)}
                                                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
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

            {/* SECCIÓN 3: INVENTARIO DE HERRAMIENTAS (CRUD) */}
            {adminTab === 'inventory' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white text-base">Edición del Catálogo de Herramientas</h3>
                            <p className="text-xs text-slate-400">Agrega, edita, cambia existencias y define tiempos máximos de préstamo.</p>
                        </div>
                        <button
                            onClick={onNewTool}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                        >
                            <IconPlus className="w-4 h-4" />
                            <span>Agregar Nueva Herramienta</span>
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
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
                            <tbody className="divide-y divide-slate-800">
                                {tools.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-800/40">
                                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2.5">
                                            <img src={t.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100"} className="w-8 h-8 rounded-lg object-cover" />
                                            <span className="truncate max-w-xs">{t.nombre}</span>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-cyan-400">{t.codigo_inventario}</td>
                                        <td className="py-3 px-4 font-mono text-slate-400">{t.tag_uid || <span className="text-slate-600">Sin Tag</span>}</td>
                                        <td className="py-3 px-4 text-slate-300">{t.categoria}</td>
                                        <td className="py-3 px-4 text-slate-300">{t.tiempo_prestamo_horas}h</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                t.estado === 'disponible' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                                t.estado === 'prestada' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                                                'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                            }`}>
                                                {t.estado}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <button
                                                onClick={() => onEditTool(t)}
                                                className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-semibold transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => onDeleteTool(t.id)}
                                                className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold border border-rose-800/40"
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
                            <h3 className="font-bold text-white text-base">Lista de Usuarios y Puntajes</h3>
                            <p className="text-xs text-slate-400">Supervisa saldos de puntos, nombres completos y vinculación de tarjetas RFID.</p>
                        </div>
                        <button
                            onClick={onNewUser}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                        >
                            <IconPlus className="w-4 h-4" />
                            <span>Registrar Nuevo Operario</span>
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">Operario (Nombres y Apellidos)</th>
                                    <th className="py-3 px-4">Rol</th>
                                    <th className="py-3 px-4">Tag RFID</th>
                                    <th className="py-3 px-4">Puntaje Gamificado</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-800/40">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-white">{u.nombre}</div>
                                            <div className="text-[10px] text-slate-400">{u.email}</div>
                                        </td>
                                        <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-400">{u.rol}</td>
                                        <td className="py-3 px-4 font-mono text-cyan-400">{u.tag_uid || "Sin Tag"}</td>
                                        <td className="py-3 px-4">
                                            <span className={`font-mono font-bold text-sm ${
                                                u.puntos >= 110 ? 'text-emerald-400' :
                                                u.puntos >= 50 ? 'text-amber-400' :
                                                'text-rose-400 font-extrabold'
                                            }`}>
                                                {u.puntos} pts
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                u.estado === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                                'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                            }`}>
                                                {u.estado}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <button
                                                onClick={() => onOpenAdjustPoints(u)}
                                                className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                                            >
                                                Ajustar Pts
                                            </button>
                                            <button
                                                onClick={() => onEditUser(u)}
                                                className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-semibold transition-all"
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
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl space-y-6">
                    <div>
                        <h3 className="font-bold text-base text-white">Parámetros del Sistema de Gamificación</h3>
                        <p className="text-xs text-slate-400 mt-1">Configura las bonificaciones, penalizaciones y umbrales de seguridad para préstamos.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Puntos Iniciales al Registrarse</label>
                            <input
                                type="number"
                                value={localSettings.initial_points || 100}
                                onChange={(e) => setLocalSettings({ ...localSettings, initial_points: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Bono por Entrega a Tiempo (+)</label>
                            <input
                                type="number"
                                value={localSettings.on_time_bonus || 10}
                                onChange={(e) => setLocalSettings({ ...localSettings, on_time_bonus: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Penalización Base por Retraso (-)</label>
                            <input
                                type="number"
                                value={localSettings.late_penalty_base || 15}
                                onChange={(e) => setLocalSettings({ ...localSettings, late_penalty_base: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Penalización por Hora de Retraso (-)</label>
                            <input
                                type="number"
                                value={localSettings.late_penalty_hourly || 5}
                                onChange={(e) => setLocalSettings({ ...localSettings, late_penalty_hourly: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Umbral Mínimo para Bloquear Préstamos</label>
                            <input
                                type="number"
                                value={localSettings.min_points_threshold || 20}
                                onChange={(e) => setLocalSettings({ ...localSettings, min_points_threshold: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button
                            onClick={() => onSaveSettings(localSettings)}
                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
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
function ToolRequestModal({ tool, currentUser, onClose, onSubmit }) {
    const [hours, setHours] = useState(tool.tiempo_prestamo_horas || 8);
    const [motivo, setMotivo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(tool.id, hours, motivo);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 shadow-purple-600/20">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261119_v14" 
                            alt="EES Yecapixtla UAEM" 
                            className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border-2 border-purple-500/40 shadow-md shadow-purple-600/30"
                        />
                        <div>
                            <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
                                Solicitud de Préstamo
                            </span>
                            <h3 className="text-lg font-bold text-white mt-1">{tool.nombre}</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-purple-400 hover:text-white">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Código:</span>
                        <span className="font-mono text-cyan-400 font-bold">{tool.codigo_inventario}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Categoría:</span>
                        <span className="text-slate-200">{tool.categoria}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Ubicación en taller:</span>
                        <span className="text-slate-200">{tool.ubicacion}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tiempo de Préstamo Estimado (Horas)</label>
                        <input
                            type="number"
                            min="1"
                            max="72"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Motivo / Tarea a Realizar</label>
                        <textarea
                            rows="3"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Ej: Mantenimiento correctivo en línea 2 de ensamblaje"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-purple-950/60 hover:bg-purple-900 rounded-xl border border-purple-500/40 text-purple-200 font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30"
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Solicitud al Administrador"}
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 shadow-purple-600/20">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261119_v14" 
                            alt="EES Yecapixtla UAEM" 
                            className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border-2 border-purple-500/40 shadow-md shadow-purple-600/30"
                        />
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                Acceso {targetRole === 'admin' ? 'Administrador' : 'Alumno / Operario'}
                            </span>
                            <h3 className="text-xl font-bold text-white mt-1">Iniciar Sesión</h3>
                            <p className="text-[11px] text-purple-300/70">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-purple-400 hover:text-white">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico o Nombre de Usuario</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder={targetRole === 'admin' ? "admin@taller.io" : "tu.correo@uaem.edu.mx"}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-cyan-500 focus:outline-none"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Contraseña / PIN</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-white font-mono tracking-wider focus:border-cyan-500 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs shadow-lg transition-all bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Verificando..." : "Entrar al Sistema"}
                    </button>
                </form>

                <div className="pt-3 border-t border-slate-800 text-center">
                    <button
                        onClick={onSwitchToRegister}
                        className="text-xs text-purple-300 hover:text-purple-100 underline font-semibold"
                    >
                        ¿No tienes cuenta? Regístrate aquí
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// MODAL: REGISTRO DE CUENTA DE USUARIO
// ==========================================
function UserRegisterModal({ onClose, onSuccess, onSwitchToLogin }) {
    const [nombres, setNombres] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [codePreview, setCodePreview] = useState(null);
    const [infoMessage, setInfoMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email.trim().toLowerCase().endsWith('@uaem.edu.mx')) {
            setError("Ingresa primero un correo institucional que termine en @uaem.edu.mx");
            return;
        }
        setSendingCode(true);
        setError("");
        setInfoMessage("");
        try {
            const res = await fetch('/api/auth/send-verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCodeSent(true);
                if (data.code_preview) {
                    setCodePreview(data.code_preview);
                    setInfoMessage(`Código de verificación: ${data.code_preview}`);
                } else {
                    setInfoMessage("Se ha enviado un código de 6 dígitos a tu correo.");
                }
            } else {
                setError(data.error || "No se pudo generar el código");
            }
        } catch (err) {
            setError("Error de conexión al solicitar el código");
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!email.trim().toLowerCase().endsWith("@uaem.edu.mx")) {
            setError("Acceso restringido: Solo se permiten correos institucionales oficiales (@uaem.edu.mx)");
            setIsLoading(false);
            return;
        }

        if (!verificationCode.trim()) {
            setError("Debes solicitar e ingresar el código de verificación de 6 dígitos.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombres,
                    apellido_paterno: apellidoPaterno,
                    apellido_materno: apellidoMaterno,
                    email: email.trim().toLowerCase(),
                    password,
                    verification_code: verificationCode.trim(),
                    rol: 'user'
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                onSuccess(data.user);
            } else {
                setError(data.error || "Error al crear la cuenta");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 shadow-purple-600/20">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261119_v14" 
                            alt="EES Yecapixtla UAEM" 
                            className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border-2 border-purple-500/40 shadow-md shadow-purple-600/30"
                        />
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                Registro de Alumno / Operario
                            </span>
                            <h3 className="text-xl font-bold text-white mt-1">Crear Cuenta</h3>
                            <p className="text-[11px] text-purple-300/70">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-purple-400 hover:text-white">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nombre(s) *</label>
                        <input
                            type="text"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            placeholder="Ej: Carlos Alberto"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Apellido Paterno *</label>
                            <input
                                type="text"
                                value={apellidoPaterno}
                                onChange={(e) => setApellidoPaterno(e.target.value)}
                                placeholder="Ej: Mendoza"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Apellido Materno</label>
                            <input
                                type="text"
                                value={apellidoMaterno}
                                onChange={(e) => setApellidoMaterno(e.target.value)}
                                placeholder="Ej: Ríos"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-300 font-semibold">Correo Institucional *</label>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                @uaem.edu.mx
                            </span>
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setCodeSent(false); setInfoMessage(""); }}
                            placeholder="tu.correo@uaem.edu.mx"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            required
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                            Solo se aceptan cuentas oficiales de la <strong className="text-emerald-400">UAEM (@uaem.edu.mx)</strong>.
                        </p>
                    </div>

                    {/* Verificación de correo institucional */}
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-slate-300 font-semibold">Código de Verificación *</label>
                            <button
                                type="button"
                                onClick={handleSendCode}
                                disabled={sendingCode || !email}
                                className="text-[11px] px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold border border-purple-400/40 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
                            >
                                {sendingCode ? "Generando..." : (codeSent ? "Reenviar Código" : "Enviar Código al Correo")}
                            </button>
                        </div>

                        {codeSent ? (
                            <div className="space-y-1.5 pt-1">
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Ingresa los 6 dígitos"
                                    className="w-full bg-slate-900 border border-cyan-500/50 rounded-xl px-3 py-2 text-white font-mono tracking-widest text-center text-sm font-bold"
                                    required
                                />
                                {infoMessage && (
                                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center justify-between">
                                        <span>{infoMessage}</span>
                                        {codePreview && (
                                            <button
                                                type="button"
                                                onClick={() => setVerificationCode(codePreview)}
                                                className="underline font-bold text-white ml-2 text-[10px]"
                                            >
                                                Autocompletar
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[10px] text-slate-400">
                                Haz clic en <strong>"Enviar Código al Correo"</strong> para validar que el correo te pertenece y que no esté duplicado.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Contraseña (mínimo 4 caracteres) *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-white font-mono"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 mt-2 transition-all"
                    >
                        {isLoading ? "Creando Cuenta..." : "Registrarme e Iniciar"}
                    </button>
                </form>

                <div className="pt-2 border-t border-slate-800 text-center">
                    <button onClick={onSwitchToLogin} className="text-xs text-slate-400 hover:text-white">
                        ¿Ya tienes cuenta? Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// MODAL: REGISTRO DE NUEVO ADMINISTRADOR (CON AUTORIZACIÓN DEL PRIMER ADMIN)
// ==========================================
function AdminRegisterModal({ onClose, onSuccess, onSwitchToLogin }) {
    const [nombres, setNombres] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [masterPassword, setMasterPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [codePreview, setCodePreview] = useState(null);
    const [infoMessage, setInfoMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email.trim().toLowerCase().endsWith('@uaem.edu.mx')) {
            setError("Ingresa primero un correo institucional que termine en @uaem.edu.mx");
            return;
        }
        setSendingCode(true);
        setError("");
        setInfoMessage("");
        try {
            const res = await fetch('/api/auth/send-verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCodeSent(true);
                if (data.code_preview) {
                    setCodePreview(data.code_preview);
                    setInfoMessage(`Código de verificación: ${data.code_preview}`);
                } else {
                    setInfoMessage("Se ha enviado un código de 6 dígitos a tu correo.");
                }
            } else {
                setError(data.error || "No se pudo generar el código");
            }
        } catch (err) {
            setError("Error de conexión al solicitar el código");
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!email.trim().toLowerCase().endsWith("@uaem.edu.mx")) {
            setError("Acceso restringido: Solo se permiten correos institucionales oficiales (@uaem.edu.mx)");
            setIsLoading(false);
            return;
        }

        if (!verificationCode.trim()) {
            setError("Debes solicitar e ingresar el código de verificación de 6 dígitos.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombres,
                    apellido_paterno: apellidoPaterno,
                    apellido_materno: apellidoMaterno,
                    email: email.trim().toLowerCase(),
                    password,
                    verification_code: verificationCode.trim(),
                    rol: 'admin',
                    master_admin_password: masterPassword
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                onSuccess(data.user);
            } else {
                setError(data.error || "Error al crear la cuenta de administrador");
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 shadow-purple-600/20">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/static/logo_yecapixtla.png?v=20261119_v14" 
                            alt="EES Yecapixtla UAEM" 
                            className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border-2 border-purple-500/40 shadow-md shadow-purple-600/30"
                        />
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                Alta de Administrador
                            </span>
                            <h3 className="text-xl font-bold text-white mt-1">Registrar Nuevo Admin</h3>
                            <p className="text-[11px] text-purple-300/70">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-purple-400 hover:text-white">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nombre(s) *</label>
                        <input
                            type="text"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            placeholder="Ej: Andrés"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Apellido Paterno *</label>
                            <input
                                type="text"
                                value={apellidoPaterno}
                                onChange={(e) => setApellidoPaterno(e.target.value)}
                                placeholder="Ej: Vargas"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Apellido Materno</label>
                            <input
                                type="text"
                                value={apellidoMaterno}
                                onChange={(e) => setApellidoMaterno(e.target.value)}
                                placeholder="Ej: León"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-300 font-semibold">Correo Institucional *</label>
                            <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">
                                @uaem.edu.mx
                            </span>
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setCodeSent(false); setInfoMessage(""); }}
                            placeholder="admin.nuevo@uaem.edu.mx"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            required
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                            Debe ser una cuenta institucional de la <strong className="text-blue-400">UAEM (@uaem.edu.mx)</strong>.
                        </p>
                    </div>

                    {/* Verificación de correo institucional */}
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-slate-300 font-semibold">Código de Verificación *</label>
                            <button
                                type="button"
                                onClick={handleSendCode}
                                disabled={sendingCode || !email}
                                className="text-[11px] px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold border border-purple-400/40 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
                            >
                                {sendingCode ? "Generando..." : (codeSent ? "Reenviar Código" : "Enviar Código al Correo")}
                            </button>
                        </div>

                        {codeSent ? (
                            <div className="space-y-1.5 pt-1">
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Ingresa los 6 dígitos"
                                    className="w-full bg-slate-900 border border-blue-500/50 rounded-xl px-3 py-2 text-white font-mono tracking-widest text-center text-sm font-bold"
                                    required
                                />
                                {infoMessage && (
                                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center justify-between">
                                        <span>{infoMessage}</span>
                                        {codePreview && (
                                            <button
                                                type="button"
                                                onClick={() => setVerificationCode(codePreview)}
                                                className="underline font-bold text-white ml-2 text-[10px]"
                                            >
                                                Autocompletar
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[10px] text-slate-400">
                                Haz clic en <strong>"Enviar Código al Correo"</strong> para validar tu correo institucional y descartar cuentas duplicadas.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">1. Contraseña Creada por el Nuevo Admin *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="•••• (tu nueva clave de acceso)"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-white font-mono"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-1">
                        <label className="block text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                            <IconLock className="w-4 h-4 text-amber-400" />
                            <span>2. Contraseña del Primer Administrador (Autorización) *</span>
                        </label>
                        <input
                            type="password"
                            value={masterPassword}
                            onChange={(e) => setMasterPassword(e.target.value)}
                            placeholder="•••••••••• (Contraseña del Admin Maestro)"
                            className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-white font-mono"
                            required
                        />
                        <p className="text-[10px] text-amber-400/80">
                            Requerida para autorizar la creación de una nueva cuenta con privilegios administrativos.
                        </p>
                    </div>

                    {error && (
                        <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 mt-2 transition-all"
                    >
                        {isLoading ? "Validando Autorización..." : "Registrar Administrador Autorizado"}
                    </button>
                </form>

                <div className="pt-2 border-t border-slate-800 text-center">
                    <button onClick={onSwitchToLogin} className="text-xs text-slate-400 hover:text-white">
                        ¿Ya tienes cuenta de admin? Inicia sesión aquí
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
                        <div className="absolute inset-0 rounded-full border-2 border-purple-500/40 rfid-ring"></div>
                        <div className="absolute inset-4 rounded-full border-2 border-indigo-500/40 animate-ping"></div>
                        <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-purple-900/60 to-indigo-950/80 border-2 border-purple-400/70 flex flex-col items-center justify-center shadow-2xl shadow-purple-600/35 backdrop-blur p-2">
                            <img src="/static/logo_yecapixtla.png?v=20261119_v14" alt="EES Yecapixtla" className="w-16 h-16 rounded-full object-contain bg-white p-1 mb-1" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300">RFID READY</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-purple-300 bg-purple-950/80 border border-purple-500/40 px-3 py-1 rounded-full">
                            EES Yecapixtla &bull; UAEM
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mt-2">
                            Estación Kiosco de Préstamo
                        </h2>
                        <p className="text-purple-300/80 text-sm max-w-md mx-auto">
                            Acerca tu credencial o tag <strong className="text-purple-400 font-bold">RFID / NFC</strong> al lector para identificarte en el mostrador.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-purple-950/70">
                        <p className="text-xs uppercase font-bold tracking-wider text-purple-400/80 mb-3">
                            o selecciona un usuario para simular tag:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {users.filter(u => u.rol === 'user').map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => onScanSimulated(u.tag_uid)}
                                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0e071c] border border-purple-950 hover:border-purple-500/60 hover:bg-purple-950/40 transition-all text-left"
                                >
                                    <img src={u.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"} className="w-8 h-8 rounded-full object-cover" />
                                    <div className="truncate">
                                        <div className="text-xs font-bold text-white truncate">{u.nombre}</div>
                                        <div className="text-[10px] font-mono text-cyan-400">{u.puntos} pts</div>
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img src={kioskUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-white">{kioskUser.nombre}</h2>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                                    TAG: {kioskUser.tag_uid}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">{kioskUser.email}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                                    🏆 {kioskUser.puntos} Puntos
                                </span>
                                <span className="text-xs text-slate-400">
                                    Herramientas activas: <strong className="text-white">{activeLoans.length}</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Cierre automático</div>
                            <div className="font-mono text-xs font-bold text-cyan-400">{kioskTimeout}s</div>
                        </div>
                        <button
                            onClick={() => setKioskUser(null)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white transition-all"
                        >
                            <IconLogOut className="w-4 h-4" />
                            <span>Finalizar Sesión</span>
                        </button>
                    </div>
                </div>

                {isBlocked && (
                    <div className="mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-200 text-xs">
                        <IconAlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                            <strong className="font-bold text-rose-300 block">PRÉSTAMOS BLOQUEADOS POR PUNTAJE INSUFICIENTE</strong>
                            <p>Tienes menos de 20 puntos. Solo puedes devolver herramientas activas.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex border-b border-slate-800 gap-4">
                <button
                    onClick={() => setKioskTab('checkout')}
                    disabled={isBlocked}
                    className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        isBlocked ? 'opacity-40 cursor-not-allowed border-transparent text-slate-500' :
                        kioskTab === 'checkout' ? 'border-purple-400 text-purple-300 font-bold' : 'border-transparent text-purple-400/60 hover:text-white'
                    }`}
                >
                    <IconPlus className="w-4 h-4" />
                    <span>1. Pedir Herramienta (Check-out)</span>
                </button>

                <button
                    onClick={() => setKioskTab('checkin')}
                    className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        kioskTab === 'checkin' ? 'border-purple-400 text-purple-300 font-bold' : 'border-transparent text-purple-400/60 hover:text-white'
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
                            <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <img src={tool.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300"} className="w-full h-32 rounded-xl object-cover" />
                                    <h4 className="font-bold text-sm text-white">{tool.nombre}</h4>
                                    <p className="text-xs text-slate-400">{tool.categoria} &bull; Máx: {tool.tiempo_prestamo_horas}h</p>
                                </div>
                                <div className="mt-3 pt-2">
                                    {tool.estado === 'disponible' ? (
                                        <button
                                            onClick={() => setSelectedToolToCheckout(tool)}
                                            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                                        >
                                            Retirar Herramienta
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
                        <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
                            No tienes herramientas prestadas activas.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activeLoans.map(loan => (
                                <div key={loan.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-white text-sm">{loan.tool_nombre}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${loan.vencido === 1 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                            {loan.vencido === 1 ? 'VENCIDO' : 'A TIEMPO'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">Fecha límite: <span className="font-mono text-white">{loan.fecha_limite}</span></p>
                                    <button
                                        onClick={() => onCheckin(loan.id)}
                                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                                    >
                                        Registrar Devolución Ahora
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedToolToCheckout && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4">
                        <h3 className="font-bold text-white text-base">Confirmar Préstamo</h3>
                        <p className="text-xs text-slate-300">{selectedToolToCheckout.nombre}</p>
                        <p className="text-xs text-cyan-400 font-bold">+10 puntos si devuelves en menos de {selectedToolToCheckout.tiempo_prestamo_horas} horas.</p>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setSelectedToolToCheckout(null)} className="flex-1 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-semibold">Cancelar</button>
                            <button onClick={() => onCheckout(kioskUser.id, selectedToolToCheckout.id)} className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30">Confirmar</button>
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
                <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                    <IconTrophy className="w-8 h-8 text-amber-400" />
                    <span>Leaderboard de Puntualidad</span>
                </h2>
                <p className="text-sm text-slate-400">
                    Ranking de operarios con mayor cuidado y puntualidad en entrega de herramientas.
                </p>
            </div>

            {/* Podio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4">
                {topThree[1] && (
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 text-center order-2 sm:order-1">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center mx-auto mb-2 text-sm font-bold text-slate-300">2</div>
                        <h4 className="font-bold text-white text-sm">{topThree[1].nombre}</h4>
                        <div className="text-xl font-extrabold text-slate-300 font-mono mt-1">{topThree[1].puntos} pts</div>
                    </div>
                )}
                {topThree[0] && (
                    <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 text-center order-1 sm:order-2 podium-gold relative -translate-y-2">
                        <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-2 text-base font-extrabold">1</div>
                        <h4 className="font-bold text-white text-base">{topThree[0].nombre}</h4>
                        <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{topThree[0].puntos} pts</div>
                    </div>
                )}
                {topThree[2] && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center order-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-orange-500 flex items-center justify-center mx-auto mb-2 text-sm font-bold text-orange-400">3</div>
                        <h4 className="font-bold text-white text-sm">{topThree[2].nombre}</h4>
                        <div className="text-xl font-extrabold text-orange-400 font-mono mt-1">{topThree[2].puntos} pts</div>
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                            <th className="py-3 px-4">Posición</th>
                            <th className="py-3 px-4">Operario</th>
                            <th className="py-3 px-4">Entregas a Tiempo</th>
                            <th className="py-3 px-4">Puntualidad</th>
                            <th className="py-3 px-4 text-right">Puntaje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {leaderboard.map(item => (
                            <tr key={item.id} className="hover:bg-slate-800/40">
                                <td className="py-3 px-4 font-mono font-bold text-cyan-400">#{item.ranking}</td>
                                <td className="py-3 px-4 font-semibold text-white">{item.nombre}</td>
                                <td className="py-3 px-4 text-slate-300">{item.entregas_a_tiempo} de {(item.entregas_a_tiempo || 0) + (item.entregas_tarde || 0)}</td>
                                <td className="py-3 px-4 font-mono text-slate-300">{item.tasa_puntualidad}%</td>
                                <td className="py-3 px-4 font-mono font-extrabold text-right text-base text-white">{item.puntos} pts</td>
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
        <aside aria-label="Simulador de Hardware RFID / NFC" className="fixed bottom-4 left-4 z-40 max-w-sm w-full bg-[#0d061c]/95 border border-purple-500/50 rounded-2xl shadow-2xl p-4 backdrop-blur-md space-y-3 shadow-purple-600/20">
            <div className="flex items-center justify-between pb-2 border-b border-purple-950">
                <div className="flex items-center gap-2">
                    <img src="/static/logo_yecapixtla.png?v=20261119_v14" alt="EES Yecapixtla" className="w-5 h-5 rounded object-contain bg-white p-0.5" />
                    <IconRadio className="w-4 h-4 text-purple-400 animate-pulse" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Simulador RFID &bull; EES Yecapixtla</h4>
                </div>
                <button onClick={onClose} className="text-purple-400 hover:text-white">
                    <IconXCircle className="w-4 h-4" />
                </button>
            </div>

            <p className="text-[11px] text-purple-300/80">Haz clic en una tarjeta para simular el acercamiento al lector USB:</p>

            <div className="space-y-1">
                <div className="text-[10px] font-bold text-purple-400/80 uppercase tracking-wider">Credenciales de Usuarios:</div>
                <div className="grid grid-cols-2 gap-1.5">
                    {users.map(u => (
                        <button
                            key={u.id}
                            onClick={() => onScan(u.tag_uid)}
                            className={`p-1.5 rounded-xl text-left border text-xs truncate ${
                                activeKioskUser?.id === u.id ? 'bg-purple-600/30 border-purple-400 text-white font-bold' : 'bg-[#06020c] border-purple-900/60 text-purple-200 hover:bg-purple-950/60'
                            }`}
                        >
                            <div className="font-semibold truncate">{u.nombre}</div>
                            <div className="font-mono text-[10px] text-purple-300">{u.tag_uid}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1">
                <div className="text-[10px] font-bold text-purple-400/80 uppercase tracking-wider">Tags de Herramientas:</div>
                <div className="grid grid-cols-1 gap-1">
                    {tools.slice(0, 4).map(t => (
                        <button
                            key={t.id}
                            onClick={() => onScan(t.tag_uid)}
                            className="p-1.5 rounded-lg bg-[#06020c] hover:bg-purple-950/60 border border-purple-900/60 text-xs flex justify-between text-purple-200"
                        >
                            <span className="truncate">{t.nombre}</span>
                            <span className="font-mono text-[10px] text-purple-300 shrink-0 ml-2">{t.tag_uid}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-2 border-t border-purple-950 flex gap-1.5">
                <input
                    type="text"
                    placeholder="UID manual"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                />
                <button
                    onClick={() => { if (customInput) onScan(customInput); }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/30 transition-all"
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
function GamificationModal({ data, onClose }) {
    const isCheckout = data.type === 'checkout';

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                    isCheckout ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500' :
                    data.isOntime ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' :
                    'bg-rose-500/20 text-rose-400 border-2 border-rose-500'
                }`}>
                    {isCheckout ? <IconWrench className="w-10 h-10" /> :
                     data.isOntime ? <IconTrophy className="w-10 h-10 text-amber-400" /> :
                     <IconAlertTriangle className="w-10 h-10 text-rose-400" />}
                </div>

                <div>
                    <h3 className="text-2xl font-extrabold text-white">{data.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{data.toolName || data.message}</p>
                </div>

                {!isCheckout && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="text-xs text-slate-400">Variación de Puntos:</div>
                        <div className={`text-4xl font-extrabold font-mono ${data.isOntime ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {data.puntosDelta > 0 ? `+${data.puntosDelta}` : data.puntosDelta} PUNTOS
                        </div>
                        <div className="text-xs text-slate-300 font-semibold">{data.motivo}</div>
                        <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                            Nuevo Saldo de Puntos: <strong className="text-white font-mono">{data.nuevoSaldo} pts</strong>
                        </div>
                    </div>
                )}

                {isCheckout && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                        <p>{data.subtext}</p>
                        <p className="font-bold text-cyan-400">{data.bonus}</p>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all"
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 shadow-purple-600/20">
                <div className="flex items-center justify-between pb-2 border-b border-purple-950">
                    <div className="flex items-center gap-3">
                        <img src="/static/logo_yecapixtla.png?v=20261119_v14" alt="EES Yecapixtla UAEM" className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-purple-500/40" />
                        <div>
                            <h3 className="font-bold text-base text-white">{tool ? "Editar Herramienta" : "Nueva Herramienta"}</h3>
                            <p className="text-[10px] text-purple-300/70">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-purple-400 hover:text-white">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                        <label className="block text-slate-400 mb-1">Nombre de la Herramienta</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Código de Inventario</label>
                        <input
                            type="text"
                            value={formData.codigo_inventario}
                            onChange={e => setFormData({ ...formData, codigo_inventario: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Tag RFID UID</label>
                        <input
                            type="text"
                            value={formData.tag_uid}
                            onChange={e => setFormData({ ...formData, tag_uid: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                            placeholder="TAG-TL-001"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Categoría</label>
                        <select
                            value={formData.categoria}
                            onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        >
                            <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                            <option value="Medición y Diagnóstico">Medición y Diagnóstico</option>
                            <option value="Herramientas Manuales">Herramientas Manuales</option>
                            <option value="Soldadura">Soldadura</option>
                            <option value="Seguridad">Seguridad</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Horas Máximas de Préstamo</label>
                        <input
                            type="number"
                            value={formData.tiempo_prestamo_horas}
                            onChange={e => setFormData({ ...formData, tiempo_prestamo_horas: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Ubicación Física</label>
                        <input
                            type="text"
                            value={formData.ubicacion}
                            onChange={e => setFormData({ ...formData, ubicacion: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">Estado</label>
                        <select
                            value={formData.estado}
                            onChange={e => setFormData({ ...formData, estado: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        >
                            <option value="disponible">disponible</option>
                            <option value="prestada">prestada</option>
                            <option value="mantenimiento">mantenimiento</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-slate-400 mb-1">URL de Imagen</label>
                        <input
                            type="text"
                            value={formData.imagen_url}
                            onChange={e => setFormData({ ...formData, imagen_url: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 bg-purple-950/60 hover:bg-purple-900 rounded-xl border border-purple-500/40 text-xs text-purple-200">
                        Cancelar
                    </button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/30">
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
        puntos: user?.puntos || 100,
        estado: user?.estado || "activo",
        pin: ""
    });

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 shadow-purple-600/20">
                <div className="flex items-center justify-between pb-2 border-b border-purple-950">
                    <div className="flex items-center gap-3">
                        <img src="/static/logo_yecapixtla.png?v=20261119_v14" alt="EES Yecapixtla UAEM" className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-purple-500/40" />
                        <div>
                            <h3 className="font-bold text-base text-white">{user ? "Editar Operario / Usuario" : "Nuevo Operario"}</h3>
                            <p className="text-[10px] text-purple-300/70">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-purple-400 hover:text-white">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-400 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-400">Correo Electrónico (UAEM)</label>
                            <span className="text-[10px] text-emerald-400 font-mono">@uaem.edu.mx</span>
                        </div>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="usuario@uaem.edu.mx"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1">UID del Tag RFID Personal</label>
                        <input
                            type="text"
                            value={formData.tag_uid}
                            onChange={e => setFormData({ ...formData, tag_uid: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 mb-1">Rol</label>
                            <select
                                value={formData.rol}
                                onChange={e => setFormData({ ...formData, rol: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            >
                                <option value="user">Operario / User</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1">Estado</label>
                            <select
                                value={formData.estado}
                                onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                            >
                                <option value="activo">Activo</option>
                                <option value="bloqueado">Bloqueado</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                        <label className="block text-slate-400 mb-1">PIN / Contraseña de Seguridad (Opcional)</label>
                        <input
                            type="password"
                            value={formData.pin}
                            onChange={e => setFormData({ ...formData, pin: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                            placeholder="Dejar vacío para no modificar"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 bg-purple-950/60 hover:bg-purple-900 rounded-xl border border-purple-500/40 text-xs text-purple-200">
                        Cancelar
                    </button>
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/30">
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e071c] border-2 border-purple-900/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 shadow-purple-600/20">
                <div className="flex justify-between items-center pb-2 border-b border-purple-950">
                    <div className="flex items-center gap-3">
                        <img src="/static/logo_yecapixtla.png?v=20261119_v14" alt="EES Yecapixtla UAEM" className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-purple-500/40" />
                        <div>
                            <h3 className="font-bold text-base text-white">Perfil de Administrador</h3>
                            <p className="text-[10px] text-purple-300/70">EES Yecapixtla &bull; UAEM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-purple-400 hover:text-white">
                        <IconXCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 text-xs">
                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tag RFID Personal</label>
                        <input
                            type="text"
                            value={tagUid}
                            onChange={e => setTagUid(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                        />
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                        <label className="block text-slate-300 font-semibold mb-1">Cambiar Contraseña / PIN (Opcional)</label>
                        <input
                            type="password"
                            placeholder="PIN actual (0000)"
                            value={currentPin}
                            onChange={e => setCurrentPin(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="password"
                                placeholder="Nuevo PIN"
                                value={newPin}
                                onChange={e => setNewPin(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                            />
                            <input
                                type="password"
                                placeholder="Confirmar PIN"
                                value={confirmPin}
                                onChange={e => setConfirmPin(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 bg-purple-950/60 hover:bg-purple-900 rounded-xl border border-purple-500/40 text-purple-200 text-xs font-semibold">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/30">
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
