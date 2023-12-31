import React from "react";
import Icons from "./Icons";
import { MdAdd, MdDelete, MdEdit, MdKeyboardArrowDown } from "react-icons/md";

type Props = {};

function SingleTaskList({}: Props) {
  return (
    <div className="relative">
      <div className="bg-white w-full md:w-[400px] drop-shadow-md rounded-md min-h-[150px] overflow-hidden">
        <div className="flex flex-wrap items-center justify-center md:gap-10 bg-gradient-to-tr from-myBlue to-myPink bg-opacity-70 p-3 text-white text-center">
          <p>Tasklist Text here</p>
          <div>
            <Icons IconName={MdEdit} reduceOpacityOnHover />
            <Icons IconName={MdDelete} reduceOpacityOnHover />
            <Icons IconName={MdKeyboardArrowDown} reduceOpacityOnHover />
          </div>
        </div>
      </div>
      <Icons
        IconName={MdAdd}
        className="absolute -mt-6 -ml-4 p-2 drop-shadow-lg hover:bg-myPink"
      />
    </div>
  );
}

export default SingleTaskList;
