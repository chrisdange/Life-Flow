function BloodInventoryCard({ bloodType }) {
  const getStatusColor = (units, critical) => {
    if (critical) return 'border-red-500 bg-red-50';
    if (units < 20) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  const getStatusText = (units, critical) => {
    if (critical) return 'Critical';
    if (units < 20) return 'Low';
    return 'Good';
  };

  const getStatusIcon = (units, critical) => {
    if (critical) return '🔴';
    if (units < 20) return '🟡';
    return '🟢';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${getStatusColor(bloodType.units, bloodType.critical)} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-red-600 mr-2">{bloodType.type}</span>
          <span className="text-lg">{getStatusIcon(bloodType.units, bloodType.critical)}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{bloodType.units}</p>
          <p className="text-sm text-gray-500">units</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          bloodType.critical 
            ? 'bg-red-100 text-red-800' 
            : bloodType.units < 20 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
        }`}>
          {getStatusText(bloodType.units, bloodType.critical)}
        </span>
        <p className="text-xs text-gray-500">
          Updated: {new Date(bloodType.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition duration-200">
          Update
        </button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-300 transition duration-200">
          History
        </button>
      </div>
    </div>
  );
}

export default BloodInventoryCard;
