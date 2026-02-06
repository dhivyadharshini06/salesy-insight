import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle } from "lucide-react";

const data = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 800 },
  { month: "Mar", value: 1200 },
  { month: "Apr", value: 1800 },
  { month: "May", value: 2200 },
  { month: "Jun", value: 2600 },
];

const ROIChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="chart-container"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Financial ROI Impact</h3>
          <p className="text-sm text-muted-foreground">Projected savings from inventory optimization</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Validated Simulation
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 25%, 18%)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(220, 10%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(220, 10%, 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 25%, 12%)",
                border: "1px solid hsl(220, 25%, 18%)",
                borderRadius: "8px",
                color: "hsl(220, 10%, 95%)",
              }}
              formatter={(value: number) => [`$${value}`, "Savings"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="stat-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Savings (6MO)</p>
          <p className="text-2xl font-bold text-foreground">$14,250</p>
          <p className="text-xs text-primary mt-1">▲ 12% vs last period</p>
        </div>
        <div className="stat-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Overstock Reduction</p>
          <p className="text-2xl font-bold text-foreground">42%</p>
          <p className="text-xs text-primary mt-1">◉ Optimized Turnover</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ROIChart;
