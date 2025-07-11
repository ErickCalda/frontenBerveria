import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter"; // tus rutas
import "./styles/global.css";
import ReservaPage from "./pages/ReservaPage";
import { AuthProvider } from './contexts/AuthContext'; // Ajusta ruta

createRoot(document.getElementById("root")).render(

    <BrowserRouter>
    <AuthProvider>
    <AppRouter />
    </AuthProvider>
    
    </BrowserRouter>
  
);