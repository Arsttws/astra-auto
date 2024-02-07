import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../store/user/userSlice";

import styles from "../styles/modules/dashSidebar.module.scss";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);

  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside>
      <Link
        to={"/dashboard?tab=profile"}
        className={`${styles.profileLink} ${
          tab === "profile" ? styles.active : ""
        }`}
      >
        Мой аккаунт
        <p
          className={currentUser.isAdmin ? styles.adminLabel : styles.userLabel}
        >
          {currentUser.isAdmin ? "Admin" : ""}
        </p>
      </Link>
      <Link
        to={"/dashboard?tab=mycars"}
        className={`${styles.profileLink} ${
          tab === "mycars" ? styles.active : ""
        }`}
      >
        Мои авто
      </Link>
      {!currentUser.isAdmin && (
        <Link
          to={"/dashboard?tab=userposts"}
          className={`${styles.profileLink} ${
            tab === "userposts" ? styles.active : ""
          }`}
        >
          Мои статьи
        </Link>
      )}
      {currentUser.isAdmin && (
        <>
          <Link
            to={"/dashboard?tab=dashboard "}
            className={`${styles.profileLink} ${
              tab === "dashboard" ? styles.active : ""
            }`}
          >
            Панель
          </Link>
          <Link
            to={"/dashboard?tab=posts"}
            className={`${styles.profileLink} ${
              tab === "posts" ? styles.active : ""
            }`}
          >
            Мои статьи
          </Link>
          <Link
            to={"/dashboard?tab=users"}
            className={`${styles.profileLink} ${
              tab === "users" ? styles.active : ""
            }`}
          >
            Пользователи
          </Link>
          <Link
            to={"/dashboard?tab=comments"}
            className={`${styles.profileLink} ${
              tab === "comments" ? styles.active : ""
            }`}
          >
            Комментарии
          </Link>
        </>
      )}
      <button onClick={handleSignout}>Выйти</button>
    </aside>
  );
}
