import React from "react";
import { NavLink } from "react-router-dom";

const GOLD = "#FFD700";

function UserMenuMobile({ photoUrl, displayName, handleLogout, setMenuOpen }) {
  return (
    <div className="pb-6 mb-8 text-center select-none">
      <img
        src={photoUrl}
        alt={displayName}
        className="w-16 h-16 rounded-full border-4 border-transparent mx-auto mb-5 object-cover  duration-300 hover:shadow-[0_0_12px_rgba(255,215,0,0.8)]"
        loading="lazy"
      />

      <div className="text-white text-xl tracking-wide mb-6">{displayName}</div>

      <button
        onClick={() => {
          handleLogout();
          setMenuOpen(false);
        }}
        className="block mx-auto px-10 py-3 text-yellow-400 text-lg font-semibold cursor-pointer select-none transition-colors duration-300 hover:text-white"
        type="button"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default function MobileMenu({
  isOpen,
  user,
  photoUrl,
  displayName,
  menuItems,
  handleLogout,
  setMenuOpen,
}) {
  return (
    <div
      id="mobile-menu"
      style={{
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(0,0,0,0.5)",
        transform: isOpen ? "translateY(0)" : "translateY(-20px)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none", // evita interacción cuando está cerrado
        transition: "opacity 300ms ease, transform 300ms ease",
      }}
      className="fixed top-16 left-0 right-0 px-10 py-8 font-sans select-none z-40 "
    >
      {user && (
        <UserMenuMobile
          photoUrl={photoUrl}
          displayName={displayName}
          handleLogout={handleLogout}
          setMenuOpen={setMenuOpen}
        />
      )}

      <nav className="flex flex-col gap-8">
        {menuItems.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `text-xl cursor-pointer tracking-wide select-none transition-colors duration-300 ${
                isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
              }`
            }
            onClick={() => setMenuOpen(false)}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
