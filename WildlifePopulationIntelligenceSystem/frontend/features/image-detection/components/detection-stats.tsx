import {
  Activity,
  Image,
  PawPrint,
  ScanSearch,
} from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";

const stats = [
  {
    title: "Images Processed",
    value: "14,284",
    change: "+8%",
    icon: <Image className="h-6 w-6" />,
  },
  {
    title: "Species Detected",
    value: "128",
    change: "+3",
    icon: <PawPrint className="h-6 w-6" />,
  },
  {
    title: "Animals Counted",
    value: "2,846",
    change: "+96",
    icon: <ScanSearch className="h-6 w-6" />,
  },
  {
    title: "Average Confidence",
    value: "98.7%",
    change: "+0.4%",
    icon: <Activity className="h-6 w-6" />,
  },
];

export function DetectionStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          change={`${item.change} this month`}
          icon={item.icon}
        />
      ))}
    </div>
  );
}