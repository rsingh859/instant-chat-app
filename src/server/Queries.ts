import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { toast } from "react-toastify";
import { toastErr } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import { setLoadingType } from "../Types";

export const BE_signUp = (
  data: {
    email: string;
    password: string;
    confirmPassword: string;
  },
  setLoading: setLoadingType
) => {
  const { email, password, confirmPassword } = data;
  // loading true
  setLoading(true);
  if (email && password) {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          console.log(user);
          setLoading(false);
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
