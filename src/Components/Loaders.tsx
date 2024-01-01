import React from "react";

type Props = {};

export function ListLoader({}: Props) {
  return (
    <div className="w-full flex flex-wrap gap-10 justify-center">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
        <SingleListLoader />
      ))}
    </div>
  );
}

export function SingleListLoader() {
  return (
    <div className="relative bg-slate-400 rounded-md max-w-sm w-full">
      <div className="animate-pulse">
        <div className="h-14 bg-slate-500 rounded-t-md"></div>
        <div className="flex-1 space-y-3 p-10"></div>
      </div>
      <div className="animate-pulse absolute rounded-full -bottom-4 -left-4 bg-slate-500 h-10 w-10"></div>
    </div>
  );
}
