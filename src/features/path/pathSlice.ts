import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type Path = {
  user: string;
  repo: string;
  user_url: string;
  repo_url: string;
  stars: number;
};

const initialState: Path = {
  user: "",
  repo: "",
  user_url: "",
  repo_url: "",
  stars: 0,
};

export const pathSlice = createSlice({
  name: "path",
  initialState,

  reducers: {
    setPath: (state, action: PayloadAction<Path>) => {
      state.repo = action.payload.repo;
      state.user = action.payload.user;
      state.user_url = action.payload.user_url;
      state.repo_url = action.payload.repo_url;
      state.stars = action.payload.stars;
    },
  },
});

export const { setPath } = pathSlice.actions;

export const selectPath = (state: RootState): Path => state.path;

export default pathSlice.reducer;
