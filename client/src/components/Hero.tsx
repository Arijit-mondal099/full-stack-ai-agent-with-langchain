"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const Hero = () => {
  const router = useRouter();

  return (
    <>
      <h1 className="text-6xl font-extrabold">Well Come to Agent AI</h1>
      <p className="text-center text-lg font-medium text-gray-600 max-w-5xl">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo ipsam
        nobis incidunt aperiam sed nemo dignissimos, molestiae, sunt, deserunt
        delectus numquam odio tempora modi quia repellat. Quod numquam nisi
        recusandae.
      </p>

      <div className="space-x-4">
        <Button onClick={() => router.push("/chat")}>Get Started</Button>
        <Button>Learn more</Button>
      </div>
    </>
  );
};
