import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { authDataType, setLoadingType, userType } from "../Types";
import { NavigateFunction } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { defaultUser } from "../Redux/userSlice";

const usersColl = "users";
const tasksColl = "tasks";
const taskListColl = "taskList";
const chatsColl = "chats";
const messagesColl = "messages";

export const BE_signUp = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  routeTo: NavigateFunction
) => {
  const { email, password, confirmPassword } = data;
  // loading true
  setLoading(true);
  if (email && password) {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          // create user image
          const userInfo = addUserToCollection(
            user.uid,
            user.email || "",
            user.email?.split("@")[0] || "",
            "imgLink"
          );

          //set user info to the store and local storage
          setLoading(false);
          reset();
          routeTo("/dashboard");
        })
        .catch((error) => {
          CatchErr(error);
          setLoading(false);
        });
    } else {
      toastErr("Passwords do not match");
    }
  } else {
    toastErr("Fields cannot be left empty");
  }
};

export const BE_signIn = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  routeTo: NavigateFunction
) => {
  const { email, password } = data;
  setLoading(true);
  signInWithEmailAndPassword(auth, email, password)
    .then(({ user }) => {
      // update user isOnline

      //getUserInfo
      const userInfo = getUserInfo(user.uid);
      // set user in store

      setLoading(false);
      reset();
      routeTo("/dashboard");
    })
    .catch((err) => {
      CatchErr(err);
      setLoading(false);
    });
};

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
      creationTime,
      lastSeen,
    };
  } else {
    toastErr("User not found");
    return defaultUser;
  }
};
