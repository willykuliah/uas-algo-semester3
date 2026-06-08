// app/table-with-pagination/page.tsx
"use client";

import { useStudents } from "@/hooks/use-student";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Clock,
  Zap,
  RefreshCw,
  Database,
  Rocket,
  ThumbsUp,
  AlertCircle,
  Timer,
  Activity,
  Search,
  SortAsc,
  SortDesc,
  ChevronDown,
  CheckCircle,
  Loader2,
  ArrowUpDown,
  Binary,
  Hash,
  List,
  Sparkles,
  Gauge,
  Download,
  Upload,
  PlusCircle,
  Save,
  FileJson,
  FolderOpen,
} from "lucide-react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function TableWithPagination() {
  const {
    students,
    loading,
    updateStudent,
    deleteStudent,
    createStudent,
    exportToFile,
    importFromFile,
    loadTime,
    lastUpdateTime,
    lastAction,
    fetchStudents,
    searchKeyword,
    setSearchKeyword,
    searchMethod,
    setSearchMethod,
    sortMethod,
    setSortMethod,
    searchTime,
    sortTime,
    fileIOTime,
    sortOrder,
    setSortOrder,
    searchField,
    setSearchField,
    performSearch,
    performSort,
  } = useStudents();

  const [editingMhs, setEditingMhs] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    nama: "",
    nim: "",
    tahun_angkatan: new Date().getFullYear(),
    tempat_tanggal_lahir: "",
    email: "",
    status: "aktif" as const,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Edit
  const handleEditClick = (student) => {
    setEditingMhs({ ...student });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingMhs) {
      await updateStudent(editingMhs.id, editingMhs);
      setIsEditDialogOpen(false);
      setEditingMhs(null);
    }
  };

  // Handle Add New Student
  const handleAddStudent = async () => {
    if (!newStudent.nama || !newStudent.nim || !newStudent.email) {
      alert("Mohon isi Nama, NIM, dan Email!");
      return;
    }

    await createStudent(newStudent);
    setIsAddDialogOpen(false);
    setNewStudent({
      nama: "",
      nim: "",
      tahun_angkatan: new Date().getFullYear(),
      tempat_tanggal_lahir: "",
      email: "",
      status: "aktif",
    });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    await deleteStudent(id);
  };

  // Handle File Import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Input Change for Edit Form
  const handleInputChange = (field, value) => {
    setEditingMhs((prev) => ({ ...prev, [field]: value }));
  };

  const formatTime = (ms: number | null) => {
    if (!ms) return "0 ms";
    if (ms < 1000) return `${ms.toFixed(2)} ms`;
    return `${(ms / 1000).toFixed(2)} seconds`;
  };

  const formatDateTime = (timestamp: number | null) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleTimeString("id-ID");
  };

  const getTimeColor = (ms: number | null) => {
    if (!ms) return "text-gray-500";
    if (ms < 100) return "text-green-600 dark:text-green-400";
    if (ms < 500) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getTimeIcon = (ms: number | null) => {
    if (!ms) return <Clock className="h-4 w-4" />;
    if (ms < 100) return <Zap className="h-4 w-4 text-green-500" />;
    if (ms < 500) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <Timer className="h-4 w-4 text-red-500" />;
  };

  const getPerformanceIcon = (ms: number | null) => {
    if (!ms) return <Activity className="h-6 w-6" />;
    if (ms < 100) return <Rocket className="h-6 w-6 text-green-500" />;
    if (ms < 500) return <ThumbsUp className="h-6 w-6 text-yellow-500" />;
    return <AlertCircle className="h-6 w-6 text-red-500" />;
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-4">
      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Data</p>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Mahasiswa</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Load Time</p>
                <p className={`text-2xl font-bold ${getTimeColor(loadTime)}`}>
                  {formatTime(loadTime)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Initial load
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {getTimeIcon(loadTime)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">File I/O Time</p>
                <p className={`text-2xl font-bold ${getTimeColor(fileIOTime)}`}>
                  {formatTime(fileIOTime)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Save/Load</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileJson className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Update</p>
                <p className="text-lg font-semibold">
                  {formatDateTime(lastUpdateTime)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lastAction?.slice(0, 50)}...
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fetchStudents()}
                className="h-10 w-10"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="text-lg font-semibold">
                  {loadTime && loadTime < 100
                    ? "Excellent"
                    : loadTime && loadTime < 500
                      ? "Good"
                      : loadTime
                        ? "Slow"
                        : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {loadTime && loadTime < 100
                    ? "< 100ms"
                    : loadTime && loadTime < 500
                      ? "< 500ms"
                      : loadTime
                        ? "> 500ms"
                        : "Waiting..."}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {getPerformanceIcon(loadTime)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons: Add Data, Save, Load */}
      <div className="flex gap-2 flex-wrap">
        {/* Tombol Tambah Data */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Data Mahasiswa Baru</DialogTitle>
              <DialogDescription>
                Isi form di bawah ini untuk menambahkan mahasiswa baru.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-nama" className="text-right">
                  Nama Lengkap
                </Label>
                <Input
                  id="add-nama"
                  value={newStudent.nama}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, nama: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Contoh: Ahmad Fauzi"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-nim" className="text-right">
                  NIM
                </Label>
                <Input
                  id="add-nim"
                  value={newStudent.nim}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, nim: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Contoh: 20231001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-tahun" className="text-right">
                  Tahun Angkatan
                </Label>
                <Input
                  id="add-tahun"
                  type="number"
                  value={newStudent.tahun_angkatan}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      tahun_angkatan: parseInt(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-ttl" className="text-right">
                  Tempat/Tgl Lahir
                </Label>
                <Input
                  id="add-ttl"
                  value={newStudent.tempat_tanggal_lahir}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      tempat_tanggal_lahir: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="Contoh: Jakarta, 15 Januari 2005"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="add-email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="contoh@email.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newStudent.status}
                  onValueChange={(value) =>
                    setNewStudent({ ...newStudent, status: value as any })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="cuti">Cuti</SelectItem>
                    <SelectItem value="lulus">Lulus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={handleAddStudent}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tombol Save ke File */}
        <Button variant="outline" onClick={exportToFile} className="gap-2">
          <Save className="h-4 w-4" />
          Save to File
        </Button>

        {/* Tombol Load dari File */}
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          Load from File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>

      {/* Search & Sort Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                <h3 className="font-semibold">Pencarian Data</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={searchField}
                  onValueChange={(v) => setSearchField(v as any)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Pilih field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nama">Nama</SelectItem>
                    <SelectItem value="nim">NIM</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={searchMethod}
                  onValueChange={(v) => setSearchMethod(v as any)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <div className="flex items-center gap-2">
                      {searchMethod === "linear" && (
                        <List className="h-4 w-4" />
                      )}
                      {searchMethod === "binary" && (
                        <Binary className="h-4 w-4" />
                      )}
                      {searchMethod === "sequential" && (
                        <Hash className="h-4 w-4" />
                      )}
                      <SelectValue placeholder="Metode" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Search - O(n)</SelectItem>
                    <SelectItem value="binary">
                      Binary Search - O(log n)
                    </SelectItem>
                    <SelectItem value="sequential">
                      Sequential Search - O(n)
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Cari data..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />

                <Button
                  onClick={() =>
                    performSearch(searchKeyword, searchMethod, searchField)
                  }
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  Cari
                </Button>
              </div>

              {searchTime && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    Waktu pencarian:{" "}
                    <strong className={getTimeColor(searchTime)}>
                      {formatTime(searchTime)}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Sort Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                <h3 className="font-semibold">Pengurutan Data</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={sortMethod}
                  onValueChange={(v) => setSortMethod(v as any)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <div className="flex items-center gap-2">
                      {sortMethod === "bubble" && (
                        <Activity className="h-4 w-4" />
                      )}
                      {sortMethod === "insertion" && (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                      {sortMethod === "selection" && (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {sortMethod === "merge" && (
                        <GitMerge className="h-4 w-4" />
                      )}
                      {sortMethod === "shell" && <Hash className="h-4 w-4" />}
                      <SelectValue placeholder="Metode" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bubble">Bubble Sort - O(n²)</SelectItem>
                    <SelectItem value="insertion">
                      Insertion Sort - O(n²)
                    </SelectItem>
                    <SelectItem value="selection">
                      Selection Sort - O(n²)
                    </SelectItem>
                    <SelectItem value="merge">
                      Merge Sort - O(n log n)
                    </SelectItem>
                    <SelectItem value="shell">
                      Shell Sort - O(n log² n)
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="gap-2"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </Button>

                <Button
                  onClick={() =>
                    performSort(sortMethod, searchField, sortOrder)
                  }
                  className="gap-2"
                  variant="secondary"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Urutkan
                </Button>
              </div>

              {sortTime && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    Waktu pengurutan:{" "}
                    <strong className={getTimeColor(sortTime)}>
                      {formatTime(sortTime)}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Action Status */}
      {lastAction && (
        <div className="bg-muted/50 rounded-md p-3 text-sm">
          <Gauge className="h-4 w-4 inline mr-2" />
          <span className="font-semibold">Last action:</span> {lastAction}
        </div>
      )}

      {/* Tabel Data */}
      <div className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 w-16">ID</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>NIM</TableHead>
              <TableHead>Tahun Angkatan</TableHead>
              <TableHead>Tempat/Tanggal Lahir</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="pl-4">{student.id}</TableCell>
                <TableCell className="font-medium">{student.nama}</TableCell>
                <TableCell>{student.nim}</TableCell>
                <TableCell>{student.tahun_angkatan}</TableCell>
                <TableCell>{student.tempat_tanggal_lahir}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      student.status === "aktif"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : student.status === "cuti"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {student.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Dialog
                      open={isEditDialogOpen && editingMhs?.id === student.id}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditClick(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Edit Data Mahasiswa</DialogTitle>
                          <DialogDescription>
                            Ubah informasi mahasiswa pada form di bawah ini.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama" className="text-right">
                              Nama Lengkap
                            </Label>
                            <Input
                              id="nama"
                              value={editingMhs?.nama || ""}
                              onChange={(e) =>
                                handleInputChange("nama", e.target.value)
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nim" className="text-right">
                              NIM
                            </Label>
                            <Input
                              id="nim"
                              value={editingMhs?.nim || ""}
                              onChange={(e) =>
                                handleInputChange("nim", e.target.value)
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="tahun_angkatan"
                              className="text-right"
                            >
                              Tahun Angkatan
                            </Label>
                            <Input
                              id="tahun_angkatan"
                              type="number"
                              value={editingMhs?.tahun_angkatan || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "tahun_angkatan",
                                  parseInt(e.target.value),
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ttl" className="text-right">
                              Tempat/Tgl Lahir
                            </Label>
                            <Input
                              id="ttl"
                              value={editingMhs?.tempat_tanggal_lahir || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "tempat_tanggal_lahir",
                                  e.target.value,
                                )
                              }
                              className="col-span-3"
                              placeholder="Contoh: Jakarta, 15 Januari 2005"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={editingMhs?.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select
                              value={editingMhs?.status || ""}
                              onValueChange={(value) =>
                                handleInputChange("status", value)
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih status mahasiswa" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aktif">Aktif</SelectItem>
                                <SelectItem value="cuti">Cuti</SelectItem>
                                <SelectItem value="lulus">Lulus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Batal
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            Simpan Perubahan
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Hapus Data Mahasiswa?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data mahasiswa{" "}
                            {student.nama}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(student.id)}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          Showing {students.length} of {students.length} students
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-green-500" />
            <span>Fast: &lt;100ms</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-yellow-500" />
            <span>Good: &lt;500ms</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span>Slow: &gt;500ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
