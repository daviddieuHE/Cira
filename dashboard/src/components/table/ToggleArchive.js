import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";

export const ToggleArchiveReport = ({ archived, id }) => {
  const queryClient = useQueryClient();

  const archiveMutation = useMutation(["archive", "report"], (data) =>
    fetch(`/api/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 401) window.location.href = "/login";
      queryClient.invalidateQueries(["reports"]);
    })
  );

  if (archived) {
    return (
      <Button
        onClick={() => archiveMutation.mutate({ id, archived: !archived })}
        variant="default"
        disabled={archiveMutation.isLoading}
      >
        Unarchive
      </Button>
    );
  }

  return (
    <Button
      onClick={() => archiveMutation.mutate({ id, archived: !archived })}
      variant="destructive"
      disabled={archiveMutation.isLoading}
    >
      Archive
    </Button>
  );
};

export const ToggleArchiveAdvertisement = ({ archived, id }) => {
  const queryClient = useQueryClient();

  const archiveMutation = useMutation(["archive", "advertisement"], (data) =>
    fetch(`/api/advertisement/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 401) window.location.href = "/login";
      queryClient.invalidateQueries(["advertisements"]);
    })
  );

  if (archived) {
    return (
      <Button
        onClick={() => archiveMutation.mutate({ id, archived: !archived })}
        variant="default"
        disabled={archiveMutation.isLoading}
      >
        Unarchive
      </Button>
    );
  }

  return (
    <Button
      onClick={() => archiveMutation.mutate({ id, archived: !archived })}
      variant="destructive"
      disabled={archiveMutation.isLoading}
    >
      Archive
    </Button>
  );
};
