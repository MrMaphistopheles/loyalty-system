import Authoraised from "@/app/_components/app/Authoraised";
import DashBord from "@/app/_components/admin/DashBord";
import Card from "@/app/_components/user/Card";
import Scaner from "@/app/_components/waiter/Scaner";

export default function Home({ params }: { params: { company: string } }) {
  return (
    <>
      <Authoraised role="ADMIN" company={params.company}>
        <DashBord role="admin" />
      </Authoraised>
      <Authoraised role="USER" company={params.company}>
        <Card />
      </Authoraised>
      <Authoraised role="MANAGER" company={params.company}>
        <DashBord role="manager" />
      </Authoraised>
      <Authoraised role="WAITER" company={params.company}>
        <Scaner />
      </Authoraised>
      <Authoraised role="NEW" company={params.company}>
        <div>hi</div>
      </Authoraised>
    </>
  );
}
