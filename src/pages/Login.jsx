import { useEffect, useRef, useState, useContext } from "react";
import gsap from "gsap";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { loginGoogle } from "../service/authService";
import { saveAccessToken, saveRefreshToken } from "../utils/tokenStorage";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const containerRef = useRef();
  const [animDone, setAnimDone] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { y: -50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        onComplete: () => setAnimDone(true),
      }
    );
  }, []);

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userFirebase = result.user;
      const idToken = await userFirebase.getIdToken();

      const response = await loginGoogle(idToken);
    console.log('lo que devulve a usar logingoogle ',response)
      
    

      if (response?.accessToken && response?.refreshToken && response?.usuario) {
        saveAccessToken(response.accessToken);
        saveRefreshToken(response.refreshToken);
        setUser(response.usuario);
        navigate("/");
      } else {
        alert("Error: tokens o usuario no válidos.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("Fallo al iniciar sesión con Google");
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center px-4 sm:px-6"
      style={{
        fontFamily: "var(--font-display)",
        backgroundColor: "transparets",
        color: "var(--color-barber-gold)",
        minWidth: "320px",
        minHeight: "100vh",
      }}
    >
      <div
        className="max-w-md w-full rounded-[5px] p-8 sm:p-12 text-center shadow-lg"
        style={{
          backgroundColor: "var(--color-barber-white)",
          color: "var(--color-barber-dark)",
        }}
      >
        <h1
          className="mb-6 sm:mb-8 select-none leading-tight"
          style={{
            color: "var(--color-barber-dark)",
            letterSpacing: "0.12em",
            fontWeight: 600,
            // Fuente fluida: escala entre 2rem (32px) y 4rem (64px)
            fontSize: "clamp(1.5rem, 1.5vw, 2rem)",
            lineHeight: 1.1,
          }}
        >
          GOD MEETS 2.0
          <br className="block sm:hidden" />
          BARBERSHOP
        </h1>
  
        <p
          className="mb-8 sm:mb-12 font-normal text-base sm:text-lg leading-relaxed"
          style={{ color: "var(--color-barber-gold)" }}
        >
          Accede con tu cuenta de Google para comenzar.
        </p>
  
        <button
          onClick={handleGoogleLogin}
          aria-label="Iniciar sesión con Google"
          className="flex items-center justify-center gap-3 rounded-[5px] py-3 px-6 sm:px-8 font-semibold shadow-md transition duration-300 select-none focus:outline-none focus:ring-4 focus:ring-yellow-400 mx-auto min-w-[180px] sm:min-w-[220px]"
          style={{
            backgroundColor: "var(--color-barber-dark)",
            color: "var(--color-barber-gold)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#727272";
            e.currentTarget.style.color = "#ffe000";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#303030 ";
            e.currentTarget.style.color = "var(--color-barber-gold)";
          }}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Logo Google"
            className="w-5 h-5 sm:w-6 sm:h-6"
            draggable={false}
            style={{ filter: "invert(100%)" }} // invertir colores para que se vea en negro cuando fondo es dorado
          />
          <span className="text-base sm:text-lg tracking-wide">Inicia sesión</span>
        </button>
      </div>
  
      <footer
        className="absolute bottom-6 text-center w-full select-none text-sm tracking-wide px-4"
        style={{ color: "var(--color-barber-white)", fontWeight: "300" }}
      >
        © {new Date().getFullYear()} La Barbería
      </footer>
    </div>
  );
  
  
  
  
  
  
}
