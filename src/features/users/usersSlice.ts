import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

interface IUser {
  id: string;
  name: string;
}

const initialState: IUser[] = []

// first params: name of slice (name: 'users' field below) + name of AsyncThunk function
export const fetchUsers = createAsyncThunk<IUser[]>('users/fetchUsers', async ()=>{
  const response = await axios.get(USERS_URL);
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      action.payload = action.payload.map(oneUser=>Object({...oneUser, id: String(oneUser.id)}))
      return action.payload;
    })
  }
})

export const selectAllUsers = (state: RootState) => state.users;
export const selectUserById = (state: RootState, userId: string) => (
  state.users.find(user => user.id===userId)
)

export default usersSlice.reducer;