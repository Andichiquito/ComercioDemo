import React from 'react';

const HeatmapChart = ({ data, title, xField = 'medio_transporte', yField = 'nombre_del_pais_de_destino' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="no-data">No hay datos disponibles</div>
      </div>
    );
  }

  // Procesar datos para el mapa de calor
  const xValues = [...new Set(data.map(item => item[xField]).filter(Boolean))];
  const yValues = [...new Set(data.map(item => item[yField]).filter(Boolean))];

  // Crear matriz de datos
  const heatmapData = yValues.map(yValue => 
    xValues.map(xValue => {
      const matchingItems = data.filter(item => 
        item[xField] === xValue && item[yField] === yValue
      );
      const totalValue = matchingItems.reduce((sum, item) => 
        sum + (item.valor_fob_en_dolares_estadounidenses || 0), 0
      );
      return {
        value: totalValue,
        count: matchingItems.length
      };
    })
  );

  const maxValue = Math.max(...heatmapData.flat().map(cell => cell.value));
  const minValue = Math.min(...heatmapData.flat().map(cell => cell.value));
  const range = maxValue - minValue;

  const getColorIntensity = (value) => {
    if (range === 0) return 0.1;
    return 0.1 + ((value - minValue) / range) * 0.9;
  };

  const getColor = (intensity) => {
    const r = Math.floor(139 + (255 - 139) * intensity);
    const g = Math.floor(21 + (107 - 21) * intensity);
    const b = Math.floor(56 + (42 - 56) * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="heatmap-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        <div className="heatmap-container">
          <div className="heatmap-grid">
            {/* Y-axis labels */}
            <div className="y-axis-labels">
              {yValues.map((yValue, index) => (
                <div key={index} className="y-label">
                  {yValue.length > 12 ? 
                    `${yValue.substring(0, 12)}...` : 
                    yValue
                  }
                </div>
              ))}
            </div>

            {/* Heatmap cells */}
            <div className="heatmap-cells">
              {heatmapData.map((row, rowIndex) => (
                <div key={rowIndex} className="heatmap-row">
                  {row.map((cell, colIndex) => {
                    const intensity = getColorIntensity(cell.value);
                    const color = getColor(intensity);
                    
                    return (
                      <div
                        key={colIndex}
                        className="heatmap-cell"
                        style={{
                          backgroundColor: color,
                          opacity: intensity
                        }}
                        title={`${yValues[rowIndex]} - ${xValues[colIndex]}: ${formatCurrency(cell.value)} (${cell.count} operaciones)`}
                      >
                        <div className="cell-content">
                          <div className="cell-value">
                            {cell.value > 0 ? formatCurrency(cell.value) : ''}
                          </div>
                          <div className="cell-count">
                            {cell.count > 0 ? `${cell.count} ops` : ''}
                          </div>
                          <div className="cell-percentage">
                            {cell.value > 0 ? `${((cell.value / maxValue) * 100).toFixed(1)}%` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="x-axis-labels">
            {xValues.map((xValue, index) => (
              <div key={index} className="x-label">
                {xValue.length > 8 ? 
                  `${xValue.substring(0, 8)}...` : 
                  xValue
                }
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="heatmap-legend">
          <div className="legend-title">Intensidad de Comercio</div>
          <div className="legend-scale">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: getColor(0.1) }}></div>
              <span>Bajo</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: getColor(0.5) }}></div>
              <span>Medio</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: getColor(0.9) }}></div>
              <span>Alto</span>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="heatmap-stats">
          <div className="stat-item">
            <span className="stat-label">Total Combinaciones:</span>
            <span className="stat-value">{xValues.length * yValues.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Combinaciones Activas:</span>
            <span className="stat-value">
              {heatmapData.flat().filter(cell => cell.value > 0).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Valor Total:</span>
            <span className="stat-value">
              {formatCurrency(heatmapData.flat().reduce((sum, cell) => sum + cell.value, 0))}
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

export default HeatmapChart;
