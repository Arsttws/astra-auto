import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import close from "../assets/close.svg";
import styles from "../styles/modules/dashPosts.module.scss";

export default function DashPosts() {
  const { currentUser } = useSelector((state: any) => state.user);

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [postIdToDelete, setPostIdToDelete] = useState<any>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 12) {
            setShowMore(false);
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 12) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev: any) =>
          prev.filter((post: any) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <table className={styles.table}>
          <thead className={styles.postsHead}>
            <tr>
              <th className={styles.dateUpdated}>
                <p>Дата</p>
              </th>
              <th className={styles.postImage}>
                <p>Фото</p>
              </th>
              <th className={styles.postTitle}>
                <p>Название</p>
              </th>
              <th className={styles.postCategory}>
                <p>Категория</p>
              </th>
              <th className={styles.deletePost}>
                <p>Удалить</p>
              </th>
              <th className={styles.editePost}>
                <p>Редактировать</p>
              </th>
            </tr>
          </thead>
          <tbody className={styles.content}>
            {userPosts.map((post: any) => (
              <tr key={post.title} className={styles.singlePost}>
                <th className={styles.date}>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </th>
                <th className={styles.img}>
                  <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} />
                  </Link>
                </th>
                <th className={styles.title}>
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </th>
                <th>{post.category}</th>
                <th>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}
                    className={styles.delete}
                  >
                    Удалить
                  </button>
                </th>
                <th>
                  <button className={styles.edit}>
                    <Link to={`/update-post/${post._id}`}>Редактировать</Link>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
          {showMore && <button onClick={handleShowMore}>Показать ещё</button>}
        </table>
      ) : (
        "no posts"
      )}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContainer}>
            <button
              onClick={() => setShowModal(false)}
              className={styles.closeModal}
            >
              <img src={close} alt="x" />
            </button>
            <h1>Вы уверены, что хотите удалить статью?</h1>
            <div className={styles.interaction}>
              <button onClick={handleDeletePost}>Подтвердить</button>
              <button onClick={() => setShowModal(false)}>Отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
