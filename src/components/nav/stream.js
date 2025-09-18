import { useEffect, useState } from 'react';
import Link from "next/link"
import { getUsers } from '@/utils/db';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// UPDATE WITH CAROUSEL COMPONENT FROM SHADCN

export default function Stream() {
  const [streamData, setStreamData] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getUsers();
        setStreamData(res);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    loadData();
  }, []);
  if (streamData) console.log('streamData', streamData.length)

  return (
    <>
    {streamData && streamData.map((user) => (
        // set a href to /[userId] and pass id in params
        // how do i hide routes? based on auth?
        <Card key={user.id}>
          <CardHeader>
            <Link href={`/profile/${user.id}`}><CardTitle>{user.username}</CardTitle></Link>
            <CardDescription>climb name (pulled from user climbs, most recent climb)</CardDescription>
          </CardHeader>
          <CardContent>
              climb image? if available, otherwise data chart
          </CardContent>
          <CardFooter>
            <CardAction>social actions (like, comment?)</CardAction>
            {/* <CardDescription><p>view comments?</p></CardDescription> */}
          </CardFooter>
        </Card>
      ))}
    </>
  )
}