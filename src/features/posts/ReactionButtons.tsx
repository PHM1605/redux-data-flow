import { useAppDispatch } from "../../app/hooks";
import {reactionAdded} from "./postsSlice";

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

const reactionEmoji = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕'
}

const ReactionButtons = ({post}: IPost) => {
  const dispatch = useAppDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button key={name} type="button" className="reactionButton" onClick={() => (
        dispatch(reactionAdded({postId: props.post.id, reaction: name}))
      )}>
        {emoji} {post.reactions[name]}
      </button>
    )
  }); 

  return (
    <div>{reactionButtons}</div>
  )
}

export default ReactionButtons