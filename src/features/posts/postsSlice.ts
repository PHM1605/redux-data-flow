import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import {sub} from 'date-fns';
import { RootState } from "../../app/store";

interface IPost {
  id: string
  title: string 
  content: string
  userId?: string
  date: string
  reactions: {
    [reaction:string]: number;
  }
}

const initialState: IPost[] = [
  {
    id:'1', 
    title: 'Learning Redux Toolkit', 
    content: "I've heard good things.",
    date: sub(new Date(), {minutes: 10}).toISOString(), // subtract current time and 10 minutes
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0
    }
  },
  {
    id:'2', 
    title: 'Slices...', 
    content: "The more I say slice, the more I want pizza.",
    date: sub(new Date(), {minutes: 5}).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0
    }
  }
];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<IPost>) {
        state.push(action.payload)
      },
      prepare(title:string, content:string, userId:string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0, 
              rocket: 0,
              coffee: 0
            }
          }
        };
      },
    },
    reactionAdded(state, action:PayloadAction<{postId:string, reaction:string}>) {
      const {postId, reaction} = action.payload;
      const existingPost = state.find(post => post.id === postId);
        
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    }
  }
})

export const selectAllPosts = (state:RootState) => state.posts;
export const {postAdded, reactionAdded} = postsSlice.actions;
export default postsSlice.reducer;
