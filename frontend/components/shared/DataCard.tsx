import type { ReactNode } from "react";
export function DataCard({children,className=""}:{children:ReactNode;className?:string}){return <section className={`ui-surface rounded-[1.35rem] ${className}`}>{children}</section>}
