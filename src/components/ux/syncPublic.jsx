import { useState } from "react";
import axios from "axios";
import { BOARD_OPTIONS } from "@/utils/boardOptions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {Loader, CircleCheck, CircleX} from "lucide-react"

export default function SyncBoard() {
  const [boardVal, setBoardVal] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  const handleImport = async () => {
    if (!boardVal) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await axios.post("/api/sync-public", { board: boardVal });
      setStatus("success");
      setMessage(res.data?.message || "Data synced successfully!");
    } catch (err) {
      console.error("Sync failed:", err);
      setStatus("error");
      setMessage(
        err.response?.data?.error || "Something went wrong during sync."
      );
    } finally {
      setTimeout(() => setStatus("idle"), 4000); // reset status after delay
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync boards</CardTitle>
        <CardDescription>Select from the dropdown</CardDescription>
      </CardHeader>

      {/* BOARD SELECTION */}
      <CardFooter className="flex flex-col gap-3">
        <Select onValueChange={setBoardVal}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Boards" />
          </SelectTrigger>
          <SelectContent>
            {BOARD_OPTIONS.map((board) => (
              <SelectItem key={board.label} value={board.lib}>
                {board.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {boardVal && (
          <Button
            className="w-full"
            onClick={handleImport}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>Sync {boardVal} data</>
            )}
          </Button>
        )}

        {/* STATUS FEEDBACK */}
        {status === "success" && (
          <p className="flex items-center text-green-600 text-sm mt-2">
            <CircleCheck className="h-4 w-4 mr-1" /> {message}
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center text-red-600 text-sm mt-2">
            <CircleX className="h-4 w-4 mr-1" /> {message}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
