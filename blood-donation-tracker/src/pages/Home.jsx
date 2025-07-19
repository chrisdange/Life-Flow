function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to LifeFlow
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Save lives through blood donation. Connect donors with hospitals
              and track donation history, eligibility dates, and urgent needs in
              your area.
            </p>
            <div className="space-x-4">
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                Become a Donor
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition duration-300">
                Find Blood Banks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">1,234</div>
              <div className="text-gray-600">Active Donors</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">567</div>
              <div className="text-gray-600">Donations This Month</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">89</div>
              <div className="text-gray-600">Partner Hospitals</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">12</div>
              <div className="text-gray-600">Urgent Requests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Blood Types Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Current Blood Inventory
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
              (bloodType) => (
                <div
                  key={bloodType}
                  className="bg-gray-50 p-6 rounded-lg text-center"
                >
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {bloodType}
                  </div>
                  <div className="text-sm text-gray-600">Available</div>
                  <div className="mt-2 h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-red-500 rounded"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Urgent Needs Section */}
      <div className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-800">
            Urgent Blood Needs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">City General Hospital</h3>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                  URGENT
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Blood Type: <span className="font-semibold">O-</span>
              </p>
              <p className="text-gray-600 mb-4">
                Units Needed: <span className="font-semibold">5 units</span>
              </p>
              <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-300">
                Respond to Request
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">Metro Medical Center</h3>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                  HIGH
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Blood Type: <span className="font-semibold">AB+</span>
              </p>
              <p className="text-gray-600 mb-4">
                Units Needed: <span className="font-semibold">3 units</span>
              </p>
              <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-300">
                Respond to Request
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">Regional Blood Bank</h3>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  MEDIUM
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Blood Type: <span className="font-semibold">A+</span>
              </p>
              <p className="text-gray-600 mb-4">
                Units Needed: <span className="font-semibold">8 units</span>
              </p>
              <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-300">
                Respond to Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
