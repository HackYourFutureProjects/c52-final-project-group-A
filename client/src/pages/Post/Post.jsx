import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchWithAuth from "../../hooks/useFetchWithAuth.js";
import Post from "../../components/Post/Post.jsx";
import style from "./Post.module.css";
import ProfileDash from "../../components/ProfileDash/ProfileDash.jsx";
import useFetch from "../../hooks/useFetch.js";
import Comment from "../../components/Comment/Comment.jsx";
import StateContext from "../../context/state/StateContext.js";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const { state } = useContext(StateContext);

  const { isLoading, error, performFetch, cancelFetch } = useFetchWithAuth(
    `/post/${id}`,
    (res) => {
      setPost(res.post);
    },
  );

  const {
    isLoading: isLoadingComments,
    error: errorComments,
    performFetch: performFetchComments,
    cancelFetch: cancelFetchComments,
  } = useFetch(`/post/${id}/comments`, (res) => {
    setComments(res.comments);
  });

  useEffect(() => {
    setPost(null);
    setComments(null);
    performFetch();
    performFetchComments();

    return () => {
      cancelFetch();
      cancelFetchComments();
    };
  }, [id]);
  const showFollowBtn = state.userId !== post?.author?._id;

  if ((isLoading || isLoadingComments) && (!post || !comments))
    return <div>Loading…</div>;
  if (error || errorComments)
    return <div>Error: {String(error.message || error)}</div>;
  if (!post) return null;

  return (
    <main className={style.main}>
      <ProfileDash
        size="md"
        user={post.author}
        className={style.dashboard}
        followBtn={!showFollowBtn}
      />
      <div className={style.postContainer}>
        <Post post={post} dashboard={false} />
        {comments && comments.length > 0 && (
          <div className={style.commentsContainer}>
            {comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
