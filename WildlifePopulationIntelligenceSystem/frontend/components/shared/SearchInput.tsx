import { Search } from "lucide-react";
export function SearchInput({placeholder="Search…"}:{placeholder?:string}){return <div className="relative"><Search size={16} className="absolute left-3 top-3 text-[#77838a]"/><input placeholder={placeholder} className="h-10 w-64 rounded-xl border border-[#d8ddd7] bg-[#fffdf8] pl-9 pr-3 text-sm outline-none focus:border-[#2d7c78]"/></div>}
