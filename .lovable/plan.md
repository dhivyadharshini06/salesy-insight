
# AI Forecasting Engine -- Implementation Plan

## Overview

Build a backend function that reads the user's real sales history data, sends it to Lovable AI for intelligent analysis, and returns structured demand forecasts with recommended stock levels, risk assessments, and explainable business insights. The Forecasting page will be updated to call this function and display live AI-generated results instead of mock data.

---

## Architecture

The system follows a three-step flow:

1. **Frontend** (Forecasting page) calls the backend function with the user's auth token
2. **Backend function** fetches the user's `sales_history` and `products` data from the database, builds a structured prompt, and calls Lovable AI using tool calling to get structured JSON output
3. **Frontend** receives the forecast results and renders them in the existing UI (chart + recommendation cards)

---

## What Gets Built

### 1. Backend Function: `ai-forecast`

A new backend function at `supabase/functions/ai-forecast/index.ts` that:

- Authenticates the request using the user's JWT token
- Queries `sales_history` (grouped by product, ordered by date) and `products` (current stock, reorder levels) for that user
- Pre-processes the data: aggregates monthly sales per product, calculates rolling averages, identifies festival patterns
- Constructs a detailed system prompt instructing the AI to act as a demand forecasting analyst evaluating ARIMA, Prophet, and Linear Regression models
- Uses **Lovable AI tool calling** (not raw JSON) with `google/gemini-3-flash-preview` to extract structured output containing:
  - Per-product forecasts (recommended stock, safety stock at 10-20%, risk level)
  - Model selection with simulated MAE, RMSE, MAPE metrics
  - Explainable business insights referencing seasonality and festivals
  - Monthly forecast values for chart visualization
- Returns the structured forecast data to the frontend
- Handles rate limit (429) and payment (402) errors gracefully

### 2. Database Table: `forecasts`

A new table to persist forecast results so users can view past runs without re-running the AI:

- `id` (uuid, primary key)
- `user_id` (uuid, RLS-protected)
- `forecast_data` (jsonb -- stores the full AI response)
- `created_at` (timestamptz)
- RLS policy: users can only read/insert their own forecasts

### 3. Frontend Updates: `Forecasting.tsx`

Replace all mock data with live data:

- Call the `ai-forecast` backend function when "Run AI Engine" is clicked
- Display a progress indicator during the AI call (typically 5-15 seconds)
- Render the AI-returned forecast results in the existing card and chart layout
- Populate the Historical vs Forecast chart with real monthly aggregated data from `sales_history` plus AI-projected future months
- Show a "no data" state if the user hasn't uploaded any sales history yet
- Store results in the `forecasts` table and load the most recent forecast on page load
- Handle and display error messages for rate limiting and insufficient credits

### 4. Custom Hook: `useForecast.ts`

A new React hook to manage forecast state:

- `runForecast()` -- calls the edge function
- `latestForecast` -- the most recent stored forecast
- `isRunning` -- loading state
- Loads the latest forecast from the `forecasts` table on mount

---

## Technical Details

### AI Prompt Strategy

The backend function will build a prompt like:

```
You are a demand forecasting analyst for a retail shop. Analyze the following 
historical sales data and current inventory levels. For each product, evaluate 
three forecasting models (Linear Regression, ARIMA, Prophet) and select the 
best-performing one. Consider seasonality, festivals, and trend patterns.
```

The data payload sent to the AI includes:
- Monthly aggregated sales per product (date, quantity)
- Festival tags associated with sales periods
- Current stock levels and reorder thresholds

### Tool Calling Schema

The AI will be instructed to return data via a tool call with this schema:

```
forecasts: array of {
  productName, currentStock, recommendedStock, safetyStock,
  riskLevel (low/medium/high), aiInsight (string),
  modelUsed (Linear Regression/ARIMA/Prophet),
  metrics: { mae, rmse, mape },
  monthlyForecast: array of { month, forecast }
}
```

### Config Update

The `supabase/config.toml` will be updated to register the new function with `verify_jwt = false` (JWT validated in code to allow proper error responses).

---

## File Changes Summary

| File | Action |
|------|--------|
| `supabase/functions/ai-forecast/index.ts` | Create -- edge function with AI logic |
| `supabase/config.toml` | Update -- register the new function |
| `src/hooks/useForecast.ts` | Create -- React hook for forecast state |
| `src/pages/Forecasting.tsx` | Update -- replace mock data with live AI results |
| Database migration | Create `forecasts` table with RLS |

---

## Edge Cases Handled

- **No sales data**: Show a friendly message directing user to upload CSV first
- **Rate limiting (429)**: Toast notification asking user to wait and retry
- **Payment required (402)**: Toast notification about adding credits
- **AI response parsing failure**: Fallback error message, no crash
- **Single product vs many**: Works with 1 product or 50+
- **Missing festivals**: AI still generates forecasts based on trend/seasonality alone
