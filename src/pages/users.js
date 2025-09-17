import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getUsers } from '@/utils/db';

// export default function Users({ data }) {
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

  return (
    <Table>
      <TableCaption>User table</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>id</TableHead>
          <TableHead>username</TableHead>
          <TableHead>email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.username}</TableCell>
          <TableCell>{user.email}</TableCell>
        </TableRow>
      ))}
      </TableBody>
    </Table>
  )
}

// export async function getServerSideProps() {
//   const data = await getUsers();
//   return { props: { data } };
// }