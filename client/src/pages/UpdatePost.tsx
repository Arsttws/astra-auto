import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";

import "react-quill/dist/quill.snow.css";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "../styles/modules/newPost.module.scss";


export default function UpdatePost() {
  const navigate = useNavigate();

  const [image, setImage] = useState<any>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<any>(null);
  const [imageUploadError, setImageUploadError] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [publishError, setPublishError] = useState<any>(null);

  const { currentUser } = useSelector((state: any) => state.user);
  const { postId } = useParams();

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error: any) {
      console.log(error.message);
    }
  }, [postId]);

  const handleImageUpload = async () => {
    try {
      if (!image) {
        setImageUploadError("Выберите фото");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + image.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError("Ошибка загрузки картинки");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            (downloadUrl: string) => {
              setImageUploadProgress(null);
              setImageUploadError(null);
              setFormData({ ...formData, image: downloadUrl });
            }
          );
        }
      );
    } catch (error) {
      setImageUploadError("Ошибка загрузки картинки");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Что-то пошло не так");
    }
  };

  return (
    <div className={styles.wrapper}>

      <h1>Редактировать статью</h1>
      <form className={styles.form} onSubmit={handleSubmit}>

      <div className={styles.postMainInfo}>

          <input
            className={styles.postTitle}

            type="text"
            id="title"
            placeholder="Название"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <select
            className={styles.category}

            name="categories"
            id="category-select"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
            required
          >
            <option value="">Выберите категорию</option>
            <option value="Новости">Новости</option>
            <option value="Статьи">Статьи</option>
            <option value="Акции">Акции</option>
          </select>
        </div>
        <div className={styles.imgSelect}>

          <input
            className={styles.chooseImage}

            type="file"
            accept="image/*"
            onChange={(e: any) => setImage(e.target.files[0])}
          />
            
          <button className={styles.addImage} onClick={handleImageUpload} disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Добавить картинку"
            )}
          </button>
        </div>
        {imageUploadError && (
          <div>
            <p>{imageUploadError}</p>
          </div>
        )}
           
        {formData.image && <img className={styles.uploadedImg} src={formData.image} alt="uploaded-img" />}
        <ReactQuill
          className={styles.quill}

          theme="snow"
          placeholder="Введите текст статьи"
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        <button className={styles.publish} type="submit">Обновить</button>
        {publishError && (
          <div>
            <p>{publishError}</p>
          </div>
        )}
      </form>
    </div>
  );
}
