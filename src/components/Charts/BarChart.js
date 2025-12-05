import React from 'react';

const BarChart = ({ data, title, color = '#8B1538', maxItems = 8 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="no-data">No hay datos disponibles</div>
      </div>
    );
  }

  // Procesar datos para la gráfica de barras
  const chartData = data.slice(0, maxItems).map((item, index) => ({
    label: item.nombre_del_pais_de_destino || `País ${index + 1}`,
    value: item.valor_fob_en_dolares_estadounidenses || 0,
    percentage: 0
  }));

  const maxValue = Math.max(...chartData.map(d => d.value));
  
  // Calcular porcentajes
  chartData.forEach(item => {
    item.percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
  });

  return (
    <div className="bar-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        <div className="bars-container">
          {chartData.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-label">
                {item.label.length > 15 ? 
                  `${item.label.substring(0, 15)}...` : 
                  item.label
                }
              </div>
              <div className="bar-wrapper">
                <div 
                  className="bar-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: color,
                    background: `linear-gradient(90deg, ${color} 0%, ${adjustColor(color, 20)} 100%)`
                  }}
                >
                  <span className="bar-value">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="bar-percentage-inline">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bar-percentage">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        {/* Chart summary */}
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-label">Total:</span>
            <span className="summary-value">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0))}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Promedio:</span>
            <span className="summary-value">
              {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length)}
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

const adjustColor = (color, amount) => {
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export default BarChart;
