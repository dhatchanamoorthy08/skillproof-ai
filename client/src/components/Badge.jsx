import React from 'react';
import { ShieldCheck, CheckCircle2, Award, FileCode2, Clock, AlertTriangle } from 'lucide-react';

export const SkillBadge = ({ status, text }) => {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return {
          className: 'badge badge-verified',
          icon: <ShieldCheck size={13} />,
          label: text || 'Verified Evidence',
        };
      case 'demonstrated':
        return {
          className: 'badge badge-demonstrated',
          icon: <FileCode2 size={13} />,
          label: text || 'Demonstrated Project',
        };
      case 'assessed':
        return {
          className: 'badge badge-assessed',
          icon: <Award size={13} />,
          label: text || 'Assessed Knowledge',
        };
      case 'claimed':
      default:
        return {
          className: 'badge badge-claimed',
          icon: <Clock size={13} />,
          label: text || 'Claimed Skill',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={config.className}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const ReadinessTierBadge = ({ tier }) => {
  switch (tier) {
    case 'Placement Ready':
      return (
        <span className="badge badge-ready">
          <CheckCircle2 size={13} />
          Placement Ready (&gt;75%)
        </span>
      );
    case 'Developing':
      return (
        <span className="badge badge-developing">
          <Clock size={13} />
          Developing (50-74%)
        </span>
      );
    case 'Needs Immediate Support':
    default:
      return (
        <span className="badge badge-support">
          <AlertTriangle size={13} />
          Needs Support (&lt;50%)
        </span>
      );
  }
};
