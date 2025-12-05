import React from 'react';
import { FaTruck, FaShip, FaPlane, FaCalendarAlt, FaBox, FaGlobe, FaWeight, FaDollarSign, FaCheckCircle } from 'react-icons/fa';

const RecentOperations = ({ data }) => {
  const formatCurrency = (value) => {
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completado':
        return '#4CAF50';
      case 'en proceso':
        return '#FF9800';
      case 'pendiente':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };

  const getTransportIcon = (transport) => {
    if (!transport) return <FaTruck />;
    
    const transportLower = transport.toLowerCase();
    if (transportLower.includes('maritimo') || transportLower.includes('marítimo')) {
      return <FaShip />;
    } else if (transportLower.includes('aereo') || transportLower.includes('aéreo')) {
      return <FaPlane />;
    } else if (transportLower.includes('terrestre')) {
      return <FaTruck />;
    }
    return <FaTruck />;
  };

  if (!data || data.length === 0) {
    return (
      <div className="recent-operations-empty">
        <p>No hay operaciones recientes disponibles</p>
      </div>
    );
  }

  return (
    <div className="recent-operations-table">
      <div className="table-container">
        <table className="operations-table">
          <thead>
            <tr>
              <th><FaCalendarAlt className="inline mr-1" /> Fecha</th>
              <th><FaBox className="inline mr-1" /> Producto</th>
              <th><FaGlobe className="inline mr-1" /> País Destino</th>
              <th><FaWeight className="inline mr-1" /> Cantidad</th>
              <th><FaDollarSign className="inline mr-1" /> Valor (USD)</th>
              <th><FaTruck className="inline mr-1" /> Transporte</th>
              <th><FaCheckCircle className="inline mr-1" /> Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((operation, index) => (
              <tr key={operation.id || index}>
                <td className="date-cell">
                  {formatDate(operation.created_at)}
                </td>
                <td className="product-cell">
                  <div className="product-info">
                    <span className="product-code">
                      {operation.codigo_producto || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="country-cell">
                  {operation.nombre_del_pais_de_destino || 'N/A'}
                </td>
                <td className="quantity-cell">
                  {operation.peso_neto_kg ? 
                    `${parseFloat(operation.peso_neto_kg).toLocaleString()} kg` : 
                    'N/A'
                  }
                </td>
                <td className="value-cell">
                  {formatCurrency(operation.valor_fob_en_dolares_estadounidenses || 0)}
                </td>
                <td className="transport-cell">
                  <div className="transport-info">
                    <span className="transport-icon">
                      {getTransportIcon(operation.medio_transporte)}
                    </span>
                    <span className="transport-text">
                      {operation.medio_transporte || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="status-cell">
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor('Completado'),
                      color: 'white'
                    }}
                  >
                    Completado
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOperations;
