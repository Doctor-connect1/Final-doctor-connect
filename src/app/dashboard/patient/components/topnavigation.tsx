import { FiSearch, FiBell } from "react-icons/fi";

interface TopNavigationProps {
  patientName: string;
  avatarUrl: string | null;
}

const TopNavigation = ({ patientName, avatarUrl }: TopNavigationProps) => {
  return (
    <div className="flex items-center justify-between px-8 py-4">
      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="font-medium">Patient: {patientName}</span>
          </div>
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={`${patientName}'s avatar`}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">{patientName[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
