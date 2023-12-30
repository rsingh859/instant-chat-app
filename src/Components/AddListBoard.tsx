import React from "react";
import Button from "./Button";
import Icons from "./Icons";
import { MdAdd } from "react-icons/md";

type Props = {};

function AddListBoard({}: Props) {
  return (
    <>
      <Button text="Add new List board" className="hidden md:flex" />
      <Icons IconName={MdAdd} className="block md:hidden" />
    </>
  );
}

export default AddListBoard;
