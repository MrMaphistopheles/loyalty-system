import Authoraised from "@/app/_components/app/Authoraised";
import WithDrawRequest from "./_comp/Request";

export default function Page() {
  return (
    <Authoraised role="WAITER" main={true}>
      <WithDrawRequest />
    </Authoraised>
  );
}
