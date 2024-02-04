import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import close from "../assets/close.svg";

import styles from "../styles/modules/dashComments.module.scss";

export default function DashComments() {
  const { currentUser } = useSelector((state: any) => state.user);

  const [comments, setComments] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<any>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 12) {
            setShowMore(false);
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 12) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      {currentUser.isAdmin && comments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="dateCreated">
                <p>Дата создания</p>
              </th>
              <th className="">
                <p>Комментарий</p>
              </th>
              <th className="">
                <p>Лайки</p>
              </th>
              <th className="">
                <p>Пост</p>
              </th>
              <th className="">
                <p>Пользователь</p>
              </th>
            </tr>
          </thead>
          <tbody className={styles.content}>
            {comments.map((comment: any) => (
              <tr key={comment._id} className={styles.commentLine}>
                <th>{new Date(comment.updatedAt).toLocaleDateString()}</th>
                <th className={styles.commentContent}>{comment.content}</th>
                <th>{comment.numberOfLikes}</th>
                <th className={styles.id}>{comment.userId}</th>
                <th className={styles.id}>{comment.postId}</th>
                <th>
                  <button
                    className={styles.delete}
                    onClick={() => {
                      setShowModal(true);
                      setCommentIdToDelete(comment._id);
                    }}
                  >
                    Удалить
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
          {showMore && <button onClick={handleShowMore}>Показать ещё</button>}
        </table>
      ) : (
        "no comments"
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
            <h1>Вы уверены, что хотите удалить комментарий?</h1>
            <div className={styles.interaction}>
              <button onClick={handleDeleteComment}>Подтвердить</button>
              <button onClick={() => setShowModal(false)}>Отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
