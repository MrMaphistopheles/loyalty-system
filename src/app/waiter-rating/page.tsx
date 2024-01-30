import Authoraised from "@/app/_components/app/Authoraised";
import Rating from "./_comp/Rating";

export default function Page() {
  return (
    <Authoraised role="WAITER" main={true}>
      <Rating />
    </Authoraised>
  );
}
