///import { Loading } from "@/app/_components/waiter/Scaner";
import { SvgBird } from "@/app/_components/svg/SvgBird";
import RedirectButton from "./_comp/RedirectButton";

export default function Fondy({ params }: { params: { company: string } }) {
  return (
    <>
      <div className="w-2/3">
        <SvgBird />
      </div>
      <h1 className="text-2xl">Дякуємо за чайові!</h1>
      <RedirectButton path={params.company} />
    </>
  );
}
