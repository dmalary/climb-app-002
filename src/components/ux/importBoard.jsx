import { useState } from 'react';
import { BOARD_OPTIONS } from "@/utils/boardOptions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  // console.log('boardVal', boardVal)
  console.log('authChoice', authChoice)


  function handleAuth(provider) {
    setAuthChoice(provider);
    console.log(`Auth method selected: ${provider} for ${boardVal}`);
    // later: send to backend or Python service
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Import boards</CardTitle>
          <CardDescription>Select from the dropdown</CardDescription>
        </CardHeader>

        {/* BOARD SELECTION */}
        <CardFooter>
          <Select onValueChange={(value) => setBoardVal(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Boards" />
            </SelectTrigger>
            <SelectContent>
              {/* // conver to link? and/or once selected have section appear in card for next prompt (auth - apple vs google) */}
              {BOARD_OPTIONS.map((board) => (
                <SelectItem 
                  key={board.label} 
                  value={board.label}
                  >
                    {board.label}
                </SelectItem> 
              ))}
            </SelectContent>
          </Select> 
        </CardFooter>

      {/* AUTH OPTIONS (conditional render) */}
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
          <Button className="w-full">
            Import {boardVal} data
          </Button>
        </CardFooter>
      )}
      </Card>
    </>
  )
}