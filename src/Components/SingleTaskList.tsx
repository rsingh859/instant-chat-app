import React, { forwardRef, useState } from "react";
import Icons from "./Icons";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdKeyboardArrowDown,
  MdSave,
} from "react-icons/md";
import Tasks from "./Tasks";
import { taskListType } from "../Types";
import { BE_updateTaskList } from "../server/Queries";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { taskListSwitchEditMode } from "../Redux/taskSlice";

type Props = {
  singleTaskList: taskListType;
};

const SingleTaskList = forwardRef(
  (
    { singleTaskList }: Props,
    ref: React.LegacyRef<HTMLDivElement> | undefined
  ) => {
    const { title, editMode, id, tasks } = singleTaskList;
    const [homeTitle, setHomeTitle] = useState(title);
    const dispatch = useDispatch<AppDispatch>();
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleSaveTaskListTitle = () => {
      if (id && homeTitle !== title)
        BE_updateTaskList(dispatch, setUpdateLoading, id, homeTitle);
      else dispatch(taskListSwitchEditMode({ id: id, value: false }));
    };

    const checkEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSaveTaskListTitle();
    };
    return (
      <div className="relative" ref={ref}>
        <div className="bg-[#d3f0f9] w-full md:w-[400px] drop-shadow-md rounded-md min-h-[150px] overflow-hidden">
          <div className="flex flex-wrap items-center justify-center md:gap-8 bg-gradient-to-tr from-myBlue to-myPink bg-opacity-70 p-3 text-white text-center">
            {editMode ? (
              <input
                value={homeTitle}
                onKeyDown={checkEnterKey}
                onChange={(e) => setHomeTitle(e.target.value)}
                className="flex-1 bg-transparent placeholder-slate-300 px-3 py-1 border-[1px] border-white rounded-md"
              />
            ) : (
              <p className="flex-1 text-left md:text-center">{title}</p>
            )}

            <div>
              <Icons
                IconName={editMode ? MdSave : MdEdit}
                onClick={() =>
                  editMode
                    ? handleSaveTaskListTitle()
                    : dispatch(taskListSwitchEditMode({ id }))
                }
                loading={editMode && updateLoading}
              />
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
);

export default SingleTaskList;
