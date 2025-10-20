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
import { BOARD_OPTIONS } from "@/utils/boardOptions";

export default function ImportBoard() {
  console.log('BOARD_OPTIONS', BOARD_OPTIONS)
  BOARD_OPTIONS.map((board) => {
    console.log('board', board.label)
  })
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Import boards</CardTitle>
          <CardDescription>Select from the dropdown</CardDescription>
        </CardHeader>
        <CardFooter>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Boards" />
            </SelectTrigger>
            <SelectContent>
              {/* // conver to link? and/or once selected have section appear in card for next prompt (auth - apple vs google) */}
              {BOARD_OPTIONS.map((board) => (
                <SelectItem key={board.label} value={board.label}>{board.label}</SelectItem> 
              ))}
            </SelectContent>
          </Select> 
        </CardFooter>
      </Card>
    </>
  )
}