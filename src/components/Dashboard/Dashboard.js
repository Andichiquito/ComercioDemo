import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaChartLine, FaChartBar, FaGlobe, FaBriefcase, FaShip, FaTruck, FaClock, FaLightbulb, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import MetricCard from '../Metrics/MetricCard';
import ExportChart from '../Charts/ExportChart';
import TopCountriesChart from '../Charts/TopCountriesChart';
import TransportDistributionChart from '../Charts/TransportDistributionChart';
import RecentOperations from '../Charts/RecentOperations';
import './Dashboard.css';
import '../Charts/Charts.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [exportData, setExportData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [recentOps, setRecentOps] = useState([]);



  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        statsResponse,
        exportResponse,
        countryResponse,
        transportResponse,
        recentResponse
      ] = await Promise.all([
        supabase.from('vista_estadisticas_generales').select('*').limit(10),
        supabase.from('vista_operaciones_por_mes').select('*').limit(12),
        supabase.from('vista_exportaciones_por_pais').select('*').limit(10),
        supabase.from('vista_medio_transporte').select('*'),
        supabase.from('vista_operaciones_recientes').select('*').limit(10)
      ]);

      if (statsResponse.error) throw statsResponse.error;
      if (exportResponse.error) throw exportResponse.error;
      if (countryResponse.error) throw countryResponse.error;
      if (transportResponse.error) throw transportResponse.error;
      if (recentResponse.error) throw recentResponse.error;

      setStats(statsResponse.data);
      setExportData(exportResponse.data);
      setCountryData(countryResponse.data);
      setTransportData(transportResponse.data);
      setRecentOps(recentResponse.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-ES').format(value);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error al cargar el dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  // Calculate totals from stats
  const totalExports = stats?.find(s => s.tipo_operacion.includes('EXPORTACIONES'));
  const totalReexports = stats?.find(s => s.tipo_operacion.includes('REEXPORTACIONES'));
  const totalPersonal = stats?.find(s => s.tipo_operacion.includes('EFECTOS'));

  const totalOperations = (totalExports?.total_operaciones || 0) +
    (totalReexports?.total_operaciones || 0) +
    (totalPersonal?.total_operaciones || 0);

  // const totalValue = (totalExports?.valor_total_usd || 0) + 
  //                   (totalReexports?.valor_total_usd || 0) + 
  //                   (totalPersonal?.valor_total_usd || 0);

  const totalCountries = Math.max(
    totalExports?.paises_destino || 0,
    totalReexports?.paises_destino || 0,
    totalPersonal?.paises_destino || 0
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-logo-section">
          <img
            src="/download.png"
            alt="Universidad del Valle"
            className="dashboard-logo"
          />
          <div className="header-text">
            <h1>Universidad del Valle</h1>
            <p>Dashboard de Comercio Internacional</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Exportaciones Totales"
          value={formatCurrency(totalExports?.valor_total_usd || 0)}
          subtitle={`${formatNumber(totalExports?.total_operaciones || 0)} operaciones`}
          icon={<FaChartLine />}
          color="blue"
        />
        <MetricCard
          title="Crecimiento Anual"
          value="+12.8%"
          subtitle="vs año anterior"
          icon={<FaChartBar />}
          color="green"
        />
        <MetricCard
          title="Países Socios"
          value={formatNumber(totalCountries)}
          subtitle="destinos comerciales"
          icon={<FaGlobe />}
          color="purple"
        />
        <MetricCard
          title="Transacciones Mensuales"
          value={formatNumber(Math.round(totalOperations / 12))}
          subtitle="promedio mensual"
          icon={<FaBriefcase />}
          color="orange"
        />
        <MetricCard
          title="Envíos Marítimos"
          value={formatNumber(transportData.find(t => t.medio_transporte?.includes('MARITIMO'))?.total_operaciones || 0)}
          subtitle="operaciones marítimas"
          icon={<FaShip />}
          color="teal"
        />
        <MetricCard
          title="Envíos Terrestres"
          value={formatNumber(transportData.find(t => t.medio_transporte?.includes('TERRESTRE'))?.total_operaciones || 0)}
          subtitle="operaciones terrestres"
          icon={<FaTruck />}
          color="brown"
        />
        <MetricCard
          title="Tiempo de Entrega"
          value="98.7%"
          subtitle="cumplimiento"
          icon={<FaClock />}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-container">
            <h3><FaGlobe className="inline mr-2" /> Top Países de Destino</h3>
            <TopCountriesChart data={countryData} />
          </div>
          <div className="chart-container">
            <h3><FaTruck className="inline mr-2" /> Distribución por Transporte</h3>
            <TransportDistributionChart data={transportData} />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-container large">
            <h3><FaChartLine className="inline mr-2" /> Tendencia Comercial Trimestral</h3>
            <ExportChart data={exportData} />
          </div>
          <div className="chart-container">
            <h3>🎯 Principales Mercados</h3>
            <div className="markets-summary">
              {countryData.slice(0, 6).map((country, index) => (
                <div key={index} className="market-item">
                  <span className="market-name">{country.nombre_del_pais_de_destino}</span>
                  <span className="market-value">{formatCurrency(country.valor_total_usd)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Operations */}
      <div className="recent-operations">
        <h3>🕒 Operaciones Recientes</h3>
        <RecentOperations data={recentOps} />
      </div>

      {/* Market Insights */}
      <div className="insights-section">
        <h3><FaLightbulb className="inline mr-2" /> Insights del Mercado</h3>
        <div className="insights-grid">
          <div className="insight-card blue">
            <div className="insight-icon"><FaLightbulb /></div>
            <div className="insight-content">
              <h4>Tendencia Alcista</h4>
              <p>El sector tecnológico muestra un crecimiento del 23% en exportaciones este trimestre.</p>
            </div>
          </div>
          <div className="insight-card yellow">
            <div className="insight-icon"><FaExclamationTriangle /></div>
            <div className="insight-content">
              <h4>Mercado Emergente</h4>
              <p>Vietnam se posiciona como nuevo destino estratégico para textiles y manufactura.</p>
            </div>
          </div>
          <div className="insight-card green">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Oportunidad</h4>
              <p>Demanda creciente de productos orgánicos en mercados europeos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Limited Access Banner */}
      <div className="limited-access">
        <div className="access-content">
          <div className="access-icon"><FaLock /></div>
          <div className="access-text">
            <h4>Acceso Limitado!</h4>
            <p>Esta es una versión demo. Inicia sesión para acceder a datos completos, análisis avanzados y reportes personalizados.</p>
          </div>
          <button className="login-button">Iniciar Sesión Ahora</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
