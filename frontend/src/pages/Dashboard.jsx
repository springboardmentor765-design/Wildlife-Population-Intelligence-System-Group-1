import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Bird,
  Camera,
  Mic,
  ClipboardList,
  Activity,
  Trees,
  Users,
  Map,
  HeartPulse,
} from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ROLE_BLURB, ROLE_LABELS } from "../auth/access";

const IUCN_COLORS = {
  LC: "#22c55e",
  NT: "#84cc16",
  VU: "#eab308",
  EN: "#f97316",
  CR: "#ef4444",
};

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "administrator") return <AdminHome user={user} />;
  if (user?.role === "conservation_officer") return <OfficerHome user={user} />;
  if (user?.role === "forest_department") return <ForestHome user={user} />;
  return <ResearcherHome user={user} />;
}

function ResearcherHome({ user }) {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [bio, setBio] = useState(null);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/population/trends"),
      api.get("/biodiversity"),
      api.get("/surveys"),
    ]).then(([s, t, b, sv]) => {
      setStats(s.data);
      setTrends(t.data.series.slice(0, 6));
      setBio(b.data);
      setSurveys(sv.data.slice(0, 5));
    });
  }, []);

  const chartData = mergeTrendPoints(trends);
  const pieData = bio ? Object.entries(bio.iucn).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="page">
      <Intro user={user} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Bird} label="Species catalog" value={stats?.species ?? "—"} hint={`${stats?.threatened_species ?? 0} threatened`} />
        <Stat icon={Camera} label="Images ingested" value={stats?.images ?? "—"} hint="Computer vision pipeline" />
        <Stat icon={Mic} label="Audio clips" value={stats?.audio ?? "—"} hint="Bioacoustic analysis" />
        <Stat icon={ClipboardList} label="Field surveys" value={stats?.surveys ?? "—"} hint={`${stats?.total_observations ?? 0} camera/audio counts`} />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <TrendCard data={chartData} className="xl:col-span-2" />
        <IucnCard pieData={pieData} />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <MovementCard trends={trends} />
        <SurveyList surveys={surveys} />
      </div>
    </div>
  );
}

function OfficerHome({ user }) {
  const [stats, setStats] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/dashboard/stats"), api.get("/surveys"), api.get("/conservation")]).then(([s, sv, c]) => {
      setStats(s.data);
      setSurveys(sv.data);
      setActions(c.data.slice(0, 4));
    });
  }, []);

  const active = surveys.filter((s) => s.status !== "Completed").length;

  return (
    <div className="page">
      <Intro user={user} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={ClipboardList} label="Surveys" value={surveys.length} hint={`${active} open in the field`} />
        <Stat icon={Bird} label="Species" value={stats?.species ?? "—"} hint={`${stats?.threatened_species ?? 0} threatened`} />
        <Stat icon={HeartPulse} label="Priority actions" value={actions.length} hint="Protection recommendations" />
        <Stat icon={Map} label="Observations" value={stats?.total_observations ?? "—"} hint="From image and audio analysis" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <SurveyList surveys={surveys.slice(0, 6)} title="Field operations" />
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Protection priorities</h2>
            <Link to="/conservation" className="text-xs text-forest-400">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {actions.map((a) => (
              <div key={`${a.species}-${a.iucn_status}`} className="rounded-xl bg-white/[0.03] px-3 py-3">
                <div className="text-sm text-white">{a.species}</div>
                <div className="text-xs capitalize text-zinc-500">
                  {a.priority} · IUCN {a.iucn_status}
                </div>
              </div>
            ))}
            {actions.length === 0 && <p className="text-sm text-zinc-500">No actions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ForestHome({ user }) {
  const [stats, setStats] = useState(null);
  const [sites, setSites] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/dashboard/stats"), api.get("/habitat"), api.get("/population/trends")]).then(([s, h, t]) => {
      setStats(s.data);
      setSites(h.data);
      setTrends(t.data.series.slice(0, 6));
    });
  }, []);

  const monitored = sites.filter((s) => s.survey_count);
  const avg = monitored.length
    ? Math.round((monitored.reduce((n, x) => n + x.score, 0) / monitored.length) * 100)
    : 0;

  return (
    <div className="page">
      <Intro user={user} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={Trees}
          label="Landscapes"
          value={sites.length}
          hint={monitored.length ? `${avg}% mean of surveyed sites` : "No field surveys yet"}
        />
        <Stat icon={ClipboardList} label="Surveys" value={stats?.surveys ?? "—"} hint="Department records" />
        <Stat icon={Bird} label="Threatened" value={stats?.threatened_species ?? "—"} hint="Species of concern" />
        <Stat icon={Activity} label="Observations" value={stats?.total_observations ?? "—"} hint="From image and audio analysis" />
      </div>
      <TrendCard data={mergeTrendPoints(trends)} />
      <div className="grid gap-3 md:grid-cols-2">
        {sites.slice(0, 6).map((s) => (
          <div key={s.name} className="glass-card flex items-center justify-between rounded-xl px-4 py-3">
            <div>
              <div className="text-sm text-white">{s.name}</div>
              <div className="text-xs text-zinc-500">{s.habitat}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-forest-400">{Math.round(s.score * 100)}</div>
              <div className="text-xs text-zinc-500">{s.survey_count ? `${s.survey_count} surveys` : "unsurveyed"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminHome({ user }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/overview")
      .then((r) => setData(r.data))
      .catch((err) => setError(err.response?.data?.detail || "Could not load admin overview"));
  }, []);

  const byRole = data?.by_role || {};

  return (
    <div className="page">
      <Intro user={user} />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users} label="All users" value={data?.users ?? "—"} hint="Accounts on the system" />
        <Stat icon={Camera} label="All images" value={data?.images ?? "—"} hint="Every uploaded still" />
        <Stat icon={Mic} label="All audio" value={data?.audio ?? "—"} hint="Every voice clip" />
        <Stat icon={ClipboardList} label="All surveys" value={data?.surveys ?? "—"} hint={`${data?.species ?? 0} species in catalog`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(ROLE_LABELS).map(([key, label]) => (
          <div key={key} className="glass-card rounded-xl px-4 py-3">
            <div className="text-xs text-zinc-500">{label}</div>
            <div className="text-xl font-semibold text-white">{byRole[key] || 0}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">People on the system</h2>
        <Link to="/users" className="text-xs text-forest-400">
          Manage users
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/[0.03] text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Images</th>
              <th className="px-4 py-3 font-medium">Audio</th>
              <th className="px-4 py-3 font-medium">Surveys</th>
            </tr>
          </thead>
          <tbody>
            {(data?.accounts || []).slice(0, 8).map((u) => (
              <tr key={u.user_id} className="border-t border-white/5 text-zinc-200">
                <td className="px-4 py-3">
                  <div className="text-white">{u.name}</div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </td>
                <td className="px-4 py-3 text-zinc-400">{ROLE_LABELS[u.role] || u.role}</td>
                <td className="px-4 py-3">{u.image_count}</td>
                <td className="px-4 py-3">{u.audio_count}</td>
                <td className="px-4 py-3">{u.survey_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ActivityList title="Latest images" rows={data?.recent_images || []} nameKey="species" extraKey="user" />
        <ActivityList title="Latest audio" rows={data?.recent_audio || []} nameKey="species" extraKey="user" />
      </div>
    </div>
  );
}

function Intro({ user }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-forest-400">Workspace</p>
      <h1 className="mt-1 text-2xl font-semibold text-white">{ROLE_LABELS[user?.role] || "Dashboard"}</h1>
      <p className="text-sm text-zinc-400">
        Welcome back, {user?.name}. {ROLE_BLURB[user?.role]}
      </p>
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-forest-500/15 text-forest-400">
        <Icon size={18} />
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-sm text-zinc-300">{label}</div>
      <div className="mt-1 text-xs text-zinc-500">{hint}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Completed: "bg-forest-500/15 text-forest-400",
    "In Progress": "bg-sky-500/15 text-sky-300",
    Pending: "bg-amber-500/15 text-amber-300",
  };
  return <span className={`w-fit rounded-full px-2.5 py-1 text-xs ${map[status] || "bg-white/10 text-zinc-300"}`}>{status}</span>;
}

function SurveyList({ surveys, title = "Recent surveys" }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <Activity size={16} className="text-forest-400" />
      </div>
      <div className="space-y-3">
        {surveys.map((s) => (
          <div key={s.survey_id} className="flex flex-col gap-2 rounded-xl bg-white/[0.03] px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="truncate text-sm text-white">{s.title}</div>
              <div className="text-xs text-zinc-500">
                {s.location} · {s.survey_date}
              </div>
            </div>
            <StatusBadge status={s.status} />
          </div>
        ))}
        {surveys.length === 0 && (
          <p className="text-sm text-zinc-500">No field surveys yet. Add one from Surveys to score habitats.</p>
        )}
      </div>
    </div>
  );
}

function TrendCard({ data, className = "" }) {
  return (
    <div className={`glass-card min-w-0 rounded-2xl p-4 sm:p-5 ${className}`}>
      <h2 className="mb-4 text-sm font-semibold text-white">Population trends</h2>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500">
          Analyze a camera-trap image or audio clip to plot live field counts.
        </p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="pop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0f1a14", border: "1px solid #1f2a22" }} />
              <Area type="monotone" dataKey="total" stroke="#22c55e" fill="url(#pop)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function IucnCard({ pieData }) {
  return (
    <div className="glass-card min-w-0 rounded-2xl p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">IUCN status mix</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {pieData.map((d) => (
                <Cell key={d.name} fill={IUCN_COLORS[d.name] || "#64748b"} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f1a14", border: "1px solid #1f2a22" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MovementCard({ trends }) {
  return (
    <div className="glass-card min-w-0 rounded-2xl p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">Species counts</h2>
      {trends.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500">No detections yet.</p>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends.map((t) => ({ name: t.species.split(" ")[0], latest: t.latest }))}>
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} interval={0} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0f1a14", border: "1px solid #1f2a22" }} />
              <Bar dataKey="latest" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function ActivityList({ title, rows, nameKey, extraKey }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h2 className="mb-4 text-sm font-semibold text-white">{title}</h2>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.image_id || row.audio_id || i} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-3">
            <div>
              <div className="text-sm text-white">{row[nameKey] || "Pending"}</div>
              <div className="text-xs text-zinc-500">{row[extraKey]}</div>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-zinc-500">No records yet.</p>}
      </div>
    </div>
  );
}

function mergeTrendPoints(series) {
  const byDate = {};
  series.forEach((s) => {
    s.points.forEach((p) => {
      byDate[p.date] = (byDate[p.date] || 0) + p.count;
    });
  });
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date: date.slice(5), total }));
}
