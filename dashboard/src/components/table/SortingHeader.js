import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export const SortingHeaderIcon = ({ sorting }) => {
  if (!sorting) return <ArrowUpDown height="75%" />;

  if (sorting === "desc") return <ArrowUp height="75%" />;
  return <ArrowDown height="75%" />;
};
