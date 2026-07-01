import { useEffect, useState } from "react"; import { Activity, Users, Shield, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../store/authStore"; import { useAlertStore } from "../store/alertStore"; import { useWebSocket } from "../hooks/useWebSocket";
const A = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Dashboard() {
  const t = useAuthStore((s) => s.token); const alerts = useAlertStore((s) => s.alerts); const [stats, setStats] = useState({ identities: 0, privileged: 0, alerts: 0, open: 0 }); useWebSocket();
  useEffect(() => {
    if (!t) return; fetch(`${A}/api/identities/stats`, { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()).then(setStats).catch(() => {});
  }, [t]);
  const sev = (s: string) => ({ critical: "bg-red-900/30 text-red-400 border-red-800", high: "bg-orange-900/30 text-orange-400 border-orange-800", medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800", low: "bg-green-900/30 text-green-400 border-green-800" })[s] || "";
  return (<div className="space-y-8"><h1 className="text-2xl font-bold text-white">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Identities</p><p className="text-3xl font-bold text-white mt-1">{stats.identities}</p></div><Users className="w-10 h-10 text-amber-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Privileged</p><p className="text-3xl font-bold text-white mt-1">{stats.privileged}</p></div><Shield className="w-10 h-10 text-red-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Alerts</p><p className="text-3xl font-bold text-white mt-1">{stats.alerts}</p></div><AlertTriangle className="w-10 h-10 text-yellow-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Open</p><p className="text-3xl font-bold text-white mt-1">{stats.open}</p></div><Activity className="w-10 h-10 text-orange-400/50" /></div></div>
    </div>
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Live Access Alerts</h2>
      {alerts.length === 0 ? <p className="text-gray-500 text-sm">No alerts yet. Add identities and analyze them.</p> :
      <div className="space-y-3">{alerts.slice(0, 10).map((a, i) => (<div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium text-white">{a.alert.title}</span><span className={`text-xs px-2 py-0.5 rounded border ${sev(a.alert.severity)}`}>{a.alert.severity}</span></div>
        <p className="text-sm text-gray-400">{a.alert.description}</p><p className="text-xs text-gray-600 mt-1">Identity: {a.identity_name}</p>
      </div>))}</div>}
    </div></div>);
}
