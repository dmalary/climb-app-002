import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUser } from '@/utils/db'
import { Skeleton } from "@/components/ui/skeleton"

export default function User() {
    const router = useRouter()
    const [data, setData] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const userId = router.query.userId;
  
    // console.log('router.query.slug', router.query.slug)

  
    useEffect(() => {
      async function loadData() {
        try {
          const res = await getUser(userId);
          // await setData(res);
          setData(res);
          setIsLoading(false)
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
      loadData();
    }, [userId]);

    console.log('data', data)

  return (
    <div>
      {/* {data && data.username} */}
      {isLoading ? 
        (
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" /> {/* Mimic title */}
          <Skeleton className="h-4 w-[400px]" /> {/* Mimic description line 1 */}
          <Skeleton className="h-4 w-[350px]" /> {/* Mimic description line 2 */}
        </div>
        ) : (data.username)
      }
    </div>
  )
}