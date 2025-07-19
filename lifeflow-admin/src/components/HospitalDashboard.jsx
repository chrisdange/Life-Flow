import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import BloodInventoryCard from './hospital/BloodInventoryCard';
import BloodRequestForm from './hospital/BloodRequestForm';
import ActiveRequestsTable from './hospital/ActiveRequestsTable';
import DonationHistoryTable from './hospital/DonationHistoryTable';
import HospitalStats from './hospital/HospitalStats';

function HospitalDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [hospitalData, setHospitalData] = useState({
    name: 'City General Hospital',
    address: '123 Medical Center Dr, Healthcare City, HC 12345',
    phone: '(555) 123-4567',
    email: 'bloodbank@citygeneral.com'
  });

  // Mock data - will be replaced with Supabase calls
  const [bloodInventory, setBloodInventory] = useState([
    { type: 'A+', units: 45, critical: false, lastUpdated: '2024-01-14' },
    { type: 'A-', units: 12, critical: true, lastUpdated: '2024-01-14' },
    { type: 'B+', units: 28, critical: false, lastUpdated: '2024-01-13' },
    { type: 'B-', units: 8, critical: true, lastUpdated: '2024-01-14' },
    { type: 'AB+', units: 15, critical: false, lastUpdated: '2024-01-13' },
    { type: 'AB-', units: 3, critical: true, lastUpdated: '2024-01-14' },
    { type: 'O+', units: 67, critical: false, lastUpdated: '2024-01-14' },
    { type: 'O-', units: 18, critical: true, lastUpdated: '2024-01-14' }
  ]);

  const [activeRequests, setActiveRequests] = useState([
    {
      id: 1,
      bloodType: 'O-',
      unitsNeeded: 10,
      urgency: 'Critical',
      patientInfo: 'Emergency Surgery',
      requestedBy: 'Dr. Smith',
      dateRequested: '2024-01-14',
      status: 'Active'
    },
    {
      id: 2,
      bloodType: 'A+',
      unitsNeeded: 5,
      urgency: 'High',
      patientInfo: 'Scheduled Surgery',
      requestedBy: 'Dr. Johnson',
      dateRequested: '2024-01-13',
      status: 'Pending'
    }
  ]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'inventory', name: 'Blood Inventory', icon: '🩸' },
    { id: 'requests', name: 'Blood Requests', icon: '📋' },
    { id: 'donations', name: 'Recent Donations', icon: '💝' },
    { id: 'settings', name: 'Hospital Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LifeFlow Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">{hospitalData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-900">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">🏥</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <HospitalStats bloodInventory={bloodInventory} activeRequests={activeRequests} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Blood Types</h3>
                <div className="space-y-3">
                  {bloodInventory.filter(item => item.critical).map((item) => (
                    <div key={item.type} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center">
                        <span className="text-red-600 font-bold text-lg mr-3">{item.type}</span>
                        <span className="text-red-700">Critical Level</span>
                      </div>
                      <span className="text-red-600 font-semibold">{item.units} units</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 mr-3">✅</span>
                    <div>
                      <p className="text-sm font-medium">5 units of A+ received</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 mr-3">📋</span>
                    <div>
                      <p className="text-sm font-medium">New blood request submitted</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-600 mr-3">⚠️</span>
                    <div>
                      <p className="text-sm font-medium">O- inventory below threshold</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Blood Inventory Management</h2>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                Update Inventory
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bloodInventory.map((item) => (
                <BloodInventoryCard key={item.type} bloodType={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Blood Requests</h2>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                New Request
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ActiveRequestsTable requests={activeRequests} />
              </div>
              <div>
                <BloodRequestForm />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
            <DonationHistoryTable />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Hospital Settings</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
                  <input
                    type="text"
                    value={hospitalData.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={hospitalData.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={hospitalData.address}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={hospitalData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                  Update Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HospitalDashboard;
