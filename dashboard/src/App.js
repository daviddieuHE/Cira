import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { StatusCell } from "./components/table/StatusCell";
import { Dialog, DialogContent, DialogTrigger } from "./components/ui/dialog";
import { useState } from "react";
import { Checkbox } from "./components/ui/checkbox";

const category = {
  depot_sauvage: "Dépôt sauvage",
  voirie: "Voirie",
  bien_public: "Bien public",
  autre: "Autre",
};

function App() {
  const [columnFilters, setColumnFilters] = useState([
    {
      id: "archived",
      value: false,
    },
  ]);

  const reportsQuery = useQuery(["reports"], async () => {
    const data = await fetch("/api/allreports").then((res) => res.json());
    return data.map(({ created_at, ...report }) => ({
      ...report,
      date: new Date(created_at).toLocaleString("fr-FR"),
      location: `${report.latitude} ${report.longitude}`,
    }));
  });

  const statusMutation = useMutation(["status"], (data) =>
    fetch(`/api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  );

  const archiveMutation = useMutation(["archive"], (data) =>
    fetch(`/api/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  );

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      visible: false,
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "category",
      header: "Catégorie",
      cell: ({ row }) => {
        const label = category[row.getValue("category")];
        return (
          <div>
            <div>{label}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Lieu",
      cell: ({ row }) => {
        const [lat, lng] = row.getValue("location").split(" ");
        return (
          <div>
            <div>Lt: {Number(lat).toFixed(5)}</div>
            <div>Lg: {Number(lng).toFixed(5)}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "picture",
      header: "Photo",
      cell: ({ row }) => {
        const uri = row.getValue("picture");
        return (
          <Dialog>
            <DialogTrigger>
              <img src={uri} alt="report" style={{ width: 100 }} />
            </DialogTrigger>
            <DialogContent>
              <img src={uri} alt="report" style={{ height: "70vh" }} />
            </DialogContent>
          </Dialog>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        return (
          <StatusCell
            currentStatus={row.getValue("status")}
            id={row.getValue("id")}
            statusMutation={statusMutation}
          />
        );
      },
    },
    {
      accessorKey: "archived",
      header: () => {
        return (
          <div className="flex items-center gap-5">
            <div>Archived</div>
            <Checkbox
              checked={table.getColumn("archived").getFilterValue()}
              onCheckedChange={(checked) => {
                table.getColumn("archived").setFilterValue(checked);
              }}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getValue("archived")}
            onCheckedChange={(checked) => {
              archiveMutation.mutate(
                { id: row.getValue("id"), archived: checked },
                { onSuccess: () => reportsQuery.refetch() }
              );
            }}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data: reportsQuery.data || [],
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="App">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {reportsQuery.isLoading ? "Loading..." : "No data to display"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;