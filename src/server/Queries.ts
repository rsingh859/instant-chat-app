import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import {
  authDataType,
  setLoadingType,
  taskListType,
  taskType,
  userType,
} from "../Types";
import { NavigateFunction } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { defaultUser, setUser } from "../Redux/userSlice";
import { AppDispatch } from "../Redux/store";
import ConvertTime from "../utils/convertTime";
import AvatarGenerator from "../utils/avatarGen";
import {
  addTask,
  addTaskList,
  defaultTask,
  defaultTaskList,
  deleteTaskList,
  saveTask,
  setTaskList,
  setTaskListTasks,
  updateTaskListTitle,
} from "../Redux/taskSlice";

const usersColl = "users";
const tasksColl = "tasks";
const taskListColl = "taskList";
const chatsColl = "chats";
const messagesColl = "messages";

// register or sing up a user
export const BE_signUp = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  routeTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password, confirmPassword } = data;
  // loading true
  setLoading(true);
  if (email && password) {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
          // create user image
          const imgLink = AvatarGenerator(user.email?.split("@")[0] || "");
          const userInfo = await addUserToCollection(
            user.uid,
            user.email || "",
            user.email?.split("@")[0] || "",
            imgLink
          );

          //set user info to the store and local storage
          dispatch(setUser(userInfo));
          setLoading(false);
          reset();
          routeTo("/dashboard");
        })
        .catch((error) => {
          CatchErr(error);
          setLoading(false);
        });
    } else {
      toastErr("Passwords do not match", setLoading);
    }
  } else {
    toastErr("Fields cannot be left empty", setLoading);
  }
};

// exisiting user login
export const BE_signIn = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  routeTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password } = data;
  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then(async ({ user }) => {
      // update user isOnline
      await updateUserInfo({ id: user.uid, isOnline: true });
      //getUserInfo
      const userInfo = await getUserInfo(user.uid);
      // set user in store
      dispatch(setUser(userInfo));

      setLoading(false);
      reset();
      routeTo("/dashboard");
    })
    .catch((err) => {
      CatchErr(err);
      setLoading(false);
    });
};

//signout the user
export const BE_signOut = async (
  dispatch: AppDispatch,
  navigate: NavigateFunction,
  setLoading: setLoadingType
) => {
  setLoading(true);
  // sign out functionality from firebase
  await signOut(auth)
    .then(async () => {
      // set user offline
      await updateUserInfo({ isOffline: true });

      // set current user to empty
      dispatch(setUser(defaultUser));

      // navigate to auth page instantly
      navigate("/auth");

      //remove from local storage
      localStorage.removeItem("app_user");
      localStorage.removeItem("app_page");
      setLoading(false);
    })
    .catch((err) => CatchErr(err));
};

// add user to collection
const addUserToCollection = async (
  id: string,
  email: string,
  username: string,
  img: string
) => {
  await setDoc(doc(db, usersColl, id), {
    isOnline: true,
    img,
    username,
    email,
    creationTime: serverTimestamp(),
    lastSeen: serverTimestamp(),
    bio: "Hi my name is something something",
  });

  return getUserInfo(id);
};

//get user info
const getUserInfo = async (id: string): Promise<userType> => {
  const userRef = doc(db, usersColl, id);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const { img, isOnline, username, email, bio, creationTime, lastSeen } =
      userSnap.data();

    return {
      id: userSnap.id,
      img,
      isOnline,
      username,
      email,
      bio,
      creationTime: creationTime
        ? ConvertTime(creationTime.toDate())
        : "no date yet: userinfo",
      lastSeen: lastSeen
        ? ConvertTime(lastSeen.toDate())
        : "no date yet: userinfo",
    };
  } else {
    toastErr("User not found");
    return defaultUser;
  }
};

// update user info
const updateUserInfo = async ({
  id,
  username,
  img,
  isOnline,
  isOffline,
}: {
  id?: string;
  username?: string;
  img?: string;
  isOnline?: boolean;
  isOffline?: boolean;
}) => {
  if (!id) {
    id = getStorageUser().id;
  }

  if (id) {
    // Set the "capital" field of the city 'DC'
    await updateDoc(doc(db, usersColl, id), {
      ...(username && { username }),
      ...(img && { img }),
      ...(isOnline && { isOnline }),
      ...(isOffline && { isOnline: false }),
      lastSeen: serverTimestamp(),
    });
  }
};
//get user from local storage
export const getStorageUser = () => {
  const user = localStorage.getItem("app_user");
  if (user) return JSON.parse(user);
  else return null;
};

// -------------------------------- For task List -------------------------------

// Adding a single task list
export const BE_addTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);
  const { title } = defaultTaskList;

  const list = await addDoc(collection(db, taskListColl), {
    title,
    userId: getStorageUser().id,
  });

  const newDocSnap = await getDoc(doc(db, list.path));

  if (newDocSnap.exists()) {
    const newlyAddedDoc: taskListType = {
      id: newDocSnap.id,
      title: newDocSnap.data().title,
    };

    dispatch(addTaskList(newlyAddedDoc));
    setLoading(false);
  } else {
    toastErr("BE_addTaskList: No such doc");
    setLoading(false);
  }
};

// get all task lists
export const BE_getTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);

  // get user task list
  const taskList = await getAllTaskList();

  // get task list from firebase
  dispatch(setTaskList(taskList));
  setLoading(false);
};

// update task list title
export const BE_updateTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType,
  listId: string,
  title: string
) => {
  setLoading(true);

  await updateDoc(doc(db, taskListColl, listId), { title });

  const updatedTaskList = await getDoc(doc(db, taskListColl, listId));

  setLoading(false);

  // dispatch to save task list
  dispatch(
    updateTaskListTitle({
      id: updatedTaskList.id,
      ...updatedTaskList.data(),
    })
  );
};

// dleete task list

export const BE_deleteTaskList = async (
  listId: string,
  tasks: taskType[],
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);
  if (tasks.length > 0) {
    for (let i = 0; i < tasks.length; i++) {
      const { id } = tasks[i];
      if (id) BE_deleteTask(listId, id, dispatch);
    }
  }

  await deleteDoc(doc(db, taskListColl, listId));

  const deletdTaskList = await getDoc(doc(db, taskListColl, listId));

  if (!deletdTaskList.exists()) {
    setLoading(false);
    //dispatch delete task list
    dispatch(deleteTaskList(listId));
  }
};

// get all task list for current user
const getAllTaskList = async () => {
  const q = query(
    collection(db, taskListColl),
    where("userId", "==", getStorageUser().id)
  );

  const taskListSnapshot = await getDocs(q);
  const taskList: taskListType[] = [];
  taskListSnapshot.forEach((doc) => {
    const { title } = doc.data();
    taskList.push({
      id: doc.id,
      title,
      editMode: false,
      tasks: [],
    });
  });

  return taskList;
};

// ---------------------------- FOR TASK ------------------------------

export const BE_deleteTask = async (
  listId: string,
  id: string,
  dispatch: AppDispatch,
  setLoading?: setLoadingType
) => {
  if (setLoading) setLoading(true);
  //
  const taskRef = doc(db, taskListColl, listId, tasksColl, id);

  await deleteDoc(taskRef);

  const deletedTask = await getDoc(taskRef);

  if (!deletedTask.exists()) {
    if (setLoading) setLoading(false);
    //dispatch delete task
  }
};

export const BE_addTask = async (
  dispatch: AppDispatch,
  listId: string,
  setLoading: setLoadingType
) => {
  setLoading(true);

  const task = await addDoc(collection(db, taskListColl, listId, tasksColl), {
    ...defaultTask,
  });

  const newTaskSnapShot = await getDoc(doc(db, task.path));

  if (newTaskSnapShot.exists()) {
    const { title, description } = newTaskSnapShot.data();
    const newTask: taskType = {
      id: newTaskSnapShot.id,
      title,
      description,
    };

    //dispatch add new task
    dispatch(addTask({ listId, newTask }));

    setLoading(false);
  } else {
    toastErr("BE_addTask: no such doc");
  }
};

export const BE_saveUpdatedTask = async (
  dispatch: AppDispatch,
  listId: string,
  data: taskType,
  setLoading: setLoadingType
) => {
  setLoading(true);

  const { id, title, description } = data;

  if (id) {
    const taskRef = doc(db, taskListColl, listId, tasksColl, id);
    await updateDoc(taskRef, { title, description });

    const updatedTask = await getDoc(taskRef);
    if (updatedTask.exists()) {
      setLoading(false);
      dispatch(saveTask({ listId, id: updatedTask.id, ...updatedTask.data() }));
    } else {
      toastErr("BE_saveUPdatedTask : task not found");
    }
  } else {
    toastErr("BE_saveTask: id not found");
  }
};

// get tasks for task list
export const BE_getTasksForTaskList = async (
  dispatch: AppDispatch,
  listId: string,
  setLoading: setLoadingType
) => {
  setLoading(true);
  // bet tasks in a single task list
  const taskRef = collection(db, taskListColl, listId, tasksColl);
  const tasksSnapShot = await getDocs(taskRef);

  const tasks: taskType[] = [];

  if (!tasksSnapShot.empty) {
    tasksSnapShot.forEach((task) => {
      const { title, description } = task.data();
      tasks.push({
        id: task.id,
        title,
        description,
        editMode: false,
        collapsed: true,
      });
    });
  }

  dispatch(setTaskListTasks({ listId, tasks }));

  setLoading(false);
};
