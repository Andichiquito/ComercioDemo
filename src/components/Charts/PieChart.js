import React from 'react';

const PieChart = ({ data, title, colors = ['#8B1538', '#A01D47', '#6B0F2A', '#BDB6B8', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="no-data">No hay datos disponibles</div>
      </div>
    );
  }

  // Procesar datos para la gráfica de torta
  const total = data.reduce((sum, item) => sum + (item.operations || item.value || 0), 0);
  const chartData = data.map((item, index) => ({
    label: item.name || item.label || `Item ${index + 1}`,
    value: item.operations || item.value || 0,
    percentage: total > 0 ? ((item.operations || item.value || 0) / total) * 100 : 0,
    color: colors[index % colors.length]
  }));

  // Crear el SVG de la gráfica de torta
  let cumulativePercentage = 0;
  const radius = 80;
  const centerX = 120;
  const centerY = 120;

  const createPath = (percentage) => {
    const startAngle = (cumulativePercentage * 360) / 100;
    const endAngle = ((cumulativePercentage + percentage) * 360) / 100;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    cumulativePercentage += percentage;
    return pathData;
  };

  return (
    <div className="pie-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        <div className="pie-container">
          <svg width="240" height="240" className="pie-svg">
            {chartData.map((item, index) => {
              const path = createPath(item.percentage);
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                  className="pie-slice"
                />
              );
            })}
            
            {/* Centro del círculo */}
            <circle
              cx={centerX}
              cy={centerY}
              r="30"
              fill="rgba(255,255,255,0.1)"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              Total
            </text>
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              {formatNumber(total)}
            </text>
            <text
              x={centerX}
              y={centerY + 18}
              textAnchor="middle"
              fill="white"
              fontSize="8"
              opacity="0.8"
            >
              Operaciones
            </text>
          </svg>
        </div>

        {/* Leyenda */}
        <div className="pie-legend">
          {chartData.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="legend-text">
                <span className="legend-label">
                  {item.label.length > 20 ? 
                    `${item.label.substring(0, 20)}...` : 
                    item.label
                  }
                </span>
                <span className="legend-value">
                  {item.percentage.toFixed(1)}% ({formatNumber(item.value)})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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

export default PieChart;
