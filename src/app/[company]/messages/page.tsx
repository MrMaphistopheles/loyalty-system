import Authoraised from "@/app/_components/app/Authoraised";
import Message from "./_comp/Message";

export default function Page({ params }: { params: { company: string } }) {
  return (
    <Authoraised role="USER" company={params.company}>
      <Message company={params.company} />
    </Authoraised>
  );
}
