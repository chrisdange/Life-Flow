function HospitalStats({ bloodInventory, activeRequests }) {
  const totalUnits = bloodInventory.reduce((sum, item) => sum + item.units, 0);
  const criticalTypes = bloodInventory.filter(item => item.critical).length;
  const urgentRequests = activeRequests.filter(req => req.urgency === 'Critical').length;
  const totalRequests = activeRequests.length;

  const stats = [
    {
      title: 'Total Blood Units',
      value: totalUnits,
      icon: '🩸',
      color: 'bg-red-500',
      change: '+12 from yesterday'
    },
    {
      title: 'Critical Blood Types',
      value: criticalTypes,
      icon: '⚠️',
      color: 'bg-yellow-500',
      change: `${criticalTypes} types need restocking`
    },
    {
      title: 'Active Requests',
      value: totalRequests,
      icon: '📋',
      color: 'bg-blue-500',
      change: `${urgentRequests} urgent requests`
    },
    {
      title: 'Donations Today',
      value: 8,
      icon: '💝',
      color: 'bg-green-500',
      change: '+3 from yesterday'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${stat.color} rounded-lg p-3 mr-4`}>
              <span className="text-white text-xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{stat.change}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HospitalStats;
