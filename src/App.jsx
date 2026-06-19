import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Catalogue3D from "./pages/Catalogue3D";
import PropertyDetail from "./pages/PropertyDetail";
import HouseDetail from "./pages/HouseDetail";
import TerrainDetail from "./pages/TerrainDetail";
import Services from "./pages/Services";
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
import RecommandationsMarketplace from "./pages/RecommandationsMarketplace";
import RecommandationMateriaux from "./pages/RecommandationMateriaux";

import EngineerDashboard from "./pages/EngineerDashboard";
import EngineerProjects from "./pages/EngineerProjects";
import EngineerProfileCreate from "./pages/EngineerProfileCreate";

import SellerDashboard from "./pages/SellerDashboard";
import TerrainVendor from "./pages/TerrainVendor";
import EquipmentVendorDashboard from "./pages/EquipmentVendorDashboard";
import VendorProducts from "./pages/VendorProducts";
import PanierPage from "./pages/PanierPage";
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

const EquipmentSellerOnly = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "equipment_seller") return <Navigate to="/" />;
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
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Navbar />
    <div style={{ flex: 1 }}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"               element={<Home />} />
        <Route path="/catalogue"      element={<Catalogue3D />} />
        <Route path="/services"      element={<Services />} />
        <Route path="/property/:id"   element={<PropertyDetail />} />
        <Route path="/maison/:id"     element={<HouseDetail />} />
        <Route path="/terrain/:id"    element={<TerrainDetail />} />
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
        <Route path="/recommandation-materiaux/:estimationId" element={<ClientOnly><RecommandationMateriaux /></ClientOnly>} />
        <Route path="/devis"                 element={<ClientOnly><Quote /></ClientOnly>} />
        <Route path="/marketplace/:devisId"  element={<ClientOnly><RecommandationsMarketplace /></ClientOnly>} />
        <Route path="/deposer-projet"        element={<ClientOnly><PostProject /></ClientOnly>} />
        <Route path="/mes-projets"           element={<ClientOnly><MyProjects /></ClientOnly>} />
        <Route path="/terrains/marketplace"  element={<ClientOnly><TerrainMarketplace /></ClientOnly>} />
        <Route path="/equipments/marketplace" element={<ClientOnly><EquipmentMarketplace /></ClientOnly>} />
        <Route path="/panier"                element={<PrivateRoute><PanierPage /></PrivateRoute>} />

        {/* ── Ingénieur ── */}
        <Route path="/ingenieur/dashboard" element={<EngineerOnly><EngineerDashboard /></EngineerOnly>} />
        <Route path="/ingenieur/projets"   element={<EngineerOnly><EngineerProjects /></EngineerOnly>} />
        <Route path="/ingenieur/profil-creation" element={<EngineerOnly><EngineerProfileCreate /></EngineerOnly>} />

        {/* ── Vendeur ── */}
        <Route path="/vendeur/dashboard"    element={<EquipmentSellerOnly><SellerDashboard /></EquipmentSellerOnly>} />
        <Route path="/vendeur/produits"     element={<EquipmentSellerOnly><VendorProducts /></EquipmentSellerOnly>} />
        <Route path="/terrains/ajouter"     element={<SellerOnly><TerrainVendor /></SellerOnly>} />
        <Route path="/equipments/dashboard" element={<EquipmentSellerOnly><VendorProducts /></EquipmentSellerOnly>} />

        {/* ── Admin ── */}
        <Route path="/admin/dashboard" element={<AdminOnly><AdminDashboard /></AdminOnly>} />

        {/* ── Privé ── */}
        <Route path="/profil"           element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/messages/:userId" element={<PrivateRoute><Messages /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
    <Footer />
  </div>
);

/* ── App principal ── */
export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
        <ScrollToTop />
        <Toaster position="top-right" />
        {splashDone && <AppRoutes />}
      </AuthProvider>
    </BrowserRouter>
  );
}