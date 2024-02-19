import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFail,
} from "../../store/user/userSlice";
import OAuth from "../../Components/OAuth";

import poster from "../../assets/poster.png";
import closedEye from "../../assets/closedEye.svg";
import openedEye from "../../assets/openEye.svg";

import styles from "../../styles/modules/auth.module.scss";
export default function SignIn() {
  const [formData, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { loading, error: errorMessage } = useSelector(
    (state: any) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFail("Заполните все поля"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFail(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error: any) {
      dispatch(signInFail(errorMessage));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.login}>
          <h1>Войти</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formInput}>
              <label htmlFor="email">Email:</label>
              <input type="text" id="email" onChange={handleChange} />
            </div>
            <div className={`${styles.formInput} ${styles.passwordInput}`}>
              <label htmlFor="password">Пароль:</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={handleChange}
              />
              <div
                className={styles.showPassBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? openedEye : closedEye}
                  alt="Показать/Скрыть"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.signinBtn}
            >
              {loading ? <span>Загрузка...</span> : "Войти"}
            </button>
            <OAuth />
          </form>
          <div className={styles.signup}>
            <p>
              Еще нет аккаунта? <Link to={"/sign-up"}>Зарегестрироваться</Link>
            </p>
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
  );
}
