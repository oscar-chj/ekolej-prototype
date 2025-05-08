'use client';

import { students } from '@/data/students';
import { ApiResponse, PaginatedResponse, PaginationParams, Student, StudentFilters } from '@/types/api.types';

/**
 * Service for student-related operations
 * This provides an abstraction layer for accessing student data
 * and can be easily replaced with a real API implementation later
 */
export class StudentService {
  /**
   * Get a list of students with pagination and optional filtering
   * @param params - Optional pagination parameters
   * @param filters - Optional student filters
   * @returns A paginated response containing students
   */
  async getStudents(
    params?: PaginationParams,
    filters?: StudentFilters
  ): Promise<PaginatedResponse<Student[]>> {
    try {
      // Apply filters
      const filteredStudents = this.applyStudentFilters(students, filters);
      
      // Apply pagination
      return this.paginateResults(filteredStudents, params);
    } catch (error) {
      console.error('Error getting students:', error);
      return this.createErrorPaginatedResponse('Failed to retrieve students', params);
    }
  }
  
  /**
   * Get a student by ID
   * @param id - The internal student ID
   * @returns API response containing the student or an error
   */
  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Student ID is required'
        };
      }
      
      const student = students.find(s => s.id === id);
      
      if (!student) {
        return {
          success: false,
          error: 'Student not found'
        };
      }
      
      return {
        success: true,
        data: student
      };
    } catch (error) {
      console.error('Error getting student by ID:', error);
      return {
        success: false,
        error: 'Failed to retrieve student'
      };
    }
  }
  
  /**
   * Get a student by their university student ID (not the internal ID)
   * @param studentId - The university student ID
   * @returns API response containing the student or an error
   */
  async getStudentByStudentId(studentId: string): Promise<ApiResponse<Student>> {
    try {
      if (!studentId) {
        return {
          success: false,
          error: 'Student ID is required'
        };
      }
      
      const student = students.find(s => s.studentId === studentId);
      
      if (!student) {
        return {
          success: false,
          error: 'Student not found'
        };
      }
      
      return {
        success: true,
        data: student
      };
    } catch (error) {
      console.error('Error getting student by student ID:', error);
      return {
        success: false,
        error: 'Failed to retrieve student'
      };
    }
  }

  /**
   * Get students by faculty
   * @param faculty - The faculty name
   * @param params - Optional pagination parameters
   * @returns A paginated response containing students
   */
  async getStudentsByFaculty(
    faculty: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Student[]>> {
    try {
      if (!faculty) {
        return this.createErrorPaginatedResponse('Faculty name is required', params);
      }
      
      const facultyStudents = students.filter(
        s => s.faculty.toLowerCase() === faculty.toLowerCase()
      );
      
      return this.paginateResults(facultyStudents, params);
    } catch (error) {
      console.error('Error getting students by faculty:', error);
      return this.createErrorPaginatedResponse('Failed to retrieve students', params);
    }
  }

  /**
   * Get top students by merit points
   * @param limit - Number of top students to retrieve
   * @returns API response containing the top students
   */
  async getTopStudents(limit: number = 10): Promise<ApiResponse<Student[]>> {
    try {
      const sortedStudents = [...students]
        .sort((a, b) => b.totalMeritPoints - a.totalMeritPoints)
        .slice(0, limit);
      
      return {
        success: true,
        data: sortedStudents
      };
    } catch (error) {
      console.error('Error getting top students:', error);
      return {
        success: false,
        error: 'Failed to retrieve top students'
      };
    }
  }

  /**
   * Apply filters to an array of students
   * @private
   */
  private applyStudentFilters(studentsArray: Student[], filters?: StudentFilters): Student[] {
    if (!filters) return [...studentsArray];
    
    let filteredStudents = [...studentsArray];
    
    if (filters.faculty) {
      filteredStudents = filteredStudents.filter(
        student => student.faculty.toLowerCase() === filters.faculty?.toLowerCase()
      );
    }
    
    if (filters.year !== undefined) {
      filteredStudents = filteredStudents.filter(
        student => student.year === filters.year
      );
    }
    
    if (filters.program) {
      filteredStudents = filteredStudents.filter(
        student => student.program.toLowerCase() === filters.program?.toLowerCase()
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredStudents = filteredStudents.filter(
        student => student.name.toLowerCase().includes(searchTerm) || 
                  student.studentId.toLowerCase().includes(searchTerm) ||
                  student.email.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredStudents;
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
const studentService = new StudentService();
export default studentService;