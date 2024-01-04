import React, { forwardRef } from "react";
import Icons from "./Icons";
import { MdDelete, MdEdit } from "react-icons/md";
import { taskType } from "../Types";

type Props = {
  task: taskType;
  listId: string;
};

const Task = forwardRef(
  ({ task, listId }: Props, ref: React.LegacyRef<HTMLDivElement>) => {
    const { id, title, description, editMode, collapsed } = task;
    return (
      <div
        ref={ref}
        className="p-2 mb-2 bg-[#f9fff0] rounded-md drop-shadow-sm hover:drop-shadow-md"
      >
        <div>
          <p className="cursor-pointer">{title}</p>
        </div>
        <div>
          <hr />
          <div>
            <p>{description}</p>
            <div className="flex justify-end">
              <Icons IconName={MdEdit} />
              <Icons IconName={MdDelete} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Task;
