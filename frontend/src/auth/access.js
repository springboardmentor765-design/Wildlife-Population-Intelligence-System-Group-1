import {
  Home,
  ClipboardList,
  Image as ImageIcon,
  AudioLines,
  Leaf,
  Map,
  BarChart3,
  HeartPulse,
  FileText,
  Trees,
  Sparkles,
  Users,
} from "lucide-react";

export const ROLE_LABELS = {
  researcher: "Wildlife Researcher",
  conservation_officer: "Conservation Officer",
  forest_department: "Forest Department",
  administrator: "Administrator",
};

export const ROLE_BLURB = {
  researcher: "Identify species from camera traps and soundscapes, then grow the scientific record.",
  conservation_officer: "Run field surveys, track species, and act on protection priorities.",
  forest_department: "Watch habitat, corridors, and landscape-scale population change.",
  administrator: "Monitor every account, upload, survey, and dataset in the system.",
};

const ALL_PAGE_PATHS = [
  "/dashboard",
  "/surveys",
  "/image-analysis",
  "/audio-analysis",
  "/population",
  "/species",
  "/map",
  "/biodiversity",
  "/habitat",
  "/conservation",
  "/health",
  "/reports",
  "/users",
  "/profile",
  "/alerts",
];

export const ROLE_NAV = {
  researcher: {
    main: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/image-analysis", label: "Image Analysis", icon: ImageIcon },
      { to: "/audio-analysis", label: "Audio Analysis", icon: AudioLines },
      { to: "/surveys", label: "Surveys", icon: ClipboardList },
    ],
    intel: [
      { to: "/species", label: "Species", icon: Sparkles },
      { to: "/population", label: "Population", icon: BarChart3 },
      { to: "/biodiversity", label: "Biodiversity", icon: Trees },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
  },
  conservation_officer: {
    main: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/surveys", label: "Surveys", icon: ClipboardList },
      { to: "/map", label: "Patrol Map", icon: Map },
      { to: "/conservation", label: "Actions", icon: FileText },
    ],
    intel: [
      { to: "/species", label: "Species", icon: Sparkles },
      { to: "/habitat", label: "Habitat", icon: Leaf },
      { to: "/health", label: "Health Score", icon: HeartPulse },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
  },
  forest_department: {
    main: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/map", label: "GIS Map", icon: Map },
      { to: "/habitat", label: "Habitat", icon: Leaf },
      { to: "/surveys", label: "Surveys", icon: ClipboardList },
    ],
    intel: [
      { to: "/population", label: "Population", icon: BarChart3 },
      { to: "/conservation", label: "Recommendations", icon: FileText },
      { to: "/health", label: "Health Score", icon: HeartPulse },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
  },
  administrator: {
    main: [
      { to: "/dashboard", label: "Control center", icon: Home },
      { to: "/users", label: "Users", icon: Users },
      { to: "/surveys", label: "All surveys", icon: ClipboardList },
      { to: "/image-analysis", label: "All images", icon: ImageIcon },
    ],
    intel: [
      { to: "/audio-analysis", label: "All audio", icon: AudioLines },
      { to: "/population", label: "Population", icon: BarChart3 },
      { to: "/species", label: "Species", icon: Sparkles },
      { to: "/map", label: "GIS Map", icon: Map },
      { to: "/reports", label: "Reports", icon: FileText },
    ],
  },
};

export function navFor(role) {
  return ROLE_NAV[role] || ROLE_NAV.researcher;
}

export function canAccess(role, path) {
  if (!role || !path) return false;
  if (path === "/profile") return true;
  if (role === "administrator") return true;
  const nav = navFor(role);
  const allowed = [...nav.main, ...nav.intel].map((item) => item.to);
  return allowed.some((to) => path === to || path.startsWith(`${to}/`));
}

export function firstAllowedPath(role) {
  return "/dashboard";
}

export { ALL_PAGE_PATHS };
