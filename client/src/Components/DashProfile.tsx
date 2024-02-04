import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  updateStart,
  updateSuccess,
  updateFail,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signoutSuccess,
} from "../store/user/userSlice";
import userDefaultImage from "../assets/logout.svg";
import openEye from "../assets/openEye.svg";
import closedEye from "../assets/closedEye.svg";
import close from "../assets/close.svg";

import "react-circular-progressbar/dist/styles.css";
import "../styles/style.scss";
import styles from "../styles/modules/dashProfile.module.scss";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector(
    (state: any) => state.user
  );
  const [imageFile, setImageFile] = useState<any>(null);
  const [imageFileUrl, setImageFileUrl] = useState<any>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<any>();
  const [imageUploadError, setImageUploadError] = useState<any>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState<any>(null);
  const [userUpdateFail, setUserUpdateFail] = useState<any>(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const pickFileRef = useRef<any>();
  const dispatch = useDispatch();

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploadError(null);
    setImageUploading(true);
    const storage = getStorage(app);
    if (imageFile) {
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError(
            "Ошибка загрузки (Файл должен весить меньше 2МБ)"
          );
          setImageUploadProgress(0);
          setImageFile(null);
          setImageFileUrl(null);
          setImageUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            (downloadUrl: string) => {
              setImageFileUrl(downloadUrl);
              setFormData({ ...formData, profileImg: downloadUrl });
              setImageUploading(false);
            }
          );
        }
      );
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUserUpdateFail(null);
    setUserUpdateSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUserUpdateFail("Не было изменений");
      return;
    }
    if (imageUploading) {
      setUserUpdateFail("Подождите, пока загрузится фото");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFail(data.message));
        setUserUpdateFail(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUserUpdateSuccess("Пользователь успешно обновлен");
      }
    } catch (error: any) {
      dispatch(updateFail(error.message));
      setUserUpdateFail(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFail(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error: any) {
      dispatch(deleteUserFail(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("api/user/signout", {
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
    <div className={styles.dashProfile}>
      <h1>Аккаунт</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={pickFileRef}
          hidden
        />
        <div
          className={styles.userImgContainer}
          onClick={() => pickFileRef.current.click()}
          style={{ position: "relative" }}
        >
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress || 0}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profileImg || userDefaultImage}
            alt="userImg"
            className={imageUploadProgress < 100 ? "opacity-50" : ""}
          />
        </div>
        {imageUploadError && (
          <div>
            <p>{imageUploadError}</p>
          </div>
        )}
        <input
          type="text"
          id="username"
          className={styles.inputUserInfo}
          placeholder="Имя пользователя"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <input
          type="email"
          id="email"
          className={styles.inputUserInfo}
          placeholder="Имя пользователя"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <div className={styles.passwordChanger}>
          <input
            type={`${showPassword ? "text" : "password"}`}
            id="password"
            className={styles.inputUserInfo}
            placeholder="Сменить пароль..."
            onChange={handleChange}
          />
          <div
            className={styles.showPassBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src={showPassword ? closedEye : openEye}
              alt="Показать/Скрыть"
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.saveInfo}
          disabled={loading || imageUploading}
        >
          {loading ? "Загрузка..." : "Сохранить"}
        </button>
        {currentUser.isAdmin && (
          <Link to={"/new-post"} className={styles.newPost}>
            <button type="button">Новая статья</button>
          </Link>
        )}
      </form>
      <div className={styles.modalOverlay}></div>
      <div className={styles.accountOperation}>
        <button onClick={() => setShowModal(true)}>Удалить аккаунт</button>
        <button onClick={handleSignout}>Выйти</button>
      </div>
      {userUpdateSuccess && (
        <div className={styles.updateOutput}>{userUpdateSuccess}</div>
      )}
      {userUpdateFail && (
        <div className={styles.updateOutput}>{userUpdateFail}</div>
      )}
      {error && <div className={styles.updateOutput}>{error}</div>}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContainer}>
            <button
              onClick={() => setShowModal(false)}
              className={styles.closeModal}
            >
              <img src={close} alt="x" />
            </button>
            <h1>Вы уверены, что хотите удалить аккаунт?</h1>
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
