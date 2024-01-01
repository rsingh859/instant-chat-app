import React, { useState } from "react";
import Button from "./Button";
import Icons from "./Icons";
import { MdAdd } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { BE_addTaskList } from "../server/Queries";

type Props = {};

function AddListBoard({}: Props) {
  const [addLoading, setAddLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTaskList = () => {
    BE_addTaskList(dispatch, setAddLoading);
  };
  return (
    <>
      <Button
        text="Add new List board"
        className="hidden md:flex"
        loading={addLoading}
        onClick={handleAddTaskList}
      />
      <Icons IconName={MdAdd} className="block md:hidden" />
    </>
  );
}

export default AddListBoard;
