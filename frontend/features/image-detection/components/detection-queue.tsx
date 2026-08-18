"use client";

import {
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";

import { DataCard } from "@/components/shared/DataCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

const queue = [
  {
    file: "tiger_001.jpg",
    subtitle: "Wildlife Camera Trap Image",
    progress: 100,
    status: "Completed",
  },
  {
    file: "elephant_017.jpg",
    subtitle: "Wildlife Camera Trap Image",
    progress: 74,
    status: "Processing",
  },
  {
    file: "deer_004.jpg",
    subtitle: "Wildlife Camera Trap Image",
    progress: 0,
    status: "Queued",
  },
];

export function DetectionQueue() {
  return (
    <DataCard>

      <div className="p-6">

        <SectionHeader
          title="Processing Queue"
          description="AI processing status of uploaded images."
        />

        <div className="mt-6 space-y-4">

          {queue.map((item) => (

            <div
              key={item.file}
              className="rounded-2xl border p-4"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h4 className="font-semibold">
                    {item.file}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>

                </div>

                {item.status === "Completed" && (
                  <CheckCircle2 className="text-emerald-600" size={20} />
                )}

                {item.status === "Processing" && (
                  <Loader2 className="animate-spin text-emerald-600" size={20} />
                )}

                {item.status === "Queued" && (
                  <Clock3 className="text-slate-500" size={20} />
                )}

              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-emerald-600 transition-all"
                  style={{ width: `${item.progress}%` }}
                />

              </div>

              <div className="mt-3 flex items-center justify-between">

                <StatusBadge status={item.status} />

                <span className="text-sm font-medium">
                  {item.progress}%
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </DataCard>
  );
}