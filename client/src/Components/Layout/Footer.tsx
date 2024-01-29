import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import instagram from '../../assets/instagram.svg'
import tg from '../../assets/telegram.svg'
import mail from '../../assets/email.svg'
import phone from '../../assets/phone.svg'
import logo from '../../assets/logo-w-text.svg'

import styles from '../../styles/modules/footer.module.scss'

export default function Footer() {

  const { currentUser } = useSelector((state:any) => state.user)

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to={'/'}>
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.pagesContainer}>
            {
              !currentUser &&  <Link to={'/about'}>Войти</Link>
            }
            <Link to={'/'}>Главная</Link>
            <Link to={'/search'}>Статьи</Link>
            <Link to={'/about'}>О нас</Link>
            
          </div>
          <div className={styles.contactsContainer}>
            <div>
              <img src={instagram} alt="ins" />
              <img src={tg} alt="tg" />
              <img src={mail} alt="mail" />
              <img src={phone} alt="phone" />
            </div>
            <div className={styles.copyright}>
              <p>© 2024 Astra Auto from Astra</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
