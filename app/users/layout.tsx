import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <Sidebar>
        {/* @ts-expect-error Server Component */}
      <UserList items={users} />
      <div className=" h-full">{children}</div>
    </Sidebar>
  );
}
