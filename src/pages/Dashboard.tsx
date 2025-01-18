import React from "react";
import Button from "../components/Button";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {change && (
          <p className="text-green-500 text-sm mt-1">
            +{change} from last week
          </p>
        )}
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="primary">Create New Link</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Links" value="1,234" change="12%" icon="🔗" />
        <StatCard title="Total Clicks" value="45,678" change="8%" icon="👆" />
        <StatCard title="Active QR Codes" value="89" change="15%" icon="📱" />
        <StatCard title="Conversion Rate" value="67%" change="5%" icon="📈" />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Links</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Original URL</th>
                <th className="text-left py-3">Short URL</th>
                <th className="text-left py-3">Clicks</th>
                <th className="text-left py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - replace with real data */}
              <tr className="border-b">
                <td className="py-3">https://example.com/very-long-url</td>
                <td className="py-3">urlify.co/abc123</td>
                <td className="py-3">1,234</td>
                <td className="py-3">2 days ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
