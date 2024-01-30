import Authoraised from "@/app/_components/app/Authoraised";
import WithDraw from "./_comp/withdraw";

export default function Page() {
  return (
    <Authoraised role="WAITER" main={true}>
      <WithDraw />
    </Authoraised>
  );
}
