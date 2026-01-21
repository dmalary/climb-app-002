import { useState } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/nextjs";
import { BOARD_OPTIONS } from "@/utils/boardOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

export default function ImportBoard() {
  const [boardVal, setBoardVal] = useState("");
  // const [authChoice, setAuthChoice] = useState("manual");
  const [userVal, setUserVal] = useState("");
  const [passVal, setPassVal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const { isSignedIn, getToken } = useAuth();
  // const { user } = useUser();

  const handleImport = async () => {
    setStatusMsg("");

    if (!isSignedIn) {
      setStatusMsg("Please sign in first.");
      return;
    }

    if (!boardVal || !userVal || !passVal) {
      setStatusMsg("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      // const token = await getToken({ template: "supabase" });
      const token = await getToken();
      if (!token) throw new Error("Missing auth token");

      const res = await axios.post(
        "/api/import-user-board-data",
        {
          board: boardVal,
          username: userVal,
          password: passVal,
          authProvider: "manual",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const climbIds = res.data?.imported_climb_ids || [];
      if (climbIds.length) {
        await axios.post(
          "/api/images/ensure",
          { board: boardVal, climbIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      console.log("Import started:", res.data);
      setStatusMsg(`Import started for ${boardVal}`); 

      setPassVal("");
    } catch (err) {
      console.error("Import failed:", err);
      setStatusMsg("Error importing board data. Check console for details.");
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
          {/* <FieldDescription>
            Sign in to your board account
          </FieldDescription> */}
          <FieldDescription>
            Enter the credentials for your board account.
            {/* This may be different from your Google or Apple login. */}
          </FieldDescription>
          <FieldDescription>
            If you normally use Google/Apple, enter the email + password you set for the board.
          </FieldDescription>
          <FieldDescription>
            If you normally tap “Continue with Google” in the board app,
            you still have a board password. You may need to reset it (this should not log you off the app).
          </FieldDescription>
        </Field>

        {/* AUTH METHOD */}
        {/* <Field>
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
        </Field> */}

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

        {statusMsg && (
          <p className="text-sm text-stone-500">{statusMsg}</p>
        )}
      </CardContent>

      {/* SUBMIT */}
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleImport}
          disabled={
            isSubmitting || !boardVal || !userVal || !passVal
          }
        >
          {isSubmitting ? "Importing…" : `Import ${boardVal || "board"} data`}
        </Button>
      </CardFooter>
    </Card>
  );
}
