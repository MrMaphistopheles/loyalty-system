import Authoraised from "@/app/_components/app/Authoraised";
import Menu from "./_comp/Menu";

export default function Page() {
  return (
    <Authoraised role="MANAGER" main={true}>
      <Menu />
    </Authoraised>
  );
}
