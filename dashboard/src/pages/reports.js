import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { StatusCell } from "../components/table/StatusCell";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { useState } from "react";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { SortingHeaderIcon } from "../components/table/SortingHeader";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
} from "../components/ui/select";
import { ToggleArchiveReport } from "../components/table/ToggleArchive";

const CATEGORY = {
  depot_sauvage: "Dépôt sauvage",
  voirie: "Voirie",
  bien_public: "Bien public",
  autre: "Autre",
};

export const STATUS = {
  signale: "Signalé",
  pris_en_charge: "Pris en charge",
  traite: "Traité",
};

function Reports() {
  const [columnFilters, setColumnFilters] = useState([
    {
      id: "archived",
      value: false,
    },
  ]);

  const [sorting, setSorting] = useState([]);

  const reportsQuery = useQuery(["reports"], async () => {
    const data = await fetch("/api/allreports").then((res) => {
      if (res.status === 401) window.location.href = "/login";
      return res.json();
    });
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
    }).then((res) => {
      if (res.status === 401) window.location.href = "/login";
    })
  );

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="pr-2">Date</span>
            <SortingHeaderIcon sorting={column.getIsSorted()} />
          </Button>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="pr-2">Catégorie</span>
            <SortingHeaderIcon sorting={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const label = CATEGORY[row.getValue("category")];
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="pr-2">Status</span>
            <SortingHeaderIcon sorting={column.getIsSorted()} />
          </Button>
        );
      },
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
      header: "Achived",
      cell: ({ row }) => {
        return <Checkbox checked={row.getValue("archived")} />;
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <ToggleArchiveReport
            id={row.getValue("id")}
            archived={row.getValue("archived")}
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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <div className="App">
      <div className="w-full flex p-4 gap-2 items-center">
        <div className="text-lg">Filters : </div>
        <div>
          <Select
            value={table.getColumn("category").getFilterValue() ?? ""}
            onValueChange={(value) =>
              table.getColumn("category").setFilterValue(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Catégorie</SelectLabel>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {Object.entries(CATEGORY).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={table.getColumn("status").getFilterValue() ?? ""}
            onValueChange={(value) =>
              table.getColumn("status").setFilterValue(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="">Tous les status</SelectItem>
                {Object.entries(STATUS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={table.getColumn("archived").getFilterValue() ?? ""}
            onValueChange={(value) =>
              table.getColumn("archived").setFilterValue(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Archivage" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Archivage</SelectLabel>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value={true}>Archivés</SelectItem>
                <SelectItem value={false}>Non archivés</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

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

export default Reports;
