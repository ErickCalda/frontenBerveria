import { useEffect, useRef, useCallback, useContext, useState } from "react";
import gsap from "gsap";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { loginGoogle } from "../service/authService";
import { saveAccessToken, saveRefreshToken } from "../utils/tokenStorage";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const containerRef = useRef(null);
  const alertRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" }); // type: success | error

  // Animación entrada
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
      }
    );
  }, []);

  // Animar alerta cuando cambie
  useEffect(() => {
    if (!alert.message) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        alertRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
      tl.to(alertRef.current, { opacity: 0, y: -20, delay: 3, duration: 0.5, ease: "power2.in", onComplete: () => setAlert({ type: "", message: "" }) });
    }, alertRef);

    return () => ctx.revert();
  }, [alert]);

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userFirebase = result.user;
      const idToken = await userFirebase.getIdToken();

      const response = await loginGoogle(idToken);
     

      if (response?.accessToken && response?.refreshToken && response?.usuario) {
        saveAccessToken(response.accessToken);
        saveRefreshToken(response.refreshToken);
        setUser(response.usuario);
        setAlert({ type: "success", message: "Inicio de sesión exitoso. ¡Bienvenido!" });

        // Pequeña pausa antes de navegar para que el usuario vea el mensaje
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setAlert({ type: "error", message: "Error: tokens o usuario no válidos." });
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setAlert({ type: "error", message: "Fallo al iniciar sesión con Google." });
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center px-4 sm:px-6 min-w-[320px] min-h-screen bg-transparent relative"
      style={{
        fontFamily: "var(--font-display)",
        color: "var(--color-barber-gold)",
      }}
    >
      <div
        className="max-w-md w-full rounded-[5px] p-8 sm:p-12 text-center shadow-lg"
        style={{
          backgroundColor: "var(--color-barber-dark)",
          color: "var(--color-barber-dark)",
          position: "relative",
          overflow: "visible",
        }}
      >
        <h1
          className="mb-6 sm:mb-8 select-none leading-tight"
          style={{
            color: "var(--color-barber-white)",
            letterSpacing: "0.12em",
            fontWeight: 600,
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

        {/* ALERTA */}
        {alert.message && (
          <div
            ref={alertRef}
            className={`mb-6 px-4 py-3 rounded-md text-center font-semibold select-none ${
              alert.type === "success"
                ? "bg-green-600 text-green-100"
                : "bg-red-700 text-red-100"
            } shadow-lg`}
            role="alert"
            aria-live="assertive"
          >
            {alert.message}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          aria-label="Iniciar sesión con Google"
          className="flex items-center justify-center gap-3 rounded-[5px] py-3 px-6 sm:px-8 font-semibold shadow-md transition duration-300 select-none focus:outline-none focus:ring-4 focus:ring-yellow-400 mx-auto min-w-[180px] sm:min-w-[220px] bg-white text-black hover:bg-gray-200 hover:text-yellow-600 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {/* Spinner mientras carga */}
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-yellow-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}

          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Logo Google"
            className="w-5 h-5 sm:w-6 sm:h-6"
            draggable={false}
            style={{ filter: loading ? "grayscale(100%)" : "none" }}
          />
          <span className="text-base sm:text-lg tracking-wide">
            {loading ? "Cargando..." : "Inicia sesión"}
          </span>
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
