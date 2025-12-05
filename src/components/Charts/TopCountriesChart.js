import React from 'react';

const TopCountriesChart = ({ data }) => {
  // Procesar datos para el gráfico de países
  const processData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData.slice(0, 5).map(item => ({
      name: item.nombre_del_pais_de_destino || 'Sin nombre',
      value: parseFloat(item.valor_total_usd || 0),
      operations: parseInt(item.total_operaciones || 0)
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

  // Calcular el valor máximo para las barras
  const maxValue = Math.max(...chartData.map(item => item.value));

  if (chartData.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No hay datos disponibles para mostrar</p>
      </div>
    );
  }

  return (
    <div className="top-countries-chart">
      <div className="countries-list">
        {chartData.map((country, index) => {
          const percentage = (country.value / maxValue) * 100;
          return (
            <div key={index} className="country-item">
              <div className="country-info">
                <div className="country-rank">
                  {index + 1}
                </div>
                <div className="country-name">
                  {country.name.toUpperCase()}
                </div>
                <div className="country-value">
                  {formatCurrency(country.value)}
                </div>
              </div>
              <div className="country-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, #8B1538 0%, #A01D47 100%)`
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCountriesChart;
