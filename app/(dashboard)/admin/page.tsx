import TableWithPagination from "@/components/customized/table/table-with-pagination";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  return (
    <div className="">
      <h1>Admin page</h1>
      <Badge variant="destructive">COBA SAMPAI DOWN</Badge>

      <TableWithPagination></TableWithPagination>
    </div>
  );
}
