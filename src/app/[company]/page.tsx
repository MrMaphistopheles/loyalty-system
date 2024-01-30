import Authoraised from "@/app/_components/app/Authoraised";
import Card from "@/app/_components/user/Card";

export default function Home({ params }: { params: { company: string } }) {
  return (
    <>
      <Authoraised role="USER" company={params.company}>
        <Card company={params.company} />
      </Authoraised>
    </>
  );
}
