"use client";

import AdminMeritUpload from "@/components/admin/AdminMeritUpload";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Event } from "@/types/api.types";

interface CSVMeritEntry {
  studentId: string;
  studentName: string;
  points: number;
  meritType?: string;
  remarks?: string;
  isValid: boolean;
  status: "valid" | "invalid";
  errors?: string[];
  errorMessage?: string;
}

export default function AdminMeritUploadPage() {
  const handleUploadComplete = (uploadData: {
    validEntries: CSVMeritEntry[];
    event: Event;
  }) => {
    // In production, this would send data to the backend API
    console.log("Merit upload completed:", uploadData);

    // Example of what would happen in production:
    // await fetch('/api/admin/merit-upload', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(uploadData)
    // });
  };

  return (
    <DashboardLayout title="Admin - Upload Merit">
      <AdminMeritUpload onComplete={handleUploadComplete} />
    </DashboardLayout>
  );
}
