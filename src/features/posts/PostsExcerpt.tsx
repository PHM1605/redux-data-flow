import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";

// // Method1: Using React.memo: PostsExcerpt will not rerender unless {post}:IProps was changed
// import React from "react";
// import { IPost } from "./postsSlice";
//
// interface IProps {
//   post: IPost
// }
//
// const PostsExcerpt: React.FC<IProps> = React.memo(
//   ({post}: IProps) => {
//   return (
//     <article>
//       <h2>{post.title}</h2>
//       <p className="excerpt">{post.body.substring(0, 75)}</p>
//       <p className="postCredit">
//         <Link to={`post/${post.id}`}>View Post</Link>
//         <PostAuthor userId={post.userId} />
//         <TimeAgo timestamp={post.date} />
//       </p>
//       <ReactionButtons post={post} />
//     </article>
//   )
//   }
// )

// Method2: using Normalization -> use this normal creation, fix postsSlice.tsx
import { useAppSelector } from "../../app/hooks";
import { selectPostById } from "./postsSlice";

interface IProps {
  postId: string
}

const PostsExcerpt = ({postId}: IProps) => {
  const post = useAppSelector(state => selectPostById(state, postId))
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  )
}

export default PostsExcerpt