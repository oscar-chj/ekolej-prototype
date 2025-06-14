/**
 * Sample merit summary data for the merits page
 * In production, this would come from database aggregations
 */

// Merit summary interface
export interface MeritSummaryData {
  totalPoints: number;
  targetPoints: number;
  academicPoints: number;      // University Merit
  cocurricularPoints: number;  // Faculty Merit
  communityPoints: number;     // College Merit
  associationPoints: number;   // Association Merit
  recentActivities: number;
  rank: number;
  totalStudents: number;
  progressPercentage: number;
}

export const sampleMeritSummary: MeritSummaryData = {
  totalPoints: 142,
  targetPoints: 150,
  academicPoints: 40,
  cocurricularPoints: 52,
  communityPoints: 30,
  associationPoints: 20,
  recentActivities: 6,
  rank: 4,
  totalStudents: 120,
  progressPercentage: 94.7
};

/**
 * Utility functions for merit calculations
 * These would typically be database queries or computed fields
 */
export function calculateProgressPercentage(totalPoints: number, targetPoints: number): number {
  return Math.round((totalPoints / targetPoints) * 100 * 10) / 10;
}

export function getRemainingPoints(totalPoints: number, targetPoints: number): number {
  return Math.max(targetPoints - totalPoints, 0);
}

export function getCategoryProgress(points: number, targetPoints: number): number {
  return Math.min((points / targetPoints) * 100, 100);
}

/**
 * Get merit insights based on progress
 */
export function getMeritInsights(data: MeritSummaryData): {
  message: string;
  type: 'success' | 'warning' | 'info' | 'primary';
  action?: string;
} {
  const { totalPoints, targetPoints, progressPercentage } = data;
  
  if (progressPercentage >= 100) {
    return {
      message: '🎉 Congratulations! You\'ve achieved your target!',
      type: 'success'
    };
  } else if (progressPercentage >= 80) {
    return {
      message: `Just ${targetPoints - totalPoints} points to reach your target!`,
      type: 'warning',
      action: 'Browse upcoming events'
    };
  } else if (progressPercentage >= 50) {
    return {
      message: 'Great progress! You\'re halfway to your goal.',
      type: 'info',
      action: 'Find more activities'
    };
  } else {
    return {
      message: 'Let\'s get started on building your merit points!',
      type: 'primary',
      action: 'Explore opportunities'
    };
  }
}
