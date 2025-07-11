import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Fondo from "../pages/Fondo";
import Admin from "../pages/vista_admin/AdminPanel";
import EmpleadoPanel from "../pages/PanelEmpleados";
import Dev from "../pages/PanelDevTools";
import  MisCitas from "../pages/Clientes/MisCitas";
import Reservar from "../pages/Clientes/Reservar";


import { Outlet } from "react-router-dom";




export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <Fondo />
          </MainLayout>
        }
      />
    
      <Route
        path="/admin"
        element={
          <MainLayout>
            <Admin />
          </MainLayout>
        }
      />
      <Route
        path="/empleados"
        element={
          <MainLayout>
            <EmpleadoPanel />
          </MainLayout>
        }
      />
      <Route
        path="/dev"
        element={
          <MainLayout>
            <Dev />
          </MainLayout>
        }
      />
          <Route
        path="/MisCitas"
        element={
          <MainLayout>
            <MisCitas />
          </MainLayout>
        }
      />
          <Route
        path="/Reservar"
        element={
          <MainLayout>
            <Reservar/>
          </MainLayout>
        }
      />


      
    </Routes>







  );
}
