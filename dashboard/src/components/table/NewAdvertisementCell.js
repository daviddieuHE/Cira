import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const NewAdvertisementCell = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    fetch("/api/advertisement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 401) window.location.href = "/login";
      setOpen(false);
      queryClient.invalidateQueries(["advertisements"]);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline">+</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Title"
              required
            />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="start_date">Start date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                placeholder="Start date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="end_date">End date</Label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                placeholder="End date"
              />
            </div>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
