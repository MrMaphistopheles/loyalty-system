import Layout from "@/app/_components/app/Layout";
import RoleGuard from "@/app/_components/app/RoleGuard";
import DashBord from "@/app/_components/admin/DashBord";
import Card from "./_components/user/Card";

export default async function Home() {

  return (
    <Layout customW={25}>
      <RoleGuard role="ADMIN">
        <DashBord role="admin"/>
      </RoleGuard>
      <RoleGuard role="USER">
        <Card/>
      </RoleGuard>
      <RoleGuard role="MANAGER">
      <DashBord role="manager"/>
      </RoleGuard>
      <RoleGuard role="WAITER">
        <div>hi</div>
      </RoleGuard>
      <RoleGuard role="NEW">
        <div>hi</div>
      </RoleGuard>
    </Layout>
  );
}
