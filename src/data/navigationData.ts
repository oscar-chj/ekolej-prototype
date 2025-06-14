import { UserRole } from "@/types/auth.types";

/**
 * Navigation item structure
 */
export interface NavigationItem {
  text: string;
  iconName: string; // Store icon name instead of JSX
  href: string;
  tooltip?: string;
  roles?: UserRole[];
}

/**
 * Main navigation menu items for the sidebar
 */
export const mainNavigationItems: NavigationItem[] = [
  {
    text: "Dashboard",
    iconName: "Dashboard",
    href: "/dashboard",
    tooltip: "View your dashboard",
  },
  {
    text: "Merit Points",
    iconName: "AssessmentOutlined",
    href: "/dashboard/merits",
    tooltip: "View and manage your merit points",
  },
  {
    text: "Events",
    iconName: "EventNote",
    href: "/dashboard/events",
    tooltip: "Browse and register for events",
  },
  {
    text: "Leaderboard",
    iconName: "Leaderboard",
    href: "/dashboard/leaderboard",
    tooltip: "View merit leaderboard",
  },
  {
    text: "Upload Merit",
    iconName: "Upload",
    href: "/dashboard/admin/merit-upload",
    tooltip: "Admin: Upload merit data via CSV",
    roles: [UserRole.ADMIN],
  },
];
