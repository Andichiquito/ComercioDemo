import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
  return (
    <div className={`metric-card metric-card--${color}`}>
      <div className="metric-card__icon">
        {icon}
      </div>
      <div className="metric-card__content">
        <h3 className="metric-card__title">{title}</h3>
        <div className="metric-card__value">{value}</div>
        <p className="metric-card__subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default MetricCard;
