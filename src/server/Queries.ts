import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType, taskListType, userType } from "../Types";
import { NavigateFunction } from "react-router-dom";
import {
  addDoc,
  collection,
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
  addTaskList,
  defaultTaskList,
  setTaskList,
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
