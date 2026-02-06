import { motion } from "framer-motion";
import { AlertTriangle, Package } from "lucide-react";

interface RiskLevel {
  level: "low" | "medium" | "high";
  label: string;
  percentage: number;
  color: string;
}

const riskLevels: RiskLevel[] = [
  { level: "low", label: "Low Risk (Healthy)", percentage: 75, color: "bg-primary" },
  { level: "medium", label: "Medium Risk (Warning)", percentage: 18, color: "bg-warning" },
  { level: "high", label: "High Risk (Critical)", percentage: 7, color: "bg-destructive" },
];

const RiskTopology = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="chart-container h-full flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Risk Topology</h3>
        <p className="text-sm text-muted-foreground">Inventory health distribution</p>
      </div>

      <div className="space-y-5 flex-1">
        {riskLevels.map((risk, index) => (
          <motion.div
            key={risk.level}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{risk.label}</span>
              <span className="text-sm font-medium text-foreground">{risk.percentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${risk.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                className={`h-full rounded-full ${risk.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Priority Alert */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="mt-6 p-4 rounded-xl bg-primary text-primary-foreground"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">AI Priority One</p>
            <p className="text-sm opacity-90 mt-1">
              Restock <span className="font-semibold underline">Classmate Notebooks</span> now. 
              Demand surge of 26% expected in 48 hours.
            </p>
          </div>
        </div>
        <button className="w-full mt-4 py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
          Generate PO
        </button>
      </motion.div>
    </motion.div>
  );
};

export default RiskTopology;
