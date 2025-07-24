import React, { useContext, useState, useRef, useEffect, useCallback, memo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { clearTokens } from "../utils/tokenStorage";

const MENU_TRANSITION_DURATION = 500; // ms

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileSubmenuOpen, setProfileSubmenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const menuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const auth = getAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Definir rutas privadas (paths)
  const privatePaths = ["/MisCitas", "/reservar", "/empleados", "/admin", "/dev", "/perfil", "/ajustes"];

  // Redirigir si no está logueado y en ruta privada
  useEffect(() => {
    if (!user && privatePaths.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  // Memoizar la URL de la foto y nombre para evitar recalculos en render
  const photoUrl = user?.foto_perfil || "/assets/avatar-generico.png";
  const displayName = user?.nombre || "Usuario";
  const rolId = user?.rol_id || null;

  // Predefinir menú base (memoizar para que no se regenere)
  const menuItems = React.useMemo(() => {
    const base = [
      { name: "Inicio", path: "/" },
 
      ...(!user ? [{ name: "Login", path: "/login" }] : []),
    ];
    if (rolId === 1) {
      base.push({ name: "Mis Citas", path: "/MisCitas" });
      base.push({ name: "Reservar", path: "/reservar" });
    } else if (rolId === 2) {
      base.push({ name: "Área Empleados", path: "/empleados" });
    } else if (rolId === 3) {
      base.push({ name: "Panel Admin", path: "/admin" });
    } else if (rolId === 4) {
      base.push({ name: "Dev Tools", path: "/dev" });
    }
    return base;
  }, [rolId, user]);

  // Calcular altura menú móvil solo si está abierto (optimizado)
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight);
    } else {
      setMenuHeight(0);
    }
  }, [menuOpen]);

  // Cerrar menú usuario si clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
        setProfileSubmenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      clearTokens();
      setUser(null);
      setUserMenuOpen(false);
      setMenuOpen(false);
      setProfileSubmenuOpen(false);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }, [auth, setUser]);

  // Componentes SVG memoizados para evitar render innecesario
  const HamburgerIcon = memo(() => (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ));

  const CloseIcon = memo(() => (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ));

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 bg-[#2b2b2b] text-white shadow-md z-50 border-b border-[#3f3f3f]"
        role="navigation"
        aria-label="Menú principal"
      >
        <div className="mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <NavLink to="/" className="block w-12 h-12" aria-label="Inicio">
                <img
                  src="assets/logo.avif"
                  alt="Logo God Meets 2.0"
                  className="w-full h-full object-cover rounded-full shadow-sm border border-[#A07C1A]"
                  loading="lazy"
                />
              </NavLink>
              <div
                className="text-xl md:text-2xl font-bold tracking-wide select-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                GOD MEETS 2.0
                <br className="block sm:hidden" /> BARBERSHOP
              </div>
            </div>

            {/* Menu desktop */}
            <div className="hidden md:flex space-x-8 items-center">
              {menuItems.map(({ name, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive ? "bg-[#A07C1A] text-white shadow-sm" : "text-gray-200 hover:text-white hover:bg-[#3a2f1d]"
                    }`
                  }
                  style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}
                  aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                >
                  {name}
                </NavLink>
              ))}

              {user && (
                <UserMenuDesktop
                  userMenuRef={userMenuRef}
                  userMenuOpen={userMenuOpen}
                  setUserMenuOpen={setUserMenuOpen}
                  photoUrl={photoUrl}
                  displayName={displayName}
                  handleLogout={handleLogout}
                />
              )}
            </div>

            {/* Botón menú móvil */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label="Abrir menú principal"
                className="p-2"
                type="button"
              >
                {!menuOpen ? <HamburgerIcon /> : <CloseIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        ref={menuRef}
        style={{
          maxHeight: menuOpen ? menuHeight : 0,
          opacity: menuOpen ? 1 : 0,
          transition: `max-height ${MENU_TRANSITION_DURATION}ms ease, opacity 0.3s ease`,
          overflow: "hidden",
        }}
        className="fixed top-16 left-0 right-0 bg-[#2b2b2b] rounded-b-md shadow-lg px-6 py-6 text-gray-300 font-sans select-none z-40"
      >
        {user && (
          <UserMenuMobile
            photoUrl={photoUrl}
            displayName={displayName}
            profileSubmenuOpen={profileSubmenuOpen}
            setProfileSubmenuOpen={setProfileSubmenuOpen}
            handleLogout={handleLogout}
            setMenuOpen={setMenuOpen}
          />
        )}

        <div className="space-y-3">
          {menuItems.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `block px-5 py-3 rounded-md text-gray-300 hover:bg-[#A07C1A] hover:text-white transition-colors duration-200 text-lg font-semibold tracking-wide ${
                  isActive ? "bg-[#A07C1A] text-white" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              {name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Spacer para que no tape el contenido */}
      <div className="h-20" aria-hidden="true"></div>
    </>
  );
}

// Componente menú usuario escritorio memoizado
const UserMenuDesktop = memo(function UserMenuDesktop({
  userMenuRef,
  userMenuOpen,
  setUserMenuOpen,
  photoUrl,
  displayName,
  handleLogout,
}) {
  const toggleUserMenu = useCallback(() => setUserMenuOpen((v) => !v), [setUserMenuOpen]);

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={toggleUserMenu}
        className="flex items-center space-x-2"
        aria-haspopup="true"
        aria-expanded={userMenuOpen}
        aria-label="Menú de usuario"
        type="button"
      >
        <img
          src={photoUrl}
          alt={displayName}
          className="w-9 h-9 rounded-full border border-white bg-white shadow-inner object-cover"
          loading="lazy"
        />
        <span className="hidden sm:inline text-white font-medium select-none">{displayName}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-44 bg-[#1f1f1f] text-white rounded-md shadow-lg border border-[#3f3f3f] overflow-hidden transition-all duration-200 ${
          userMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        role="menu"
        aria-label="Opciones de usuario"
      >
        <NavLink
          to="/perfil"
          onClick={() => setUserMenuOpen(false)}
          className="block px-4 py-2 hover:bg-[#A07C1A]"
          role="menuitem"
          tabIndex={userMenuOpen ? 0 : -1}
        >
          Perfil
        </NavLink>
        <NavLink
          to="/ajustes"
          onClick={() => setUserMenuOpen(false)}
          className="block px-4 py-2 hover:bg-[#A07C1A]"
          role="menuitem"
          tabIndex={userMenuOpen ? 0 : -1}
        >
          Ajustes
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full text-left block px-4 py-2 hover:bg-[#A07C1A]"
          role="menuitem"
          tabIndex={userMenuOpen ? 0 : -1}
          type="button"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
});

// Componente menú usuario móvil memoizado
const UserMenuMobile = memo(function UserMenuMobile({
  photoUrl,
  displayName,
  profileSubmenuOpen,
  setProfileSubmenuOpen,
  handleLogout,
  setMenuOpen,
}) {
  const toggleProfileSubmenu = useCallback(() => setProfileSubmenuOpen((v) => !v), [setProfileSubmenuOpen]);

  return (
    <div className="border-b border-[#444444] pb-4 mb-5">
      <img
        src={photoUrl}
        alt={displayName}
        className="w-14 h-14 rounded-full border border-gray-600 bg-gray-800 mx-auto mb-4 object-cover"
        loading="lazy"
      />

      <button
        onClick={toggleProfileSubmenu}
        className="flex justify-center items-center w-full text-lg font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-200 focus:outline-none"
        aria-expanded={profileSubmenuOpen}
        aria-controls="submenu-perfil"
        type="button"
      >
        {displayName}
        <svg
          className={`w-5 h-5 ml-2 transition-transform duration-300 ${profileSubmenuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id="submenu-perfil"
        className={`mt-3 rounded-md overflow-hidden bg-[#1f1f1f] transition-max-height duration-300 ease-in-out ${
          profileSubmenuOpen ? "max-h-40" : "max-h-0"
        }`}
        style={{ transitionProperty: "max-height" }}
      >
        <NavLink
          to="/ajustes"
          className="block px-5 py-2 text-gray-300 hover:bg-[#A07C1A] hover:text-white rounded-md transition-colors duration-200"
          onClick={() => {
            setProfileSubmenuOpen(false);
            setMenuOpen(false);
          }}
        >
          Ajustes
        </NavLink>
        <button
          onClick={() => {
            handleLogout();
            setProfileSubmenuOpen(false);
            setMenuOpen(false);
          }}
          className="block w-full text-left px-5 py-2 text-gray-300 hover:bg-[#A07C1A] hover:text-white rounded-md transition-colors duration-200"
          type="button"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
});

export default memo(Navbar);
