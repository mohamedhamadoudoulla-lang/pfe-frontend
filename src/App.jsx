import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import HouseDetail from "./pages/HouseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Engineers from "./pages/Engineers";
import EngineerProfile from "./pages/EngineerProfile";

import DevisWizard from "./pages/DevisWizard";
import DevisWizard2 from "./pages/DevisWizard2";
import FinitionEconomique from "./pages/FinitionEconomique";
import FinitionStandard from "./pages/FinitionStandard";
import FinitionHautDeGamme from "./pages/FinitionHautDeGamme";

import TerrainLocation from "./pages/TerrainLocation";
import TerrainEstimation from "./pages/TerrainEstimation";
import Quote from "./pages/Quote";
import PostProject from "./pages/PostProject";
import MyProjects from "./pages/MyProjects";
import TerrainMarketplace from "./pages/TerrainMarketplace";
import EquipmentMarketplace from "./pages/EquipmentMarketplace";

import EngineerDashboard from "./pages/EngineerDashboard";
import EngineerProjects from "./pages/EngineerProjects";

import SellerDashboard from "./pages/SellerDashboard";
import TerrainVendor from "./pages/TerrainVendor";
import EquipmentVendorDashboard from "./pages/EquipmentVendorDashboard";
import ChooseEngineer from "./pages/ChooseEngineer";

import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";

/* ── Guards ── */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const ClientOnly = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "user") return <Navigate to="/" />;
  return children;
};

const EngineerOnly = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "engineer") return <Navigate to="/" />;
  return children;
};

const AdminOnly = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

const SellerOnly = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!["terrain_seller", "equipment_seller"].includes(user.role)) return <Navigate to="/" />;
  return children;
};

/* ── Routes ── */
const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      {/* ── Public ── */}
      <Route path="/"               element={<Home />} />
      <Route path="/catalogue"      element={<Catalogue />} />
      <Route path="/maison/:id"     element={<HouseDetail />} />
      <Route path="/ingenieurs"     element={<Engineers />} />
      <Route path="/ingenieur/:id"  element={<EngineerProfile />} />
      <Route path="/login"          element={<Login />} />
<Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* ── Client ── */}
      <Route path="/devis-wizard"          element={<ClientOnly><DevisWizard /></ClientOnly>} />
      <Route path="/devis-wz2"             element={<ClientOnly><DevisWizard2 /></ClientOnly>} />
      <Route path="/choisir-ingenieur"     element={<ClientOnly><ChooseEngineer /></ClientOnly>} />
      <Route path="/terrain/localisation"  element={<ClientOnly><TerrainLocation /></ClientOnly>} />
      <Route path="/terrain/estimation"    element={<ClientOnly><TerrainEstimation /></ClientOnly>} />
      <Route path="/finition/economique"   element={<ClientOnly><FinitionEconomique /></ClientOnly>} />
      <Route path="/finition/standard"     element={<ClientOnly><FinitionStandard /></ClientOnly>} />
      <Route path="/finition/haut-de-gamme" element={<ClientOnly><FinitionHautDeGamme /></ClientOnly>} />
      <Route path="/devis"                 element={<ClientOnly><Quote /></ClientOnly>} />
      <Route path="/deposer-projet"        element={<ClientOnly><PostProject /></ClientOnly>} />
      <Route path="/mes-projets"           element={<ClientOnly><MyProjects /></ClientOnly>} />
      <Route path="/terrains/marketplace"  element={<ClientOnly><TerrainMarketplace /></ClientOnly>} />
      <Route path="/equipments/marketplace" element={<ClientOnly><EquipmentMarketplace /></ClientOnly>} />

      {/* ── Ingénieur ── */}
      <Route path="/ingenieur/dashboard" element={<EngineerOnly><EngineerDashboard /></EngineerOnly>} />
      <Route path="/ingenieur/projets"   element={<EngineerOnly><EngineerProjects /></EngineerOnly>} />

      {/* ── Vendeur ── */}
      <Route path="/vendeur/dashboard"    element={<SellerOnly><SellerDashboard /></SellerOnly>} />
      <Route path="/terrains/ajouter"     element={<SellerOnly><TerrainVendor /></SellerOnly>} />
      <Route path="/equipments/dashboard" element={<SellerOnly><EquipmentVendorDashboard /></SellerOnly>} />

      {/* ── Admin ── */}
      <Route path="/admin/dashboard" element={<AdminOnly><AdminDashboard /></AdminOnly>} />

      {/* ── Privé ── */}
      <Route path="/profil"           element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      <Route path="/messages/:userId" element={<PrivateRoute><Messages /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    <Footer />
  </>
);

/* ── App principal ── */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />  {/* ← ici, une seule fois, au bon endroit */}
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}