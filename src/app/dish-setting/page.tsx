import Authoraised from "@/app/_components/app/Authoraised";
import DishSetting from "./_comp/DishSetting";

export default function Page() {
  return (
    <Authoraised role="MANAGER" main={true}>
      <DishSetting />
    </Authoraised>
  );
}
