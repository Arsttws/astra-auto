import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import stroke from "../assets/strokeheart.svg";
import heart from "../assets/heart.svg";

import styles from "../styles/modules/comment.module.scss";

export default function Comment({ comment, onLike, onEdit, onDelete }: any) {
  const { currentUser } = useSelector((state: any) => state.user);

  const [user, setUser] = useState<any>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(comment.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.singleComment}>
      <div className={styles.author}>
        <img src={user.profileImg} alt={user.username} />
        <div>
          <span className={styles.user}>
            {user ? user.username : "Неизвестный пользователь"}
          </span>
          <span className={styles.time}>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div className={styles.action}>
        {isEditing ? (
          <div className={styles.editArea}>
            <textarea
              value={editedContent}
              rows={6}
              onChange={(e: any) => setEditedContent(e.target.value)}
              className={styles.editArea}
              maxLength={400}
            ></textarea>
            <div>
              <button
                type="button"
                onClick={handleSave}
                className={styles.save}
              >
                Сохранить
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Отменить
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.content}>
              <p className={styles.commentContent}>{comment.content}</p>
              <div className={styles.interaction}>
                <button
                  type="button"
                  onClick={() => onLike(comment._id)}
                  className={styles.like}
                >
                  {currentUser && comment.likes.includes(currentUser._id) ? (
                    <img src={heart} alt="+" />
                  ) : (
                    <img src={stroke} alt="-" />
                  )}
                </button>
                <p>{comment.numberOfLikes}</p>
              </div>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <div className={styles.change}>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className={styles.edit}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className={styles.delete}
                    >
                      Удалить
                    </button>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
