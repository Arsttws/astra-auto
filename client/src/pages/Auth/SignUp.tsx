import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../Components/OAuth";

import poster from '../../assets/poster.png'

import styles from '../../styles/modules/auth.module.scss'

export default function SignUp() {
  const [formData, setFormData] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e:any) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Заполните все поля')
    }
    if(formData.username.length < 4 || formData.username.length > 20) {
      return setErrorMessage('Имя пользователя должно содержать от 4 до 20 символов')
    }
    try {
      setLoading(true);
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if(res.ok) {
        navigate('/sign-in')
      }
    } catch (error:any) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }  

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.login}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formInput}>
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                onChange={handleChange}  
              />
            </div>
            <div className={styles.formInput}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"  
                onChange={handleChange}
              />
            </div>
            <div className={styles.formInput}>
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"  
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {
                loading ? (
                  <span>Загрузка...</span>
                ) : 'Зарегестрироваться'
              }
            </button>
          <OAuth />
          </form>
          <div className={styles.signup}>
            <p>Уже есть аккаунт? <Link to={'/sign-in'}>Войти</Link></p>
          </div>
          {errorMessage && (
            <div className={styles.error}>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
        <div className={styles.poster}>
          <img src={poster} alt="poster" />
        </div>
      </div>
    </div>
  )
}
