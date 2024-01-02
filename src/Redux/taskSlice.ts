import { createSlice } from "@reduxjs/toolkit";
import { taskListType, taskType } from "../Types";

export const defaultTaskList: taskListType = {
  title: "Sample task list",
};

export const defaultTask: taskType = {
  title: "I will do this at 9:00 am",
  description: "This is a sample task",
};

type taskListSliceType = {
  currentTaskList: taskListType[];
};

const initialState: taskListSliceType = {
  currentTaskList: [],
};

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    setTaskList: (state, action) => {
      state.currentTaskList = action.payload;
    },

    addTaskList: (state, action) => {
      const newTaskList = action.payload;
      newTaskList.editMode = true;
      newTaskList.tasks = [];
      state.currentTaskList.unshift(newTaskList);
    },

    updateTaskListTitle: (state, action) => {
      const { id, title } = action.payload;
      state.currentTaskList = state.currentTaskList.map((t) => {
        if (t.id === id) {
          t.title = title;
          t.editMode = false;
        }
        return t;
      });
    },

    taskListSwitchEditMode: (state, action) => {
      const { id, value } = action.payload;
      state.currentTaskList = state.currentTaskList.map((tl) => {
        if (tl.id === id) {
          tl.editMode = value !== undefined ? value : true;
        }
        return tl;
      });
    },
  },
});

export const {
  setTaskList,
  addTaskList,
  updateTaskListTitle,
  taskListSwitchEditMode,
} = taskListSlice.actions;
export default taskListSlice.reducer;
