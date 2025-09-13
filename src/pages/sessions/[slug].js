import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react';

import { getUserSessions } from '@/utils/db';

export default function Sessions() {
  const router = useRouter()
  const [data, setData] = useState(0);

  console.log('router.query.slug', router.query.slug)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getUserSessions(router.query.slug);
        setData(res);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    loadData();
  }, [router.query.slug]);

  return (
    <div>
      <div>user sessions</div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <ul>
        {data && data.map((session) => (
          <li key={session.sessionId}>{session.notes}</li>
        ))}
      </ul>
      
    </div>
  )
}