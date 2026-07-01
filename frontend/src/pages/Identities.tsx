import { useEffect, useState } from "react"; import { Plus, Search } from "lucide-react";
import { useAuthStore } from "../store/authStore"; import { useWebSocket } from "../hooks/useWebSocket";
const A = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Identities() {
  const t = useAuthStore((s) => s.token)!; const [idents, setIdents] = useState<any[]>([]); const [show, setShow] = useState(false); const [alerts, setAlerts] = useState<any[]>([]); const [viewAlerts, setViewAlerts] = useState<string | null>(null);
  const [un, setUn] = useState(""); const [src, setSrc] = useState(""); const [role, setRole] = useState(""); const [dept, setDept] = useState(""); const [priv, setPriv] = useState(false);
  const { send } = useWebSocket();

  const fetch = async () => { const r = await fetch(`${A}/api/identities`, { headers: { Authorization: `Bearer ${t}` } }); const d = await r.json(); setIdents(Array.isArray(d) ? d : []); };
  useEffect(() => { fetch(); }, [t]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); await fetch(`${A}/api/identities`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` }, body: JSON.stringify({ username: un, source: src, role: role || null, department: dept || null, is_privileged: priv }) });
    setShow(false); setUn(""); setSrc(""); setRole(""); setDept(""); fetch();
  };

  const analyze = async (id: string) => send({ action: "analyze", identity_id: id });

  const loadAlerts = async () => {
    const r = await fetch(`${A}/api/identities/alerts`, { headers: { Authorization: `Bearer ${t}` } }); const d = await r.json(); setAlerts(Array.isArray(d) ? d : []);
  };

  const sev = (s: string) => ({ critical: "bg-red-900/30 text-red-400 border-red-800", high: "bg-orange-900/30 text-orange-400 border-orange-800", medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800", low: "bg-green-900/30 text-green-400 border-green-800" })[s] || "bg-gray-800 text-gray-400";

  return (<div className="space-y-6">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-white">IAM Identities</h1>
      <button onClick={() => setShow(!show)} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"><Plus className="w-4 h-4" /> Add Identity</button></div>

    {show && <form onSubmit={create} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-400 mb-1">Username</label><input type="text" value={un} onChange={(e) => setUn(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" required /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Source</label><input type="text" value={src} onChange={(e) => setSrc(e.target.value)} placeholder="aws-iam, azure-ad, okta..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" required /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Role</label><input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Department</label><input type="text" value={dept} onChange={(e) => setDept(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" /></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={priv} onChange={(e) => setPriv(e.target.checked)} className="w-4 h-4" /><label className="text-sm text-gray-400">Privileged identity</label></div>
      </div>
      <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg transition-colors">Add Identity</button>
    </form>}

    <div className="space-y-4">{idents.length === 0 ? <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">No identities registered.</div> :
      idents.map((i) => (<div key={i.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div><h3 className="text-white font-semibold">{i.username}</h3>
            <div className="flex gap-3 mt-1 text-sm text-gray-400">
              <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">{i.source}</span>
              {i.role && <span>{i.role}</span>}
              {i.department && <span>{i.department}</span>}
              <span className={`text-xs px-2 py-0.5 rounded ${i.is_privileged ? "bg-red-900/30 text-red-400" : "bg-gray-800 text-gray-400"}`}>{i.is_privileged ? "Privileged" : "Standard"}</span>
              {i.risk_score !== null && <span className="text-xs text-amber-400">Risk: {i.risk_score}</span>}
            </div>
          </div>
          <button onClick={() => analyze(i.id)} className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg transition-colors">Analyze</button>
        </div>
      </div>))
    }</div>

    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Alerts</h2>
        <button onClick={loadAlerts} className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-400 transition-colors"><Search className="w-3 h-3" /> Refresh</button></div>
      <div className="space-y-2">{alerts.map((a) => (<div key={a.id} className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-start gap-2">
        <span className={`text-xs px-1.5 py-0.5 rounded border ${sev(a.severity)} whitespace-nowrap mt-0.5`}>{a.severity}</span>
        <div><p className="text-sm text-gray-300">{a.title}</p><p className="text-xs text-gray-500">{a.description}</p></div>
      </div>))}</div>
    </div></div>);
}
