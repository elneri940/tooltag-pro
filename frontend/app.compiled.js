// ToolTag Pro - Sistema de Préstamo de Herramientas RFID & Gamificación
// Aplicación Full-Stack en React 18

const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;

// Interceptor global para adjuntar token JWT a todas las peticiones a la API
(function () {
  const originalFetch = window.fetch;
  window.fetch = async function (input, init = {}) {
    try {
      const token = localStorage.getItem('tooltag_token');
      const url = typeof input === 'string' ? input : input && input.url ? input.url : '';
      if (token && typeof url === 'string' && url.startsWith('/api/')) {
        init = init || {};
        const headers = new Headers(init.headers || {});
        if (!headers.has('Authorization')) {
          headers.set('Authorization', 'Bearer ' + token);
        }
        init.headers = headers;
      }
    } catch (e) {
      console.warn("Fetch interceptor warning:", e);
    }
    return originalFetch.call(this, input, init);
  };
})();

// ==========================================
// COMPONENTES DE ICONOS SVG (LUCIDE EQUIVALENT)
// ==========================================
const IconWrench = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
}));
const IconRadio = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19.1 4.9C23 8.8 23 15.1 19.1 19"
}));
const IconShield = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
}));
const IconUser = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "7",
  r: "4"
}));
const IconClock = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 6 12 12 16 14"
}));
const IconTrophy = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 22h16"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
}), /*#__PURE__*/React.createElement("path", {
  d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
}), /*#__PURE__*/React.createElement("path", {
  d: "M18 2H6v7a6 6 0 0 0 12 0V2z"
}));
const IconAlertTriangle = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "9",
  x2: "12",
  y2: "13"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "17",
  x2: "12.01",
  y2: "17"
}));
const IconCheckCircle = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "22 4 12 14.01 9 11.01"
}));
const IconXCircle = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "15",
  y1: "9",
  x2: "9",
  y2: "15"
}), /*#__PURE__*/React.createElement("line", {
  x1: "9",
  y1: "9",
  x2: "15",
  y2: "15"
}));
const IconPlus = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "5",
  x2: "12",
  y2: "19"
}), /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}));
const IconRefreshCw = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("polyline", {
  points: "23 4 23 10 17 10"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "1 20 1 14 7 14"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
}));
const IconSearch = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "11",
  cy: "11",
  r: "8"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21",
  y1: "21",
  x2: "16.65",
  y2: "16.65"
}));
const IconLogOut = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "16 17 21 12 16 7"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21",
  y1: "12",
  x2: "9",
  y2: "12"
}));
const IconSliders = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "4",
  y1: "21",
  x2: "4",
  y2: "14"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4",
  y1: "10",
  x2: "4",
  y2: "3"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "21",
  x2: "12",
  y2: "12"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "8",
  x2: "12",
  y2: "3"
}), /*#__PURE__*/React.createElement("line", {
  x1: "20",
  y1: "21",
  x2: "20",
  y2: "16"
}), /*#__PURE__*/React.createElement("line", {
  x1: "20",
  y1: "12",
  x2: "20",
  y2: "3"
}), /*#__PURE__*/React.createElement("line", {
  x1: "1",
  y1: "14",
  x2: "7",
  y2: "14"
}), /*#__PURE__*/React.createElement("line", {
  x1: "9",
  y1: "8",
  x2: "15",
  y2: "8"
}), /*#__PURE__*/React.createElement("line", {
  x1: "17",
  y1: "16",
  x2: "23",
  y2: "16"
}));
const IconVolume2 = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("polygon", {
  points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
}));
const IconSparkles = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"
}));
const IconLock = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("rect", {
  width: "18",
  height: "11",
  x: "3",
  y: "11",
  rx: "2",
  ry: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7 11V7a5 5 0 0 1 10 0v4"
}));
const IconEye = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "3"
}));
const IconEyeOff = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M9.88 9.88a3 3 0 1 0 4.24 4.24"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
}), /*#__PURE__*/React.createElement("path", {
  d: "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  y1: "2",
  x2: "22",
  y2: "22"
}));
const IconClipboard = ({
  className = "w-5 h-5"
}) => /*#__PURE__*/React.createElement("svg", {
  className: className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("rect", {
  width: "8",
  height: "4",
  x: "8",
  y: "2",
  rx: "1",
  ry: "1"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
}));

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
function App() {
  // Usuario activo en sesión: persistente en localStorage con token JWT
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem('tooltag_token');
      const saved = localStorage.getItem('tooltag_user');
      // Si hay usuario pero no hay token (sesión antigua anterior al JWT), forzar inicio de sesión limpio
      if (saved && !token) {
        localStorage.removeItem('tooltag_user');
        return null;
      }
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Modales de Autenticación inicial
  // 'user_login' | 'admin_login' | 'user_register' | 'admin_register' | null
  const [authModal, setAuthModal] = useState(null);
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [inactivitySeconds, setInactivitySeconds] = useState(15);
  const lastActivityRef = useRef(Date.now());

  // Cierre automático por inactividad para alumnos en computadoras compartidas (Opción 3)
  useEffect(() => {
    if (!currentUser || currentUser.rol !== 'user') {
      setInactivityWarning(false);
      return;
    }
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (inactivityWarning) setInactivityWarning(false);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, handleActivity, {
      passive: true
    }));
    const checkInterval = setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs > 75000 && !inactivityWarning) {
        setInactivityWarning(true);
        setInactivitySeconds(15);
      }
    }, 3000);
    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity));
      clearInterval(checkInterval);
    };
  }, [currentUser, inactivityWarning]);
  useEffect(() => {
    if (!inactivityWarning) return;
    const countdownTimer = setInterval(() => {
      setInactivitySeconds(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          handleLogout();
          setInactivityWarning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, [inactivityWarning]);

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
    setToast({
      message,
      type
    });
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
            setCurrentUser(prev => ({
              ...prev,
              ...refreshed
            }));
          }
        }
      } else {
        // Fallback de seguridad si /api/sync no estuviera listo
        const [statsRes, usersRes, toolsRes, loansRes, leadRes, setRes, txRes, reqsRes] = await Promise.all([fetch('/api/stats').then(r => r.json()), fetch('/api/users').then(r => r.json()), fetch('/api/tools').then(r => r.json()), fetch('/api/loans').then(r => r.json()), fetch('/api/leaderboard').then(r => r.json()), fetch('/api/settings').then(r => r.json()), fetch('/api/transactions').then(r => r.json()), fetch('/api/requests').then(r => r.json())]);
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
            setCurrentUser(prev => ({
              ...prev,
              ...refreshed
            }));
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
        try {
          evtSource.close();
        } catch (e) {}
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
    const handleKeyDown = e => {
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
  const processRfidScan = async tagUid => {
    tagUid = tagUid.trim();
    setLastScannedTag(tagUid);
    window.rfidAudio.playRfidBeep();
    try {
      const res = await fetch('/api/rfid/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tag_uid: tagUid
        })
      });
      const data = await res.json();
      if (!res.ok) {
        window.rfidAudio.playError();
        showToast(`Tag no registrado: ${tagUid}`, "error");
        return;
      }
      if (data.target === 'user') {
        const user = data.data;
        if (data.token) {
          localStorage.setItem('tooltag_token', data.token);
        }
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
          const loan = kioskUser.active_loans?.find(l => l.tool_id === tool.id || l.tool_tag && l.tool_tag.toUpperCase() === tagUid.toUpperCase());
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
      setPendingCheckout({
        userId,
        toolId,
        customHours,
        tool: Array.isArray(toolId) ? {
          nombre: _names
        } : selectedToolToCheckout
      });
      setPinInput("");
      setPinError("");
      setPinModalOpen(true);
      return;
    }
    if (pin) {
      try {
        const verifyRes = await fetch('/api/verify-pin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            pin: pin
          })
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(isMulti ? {
          user_id: userId,
          tool_ids: toolId,
          custom_hours: customHours
        } : {
          user_id: userId,
          tool_id: toolId,
          custom_hours: customHours
        })
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
    setReturnModal({
      loanId,
      simulateLateHours
    });
  };
  const doCheckin = async (loanId, simulateLateHours = null, condicion = 'bien', notas = '') => {
    try {
      const res = await fetch('/api/loans/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loan_id: loanId,
          simulate_late_hours: simulateLateHours,
          condicion,
          notas
        })
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
        headers: {
          'Content-Type': 'application/json'
        },
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
  const handleApproveRequest = async requestId => {
    try {
      const res = await fetch(`/api/requests/${requestId}/approve`, {
        method: 'POST'
      });
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
  const handleDeliverRequest = async requestId => {
    try {
      const res = await fetch(`/api/requests/${requestId}/deliver`, {
        method: 'POST'
      });
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          motivo
        })
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
        headers: {
          'Content-Type': 'application/json'
        },
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
      const res = await fetch('/api/seed/reset', {
        method: 'POST'
      });
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
      localStorage.removeItem('tooltag_token');
      localStorage.removeItem('tooltag_admin_tab');
      localStorage.removeItem('tooltag_user_tab');
    } catch (e) {}
    setCurrentUser(null);
    setKioskUser(null);
    showToast("Sesión cerrada correctamente", "info");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200"
  }, !currentUser && /*#__PURE__*/React.createElement(RoleLandingView, {
    onOpenLogin: role => setAuthModal(role === 'admin' ? 'admin_login' : 'user_login'),
    onOpenRegister: role => setAuthModal(role === 'admin' ? 'admin_register' : 'user_register'),
    onQuickLogin: async (email, password) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            identifier: email,
            password
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          window.rfidAudio.playSuccess();
          setCurrentUser(data.user);
          showToast(`Bienvenido ${data.user.nombre}`, "success");
        }
      } catch (e) {}
    },
    onOpenKioskDirectly: () => {
      // Acceso al Kiosco sin login fijo
      setCurrentUser({
        id: 0,
        nombre: "Operador de Kiosco",
        rol: "kiosk_standalone"
      });
    },
    onToggleSimulator: () => setSimulatorOpen(!simulatorOpen),
    simulatorOpen: simulatorOpen,
    onResetSeed: handleResetSeed
  }), currentUser && currentUser.rol === 'user' && /*#__PURE__*/React.createElement(UserPortalView, {
    currentUser: currentUser,
    onLogout: handleLogout,
    userTab: userTab,
    setUserTab: setUserTab,
    tools: tools,
    activeLoans: loans.filter(l => l.user_id === currentUser.id && l.estado === 'activo'),
    myRequests: loanRequests.filter(r => r.user_id === currentUser.id),
    transactions: transactions.filter(t => t.user_id === currentUser.id),
    leaderboard: leaderboard,
    onSendRequest: handleSendLoanRequest,
    onToggleSimulator: () => setSimulatorOpen(!simulatorOpen),
    simulatorOpen: simulatorOpen
  }), currentUser && currentUser.rol === 'admin' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col min-h-screen"
  }, /*#__PURE__*/React.createElement("header", {
    className: "border-b border-slate-200 bg-slate-50/90 backdrop-blur sticky top-0 z-40 px-4 py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla",
    className: "w-11 h-11 rounded-xl object-contain bg-white p-1 border border-slate-300 shadow-md"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "font-bold text-base sm:text-lg tracking-tight text-slate-900"
  }, "EES Yecapixtla"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300"
  }, "Admin • UAEM")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 hidden sm:block"
  }, "Sesión: ", currentUser.nombre, " (", currentUser.email, ")"))), /*#__PURE__*/React.createElement("nav", {
    className: "flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('requests'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${adminTab === 'requests' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Solicitudes"), loanRequests.filter(r => r.estado === 'pendiente').length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white"
  }, loanRequests.filter(r => r.estado === 'pendiente').length)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('loans'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${adminTab === 'loans' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconClock, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Herramientas Prestadas (", loans.filter(l => l.estado === 'activo').length, ")")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('history'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${adminTab === 'history' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Historial")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('inventory'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${adminTab === 'inventory' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconWrench, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Editar Catálogo (", tools.length, ")")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('users'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${adminTab === 'users' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconUser, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Usuarios & Puntajes (", users.length, ")")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('settings'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${adminTab === 'settings' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconSliders, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Reglas")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('kiosk'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${adminTab === 'kiosk' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Kiosco RFID"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSimulatorOpen(!simulatorOpen),
    className: `p-1.5 rounded-lg border text-xs font-semibold transition-all ${simulatorOpen ? 'bg-blue-600 text-white border-slate-300 shadow-md ' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-100'}`,
    title: "Alternar Simulador RFID"
  }, /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminProfileOpen(true),
    className: "p-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 text-slate-700 border border-slate-300",
    title: "Editar Perfil de Administrador"
  }, /*#__PURE__*/React.createElement(IconUser, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all",
    title: "Cerrar Sesión"
  }, /*#__PURE__*/React.createElement(IconLogOut, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, "Salir"))))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28"
  }, /*#__PURE__*/React.createElement(AdminDashboard, {
    adminTab: adminTab,
    setAdminTab: setAdminTab,
    stats: stats,
    tools: tools,
    users: users,
    loans: loans,
    loanRequests: loanRequests,
    settings: settings,
    onApproveRequest: handleApproveRequest,
    onDeliverRequest: handleDeliverRequest,
    onRejectRequest: handleRejectRequest,
    onCheckin: handleCheckin,
    onOpenAdjustPoints: u => {
      setTargetUserForPoints(u);
      setAdjustPointsModalOpen(true);
    },
    onSaveSettings: async newSettings => {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });
      showToast("Reglas de gamificación guardadas", "success");
      refreshAllData();
    },
    onDeleteTool: async id => {
      if (confirm("¿Eliminar esta herramienta permanentemente?")) {
        await fetch(`/api/tools/${id}`, {
          method: 'DELETE'
        });
        showToast("Herramienta eliminada", "info");
        refreshAllData();
      }
    },
    onDeleteUser: async id => {
      if (confirm("¿Eliminar este usuario?")) {
        await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        });
        showToast("Usuario eliminado", "info");
        refreshAllData();
      }
    },
    onEditTool: t => {
      setEditingTool(t);
      setToolModalOpen(true);
    },
    onNewTool: () => {
      setEditingTool(null);
      setToolModalOpen(true);
    },
    onEditUser: u => {
      setEditingUser(u);
      setUserModalOpen(true);
    },
    onNewUser: () => {
      setEditingUser(null);
      setUserModalOpen(true);
    }
    // Props de Kiosco integrado
    ,
    kioskUser: kioskUser,
    setKioskUser: setKioskUser,
    kioskTab: kioskTab,
    setKioskTab: setKioskTab,
    kioskTimeout: kioskTimeout,
    onCheckout: handleCheckout,
    onScanSimulated: processRfidScan,
    selectedToolToCheckout: selectedToolToCheckout,
    setSelectedToolToCheckout: setSelectedToolToCheckout
  }))), currentUser && currentUser.rol === 'kiosk_standalone' && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col min-h-screen"
  }, /*#__PURE__*/React.createElement("header", {
    className: "border-b border-slate-200 bg-white/90 p-4 flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-6 h-6 text-blue-700"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-slate-900 text-base"
  }, "Estación Kiosco RFID Independiente")), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all"
  }, "Volver al Portal Principal")), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6"
  }, /*#__PURE__*/React.createElement(KioskView, {
    kioskUser: kioskUser,
    setKioskUser: setKioskUser,
    kioskTab: kioskTab,
    setKioskTab: setKioskTab,
    kioskTimeout: kioskTimeout,
    setKioskTimeout: setKioskTimeout,
    tools: tools,
    loans: loans,
    onCheckout: handleCheckout,
    onCheckin: handleCheckin,
    onScanSimulated: processRfidScan,
    users: users,
    selectedToolToCheckout: selectedToolToCheckout,
    setSelectedToolToCheckout: setSelectedToolToCheckout
  }))), (authModal === 'user_login' || authModal === 'admin_login') && /*#__PURE__*/React.createElement(LoginAuthModal, {
    targetRole: authModal === 'admin_login' ? 'admin' : 'user',
    onClose: () => setAuthModal(null),
    onSuccess: (user, token) => {
      window.rfidAudio.playSuccess();
      if (token) localStorage.setItem('tooltag_token', token);
      setCurrentUser(user);
      setAuthModal(null);
      showToast(`Bienvenido ${user.nombre}`, "success");
    },
    onSwitchToRegister: authModal === 'admin_login' ? null : () => setAuthModal('user_register')
  }), authModal === 'user_register' && /*#__PURE__*/React.createElement(UserRegisterModal, {
    onClose: () => setAuthModal(null),
    onSuccess: (user, token) => {
      window.rfidAudio.playSuccess();
      if (token) localStorage.setItem('tooltag_token', token);
      setCurrentUser(user);
      setAuthModal(null);
      showToast(`Registro completo. ¡Bienvenido ${user.nombre}!`, "success");
      refreshAllData();
    },
    onSwitchToLogin: () => setAuthModal('user_login')
  }), /*#__PURE__*/React.createElement(RFIDSimulatorDrawer, {
    isOpen: simulatorOpen,
    onClose: () => setSimulatorOpen(false),
    onScan: processRfidScan,
    users: users,
    tools: tools,
    customInput: customTagInput,
    setCustomInput: setCustomTagInput,
    lastTag: lastScannedTag,
    activeKioskUser: kioskUser
  }), returnModal && /*#__PURE__*/React.createElement(ReturnConditionModal, {
    onCancel: () => setReturnModal(null),
    onConfirm: (condicion, notas) => {
      const m = returnModal;
      setReturnModal(null);
      doCheckin(m.loanId, m.simulateLateHours, condicion, notas);
    }
  }), gamificationModal && /*#__PURE__*/React.createElement(GamificationModal, {
    data: gamificationModal,
    onClose: () => setGamificationModal(null)
  }), pinModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 max-w-sm w-full shadow-lg text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-1"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla UAEM",
    className: "w-14 h-14 rounded-lg object-contain bg-white p-1 border-2 border-slate-300 shadow-md"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-slate-900"
  }, "Verificación de Seguridad"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, "Ingresa tu PIN personal de 4 dígitos para autorizar el préstamo.")), pendingCheckout?.tool && /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200"
  }, "Herramienta: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-900"
  }, pendingCheckout.tool.nombre)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "password",
    maxLength: "8",
    autoFocus: true,
    value: pinInput,
    onChange: e => {
      setPinInput(e.target.value);
      setPinError("");
    },
    onKeyDown: e => {
      if (e.key === 'Enter' && pinInput.length >= 4 && pendingCheckout) {
        e.preventDefault();
        e.stopPropagation();
        handleCheckout(pendingCheckout.userId, pendingCheckout.toolId, pendingCheckout.customHours, pinInput);
      }
    },
    className: "w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl font-mono text-slate-900 tracking-[0.5em] focus:border-blue-300 focus:outline-none",
    placeholder: "• • • •"
  }), pinError && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-rose-700 font-bold mt-2 flex items-center justify-center gap-1"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-3.5 h-3.5"
  }), " ", pinError)), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setPinModalOpen(false);
      setPendingCheckout(null);
      setPinInput("");
    },
    className: "flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (pendingCheckout && pinInput.length >= 4) {
        handleCheckout(pendingCheckout.userId, pendingCheckout.toolId, pendingCheckout.customHours, pinInput);
      } else {
        setPinError("El PIN debe tener al menos 4 dígitos");
      }
    },
    className: "flex-1 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
  }, "Verificar y Prestar")))), adminProfileOpen && /*#__PURE__*/React.createElement(AdminProfileModal, {
    users: users,
    onClose: () => setAdminProfileOpen(false),
    onSave: async () => {
      showToast("Perfil actualizado correctamente", "success");
      setAdminProfileOpen(false);
      refreshAllData();
    },
    showToast: showToast
  }), adjustPointsModalOpen && targetUserForPoints && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla UAEM",
    className: "w-12 h-12 rounded-lg object-contain bg-white p-1 border-2 border-slate-300 shadow-md"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-slate-900"
  }, "Ajuste Manual de Puntos"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Usuario: ", targetUserForPoints.nombre, " (Saldo: ", targetUserForPoints.puntos, " pts)"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-semibold text-slate-700 mb-1"
  }, "Variación (+ para bono, - para penalización)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: pointAdjustAmount,
    onChange: e => setPointAdjustAmount(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-base focus:border-blue-300 focus:outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-semibold text-slate-700 mb-1"
  }, "Motivo Obligatorio (Auditoría del Ledger)"), /*#__PURE__*/React.createElement("textarea", {
    value: pointAdjustReason,
    onChange: e => setPointAdjustReason(e.target.value),
    rows: "3",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:border-blue-300 focus:outline-none",
    placeholder: "Ej: Reconocimiento por excelencia en el cuidado de herramienta"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdjustPointsModalOpen(false),
    className: "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: submitAdjustPoints,
    className: "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
  }, "Aplicar al Ledger"))))), toolModalOpen && /*#__PURE__*/React.createElement(ToolFormModal, {
    tool: editingTool,
    onClose: () => setToolModalOpen(false),
    onSave: async formData => {
      const url = editingTool ? `/api/tools/${editingTool.id}` : '/api/tools';
      const method = editingTool ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
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
    }
  }), userModalOpen && /*#__PURE__*/React.createElement(UserFormModal, {
    user: editingUser,
    onClose: () => setUserModalOpen(false),
    onSave: async formData => {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
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
    }
  }), inactivityWarning && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-2xl border-2 border-amber-300 p-6 max-w-sm w-full shadow-2xl text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600"
  }, /*#__PURE__*/React.createElement(IconClock, {
    className: "w-6 h-6"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-lg text-slate-900"
  }, "¿Sigues ahí?"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 mt-1"
  }, "Por seguridad en equipos compartidos del taller, tu sesión se cerrará en ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-amber-600 text-sm"
  }, inactivitySeconds, "s"), ".")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      lastActivityRef.current = Date.now();
      setInactivityWarning(false);
    },
    className: "flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
  }, "Seguir aquí"), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogout,
    className: "py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
  }, "Cerrar ahora")))), toast && /*#__PURE__*/React.createElement("div", {
    className: `fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all transform  ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-300 text-slate-800'}`
  }, toast.type === 'success' && /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-5 h-5 text-emerald-700"
  }), toast.type === 'error' && /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-5 h-5 text-rose-700"
  }), toast.type === 'warning' && /*#__PURE__*/React.createElement(IconAlertTriangle, {
    className: "w-5 h-5 text-amber-700"
  }), toast.type === 'info' && /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-5 h-5 text-blue-700"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-medium"
  }, toast.message)));
}

// ==========================================
// VISTA: PANTALLA INICIAL DE SELECCIÓN DE ROL
// ==========================================
function RoleLandingView({
  onOpenLogin,
  onOpenRegister,
  onQuickLogin,
  onOpenKioskDirectly,
  onToggleSimulator,
  simulatorOpen,
  onResetSeed
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-slate-50 relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v20",
    alt: "Logo EES Yecapixtla UAEM",
    className: "w-12 h-12 object-contain"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "font-bold text-lg sm:text-xl tracking-tight text-slate-900"
  }, "EES Yecapixtla • UAEM"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300"
  }, "RFID Tools")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600"
  }, "Escuela de Estudios Superiores de Yecapixtla"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleSimulator,
    className: `px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${simulatorOpen ? 'bg-blue-600 text-white border-slate-300 shadow-md ' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`,
    title: "Simulador de Lecturas RFID"
  }, /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, "Simulador RFID")))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl w-full mx-auto py-8 sm:py-12 space-y-8 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v20",
    alt: "Logo Escuela de Estudios Superiores de Yecapixtla",
    className: "w-36 h-36 sm:w-48 sm:h-48 object-contain transition-transform duration-300 hover:scale-105"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-300 px-3.5 py-1 rounded-full inline-block"
  }, "Escuela de Estudios Superiores de Yecapixtla • UAEM"), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
  }, "Sistema de Préstamo de Herramientas"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-600 max-w-xl mx-auto leading-relaxed"
  }, "Control con tags RFID/NFC y sistema de gamificación por puntualidad para talleres y laboratorios.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white/95 border-2 border-slate-200 hover:border-slate-300 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg transition-all group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-lg bg-blue-50 border border-slate-300 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform shadow-inner"
  }, /*#__PURE__*/React.createElement(IconUser, {
    className: "w-8 h-8"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-bold text-slate-900"
  }, "Soy Usuario / Alumno"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 mt-1 leading-relaxed"
  }, "Consulta existencias de equipo, manda solicitudes de préstamo para tus prácticas, revisa tus puntos de gamificación y cuándo debes regresar tus herramientas.")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 text-xs text-slate-700 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-4 h-4 text-emerald-700 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Catálogo de herramientas disponibles")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-4 h-4 text-emerald-700 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Mandar solicitud de préstamo para talleres")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-4 h-4 text-slate-600 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Saldo de puntos acumulados por puntualidad")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-4 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenLogin('user'),
    className: "w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(IconLock, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Iniciar Sesión como Usuario")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenRegister('user'),
    className: "w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
  }, /*#__PURE__*/React.createElement(IconPlus, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Registrarme como alumno")))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white/95 border-2 border-slate-200 hover:border-slate-300 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg transition-all group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 rounded-lg bg-blue-50 border border-slate-300 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform shadow-inner"
  }, /*#__PURE__*/React.createElement(IconShield, {
    className: "w-8 h-8"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-bold text-slate-900"
  }, "Soy Administrador"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 mt-1 leading-relaxed"
  }, "Supervisa el inventario total del laboratorio, aprueba o rechaza solicitudes de préstamo, controla los tags RFID físicos y revisa los préstamos activos.")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 text-xs text-slate-700 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-4 h-4 text-slate-600 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Aprobar o rechazar solicitudes de alumnos")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-4 h-4 text-slate-600 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Control de entregas y fechas límite exactas")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-4 h-4 text-slate-600 shrink-0"
  }), /*#__PURE__*/React.createElement("span", null, "Edición de catálogo y vinculación de tags RFID")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-4 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenLogin('admin'),
    className: "w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(IconShield, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Iniciar Sesión como Administrador"))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onOpenKioskDirectly,
    className: "text-xs text-slate-600 hover:text-slate-900 underline flex items-center justify-center gap-1.5 mx-auto font-medium transition-colors"
  }, /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-4 h-4 text-slate-600"
  }), /*#__PURE__*/React.createElement("span", null, "Abrir Modo Kiosco para escanear con Lector RFID físico en el mostrador")))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl w-full mx-auto pt-6 border-t border-slate-200 text-center text-xs text-slate-600"
  }, "Escuela de Estudios Superiores de Yecapixtla • Universidad Autónoma del Estado de Morelos (UAEM)"));
}

// ==========================================
// VISTA: PORTAL RESTRINGIDO DEL OPERARIO (USUARIO)
// ==========================================

// ==========================================
// COMPONENTE: TEMPORIZADOR VISUAL EN VIVO (OPCIÓN 2)
// ==========================================
const LoanCountdownBadge = ({
  deadline
}) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);
  if (!deadline) return null;
  const dueTime = new Date(deadline.replace(' ', 'T')).getTime();
  const diffMs = dueTime - now;
  const isOverdue = diffMs <= 0;
  const absMin = Math.abs(Math.floor(diffMs / 60000));
  const hours = Math.floor(absMin / 60);
  const mins = absMin % 60;
  const timeText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  if (isOverdue) {
    return /*#__PURE__*/React.createElement("div", {
      className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-700 font-bold text-[11px] animate-pulse"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-2 h-2 rounded-full bg-rose-500"
    }), "¡Vencido hace ", timeText, "!");
  }
  if (absMin <= 90) {
    return /*#__PURE__*/React.createElement("div", {
      className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-semibold text-[11px]"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-2 h-2 rounded-full bg-amber-500 animate-ping"
    }), "Quedan ", timeText, " • ¡Entregar pronto!");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-medium text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-emerald-500"
  }), "A tiempo: ", timeText, " restantes");
};
function UserPortalView({
  currentUser,
  onLogout,
  userTab,
  setUserTab,
  tools,
  activeLoans,
  myRequests,
  transactions,
  leaderboard,
  onSendRequest,
  onToggleSimulator,
  simulatorOpen
}) {
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
  const toggleCart = tool => {
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
      const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || t.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [tools, selectedCategory, searchTerm]);
  const isBlocked = currentUser.puntos < 20 || currentUser.estado === 'bloqueado';
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col min-h-screen"
  }, /*#__PURE__*/React.createElement("header", {
    className: "border-b border-slate-200 bg-slate-50/90 backdrop-blur sticky top-0 z-40 px-4 py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla",
    className: "w-11 h-11 rounded-xl object-contain bg-white p-1 border border-slate-300 shadow-md"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-bold text-base text-slate-900"
  }, currentUser.nombre), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-2.5 py-0.5 rounded-full border bg-blue-50 text-slate-700 border-slate-300"
  }, "🏆 ", currentUser.puntos, " Pts"), (() => {
    const pts = currentUser.puntos || 100;
    const badge = pts >= 150 ? '🥇' : pts >= 100 ? '🥈' : '🥉';
    const title = pts >= 150 ? 'Maestro de Taller' : pts >= 100 ? 'Técnico Confiable' : 'Alumno Inicial';
    const maxH = pts >= 150 ? 3 : pts >= 100 ? 2 : 1;
    return /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1"
    }, /*#__PURE__*/React.createElement("span", null, badge), /*#__PURE__*/React.createElement("span", null, title, " (Límite: ", maxH, " herram.)"));
  })()), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 hidden sm:block"
  }, currentUser.email, " • EES Yecapixtla UAEM"))), /*#__PURE__*/React.createElement("nav", {
    className: "flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-200 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setUserTab('catalog'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${userTab === 'catalog' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconWrench, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Catálogo de Herramientas")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setUserTab('my_loans'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${userTab === 'my_loans' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconClock, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Mis Préstamos (", activeLoans.length, ")"), myRequests.filter(r => r.estado === 'pendiente').length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-600 text-white"
  }, myRequests.filter(r => r.estado === 'pendiente').length, " pend.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setUserTab('profile'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${userTab === 'profile' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconUser, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Mi Perfil & Puntos")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setUserTab('leaderboard'),
    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${userTab === 'leaderboard' ? 'bg-blue-600 text-white font-bold shadow-md ' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement(IconTrophy, {
    className: "w-3.5 h-3.5 text-amber-700"
  }), /*#__PURE__*/React.createElement("span", null, "Leaderboard"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleSimulator,
    className: `p-1.5 rounded-lg border text-xs font-semibold transition-all ${simulatorOpen ? 'bg-blue-600 text-white border-slate-300 shadow-md ' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-100'}`,
    title: "Simulador RFID"
  }, /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all",
    title: "Cerrar Sesión"
  }, /*#__PURE__*/React.createElement(IconLogOut, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, "Cerrar Sesión"))))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28"
  }, isBlocked && /*#__PURE__*/React.createElement("div", {
    className: "mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-rose-800 shadow-md"
  }, /*#__PURE__*/React.createElement(IconAlertTriangle, {
    className: "w-6 h-6 text-rose-700 shrink-0 mt-0.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-xs space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-sm font-bold text-rose-700 block"
  }, "ATENCIÓN: SOLICITUDES DE PRÉSTAMO BLOQUEADAS (Tienes ", currentUser.puntos, " de 20 pts mínimos requeridos)"), /*#__PURE__*/React.createElement("p", null, "Tu saldo de puntos se encuentra por debajo del umbral de seguridad debido a penalizaciones de retrasos acumulados. No puedes solicitar nuevas herramientas hasta devolver tus herramientas activas o acudir a supervisión con el Administrador."))), userTab === 'catalog' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-slate-900"
  }, "Catálogo de Herramientas del Taller"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Elige hasta ", maxTools, " herramientas y mándalas en una sola solicitud. Puedes pedir ", slotsLeft, " más ahora.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(IconSearch, {
    className: "w-4 h-4 absolute left-3 top-2.5 text-slate-500"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Buscar herramienta...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value),
    className: "bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-300 w-full sm:w-56"
  })), /*#__PURE__*/React.createElement("select", {
    value: selectedCategory,
    onChange: e => setSelectedCategory(e.target.value),
    className: "bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-300"
  }, categories.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  }, filteredTools.map(tool => {
    const isAvailable = tool.estado === 'disponible';
    return /*#__PURE__*/React.createElement("div", {
      key: tool.id,
      className: `bg-white border rounded-lg p-4 flex flex-col justify-between transition-all ${isAvailable ? 'border-slate-200 hover:border-blue-300 shadow-sm ' : 'border-slate-200 opacity-70 bg-slate-50/40'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative h-40 rounded-xl overflow-hidden bg-slate-50"
    }, /*#__PURE__*/React.createElement("img", {
      src: tool.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300",
      className: "w-full h-full object-cover"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute top-2 right-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow ${tool.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : tool.estado === 'prestada' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`
    }, tool.estado)), /*#__PURE__*/React.createElement("div", {
      className: "absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-blue-700 border border-slate-300"
    }, tool.codigo_inventario)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wider"
    }, tool.categoria), /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-sm text-slate-900 line-clamp-1 mt-0.5"
    }, tool.nombre), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-500 line-clamp-2 mt-1"
    }, tool.descripcion)), /*#__PURE__*/React.createElement("div", {
      className: "pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500"
    }, /*#__PURE__*/React.createElement("span", {
      className: "flex items-center gap-1"
    }, /*#__PURE__*/React.createElement(IconClock, {
      className: "w-3.5 h-3.5 text-blue-700"
    }), /*#__PURE__*/React.createElement("span", null, "Plazo: ", loanDays, " ", loanDays === 1 ? 'día' : 'días')), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-slate-500"
    }, tool.ubicacion))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-2"
    }, isAvailable ? /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleCart(tool),
      disabled: isBlocked || !cart.find(c => c.id === tool.id) && cart.length >= slotsLeft,
      className: `w-full py-2.5 px-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${cart.find(c => c.id === tool.id) ? 'bg-emerald-600 hover:bg-emerald-700 text-white ' : 'bg-blue-600 hover:bg-blue-700 text-white '}`
    }, /*#__PURE__*/React.createElement(IconClipboard, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("span", null, cart.find(c => c.id === tool.id) ? '✓ En mi solicitud (quitar)' : 'Agregar a mi solicitud')) : /*#__PURE__*/React.createElement("div", {
      className: "text-center py-2 px-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-medium border border-slate-200"
    }, tool.estado === 'prestada' ? 'Actualmente en Préstamo' : 'En Mantenimiento Preventivo')));
  }))), userTab === 'catalog' && cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl bg-white border border-slate-300 rounded-lg p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-700"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-900"
  }, cart.length, " de ", slotsLeft), " seleccionadas: ", cart.map(c => c.nombre).join(' · ')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setRequestOpen(true),
    className: "px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md whitespace-nowrap"
  }, "Enviar solicitud")), requestOpen && cart.length > 0 && /*#__PURE__*/React.createElement(RequestCartModal, {
    tools: cart,
    loanDays: loanDays,
    onClose: () => setRequestOpen(false),
    onRemove: id => setCart(prev => prev.filter(c => c.id !== id)),
    onSubmit: async motivo => {
      const ok = await onSendRequest(cart.map(c => c.id), motivo);
      if (ok) {
        setCart([]);
        setRequestOpen(false);
      }
    }
  }), userTab === 'my_loans' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-slate-900 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconWrench, {
    className: "w-5 h-5 text-blue-700"
  }), /*#__PURE__*/React.createElement("span", null, "Herramientas en tu Poder (", activeLoans.length, ")")), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-500"
  }, "Revisa la fecha límite de devolución para no perder puntos.")), activeLoans.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500"
  }, "No tienes ninguna herramienta prestada en este momento.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, activeLoans.map(loan => {
    const isOverdue = loan.vencido === 1;
    return /*#__PURE__*/React.createElement("div", {
      key: loan.id,
      className: `p-5 rounded-lg border flex flex-col justify-between space-y-4 ${isOverdue ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-xs text-blue-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
    }, loan.codigo_inventario), /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-base text-slate-900 mt-1.5"
    }, loan.tool_nombre)), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] font-bold px-2.5 py-1 rounded-full border ${isOverdue ? 'bg-rose-50 text-rose-700 border-rose-200 ' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`
    }, isOverdue ? '¡VENCIDO!' : 'EN PLAZO')), /*#__PURE__*/React.createElement("div", {
      className: "bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-slate-500"
    }, /*#__PURE__*/React.createElement("span", null, "Fecha de salida:"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-slate-700"
    }, loan.fecha_prestamo)), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-slate-500"
    }, /*#__PURE__*/React.createElement("span", null, "Fecha límite de entrega:"), /*#__PURE__*/React.createElement("span", {
      className: `font-mono font-bold ${isOverdue ? 'text-rose-700' : 'text-slate-800'}`
    }, loan.fecha_limite)), /*#__PURE__*/React.createElement("div", {
      className: "pt-2 border-t border-slate-200"
    }, /*#__PURE__*/React.createElement(LoanCountdownBadge, {
      deadline: loan.fecha_limite
    }))), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-slate-500 italic"
    }, isOverdue ? "⚠️ Entrega lo antes posible en el mostrador o Kiosco para detener penalizaciones." : "¡Entrégala a tiempo para sumar +10 puntos a tu ranking!"));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 pt-4 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-slate-900 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    className: "w-5 h-5 text-blue-700"
  }), /*#__PURE__*/React.createElement("span", null, "Historial de Solicitudes Enviadas (", myRequests.length, ")")), myRequests.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500"
  }, "No has enviado solicitudes de préstamo recientemente.") : /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Herramienta"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Fecha Solicitud"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Horas"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Motivo de Uso"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Estado"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, myRequests.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    className: "hover:bg-slate-100"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-semibold text-slate-900"
  }, r.tool_nombre), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-500"
  }, r.fecha_solicitud), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-700"
  }, r.tiempo_horas, "h"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-700 max-w-xs truncate"
  }, r.motivo), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${r.estado === 'pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200 ' : r.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`
  }, r.estado === 'aprobada' ? r.loan_id ? 'entregada' : 'aprobada · pasa por tu material' : r.estado))))))))), userTab === 'profile' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-5"
  }, /*#__PURE__*/React.createElement("img", {
    src: currentUser.avatar_url || "/static/logo_yecapixtla.png",
    className: "w-20 h-20 rounded-lg object-contain bg-white p-0.5 border-2 border-blue-200 shadow-sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-bold text-slate-900"
  }, currentUser.nombre), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono px-2 py-0.5 rounded bg-slate-50 text-blue-700 border border-slate-200"
  }, currentUser.tag_uid)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, currentUser.email), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500"
  }, "Rol: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-900 uppercase"
  }, "Operario")), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500"
  }, "Estado: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-emerald-700 uppercase"
  }, currentUser.estado))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-6 rounded-lg border border-slate-200 text-center min-w-[180px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-slate-500 uppercase tracking-widest block"
  }, "Tus Puntos Actuales"), /*#__PURE__*/React.createElement("span", {
    className: "text-4xl font-bold text-blue-700 font-mono"
  }, currentUser.puntos), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 block mt-1"
  }, "Saldo de Gamificación"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-base flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconTrophy, {
    className: "w-4 h-4 text-amber-700"
  }), /*#__PURE__*/React.createElement("span", null, "Historial Contable de Puntos (Ledger de Auditoría)")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Fecha"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Variación"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Motivo / Evento"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Saldo Resultante"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, transactions.map(tx => /*#__PURE__*/React.createElement("tr", {
    key: tx.id,
    className: "hover:bg-slate-100"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-500"
  }, tx.fecha), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `font-mono font-bold px-2 py-0.5 rounded text-xs ${tx.cantidad > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`
  }, tx.cantidad > 0 ? `+${tx.cantidad}` : tx.cantidad, " pts")), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-800"
  }, tx.motivo), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono font-bold text-right text-slate-700"
  }, tx.saldo_resultante, " pts")))))))), userTab === 'leaderboard' && /*#__PURE__*/React.createElement(LeaderboardView, {
    leaderboard: leaderboard
  })));
}

// ==========================================
// VISTA: PANEL COMPLETO DE ADMINISTRADOR
// ==========================================
function AdminDashboard({
  adminTab,
  setAdminTab,
  stats,
  tools,
  users,
  loans,
  loanRequests,
  settings,
  onApproveRequest,
  onDeliverRequest,
  onRejectRequest,
  onCheckin,
  onOpenAdjustPoints,
  onSaveSettings,
  onDeleteTool,
  onDeleteUser,
  onEditTool,
  onNewTool,
  onEditUser,
  onNewUser,
  // Kiosco
  kioskUser,
  setKioskUser,
  kioskTab,
  setKioskTab,
  kioskTimeout,
  onCheckout,
  onScanSimulated,
  selectedToolToCheckout,
  setSelectedToolToCheckout
}) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [loanSearch, setLoanSearch] = useState("");
  useEffect(() => setLocalSettings(settings), [settings]);
  const pendingRequests = loanRequests.filter(r => r.estado === 'pendiente');
  // Aprobadas que aún no se han entregado (el plazo todavía no cuenta)
  const readyGroups = Object.values(loanRequests.filter(r => r.estado === 'aprobada' && !r.loan_id).reduce((acc, r) => {
    const k = r.grupo || 's' + r.id;
    (acc[k] = acc[k] || []).push(r);
    return acc;
  }, {}));
  const resolvedRequests = loanRequests.filter(r => r.estado !== 'pendiente');
  const activeLoans = loans.filter(l => l.estado === 'activo');
  const filteredActiveLoans = activeLoans.filter(l => {
    if (!loanSearch.trim()) return true;
    const q = loanSearch.toLowerCase();
    return l.user_nombre && l.user_nombre.toLowerCase().includes(q) || l.matricula && String(l.matricula).toLowerCase().includes(q) || l.user_email && l.user_email.toLowerCase().includes(q) || l.tool_nombre && l.tool_nombre.toLowerCase().includes(q) || l.codigo_inventario && String(l.codigo_inventario).toLowerCase().includes(q);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, stats && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setAdminTab('requests'),
    className: "bg-white border border-slate-200 rounded-lg p-4 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow transition-all"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Solicitudes"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-amber-600 font-semibold"
  }, "Ver →")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-amber-700 mt-1"
  }, stats.requests?.pendientes || 0), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-slate-500 mt-1"
  }, "pendientes de aprobar")), /*#__PURE__*/React.createElement("div", {
    onClick: () => setAdminTab('loans'),
    className: "bg-white border border-slate-200 rounded-lg p-4 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow transition-all"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Préstamos Activos"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-blue-600 font-semibold"
  }, "Devolver →")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-blue-700 mt-1"
  }, activeLoans.length), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-blue-600 font-medium mt-1"
  }, "clic para registrar devolución")), /*#__PURE__*/React.createElement("div", {
    onClick: () => setAdminTab('loans'),
    className: `bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow transition-all ${stats.loans?.vencidos > 0 ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Préstamos Vencidos"), stats.loans?.vencidos > 0 && /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-rose-600"
  })), /*#__PURE__*/React.createElement("div", {
    className: `text-2xl font-bold mt-1 ${stats.loans?.vencidos > 0 ? 'text-rose-700' : 'text-slate-500'}`
  }, stats.loans?.vencidos || 0), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-rose-700 mt-1"
  }, "con penalización activa")), /*#__PURE__*/React.createElement("div", {
    onClick: () => setAdminTab('inventory'),
    className: "bg-white border border-slate-200 rounded-lg p-4 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow transition-all"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Herramientas Total"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Catálogo →")), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-bold text-slate-900 mt-1"
  }, tools.length), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-emerald-700 mt-1"
  }, tools.filter(t => t.estado === 'disponible').length, " disponibles"))), adminTab === 'requests' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-slate-900 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconClipboard, {
    className: "w-5 h-5 text-blue-700"
  }), /*#__PURE__*/React.createElement("span", null, "Solicitudes de Préstamo Pendientes (", pendingRequests.length, ")")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Revisa la identidad del operario, sus puntos y autoriza la entrega del equipo."))), pendingRequests.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-10 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500 space-y-2"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-10 h-10 text-emerald-700 mx-auto"
  }), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-800 text-sm"
  }, "No hay solicitudes pendientes en este momento"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500"
  }, "Todas las solicitudes de los operarios han sido atendidas.")) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, pendingRequests.map(req => {
    const userAtRisk = req.user_puntos < 20;
    return /*#__PURE__*/React.createElement("div", {
      key: req.id,
      className: "bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-md"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("img", {
      src: req.user_avatar || "/static/logo_yecapixtla.png",
      className: "w-12 h-12 rounded-xl object-contain bg-white p-0.5 border border-slate-300"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-slate-900 text-sm"
    }, req.user_nombre), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] font-mono px-2 py-0.5 rounded font-bold ${userAtRisk ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700'}`
    }, req.user_puntos, " pts ", userAtRisk && "(Puntaje Bajo)"))), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded"
    }, req.fecha_solicitud)), /*#__PURE__*/React.createElement("div", {
      className: "bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-slate-500"
    }, "Herramienta solicitada:"), /*#__PURE__*/React.createElement("strong", {
      className: "text-slate-900"
    }, req.tool_nombre)), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-slate-500"
    }, "Código de inventario:"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-blue-700"
    }, req.codigo_inventario)), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-slate-500"
    }, "Plazo de entrega:"), /*#__PURE__*/React.createElement("span", {
      className: "font-bold text-slate-800"
    }, Math.round(req.tiempo_horas / 24 * 10) / 10, " ", Math.round(req.tiempo_horas / 24 * 10) / 10 === 1 ? 'día' : 'días')), req.grupo && /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1"
    }, "Pedido junto con ", pendingRequests.filter(r => r.grupo === req.grupo).length - 1, " herramienta(s) más: se aprueba o rechaza todo junto."), /*#__PURE__*/React.createElement("div", {
      className: "pt-2 border-t border-slate-200"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-slate-500 block text-[11px] mb-0.5"
    }, "Motivo de uso:"), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-700 italic"
    }, req.motivo))), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onApproveRequest(req.id),
      className: "flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
    }, /*#__PURE__*/React.createElement(IconCheckCircle, {
      className: "w-4 h-4"
    }), /*#__PURE__*/React.createElement("span", null, "Aceptar solicitud")), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const motivo = prompt("Motivo del rechazo (opcional):", "Herramienta reservada para mantenimiento");
        if (motivo !== null) onRejectRequest(req.id, motivo);
      },
      className: "py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200"
    }, "Rechazar")));
  })), readyGroups.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-4 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-sm"
  }, "Listas para entregar (", readyGroups.length, ")"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Ya aprobadas. Cuando le des el material al alumno, pulsa Entregar: ahí empieza a contar su plazo."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, readyGroups.map(group => /*#__PURE__*/React.createElement("div", {
    key: group[0].id,
    className: "bg-white border border-emerald-200 rounded-lg p-5 space-y-3 shadow-md"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-sm"
  }, group[0].user_nombre), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-slate-500"
  }, group[0].user_email)), /*#__PURE__*/React.createElement("ul", {
    className: "text-xs text-slate-800 space-y-1 list-disc pl-4"
  }, group.map(r => /*#__PURE__*/React.createElement("li", {
    key: r.id
  }, r.tool_nombre, " ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-blue-700 text-[10px]"
  }, r.codigo_inventario)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDeliverRequest(group[0].id),
    className: "w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
  }, "Entregar material (inicia el plazo)"))))), activeLoans.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pt-6 border-t border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-sm flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconClock, {
    className: "w-4 h-4 text-blue-700"
  }), /*#__PURE__*/React.createElement("span", null, "Material en Préstamo • Registrar Devolución (", activeLoans.length, ")")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "¿El alumno trajo de vuelta su herramienta a ventanilla? Haz clic en Registrar Devolución para recibirla.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('loans'),
    className: "text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", null, "Ver pestaña completa"), /*#__PURE__*/React.createElement("span", null, "→"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3"
  }, "Alumno"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3"
  }, "Herramienta"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3"
  }, "Fecha Límite"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "py-2.5 px-3 text-right"
  }, "Acción"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, filteredActiveLoans.map(l => /*#__PURE__*/React.createElement("tr", {
    key: l.id,
    className: "hover:bg-slate-50"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-slate-900"
  }, l.user_nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500"
  }, l.matricula ? `Matrícula: ${l.matricula}` : l.user_email)), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-slate-800"
  }, l.tool_nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-mono text-slate-500"
  }, l.codigo_inventario)), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 font-mono text-slate-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: l.vencido === 1 ? 'text-rose-700 font-bold' : ''
  }, l.fecha_limite)), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3"
  }, /*#__PURE__*/React.createElement(LoanCountdownBadge, {
    deadline: l.fecha_limite
  })), /*#__PURE__*/React.createElement("td", {
    className: "py-2.5 px-3 text-right"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onCheckin(l.id),
    className: "px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1 ml-auto"
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-3.5 h-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Registrar Devolución"))))))))), resolvedRequests.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pt-6 border-t border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-sm"
  }, "Historial de Solicitudes Resueltas"), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Operario"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Herramienta"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Fecha Solicitud"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Resolución"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Estado"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, resolvedRequests.slice(0, 10).map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    className: "hover:bg-slate-100"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-semibold text-slate-900"
  }, r.user_nombre), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-700"
  }, r.tool_nombre), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-500"
  }, r.fecha_solicitud), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-500"
  }, r.respuesta_admin || r.fecha_resolucion || "Aprobada"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`
  }, r.estado))))))))), adminTab === 'loans' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-slate-900 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconClock, {
    className: "w-5 h-5 text-blue-700"
  }), /*#__PURE__*/React.createElement("span", null, "Herramientas Prestadas (", activeLoans.length, ")")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Supervisa qué alumno tiene cada equipo y registra su devolución.")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Buscar por alumno, matrícula o herramienta...",
    value: loanSearch,
    onChange: e => setLoanSearch(e.target.value),
    className: "w-full sm:w-80 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
  })), activeLoans.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-10 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500"
  }, "No hay préstamos activos en este momento. Todas las herramientas están en inventario.") : /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Operario Responsable"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Puntaje"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Herramienta"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Fecha Salida"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Fecha Prevista de Regreso"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Estado Plazo"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Acción"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, activeLoans.map(l => /*#__PURE__*/React.createElement("tr", {
    key: l.id,
    className: "hover:bg-slate-100 transition-colors"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-slate-900"
  }, l.user_nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500"
  }, l.user_email)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono font-bold text-blue-700"
  }, l.user_puntos, " pts"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-slate-800"
  }, l.tool_nombre), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-slate-500"
  }, l.codigo_inventario)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-500"
  }, l.fecha_prestamo), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono font-bold"
  }, /*#__PURE__*/React.createElement("span", {
    className: l.vencido === 1 ? 'text-rose-700' : 'text-slate-800'
  }, l.fecha_limite)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement(LoanCountdownBadge, {
    deadline: l.fecha_limite
  })), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-right"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onCheckin(l.id),
    className: "px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
  }, "Registrar Devolución")))))))), adminTab === 'history' && /*#__PURE__*/React.createElement(HistoryView, null), adminTab === 'inventory' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-900 text-base"
  }, "Edición del Catálogo de Herramientas"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Agrega, edita, cambia existencias y define tiempos máximos de préstamo.")), /*#__PURE__*/React.createElement("button", {
    onClick: onNewTool,
    className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
  }, /*#__PURE__*/React.createElement(IconPlus, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Agregar Nueva Herramienta"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Herramienta"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Código"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Tag RFID"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Categoría"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Tiempo Máx"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Acciones"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, tools.map(t => /*#__PURE__*/React.createElement("tr", {
    key: t.id,
    className: "hover:bg-slate-100"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-semibold text-slate-900 flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("img", {
    src: t.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100",
    className: "w-8 h-8 rounded-lg object-cover"
  }), /*#__PURE__*/React.createElement("span", {
    className: "truncate max-w-xs"
  }, t.nombre)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-blue-700"
  }, t.codigo_inventario), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-500"
  }, t.tag_uid || /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "Sin Tag")), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-700"
  }, t.categoria), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-700"
  }, t.tiempo_prestamo_horas, "h"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${t.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : t.estado === 'prestada' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`
  }, t.estado), t.estado === 'prestada' && (t.current_borrower_name || t.prestada_a_nombre) && /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-amber-700 mt-1"
  }, "Con: ", t.current_borrower_name || t.prestada_a_nombre)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-right space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onEditTool(t),
    className: "px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold transition-all"
  }, "Editar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onDeleteTool(t.id),
    className: "px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200"
  }, "Eliminar")))))))), adminTab === 'users' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-900 text-base"
  }, "Lista de Usuarios y Puntajes"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Supervisa saldos de puntos, nombres completos y vinculación de tarjetas RFID.")), /*#__PURE__*/React.createElement("button", {
    onClick: onNewUser,
    className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
  }, /*#__PURE__*/React.createElement(IconPlus, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Registrar Nuevo Operario"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Operario (Nombres y Apellidos)"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Rol"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Tag RFID"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Puntaje Gamificado"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Acciones"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, users.map(u => /*#__PURE__*/React.createElement("tr", {
    key: u.id,
    className: "hover:bg-slate-100"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-slate-900"
  }, u.nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500"
  }, u.email)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 uppercase text-[10px] font-bold text-slate-500"
  }, u.rol), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-blue-700"
  }, u.tag_uid || "Sin Tag"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `font-mono font-bold text-sm ${u.puntos >= 110 ? 'text-emerald-700' : u.puntos >= 50 ? 'text-amber-700' : 'text-rose-700 font-bold'}`
  }, u.puntos, " pts")), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.estado === 'activo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`
  }, u.estado)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-right space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenAdjustPoints(u),
    className: "px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-50 text-amber-700 font-bold border border-amber-200"
  }, "Ajustar Pts"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onEditUser(u),
    className: "px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold transition-all"
  }, "Editar")))))))), adminTab === 'settings' && /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg p-6 shadow-md max-w-2xl space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base text-slate-900"
  }, "Parámetros del Sistema de Gamificación"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, "Configura las bonificaciones, penalizaciones y umbrales de seguridad para préstamos.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Puntos Iniciales al Registrarse"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: localSettings.initial_points || 100,
    onChange: e => setLocalSettings({
      ...localSettings,
      initial_points: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Bono por Entrega a Tiempo (+)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: localSettings.on_time_bonus || 10,
    onChange: e => setLocalSettings({
      ...localSettings,
      on_time_bonus: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Penalización Base por Retraso (-)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: localSettings.late_penalty_base || 15,
    onChange: e => setLocalSettings({
      ...localSettings,
      late_penalty_base: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Penalización por Hora de Retraso (-)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: localSettings.late_penalty_hourly || 5,
    onChange: e => setLocalSettings({
      ...localSettings,
      late_penalty_hourly: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Umbral Mínimo para Bloquear Préstamos"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: localSettings.min_points_threshold || 20,
    onChange: e => setLocalSettings({
      ...localSettings,
      min_points_threshold: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Días de préstamo (para todos)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: localSettings.loan_days_default || 1,
    onChange: e => setLocalSettings({
      ...localSettings,
      loan_days_default: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-1"
  }, "A una persona se le puede dar otro plazo desde su perfil.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Máximo de herramientas por alumno"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: localSettings.max_tools_per_request || 2,
    onChange: e => setLocalSettings({
      ...localSettings,
      max_tools_per_request: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Resta si regresa con detalles (-)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: localSettings.damage_penalty_minor || 10,
    onChange: e => setLocalSettings({
      ...localSettings,
      damage_penalty_minor: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Resta si regresa dañada (-)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: localSettings.damage_penalty_major || 30,
    onChange: e => setLocalSettings({
      ...localSettings,
      damage_penalty_major: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-200 space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-slate-900"
  }, "Horario de Atención del Taller (Ventanilla)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Los préstamos que rebasen la hora de cierre se ajustan automáticamente para proteger al alumno.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Hora de Apertura"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: localSettings.workshop_open_time || "07:30",
    onChange: e => setLocalSettings({
      ...localSettings,
      workshop_open_time: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Hora de Cierre"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: localSettings.workshop_close_time || "17:00",
    onChange: e => setLocalSettings({
      ...localSettings,
      workshop_close_time: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-200 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onSaveSettings(localSettings),
    className: "px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
  }, "Guardar Parámetros de Gamificación"))), adminTab === 'kiosk' && /*#__PURE__*/React.createElement(KioskView, {
    kioskUser: kioskUser,
    setKioskUser: setKioskUser,
    kioskTab: kioskTab,
    setKioskTab: setKioskTab,
    kioskTimeout: kioskTimeout,
    tools: tools,
    loans: loans,
    onCheckout: onCheckout,
    onCheckin: onCheckin,
    onScanSimulated: onScanSimulated,
    users: users,
    selectedToolToCheckout: selectedToolToCheckout,
    setSelectedToolToCheckout: setSelectedToolToCheckout
  }));
}

// ==========================================
// MODAL: MANDAR SOLICITUD DE PRÉSTAMO (OPERARIO)
// ==========================================
// VISTA: HISTORIAL DE PRÉSTAMOS (con filtros y descarga a Excel)
// ==========================================
function HistoryView() {
  const [filters, setFilters] = useState({
    q: '',
    estado: '',
    condicion: '',
    desde: '',
    hasta: ''
  });
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
  const set = (k, v) => setFilters(prev => ({
    ...prev,
    [k]: v
  }));
  const inputCls = "bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-300";
  const resultado = r => r.estado === 'activo' ? /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"
  }, "EN PRÉSTAMO") : r.estado === 'devuelto_a_tiempo' ? /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
  }, "A TIEMPO") : /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
  }, "TARDE");
  const condTxt = {
    bien: 'Buen estado',
    con_detalles: 'Con detalles',
    danada: 'Dañada'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-900 text-base"
  }, "Historial de Préstamos (", rows.length, ")"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Todos los préstamos: quién, qué herramienta, cuándo salió y cuándo regresó.")), /*#__PURE__*/React.createElement("a", {
    href: '/api/history.csv?' + qs() + '&token=' + encodeURIComponent(localStorage.getItem('tooltag_token') || ''),
    download: true,
    className: "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md text-center"
  }, "Descargar para Excel")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-xs"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      set('estado', '');
      set('condicion', '');
    },
    className: `px-3 py-1.5 rounded-lg font-semibold transition-all ${!filters.estado && !filters.condicion ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`
  }, "Todos"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      set('estado', 'activo');
      set('condicion', '');
    },
    className: `px-3 py-1.5 rounded-lg font-semibold transition-all ${filters.estado === 'activo' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`
  }, "En Préstamo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      set('estado', 'devuelto_a_tiempo');
      set('condicion', '');
    },
    className: `px-3 py-1.5 rounded-lg font-semibold transition-all ${filters.estado === 'devuelto_a_tiempo' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`
  }, "A Tiempo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      set('estado', 'devuelto_tarde');
      set('condicion', '');
    },
    className: `px-3 py-1.5 rounded-lg font-semibold transition-all ${filters.estado === 'devuelto_tarde' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`
  }, "Con Retraso"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      set('estado', '');
      set('condicion', 'danada');
    },
    className: `px-3 py-1.5 rounded-lg font-semibold transition-all ${filters.condicion === 'danada' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`
  }, "Dañadas / Con Detalles")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 lg:grid-cols-5 gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    "data-noscan": "1",
    value: filters.q,
    onChange: e => set('q', e.target.value),
    placeholder: "Alumno, matrícula o herramienta",
    className: inputCls + " col-span-2 lg:col-span-1"
  }), /*#__PURE__*/React.createElement("select", {
    value: filters.estado,
    onChange: e => set('estado', e.target.value),
    className: inputCls
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Todos los resultados"), /*#__PURE__*/React.createElement("option", {
    value: "activo"
  }, "En préstamo"), /*#__PURE__*/React.createElement("option", {
    value: "devuelto_a_tiempo"
  }, "Devuelto a tiempo"), /*#__PURE__*/React.createElement("option", {
    value: "devuelto_tarde"
  }, "Devuelto tarde")), /*#__PURE__*/React.createElement("select", {
    value: filters.condicion,
    onChange: e => set('condicion', e.target.value),
    className: inputCls
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Cualquier estado"), /*#__PURE__*/React.createElement("option", {
    value: "bien"
  }, "Buen estado"), /*#__PURE__*/React.createElement("option", {
    value: "con_detalles"
  }, "Con detalles"), /*#__PURE__*/React.createElement("option", {
    value: "danada"
  }, "Dañada")), /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] text-slate-500"
  }, "Desde", /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: filters.desde,
    onChange: e => set('desde', e.target.value),
    className: inputCls + " w-full mt-0.5"
  })), /*#__PURE__*/React.createElement("label", {
    className: "text-[10px] text-slate-500"
  }, "Hasta", /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: filters.hasta,
    onChange: e => set('hasta', e.target.value),
    className: inputCls + " w-full mt-0.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-md"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Alumno"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Herramienta"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Salida"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Fecha límite"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Regreso"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Resultado"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Puntos"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "8",
    className: "py-8 text-center text-slate-500"
  }, loading ? 'Cargando...' : 'No hay préstamos con esos filtros.')), rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    className: "hover:bg-slate-100"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-slate-900"
  }, r.alumno), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-mono text-slate-500"
  }, r.matricula || r.email)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-slate-800 font-semibold"
  }, r.herramienta), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-mono text-blue-700"
  }, r.codigo)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-500"
  }, r.fecha_prestamo), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-500"
  }, r.fecha_limite), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-700"
  }, r.fecha_devolucion || '—'), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4"
  }, resultado(r)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-700",
    title: r.notas_devolucion || ''
  }, condTxt[r.condicion] || '—', r.notas_devolucion ? ' 📝' : ''), /*#__PURE__*/React.createElement("td", {
    className: `py-3 px-4 text-right font-mono font-bold ${r.puntos > 0 ? 'text-emerald-700' : r.puntos < 0 ? 'text-rose-700' : 'text-slate-500'}`
  }, r.puntos === null || r.puntos === undefined ? '—' : (r.puntos > 0 ? '+' : '') + r.puntos)))))));
}

// ==========================================
// MODAL: ENVIAR SOLICITUD DE PRÉSTAMO (UNA O VARIAS HERRAMIENTAS)
// ==========================================
function RequestCartModal({
  tools,
  loanDays,
  onClose,
  onRemove,
  onSubmit
}) {
  const [motivo, setMotivo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(motivo.trim());
    setIsSubmitting(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-7 max-w-md w-full shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-mono text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border border-slate-300"
  }, "Solicitud de préstamo"), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-slate-900 mt-1"
  }, tools.length === 1 ? "1 herramienta" : tools.length + " herramientas")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-600 hover:text-slate-900"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-1.5"
  }, tools.map(t => /*#__PURE__*/React.createElement("li", {
    key: t.id,
    className: "flex items-center justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-slate-900"
  }, t.nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-mono text-blue-700"
  }, t.codigo_inventario)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onRemove(t.id),
    className: "text-rose-700 hover:text-rose-800 text-[11px] font-semibold"
  }, "Quitar")))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-blue-700 font-bold"
  }, "Plazo de entrega: ", loanDays, " ", loanDays === 1 ? 'día' : 'días', ". Devuélvelas a tiempo y en buen estado para sumar puntos."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Motivo ", /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 font-normal"
  }, "(opcional)")), /*#__PURE__*/React.createElement("textarea", {
    rows: "2",
    value: motivo,
    onChange: e => setMotivo(e.target.value),
    placeholder: "Si quieres, di para qué las necesitas",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-1"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-slate-700 font-semibold"
  }, "Seguir eligiendo"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: isSubmitting,
    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-60"
  }, isSubmitting ? "Enviando..." : "Enviar solicitud")))));
}

// ==========================================
// MODAL: LOGIN GENÉRICO (USUARIO O ADMIN)
// ==========================================
function LoginAuthModal({
  targetRole,
  onClose,
  onSuccess,
  onSwitchToRegister
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Verificar que el usuario corresponda al rol buscado si aplica
        if (targetRole === 'admin' && data.user.rol !== 'admin') {
          setError("Esta cuenta no tiene privilegios de Administrador.");
          return;
        }
        onSuccess(data.user, data.token);
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla UAEM",
    className: "w-12 h-12 rounded-lg object-contain bg-white p-1 border-2 border-slate-300 shadow-md"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300"
  }, "Acceso ", targetRole === 'admin' ? 'Administrador' : 'Alumno / Operario'), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-slate-900 mt-1"
  }, "Iniciar Sesión"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-600"
  }, "EES Yecapixtla • UAEM"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-600 hover:text-slate-900"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Correo, matrícula o número de tag"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: identifier,
    onChange: e => setIdentifier(e.target.value),
    placeholder: targetRole === 'admin' ? "admin@taller.io" : "tu correo o matrícula",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:border-blue-300 focus:outline-none",
    autoFocus: true,
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Contraseña / PIN"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: showPassword ? "text" : "password",
    value: password,
    onChange: e => setPassword(e.target.value),
    placeholder: "••••",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-slate-900 font-mono tracking-wider focus:border-blue-300 focus:outline-none",
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPassword(!showPassword),
    className: "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
  }, showPassword ? /*#__PURE__*/React.createElement(IconEyeOff, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(IconEye, {
    className: "w-4 h-4"
  })))), error && /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
  }, error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: isLoading,
    className: "w-full py-3 px-4 rounded-xl font-bold text-xs shadow-sm transition-all bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
  }, isLoading ? "Verificando..." : "Entrar al Sistema")), onSwitchToRegister && /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-slate-200 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onSwitchToRegister,
    className: "text-xs text-slate-600 hover:text-slate-700 underline font-semibold"
  }, "¿No tienes cuenta? Regístrate aquí"))));
}

// ==========================================
// MODAL: REGISTRO DE CUENTA DE USUARIO
// ==========================================
// MODAL: REGISTRO DE ALUMNO (nombre, matrícula, correo y tag)
// ==========================================
function UserRegisterModal({
  onClose,
  onSuccess,
  onSwitchToLogin
}) {
  const [nombres, setNombres] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [tagUid, setTagUid] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombres,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          matricula: matricula.trim(),
          email: email.trim().toLowerCase(),
          tag_uid: tagUid.trim() ? tagUid.trim() : null,
          password: pin.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess(data.user, data.token);
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
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-slate-600 border border-slate-300"
  }, "Registro de alumno"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-slate-900 mt-1"
  }, "Registrarme"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-600"
  }, "Tu tag es tu llave: con él te identificas para pedir y devolver herramientas.")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-600 hover:text-slate-900"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Nombre(s) *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nombres,
    onChange: e => setNombres(e.target.value),
    className: inputCls,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Apellido paterno *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: apellidoPaterno,
    onChange: e => setApellidoPaterno(e.target.value),
    className: inputCls,
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Apellido materno"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: apellidoMaterno,
    onChange: e => setApellidoMaterno(e.target.value),
    className: inputCls
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Matrícula *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: matricula,
    onChange: e => setMatricula(e.target.value),
    className: inputCls + " font-mono",
    required: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Correo *"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    className: inputCls,
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold"
  }, "Tag RFID / NFC (Opcional)"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Puedes dejarlo vacío")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    "data-noscan": "1",
    value: tagUid,
    onChange: e => setTagUid(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') e.preventDefault();
    },
    placeholder: "Opcional: escribe tu tag o déjalo vacío",
    className: "w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono tracking-wider text-center"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500"
  }, "No es obligatorio para pedir material. Puedes solicitar herramientas usando únicamente tu matrícula y correo.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Contraseña o PIN (obligatorio, mínimo 4 caracteres) *"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: pin,
    onChange: e => setPin(e.target.value),
    className: inputCls + " font-mono",
    placeholder: "Crea tu contraseña o PIN secreto",
    required: true,
    minLength: 4
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 mt-1"
  }, "Protege tu cuenta para que nadie más pueda solicitar material a tu nombre.")), error && /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
  }, error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: isLoading,
    className: "w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm mt-2 transition-all disabled:opacity-60"
  }, isLoading ? "Registrando..." : "Registrarme")), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-200 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onSwitchToLogin,
    className: "text-xs text-slate-500 hover:text-slate-900"
  }, "¿Ya estás registrado? Inicia sesión aquí"))));
}

// ==========================================
// VISTA: KIOSCO DE PRÉSTAMO Y DEVOLUCIÓN (STANDALONE / INTEGRADO)
// ==========================================
function KioskView({
  kioskUser,
  setKioskUser,
  kioskTab,
  setKioskTab,
  kioskTimeout,
  setKioskTimeout,
  tools,
  loans,
  onCheckout,
  onCheckin,
  onScanSimulated,
  users,
  selectedToolToCheckout,
  setSelectedToolToCheckout
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
  useEffect(() => {
    if (!kioskUser) {
      setCart([]);
      setCartOpen(false);
    }
  }, [kioskUser]);
  const toggleCart = tool => {
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
      const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || t.codigo_inventario.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [tools, selectedCategory, searchTerm]);
  if (!kioskUser) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col items-center justify-center py-10 px-4 min-h-[60vh]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "max-w-xl w-full text-center space-y-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative mx-auto w-44 h-44 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-0 rounded-full border-2 border-slate-300"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-4 rounded-full border-2 border-slate-300"
    }), /*#__PURE__*/React.createElement("div", {
      className: "w-36 h-36 rounded-full bg-slate-100 border-2 border-slate-300 flex flex-col items-center justify-center shadow-lg backdrop-blur p-2"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/static/logo_yecapixtla.png?v=20261120_v19",
      alt: "EES Yecapixtla",
      className: "w-16 h-16 rounded-full object-contain bg-white p-1 mb-1"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] uppercase font-bold tracking-widest text-slate-600"
    }, "RFID READY"))), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-mono uppercase tracking-widest text-slate-600 bg-slate-100 border border-slate-300 px-3 py-1 rounded-full"
    }, "EES Yecapixtla • UAEM"), /*#__PURE__*/React.createElement("h2", {
      className: "text-3xl font-bold tracking-tight text-slate-900 mt-2"
    }, "Estación Kiosco de Préstamo"), /*#__PURE__*/React.createElement("p", {
      className: "text-slate-600 text-sm max-w-md mx-auto"
    }, "Acerca tu credencial o tag ", /*#__PURE__*/React.createElement("strong", {
      className: "text-slate-600 font-bold"
    }, "RFID / NFC"), " al lector para identificarte en el mostrador.")), /*#__PURE__*/React.createElement("div", {
      className: "pt-6 border-t border-slate-200"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs uppercase font-bold tracking-wider text-slate-600 mb-3"
    }, "o selecciona un usuario para simular tag:"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 sm:grid-cols-3 gap-2"
    }, users.filter(u => u.rol === 'user').map(u => /*#__PURE__*/React.createElement("button", {
      key: u.id,
      onClick: () => onScanSimulated(u.tag_uid),
      className: "flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all text-left"
    }, /*#__PURE__*/React.createElement("img", {
      src: u.avatar_url || "/static/logo_yecapixtla.png",
      className: "w-8 h-8 rounded-full object-contain bg-white p-0.5"
    }), /*#__PURE__*/React.createElement("div", {
      className: "truncate"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-bold text-slate-900 truncate"
    }, u.nombre), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] font-mono text-blue-700"
    }, u.puntos, " pts"))))))));
  }
  const isBlocked = kioskUser.bloqueado_por_puntos || kioskUser.estado === 'bloqueado';
  const activeLoans = kioskUser.active_loans || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-md relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("img", {
    src: kioskUser.avatar_url || "/static/logo_yecapixtla.png",
    className: "w-16 h-16 rounded-lg object-contain bg-white p-0.5 border-2 border-blue-300 shadow-md"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold text-slate-900"
  }, kioskUser.nombre), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-300"
  }, "TAG: ", kioskUser.tag_uid)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, kioskUser.email), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mt-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200"
  }, "🏆 ", kioskUser.puntos, " Puntos"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-500"
  }, "Herramientas activas: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-900"
  }, activeLoans.length))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-slate-500 uppercase tracking-wider"
  }, "Cierre automático"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-xs font-bold text-blue-700"
  }, kioskTimeout, "s")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setKioskUser(null),
    className: "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 transition-all"
  }, /*#__PURE__*/React.createElement(IconLogOut, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "Finalizar Sesión")))), isBlocked && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs"
  }, /*#__PURE__*/React.createElement(IconAlertTriangle, {
    className: "w-5 h-5 text-rose-700 shrink-0 mt-0.5"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "font-bold text-rose-700 block"
  }, "PRÉSTAMOS BLOQUEADOS POR PUNTAJE INSUFICIENTE"), /*#__PURE__*/React.createElement("p", null, "Tienes menos de 20 puntos. Solo puedes devolver herramientas activas.")))), /*#__PURE__*/React.createElement("div", {
    className: "flex border-b border-slate-200 gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setKioskTab('checkout'),
    disabled: isBlocked,
    className: `pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${isBlocked ? 'opacity-40 cursor-not-allowed border-transparent text-slate-500' : kioskTab === 'checkout' ? 'border-slate-300 text-slate-600 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'}`
  }, /*#__PURE__*/React.createElement(IconPlus, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "1. Pedir Herramienta (Check-out)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setKioskTab('checkin'),
    className: `pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${kioskTab === 'checkin' ? 'border-slate-300 text-slate-600 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'}`
  }, /*#__PURE__*/React.createElement(IconCheckCircle, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", null, "2. Devolver Herramienta (Check-in) (", activeLoans.length, ")"))), kioskTab === 'checkout' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  }, filteredTools.map(tool => /*#__PURE__*/React.createElement("div", {
    key: tool.id,
    className: "bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: tool.imagen_url || "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300",
    className: "w-full h-32 rounded-xl object-cover"
  }), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-slate-900"
  }, tool.nombre), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, tool.categoria, " • Plazo: ", loanDays, " ", loanDays === 1 ? 'día' : 'días')), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 pt-2"
  }, tool.estado === 'disponible' ? /*#__PURE__*/React.createElement("button", {
    onClick: () => toggleCart(tool),
    disabled: !cart.find(c => c.id === tool.id) && cart.length >= maxTools,
    className: `w-full py-2.5 rounded-xl font-bold text-xs shadow-md disabled:opacity-40 ${cart.find(c => c.id === tool.id) ? 'bg-emerald-600 hover:bg-emerald-700 text-white ' : 'bg-blue-600 hover:bg-blue-700 text-white '}`
  }, cart.find(c => c.id === tool.id) ? '✓ Seleccionada (quitar)' : 'Seleccionar') : /*#__PURE__*/React.createElement("div", {
    className: "text-center py-1.5 text-xs text-slate-500"
  }, tool.estado)))))), kioskTab === 'checkin' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, activeLoans.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-10 bg-white border border-slate-200 rounded-lg text-xs text-slate-500"
  }, "No tienes herramientas prestadas activas.") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, activeLoans.map(loan => /*#__PURE__*/React.createElement("div", {
    key: loan.id,
    className: "bg-white border border-slate-200 p-4 rounded-lg space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-start"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-sm"
  }, loan.tool_nombre), /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-bold px-2 py-0.5 rounded ${loan.vencido === 1 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`
  }, loan.vencido === 1 ? 'VENCIDO' : 'A TIEMPO')), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Fecha límite: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-slate-900"
  }, loan.fecha_limite)), /*#__PURE__*/React.createElement("button", {
    onClick: () => onCheckin(loan.id),
    className: "w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
  }, "Registrar Devolución Ahora"))))), kioskTab === 'checkout' && cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sticky bottom-4 z-40 bg-white border border-slate-300 rounded-lg p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-700"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-900"
  }, cart.length, " de ", maxTools), " herramientas: ", cart.map(c => c.nombre).join(' · ')), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCartOpen(true),
    className: "px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
  }, "Pedir ", cart.length === 1 ? 'esta herramienta' : 'estas herramientas')), cartOpen && cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-300 rounded-lg p-6 max-w-sm w-full space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-900 text-base"
  }, "Confirmar Préstamo"), /*#__PURE__*/React.createElement("ul", {
    className: "text-xs text-slate-700 list-disc pl-4 space-y-1"
  }, cart.map(c => /*#__PURE__*/React.createElement("li", {
    key: c.id
  }, c.nombre))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-blue-700 font-bold"
  }, "Plazo de entrega: ", kioskUser.dias_prestamo || loanDays, " ", (kioskUser.dias_prestamo || loanDays) === 1 ? 'día' : 'días', ". Devuélvelas a tiempo y en buen estado para sumar puntos."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCartOpen(false),
    className: "flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      const ok = await onCheckout(kioskUser.id, cart.map(c => c.id));
      if (ok) {
        setCart([]);
      }
      setCartOpen(false);
    },
    className: "flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
  }, "Confirmar")))));
}

// ==========================================
// VISTA: LEADERBOARD DE GAMIFICACIÓN
// ==========================================
function LeaderboardView({
  leaderboard
}) {
  const topThree = leaderboard.slice(0, 3);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-8 max-w-4xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(IconTrophy, {
    className: "w-8 h-8 text-amber-700"
  }), /*#__PURE__*/React.createElement("span", null, "Leaderboard de Puntualidad")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-500"
  }, "Ranking de operarios con mayor cuidado y puntualidad en entrega de herramientas.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4"
  }, topThree[1] && /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-300 rounded-lg p-5 text-center order-2 sm:order-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold text-slate-700"
  }, "2"), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-sm"
  }, topThree[1].nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold text-slate-700 font-mono mt-1"
  }, topThree[1].puntos, " pts")), topThree[0] && /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-amber-300 rounded-lg p-6 text-center order-1 sm:order-2 relative -translate-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto mb-2 text-base font-bold"
  }, "1"), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-base"
  }, topThree[0].nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-3xl font-bold text-amber-700 font-mono mt-1"
  }, topThree[0].puntos, " pts")), topThree[2] && /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg p-5 text-center order-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-full bg-slate-100 border-2 border-amber-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold text-amber-700"
  }, "3"), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-900 text-sm"
  }, topThree[2].nombre), /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold text-amber-700 font-mono mt-1"
  }, topThree[2].puntos, " pts"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left text-xs"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Posición"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Operario"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Entregas a Tiempo"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Puntualidad"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Puntaje"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-200"
  }, leaderboard.map(item => /*#__PURE__*/React.createElement("tr", {
    key: item.id,
    className: "hover:bg-slate-100"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono font-bold text-blue-700"
  }, "#", item.ranking), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-semibold text-slate-900"
  }, item.nombre), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 text-slate-700"
  }, item.entregas_a_tiempo, " de ", (item.entregas_a_tiempo || 0) + (item.entregas_tarde || 0)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono text-slate-700"
  }, item.tasa_puntualidad, "%"), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-4 font-mono font-bold text-right text-base text-slate-900"
  }, item.puntos, " pts")))))));
}

// ==========================================
// SIMULADOR VISUAL DE HARDWARE RFID
// ==========================================
function RFIDSimulatorDrawer({
  isOpen,
  onClose,
  onScan,
  users,
  tools,
  customInput,
  setCustomInput,
  lastTag,
  activeKioskUser
}) {
  if (!isOpen) return null;
  return /*#__PURE__*/React.createElement("aside", {
    "aria-label": "Simulador de Hardware RFID / NFC",
    className: "fixed bottom-4 left-4 z-40 max-w-sm w-full bg-white/95 border border-slate-300 rounded-lg shadow-lg p-4 backdrop-blur-md space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-2 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla",
    className: "w-5 h-5 rounded object-contain bg-white p-0.5"
  }), /*#__PURE__*/React.createElement(IconRadio, {
    className: "w-4 h-4 text-slate-600"
  }), /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-slate-900 uppercase tracking-wider"
  }, "Simulador RFID • EES Yecapixtla")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-600 hover:text-slate-900"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-600"
  }, "Haz clic en una tarjeta para simular el acercamiento al lector USB:"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-600 uppercase tracking-wider"
  }, "Credenciales de Usuarios:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-1.5"
  }, users.map(u => /*#__PURE__*/React.createElement("button", {
    key: u.id,
    onClick: () => onScan(u.tag_uid),
    className: `p-1.5 rounded-xl text-left border text-xs truncate ${activeKioskUser?.id === u.id ? 'bg-blue-50 border-slate-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold truncate"
  }, u.nombre), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10px] text-slate-600"
  }, u.tag_uid))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-bold text-slate-600 uppercase tracking-wider"
  }, "Tags de Herramientas:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-1"
  }, tools.slice(0, 4).map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => onScan(t.tag_uid),
    className: "p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs flex justify-between text-slate-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate"
  }, t.nombre), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10px] text-slate-600 shrink-0 ml-2"
  }, t.tag_uid))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-200 flex gap-1.5"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "UID manual",
    value: customInput,
    onChange: e => setCustomInput(e.target.value),
    className: "flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (customInput) onScan(customInput);
    },
    className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
  }, "Escanear")));
}

// ==========================================
// MODAL DE GAMIFICACIÓN (FEEDBACK)
// ==========================================
// MODAL: ¿EN QUÉ ESTADO REGRESA LA HERRAMIENTA?
// ==========================================
function ReturnConditionModal({
  onCancel,
  onConfirm
}) {
  const [condicion, setCondicion] = useState('bien');
  const [notas, setNotas] = useState('');
  const opciones = [{
    id: 'bien',
    titulo: 'En buen estado',
    detalle: 'Sin problemas. Suma puntos si llega a tiempo.',
    cls: 'border-emerald-300 bg-emerald-50 text-emerald-800'
  }, {
    id: 'con_detalles',
    titulo: 'Con detalles',
    detalle: 'Desgaste o algo menor. Resta puntos.',
    cls: 'border-amber-300 bg-amber-50 text-amber-800'
  }, {
    id: 'danada',
    titulo: 'Dañada',
    detalle: 'Pasa a mantenimiento. Resta más puntos.',
    cls: 'border-rose-300 bg-rose-50 text-rose-800'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-300 rounded-lg p-6 max-w-sm w-full space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-slate-900 text-base"
  }, "¿Cómo regresa la herramienta?"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, opciones.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.id,
    type: "button",
    onClick: () => setCondicion(o.id),
    className: `w-full text-left p-3 rounded-xl border text-xs transition-all ${condicion === o.id ? o.cls + ' ring-2 ring-blue-300' : 'border-slate-300 text-slate-700 hover:border-slate-300'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold"
  }, o.titulo), /*#__PURE__*/React.createElement("div", {
    className: "opacity-80"
  }, o.detalle)))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    "data-noscan": "1",
    value: notas,
    onChange: e => setNotas(e.target.value),
    placeholder: "Nota (opcional): qué le pasó, qué falta...",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 pt-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    className: "flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onConfirm(condicion, notas.trim()),
    className: "flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
  }, "Registrar devolución"))));
}

// ==========================================
function GamificationModal({
  data,
  onClose
}) {
  const isCheckout = data.type === 'checkout';
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-slate-300 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-20 h-20 rounded-full mx-auto flex items-center justify-center ${isCheckout ? 'bg-blue-50 text-blue-700 border-2 border-blue-300' : data.isOntime ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300' : 'bg-rose-50 text-rose-700 border-2 border-rose-300'}`
  }, isCheckout ? /*#__PURE__*/React.createElement(IconWrench, {
    className: "w-10 h-10"
  }) : data.isOntime ? /*#__PURE__*/React.createElement(IconTrophy, {
    className: "w-10 h-10 text-amber-700"
  }) : /*#__PURE__*/React.createElement(IconAlertTriangle, {
    className: "w-10 h-10 text-rose-700"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-2xl font-bold text-slate-900"
  }, data.title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, data.toolName || data.message)), !isCheckout && /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-500"
  }, "Variación de Puntos:"), /*#__PURE__*/React.createElement("div", {
    className: `text-4xl font-bold font-mono ${data.isOntime ? 'text-emerald-700' : 'text-rose-700'}`
  }, data.puntosDelta > 0 ? `+${data.puntosDelta}` : data.puntosDelta, " PUNTOS"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-slate-700 font-semibold"
  }, data.motivo), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-200 text-xs text-slate-500"
  }, "Nuevo Saldo de Puntos: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-slate-900 font-mono"
  }, data.nuevoSaldo, " pts"))), isCheckout && /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2"
  }, /*#__PURE__*/React.createElement("p", null, data.subtext), /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-blue-700"
  }, data.bonus)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
  }, "Entendido")));
}

// ==========================================
// MODALES FORMULARIOS: HERRAMIENTAS Y USUARIOS
// ==========================================
function ToolFormModal({
  tool,
  onClose,
  onSave
}) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-2 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla UAEM",
    className: "w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-300"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base text-slate-900"
  }, tool ? "Editar Herramienta" : "Nueva Herramienta"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-600"
  }, "EES Yecapixtla • UAEM"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-600 hover:text-slate-900"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Nombre de la Herramienta"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.nombre,
    onChange: e => setFormData({
      ...formData,
      nombre: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Código de Inventario"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.codigo_inventario,
    onChange: e => setFormData({
      ...formData,
      codigo_inventario: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Tag RFID UID (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.tag_uid,
    onChange: e => setFormData({
      ...formData,
      tag_uid: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono",
    placeholder: "Opcional: TAG-TL-001"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Categoría"), /*#__PURE__*/React.createElement("select", {
    value: formData.categoria,
    onChange: e => setFormData({
      ...formData,
      categoria: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Herramientas Eléctricas"
  }, "Herramientas Eléctricas"), /*#__PURE__*/React.createElement("option", {
    value: "Medición y Diagnóstico"
  }, "Medición y Diagnóstico"), /*#__PURE__*/React.createElement("option", {
    value: "Herramientas Manuales"
  }, "Herramientas Manuales"), /*#__PURE__*/React.createElement("option", {
    value: "Soldadura"
  }, "Soldadura"), /*#__PURE__*/React.createElement("option", {
    value: "Seguridad"
  }, "Seguridad"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Horas Máximas de Préstamo"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: formData.tiempo_prestamo_horas,
    onChange: e => setFormData({
      ...formData,
      tiempo_prestamo_horas: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Ubicación Física"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.ubicacion,
    onChange: e => setFormData({
      ...formData,
      ubicacion: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Estado"), /*#__PURE__*/React.createElement("select", {
    value: formData.estado,
    onChange: e => setFormData({
      ...formData,
      estado: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  }, /*#__PURE__*/React.createElement("option", {
    value: "disponible"
  }, "disponible"), /*#__PURE__*/React.createElement("option", {
    value: "prestada"
  }, "prestada"), /*#__PURE__*/React.createElement("option", {
    value: "mantenimiento"
  }, "mantenimiento"))), /*#__PURE__*/React.createElement("div", {
    className: "col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "URL de Imagen"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.imagen_url,
    onChange: e => setFormData({
      ...formData,
      imagen_url: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-700"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSave(formData),
    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
  }, "Guardar Herramienta"))));
}
function UserFormModal({
  user,
  onClose,
  onSave
}) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-2 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla UAEM",
    className: "w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-300"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base text-slate-900"
  }, user ? "Editar Operario / Usuario" : "Nuevo Operario"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-600"
  }, "EES Yecapixtla • UAEM"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-600 hover:text-slate-900"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Nombre Completo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.nombre,
    onChange: e => setFormData({
      ...formData,
      nombre: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-slate-500"
  }, "Correo Electrónico")), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: formData.email,
    onChange: e => setFormData({
      ...formData,
      email: e.target.value
    }),
    placeholder: "correo@ejemplo.com",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Matrícula"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.matricula,
    onChange: e => setFormData({
      ...formData,
      matricula: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Días de préstamo (solo esta persona)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: formData.dias_prestamo,
    onChange: e => setFormData({
      ...formData,
      dias_prestamo: e.target.value
    }),
    placeholder: "Vacío = el general",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "UID del Tag RFID Personal (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.tag_uid,
    onChange: e => setFormData({
      ...formData,
      tag_uid: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono",
    placeholder: "Opcional: ej. AL-0001"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Rol"), /*#__PURE__*/React.createElement("select", {
    value: formData.rol,
    onChange: e => setFormData({
      ...formData,
      rol: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  }, /*#__PURE__*/React.createElement("option", {
    value: "user"
  }, "Operario / User"), /*#__PURE__*/React.createElement("option", {
    value: "admin"
  }, "Administrador"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "Estado"), /*#__PURE__*/React.createElement("select", {
    value: formData.estado,
    onChange: e => setFormData({
      ...formData,
      estado: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  }, /*#__PURE__*/React.createElement("option", {
    value: "activo"
  }, "Activo"), /*#__PURE__*/React.createElement("option", {
    value: "bloqueado"
  }, "Bloqueado")))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-500 mb-1"
  }, "PIN / Contraseña de Seguridad (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    value: formData.pin,
    onChange: e => setFormData({
      ...formData,
      pin: e.target.value
    }),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono",
    placeholder: "Dejar vacío para no modificar"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-700"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSave(formData),
    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
  }, "Guardar Usuario"))));
}
function AdminProfileModal({
  users,
  onClose,
  onSave,
  showToast
}) {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          email,
          avatar_url: avatarUrl,
          tag_uid: tagUid
        })
      });
      if (newPin) {
        if (newPin !== confirmPin) {
          showToast("Los PINs no coinciden", "error");
          return;
        }
        await fetch(`/api/users/${adminUser.id}/pin`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            current_pin: currentPin,
            pin: newPin
          })
        });
      }
      onSave();
    } catch (e) {
      showToast("Error al guardar perfil", "error");
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border-2 border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center pb-2 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/static/logo_yecapixtla.png?v=20261120_v19",
    alt: "EES Yecapixtla UAEM",
    className: "w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-300"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-base text-slate-900"
  }, "Perfil de Administrador"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-600"
  }, "EES Yecapixtla • UAEM"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-slate-600 hover:text-slate-900"
  }, /*#__PURE__*/React.createElement(IconXCircle, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Nombre Completo"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nombre,
    onChange: e => setNombre(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Correo Electrónico"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Tag RFID Personal"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: tagUid,
    onChange: e => setTagUid(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-slate-700 font-semibold mb-1"
  }, "Cambiar Contraseña / PIN (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "PIN actual (0000)",
    value: currentPin,
    onChange: e => setCurrentPin(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Nuevo PIN",
    value: newPin,
    onChange: e => setNewPin(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Confirmar PIN",
    value: confirmPin,
    onChange: e => setConfirmPin(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "px-4 py-2 bg-slate-100 hover:bg-slate-100 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: handleSave,
    className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
  }, "Guardar Perfil"))));
}

// Montar aplicación en el elemento raíz
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(/*#__PURE__*/React.createElement(App, null));