import React from "react";
import Icons from "./Icons";
import { MdDelete, MdEdit } from "react-icons/md";

type Props = {};

function Task({}: Props) {
  return (
    <div className="p-2 mb-2 bg-[#f9fff0] rounded-md drop-shadow-sm hover:drop-shadow-md">
      <div>
        <p className="cursor-pointer">Task title here</p>
      </div>
      <div>
        <hr />
        <div>
          <p>Some description here</p>
          <div className="flex justify-end">
            <Icons IconName={MdEdit} />
            <Icons IconName={MdDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
