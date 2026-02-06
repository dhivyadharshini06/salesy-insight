import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, Cpu, Rocket } from "lucide-react";

const WorkspaceQuickstart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="chart-container"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Workspace Quickstart</h3>
          <p className="text-sm text-muted-foreground">Operations shortcuts for Administrators</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/inventory"
          className="stat-card flex items-center gap-4 p-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
            <Package className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="font-medium text-foreground">Inventory Hub</p>
            <p className="text-xs text-muted-foreground">Management</p>
          </div>
        </Link>

        <Link
          to="/forecasting"
          className="stat-card flex items-center gap-4 p-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
            <Cpu className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="font-medium text-foreground">Run AI Engine</p>
            <p className="text-xs text-muted-foreground">Predictions</p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default WorkspaceQuickstart;
