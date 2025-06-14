"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MeritReports from "@/components/reports/MeritReports";

export default function MeritReportsPage() {
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

  // Use a simulated student ID (in real app, this would come from auth context)
  const studentId = "1";

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
