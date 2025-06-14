import { UserRole } from '@/types/auth.types';

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
 * Sample user profile data 
 * In a real app this would come from context/state/auth
 */
export const sampleUserProfile = {
  name: 'John Doe',
  role: UserRole.STUDENT,
  avatar: '/default-avatar.png',
  studentId: 'S12345',
  faculty: 'Computer Science',
  year: '3'
};

/**
 * Main navigation menu items for the sidebar
 */
export const mainNavigationItems: NavigationItem[] = [
  { 
    text: 'Dashboard', 
    iconName: 'Dashboard',
    href: '/dashboard',
    tooltip: 'View your dashboard' 
  },
  { 
    text: 'Merit Points', 
    iconName: 'AssessmentOutlined',
    href: '/dashboard/merits',
    tooltip: 'View and manage your merit points' 
  },
  { 
    text: 'Events', 
    iconName: 'EventNote',
    href: '/dashboard/events',
    tooltip: 'Browse and register for events' 
  },
  { 
    text: 'Profile', 
    iconName: 'Person',
    href: '/dashboard/profile',
    tooltip: 'View and edit your profile' 
  },
  { 
    text: 'Settings', 
    iconName: 'Settings',
    href: '/dashboard/settings',
    tooltip: 'Manage your account settings',
    roles: [UserRole.ADMIN, UserRole.STUDENT]
  },
];
