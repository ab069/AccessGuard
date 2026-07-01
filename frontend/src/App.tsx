import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; import Dashboard from "./pages/Dashboard"; import Identities from "./pages/Identities";
import Layout from "./components/Layout"; import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  return (<Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}><Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} /> <Route path="/identities" element={<Identities />} />
    </Route></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>);
}
