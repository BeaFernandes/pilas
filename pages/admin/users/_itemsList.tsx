import { Table } from "@mantine/core";
import { User } from "@prisma/client";


interface ProductsPageProps {
  users: Array<User>,
}

export default function ItemsList({users}: ProductsPageProps) {

  return (
    <>
      <Table highlightOnHover verticalSpacing="sm" striped>
        <tbody>
          {users.map((user) =>
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>  
          )}
        </tbody>
      </Table>
    </>
  )
}
