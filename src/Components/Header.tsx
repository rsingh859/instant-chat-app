import React from "react";
import Button from "./Button";
const logo = require("../assets/logo.png");

type Props = {};

function Header() {
  return (
    <div className="flex flex-wrap sm:flex-row gap-5 items-center justify-between bg-gradient-to-r drop-shadow-md from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img
        className="w-[70px] drop-shadow-md cursor-pointer bg-transparent"
        src={logo}
        alt="Logo"
      />
      <div className="flex">
        <Button text="Add new List board" secondary />
      </div>
    </div>
  );
}

export default Header;
