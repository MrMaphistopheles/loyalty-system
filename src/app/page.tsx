import Authoraised from "@/app/_components/app/Authoraised";
import DashBord from "@/app/_components/admin/DashBord";
import Card from "./_components/user/Card";
import Scaner from "./_components/waiter/Scaner";

export default async function Home() {
  return (
    <>
      <Authoraised role="ADMIN">
        <DashBord role="admin" />
      </Authoraised>
      <Authoraised role="USER">
        <Card />
      </Authoraised>
      <Authoraised role="MANAGER">
        <DashBord role="manager" />
      </Authoraised>
      <Authoraised role="WAITER">
        <Scaner />
      </Authoraised>
      <Authoraised role="NEW">
        <div>hi</div>
      </Authoraised>
    </>
  );
}
