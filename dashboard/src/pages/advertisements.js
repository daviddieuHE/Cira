import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { NewAdvertisementCell } from "../components/table/NewAdvertisementCell";
import { Checkbox } from "../components/ui/checkbox";
import { ToggleAdvertisement } from "../components/table/ToggleAdvertisement";
import { ToggleArchiveAdvertisement } from "../components/table/ToggleArchive";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
} from "../components/ui/select";
import { useState } from "react";

function Advertisements() {
  const [columnFilters, setColumnFilters] = useState([
    {
      id: "archived",
      value: false,
    },
  ]);

  const advertismentsQuery = useQuery(["advertisements"], () =>
    fetch("/api/alladvertisements").then((res) => {
      if (res.status === 401) window.location.href = "/login";
      return res.json();
    })
  );

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "start_date",
      header: "Start date",
      cell: ({ row }) => {
        const start_date = row.getValue("start_date");
        return start_date ? new Date(start_date).toLocaleDateString() : null;
      },
    },
    {
      accessorKey: "end_date",
      header: "End date",
      cell: ({ row }) => {
        const end_date = row.getValue("end_date");
        return end_date ? new Date(end_date).toLocaleDateString() : null;
      },
    },
    {
      accessorKey: "disabled",
      header: "Disabled",
      cell: ({ row }) => {
        const disabled = row.getValue("disabled");
        return <Checkbox checked={disabled} />;
      },
    },
    {
      accessorKey: "archived",
      header: "Archived",
      cell: ({ row }) => {
        const archived = row.getValue("archived");
        return <Checkbox checked={archived} />;
      },
    },
    {
      accessorKey: "action",
      header: () => <NewAdvertisementCell />,
      cell: ({ row }) => {
        const disabled = row.getValue("disabled");
        const archived = row.getValue("archived");
        const id = row.getValue("id");

        return (
          <div className="flex items-center justify-center gap-2">
            <ToggleAdvertisement disabled={disabled} id={id} />
            <ToggleArchiveAdvertisement archived={archived} id={id} />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data: advertismentsQuery.data || [],
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="App">
      <div className="w-full flex p-4 gap-2 items-center">
        <div className="text-lg">Filters : </div>
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
                {advertismentsQuery.isLoading
                  ? "Loading..."
                  : "No data to display"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Advertisements;
