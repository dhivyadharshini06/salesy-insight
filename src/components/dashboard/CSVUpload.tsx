import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CSVUploadProps {
  onUploadComplete?: (recordCount: number) => void;
}

const CSVUpload = ({ onUploadComplete }: CSVUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const rawHeaders = lines[0].split(",").map((h) => h.trim());
    const headers = rawHeaders.map((h) => h.toLowerCase().replace(/\s+/g, "_"));

    // Check for required columns (flexible matching)
    const findCol = (target: string) =>
      headers.findIndex((h) => h === target || h.includes(target.replace("_", "")));

    const dateIdx = findCol("date");
    const productIdx = findCol("product_name");
    const qtyIdx = findCol("quantity_sold");

    if (dateIdx === -1 || productIdx === -1 || qtyIdx === -1) {
      throw new Error(
        "CSV must contain Date, Product Name, and Quantity Sold columns. Found: " +
          rawHeaders.join(", ")
      );
    }

    const brandIdx = findCol("brand");
    const festivalIdx = findCol("festival");

    const data = lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        if (values.every((v) => v === "")) return null;

        const saleDate = values[dateIdx];
        const productName = values[productIdx];
        const quantitySold = parseInt(values[qtyIdx], 10);

        if (!saleDate || !productName || isNaN(quantitySold)) return null;

        return {
          sale_date: saleDate,
          product_name: productName,
          quantity_sold: quantitySold,
          brand: brandIdx !== -1 ? values[brandIdx] || "" : "",
          festival: festivalIdx !== -1 ? values[festivalIdx] || undefined : undefined,
        };
      })
      .filter(Boolean) as Array<{
      sale_date: string;
      product_name: string;
      quantity_sold: number;
      brand: string;
      festival?: string;
    }>;

    return data;
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsUploading(true);
    setFileName(file.name);
    setUploadStatus("idle");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to upload data");
      }

      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        throw new Error("No valid data rows found in CSV");
      }

      // Auto-create products that don't exist yet
      const uniqueProducts = [...new Map(rows.map((r) => [r.product_name, r])).values()];

      // Fetch existing products for this user
      const { data: existingProducts } = await supabase
        .from("products")
        .select("id, name")
        .eq("user_id", user.id);

      const existingNames = new Set((existingProducts ?? []).map((p) => p.name.toLowerCase()));
      const productMap = new Map(
        (existingProducts ?? []).map((p) => [p.name.toLowerCase(), p.id])
      );

      // Create new products
      const newProducts = uniqueProducts.filter(
        (p) => !existingNames.has(p.product_name.toLowerCase())
      );

      if (newProducts.length > 0) {
        const { data: insertedProducts, error: productError } = await supabase
          .from("products")
          .insert(
            newProducts.map((p) => ({
              user_id: user.id,
              name: p.product_name,
              brand: p.brand,
              category: "",
              sku: "",
              current_stock: 0,
              reorder_level: 0,
            }))
          )
          .select("id, name");

        if (productError) {
          console.error("Product insert error:", productError);
        } else {
          (insertedProducts ?? []).forEach((p) =>
            productMap.set(p.name.toLowerCase(), p.id)
          );
        }
      }

      // Build sales rows with product_id links
      const salesRows = rows.map((r) => ({
        ...r,
        user_id: user.id,
        product_id: productMap.get(r.product_name.toLowerCase()) || null,
        festival: r.festival || null,
      }));

      // Insert in batches
      const batchSize = 100;
      let inserted = 0;
      for (let i = 0; i < salesRows.length; i += batchSize) {
        const batch = salesRows.slice(i, i + batchSize);
        const { error } = await supabase.from("sales_history").insert(batch);
        if (error) {
          console.error("Sales batch error:", error);
          throw new Error(`Failed at row ${i + 1}: ${error.message}`);
        }
        inserted += batch.length;
      }

      setRecordCount(inserted);
      setUploadStatus("success");
      toast.success(`Imported ${inserted} sales records & ${newProducts.length} new products`);
      onUploadComplete?.(inserted);
    } catch (error) {
      setUploadStatus("error");
      toast.error(error instanceof Error ? error.message : "Error processing file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="chart-container"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`upload-zone ${isDragging ? "border-primary bg-primary/5" : ""} ${
          uploadStatus === "success" ? "border-primary/50 bg-primary/5" : ""
        } ${uploadStatus === "error" ? "border-destructive/50 bg-destructive/5" : ""}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary mb-4 animate-spin" />
            <p className="text-foreground font-medium">Processing {fileName}...</p>
            <p className="text-sm text-muted-foreground mt-2">Parsing, creating products & inserting sales data</p>
          </div>
        ) : uploadStatus === "success" ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-primary mb-4" />
            <p className="text-foreground font-medium">Upload Complete!</p>
            <p className="text-sm text-muted-foreground mt-2">
              {recordCount} records from {fileName} saved to database
            </p>
            <button
              onClick={() => {
                setUploadStatus("idle");
                setFileName(null);
                setRecordCount(0);
              }}
              className="mt-4 text-primary text-sm hover:underline"
            >
              Upload another file
            </button>
          </div>
        ) : uploadStatus === "error" ? (
          <div className="flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-foreground font-medium">Upload Failed</p>
            <p className="text-sm text-muted-foreground mt-2">Please check your file format and try again</p>
            <button
              onClick={() => {
                setUploadStatus("idle");
                setFileName(null);
              }}
              className="mt-4 text-primary text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
            <p className="text-foreground font-medium">Upload Historical Sales Data</p>
            <p className="text-sm text-muted-foreground mt-2">
              CSV with Date, Product Name, Quantity Sold (optional: Brand, Festival)
            </p>
            <label className="mt-6 inline-block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="btn-primary cursor-pointer inline-flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Choose File
              </span>
            </label>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CSVUpload;
