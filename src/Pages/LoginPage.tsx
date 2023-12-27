import Login from "../Components/Login";

const LoginPage = () => {
  return (
    <div className="h-[100vh] flex items-center justify-center p-10">
      <Login />
      <div className="h-full w-full bg-gradient-to-r from-myBlue to-myPink absolute top-0 -z-10" />
    </div>
  );
};

export default LoginPage;
