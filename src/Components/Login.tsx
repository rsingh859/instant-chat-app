import React, { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { BE_signIn, BE_signUp, getStorageUser } from "../server/Queries";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { authDataType, setLoadingType } from "../Types";
import { setUser } from "../Redux/userSlice";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const routeTo = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const usr = getStorageUser();

  useEffect(() => {
    if (usr?.id) {
      dispatch(setUser(usr));
      routeTo("/dashboard");
    }
  }, []);
  const handleSignUp = () => {
    const data = { email, password, confirmPassword };
    auth(data, BE_signUp, setSignUpLoading);
  };

  const handleSignIn = () => {
    const data = { email, password };
    auth(data, BE_signIn, setSignInLoading);
  };

  const auth = (data: authDataType, func: any, setLoading: setLoadingType) => {
    func(data, setLoading, reset, routeTo, dispatch);
  };

  const reset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full md:w-[450px]">
      <h1 className="text-white text-center font-bold text-4xl md:text-6xl mb-10">
        {login ? "Login" : "Register"}
      </h1>
      <div className="flex flex-col gap-3 bg-white w-full p-6 min-h-[150px] rounded-xl drop-shadow-xl">
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!login && (
          <Input
            name="confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {login ? (
          <>
            <Button
              text="Login"
              onClick={handleSignIn}
              loading={signInLoading}
            />
            <Button text="Register" secondary onClick={() => setLogin(false)} />
          </>
        ) : (
          <>
            <Button
              text="Register"
              onClick={handleSignUp}
              loading={signUpLoading}
            />
            <Button text="Login" secondary onClick={() => setLogin(true)} />
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
