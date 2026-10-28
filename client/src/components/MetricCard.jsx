import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = '#eff6ff',
  iconColor = '#2563eb',
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
                color: isPositive ? '#059669' : '#dc2626',
                backgroundColor: isPositive ? '#ecfdf5' : '#fef2f2',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: `1px solid ${isPositive ? '#a7f3d0' : '#fecaca'}`,
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {icon}
      </div>
    </div>
  );
};
