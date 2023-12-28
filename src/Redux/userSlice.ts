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

const initialState = {};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser: (state, action) => {},
    setUsers: (state, action) => {},
  },
});

export const { setUser, setUsers } = userSlice.actions;

export default userSlice.reducer;
