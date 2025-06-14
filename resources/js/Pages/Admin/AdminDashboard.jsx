import React from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Color schemes
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
const SECTORAL_COLORS = {
  'PWD': '#4e79a7',
  'LGBTQ+': '#e15759',
  'Women': '#76b7b2',
  'Senior Citizens': '#f28e2b',
  'Youth': '#edc948',
  'Voters': '#59a14f'
};

// Default data
const DEFAULT_RESIDENT_DATA = [
  { name: "Voters", value: 33 },
  { name: "Senior Citizens", value: 25 },
  { name: "Youth", value: 25 },
  { name: "Others", value: 17 }
];

const DEFAULT_SECTORAL_DATA = [
  { name: "PWD", count: 15, percentage: 12 },
  { name: "LGBTQ+", count: 8, percentage: 6 },
  { name: "Women", count: 42, percentage: 34 },
  { name: "Senior Citizens", count: 25, percentage: 20 },
  { name: "Youth", count: 18, percentage: 15 },
  { name: "Voters", count: 33, percentage: 27 }
];

const StatCard = ({ title, value, color, link, icon }) => {
  const content = (
    <div className={`bg-white rounded-lg shadow p-4 flex items-start h-full border-l-4 ${color}`}>
      <div className="flex items-center space-x-3">
        {icon && <div className="text-xl">{icon}</div>}
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
  return link ? <Link href={link}>{content}</Link> : content;
};

const SectoralBadge = ({ group, count, percentage }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: SECTORAL_COLORS[group] || '#cccccc' }}
        ></div>
        <span>{group}</span>
      </div>
      <div className="font-medium">
        {count} <span className="text-gray-500 text-sm">({percentage}%)</span>
      </div>
    </div>
  );
};

export default function Dashboard({ dashboardData = {} }) {
  const {
    totalResidents = 0,
    pendingRequests = 0,
    accountsToVerify = 0,
    formsToVerify = 0,
    documentRequests = [],
    residentDemographics = DEFAULT_RESIDENT_DATA,
    sectoralData = DEFAULT_SECTORAL_DATA,
    monthlyActivity = []
  } = dashboardData;

  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Barangay Dashboard</h1>
          <div className="flex gap-2">
            <Link 
              href="/admin/document-requests" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Document Requests
            </Link>
            <Link 
              href="/admin/residents/add-sectoral" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Add to Sectoral
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Residents" 
            value={totalResidents} 
            color="border-blue-500" 
            icon="👥"
          />
          <StatCard 
            title="Pending Requests" 
            value={pendingRequests} 
            color="border-yellow-500" 
            icon="⏳"
          />
          <StatCard 
            title="Document Requests" 
            value={documentRequests.length} 
            color="border-purple-500" 
            icon="📄"
            link="/admin/document-requests"
          />
          <StatCard 
            title="Forms to Verify" 
            value={formsToVerify} 
            color="border-red-500" 
            icon="📝"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Resident Demographics */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Resident Demographics</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={residentDemographics}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {residentDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} residents`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sectoral Groups with Percentages */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Sectoral Groups</h2>
                <Link href="/admin/sectoral" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              <div className="space-y-2">
                {sectoralData.map((group, index) => (
                  <SectoralBadge 
                    key={group.name || index}
                    group={group.name}
                    count={group.count}
                    percentage={group.percentage}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Monthly Activity</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="registrations" fill="#8884d8" name="Registrations" />
                    <Bar dataKey="documents" fill="#82ca9d" name="Documents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Document Requests */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Document Requests</h2>
              {documentRequests.length > 0 ? (
                <div className="space-y-3">
                  {documentRequests.slice(0, 5).map((request, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{request.type}</p>
                        <p className="text-sm text-gray-500">{request.resident}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent requests</p>
              )}
              <Link 
                href="/admin/document-requests" 
                className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-800"
              >
                View all document requests
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}