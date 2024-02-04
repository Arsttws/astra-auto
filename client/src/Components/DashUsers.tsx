import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import tick from "../assets/tick.svg";
import cross from "../assets/cross.svg";
import close from "../assets/close.svg";

import styles from "../styles/modules/dashUsers.module.scss";

export default function DashUsers() {
  const { currentUser } = useSelector((state: any) => state.user);

  const [users, setUsers] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<any>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 12) {
            setShowMore(false);
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 12) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      {currentUser.isAdmin && users.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.dateCreated}>
                <p>Дата создания</p>
              </th>
              <th className={styles.userImage}>
                <p>Фото</p>
              </th>
              <th className={styles.userName}>
                <p>Имя пользователя</p>
              </th>
              <th className={styles.email}>
                <p>Почта</p>
              </th>
              <th className={styles.userAdmin}>
                <p>Админ</p>
              </th>
              <th className={styles.deleteUser}>
                <p>Удалить</p>
              </th>
            </tr>
          </thead>
          <tbody className={styles.content}>
            {users.map((user: any) => (
              <tr key={user.username} className={styles.userLine}>
                <th>{new Date(user.createdAt).toLocaleDateString()}</th>
                <th className={styles.profileImgContainer}>
                  <img
                    src={user.profileImg}
                    alt={user.username}
                    className={styles.profileImg}
                  />
                </th>
                <th>{user.username}</th>
                <th>{user.email}</th>
                <th className={styles.isAdmin}>
                  <img src={user.isAdmin ? tick : cross} alt="x" />
                </th>
                <th>
                  <button
                    className={styles.delete}
                    onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user._id);
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
        "no users"
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
            <h1>Вы уверены, что хотите удалить пользователя?</h1>
            <div className={styles.interaction}>
              <button onClick={handleDeleteUser}>Подтвердить</button>
              <button onClick={() => setShowModal(false)}>Отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
