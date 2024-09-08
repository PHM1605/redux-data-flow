import { createSlice, PayloadAction, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import {sub} from 'date-fns';
import { RootState } from "../../app/store";
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

export interface IPost {
  id: string
  title: string 
  body: string
  userId: string
  date: string
  reactions: {
    [reaction:string]: number;
  }
}

interface IPostSend {
  title: string
  body: string 
  userId: string
}

interface IPostUpdate {
  id: string
  title: string 
  body: string 
  userId: string
  date?: string 
  reactions :{
    [reaction:string]: number
  }
}

interface IPostDelete {
  id: string 
}

// Normalization: posts: { ids: [1,2,3], entities: {'1': {userId:1, id:1, title...}, '2': {}, ...}}
const postsAdapter = createEntityAdapter<IPost>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: "",
  count: 0
})

// first parameter: slice name + function name
export const fetchPosts = createAsyncThunk<IPost[], void>('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
})

export const addNewPost = createAsyncThunk<any, IPostSend>('posts/addNewPost', async (initialPost) => {
  const response = await axios.post(POSTS_URL, initialPost);
  return response.data;
})

export const updatePost = createAsyncThunk<any, IPostUpdate>('posts/updatePost', async (initialPost) => {
  const {id} = initialPost;
  console.log("BEFORE SEND:", initialPost)
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
    console.log("OK CASE:", response.data)
    return response.data;
  } catch (err) {
    // return err.message;
    console.log("ERROR CASE:", initialPost)
    return initialPost; // only for testing Redux
  }
  
})

export const deletePost = createAsyncThunk<any, IPostDelete>('posts/deletePost', async (initialPost) => {
  const {id} = initialPost;
  const response = await axios.delete(`${POSTS_URL}/${id}`);
  if (response?.status === 200) return initialPost;
  return `${response?.status}: ${response?.statusText}`;
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action:PayloadAction<{postId:string, reaction:string}>) {
      const {postId, reaction} = action.payload;
      const existingPost = state.entities[postId];
        
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state) {
      state.count = state.count + 1;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Adding date and reactions
        let min = 1;
        const loadedPosts = action.payload.map(post =>{
          post.date = sub(new Date(), {minutes: min++}).toISOString()
          post.id = String(post.id)
          post.userId = String(post.userId)
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        });
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.date  = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0
        }
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        action.payload.id = String(action.payload.id)
        postsAdapter.upsertOne(state, action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const {id} = action.payload;
        postsAdapter.removeOne(state, id)
      })
  }
})

// getSelectors creates these selectors, and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors<RootState>(state => state.posts);

export const getPostsStatus = (state:RootState) => state.posts.status;
export const getPostsError = (state:RootState) => state.posts.error;
export const getCount = (state:RootState) => state.posts.count


// first param: list of functions that provide inputs to the memoized output function
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId)=>userId],
  (posts, userId) => posts.filter(post => post.userId === userId)

)
export const {increaseCount, reactionAdded} = postsSlice.actions;
export default postsSlice.reducer;
