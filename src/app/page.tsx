import Authoraised from "@/app/_components/app/Authoraised";
import DashBord from "@/app/_components/admin/DashBord";
import Scaner from "@/app/_components/waiter/Scaner";

export default function Home() {
  return (
    <>
      <Authoraised role="ADMIN" main={true}>
        <DashBord role="admin" />
      </Authoraised>
      <Authoraised role="MANAGER" main={true}>
        <DashBord role="manager" />
      </Authoraised>
      <Authoraised role="WAITER" main={true}>
        <Scaner />
      </Authoraised>
    </>
  );
}
