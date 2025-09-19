import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Grid({ sessionData, sends }) {
  console.log('sessionData', sessionData)
  return (
    <div className="grid grid-cols-3 gap-0">
      {sessionData.map((session) => (

        <div key={session.id}>
        <Card >
          <CardHeader>
            {/* <Link href={`/profile/${session.id}`}> */}
              <CardTitle>{sends} sends</CardTitle>
            {/* </Link> */}
            <CardDescription>session date</CardDescription>
          </CardHeader>
          <CardContent>
              brief chart breakdown, select then swipe to view climbs?
          </CardContent>
          <CardFooter>
            {/* <CardAction>social actions (like, comment?)</CardAction> */}
          </CardFooter>
        </Card>
        </div>
      ))}
    </div>
  )
}