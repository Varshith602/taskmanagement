import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Completed':
        return {
          label: 'Completed',
          className: 'badge badge-completed',
          icon: <CheckCircle2 size={13} />,
        };
      case 'In Progress':
        return {
          label: 'In Progress',
          className: 'badge badge-inprogress',
          icon: <Clock size={13} />,
        };
      case 'Pending':
      default:
        return {
          label: 'Pending',
          className: 'badge badge-pending',
          icon: <AlertCircle size={13} />,
        };
    }
  };

  const { label, className, icon } = getBadgeConfig();

  return (
    <span className={className}>
      {icon}
      <span>{label}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const getBadgeConfig = () => {
    switch (priority) {
      case 'High':
        return {
          label: 'High Priority',
          className: 'badge badge-priority-high',
        };
      case 'Medium':
        return {
          label: 'Medium Priority',
          className: 'badge badge-priority-medium',
        };
      case 'Low':
      default:
        return {
          label: 'Low Priority',
          className: 'badge badge-priority-low',
        };
    }
  };

  const { label, className } = getBadgeConfig();

  return <span className={className}>{label}</span>;
};
