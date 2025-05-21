import Nav from "@/components/Nav";
import FadeIn from "@/components/motion/FadeIn";
export default function Home() {
  return (
    <div>
      <FadeIn>
        <div className="fixed top-[10px] md:top-[25px] lg:top-[30px] left-1/2 transform -translate-x-1/2 z-10">
          <Nav />
        </div>
      </FadeIn>

    </div>
  );
}
