import meritService from '@/services/merit/meritService';
import { ApiResponse, EventCategory } from '@/types/api.types';

/**
 * Server action to get student merit summary 
 * @param studentId - The student's ID
 * @returns The merit summary including points and activities
 */
export async function getMeritSummary(studentId: string): Promise<ApiResponse<Record<string, number>>> {
  try {
    if (!studentId) {
      return {
        success: false,
        error: 'Student ID is required'
      };
    }
    
    return await meritService.getStudentMeritSummary(studentId);
  } catch (error) {
    console.error('Error fetching merit summary:', error);
    return {
      success: false,
      error: 'Failed to fetch merit summary'
    };
  }
}

/**
 * Server action to get student merit records
 * @param studentId - The student's ID
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 */
export async function getStudentMeritRecords(studentId: string, page = 1, limit = 10) {
  try {
    if (!studentId) {
      return {
        success: false,
        error: 'Student ID is required'
      };
    }
    
    return await meritService.getStudentMeritRecords(studentId, { page, limit });
  } catch (error) {
    console.error('Error fetching student merit records:', error);
    return {
      success: false,
      error: 'Failed to fetch merit records',
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage: limit
      }
    };
  }
}

/**
 * Server action to get merit record by ID
 * @param recordId - The merit record ID
 */
export async function getMeritRecordById(recordId: string) {
  try {
    if (!recordId) {
      return {
        success: false,
        error: 'Record ID is required'
      };
    }
    
    return await meritService.getMeritRecordById(recordId);
  } catch (error) {
    console.error('Error fetching merit record:', error);
    return {
      success: false,
      error: 'Failed to fetch merit record'
    };
  }
}

/**
 * Server action to add a new merit record
 * @param formData - Form data containing merit record details
 */
export async function addMeritRecord(formData: FormData) {
  try {
    const studentId = formData.get('studentId') as string;
    const category = formData.get('category') as EventCategory;
    const points = Number(formData.get('points'));
    const description = formData.get('description') as string;
    const eventId = formData.get('eventId') as string || undefined;
    const date = formData.get('date') as string || new Date().toISOString().split('T')[0];
    
    // Validate required fields
    if (!studentId || !category || !points || !description) {
      return {
        success: false,
        error: 'Please fill all required fields'
      };
    }
    
    return await meritService.addMeritRecord({
      studentId,
      category, // Type assertion to match the expected EventCategory
      points,
      description,
      eventId,
      date,
      isVerified: false
    });
  } catch (error) {
    console.error('Error adding merit record:', error);
    return {
      success: false,
      error: 'Failed to add merit record'
    };
  }
}

/**
 * Server action to verify a merit record
 * @param formData - Form data containing verification details
 */
export async function verifyMeritRecord(formData: FormData) {
  try {
    const recordId = formData.get('recordId') as string;
    const verifiedBy = formData.get('verifiedBy') as string;
    
    if (!recordId || !verifiedBy) {
      return {
        success: false,
        error: 'Record ID and verifier information are required'
      };
    }
    
    return await meritService.verifyMeritRecord(recordId, verifiedBy);
  } catch (error) {
    console.error('Error verifying merit record:', error);
    return {
      success: false,
      error: 'Failed to verify merit record'
    };
  }
}