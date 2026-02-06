import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Loader2,
  Play,
  Info,
  ArrowRight,
  Zap,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

interface ForecastResult {
  productName: string;
  currentStock: number;
  recommendedStock: number;
  safetyStock: number;
  riskLevel: "low" | "medium" | "high";
  aiInsight: string;
  modelUsed: string;
  metrics: {
    mae: number;
    rmse: number;
    mape: number;
  };
}

// Mock forecast data
const mockHistoricalData = [
  { month: "Jan", actual: 120, forecast: 115 },
  { month: "Feb", actual: 150, forecast: 145 },
  { month: "Mar", actual: 180, forecast: 175 },
  { month: "Apr", actual: 160, forecast: 168 },
  { month: "May", actual: 200, forecast: 195 },
  { month: "Jun", actual: null, forecast: 220 },
  { month: "Jul", actual: null, forecast: 245 },
  { month: "Aug", actual: null, forecast: 230 },
];

const mockForecastResults: ForecastResult[] = [
  {
    productName: "Classmate Notebooks A4",
    currentStock: 45,
    recommendedStock: 120,
    safetyStock: 18,
    riskLevel: "high",
    aiInsight: "Demand surge expected due to Back-to-School season. Historical data shows 65% increase during August-September.",
    modelUsed: "Prophet",
    metrics: { mae: 12.5, rmse: 15.2, mape: 8.3 },
  },
  {
    productName: "Pilot Pen Blue",
    currentStock: 120,
    recommendedStock: 80,
    safetyStock: 12,
    riskLevel: "low",
    aiInsight: "Stable demand pattern detected. Current stock sufficient for next 45 days.",
    modelUsed: "ARIMA",
    metrics: { mae: 8.2, rmse: 10.5, mape: 5.1 },
  },
  {
    productName: "Faber-Castell Erasers",
    currentStock: 8,
    recommendedStock: 50,
    safetyStock: 8,
    riskLevel: "high",
    aiInsight: "Critical: Stock below safety threshold. Immediate reorder required. Festival season approaching.",
    modelUsed: "Prophet",
    metrics: { mae: 6.8, rmse: 9.2, mape: 7.5 },
  },
];

const Forecasting = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ForecastResult | null>(mockForecastResults[0]);

  const runAIEngine = async () => {
    setIsRunning(true);
    toast.info("AI Engine started. Analyzing historical data...");
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    setHasResults(true);
    setIsRunning(false);
    toast.success("Forecast complete! View results below.");
  };

  const getRiskColor = (level: string) => {
    const colors = {
      low: "text-primary",
      medium: "text-warning",
      high: "text-destructive",
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  const getRiskBg = (level: string) => {
    const colors = {
      low: "bg-primary/10",
      medium: "bg-warning/10",
      high: "bg-destructive/10",
    };
    return colors[level as keyof typeof colors] || colors.low;
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
            <h1 className="text-2xl font-bold text-foreground">AI Forecasting Engine</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Demand predictions powered by ML models
            </p>
          </div>
          <button
            onClick={runAIEngine}
            disabled={isRunning}
            className="btn-primary flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Analysis...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run AI Engine
              </>
            )}
          </button>
        </motion.div>

        {/* Model Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-foreground">Linear Regression</span>
            </div>
            <p className="text-sm text-muted-foreground">Basic trend analysis for stable patterns</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-info" />
              </div>
              <span className="font-medium text-foreground">ARIMA</span>
            </div>
            <p className="text-sm text-muted-foreground">Time-series with auto-correlation</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <span className="font-medium text-foreground">Prophet</span>
            </div>
            <p className="text-sm text-muted-foreground">Festival & seasonality aware</p>
          </div>
        </motion.div>

        {hasResults && (
          <>
            {/* Forecast Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="chart-container mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Historical vs Forecast</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct?.productName || "Select a product to view forecast"}
                  </p>
                </div>
                <select
                  value={selectedProduct?.productName || ""}
                  onChange={(e) => setSelectedProduct(mockForecastResults.find((p) => p.productName === e.target.value) || null)}
                  className="input-field w-auto"
                >
                  {mockForecastResults.map((result) => (
                    <option key={result.productName} value={result.productName}>
                      {result.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockHistoricalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 25%, 18%)" />
                    <XAxis dataKey="month" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                    <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 25%, 12%)",
                        border: "1px solid hsl(220, 25%, 18%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(160, 84%, 39%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(160, 84%, 39%)" }}
                      name="Actual Sales"
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="hsl(200, 90%, 50%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(200, 90%, 50%)" }}
                      name="AI Forecast"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Forecast Results */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground">Inventory Recommendations</h3>
              
              {mockForecastResults.map((result, index) => (
                <motion.div
                  key={result.productName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="chart-container"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${getRiskBg(result.riskLevel)} flex items-center justify-center`}>
                          {result.riskLevel === "high" ? (
                            <AlertCircle className={`w-6 h-6 ${getRiskColor(result.riskLevel)}`} />
                          ) : (
                            <CheckCircle className={`w-6 h-6 ${getRiskColor(result.riskLevel)}`} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{result.productName}</h4>
                          <p className={`text-sm font-medium capitalize ${getRiskColor(result.riskLevel)}`}>
                            {result.riskLevel} Risk
                          </p>
                        </div>
                      </div>

                      {/* AI Insight */}
                      <div className="p-4 rounded-lg bg-muted/50 mb-4">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground">{result.aiInsight}</p>
                        </div>
                      </div>

                      {/* Model Info */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Model: <span className="text-foreground font-medium">{result.modelUsed}</span></span>
                        <span className="text-muted-foreground">MAE: <span className="text-foreground font-medium">{result.metrics.mae}</span></span>
                        <span className="text-muted-foreground">MAPE: <span className="text-foreground font-medium">{result.metrics.mape}%</span></span>
                      </div>
                    </div>

                    {/* Stock Metrics */}
                    <div className="grid grid-cols-3 gap-4 lg:w-80">
                      <div className="stat-card p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase mb-1">Current</p>
                        <p className={`text-2xl font-bold ${result.currentStock < result.safetyStock ? "text-destructive" : "text-foreground"}`}>
                          {result.currentStock}
                        </p>
                      </div>
                      <div className="stat-card p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase mb-1">Recommended</p>
                        <p className="text-2xl font-bold text-primary">{result.recommendedStock}</p>
                      </div>
                      <div className="stat-card p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase mb-1">Safety</p>
                        <p className="text-2xl font-bold text-foreground">{result.safetyStock}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {!hasResults && !isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Cpu className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Forecasts Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Upload historical sales data and run the AI Engine to generate demand forecasts and inventory recommendations.
            </p>
            <button onClick={runAIEngine} className="btn-primary flex items-center gap-2">
              <Play className="w-5 h-5" />
              Run AI Engine
            </button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
