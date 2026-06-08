// services/studentService.ts
import api from "./api";
import { Student } from "@/types/student";

export const studentService = {
  // Get all students
  getAll: async () => {
    try {
      const response = await api.get("/students");
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      console.error("Error fetching all students:", error);
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch students",
      };
    }
  },

  // Get single student
  getById: async (id: string) => {
    try {
      const response = await api.get(`/students/${id}`);
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      console.error(`Error fetching student with id ${id}:`, error);
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch student",
      };
    }
  },

  // Create new student
  create: async (studentData: Omit<Student, "id">) => {
    try {
      const response = await api.post("/students", studentData);
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      console.error("Error creating student:", error);
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create student",
      };
    }
  },

  // Update student (PATCH)
  update: async (id: string, studentData: Partial<Student>) => {
    try {
      const response = await api.patch(`/students/${id}`, studentData);
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      console.error(`Error updating student with id ${id}:`, error);
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update student",
      };
    }
  },

  // Delete student
  delete: async (id: string) => {
    try {
      await api.delete(`/students/${id}`);
      return {
        success: true,
        data: id,
        error: null,
      };
    } catch (error: any) {
      console.error(`Error deleting student with id ${id}:`, error);
      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete student",
      };
    }
  },

  // =============== FILE I/O OPERATIONS ===============

  // Export data ke file JSON (Save)
  exportToFile: async () => {
    try {
      const response = await api.get("/students");
      const data = response.data;

      // Konversi ke JSON string
      const jsonString = JSON.stringify(data, null, 2);

      // Download file
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `students_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        data: data,
        error: null,
        message: `Successfully exported ${data.length} students`,
      };
    } catch (error: any) {
      console.error("Error exporting data:", error);
      return {
        success: false,
        data: null,
        error: error.message || "Failed to export data",
      };
    }
  },

  // Import data dari file (Load)
  importFromFile: async (
    file: File,
  ): Promise<{
    success: boolean;
    data: Student[] | null;
    error: string | null;
  }> => {
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            const importedData = JSON.parse(content);

            // Validasi data
            if (!Array.isArray(importedData)) {
              resolve({
                success: false,
                data: null,
                error: "File must contain an array of students",
              });
              return;
            }

            // Validasi setiap student
            const validStudents = importedData.filter((item: any) => {
              return item.nama && item.nim && item.email;
            });

            if (validStudents.length === 0) {
              resolve({
                success: false,
                data: null,
                error: "No valid student data found in file",
              });
              return;
            }

            // Generate new IDs untuk menghindari konflik
            const studentsWithNewIds = validStudents.map(
              (student: any, index: number) => ({
                ...student,
                id:
                  Date.now() + index + Math.random().toString(36).substr(2, 9),
              }),
            );

            // Save ke server
            const savePromises = studentsWithNewIds.map((student: Student) =>
              api.post("/students", student),
            );

            await Promise.all(savePromises);

            resolve({
              success: true,
              data: studentsWithNewIds,
              error: null,
            });
          } catch (err: any) {
            resolve({
              success: false,
              data: null,
              error: "Invalid JSON format: " + err.message,
            });
          }
        };

        reader.onerror = () => {
          resolve({
            success: false,
            data: null,
            error: "Failed to read file",
          });
        };

        reader.readAsText(file);
      });
    } catch (error: any) {
      console.error("Error importing data:", error);
      return {
        success: false,
        data: null,
        error: error.message || "Failed to import data",
      };
    }
  },
};
