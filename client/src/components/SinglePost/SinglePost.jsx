import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./SinglePost.module.css";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/api/post/${id}`).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  const { title, content, tags, author } = post;
  const fullName = `${author.profile.first_name} ${author.profile.last_name}`;

  return (
    <div className={styles.singlePost}>
      <div className={styles.authorBlock}>
        <img
          src={author.profile.avatar || "/default-avatar.png"}
          alt="avatar"
          className={styles.avatar}
        />
        <div className={styles.authorInfo}>
          <h4>{fullName}</h4>
          <span className={styles.username}>@{author.username}</span>
        </div>
        <button className={styles.followBtn}>Following</button>
      </div>

      <h1 className={styles.postTitle}>{title}</h1>

      <div className={styles.postContent}>
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className={styles.tagList}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SinglePost;
