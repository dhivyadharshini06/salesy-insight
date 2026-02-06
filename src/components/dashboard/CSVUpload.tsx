import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CSVUploadProps {
  onUpload?: (data: any[]) => void;
}

const CSVUpload = ({ onUpload }: CSVUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string | null>(null);

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
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
    
    const requiredHeaders = ["date", "product_name", "quantity_sold"];
    const hasRequired = requiredHeaders.every((h) => 
      headers.some((header) => header.includes(h.replace("_", "")) || header === h)
    );

    if (!hasRequired) {
      throw new Error("CSV must contain Date, Product Name, and Quantity Sold columns");
    }

    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      return row;
    }).filter((row) => Object.values(row).some((v) => v !== ""));

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
      const text = await file.text();
      const data = parseCSV(text);
      
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setUploadStatus("success");
      toast.success(`Successfully processed ${data.length} records`);
      onUpload?.(data);
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
            <p className="text-sm text-muted-foreground mt-2">Validating and parsing data</p>
          </div>
        ) : uploadStatus === "success" ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-primary mb-4" />
            <p className="text-foreground font-medium">Upload Complete!</p>
            <p className="text-sm text-muted-foreground mt-2">{fileName} processed successfully</p>
            <button
              onClick={() => {
                setUploadStatus("idle");
                setFileName(null);
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
            <p className="text-sm text-muted-foreground mt-2">Please check your file format</p>
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
              Supports CSV format with Date, Product, and Quantity columns
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
