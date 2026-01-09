import { useState } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/nextjs";
import { BOARD_OPTIONS } from "@/utils/boardOptions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

export default function ImportBoard() {
  const [boardVal, setBoardVal] = useState("");
  const [authChoice, setAuthChoice] = useState("");
  const [userVal, setUserVal] = useState("");
  const [passVal, setPassVal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const handleImport = async () => {
    if (!isSignedIn) {
      alert("Please sign in with your main account first.");
      return;
    }

    if (!boardVal || !authChoice || !userVal || !passVal) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = await getToken({ template: "supabase" });

      const res = await axios.post(
        "/api/import-user-board-data",
        {
          board: boardVal,
          username: userVal,
          password: passVal,
          authProvider: authChoice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Import started:", res.data);
      alert(`Import started for ${boardVal}`);
    } catch (err) {
      console.error("Import failed:", err);
      alert("Error importing board data. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import board data</CardTitle>
        <CardDescription>
          Connect your climbing board account to sync your sessions and sends.
        </CardDescription>
      </CardHeader>

      {/* BOARD */}
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Climbing board</FieldLabel>
          <Select value={boardVal} onValueChange={setBoardVal}>
            <SelectTrigger>
              <SelectValue placeholder="Select board" />
            </SelectTrigger>
            <SelectContent>
              {BOARD_OPTIONS.map((board) => (
                <SelectItem key={board.label} value={board.lib}>
                  {board.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Choose the system where you log your climbs
          </FieldDescription>
        </Field>

        {/* AUTH METHOD */}
        <Field>
          <FieldLabel>Authentication method</FieldLabel>
          <Select value={authChoice} onValueChange={setAuthChoice}>
            <SelectTrigger>
              <SelectValue placeholder="Choose login type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="manual">
                Manual (username & password)
              </SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            How you log into your board account
          </FieldDescription>
        </Field>

        {/* CREDENTIALS */}
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Username or email</FieldLabel>
              <Input
                placeholder="Board login"
                value={userVal}
                onChange={(e) => setUserVal(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={passVal}
                onChange={(e) => setPassVal(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>

      {/* SUBMIT */}
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleImport}
          disabled={
            isSubmitting || !boardVal || !authChoice || !userVal || !passVal
          }
        >
          {isSubmitting ? "Importing…" : `Import ${boardVal || "board"} data`}
        </Button>
      </CardFooter>
    </Card>
  );
}
