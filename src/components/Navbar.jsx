import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { clearTokens } from "../utils/tokenStorage";


import LogoSection from ".//LogoSection";
import DesktopMenu from "./DesktopMenu";
import MobileToggleButton from "./MobileToggleButton";
import MobileMenu from "./MobileMenu";

const privatePaths = ["/MisCitas", "/reservar", "/empleados", "/admin", "/dev", "/perfil", "/ajustes"];

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileSubmenuOpen, setProfileSubmenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && privatePaths.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  const photoUrl = user?.foto_perfil || "/assets/avatar-generico.png";
  const displayName = user?.nombre || "Usuario";
  const rolId = user?.rol_id || null;

  const menuItems = useMemo(() => {
    const base = [{ name: "Inicio", path: "/" }, ...(!user ? [{ name: "Login", path: "/login" }] : [])];
    switch (rolId) {
      case 1:
        base.push({ name: "Mis Citas", path: "/MisCitas" }, { name: "Reservar", path: "/reservar" });
        break;
      case 2:
        base.push({ name: "Área Empleados", path: "/empleados" });
        break;
      case 3:
        base.push({ name: "Panel Admin", path: "/admin" });
        break;
      case 4:
        base.push({ name: "Dev Tools", path: "/dev" });
        break;
      default:
        break;
    }
    return base;
  }, [rolId, user]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(getAuth());
      clearTokens();
      setUser(null);
      setUserMenuOpen(false);
      setMenuOpen(false);
      setProfileSubmenuOpen(false);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }, [setUser]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#2b2b2b] text-white border-b border-[#3f3f3f] z-50">
        <div className="mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-20">
            <LogoSection />
            <DesktopMenu
              user={user}
              photoUrl={photoUrl}
              displayName={displayName}
              menuItems={menuItems}
              userMenuOpen={userMenuOpen}
              setUserMenuOpen={setUserMenuOpen}
              handleLogout={handleLogout}
            />
            <MobileToggleButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={menuOpen}
        user={user}
        photoUrl={photoUrl}
        displayName={displayName}
        menuItems={menuItems}
        profileSubmenuOpen={profileSubmenuOpen}
        setProfileSubmenuOpen={setProfileSubmenuOpen}
        handleLogout={handleLogout}
        setMenuOpen={setMenuOpen}
      />

      <div className="h-20" aria-hidden="true"></div>
    </>
  );
}

export default React.memo(Navbar);
