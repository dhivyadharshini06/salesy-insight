import { motion } from "framer-motion";
import { DollarSign, AlertTriangle, Package, BarChart3, Bell, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import ROIChart from "@/components/dashboard/ROIChart";
import RiskTopology from "@/components/dashboard/RiskTopology";
import CSVUpload from "@/components/dashboard/CSVUpload";
import WorkspaceQuickstart from "@/components/dashboard/WorkspaceQuickstart";

const Dashboard = () => {
  const handleCSVUpload = (data: any[]) => {
    console.log("CSV Data:", data);
    // Process data and update state
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              SALESY – AI-Driven Demand Forecasting & Inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ghost flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="btn-ghost flex items-center gap-2 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Stock Valuation"
            value="$27,622"
            icon={DollarSign}
            trend={{ value: 5.2, isPositive: true }}
            iconColor="text-primary"
            delay={0}
          />
          <KPICard
            title="Critical Alerts"
            value="3"
            icon={AlertTriangle}
            trend={{ value: -2, isPositive: false }}
            iconColor="text-warning"
            delay={0.1}
          />
          <KPICard
            title="Active SKUs"
            value="5"
            icon={Package}
            trend={{ value: 1, isPositive: true }}
            iconColor="text-info"
            delay={0.2}
          />
          <KPICard
            title="Model Precision"
            value="96.4%"
            icon={BarChart3}
            trend={{ value: 1.4, isPositive: true }}
            iconColor="text-primary"
            delay={0.3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3">
            <ROIChart />
          </div>
          <div className="lg:col-span-2">
            <RiskTopology />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <CSVUpload onUpload={handleCSVUpload} />
          </div>
          <div className="lg:col-span-2">
            <WorkspaceQuickstart />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
