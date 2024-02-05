import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toggleTheme } from "../../store/theme/themeSlice";

import logo from "../../assets/logo-w-text.svg";
import moon from "../../assets/moon.svg";
import search from "../../assets/search.svg";
import defaultUser from "../../assets/defaultUser.svg";
import { signoutSuccess } from "../../store/user/userSlice";
import { useEffect, useState } from "react";

import styles from "../../styles/modules/header.module.scss";

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state: any) => state.user);
  // const { theme } = useSelector((state:any) => state.theme)

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdown, setDropdown] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    setDropdown(false);
  }, []);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    setDropdown(false);

    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link to={"/"}>
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <form onSubmit={handleSubmit} className={styles.search}>
        <input
          type="text"
          placeholder="Искать..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <img src={search} alt="->" />
        </button>
      </form>

      {currentUser ? (
        <div className={styles.dropdown}>
          <div
            onClick={() => setDropdown(!dropdown)}
            className={styles.dropButton}
          >
            <img src={currentUser.profileImg || defaultUser} alt="user" />
          </div>
          {dropdown && (
            <div className={styles.dropdownMenu}>
              <div className={styles.userInfo}>
                <p>{currentUser.username}</p>
                <p>{currentUser.email}</p>
              </div>
              <div className={styles.userLinks}>
                <div className={styles.interact}>
                  <Link to={"/dashboard?tab=profile"}>Аккаунт</Link>
                  <button
                    onClick={() => dispatch(toggleTheme())}
                    className={styles.themeHandler}
                  >
                    <img src={moon} alt="changeTheme" />
                  </button>
                </div>
                <button onClick={handleSignout} className={styles.logout}>
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link className={styles.signin} to={"/sign-in"}>
          Войти
        </Link>
      )}
    </div>
  );
}
