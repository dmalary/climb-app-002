import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export async function getServerSideProps() {
//   const streamData = await getUsers(); // replace with /api/stream
//   console.log('streamData', streamData)
//   return { props: { streamData } };
// }

// export default function Stream({ streamData }) {
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
    <div className="flex justify-center p-4 bg-stone-900 min-h-screen">
      <div className="w-full max-w-md space-y-6">
      {streamData && streamData.map((user) => (
        // set a href to /[userId] and pass id in params
        // how do i hide routes? based on auth?
        <Card key={user.id}>
          <CardHeader>
            <a href={`/profile/${user.id}`}><CardTitle>{user.username}</CardTitle></a>
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
      </div>
    </div>
  )
}

// export async function getServerSideProps() {
//   const data = await getUsers(); // replace with /api/stream
//   return { props: { data } };
// }

