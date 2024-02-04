import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import news from "../assets/news.svg";
import info from "../assets/info.svg";
import discounts from "../assets/discounts.svg";

import styles from "../styles/modules/home.module.scss";

export default function Home() {
  const { currentUser } = useSelector((state: any) => state.user);

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.advantage} ${styles.first}`}>
        <div className={styles.info}>
          <h2>
            <span>01</span>Самые актуальные новости из мира авто
          </h2>
          <Link
            to={
              "/search?searchTerm=&sort=desc&category=%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8"
            }
          >
            Читать
          </Link>
        </div>
        <div className={styles.image}>
          <img src={news} alt="Новости" />
        </div>
      </div>
      <div className={`${styles.advantage} ${styles.second}`}>
        <div className={styles.image}>
          <img src={info} alt="Информация" />
        </div>
        <div className={styles.info}>
          <h2>
            <span>02</span>Вся информация о вашем авто в одном месте
          </h2>
          {!currentUser ? (
            <Link to={"/sign-in"}>Войти</Link>
          ) : (
            <Link to={"/dashboard?tab=profile"}>Мой аккаунт</Link>
          )}
        </div>
      </div>
      <div className={`${styles.advantage} ${styles.third}`}>
        <div className={styles.info}>
          <h2>
            <span>03</span>Горящие скидки и акционные предложения
          </h2>
          <Link to={"/search?searchTerm=&sort=desc&category=Акции"}>
            Искать
          </Link>
        </div>
        <div className={styles.image}>
          <img src={discounts} alt="Акции" />
        </div>
      </div>
    </div>
  );
}
