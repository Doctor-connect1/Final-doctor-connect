import { FiSearch, FiBell } from "react-icons/fi";

interface TopNavigationProps {
  doctorName: string;
  avatarUrl?: string;
}

const TopNavigation = ({ doctorName, avatarUrl }: TopNavigationProps) => {
  return (
    <div className="flex items-center justify-between px-8 py-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-4xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-6 py-3 bg-gray-100 rounded-2xl focus:outline-none text-[#1F2937]"
          />
          <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

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
            <span className="font-medium">Dr. {doctorName}</span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#007E85]">
            <img
              src={avatarUrl || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
