"use client";

import MeritReports from "@/components/reports/MeritReports";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MeritReportsPage() {
  const [studentId, setStudentId] = useState<string>("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      setStudentId(session.user.id);
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!studentId) {
    return <div>Unable to load your profile. Please log in again.</div>;
  }

  const handleDownloadReport = () => {
    // In production, this would generate and download a PDF report
    // eslint-disable-next-line no-console
    console.log("Generating merit report...");

    // Example of what would happen in production:
    // const reportData = await fetch('/api/reports/merit-summary');
    // const blob = await reportData.blob();
    // downloadFile(blob, 'merit-report.pdf');

    alert("Merit report download started (demo functionality)");
  };

  const handlePrintReport = () => {
    // In production, this might prepare a print-friendly view
    window.print();
  };

  return (
    <MeritReports
      studentId={studentId}
      onDownloadReport={handleDownloadReport}
      onPrintReport={handlePrintReport}
      targetPoints={50}
    />
  );
}
