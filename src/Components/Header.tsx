import React, { useEffect, useState } from "react";
import Button from "./Button";
import AddListBoard from "./AddListBoard";
import Icons from "./Icons";
import { BsFillChatFill } from "react-icons/bs";
import { FiList } from "react-icons/fi";
import UserHeaderProfile from "./UserHeaderProfile";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { Link, useNavigate } from "react-router-dom";
import { BE_signOut, getStorageUser } from "../server/Queries";
import Spinner from "./Spinner";
import { setUser } from "../Redux/userSlice";
const logo = require("../assets/logo.png");

type Props = {};

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const usr = getStorageUser();

  useEffect(() => {
    if (usr?.id) {
      dispatch(setUser(usr));
    } else {
      navigate("/auth");
    }
  }, []);

  useEffect(() => {
    const page = getCurrentPage();
    if (page) navigate("/dashboard/" + page);
  }, [navigate]);

  const navigationToPage = (page: string) => {
    navigate("/dashboard/" + page);
    setCurrentPage(page);
  };

  const handleSignOut = () => {
    BE_signOut(dispatch, navigate, setLogoutLoading);
  };

  const setCurrentPage = (page: string) =>
    localStorage.setItem("app_page", page);

  const getCurrentPage = () => {
    return localStorage.getItem("app_page");
  };

  return (
    <div className="flex flex-wrap sm:flex-row gap-5 items-center justify-between bg-gradient-to-r drop-shadow-md from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img
        className="w-[80px] drop-shadow-md cursor-pointer bg-transparent"
        src={logo}
        alt="Logo"
      />
      <div className="flex flex-row-reverse md:flex-row items-center justify-center gap-5 flex-wrap">
        {getCurrentPage() === "chat" ? (
          <Icons IconName={FiList} onClick={() => navigationToPage("")} />
        ) : getCurrentPage() === "profile" ? (
          <>
            <Icons
              IconName={BsFillChatFill}
              ping={true}
              onClick={() => navigationToPage("chat")}
            />
            <Icons IconName={FiList} onClick={() => navigationToPage("")} />
          </>
        ) : (
          <>
            <AddListBoard />
            <Icons
              IconName={BsFillChatFill}
              ping={true}
              onClick={() => navigationToPage("chat")}
            />
          </>
        )}
        <div className="group relative">
          <UserHeaderProfile user={currentUser} />
          <div className="absolute pt-5 hidden group-hover:block w-full min-w-max">
            <ul className="w-full bg-white overflow-hidden rounded-md shadow-md text-gray-700 pt-1">
              <p
                onClick={() => navigationToPage("profile")}
                className="hover:bg-gray-200 py-2 px-4 block cursor-pointer"
              >
                Profile
              </p>
              <p
                onClick={() => !logoutLoading && handleSignOut()}
                className={`hover:bg-gray-200 py-2 px-4 flex items-center gap-4 cursor-pointer ${
                  logoutLoading && "cursor-wait"
                }`}
              >
                Logout
                {logoutLoading && <Spinner />}
              </p>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
