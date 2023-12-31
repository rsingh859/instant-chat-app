import React, { forwardRef, useState } from "react";
import Icons from "./Icons";
import { MdDelete, MdEdit, MdSave } from "react-icons/md";
import { taskType } from "../Types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { collapseTask, taskSwitchEditMode } from "../Redux/taskSlice";
import { BE_saveUpdatedTask } from "../server/Queries";

type Props = {
  task: taskType;
  listId: string;
};

const Task = forwardRef(
  ({ task, listId }: Props, ref: React.LegacyRef<HTMLDivElement>) => {
    const { id, title, description, editMode, collapsed } = task;
    const [homeTitle, setHomeTitle] = useState(title);
    const [homeDescription, setHomeDescription] = useState(description);
    const [updateTaskLoading, setUpdateTaskLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleSaveTask = () => {
      const taskData: taskType = {
        id,
        title: homeTitle,
        description: homeDescription,
      };
      // call the save function
      BE_saveUpdatedTask(dispatch, listId, taskData, setUpdateTaskLoading);
    };

    const handleDeleteSingleTask = () => {};

    return (
      <div
        ref={ref}
        className="p-2 mb-2 bg-[#f9fff0] rounded-md drop-shadow-sm hover:drop-shadow-md"
      >
        <div>
          {editMode ? (
            <input
              value={homeTitle}
              onChange={(e) => setHomeTitle(e.target.value)}
              className="border-2 p-2 border-myBlue rounded-sm mb-1"
              placeholder="Task title"
            />
          ) : (
            <p
              onClick={() => dispatch(collapseTask({ listId, id }))}
              className="cursor-pointer"
            >
              {title}
            </p>
          )}
        </div>
        {!collapsed && (
          <div>
            <hr />
            <div>
              {editMode ? (
                <textarea
                  value={homeDescription}
                  placeholder="Todo descriptiion"
                  className="w-full px-3 border-2 border-myBlue rounded-md mt-2"
                  onChange={(e) => setHomeDescription(e.target.value)}
                >
                  {}
                </textarea>
              ) : (
                <p className="p-2 text-justify">{description}</p>
              )}

              <div className="flex justify-end">
                <Icons
                  onClick={() =>
                    editMode
                      ? handleSaveTask()
                      : dispatch(taskSwitchEditMode({ listId, id }))
                  }
                  IconName={editMode ? MdSave : MdEdit}
                  loading={editMode && updateTaskLoading}
                />
                <Icons IconName={MdDelete} onClick={handleDeleteSingleTask} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default Task;
