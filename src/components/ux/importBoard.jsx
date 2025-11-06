import { useState } from "react";
import axios from "axios";
// import { useUser, useAuth, getToken } from "@clerk/nextjs";
import { useUser, useAuth } from "@clerk/nextjs";
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

export default function ImportBoard() {
  const [boardVal, setBoardVal] = useState("");
  const [authChoice, setAuthChoice] = useState("");
  const { user } = useUser();
  const { isSignedIn, getToken } = useAuth();

  const handleAuth = (provider) => {
    setAuthChoice(provider);
    console.log(`Auth method selected: ${provider} for ${boardVal}`);
  };

  const handleImport = async () => {
    if (!isSignedIn) {
      alert("Please sign in with your main account first.");
      return;
    }

    try {
      // Get Clerk JWT
      const token = await getToken({ template: "supabase" }); 
      // console.log(token);

      const res = await axios.post("/api/import-board", {
        board: boardVal,
        authProvider: authChoice,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Import started:", res.data);
      alert(`Import started for ${boardVal}`);
    } catch (err) {
      console.error("Import failed:", err);
      alert("Error importing board data. Check console for details.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import boards</CardTitle>
        <CardDescription>Select from the dropdown</CardDescription>
      </CardHeader>

      {/* BOARD SELECTION */}
      <CardFooter>
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
      </CardFooter>

      {/* AUTH OPTIONS */}
      {boardVal && (
        <CardFooter className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted-foreground">
            Authenticate your board account to import your climbs
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleAuth("google")}>
              Google
            </Button>
            <Button variant="outline" onClick={() => handleAuth("apple")}>
              Apple
            </Button>
          </div>
        </CardFooter>
      )}

      {/* CONFIRM SELECTION */}
      {authChoice && (
        <CardFooter>
          <Button className="w-full" onClick={handleImport}>
            Import {boardVal} data
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
