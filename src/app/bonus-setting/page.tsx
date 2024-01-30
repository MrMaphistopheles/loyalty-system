import Authoraised from "@/app/_components/app/Authoraised";
import Setting from "./_comp/Setting";

export default function Page() {
  return (
    <Authoraised role="MANAGER" main={true}>
      <Setting />
    </Authoraised>
  );
}
