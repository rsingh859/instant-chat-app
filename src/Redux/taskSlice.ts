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
    deleteTaskList: (state, action) => {
      const listId = action.payload;
      state.currentTaskList = state.currentTaskList.filter(
        (tl) => tl.id !== listId
      );
    },

    addTask: (state, action) => {
      const { listId, newTask } = action.payload;

      const updatedList = state.currentTaskList.map((tl) => {
        if (tl.id === listId) {
          // switch current task list edit mode to false if true
          tl.editMode = false;
          // switch off edit mode of all other tasks
          const tasks = tl.tasks?.map((t) => {
            t.editMode = false;
            t.collapsed = true;
            return t;
          });

          //push new task with edit mode true
          tasks?.push({ ...newTask, editMode: true, collapsed: false });

          tl.tasks = tasks;
        }
        return tl;
      });
      state.currentTaskList = updatedList;
    },

    deleteTask: () => {},
  },
});

export const {
  setTaskList,
  addTaskList,
  updateTaskListTitle,
  taskListSwitchEditMode,
  deleteTaskList,
  addTask,
} = taskListSlice.actions;
export default taskListSlice.reducer;
