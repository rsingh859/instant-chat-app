import React from "react";
import Button from "./Button";
import AddListBoard from "./AddListBoard";
import Icons from "./Icons";
import { BsFillChatFill } from "react-icons/bs";
import { FiList } from "react-icons/fi";
import UserHeaderProfile from "./UserHeaderProfile";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
const logo = require("../assets/logo.png");

type Props = {};

function Header() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  return (
    <div className="flex flex-wrap sm:flex-row gap-5 items-center justify-between bg-gradient-to-r drop-shadow-md from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img
        className="w-[80px] drop-shadow-md cursor-pointer bg-transparent"
        src={logo}
        alt="Logo"
      />
      <div className="flex flex-row-reverse md:flex-row items-center justify-center gap-5 flex-wrap">
        <AddListBoard />
        <Icons IconName={BsFillChatFill} ping={true} />
        <Icons IconName={FiList} />
        <UserHeaderProfile user={currentUser} />
      </div>
    </div>
  );
}

export default Header;
