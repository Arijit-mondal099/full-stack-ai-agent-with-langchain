"use client";

import { Button } from "./ui/button";

export const Hero = () => {

  const handleLogin = () => {
    window.location.href = process.env.NODE_ENV === "development" ? "http://localhost:4000/api/v1/auth/login" : `${process.env.API_URI}/api/v1/auth/login`;
  }

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
        <Button onClick={handleLogin}>Get Started</Button>
        <Button>Learn more</Button>
      </div>
    </>
  );
};
