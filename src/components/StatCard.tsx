import type { ComponentType } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-3">
            {value}
          </h2>
        </div>

        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Icon className="w-7 h-7 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;