import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  TrendingUp,
  TrendingDown,
  Package,
  X,
  Filter,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  product?: string;
  timestamp: string;
  isRead: boolean;
  action?: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Stock Critical - Immediate Action Required",
    message: "Faber-Castell Erasers stock is below safety threshold (8 units). Demand surge of 35% expected due to exam season.",
    product: "Faber-Castell Erasers",
    timestamp: "2 minutes ago",
    isRead: false,
    action: "Generate PO",
  },
  {
    id: "2",
    type: "warning",
    title: "Low Stock Warning",
    message: "Classmate Notebooks A4 approaching reorder level. Current stock: 45, Reorder level: 50.",
    product: "Classmate Notebooks A4",
    timestamp: "15 minutes ago",
    isRead: false,
    action: "Review Stock",
  },
  {
    id: "3",
    type: "info",
    title: "Festival Season Detected",
    message: "Diwali festival approaching in 3 weeks. Historical data suggests 40% increase in stationery demand.",
    timestamp: "1 hour ago",
    isRead: false,
  },
  {
    id: "4",
    type: "success",
    title: "Restock Completed",
    message: "Pilot Pen Blue restocked successfully. New stock level: 120 units.",
    product: "Pilot Pen Blue",
    timestamp: "3 hours ago",
    isRead: true,
  },
  {
    id: "5",
    type: "warning",
    title: "Demand Pattern Change",
    message: "DOMS Pencils HB showing unusual demand pattern. AI recommends increasing safety stock by 15%.",
    product: "DOMS Pencils HB",
    timestamp: "5 hours ago",
    isRead: true,
  },
  {
    id: "6",
    type: "info",
    title: "Model Accuracy Update",
    message: "Prophet model MAPE improved to 7.2% after incorporating recent festival data.",
    timestamp: "Yesterday",
    isRead: true,
  },
];

const alertTypeConfig = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    iconColor: "text-destructive",
    label: "Critical",
  },
  warning: {
    icon: TrendingDown,
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconColor: "text-warning",
    label: "Warning",
  },
  info: {
    icon: Info,
    bg: "bg-info/10",
    border: "border-info/30",
    iconColor: "text-info",
    label: "Info",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-primary/10",
    border: "border-primary/30",
    iconColor: "text-primary",
    label: "Success",
  },
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<"all" | "unread" | "critical" | "warning">("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "unread") return !alert.isRead;
    return alert.type === filter;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Alerts Hub</h1>
              <p className="text-muted-foreground text-sm">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : "All caught up!"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-secondary">
              Mark All as Read
            </button>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { value: "all", label: "All Alerts" },
            { value: "unread", label: "Unread" },
            { value: "critical", label: "Critical" },
            { value: "warning", label: "Warnings" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Alerts</h3>
              <p className="text-muted-foreground">
                {filter === "all" ? "You're all caught up!" : `No ${filter} alerts found.`}
              </p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const config = alertTypeConfig[alert.type];
              const Icon = config.icon;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`chart-container border-l-4 ${config.border} ${
                    !alert.isRead ? "bg-card" : "bg-card/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${!alert.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                              {alert.title}
                            </h4>
                            {!alert.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.timestamp}
                            </span>
                            {alert.product && (
                              <span className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {alert.product}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {alert.action && (
                            <button className="btn-primary text-sm py-2 px-4">
                              {alert.action}
                            </button>
                          )}
                          {!alert.isRead && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="btn-ghost text-sm py-2 px-3"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => dismissAlert(alert.id)}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
