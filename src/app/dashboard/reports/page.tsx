"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MeritReports from "@/components/reports/MeritReports";
import authService from "@/services/auth/authService";
import { useEffect, useState } from "react";

export default function MeritReportsPage() {
  const [studentId, setStudentId] = useState<string>("1"); // Default fallback

  useEffect(() => {
    // Get current user ID from authentication
    const getCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setStudentId(user.id);
        } else {
          console.warn("No authenticated user found in reports page");
          // Don't fallback to default user - this causes admin to become user 1
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };

    getCurrentUser();
  }, []);

  const handleDownloadReport = () => {
    // In production, this would generate and download a PDF report
    console.log("Generating merit report...");

    // Example of what would happen in production:
    // const reportData = await fetch('/api/reports/merit-summary');
    // const blob = await reportData.blob();
    // downloadFile(blob, 'merit-report.pdf');

    alert("Merit report download started (demo functionality)");
  };

  const handlePrintReport = () => {
    // In production, this might prepare a print-friendly view
    console.log("Preparing print view...");
    window.print();
  };

  return (
    <DashboardLayout title="Merit Reports">
      <MeritReports
        studentId={studentId}
        onDownloadReport={handleDownloadReport}
        onPrintReport={handlePrintReport}
        targetPoints={50}
      />
    </DashboardLayout>
  );
}
