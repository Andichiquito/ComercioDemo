import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CountryChart = ({ data }) => {
  // Process data for the pie chart
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData.slice(0, 5).map(item => ({
      name: item.nombre_del_pais_de_destino || 'Sin nombre',
      value: parseFloat(item.valor_total_usd || 0),
      operations: parseInt(item.total_operaciones || 0)
    }));
  };

  const chartData = processData(data);

  const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'];

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`País: ${data.name}`}</p>
          <p style={{ color: payload[0].color }}>
            {`Valor: ${formatCurrency(data.value)}`}
          </p>
          <p style={{ color: payload[0].color }}>
            {`Operaciones: ${data.operations.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="custom-legend">
        {payload.map((entry, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="legend-text">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  return (
    <div className="country-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountryChart;
