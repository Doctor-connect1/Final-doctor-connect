"use client";

import { IconType } from "react-icons";
import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiClock,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavItem {
  icon: IconType;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: FiGrid, href: "/dashboard/doctor", label: "Dashboard" },
  { icon: FiCalendar, href: "/dashboard/doctor/calendar", label: "Calendar" },
  { icon: FiUsers, href: "/dashboard/doctor/patients", label: "Patients" },
  { icon: FiClock, href: "/dashboard/doctor/history", label: "History" },
  { icon: FiSettings, href: "/dashboard/doctor/settings", label: "Settings" },
];

const SideNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 h-screen w-32 flex flex-col items-center py-8">
      <div className="flex flex-col items-center gap-8 h-full">
        {/* Logo with animation */}
        <motion.div
          className="mb-8"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#007E85] text-xl">+</span>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <NavButton
              key={item.href}
              icon={item.icon}
              href={item.href}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-auto">
          <NavButton
            icon={FiLogOut}
            href="/logout"
            label="Logout"
            isActive={false}
          />
        </div>
      </div>
    </nav>
  );
};

interface NavButtonProps {
  icon: IconType;
  href: string;
  label: string;
  isActive?: boolean;
}

const NavButton = ({ icon: Icon, href, label, isActive }: NavButtonProps) => {
  return (
    <Link href={href}>
      <motion.div
        className="group relative flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`p-3 rounded-xl transition-all duration-300 ${
            isActive
              ? "bg-white text-[#007E85] shadow-lg"
              : "text-white hover:bg-white/10"
          }`}
        >
          <Icon size={20} />
        </div>

        {/* Tooltip with animation */}
        <motion.div
          className="absolute left-16 hidden group-hover:block bg-white px-2 py-1 rounded-md shadow-md"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm text-[#007E85]">{label}</span>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default SideNavigation;
