import React from 'react';

const AreaChart = ({ data, title, color = '#8B1538' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="no-data">No hay datos disponibles</div>
      </div>
    );
  }

  // Procesar datos para la gráfica de área
  const chartData = data.map((item, index) => ({
    x: index + 1,
    y: item.valor_fob_en_dolares_estadounidenses || 0,
    date: item.created_at,
    label: `Período ${index + 1}`
  }));

  const maxValue = Math.max(...chartData.map(d => d.y));
  const minValue = Math.min(...chartData.map(d => d.y));
  const range = maxValue - minValue;

  // Crear el path del área
  const points = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * 280 + 20;
    const y = 200 - ((point.y - minValue) / range) * 160;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M 20,200 L ${points} L 300,200 Z`;

  return (
    <div className="area-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        <svg width="320" height="240" className="area-chart-svg">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <g key={index}>
              <line
                x1="20"
                y1={20 + ratio * 160}
                x2="300"
                y2={20 + ratio * 160}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <text
                x="10"
                y={25 + ratio * 160}
                fill="rgba(255,255,255,0.6)"
                fontSize="10"
                textAnchor="end"
              >
                {formatCurrency(maxValue - ratio * range)}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill={`url(#areaGradient)`}
            opacity="0.3"
          />

          {/* Area border */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 280 + 20;
            const y = 200 - ((point.y - minValue) / range) * 160;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="area-point"
              />
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
              <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
            </linearGradient>
          </defs>

          {/* X-axis labels */}
          {chartData.filter((_, index) => index % Math.ceil(chartData.length / 5) === 0).map((point, index) => {
            const x = (index * Math.ceil(chartData.length / 5) / (chartData.length - 1)) * 280 + 20;
            return (
              <text
                key={index}
                x={x}
                y="230"
                fill="rgba(255,255,255,0.6)"
                fontSize="10"
                textAnchor="middle"
              >
                {index + 1}
              </text>
            );
          })}
        </svg>

        {/* Chart stats */}
        <div className="area-stats">
          <div className="stat-item">
            <span className="stat-label">Área Total:</span>
            <span className="stat-value">
              {formatCurrency(chartData.reduce((sum, d) => sum + d.y, 0))}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tendencia:</span>
            <span className="stat-value">
              {calculateTrend(chartData) > 0 ? '📈 +' : '📉 '}
              {Math.abs(calculateTrendPercentage(chartData)).toFixed(1)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Volatilidad:</span>
            <span className="stat-value">
              {calculateVolatility(chartData).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (value) => {
  if (!value) return '$0';
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const calculateTrend = (data) => {
  if (data.length < 2) return 0;
  const first = data[0].y;
  const last = data[data.length - 1].y;
  return last - first;
};

const calculateTrendPercentage = (data) => {
  if (data.length < 2) return 0;
  const first = data[0].y;
  const last = data[data.length - 1].y;
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
};

const calculateVolatility = (data) => {
  if (data.length < 2) return 0;
  const values = data.map(d => d.y);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  return (stdDev / mean) * 100;
};

export default AreaChart;
