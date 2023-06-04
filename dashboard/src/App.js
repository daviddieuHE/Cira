import {
  getCoreRowModel,
  useReactTable,
  flexRender,
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
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
import { DialogHeader } from "./components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./components/ui/alert-dialog";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

const category = {
  depot_sauvage: "Dépôt sauvage",
  voirie: "Voirie",
  bien_public: "Bien public",
  autre: "Autre",
};

const status = {
  signale: "Signalé",
  pris_en_charge: "Pris en charge",
  taite: "Traité",
};

function App() {
  const reportsQuery = useQuery(["reports"], async () => {
    const data = await fetch("/api/reports").then((res) => res.json());
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
        return <img src={uri} alt="report" style={{ width: 100 }} />;
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
        const label = status[row.getValue("status")];
        return (
          <div>
            <div>{label}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id");
        return (
          <div className="flex flex-row gap-2">
            <Dialog>
              <DialogTrigger>
                <Button>Mettre à jour</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mettre à jour</DialogTitle>
                  <DialogDescription>
                    <div className="w-full flex justify-center items-center">
                      <Select
                        onValueChange={(value) => {
                          statusMutation.mutate(
                            { id, status: value },
                            { onSuccess: () => reportsQuery.refetch() }
                          );
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="signale">Signalé</SelectItem>
                          <SelectItem value="pris_en_charge">
                            Pris en charge
                          </SelectItem>
                          <SelectItem value="traite">Traité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <div>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive">Archiver</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archiver</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible, voulez-vous continuer ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => archiveMutation.mutate({ id }, {onSuccess: () => reportsQuery.refetch()})}>
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data: reportsQuery.data || [],
    getCoreRowModel: getCoreRowModel(),
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;
