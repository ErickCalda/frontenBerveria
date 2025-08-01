import React, { memo, useRef, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";

const UserMenuDesktop = memo(function UserMenuDesktop({
  userMenuRef,
  userMenuOpen,
  setUserMenuOpen,
  photoUrl,
  displayName,
  handleLogout,
}) {
  const toggleUserMenu = useCallback(() => setUserMenuOpen((v) => !v), [setUserMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setUserMenuOpen, userMenuRef]);

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

export default function DesktopMenu({
  user,
  photoUrl,
  displayName,
  menuItems,
  userMenuOpen,
  setUserMenuOpen,
  handleLogout,
}) {
  const userMenuRef = useRef(null);

  return (
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
          aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}
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
  );
}
