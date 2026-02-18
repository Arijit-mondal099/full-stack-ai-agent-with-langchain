import { Hero } from "@/components/Hero";

const Home = async () => {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-6 items-center justify-center">
      <Hero />
    </div>
  );
};

export default Home;
