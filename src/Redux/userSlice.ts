import { createSlice } from "@reduxjs/toolkit";
import { userType } from "../Types";

export const defaultUser: userType = {
  id: "",
  username: "",
  email: "",
  img: "",
  isOnline: false,
  bio: "",
  creationTime: "",
  lastSeen: "",
};

const initialState = {
  // user: [],
  currentUser: defaultUser,
  // currentSelectedUser: null,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      localStorage.setItem("app_user", JSON.stringify(user));
      state.currentUser = action.payload;
    },
    setUsers: (state, action) => {},
  },
});

export const { setUser, setUsers } = userSlice.actions;

export default userSlice.reducer;
