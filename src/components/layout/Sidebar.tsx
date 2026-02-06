import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SidebarProps {
  shopName?: string;
}

const Sidebar = ({ shopName = "Your Store" }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Inventory", path: "/inventory" },
    { icon: BarChart3, label: "Forecasting", path: "/forecasting" },
    { icon: Bell, label: "Alerts & Hub", path: "/alerts" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 relative`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-sidebar-accent border border-sidebar-border rounded-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div className={`p-6 ${isCollapsed ? "px-4" : ""}`}>
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-lg font-bold text-sidebar-foreground">SALESY</h1>
              <p className="text-xs text-sidebar-foreground/50 uppercase tracking-wider">
                Retail Intel
              </p>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? "nav-link-active" : ""} ${
                isCollapsed ? "justify-center px-3" : ""
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className={`p-4 border-t border-sidebar-border ${isCollapsed ? "px-2" : ""}`}>
        <div
          className={`flex items-center gap-3 mb-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-sm">
              {shopName.charAt(0).toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {shopName}
              </p>
              <p className="text-xs text-sidebar-foreground/50">Pro Plan</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
