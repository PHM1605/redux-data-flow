import { MouseEvent, ChangeEvent, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { addNewPost } from "./postsSlice";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const users = useAppSelector(selectAllUsers);
  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value);


  const onSavePostClicked = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        dispatch(addNewPost({title, body: content, userId})).unwrap() // unwrap() raises an error if something unusual happens
        setTitle('');
        setContent('');
        setUserId('');
        navigate('/')
      } catch (err) {
        console.error('Failed to save the post', err);
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged}/>
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" value={content} onChange={onContentChanged}/>
        <button onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}

export default AddPostForm