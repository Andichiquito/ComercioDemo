import React from 'react';

const ScatterPlot = ({ data, title, xField = 'peso_neto_kg', yField = 'valor_fob_en_dolares_estadounidenses', color = '#8B1538' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="no-data">No hay datos disponibles</div>
      </div>
    );
  }

  // Procesar datos para la gráfica de dispersión
  const chartData = data
    .filter(item => item[xField] && item[yField])
    .map(item => ({
      x: parseFloat(item[xField]) || 0,
      y: parseFloat(item[yField]) || 0,
      label: item.nombre_del_pais_de_destino || 'País',
      size: Math.sqrt(parseFloat(item[yField]) || 0) / 100 // Tamaño basado en valor
    }));

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="no-data">No hay datos válidos para mostrar</div>
      </div>
    );
  }

  const maxX = Math.max(...chartData.map(d => d.x));
  const minX = Math.min(...chartData.map(d => d.x));
  const maxY = Math.max(...chartData.map(d => d.y));
  const minY = Math.min(...chartData.map(d => d.y));

  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  // Función para convertir coordenadas
  const scaleX = (value) => ((value - minX) / rangeX) * 280 + 20;
  const scaleY = (value) => 200 - ((value - minY) / rangeY) * 160;

  return (
    <div className="scatter-plot">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        <svg width="320" height="240" className="scatter-svg">
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
              <line
                x1={20 + ratio * 280}
                y1="20"
                x2={20 + ratio * 280}
                y2="180"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Data points */}
          {chartData.map((point, index) => {
            const x = scaleX(point.x);
            const y = scaleY(point.y);
            const radius = Math.max(3, Math.min(8, point.size));
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                stroke="white"
                strokeWidth="1"
                opacity="0.7"
                className="scatter-point"
              >
                <title>
                  {point.label}: {formatNumber(point.x)} kg, {formatCurrency(point.y)}
                </title>
              </circle>
            );
          })}

          {/* Axis labels */}
          <text
            x="160"
            y="220"
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
          >
            Peso (kg)
          </text>
          <text
            x="10"
            y="100"
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
            transform="rotate(-90, 10, 100)"
          >
            Valor (USD)
          </text>
        </svg>

        {/* Chart stats */}
        <div className="scatter-stats">
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Puntos:</span>
              <span className="stat-value">{chartData.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correlación:</span>
              <span className="stat-value">
                {(calculateCorrelation(chartData) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Peso Max:</span>
              <span className="stat-value">{formatNumber(maxX)} kg</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Valor Max:</span>
              <span className="stat-value">{formatCurrency(maxY)}</span>
            </div>
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

const formatNumber = (value) => {
  if (!value) return '0';
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

const calculateCorrelation = (data) => {
  if (data.length < 2) return 0;
  
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.x, 0);
  const sumY = data.reduce((sum, d) => sum + d.y, 0);
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);
  const sumY2 = data.reduce((sum, d) => sum + d.y * d.y, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
};

export default ScatterPlot;
