import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = '#FAF6EF',
  iconColor = '#C46A45',
  trend,
}) => {
  const isPositive = trend && trend.startsWith('+');

  return (
    <div className="stat-card">
      <div style={{ flex: 1, marginRight: '0.75rem' }}>
        <span className="stat-label">{title}</span>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {subtitle}
          </p>
        )}
        {trend && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isPositive ? '#B89B6A' : '#C44545',
                backgroundColor: isPositive ? '#FAF6EF' : '#FCF4F4',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: `1px solid ${isPositive ? '#E2D3B8' : '#F3C6C6'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </span>
          </div>
        )}
      </div>
      <div
        className="stat-icon"
        style={{
          backgroundColor: iconBg,
          color: iconColor,
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 1px 3px rgba(37, 37, 37, 0.05)',
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default MetricCard;
