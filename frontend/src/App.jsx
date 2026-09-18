import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import KitchenPortal from "./pages/KitchenPortal";
import NGOPortal from "./pages/NGOPortal";
import AdminDashboard from "./pages/AdminDashboard";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/kitchen", label: "Kitchen Portal" },
  { to: "/ngo", label: "NGO Portal" },
  { to: "/admin", label: "Admin" },
];

export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <h1>FoodRescue AI</h1>
        <nav>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>{n.label}</Link>
          ))}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kitchen" element={<KitchenPortal />} />
          <Route path="/ngo" element={<NGOPortal />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
