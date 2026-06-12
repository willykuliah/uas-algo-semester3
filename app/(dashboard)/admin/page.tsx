"use client";

import TableWithPagination from "@/components/customized/table/table-with-pagination";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div>
      <h1>Admin page</h1>

      <Badge variant="destructive">COBA SAMPAI DOWN</Badge>

      <TableWithPagination />
    </div>
  );
}
