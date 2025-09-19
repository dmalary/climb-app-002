import { useEffect, useState } from 'react';
import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Grid({data}) {
  console.log('data', data)
  return (
    <div className="grid grid-cols-3 gap-0">
      {data.map((session) => (
        <div key={session.id}>
        <Card >
          <CardHeader>
            {/* <Link href={`/profile/${session.id}`}> */}
              <CardTitle>{session.length}(sends)count</CardTitle>
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