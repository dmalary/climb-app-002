import { useEffect, useState } from 'react';
import { getUsers } from '@/utils/db';
import Stream from '@/components/ux/stream';
import HomeNav from '@/components/ux/homeNav';
import { Geist, Geist_Mono } from "next/font/google";
import { Skeleton } from "@/components/ui/skeleton"

// load shadcn skeletons on initial load while fecthing data?

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

// when i log in and land on this page, i want my user data to load/update db, and update cached? data

// export default function Stream({ streamData }) {
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getUsers();
        setData(res);
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    loadData();
  }, []);
  if (data) console.log('data', data.length)

  // CHANGE TO CURRENT LOGGED IN USER
  // const id = process.env.CURRENT_USER;
  const id = 'b58b68b1-8d5d-437e-a180-b5a0345e0c0a';
  console.log('id', id)

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
          <HomeNav id={id}/>
          <Stream data={data}/>
          </>
        )}
      </div>
    </div>
  )
}

// export async function getServerSideProps() {
//   const data = await getUsers(); // replace with /api/stream
//   return { props: { data } };
// }

