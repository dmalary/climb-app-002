import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUser, getUserSessions, } from '@/utils/db'
import { Skeleton } from "@/components/ui/skeleton"
import Grid from "@/components/ux/grid"

export default function User() {
    const router = useRouter()
    const [userData, setUserData] = useState(0);
    const [sessions, setSessionsData] = useState(0);
    const [attempts, setAttemptsData] = useState(0);
    const [attempt, setAttemptData] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const userId = router.query.userId;
  
    useEffect(() => {
      async function loadData() {
        try {
          const userRes = await getUser(userId);
          // await setData(userRes);
          setUserData(userRes);

          const sessionsRes = await getUserSessions(userId);
          setSessionsData(sessionsRes)

          setIsLoading(false)
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
      loadData();
    }, [userId]);

    console.log('userData', userData)
    console.log('sessions', sessions)
    // console.log('attempts', attempts)
  

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
        ) : (
          <>
            <div>{userData.username}</div>
            <Grid data={sessions} />
          </>
        )
      }
    </div>
  )
}