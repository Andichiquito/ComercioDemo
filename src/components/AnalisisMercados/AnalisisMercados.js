import React from 'react';
import './AnalisisMercados.css';

const AnalisisMercados = () => {
  return (
    <div className="analisis-mercados">
      {/* Header Section */}
      <div className="analisis-header">
        <div className="header-content">
         
          <p className="header-description">
            Análisis profundo de mercados internacionales, tendencias emergentes y oportunidades de negocio.
          </p>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="market-overview">
        <div className="market-card hot-markets">
          <div className="card-header">
            <span className="card-icon">🔥</span>
            <h3>Mercados Calientes</h3>
          </div>
          <div className="card-content">
            <div className="market-list">
              <span>Vietnam</span>
              <span>India</span>
              <span>Brasil</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar hot-progress"></div>
            </div>
            <div className="growth-text">Crecimiento: +85%</div>
          </div>
        </div>

        <div className="market-card stable-markets">
          <div className="card-header">
            <span className="card-icon">🌡️</span>
            <h3>Mercados Estables</h3>
          </div>
          <div className="card-content">
            <div className="market-list">
              <span>EE.UU.</span>
              <span>Canadá</span>
              <span>México</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar stable-progress"></div>
            </div>
            <div className="growth-text">Crecimiento: +65%</div>
          </div>
        </div>

        <div className="market-card emerging-markets">
          <div className="card-header">
            <span className="card-icon">❄️</span>
            <h3>Mercados Emergentes</h3>
          </div>
          <div className="card-content">
            <div className="market-list">
              <span>África</span>
              <span>Oceanía</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar emerging-progress"></div>
            </div>
            <div className="growth-text">Crecimiento: +45%</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Market Trends Table */}
        <div className="market-trends">
          <h2>📊 Tendencias del Mercado</h2>
          <div className="trends-table">
            <div className="table-header">
              <div className="header-cell">MERCADO</div>
              <div className="header-cell">TENDENCIA</div>
              <div className="header-cell">CAMBIO</div>
              <div className="header-cell">PREDICCIÓN</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell market-name">Estados Unidos</div>
              <div className="table-cell trend">
                <span className="trend-icon bullish">↗️</span>
                <span>Alcista</span>
              </div>
              <div className="table-cell change positive">+12.5%</div>
              <div className="table-cell prediction">Continúa creciendo</div>
            </div>

            <div className="table-row">
              <div className="table-cell market-name">Unión Europea</div>
              <div className="table-cell trend">
                <span className="trend-icon stable">➡️</span>
                <span>Estable</span>
              </div>
              <div className="table-cell change neutral">+3.2%</div>
              <div className="table-cell prediction">Lento crecimiento</div>
            </div>

            <div className="table-row">
              <div className="table-cell market-name">China</div>
              <div className="table-cell trend">
                <span className="trend-icon bearish">↘️</span>
                <span>Bajista</span>
              </div>
              <div className="table-cell change negative">-2.1%</div>
              <div className="table-cell prediction">Recuperación esperada</div>
            </div>

            <div className="table-row">
              <div className="table-cell market-name">Brasil</div>
              <div className="table-cell trend">
                <span className="trend-icon bullish">↗️</span>
                <span>Alcista</span>
              </div>
              <div className="table-cell change positive">+18.7%</div>
              <div className="table-cell prediction">Fuerte crecimiento</div>
            </div>
          </div>
        </div>

        {/* Opportunities Section */}
        <div className="opportunities-section">
          <h2>💡 Oportunidades</h2>
          
          <div className="opportunity-card green">
            <div className="opportunity-icon">↗️</div>
            <div className="opportunity-content">
              <h3>Productos Verdes</h3>
              <p>Demanda creciente en Europa</p>
              <div className="opportunity-value positive">+25%</div>
            </div>
          </div>

          <div className="opportunity-card blue">
            <div className="opportunity-icon">💻</div>
            <div className="opportunity-content">
              <h3>Tecnología</h3>
              <p>Mercado asiático en expansión</p>
              <div className="opportunity-value blue-value">+18%</div>
            </div>
          </div>

          <div className="opportunity-card orange">
            <div className="opportunity-icon">🧵</div>
            <div className="opportunity-content">
              <h3>Textiles</h3>
              <p>Nuevos mercados emergentes</p>
              <div className="opportunity-value orange-value">+15%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisMercados;
