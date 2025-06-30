// components/NutritionPieCharts.jsx
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "#4ade80",
  "#facc15",
  "#f87171",
  "#60a5fa",
  "#34d399",
  "#f472b6",
];

const NutritionPieCharts = ({ data, size = 64 }) => {
  const inner = size * 0.3;
  const outer = size * 0.5;
  return (
    <div className="grid grid-cols-2 gap-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div style={{ width: size, height: size }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: item.name, value: item.percentage },
                    { name: "rest", value: 100 - item.percentage },
                  ]}
                  innerRadius={inner}
                  outerRadius={outer}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  <Cell fill={COLORS[idx % COLORS.length]} />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <span className="text-xs mt-1">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default NutritionPieCharts;
