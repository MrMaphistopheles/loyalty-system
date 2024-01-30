import Authoraised from "@/app/_components/app/Authoraised";
import Tips from "./_comp/tips";

export default function Page() {
  return (
    <Authoraised role="WAITER" main={true}>
      <Tips />
    </Authoraised>
  );
}
