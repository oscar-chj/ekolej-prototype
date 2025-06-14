"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import EventList from "@/components/events/EventList";

export default function EventsPage() {
  const handleRefresh = () => {
    // In production, this could trigger additional actions
    // like analytics tracking, notifications, etc.
    console.log("Events refreshed from page level");
  };

  return (
    <DashboardLayout title="Browse Events">
      <EventList onRefresh={handleRefresh} />
    </DashboardLayout>
  );
}
