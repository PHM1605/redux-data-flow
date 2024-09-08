import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "./usersSlice"
import { selectPostsByUser } from "../posts/postsSlice"
import { Link, useParams } from "react-router-dom"

const UserPage = () => {
  const {userId} = useParams();
  const user = useAppSelector(state => selectUserById(state, userId??""));

  const postsForUser = useAppSelector(state => selectPostsByUser(state, userId));

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitles}</ol>
    </section>
  )
}

export default UserPage