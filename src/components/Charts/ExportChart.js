import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExportChart = ({ data }) => {
  // Process data for the chart
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];

    // Group by month and year
    const grouped = rawData.reduce((acc, item) => {
      const key = `${item.año}-${item.mes}`;
      if (!acc[key]) {
        acc[key] = {
          periodo: `${item.año}-${item.mes}`,
          exportaciones: 0,
          importaciones: 0,
          reexportaciones: 0
        };
      }

      if (item.tipo_operacion?.includes('EXPORTACION')) {
        acc[key].exportaciones += parseFloat(item.valor_total_usd || 0);
      } else if (item.tipo_operacion?.includes('IMPORTACION')) {
        acc[key].importaciones += parseFloat(item.valor_total_usd || 0);
      } else if (item.tipo_operacion?.includes('REEXPORTACION')) {
        acc[key].reexportaciones += parseFloat(item.valor_total_usd || 0);
      }

      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.periodo.localeCompare(b.periodo));
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Período: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
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
    <div className="export-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <Line
            type="monotone"
            dataKey="exportaciones"
            stroke="#2196F3"
            strokeWidth={3}
            dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
            name="Exportaciones"
          />
          <Line
            type="monotone"
            dataKey="importaciones"
            stroke="#F44336"
            strokeWidth={3}
            dot={{ fill: '#F44336', strokeWidth: 2, r: 4 }}
            name="Importaciones"
          />
          <Line
            type="monotone"
            dataKey="reexportaciones"
            stroke="#4CAF50"
            strokeWidth={3}
            dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
            name="Reexportaciones"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExportChart;
