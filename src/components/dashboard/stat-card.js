import React from 'react';

function StatCard({ Icon, iconColor, title, value, subtitle, valueColor, action }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
      <Icon className={`w-8 h-8 mx-auto mb-2 ${iconColor}`} />
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export default StatCard;