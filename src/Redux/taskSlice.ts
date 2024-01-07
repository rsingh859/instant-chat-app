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
    collapseTask: (state, action) => {
      const { listId, id } = action.payload;
      const taskList = state.currentTaskList.find((tl) => tl.id === listId);
      const listIdx = state.currentTaskList.findIndex((tl) => tl.id === listId);

      // collaps and uncollapse
      taskList?.tasks?.map((t) => {
        if (t.id === id) {
          t.collapsed = !t.collapsed;
        }
      });

      if (taskList) state.currentTaskList[listIdx] = taskList;
    },
    taskSwitchEditMode: (state, action) => {
      const { listId, id, value } = action.payload;

      state.currentTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          const updatedT = tL.tasks?.map((t) => {
            if (t.id === id) {
              t.editMode = value !== undefined ? value : true;
            }
            return t;
          });
          tL.tasks = updatedT;
        }

        return tL;
      });
    },
    saveTask: (state, action) => {
      const { listId, id, title, description } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tl) => {
        if (tl.id === listId) {
          const updatedT = tl.tasks?.map((t) => {
            if (t.id === id) {
              t = { ...title, title, description, editMode: false };
            }
            return t;
          });

          tl.tasks = updatedT;
        }
        return tl;
      });

      state.currentTaskList = updatedTaskList;
    },

    setTaskListTasks: (state, action) => {
      const { listId, tasks } = action.payload;

      const taskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          tL.tasks = tasks;
        }

        return tL;
      });

      state.currentTaskList = taskList;
    },
  },
});

export const {
  setTaskList,
  addTaskList,
  updateTaskListTitle,
  taskListSwitchEditMode,
  deleteTaskList,
  addTask,
  collapseTask,
  taskSwitchEditMode,
  saveTask,
  setTaskListTasks,
} = taskListSlice.actions;
export default taskListSlice.reducer;
