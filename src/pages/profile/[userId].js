import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUser } from '@/utils/db'

export default function User() {
    const router = useRouter()
    const [data, setData] = useState(0);
    const userId = router.query.userId;
  
    // console.log('router.query.slug', router.query.slug)

  
    useEffect(() => {
      async function loadData() {
        try {
          const res = await getUser(userId);
          await setData(res);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
      loadData();
    }, [userId]);

    console.log('data', data)

  return (
    <div>
      {data && data.username}
    </div>
  )
}