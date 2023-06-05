import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";

export const StatusCell = ({ currentStatus, id, statusMutation }) => {
  const [status, setStatus] = useState(currentStatus);
  const queryClient = useQueryClient();

  return (
    <div className="flex gap-2">
      <Select
        onValueChange={(value) => {
          setStatus(value);
        }}
        value={status}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="signale">Signalé</SelectItem>
          <SelectItem value="pris_en_charge">Pris en charge</SelectItem>
          <SelectItem value="traite">Traité</SelectItem>
        </SelectContent>
      </Select>
      {status !== currentStatus && (
        <Button
          onClick={() =>
            statusMutation.mutate(
              { id, status },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries("reports");
                },
              }
            )
          }
        >
          Mettre à jour
        </Button>
      )}
    </div>
  );
};