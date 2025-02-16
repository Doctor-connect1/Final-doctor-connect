import PageContainer from "../components/PageContainer";
import { FiUser, FiLock, FiBell, FiCreditCard } from "react-icons/fi";

const SettingsPage = () => {
  return (
    <PageContainer title="Settings">
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiUser className="text-[#007E85] text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Name</span>
              <input
                type="text"
                defaultValue="Dr. Kim"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] text-gray-700"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                defaultValue="dr.kim@clinic.com"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiLock className="text-[#007E85] text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4 text-gray-700">
              Change Password
            </button>
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4 text-gray-700">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiBell className="text-[#007E85] text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Push Notifications</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FiCreditCard className="text-[#007E85] text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Billing</h2>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4 text-gray-700">
              Payment Methods
            </button>
            <button className="w-full text-left py-2 hover:bg-gray-50 rounded-lg px-4 text-gray-700">
              Billing History
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;