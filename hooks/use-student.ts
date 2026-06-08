// hooks/use-students.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { studentService } from "@/services/studentService";
import { Student } from "@/types/student";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<string>("");
  const [fileIOTime, setFileIOTime] = useState<number | null>(null);

  // State untuk pencarian & pengurutan
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchMethod, setSearchMethod] = useState<
    "linear" | "binary" | "sequential"
  >("linear");
  const [sortMethod, setSortMethod] = useState<
    "insertion" | "selection" | "merge" | "bubble" | "shell"
  >("insertion");
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [sortTime, setSortTime] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchField, setSearchField] = useState<keyof Student>("nama");
  const [updateTime, setUpdateTime] = useState<number | null>(null);

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    const startTime = performance.now();

    try {
      setLoading(true);
      setError(null);
      setLastAction("Fetching data...");

      const response = await studentService.getAll();

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (response.success) {
        setStudents(response.data || []);
        setFilteredStudents(response.data || []);
        setLoadTime(duration);
        setLastUpdateTime(Date.now());
        setLastAction(
          `Loaded ${response.data?.length || 0} students in ${duration.toFixed(2)}ms`,
        );
      } else {
        setError(response.error);
        setLastAction(`Failed: ${response.error}`);
      }
    } catch (err: any) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setError(err.message || "Error fetching students");
      setLastAction(`Error in ${duration.toFixed(2)}ms`);
    } finally {
      setLoading(false);
    }
  }, []);

  // =============== CRUD OPERATIONS ===============

  // Create new student (Tambah Data)
  const createStudent = useCallback(
    async (studentData: Omit<Student, "id">) => {
      const startTime = performance.now();
      setLastAction("Creating new student...");

      try {
        setError(null);
        const response = await studentService.create(studentData);

        const endTime = performance.now();
        const duration = endTime - startTime;

        if (response.success && response.data) {
          setStudents((prev) => [...prev, response.data!]);
          setFilteredStudents((prev) => [...prev, response.data!]);
          setLastUpdateTime(Date.now());
          setLastAction(`Created student in ${duration.toFixed(2)}ms`);
          setUpdateTime(duration);
          return response.data;
        } else {
          setError(response.error);
          setLastAction(`Create failed: ${response.error}`);
          throw new Error(response.error || "Failed to create");
        }
      } catch (err: any) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        setLastAction(`Create error in ${duration.toFixed(2)}ms`);
        throw err;
      }
    },
    [],
  );

  // Update student
  const updateStudent = useCallback(
    async (id: string, studentData: Student) => {
      const startTime = performance.now();
      setLastAction(`Updating student ${id}...`);

      try {
        setError(null);
        const response = await studentService.update(id, studentData);

        const endTime = performance.now();
        const duration = endTime - startTime;

        if (response.success && response.data) {
          setStudents((prev) =>
            prev.map((student) =>
              student.id === id ? response.data! : student,
            ),
          );
          setFilteredStudents((prev) =>
            prev.map((student) =>
              student.id === id ? response.data! : student,
            ),
          );
          setLastUpdateTime(Date.now());
          setLastAction(`Updated student ${id} in ${duration.toFixed(2)}ms`);
          setUpdateTime(duration);
          return response.data;
        } else {
          setError(response.error);
          setLastAction(`Update failed: ${response.error}`);
          throw new Error(response.error || "Failed to update");
        }
      } catch (err: any) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        setLastAction(`Update error in ${duration.toFixed(2)}ms`);
        throw err;
      }
    },
    [],
  );

  // Delete student
  const deleteStudent = useCallback(async (id: string) => {
    const startTime = performance.now();
    setLastAction(`Deleting student ${id}...`);

    try {
      setError(null);
      const response = await studentService.delete(id);

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (response.success) {
        setStudents((prev) => prev.filter((student) => student.id !== id));
        setFilteredStudents((prev) =>
          prev.filter((student) => student.id !== id),
        );
        setLastUpdateTime(Date.now());
        setLastAction(`Deleted student ${id} in ${duration.toFixed(2)}ms`);
        setUpdateTime(duration);
      } else {
        setError(response.error);
        setLastAction(`Delete failed: ${response.error}`);
        throw new Error(response.error || "Failed to delete");
      }
    } catch (err: any) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setLastAction(`Delete error in ${duration.toFixed(2)}ms`);
      throw err;
    }
  }, []);

  // =============== FILE I/O OPERATIONS ===============

  // Export/Save data ke file
  const exportToFile = useCallback(async () => {
    const startTime = performance.now();
    setLastAction("Exporting data to file...");

    try {
      const response = await studentService.exportToFile();

      const endTime = performance.now();
      const duration = endTime - startTime;
      setFileIOTime(duration);

      if (response.success) {
        setLastAction(
          `Exported ${response.data?.length || 0} students to file in ${duration.toFixed(2)}ms`,
        );
        return true;
      } else {
        setLastAction(`Export failed: ${response.error}`);
        setError(response.error);
        return false;
      }
    } catch (err: any) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setLastAction(`Export error in ${duration.toFixed(2)}ms`);
      setError(err.message);
      return false;
    }
  }, []);

  // Import/Load data dari file
  const importFromFile = useCallback(
    async (file: File) => {
      const startTime = performance.now();
      setLastAction(`Importing data from ${file.name}...`);
      setLoading(true);

      try {
        const response = await studentService.importFromFile(file);

        const endTime = performance.now();
        const duration = endTime - startTime;
        setFileIOTime(duration);

        if (response.success && response.data) {
          await fetchStudents(); // Refresh data setelah import
          setLastAction(
            `Imported ${response.data.length} students from ${file.name} in ${duration.toFixed(2)}ms`,
          );
          return true;
        } else {
          setLastAction(`Import failed: ${response.error}`);
          setError(response.error);
          return false;
        }
      } catch (err: any) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        setLastAction(`Import error in ${duration.toFixed(2)}ms`);
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchStudents],
  );

  // =============== SEARCH ALGORITHMS ===============

  // Linear Search - O(n)
  const linearSearch = (
    data: Student[],
    keyword: string,
    field: keyof Student,
  ): Student[] => {
    const startTime = performance.now();
    const results: Student[] = [];
    const lowerKeyword = keyword.toLowerCase();

    for (let i = 0; i < data.length; i++) {
      const fieldValue = String(data[i][field]).toLowerCase();
      if (fieldValue.includes(lowerKeyword)) {
        results.push(data[i]);
      }
    }

    const endTime = performance.now();
    setSearchTime(endTime - startTime);
    setLastAction(
      `Linear Search completed in ${(endTime - startTime).toFixed(2)}ms, found ${results.length} results`,
    );

    return results;
  };

  // Binary Search - O(log n)
  const binarySearch = (
    data: Student[],
    keyword: string,
    field: keyof Student,
  ): Student[] => {
    const startTime = performance.now();
    const sortedData = [...data].sort((a, b) =>
      String(a[field]).localeCompare(String(b[field])),
    );
    const results: Student[] = [];
    const lowerKeyword = keyword.toLowerCase();

    let left = 0;
    let right = sortedData.length - 1;
    let firstIndex = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midValue = String(sortedData[mid][field]).toLowerCase();

      if (midValue.startsWith(lowerKeyword)) {
        firstIndex = mid;
        right = mid - 1;
      } else if (midValue < lowerKeyword) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (firstIndex !== -1) {
      for (let i = firstIndex; i < sortedData.length; i++) {
        const fieldValue = String(sortedData[i][field]).toLowerCase();
        if (fieldValue.startsWith(lowerKeyword)) {
          results.push(sortedData[i]);
        } else {
          break;
        }
      }
    }

    const endTime = performance.now();
    setSearchTime(endTime - startTime);
    setLastAction(
      `Binary Search completed in ${(endTime - startTime).toFixed(2)}ms, found ${results.length} results`,
    );

    return results;
  };

  // Sequential Search - O(n)
  const sequentialSearch = (
    data: Student[],
    keyword: string,
    field: keyof Student,
  ): Student[] => {
    const startTime = performance.now();
    const results: Student[] = [];
    const lowerKeyword = keyword.toLowerCase();

    for (let i = 0; i < data.length; i++) {
      const fieldValue = String(data[i][field]).toLowerCase();
      if (fieldValue === lowerKeyword) {
        results.push(data[i]);
      }
    }

    const endTime = performance.now();
    setSearchTime(endTime - startTime);
    setLastAction(
      `Sequential Search completed in ${(endTime - startTime).toFixed(2)}ms, found ${results.length} results`,
    );

    return results;
  };

  // =============== SORTING ALGORITHMS ===============

  // Bubble Sort - O(n²)
  const bubbleSort = (
    data: Student[],
    field: keyof Student,
    order: "asc" | "desc",
  ): Student[] => {
    const startTime = performance.now();
    const arr = [...data];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        let comparison: boolean;
        if (order === "asc") {
          comparison = String(arr[j][field]) > String(arr[j + 1][field]);
        } else {
          comparison = String(arr[j][field]) < String(arr[j + 1][field]);
        }
        if (comparison) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }

    const endTime = performance.now();
    setSortTime(endTime - startTime);
    setLastAction(
      `Bubble Sort completed in ${(endTime - startTime).toFixed(2)}ms`,
    );
    return arr;
  };

  // Insertion Sort - O(n²)
  const insertionSort = (
    data: Student[],
    field: keyof Student,
    order: "asc" | "desc",
  ): Student[] => {
    const startTime = performance.now();
    const arr = [...data];

    for (let i = 1; i < arr.length; i++) {
      let current = arr[i];
      let j = i - 1;

      while (j >= 0) {
        let comparison: boolean;
        if (order === "asc") {
          comparison = String(arr[j][field]) > String(current[field]);
        } else {
          comparison = String(arr[j][field]) < String(current[field]);
        }
        if (comparison) {
          arr[j + 1] = arr[j];
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = current;
    }

    const endTime = performance.now();
    setSortTime(endTime - startTime);
    setLastAction(
      `Insertion Sort completed in ${(endTime - startTime).toFixed(2)}ms`,
    );
    return arr;
  };

  // Selection Sort - O(n²)
  const selectionSort = (
    data: Student[],
    field: keyof Student,
    order: "asc" | "desc",
  ): Student[] => {
    const startTime = performance.now();
    const arr = [...data];

    for (let i = 0; i < arr.length - 1; i++) {
      let selectedIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        let comparison: boolean;
        if (order === "asc") {
          comparison =
            String(arr[selectedIndex][field]) > String(arr[j][field]);
        } else {
          comparison =
            String(arr[selectedIndex][field]) < String(arr[j][field]);
        }
        if (comparison) {
          selectedIndex = j;
        }
      }
      if (selectedIndex !== i) {
        [arr[i], arr[selectedIndex]] = [arr[selectedIndex], arr[i]];
      }
    }

    const endTime = performance.now();
    setSortTime(endTime - startTime);
    setLastAction(
      `Selection Sort completed in ${(endTime - startTime).toFixed(2)}ms`,
    );
    return arr;
  };

  // Merge Sort - O(n log n)
  const mergeSort = (
    data: Student[],
    field: keyof Student,
    order: "asc" | "desc",
  ): Student[] => {
    const startTime = performance.now();

    const merge = (left: Student[], right: Student[]): Student[] => {
      const result: Student[] = [];
      let leftIndex = 0;
      let rightIndex = 0;

      while (leftIndex < left.length && rightIndex < right.length) {
        let comparison: boolean;
        if (order === "asc") {
          comparison =
            String(left[leftIndex][field]) <= String(right[rightIndex][field]);
        } else {
          comparison =
            String(left[leftIndex][field]) >= String(right[rightIndex][field]);
        }

        if (comparison) {
          result.push(left[leftIndex]);
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          rightIndex++;
        }
      }

      return result
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
    };

    const sort = (arr: Student[]): Student[] => {
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      const left = arr.slice(0, mid);
      const right = arr.slice(mid);
      return merge(sort(left), sort(right));
    };

    const sorted = sort([...data]);
    const endTime = performance.now();
    setSortTime(endTime - startTime);
    setLastAction(
      `Merge Sort completed in ${(endTime - startTime).toFixed(2)}ms`,
    );
    return sorted;
  };

  // Shell Sort - O(n log² n)
  const shellSort = (
    data: Student[],
    field: keyof Student,
    order: "asc" | "desc",
  ): Student[] => {
    const startTime = performance.now();
    const arr = [...data];
    const n = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j = i;

        while (j >= gap) {
          let comparison: boolean;
          if (order === "asc") {
            comparison = String(arr[j - gap][field]) > String(temp[field]);
          } else {
            comparison = String(arr[j - gap][field]) < String(temp[field]);
          }
          if (comparison) {
            arr[j] = arr[j - gap];
            j -= gap;
          } else {
            break;
          }
        }
        arr[j] = temp;
      }
    }

    const endTime = performance.now();
    setSortTime(endTime - startTime);
    setLastAction(
      `Shell Sort completed in ${(endTime - startTime).toFixed(2)}ms`,
    );
    return arr;
  };

  // Wrapper untuk search
  const performSearch = useCallback(
    (keyword: string, method: typeof searchMethod, field: keyof Student) => {
      if (!keyword.trim()) {
        setFilteredStudents(students);
        setSearchTime(null);
        setLastAction("Search cleared, showing all data");
        return;
      }

      let results: Student[] = [];
      switch (method) {
        case "linear":
          results = linearSearch(students, keyword, field);
          break;
        case "binary":
          results = binarySearch(students, keyword, field);
          break;
        case "sequential":
          results = sequentialSearch(students, keyword, field);
          break;
      }

      setFilteredStudents(results);
    },
    [students],
  );

  // Wrapper untuk sort
  const performSort = useCallback(
    (
      method: typeof sortMethod,
      field: keyof Student,
      order: "asc" | "desc",
    ) => {
      let results: Student[] = [];
      switch (method) {
        case "bubble":
          results = bubbleSort(filteredStudents, field, order);
          break;
        case "insertion":
          results = insertionSort(filteredStudents, field, order);
          break;
        case "selection":
          results = selectionSort(filteredStudents, field, order);
          break;
        case "merge":
          results = mergeSort(filteredStudents, field, order);
          break;
        case "shell":
          results = shellSort(filteredStudents, field, order);
          break;
      }

      setFilteredStudents(results);
    },
    [filteredStudents],
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students: filteredStudents,
    allStudents: students,
    loading,
    error,
    loadTime,
    updateTime,
    fileIOTime,
    lastUpdateTime,
    lastAction,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    exportToFile,
    importFromFile,
    // Search & Sort
    searchKeyword,
    setSearchKeyword,
    searchMethod,
    setSearchMethod,
    sortMethod,
    setSortMethod,
    searchTime,
    sortTime,
    sortOrder,
    setSortOrder,
    searchField,
    setSearchField,
    performSearch,
    performSort,
  };
};
