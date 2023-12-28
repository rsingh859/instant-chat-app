import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";

type Props = {};

function Layout({}: Props) {
  return (
    <div className="h-[100vh] flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-r from-[#6B6B6B] to-[#BBBBBB] max-h-[90%] overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
