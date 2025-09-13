import React, { useEffect, useState } from 'react';

import { getUsers } from '@/utils/db';

// use Shadcn for component library

export default function Users() {
  const [data, setData] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getUsers();
        setData(res);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    loadData();
  }, []);

  // console.log('data', data)

  const userData = JSON.stringify(data, null, 2);
  // console.log('userData', userData)

  return (
    <div>
      <div>users</div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <ul>
        {data && data.map((user) => (
          <li key={user.userId}>{user.displayName} ({user.email})</li>
        ))}
      </ul>
      
    </div>
  )
}