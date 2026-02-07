import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  current_stock: number;
  reorder_level: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;
export type ProductUpdate = Partial<Omit<Product, "id" | "user_id" | "created_at" | "updated_at">>;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load products");
      console.error(error);
    } else {
      setProducts(data ?? []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Omit<ProductInsert, "user_id">) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return null;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({ ...product, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add product");
      console.error(error);
      return null;
    }

    setProducts((prev) => [data, ...prev]);
    return data;
  };

  const updateProduct = async (id: string, updates: ProductUpdate) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update product");
      console.error(error);
      return null;
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
      console.error(error);
      return false;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  return { products, isLoading, fetchProducts, addProduct, updateProduct, deleteProduct };
}
