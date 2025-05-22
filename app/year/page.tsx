import Day from "@/components/Day";
import Nav from "@/components/Nav";
import FadeIn from "@/components/motion/FadeIn";
import TopSection from "@/components/topSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen min-w-[420px]">

      <div className="flex flex-col w-[500px] pt-10 mt-[68px]">
        <Day />
      </div>
    </div>
  );
}
