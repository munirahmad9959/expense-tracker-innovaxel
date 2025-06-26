import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = [
  'rgba(99, 102, 241, 0.85)',  // Indigo
  'rgba(217, 70, 239, 0.85)',  // Fuchsia
  'rgba(20, 184, 166, 0.85)',  // Teal
  'rgba(234, 88, 12, 0.85)',   // Orange
  'rgba(220, 38, 38, 0.85)',   // Red
  'rgba(101, 163, 13, 0.85)',  // Green
  'rgba(202, 138, 4, 0.85)',   // Amber
  'rgba(139, 92, 246, 0.85)',  // Violet
  'rgba(6, 182, 212, 0.85)',   // Cyan
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, totalExpenses }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
    
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
        <p className="font-bold text-white">{data.name}</p>
        <p className="text-gray-300">${data.value.toFixed(2)}</p>
        <p className="text-gray-400">{percentage}% of total</p>
      </div>
    );
  }
  return null;
};

const ChartSection = ({ chartData, totalExpenses }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#333333] p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Total Expenses: ${totalExpenses.toFixed(2)}</h3>

        <div className="h-96">
          <h4 className="text-md font-medium text-gray-400 mb-2">Expenses by Category</h4>
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              No category data to display.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#2a2a2a"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip totalExpenses={totalExpenses} />}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{
                    paddingTop: '20px',
                    color: '#e2e8f0',
                  }}
                  iconSize={12}
                  iconType="circle"
                  formatter={(value, entry, index) => {
                    const percentage = ((entry.payload.value / totalExpenses) * 100).toFixed(1);
                    return `${value} (${percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartSection;