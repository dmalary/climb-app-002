import { useEffect, useState } from 'react';
import { useSession, useUser, useAuth, getToken } from '@clerk/nextjs'
import { getUsers, getUserSessions } from '@/utils/db';
import Stream from '@/components/ux/stream';
import HomeNav from '@/components/ux/homeNav';
import { Geist, Geist_Mono } from "next/font/google";
import { Skeleton } from "@/components/ui/skeleton"
import { getMainFeed } from "@/services/mainFeed"

// load shadcn skeletons on initial load while fecthing data?

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// when i log in and land on this page, i want my user data to load/update db, and update cached? data

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(0); // this is data for the stream
  const [feed, setFeed] = useState(0); // this is data for the stream
  const [error, setError] = useState(0);
  
  const { userId, getToken } = useAuth();
  const { user } = useUser(); // user should already exist on this page
  // const { session } = useSession(); // JWT session token, will i need?

  useEffect(() => {
    async function loadFeed() {
      try {
        if (!userId) return;

        setIsLoading(true);
        // const token = await getToken();

        // const [mySessions, followingSessions] = await Promise.all([
        //   getUserSessions(user, token),
        //   getUserFollowSessions(user.id, token)
        // ]);
        const [mySessions] = await Promise.all([getUserSessions()]);

        // const feedData = [...mySessions , ...followingSessions]
        const feedData = [...(mySessions || [])]
        // .sort(
        //   (a, b) => new Date(b.date) - new Date(a.date)
        // );

        setFeed(feedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeed();
  }, [userId])

  console.log('feed', feed)
  return (
    <div className="flex justify-center p-4 bg-stone-900 min-h-screen">
      <div className="w-full max-w-md space-y-6">
        {isLoading ? 
        (
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" /> {/* Mimic title */}
          <Skeleton className="h-4 w-[400px]" /> {/* Mimic description line 1 */}
          <Skeleton className="h-4 w-[350px]" /> {/* Mimic description line 2 */}
        </div>
        ) : (
          <>
          <HomeNav id={userId}/>
          {/* <Stream data={data}/> */}
          <Stream data={feed}/>
          </>
        )}
      </div>
    </div>
  )
}