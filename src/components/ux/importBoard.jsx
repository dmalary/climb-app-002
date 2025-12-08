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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ImportBoard() {
  const [boardVal, setBoardVal] = useState("");
  const [userVal, setUserVal] = useState("");
  const [passVal, setPassVal] = useState("");
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

      const res = await axios.post("/api/import-user-board-data", {
        board: boardVal,
        username: userVal, 
        password: passVal,
        authProvider: authChoice,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Import started:", res.data);
      console.log(`Import started for ${boardVal}`);
    } catch (err) {
      console.error("Import failed:", err);
      alert("Error importing board data. Check console for details.");
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Import user board data</CardTitle>
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
            <Button className="bg-sky-500 hover:bg-sky-700" variant="outline" onClick={() => handleAuth("google")}>
              Google
            </Button>
            <Button className="bg-sky-500 hover:bg-sky-700" variant="outline" onClick={() => handleAuth("apple")}>
              Apple
            </Button>
          </div>
        </CardFooter>
      )}

      {/* CONFIRM SELECTION */}
      {authChoice && (
        <CardFooter className="w-full">
          {/* <div className="w-full "> */}
          <div className="w-full max-w-2xl mx-auto">
          <FieldSet className="w-full">
            <FieldGroup className="w-full">
              <Field className="w-full">
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" type="text" placeholder="Max Leiter" onChange={(e) => setUserVal(e.target.value)} className="w-full"/>
              </Field>
              <Field className="w-full">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" placeholder="••••••••" onChange={(e) => setPassVal(e.target.value)} className="w-full"/>
              </Field>
            </FieldGroup>
          </FieldSet>
          
          <Button className="w-full" onClick={handleImport}>
            Import {boardVal} data
          </Button>
          </div>
        </CardFooter>
      )}
    </Card>
    </>
  );
}
