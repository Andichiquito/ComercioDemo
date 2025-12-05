import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './DatosComerciales.css';

const DatosComerciales = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  // Filtros
  const [filters, setFilters] = useState({
    pais: '',
    producto: '',
    tipoOperacion: '',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });

  // Opciones para filtros
  const [paises, setPaises] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tiposOperacion, setTiposOperacion] = useState([]);



  useEffect(() => {
    fetchData();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Debounce para mejorar rendimiento con grandes volúmenes de datos
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [data, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Cargando datos comerciales (cap: 1000 registros)...');

      // Obtener datos de operaciones recientes (limitado a 1000 para evitar sobrecarga)
      const { data: datos, error } = await supabase
        .from('vista_operaciones_recientes')
        .select('*')
        .limit(1000);

      if (error) throw error;

      console.log('Datos cargados:', datos.length);

      setData(datos);
      setFilteredData(datos);

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      // Obtener países únicos
      const { data: paisesData } = await supabase
        .from('vista_exportaciones_por_pais')
        .select('nombre_del_pais_de_destino')
        .limit(100);

      if (paisesData) {
        const paisesUnicos = [...new Set(paisesData.map(item => item.nombre_del_pais_de_destino))];
        setPaises(paisesUnicos.filter(p => p));
      }

      // Obtener tipos de operación únicos
      const { data: tiposData } = await supabase
        .from('vista_estadisticas_generales')
        .select('tipo_operacion');

      if (tiposData) {
        const tiposUnicos = tiposData.map(item => item.tipo_operacion);
        setTiposOperacion(tiposUnicos);
      }

    } catch (err) {
      console.error('Error cargando opciones de filtro:', err);
    }
  };

  const applyFilters = () => {
    console.log('Aplicando filtros a', data.length, 'registros...');
    const startTime = performance.now();

    let filtered = data;

    // Aplicar filtros de manera más eficiente
    if (filters.pais) {
      const paisLower = filters.pais.toLowerCase();
      filtered = filtered.filter(item =>
        item.nombre_del_pais_de_destino?.toLowerCase().includes(paisLower)
      );
    }

    if (filters.producto) {
      const productoLower = filters.producto.toLowerCase();
      filtered = filtered.filter(item =>
        item.codigo_producto?.toString().includes(filters.producto) ||
        item.descripcion_del_capitulo_nandina?.toLowerCase().includes(productoLower)
      );
    }

    if (filters.tipoOperacion) {
      filtered = filtered.filter(item =>
        item.tipo_operacion?.includes(filters.tipoOperacion)
      );
    }

    if (filters.fechaDesde) {
      const desdeDate = new Date(filters.fechaDesde);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= desdeDate;
      });
    }

    if (filters.fechaHasta) {
      const hastaDate = new Date(filters.fechaHasta);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate <= hastaDate;
      });
    }

    if (filters.busqueda) {
      const searchTerm = filters.busqueda.toLowerCase();
      filtered = filtered.filter(item =>
        item.nombre_del_pais_de_destino?.toLowerCase().includes(searchTerm) ||
        item.codigo_producto?.toString().includes(searchTerm) ||
        item.descripcion_de_la_aduana_de_despacho?.toLowerCase().includes(searchTerm) ||
        item.medio_transporte?.toLowerCase().includes(searchTerm)
      );
    }

    const endTime = performance.now();
    console.log(`Filtrado completado en ${(endTime - startTime).toFixed(2)}ms. Resultados: ${filtered.length}`);

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      pais: '',
      producto: '',
      tipoOperacion: '',
      fechaDesde: '',
      fechaHasta: '',
      busqueda: ''
    });
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="datos-comerciales-loading">
        <div className="loading-spinner"></div>
        <p>Cargando 1,000,000 registros comerciales...</p>
        <p className="loading-subtitle">Esto puede tomar unos momentos</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="datos-comerciales-error">
        <h2>Error al cargar los datos</h2>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="datos-comerciales">
      <div className="datos-header">
        <h1>Datos Comerciales Completos</h1>
        <p>Base de datos con {data.length.toLocaleString()} registros comerciales</p>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Búsqueda General</label>
            <input
              type="text"
              placeholder="Buscar por país, producto, aduana..."
              value={filters.busqueda}
              onChange={(e) => handleFilterChange('busqueda', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>País Destino</label>
            <select
              value={filters.pais}
              onChange={(e) => handleFilterChange('pais', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los países</option>
              {paises.map((pais, index) => (
                <option key={index} value={pais}>{pais}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Producto</label>
            <input
              type="text"
              placeholder="Código o descripción"
              value={filters.producto}
              onChange={(e) => handleFilterChange('producto', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Tipo de Operación</label>
            <select
              value={filters.tipoOperacion}
              onChange={(e) => handleFilterChange('tipoOperacion', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              {tiposOperacion.map((tipo, index) => (
                <option key={index} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Fecha Desde</label>
            <input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Fecha Hasta</label>
            <input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filters-actions">
          <button onClick={clearFilters} className="clear-filters-btn">
            Limpiar Filtros
          </button>
          <div className="results-count">
            <div className="results-main">
              Mostrando {filteredData.length.toLocaleString()} de {data.length.toLocaleString()} registros
            </div>
            <div className="results-stats">
              {filteredData.length > 0 && (
                <span className="filter-efficiency">
                  Eficiencia: {((filteredData.length / data.length) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="data-table-container">
        <div className="table-header">
          <h3>Registros Comerciales</h3>

        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>País Destino</th>
                <th>Cantidad</th>
                <th>Valor (USD)</th>
                <th>Transporte</th>
                <th>Aduana</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="date-cell">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="product-cell">
                    <div className="product-info">
                      <span className="product-code">
                        {item.codigo_producto || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="country-cell">
                    {item.nombre_del_pais_de_destino || 'N/A'}
                  </td>
                  <td className="quantity-cell">
                    {item.peso_neto_kg ?
                      `${parseFloat(item.peso_neto_kg).toLocaleString()} kg` :
                      'N/A'
                    }
                  </td>
                  <td className="value-cell">
                    {formatCurrency(item.valor_fob_en_dolares_estadounidenses)}
                  </td>
                  <td className="transport-cell">
                    <div className="transport-info">
                      <span className="transport-text">
                        {item.medio_transporte || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="customs-cell">
                    {item.descripcion_de_la_aduana_de_despacho || 'N/A'}
                  </td>
                  <td className="status-cell">
                    <span className="status-badge completed">
                      Completado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Anterior
          </button>

          <div className="pagination-info">
            Página {currentPage} de {totalPages}
            <span className="pagination-details">
              ({startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length})
            </span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatosComerciales;
