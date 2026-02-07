import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SalesRecord {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name: string;
  brand: string;
  quantity_sold: number;
  sale_date: string;
  festival: string | null;
  created_at: string;
}

export function useSalesHistory() {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    const { data, error, count } = await supabase
      .from("sales_history")
      .select("*", { count: "exact" })
      .order("sale_date", { ascending: false })
      .limit(500);

    if (error) {
      toast.error("Failed to load sales data");
      console.error(error);
    } else {
      setSales(data ?? []);
      setTotalRecords(count ?? 0);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const insertBatch = async (
    rows: Array<{
      product_name: string;
      brand: string;
      quantity_sold: number;
      sale_date: string;
      festival?: string;
      product_id?: string;
    }>
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return null;
    }

    const insertRows = rows.map((row) => ({
      ...row,
      user_id: user.id,
      festival: row.festival || null,
      product_id: row.product_id || null,
    }));

    // Insert in batches of 100 for reliability
    const batchSize = 100;
    let insertedCount = 0;

    for (let i = 0; i < insertRows.length; i += batchSize) {
      const batch = insertRows.slice(i, i + batchSize);
      const { error } = await supabase.from("sales_history").insert(batch);

      if (error) {
        toast.error(`Failed to insert batch ${Math.floor(i / batchSize) + 1}`);
        console.error(error);
        return insertedCount;
      }
      insertedCount += batch.length;
    }

    await fetchSales();
    return insertedCount;
  };

  return { sales, isLoading, totalRecords, fetchSales, insertBatch };
}
