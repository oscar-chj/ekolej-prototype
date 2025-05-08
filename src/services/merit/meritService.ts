"use client";

import { meritRecords } from '../../data/meritRecords';
import { students } from '../../data/students';
import { ApiResponse, MeritRecord, PaginatedResponse, PaginationParams } from '../../types/api.types';

/**
 * Service for merit-related operations
 * This provides an abstraction layer for accessing merit data
 * and can be easily replaced with a real API implementation later
 */
export class MeritService {
  /**
   * Get all merit records for a student with pagination
   * @param studentId - ID of the student
   * @param params - Optional pagination parameters
   * @returns Paginated response of merit records
   */
  async getStudentMeritRecords(
    studentId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<MeritRecord[]>> {
    try {
      if (!studentId) {
        return this.createErrorPaginatedResponse('Student ID is required', params);
      }

      // Filter records by student ID
      const studentMeritRecords = meritRecords.filter(record => record.studentId === studentId);
      
      return this.paginateResults(studentMeritRecords, params);
    } catch (error) {
      console.error('Error getting student merit records:', error);
      return this.createErrorPaginatedResponse('Failed to retrieve merit records', params);
    }
  }
  
  /**
   * Get merit records by event with pagination
   * @param eventId - ID of the event
   * @param params - Optional pagination parameters
   * @returns Paginated response of merit records
   */
  async getEventMeritRecords(
    eventId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<MeritRecord[]>> {
    try {
      if (!eventId) {
        return this.createErrorPaginatedResponse('Event ID is required', params);
      }

      // Filter records by event ID
      const eventMeritRecords = meritRecords.filter(record => record.eventId === eventId);
      
      return this.paginateResults(eventMeritRecords, params);
    } catch (error) {
      console.error('Error getting event merit records:', error);
      return this.createErrorPaginatedResponse('Failed to retrieve merit records', params);
    }
  }
  
  /**
   * Add a new merit record for a student
   * @param record - Merit record data without ID
   * @returns API response with the created merit record
   */
  async addMeritRecord(record: Omit<MeritRecord, 'id'>): Promise<ApiResponse<MeritRecord>> {
    try {
      // Validate input
      if (!record.studentId || !record.category || record.points === undefined) {
        return {
          success: false,
          error: 'Missing required fields'
        };
      }

      // Check if student exists
      const studentExists = students.some(s => s.id === record.studentId);
      if (!studentExists) {
        return {
          success: false,
          error: 'Student not found'
        };
      }
      
      // Create new merit record with a unique ID
      const newRecord: MeritRecord = {
        id: `mr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ...record
      };
      
      // Add to merit records (in a real app, this would be a database operation)
      meritRecords.push(newRecord);
      
      // Update student's total merit points
      const studentIndex = students.findIndex(s => s.id === record.studentId);
      if (studentIndex !== -1) {
        students[studentIndex].totalMeritPoints += record.points;
      }
      
      return {
        success: true,
        data: newRecord,
        message: 'Merit record added successfully'
      };
    } catch (error) {
      console.error('Error adding merit record:', error);
      return {
        success: false,
        error: 'Failed to add merit record'
      };
    }
  }
  
  /**
   * Verify a merit record
   * @param recordId - ID of the merit record to verify
   * @param verifiedBy - ID or name of the person verifying the record
   * @returns API response with the updated merit record
   */
  async verifyMeritRecord(
    recordId: string, 
    verifiedBy: string
  ): Promise<ApiResponse<MeritRecord>> {
    try {
      if (!recordId || !verifiedBy) {
        return {
          success: false,
          error: 'Record ID and verifier information are required'
        };
      }

      // Find the merit record
      const recordIndex = meritRecords.findIndex(r => r.id === recordId);
      
      if (recordIndex === -1) {
        return {
          success: false,
          error: 'Merit record not found'
        };
      }
      
      // Update the record (in a real app, this would be a database operation)
      meritRecords[recordIndex].isVerified = true;
      meritRecords[recordIndex].verifiedBy = verifiedBy;
      meritRecords[recordIndex].verificationDate = new Date().toISOString().split('T')[0];
      
      return {
        success: true,
        data: meritRecords[recordIndex],
        message: 'Merit record verified successfully'
      };
    } catch (error) {
      console.error('Error verifying merit record:', error);
      return {
        success: false,
        error: 'Failed to verify merit record'
      };
    }
  }
  
  /**
   * Get a merit record by ID
   * @param recordId - ID of the merit record
   * @returns API response with the merit record
   */
  async getMeritRecordById(recordId: string): Promise<ApiResponse<MeritRecord>> {
    try {
      if (!recordId) {
        return {
          success: false,
          error: 'Record ID is required'
        };
      }

      const record = meritRecords.find(r => r.id === recordId);
      
      if (!record) {
        return {
          success: false,
          error: 'Merit record not found'
        };
      }
      
      return {
        success: true,
        data: record
      };
    } catch (error) {
      console.error('Error getting merit record by ID:', error);
      return {
        success: false,
        error: 'Failed to retrieve merit record'
      };
    }
  }
  
  /**
   * Get merit summary by category for a student
   * @param studentId - ID of the student
   * @returns API response with merit points grouped by category
   */
  async getStudentMeritSummary(studentId: string): Promise<ApiResponse<Record<string, number>>> {
    try {
      if (!studentId) {
        return {
          success: false,
          error: 'Student ID is required'
        };
      }

      // Check if student exists
      const studentExists = students.some(s => s.id === studentId);
      if (!studentExists) {
        return {
          success: false,
          error: 'Student not found'
        };
      }
      
      // Get all merit records for the student
      const studentRecords = meritRecords.filter(r => r.studentId === studentId);
      
      // Calculate totals by category
      const categorySummary = studentRecords.reduce((acc, record) => {
        if (!acc[record.category]) {
          acc[record.category] = 0;
        }
        acc[record.category] += record.points;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        success: true,
        data: categorySummary
      };
    } catch (error) {
      console.error('Error getting student merit summary:', error);
      return {
        success: false,
        error: 'Failed to retrieve merit summary'
      };
    }
  }

  /**
   * Helper method to paginate results
   * @private
   */
  private paginateResults<T>(
    items: T[], 
    params?: PaginationParams
  ): PaginatedResponse<T[]> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedItems,
      pagination: {
        totalItems: items.length,
        totalPages: Math.ceil(items.length / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    };
  }

  /**
   * Helper method to create error response with pagination
   * @private
   */
  private createErrorPaginatedResponse<T>(
    error: string,
    params?: PaginationParams
  ): PaginatedResponse<T> {
    return {
      success: false,
      error,
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: params?.page || 1,
        itemsPerPage: params?.limit || 10
      }
    };
  }
}

// Export singleton instance
const meritService = new MeritService();
export default meritService;