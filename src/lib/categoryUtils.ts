import { EventCategory } from '@/types/api.types';

/**
 * Get theme color for event category
 * Returns Material-UI color names for consistency
 */
export const getCategoryColor = (category: EventCategory): 'primary' | 'secondary' | 'success' | 'info' | 'default' => {
  switch (category) {
    case EventCategory.ACADEMIC:
      return 'primary';
    case EventCategory.COCURRICULAR:
      return 'secondary';
    case EventCategory.COMMUNITY:
      return 'success';
    case EventCategory.LEADERSHIP:
      return 'info';
    case EventCategory.SPORTS:
      return 'default';
    default:
      return 'primary';
  }
};

/**
 * Get category display name
 */
export const getCategoryDisplayName = (category: EventCategory): string => {
  return category.toString();
};

/**
 * Get capacity status color based on registration percentage
 */
export const getCapacityStatusColor = (registered: number, capacity: number): 'success' | 'warning' | 'error' => {
  const percentage = registered / capacity;
  
  if (percentage >= 1.0) return 'error';    // Full
  if (percentage >= 0.8) return 'warning';  // Nearly full
  return 'success';                         // Available
};
