import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransportChart = ({ data }) => {
  // Process data for the bar chart
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData.map(item => ({
      name: item.medio_transporte || 'Sin especificar',
      value: parseFloat(item.valor_total_usd || 0),
      operations: parseInt(item.total_operaciones || 0),
      weight: parseFloat(item.peso_total_kg || 0)
    }));
  };

  const chartData = processData(data);

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatWeight = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M kg`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K kg`;
    }
    return `${value.toFixed(0)} kg`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Transporte: ${label}`}</p>
          <p style={{ color: payload[0].color }}>
            {`Valor: ${formatCurrency(data.value)}`}
          </p>
          <p style={{ color: payload[0].color }}>
            {`Operaciones: ${data.operations.toLocaleString()}`}
          </p>
          <p style={{ color: payload[0].color }}>
            {`Peso: ${formatWeight(data.weight)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  return (
    <div className="transport-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#666"
            fontSize={12}
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tick={{ fontSize: 11 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#2196F3"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransportChart;
