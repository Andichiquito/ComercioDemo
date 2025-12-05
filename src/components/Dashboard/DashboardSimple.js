import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTruck, FaPlane, FaShip, FaGlobe, FaChartPie, FaChartBar, FaTimesCircle, FaSync, FaUpload, FaBox, FaCheckCircle } from 'react-icons/fa';
import Card, { StatCard, ChartCard } from '../UI/Card';
import Button, { IconButton } from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import ThemeToggle from '../Theme/ThemeToggle';
import TopCountriesChart from '../Charts/TopCountriesChart';
import TransportDistributionChart from '../Charts/TransportDistributionChart';
import './DashboardSimple.css';

const DashboardSimple = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_BASE = 'http://localhost:5000/api';

  // Configurar axios con timeout
  const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 10000, // 10 segundos
    headers: {
      'Content-Type': 'application/json',
    }
  });

  useEffect(() => {
    fetchData();

    // Actualizar tiempo cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Iniciando fetch de datos...');

      // Obtener múltiples datos en paralelo
      const [testResponse, statsResponse, paisesResponse, transporteResponse] = await Promise.all([
        apiClient.get('/test-db'),
        apiClient.get('/views/query/vista_estadisticas_generales'),
        apiClient.get('/views/query/vista_exportaciones_por_pais?limit=5'),
        apiClient.get('/views/query/vista_medio_transporte')
      ]);

      setData({
        test: testResponse.data,
        stats: statsResponse.data,
        paises: paisesResponse.data,
        transporte: transporteResponse.data
      });

    } catch (err) {
      console.error('Error detallado:', err);

      // Mejor manejo de errores de red
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError('Error de conexión: El servidor backend no está disponible. Verifica que esté ejecutándose en el puerto 5000.');
      } else if (err.response) {
        // Error con respuesta del servidor
        setError(`Error del servidor: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        // Error de red sin respuesta
        setError('Error de red: No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Otro tipo de error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '$0';
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getTransportIcon = (transport) => {
    if (!transport) return <FaTruck />;
    const transportLower = transport.toLowerCase();

    if (transportLower.includes('aereo') || transportLower.includes('aéreo') || transportLower.includes('aerea')) {
      return <FaPlane />;
    } else if (transportLower.includes('maritimo') || transportLower.includes('marítimo') || transportLower.includes('maritima')) {
      return <FaShip />;
    } else if (transportLower.includes('terrestre')) {
      return <FaTruck />;
    } else if (transportLower.includes('ferroviario')) {
      return <FaTruck />;
    } else if (transportLower.includes('ductos')) {
      return <FaTruck />;
    } else if (transportLower.includes('ferroviario-maritimo') || transportLower.includes('ferroviario-marítimo')) {
      return <FaShip />;
    }
    return <FaTruck />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" variant="primary" text="Cargando dashboard..." />
          <div className="mt-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src="/download.png"
                alt="Universidad del Valle"
                className="h-16 w-auto"
              />
              <h2 className="text-3xl font-bold text-white gradient-text-animated">
                Universidad del Valle
              </h2>
            </div>
            <p className="text-white/80">Preparando tu experiencia de datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-600 to-purple-700 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <Card.Body>
            <div className="text-6xl mb-4 animate-bounce"><FaTimesCircle /></div>
            <h2 className="text-2xl font-bold text-white mb-4">Error al cargar el dashboard</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <Button onClick={fetchData} variant="primary" icon={<FaSync />}>
              Reintentar
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-6 mb-4">
              <img
                src="/download.png"
                alt="Universidad del Valle"
                className="h-20 w-auto"
              />
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white gradient-text-animated">
                  Universidad del Valle
                </h1>
                <p className="text-xl text-white/80 animate-slide-up">
                  Dashboard de Comercio Internacional
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 animate-slide-right">
            <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">En Vivo</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <span className="text-white font-mono text-lg">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-8 p-6 glow-effect animate-scale-in">
        <div className="flex items-center space-x-4">
          <div className="text-4xl animate-bounce-slow"><FaCheckCircle /></div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Conexión Exitosa</h3>
            <p className="text-white/80">
              Base de datos: <span className="text-blue-300 font-semibold">{data?.test?.database}</span>
            </p>
            <p className="text-white/80">
              Estado: <span className="text-green-400 font-semibold">Online</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data?.stats?.datos?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.tipo_operacion}
            value={parseInt(stat.total_operaciones).toLocaleString()}
            change={`${formatCurrency(stat.valor_total_usd)}`}
            changeType="positive"
            icon={stat.tipo_operacion?.includes('Exportación') ? <FaUpload /> :
              stat.tipo_operacion?.includes('Reexportación') ? <FaSync /> : <FaBox />}
            trend="up"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Countries Chart */}
        <ChartCard
          title={
            <>
              <FaGlobe className="inline mr-2" />
              Top Países de Destino
            </>
          }
          actions={[
            <IconButton key="chart" icon={<FaChartBar />} variant="ghost" size="sm" />
          ]}
          className="animate-slide-left"
        >
          <TopCountriesChart data={data?.paises?.datos} />
        </ChartCard>

        {/* Transport Distribution Chart */}
        <ChartCard
          title={
            <>
              <FaTruck className="inline mr-2" />
              Distribución por Transporte
            </>
          }
          actions={[
            <IconButton key="pie" icon={<FaChartPie />} variant="ghost" size="sm" />
          ]}
          className="animate-slide-right"
        >
          <TransportDistributionChart data={data?.transporte?.datos} />
        </ChartCard>
      </div>

    </div>
  );
};

export default DashboardSimple;
