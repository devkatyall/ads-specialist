import Image from "next/image";
import React from "react";

export default function layout({ children }) {
  return (
    <main className=" bg-gray-50 md:flex flex-row h-screen items-center">
      <div className="md:w-3/6 mx-auto">{children}</div>
      <div className=" hidden md:block md:w-2/6 object-cover p-2 h-full ">
        <Image
          src={"https://i.ibb.co/nsLdZGPz/Coastal-Sunset.png"}
          className=" rounded-lg h-full "
          alt="screen"
          width={1200}
          height={1200}
        />
      </div>
    </main>
  );
}
