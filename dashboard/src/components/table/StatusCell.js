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
import { STATUS } from "../../pages/reports";

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
          {Object.entries(STATUS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
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
