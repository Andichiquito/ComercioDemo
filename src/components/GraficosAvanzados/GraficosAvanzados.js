import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './GraficosAvanzados.css';

const GraficosAvanzados = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    exportaciones: [],
    paises: [],
    transporte: [],
    mensual: []
  });

  // Estados para controlar el tipo de gráfico
  const [chartTypes, setChartTypes] = useState({
    paises: 'barras', // 'barras', 'circular', 'lineas'
    transporte: 'circular', // 'circular', 'barras'
    mensual: 'lineas' // 'lineas', 'area', 'barras'
  });



  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando datos para gráficos avanzados con Supabase...');

      const [exportacionesRes, paisesRes, transporteRes, mensualRes] = await Promise.all([
        supabase.from('vista_estadisticas_generales').select('*'),
        supabase.from('vista_exportaciones_por_pais').select('*').limit(8),
        supabase.from('vista_medio_transporte').select('*'),
        supabase.from('vista_operaciones_por_mes').select('*')
      ]);

      if (exportacionesRes.error) throw exportacionesRes.error;
      if (paisesRes.error) throw paisesRes.error;
      if (transporteRes.error) throw transporteRes.error;
      if (mensualRes.error) throw mensualRes.error;

      console.log('✅ Datos cargados exitosamente');

      setChartData({
        exportaciones: exportacionesRes.data || [],
        paises: paisesRes.data || [],
        transporte: transporteRes.data || [],
        mensual: mensualRes.data || []
      });

    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

  const getTransportIcon = (transport) => {
    if (!transport) return '🚚';

    const transportLower = transport.toLowerCase();
    if (transportLower.includes('maritimo') || transportLower.includes('marítimo')) {
      return '🚢';
    } else if (transportLower.includes('aereo') || transportLower.includes('aéreo')) {
      return '✈️';
    } else if (transportLower.includes('terrestre')) {
      return '🚛';
    }
    return '🚚';
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1] || `Mes ${monthNumber}`;
  };

  // Función para cambiar el tipo de gráfico
  const changeChartType = (chartName, newType) => {
    setChartTypes(prev => ({
      ...prev,
      [chartName]: newType
    }));
  };

  // Función para renderizar gráfico de países
  const renderPaisesChart = () => {
    const data = chartData.paises.slice(0, 6);
    const maxValue = Math.max(...data.map(p => p.valor_total_usd || 0));

    switch (chartTypes.paises) {
      case 'barras':
        return (
          <div className="bar-chart">
            {data.map((pais, index) => {
              const percentage = Math.min((pais.valor_total_usd / maxValue) * 100, 100);
              return (
                <div key={index} className="bar-item">
                  <div className="bar-label">
                    <span className="country-name">{pais.nombre_del_pais_de_destino || 'N/A'}</span>
                    <div className="bar-values">
                      <span className="country-value">{formatCurrency(pais.valor_total_usd)}</span>
                      <span className="country-percentage">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${percentage}%`
                      }}
                    >
                      <span className="bar-percentage-text">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'circular':
        return (
          <div className="pie-chart">
            {data.map((pais, index) => (
              <div key={index} className="pie-item">
                <div className="pie-slice" style={{
                  background: `conic-gradient(${getSliceColor(index)} 0deg ${((pais.valor_total_usd / maxValue) * 100) * 3.6}deg, rgba(255,255,255,0.1) ${((pais.valor_total_usd / maxValue) * 100) * 3.6}deg 360deg)`
                }}>
                  <div className="pie-center">
                    <div className="pie-icon">🌍</div>
                    <div className="pie-percentage">{((pais.valor_total_usd / maxValue) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="pie-label">
                  <span className="transport-name">{pais.nombre_del_pais_de_destino || 'N/A'}</span>
                  <span className="transport-count">{formatCurrency(pais.valor_total_usd)}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'lineas':
        return (
          <div className="line-chart">
            <div className="chart-grid">
              {Array.from({ length: data.length }, (_, i) => (
                <div key={i} className="grid-line"></div>
              ))}
            </div>
            <div className="line-path">
              {data.map((pais, index) => (
                <div
                  key={index}
                  className="line-point"
                  style={{
                    left: `${(index / (data.length - 1)) * 100}%`,
                    bottom: `${((pais.valor_total_usd / maxValue) * 100)}%`
                  }}
                >
                  <div className="point-tooltip">
                    <div className="tooltip-month">{pais.nombre_del_pais_de_destino || 'N/A'}</div>
                    <div className="tooltip-value">{formatCurrency(pais.valor_total_usd)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Función para renderizar gráfico de transporte
  const renderTransporteChart = () => {
    const data = chartData.transporte;

    // Validar que hay datos
    if (!data || data.length === 0) {
      return (
        <div className="chart-empty">
          <p>No hay datos de transporte disponibles</p>
        </div>
      );
    }

    switch (chartTypes.transporte) {
      case 'circular':
        // Calcular el total de operaciones para calcular porcentajes
        const totalOperaciones = data.reduce((sum, item) => sum + (parseInt(item.total_operaciones) || 0), 0);

        // Calcular porcentajes para cada item
        const dataWithPercentages = data.map((item, index) => {
          const operaciones = parseInt(item.total_operaciones) || 0;
          const porcentaje = totalOperaciones > 0 ? (operaciones / totalOperaciones) * 100 : 0;

          return {
            ...item,
            operaciones,
            porcentaje,
            color: getSliceColor(index)
          };
        });

        return (
          <div className="pie-chart">
            {dataWithPercentages.map((item, index) => {
              // Cada círculo muestra su porcentaje como un indicador circular
              // El gradiente cónico muestra el porcentaje desde 0 hasta el valor correspondiente
              const angle = item.porcentaje * 3.6; // Convertir porcentaje a grados

              return (
                <div key={index} className="pie-item">
                  <div className="pie-slice" style={{
                    background: `conic-gradient(
                      from 0deg,
                      ${item.color} 0deg,
                      ${item.color} ${angle}deg,
                      rgba(255,255,255,0.1) ${angle}deg,
                      rgba(255,255,255,0.1) 360deg
                    )`
                  }}>
                    <div className="pie-center">
                      <div className="pie-icon">{getTransportIcon(item.medio_transporte)}</div>
                      <div className="pie-percentage">{item.porcentaje.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="pie-label">
                    <span className="transport-name">{item.medio_transporte || 'N/A'}</span>
                    <span className="transport-count">{item.operaciones.toLocaleString()} operaciones</span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'barras':
        const maxOps = Math.max(...data.map(t => t.total_operaciones || 0));
        return (
          <div className="bar-chart">
            {data.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">
                  <span className="country-name">
                    {getTransportIcon(item.medio_transporte)} {item.medio_transporte || 'N/A'}
                  </span>
                  <span className="country-value">{item.total_operaciones?.toLocaleString() || '0'}</span>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min(((item.total_operaciones || 0) / maxOps) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Función para renderizar gráfico mensual
  const renderMensualChart = () => {
    const data = chartData.mensual.map(item => ({
      ...item,
      mesNombre: getMonthName(item.mes).substring(0, 3),
      exportaciones: parseFloat(item.total_operaciones || 0),
      importaciones: parseFloat(item.total_operaciones || 0) * 0.7 // Simulado para ejemplo, ajustar con datos reales si existen
    }));

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
            <p className="label" style={{ color: '#333', fontWeight: 'bold' }}>{`${label}`}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${formatCurrency(entry.value)}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    switch (chartTypes.mensual) {
      case 'lineas':
        return (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="mesNombre" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="exportaciones" name="Exportaciones" stroke="#8B1538" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="importaciones" name="Importaciones" stroke="#4ecdc4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'area':
        return (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B1538" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B1538" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorImport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mesNombre" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value / 1000}K`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="exportaciones" name="Exportaciones" stroke="#8B1538" fillOpacity={1} fill="url(#colorExport)" />
                <Area type="monotone" dataKey="importaciones" name="Importaciones" stroke="#4ecdc4" fillOpacity={1} fill="url(#colorImport)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'barras':
        return (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="mesNombre" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="exportaciones" name="Exportaciones" fill="#8B1538" radius={[4, 4, 0, 0]} />
                <Bar dataKey="importaciones" name="Importaciones" fill="#4ecdc4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="graficos-loading">
        <div className="loading-spinner"></div>
        <p>Cargando gráficos avanzados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="graficos-error">
        <h2>Error al cargar los gráficos</h2>
        <p>{error}</p>
        <button onClick={fetchChartData} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="graficos-avanzados">
      {/* Header */}
      <div className="graficos-header">
        <div className="header-content">
          <h1>📈 Gráficos Avanzados</h1>
          <p className="header-description">
            Visualizaciones interactivas y análisis detallado de datos comerciales
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {chartData.exportaciones.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              {stat.tipo_operacion?.includes('Exportación') ? '📤' :
                stat.tipo_operacion?.includes('Reexportación') ? '🔄' : '📦'}
            </div>
            <div className="stat-content">
              <h3>{stat.tipo_operacion || 'Operación'}</h3>
              <div className="stat-value">{stat.total_operaciones?.toLocaleString() || '0'}</div>
              <div className="stat-label">Operaciones</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Top Countries Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>🌍 Top Países de Destino</h2>
            <div className="chart-controls">
              <button
                className={`control-btn ${chartTypes.paises === 'barras' ? 'active' : ''}`}
                onClick={() => changeChartType('paises', 'barras')}
              >
                📊 Barras
              </button>
              <button
                className={`control-btn ${chartTypes.paises === 'circular' ? 'active' : ''}`}
                onClick={() => changeChartType('paises', 'circular')}
              >
                🥧 Circular
              </button>
              <button
                className={`control-btn ${chartTypes.paises === 'lineas' ? 'active' : ''}`}
                onClick={() => changeChartType('paises', 'lineas')}
              >
                📈 Líneas
              </button>
            </div>
          </div>
          <div className="chart-content">
            {renderPaisesChart()}
          </div>
        </div>

        {/* Transport Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>🚚 Distribución por Transporte</h2>
            <div className="chart-controls">
              <button
                className={`control-btn ${chartTypes.transporte === 'circular' ? 'active' : ''}`}
                onClick={() => changeChartType('transporte', 'circular')}
              >
                🥧 Circular
              </button>
              <button
                className={`control-btn ${chartTypes.transporte === 'barras' ? 'active' : ''}`}
                onClick={() => changeChartType('transporte', 'barras')}
              >
                📊 Barras
              </button>
            </div>
          </div>
          <div className="chart-content">
            {renderTransporteChart()}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="trends-section">
        <div className="chart-container full-width">

          <div className="chart-container-trends full-width">

            <div className="chart-header">
              <h2>📅 Tendencias Mensuales</h2>
              <div className="chart-controls">
                <button
                  className={`control-btn ${chartTypes.mensual === 'lineas' ? 'active' : ''}`}
                  onClick={() => changeChartType('mensual', 'lineas')}
                >
                  📈 Líneas
                </button>
                <button
                  className={`control-btn ${chartTypes.mensual === 'area' ? 'active' : ''}`}
                  onClick={() => changeChartType('mensual', 'area')}
                >
                  📊 Área
                </button>
                <button
                  className={`control-btn ${chartTypes.mensual === 'barras' ? 'active' : ''}`}
                  onClick={() => changeChartType('mensual', 'barras')}
                >
                  📊 Barras
                </button>
              </div>
            </div>
            <div className="chart-content">
              {renderMensualChart()}
            </div>
          </div>

        </div>

      </div>

      {/* Export Options */}

    </div>
  );
};

const getSliceColor = (index) => {
  const colors = ['#8B1538', '#A01D47', '#6B0F2A', '#BDB6B8', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
  return colors[index % colors.length];
};

export default GraficosAvanzados;
