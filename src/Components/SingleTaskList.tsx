import React from "react";
import Icons from "./Icons";
import { MdAdd, MdDelete, MdEdit, MdKeyboardArrowDown } from "react-icons/md";
import Tasks from "./Tasks";
import { taskListType } from "../Types";

type Props = {
  singleTaskList: taskListType;
};

function SingleTaskList({ singleTaskList }: Props) {
  const { title, editMode, id, tasks } = singleTaskList;
  return (
    <div className="relative">
      <div className="bg-[#d3f0f9] w-full md:w-[400px] drop-shadow-md rounded-md min-h-[150px] overflow-hidden">
        <div className="flex flex-wrap items-center justify-center md:gap-10 bg-gradient-to-tr from-myBlue to-myPink bg-opacity-70 p-3 text-white text-center">
          <p className="flex-1 text-left md:text-center">{title}</p>
          <div>
            <Icons IconName={MdEdit} />
            <Icons IconName={MdDelete} />
            <Icons IconName={MdKeyboardArrowDown} />
          </div>
        </div>
        <Tasks />
      </div>
      <Icons
        IconName={MdAdd}
        className="absolute -mt-6 -ml-4 p-2 drop-shadow-lg hover:bg-myPink"
        reduceOpacityOnHover={false}
        customBgColor
        customHoverBg
      />
    </div>
  );
}

export default SingleTaskList;
