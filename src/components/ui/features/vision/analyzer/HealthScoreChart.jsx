import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const HealthScoreChart = ({ score, height = 100 }) => {
  const data = [{ name: "score", value: score, fill: "#34d399" }];

  return (
    <ResponsiveContainer width="100%" height={100}>
      <RadialBarChart
        cx="50%"
        cy="100%"
        innerRadius="70%"
        outerRadius="100%"
        startAngle={180}
        endAngle={0}
        barSize={15}
        data={data}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar background clockWise dataKey="value" cornerRadius={10} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default HealthScoreChart;
