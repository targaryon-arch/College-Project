import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Droplet, FileText, PieChart as PieIcon, 
  Activity, BarChart3, LogOut, MapPin, Search, Filter, 
  ChevronLeft, QrCode, Download, Clock, Image as ImageIcon, User,
  Settings, ShieldCheck, Zap, RefreshCw, BarChart2, Plus, Trash2
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// --- Dummy Data ---
const cityWaterData = [
  { city: 'Quetta', water: 850 }, { city: 'Pishin', water: 420 }, 
  { city: 'Sibi', water: 600 }, { city: 'Turbat', water: 550 }, { city: 'Khuzdar', water: 300 },
];

const citiesList = [
  { id: 1, name: 'Dera Murad Jamali', district: 'Nasirabad', type: 'Canal Irrigated', farmers: 1250 },
  { id: 2, name: 'Quetta', district: 'Quetta', type: 'Karez & Tube Well', farmers: 3420 },
  { id: 3, name: 'Sibi', district: 'Sibi', type: 'Spate & River', farmers: 890 },
];

const farmersData = [
  { id: 1001, name: 'Ahmad Khan', phone: '0300-1234567', cnic: '54400-1234567-1', address: 'Village Killi, Ward 4', city: 'Quetta', district: 'Quetta', type: 'Karez & Tube Well', area: '12 Acres', crops: 'Wheat, Barley', quota: '150 Tokens/Year', allotted: 120, utilized: 80, remaining: 40, lastCollection: '12-May-2026', status: 'Active' },
  { id: 1002, name: 'Tariq Baloch', phone: '0333-7654321', cnic: '54400-9876543-3', address: 'Zarghoon Road, Sector 2', city: 'Quetta', district: 'Quetta', type: 'Karez & Tube Well', area: '8 Acres', crops: 'Cotton', quota: '80 Tokens/Year', allotted: 80, utilized: 80, remaining: 0, lastCollection: '05-May-2026', status: 'Quota Exceeded' },
  { id: 1003, name: 'Sajid Ali', phone: '0345-9876543', cnic: '54400-5555555-5', address: 'Hanna Urak Valley', city: 'Quetta', district: 'Quetta', type: 'Karez & Tube Well', area: '25 Acres', crops: 'Wheat, Rice', quota: '250 Tokens/Year', allotted: 200, utilized: 150, remaining: 50, lastCollection: '15-May-2026', status: 'Active' },
];

const groundwaterLevelData = [
  { month: 'Jan', level: -45 }, { month: 'Feb', level: -46 }, { month: 'Mar', level: -44 },
  { month: 'Apr', level: -42 }, { month: 'May', level: -48 }, { month: 'Jun', level: -55 },
];

const tokenPieData = [
  { name: 'Utilized Tokens', value: 5100, color: '#16a34a' },
  { name: 'Remaining Tokens', value: 3500, color: '#2563eb' },
  { name: 'Expired/Voided', value: 320, color: '#dc2626' },
];

const monthlyUsageData = [
  { month: 'Jan', utilized: 400, allotted: 500 }, { month: 'Feb', utilized: 450, allotted: 500 },
  { month: 'Mar', utilized: 600, allotted: 600 }, { month: 'Apr', utilized: 800, allotted: 850 },
  { month: 'May', utilized: 950, allotted: 1000 }, { month: 'Jun', utilized: 1100, allotted: 1200 },
];

function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [extractionTab, setExtractionTab] = useState('assessment');

  const handleCityClick = (cityName) => {
    setSelectedCity(cityName);
    setActiveView('farmers_list');
  };

  const handleFarmerClick = (farmer) => {
    setSelectedFarmer(farmer);
    setActiveView('farmer_profile');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      
      {/* Sidebar Menu */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-blue-800 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <h2 className="text-xl font-bold tracking-wide">Irrigation Dept.</h2>
          <p className="text-sm text-green-400 font-medium mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <MenuItem icon={<BarChart2 size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <MenuItem icon={<Users size={20} />} label="Farmers Record" active={['farmers_record', 'farmers_list', 'farmer_profile'].includes(activeView)} onClick={() => setActiveView('farmers_record')} />
          <MenuItem icon={<Activity size={20} />} label="Extraction Mgt." active={activeView === 'extraction_mgt'} onClick={() => setActiveView('extraction_mgt')} />
          <MenuItem icon={<Droplet size={20} />} label="Total Water Supply" active={activeView === 'total_water'} onClick={() => setActiveView('total_water')} />
          <MenuItem icon={<FileText size={20} />} label="Allotted Water" active={activeView === 'allotted_water'} onClick={() => setActiveView('allotted_water')} />
          <MenuItem icon={<PieIcon size={20} />} label="Tokens Utilization" active={activeView === 'tokens_utilization'} onClick={() => setActiveView('tokens_utilization')} />
          <MenuItem icon={<BarChart3 size={20} />} label="Reports & Analytics" active={activeView === 'reports'} onClick={() => setActiveView('reports')} />
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <button onClick={() => navigate('/')} className="flex items-center space-x-3 text-red-300 hover:text-red-100 hover:bg-blue-800 w-full p-3 rounded-lg transition duration-200">
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        <header className="bg-white p-6 shadow-sm flex justify-between items-center border-b-4 border-green-500">
          <h1 className="text-2xl font-bold text-blue-900">
            {activeView === 'dashboard' && 'Dashboard Overview'}
            {activeView === 'farmers_record' && 'Farmers Record - Irrigated Cities'}
            {activeView === 'farmers_list' && `Farmers List: ${selectedCity}`}
            {activeView === 'farmer_profile' && 'Farmer Profile'}
            {activeView === 'extraction_mgt' && 'Water Extraction Management'}
            {activeView === 'total_water' && 'Total Water Supply Overview'}
            {activeView === 'allotted_water' && 'Allotted Water Quota'}
            {activeView === 'tokens_utilization' && 'Tokens Utilization Analysis'}
            {activeView === 'reports' && 'Reports & Analytics'}
          </h1>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 py-2 px-4 rounded-full">
            Logged in as: <span className="text-blue-900 font-bold">Admin</span>
          </div>
        </header>

        <div className="p-8">
          
          {/* VIEW: DASHBOARD */}
          {activeView === 'dashboard' && (
             <>
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
               <SummaryCard title="Registered Farmers" value="12,450" color="text-blue-700" bg="bg-blue-50" border="border-blue-200" />
               <SummaryCard title="Available Water" value="450M L" color="text-green-700" bg="bg-green-50" border="border-green-200" />
               <SummaryCard title="Tokens Issued" value="8,920" color="text-yellow-700" bg="bg-yellow-50" border="border-yellow-200" />
               <SummaryCard title="Tokens Utilized" value="5,100" color="text-purple-700" bg="bg-purple-50" border="border-purple-200" />
               <SummaryCard title="Capacity Left" value="35%" color="text-red-700" bg="bg-red-50" border="border-red-200" />
             </div>
             <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
               <h3 className="text-lg font-bold text-blue-900 mb-6">Water Allocation Overview (City Wise)</h3>
               <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={cityWaterData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="city" stroke="#4b5563" />
                     <YAxis stroke="#4b5563" />
                     <Tooltip cursor={{fill: '#f3f4f6'}} />
                     <Bar dataKey="water" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </>
          )}

          {/* VIEW: TOTAL WATER SUPPLY */}
          {activeView === 'total_water' && (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Total Water Supply Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SummaryCard title="Canal Water" value="250M Liters" color="text-blue-700" bg="bg-blue-50" border="border-blue-200" />
                <SummaryCard title="Karez & Tube Wells" value="150M Liters" color="text-green-700" bg="bg-green-50" border="border-green-200" />
                <SummaryCard title="Spate & River" value="50M Liters" color="text-cyan-700" bg="bg-cyan-50" border="border-cyan-200" />
              </div>
              <p className="text-gray-600 font-medium">More detailed supply metrics, district-wise distribution graphs, and reservoir levels will be displayed here.</p>
            </div>
          )}

          {/* VIEW: ALLOTTED WATER */}
          {activeView === 'allotted_water' && (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Allotted Water Quota by District</h3>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-2"><h4 className="text-lg font-bold text-gray-800">Quetta District</h4><span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold">120,000 AF/Year</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2"><div className="bg-blue-600 h-3 rounded-full" style={{width: '75%'}}></div></div>
                  <p className="text-sm text-gray-600 text-right font-medium">75% of annual quota distributed</p>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-2"><h4 className="text-lg font-bold text-gray-800">Pishin District</h4><span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">85,000 AF/Year</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2"><div className="bg-green-500 h-3 rounded-full" style={{width: '45%'}}></div></div>
                  <p className="text-sm text-gray-600 text-right font-medium">45% of annual quota distributed</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-2"><h4 className="text-lg font-bold text-gray-800">Sibi District</h4><span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold">95,000 AF/Year</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2"><div className="bg-purple-500 h-3 rounded-full" style={{width: '60%'}}></div></div>
                  <p className="text-sm text-gray-600 text-right font-medium">60% of annual quota distributed</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TOKENS UTILIZATION */}
          {activeView === 'tokens_utilization' && (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Tokens Utilization Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={tokenPieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                        {tokenPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 border-b pb-2">System-Wide Token Metrics</h4>
                  <DetailItem label="Total Tokens Issued (Annual)" value="8,920 Tokens" className="text-blue-700 font-bold text-lg" />
                  <DetailItem label="Actively Utilized" value="5,100 Tokens (57%)" className="text-green-700 font-bold text-lg" />
                  <DetailItem label="Pending / Available" value="3,500 Tokens (39%)" className="text-yellow-600 font-bold text-lg" />
                  <DetailItem label="Expired / Voided" value="320 Tokens (4%)" className="text-red-600 font-bold text-lg" />
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800 font-medium">Tokens are digitally verified at extraction points. Farmers exceeding their quota will have their access automatically restricted by the telemetry system.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: REPORTS & ANALYTICS */}
          {activeView === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
                <h3 className="text-xl font-bold text-blue-900 mb-6">Annual Water Utilization Trends</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyUsageData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" stroke="#4b5563" />
                      <YAxis stroke="#4b5563" />
                      <Tooltip cursor={{fill: '#f3f4f6'}} />
                      <Legend />
                      <Line type="monotone" dataKey="allotted" name="Allotted Quota (AF)" stroke="#2563eb" strokeWidth={3} />
                      <Line type="monotone" dataKey="utilized" name="Utilized Volume (AF)" stroke="#16a34a" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-700"><FileText size={24} /></div>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Ready</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Farmer Quota Report</h4>
                  <p className="text-sm text-gray-500 mb-4">Detailed breakdown of individual farmer token utilization and remaining balances across all districts.</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-100 transition"><Download size={18} /> Download PDF</button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg text-purple-700"><Activity size={24} /></div>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Ready</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Extraction Telemetry</h4>
                  <p className="text-sm text-gray-500 mb-4">System-wide sensor logs, tube well operational status, and automated deficit warnings for the current month.</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold py-2 rounded-lg hover:bg-blue-100 transition"><Download size={18} /> Download CSV</button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg text-orange-700"><RefreshCw size={24} /></div>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Generating...</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Aquifer Recharge Log</h4>
                  <p className="text-sm text-gray-500 mb-4">Efficiency metrics and volume measurements for all Managed Aquifer Recharge (MAR) basins.</p>
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold py-2 rounded-lg cursor-not-allowed" disabled><Clock size={18} /> Pending Data</button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: EXTRACTION MANAGEMENT */}
          {activeView === 'extraction_mgt' && (
            <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-900 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-200 bg-slate-50">
                <TabButton active={extractionTab === 'assessment'} onClick={() => setExtractionTab('assessment')} icon={<BarChart2 size={16}/>} label="1. Assessment" />
                <TabButton active={extractionTab === 'yield'} onClick={() => setExtractionTab('yield')} icon={<ShieldCheck size={16}/>} label="2. Safe Yield" />
                <TabButton active={extractionTab === 'infrastructure'} onClick={() => setExtractionTab('infrastructure')} icon={<Settings size={16}/>} label="3. Infrastructure" />
                <TabButton active={extractionTab === 'monitoring'} onClick={() => setExtractionTab('monitoring')} icon={<Activity size={16}/>} label="4. Monitoring" />
                <TabButton active={extractionTab === 'recharge'} onClick={() => setExtractionTab('recharge')} icon={<RefreshCw size={16}/>} label="5. Managed Recharge" />
              </div>

              <div className="p-8">
                {extractionTab === 'assessment' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-blue-900">Resource Assessment (Groundwater Levels)</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={groundwaterLevelData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={3} name="Water Table Depth (ft)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {extractionTab === 'yield' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <h4 className="text-lg font-bold text-green-900 mb-2">Calculated Safe Yield</h4>
                      <p className="text-4xl font-black text-green-700">12,500 <span className="text-xl font-semibold">Acre-Feet/yr</span></p>
                      <p className="text-sm text-green-800 mt-2">Maximum allowable extraction without depleting reserves in Quetta Valley.</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                      <h4 className="text-lg font-bold text-red-900 mb-2">Current Extraction Rate</h4>
                      <p className="text-4xl font-black text-red-700">14,200 <span className="text-xl font-semibold">Acre-Feet/yr</span></p>
                      <p className="text-sm text-red-800 mt-2 font-bold flex items-center"><Zap size={16} className="mr-1"/> Deficit Warning: Exceeding safe yield by 1,700 AF.</p>
                    </div>
                  </div>
                )}

                {extractionTab === 'infrastructure' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Extraction Infrastructure Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2"><span className="font-bold text-gray-800">Tube Well Q-101</span><span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Operational</span></div>
                        <p className="text-sm text-gray-600">Location: Hanna Urak</p><p className="text-sm text-gray-600">Capacity: 2 cusecs</p>
                      </div>
                      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2"><span className="font-bold text-gray-800">Tube Well P-40</span><span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold">Maintenance</span></div>
                        <p className="text-sm text-gray-600">Location: Pishin Bypass</p><p className="text-sm text-gray-600">Capacity: 1.5 cusecs</p>
                      </div>
                      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2"><span className="font-bold text-gray-800">Pump Station S-12</span><span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">Offline</span></div>
                        <p className="text-sm text-gray-600">Location: Sibi Canal</p><p className="text-sm text-gray-600">Capacity: 5 cusecs</p>
                      </div>
                    </div>
                  </div>
                )}

                {extractionTab === 'monitoring' && (
                  <div className="space-y-4">
                     <h3 className="text-xl font-bold text-blue-900 mb-4">Live Governance & Telemetry</h3>
                     <table className="w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-100 text-gray-700 text-sm"><tr><th className="p-3">Sensor ID</th><th className="p-3">Zone</th><th className="p-3">Current Flow</th><th className="p-3">Daily Quota Usage</th><th className="p-3">Status</th></tr></thead>
                        <tbody className="text-sm">
                          <tr className="border-t border-gray-200"><td className="p-3 font-semibold text-blue-900">SN-001</td><td className="p-3">Quetta North</td><td className="p-3">1.2 Cusecs</td><td className="p-3"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full" style={{width: '45%'}}></div></div></td><td className="p-3"><span className="text-green-600 font-bold">Normal</span></td></tr>
                          <tr className="border-t border-gray-200"><td className="p-3 font-semibold text-blue-900">SN-002</td><td className="p-3">Quetta South</td><td className="p-3">2.8 Cusecs</td><td className="p-3"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-red-600 h-2.5 rounded-full" style={{width: '95%'}}></div></div></td><td className="p-3"><span className="text-red-600 font-bold">Critical</span></td></tr>
                        </tbody>
                     </table>
                  </div>
                )}

                {extractionTab === 'recharge' && (
                  <div className="text-center p-10 bg-slate-50 rounded-lg border border-gray-200">
                    <RefreshCw size={48} className="mx-auto text-blue-500 mb-4 animate-spin-slow" style={{ animationDuration: '3s' }} />
                    <h3 className="text-2xl font-bold text-blue-900">Managed Aquifer Recharge (MAR)</h3>
                    <p className="text-gray-600 mt-2 max-w-lg mx-auto">Active recharge basins are currently operating at 65% efficiency. Rainwater harvesting integration scheduled for next monsoon season.</p>
                    <div className="mt-6 inline-flex gap-4">
                      <div className="bg-white p-4 rounded shadow-sm border border-gray-200"><p className="text-xs text-gray-500 font-bold uppercase">Volume Recharged</p><p className="text-xl font-black text-blue-700">1,250 AF</p></div>
                      <div className="bg-white p-4 rounded shadow-sm border border-gray-200"><p className="text-xs text-gray-500 font-bold uppercase">Active Basins</p><p className="text-xl font-black text-blue-700">4 / 6</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: FARMERS RECORD */}
          {activeView === 'farmers_record' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-md transition">
                  <Plus size={18} className="mr-2" /> Add New City
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {citiesList.map((city) => (
                  <div key={city.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-green-500 cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div><h3 className="text-xl font-bold text-blue-900">{city.name}</h3><p className="text-sm text-gray-500 font-medium flex items-center mt-1"><MapPin size={14} className="mr-1" /> District {city.district}</p></div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm"><span className="text-gray-600 font-medium">Irrigation Type:</span><span className="font-bold text-blue-800">{city.type}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600 font-medium">Registered Farmers:</span><span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{city.farmers}</span></div>
                    </div>
                    <button onClick={() => handleCityClick(city.name)} className="w-full mt-6 bg-blue-50 text-blue-900 font-semibold py-2 rounded-lg hover:bg-blue-100 transition-colors">View Farmers</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: FARMERS LIST */}
          {activeView === 'farmers_list' && (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <button onClick={() => setActiveView('farmers_record')} className="flex items-center text-blue-700 hover:text-blue-900 font-bold bg-blue-50 px-4 py-2 rounded-lg whitespace-nowrap">
                  <ChevronLeft size={20} className="mr-1" /> Back to Cities
                </button>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full lg:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input type="text" placeholder="Search farmer..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div className="flex space-x-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 font-medium">
                      <Filter size={18} className="mr-2" /> Filters
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition whitespace-nowrap">
                      <Plus size={18} className="mr-2" /> Add Farmer
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse cursor-pointer">
                  <thead><tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide border-b-2 border-gray-200"><th className="p-4 font-semibold">Serial No</th><th className="p-4 font-semibold">Farmer Name</th><th className="p-4 font-semibold">Land Area</th><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold text-right">Action</th></tr></thead>
                  <tbody className="text-sm">
                    {farmersData.map((farmer) => (
                      <tr key={farmer.id} onClick={() => handleFarmerClick(farmer)} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                        <td className="p-4 text-gray-600">#{farmer.id}</td><td className="p-4 font-bold text-blue-900">{farmer.name}</td><td className="p-4 text-gray-600">{farmer.area}</td>
                        <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${farmer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{farmer.status}</span></td>
                        <td className="p-4 text-right text-blue-600 font-semibold hover:underline">View Profile &rarr;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: FARMER PROFILE */}
          {activeView === 'farmer_profile' && selectedFarmer && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <button onClick={() => setActiveView('farmers_list')} className="flex items-center text-blue-700 hover:text-blue-900 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  <ChevronLeft size={20} className="mr-1" /> Back to List
                </button>
                <div className="flex gap-3">
                  <button className="flex items-center text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold shadow-md transition">
                    <Trash2 size={18} className="mr-2" /> Delete Profile
                  </button>
                  <button className="flex items-center text-blue-900 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg font-bold transition">
                    <Clock size={18} className="mr-2" /> Token History
                  </button>
                  <button className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold shadow-md transition">
                    <Download size={18} className="mr-2" /> PDF Report
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-900 overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-gray-200 flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                      <User size={40} className="text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-blue-900">{selectedFarmer.name}</h2>
                      <p className="text-gray-500 font-medium">Serial No: #{selectedFarmer.id}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${selectedFarmer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedFarmer.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <QrCode size={64} className="text-gray-800 mx-auto" />
                    <p className="text-xs text-gray-500 mt-1 font-medium">Farmer Verification</p>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Details</h3>
                    <DetailItem label="CNIC Number" value={selectedFarmer.cnic} />
                    <DetailItem label="Mobile Number" value={selectedFarmer.phone} />
                    <DetailItem label="Address" value={selectedFarmer.address} />
                    <DetailItem label="City & District" value={`${selectedFarmer.city}, ${selectedFarmer.district}`} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Land & Irrigation</h3>
                    <DetailItem label="Irrigation Type" value={selectedFarmer.type} />
                    <DetailItem label="Area of Land" value={selectedFarmer.area} />
                    <DetailItem label="Key Crops" value={selectedFarmer.crops} />
                    <DetailItem label="Assigned Water Quota" value={selectedFarmer.quota} className="text-blue-700 font-bold" />
                  </div>
                  <div className="space-y-4 bg-slate-50 p-5 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Token Utilization</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm font-medium">Allotted:</span>
                      <span className="font-bold text-gray-900">{selectedFarmer.allotted}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm font-medium">Utilized:</span>
                      <span className="font-bold text-gray-900">{selectedFarmer.utilized}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-bold">Remaining:</span>
                      <span className={`text-xl font-black ${selectedFarmer.remaining === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedFarmer.remaining}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Last Water Collection</p>
                      <p className="text-sm font-semibold text-blue-900">{selectedFarmer.lastCollection}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-slate-50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Irrigation Area / Garden Pictures</h3>
                  <div className="flex gap-4">
                    <div className="h-32 w-48 bg-gray-200 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-300 transition cursor-pointer">
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs font-semibold">View Image 1</span>
                    </div>
                    <div className="h-32 w-48 bg-gray-200 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-300 transition cursor-pointer">
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs font-semibold">View Image 2</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// Sub-components
function MenuItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${active ? 'bg-blue-800 text-white shadow-inner border-l-4 border-green-400' : 'text-gray-300 hover:bg-blue-800 hover:text-white border-l-4 border-transparent'}`}>
      {icon}
      <span className="font-medium text-left text-sm">{label}</span>
    </button>
  );
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center space-x-2 px-6 py-4 font-bold text-sm transition-colors border-b-4 ${active ? 'border-blue-900 text-blue-900 bg-white' : 'border-transparent text-gray-500 hover:text-blue-700 hover:bg-blue-50'}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function SummaryCard({ title, value, color, bg, border }) {
  return (
    <div className={`p-5 rounded-xl shadow-sm border ${border} ${bg}`}>
      <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-2">{title}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function DetailItem({ label, value, className = 'text-gray-900 font-semibold' }) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
      <p className={`text-sm ${className}`}>{value}</p>
    </div>
  );
}

export default Dashboard;