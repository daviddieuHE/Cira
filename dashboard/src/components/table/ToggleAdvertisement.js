import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";

export const ToggleAdvertisement = ({ disabled, id }) => {
  const queryClient = useQueryClient();

  const advertisementMutation = useMutation(
    ["advertisements"],
    () =>
      fetch("/api/advertisement/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, disabled: !disabled }),
      }).then((res) => {
        if (res.status === 401) window.location.href = "/login";
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["advertisements"]);
      },
    }
  );

  return (
    <Button
      onClick={() => advertisementMutation.mutate()}
      variant={disabled ? "default" : "destructive"}
    >
      {disabled ? "Enable" : "Disable"}
    </Button>
  );
};
