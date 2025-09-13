import React, { useEffect, useState } from 'react';

import { getUsers } from '@/utils/db';

// use Shadcn for component library

export default function Users() {
  const [data, setData] = useState(0)

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

  console.log('data', data)

  return (
    <div>
      <div>users</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}