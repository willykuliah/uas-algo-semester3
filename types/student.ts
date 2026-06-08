export interface Student {
  id: string;
  nama: string;
  nim: string;
  tahun_angkatan: number;
  tempat_tanggal_lahir: string;
  email: string;
  status: "aktif" | "cuti" | "lulus";
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
}
