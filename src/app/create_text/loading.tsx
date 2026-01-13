import React from "react";
import { BiLoader } from "react-icons/bi";

export default function loading() {
  return (
    <div className="flex w-full h-dvh justify-center items-center">
      <BiLoader className="animate-spin" />
    </div>
  );
}
