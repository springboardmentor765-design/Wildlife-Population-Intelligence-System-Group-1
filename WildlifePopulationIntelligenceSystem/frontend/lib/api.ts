export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function api<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.detail ?? "The request could not be completed.", response.status);
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export type ApiUser = { id: number; name: string; email: string; role: "admin" | "administrator" | "researcher" | "forest_officer"; is_active: boolean };
export type AuthResult = { access_token: string; token_type: string; user: ApiUser };
export const login = (email: string, password: string) => api<AuthResult>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const registerAccount = (data: { name: string; email: string; password: string; role: string }) => api<ApiUser>("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const getDashboard = (token: string) => api<import("@/lib/api").DashboardData>("/analytics/dashboard", {}, token);
export type DashboardData = { total_species: number; total_population: number; images_processed: number; audio_recordings: number; average_confidence: number; recent_detections: Array<{id:number;type:string;species:string;confidence:number|null;location:string|null;count:number;created_at:string}>; population_activity: Array<{month:string;population:number}>; ai_insight:string };
export type DetectionBox = { id:number; class_id:number; confidence:number; bbox:number[]; species:{common_name:string;scientific_name:string} };
export type Detection = { id:number; file_name:string; annotated_image_url?:string|null; detections?:DetectionBox[]; species?:{common_name:string;scientific_name:string}; animal_count?:number|null; confidence:number|null; location:string|null; status:string; created_at:string };
export const getImages = (token: string) => api<Detection[]>("/images/recent", {}, token);
export const uploadImage = (file: File, token: string, location?: string) => { const data = new FormData(); data.append("file", file); if (location) data.append("location", location); return api<Detection>("/images/upload", { method: "POST", body: data }, token); };
export const getAudio = (token: string) => api<Detection[]>("/audio/recent", {}, token);
export const uploadAudio = (file: File, token: string, location?: string) => { const data = new FormData(); data.append("file", file); if (location) data.append("location", location); return api<Detection>("/audio/upload", { method: "POST", body: data }, token); };

export type Species = { id: number; common_name: string; scientific_name: string; species_group: string; iucn_status: string; description?: string | null; habitat?: string | null; diet?: string | null; created_at: string; updated_at: string };
export type SpeciesInput = Pick<Species, "common_name" | "scientific_name" | "species_group" | "iucn_status"> & Partial<Pick<Species, "description" | "habitat" | "diet">>;
export const getSpecies = (token: string, search = "") => api<Species[]>(`/species?limit=100${search ? `&search=${encodeURIComponent(search)}` : ""}`, {}, token);
export const createSpecies = (data: SpeciesInput, token: string) => api<Species>("/species", { method: "POST", body: JSON.stringify(data) }, token);
export const updateSpecies = (id: number, data: Partial<SpeciesInput>, token: string) => api<Species>(`/species/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);
export const deleteSpecies = (id: number, token: string) => api<void>(`/species/${id}`, { method: "DELETE" }, token);

export type PopulationRecord = { id: number; species_id: number; species?: Species | null; location: string; latitude?: number | null; longitude?: number | null; population_count: number; confidence?: number | null; observation_date: string; source: string; created_at: string };
export type PopulationInput = Pick<PopulationRecord, "species_id" | "location" | "population_count" | "observation_date"> & Partial<Pick<PopulationRecord, "latitude" | "longitude" | "confidence" | "source">>;
export type PopulationSummary = { total_population: number; number_of_species: number; population_by_species: Array<{ species: string; population: number }>; recent_observations: PopulationRecord[]; population_trend_data: Array<{ month: string; population: number }> };
export const getPopulation = (token: string) => api<PopulationRecord[]>("/population?limit=100", {}, token);
export const getPopulationSummary = (token: string) => api<PopulationSummary>("/population/summary", {}, token);
export const createPopulation = (data: PopulationInput, token: string) => api<PopulationRecord>("/population", { method: "POST", body: JSON.stringify(data) }, token);
export const updatePopulation = (id: number, data: Partial<PopulationInput>, token: string) => api<PopulationRecord>(`/population/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);
export const deletePopulation = (id: number, token: string) => api<void>(`/population/${id}`, { method: "DELETE" }, token);

export type Report = { id: number; name: string; report_type: string; created_by: number; status: string; file_path?: string | null; created_at: string; generated_at?: string | null };
export const getReports = (token: string) => api<Report[]>("/reports", {}, token);
export const createReport = (data: { name: string; report_type: string }, token: string) => api<Report>("/reports", { method: "POST", body: JSON.stringify(data) }, token);
export const generateReport = (id: number, token: string) => api<Report>(`/reports/${id}/generate`, { method: "POST" }, token);
export const deleteReport = (id: number, token: string) => api<void>(`/reports/${id}`, { method: "DELETE" }, token);
export const reportDownloadUrl = (id: number) => `${API_URL}/reports/${id}/download`;
export async function downloadReport(id: number, token: string, name: string) {
  const response = await fetch(reportDownloadUrl(id), { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new ApiError("Unable to download report.", response.status);
  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `${name}.pdf`; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  URL.revokeObjectURL(url);
}

export const getSettings = (token: string) => api<ApiUser>("/settings", {}, token);
export const updateSettings = (data: Partial<Pick<ApiUser, "name" | "email">>, token: string) => api<ApiUser>("/settings", { method: "PUT", body: JSON.stringify(data) }, token);
export const changePassword = (data: { current_password: string; new_password: string }, token: string) => api<ApiUser>("/settings/password", { method: "PUT", body: JSON.stringify(data) }, token);
export const getAnalyticsPopulation = (token: string) => api<{ population_trends: Array<{ month: string; population: number }> }>("/analytics/population", {}, token);
export const getAnalyticsSpecies = (token: string) => api<{ species_distribution: Array<{ species: string; image_detections: number; audio_detections: number }> }>("/analytics/species", {}, token);
export const getUsers = (token: string) => api<ApiUser[]>("/users?limit=100", {}, token);
