import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";

import styles from "../styles/modules/select.module.scss";

export default function Select() {
  const navigate = useNavigate();

  const [image, setImage] = useState<any>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<any>(null);
  const [imageUploadError, setImageUploadError] = useState<any>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isActiveModels, setIsActiveModels] = useState<boolean>(false);
  const [carsBrands, setCarsBrands] = useState<any[]>([]);
  const [carModels, setCarModels] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({});
  const [publishError, setPublishError] = useState<any>(null);

  useEffect(() => {
    const fetchCars = async () => {
      let carsBrands: string[] = [];
      const res = await fetch("https://cars-base.ru/api/cars?full=1");
      const data = await res.json();
      for (let i = 0; i < data.length; i++) {
        data[i].popular && carsBrands.push(data[i].name);
      }
      setCarsBrands(carsBrands);
      console.log("succes");
      return data;
    };
    fetchCars();
  }, []);

  const fetchModels = async (userCarBrand: string) => {
    let carModels: string[] = [];

    const res = await fetch("https://cars-base.ru/api/cars?full=1");
    const json = await res.json();

    const models = json.find(function (model: any) {
      return model.name === userCarBrand;
    });

    for (let i = 0; i < models.models.length; i++) {
      carModels.push(models.models[i].name);
    }
    setCarModels(carModels);
  };

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
        (error) => {
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
      const res = await fetch("/api/car/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate("/dashboard?tab=mycars");
      }
    } catch (error) {
      setPublishError("Что-то пошло не так");
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <div className={styles.dropdown}>
          <div
            className={styles.dropdownBtn}
            onClick={() => {
              setIsActive(!isActive);
              setIsActiveModels(false);
              //   console.log(userCarBrand);
            }}
          >
            {formData.car || "Выберите марку"}
            <span>show</span>
          </div>
          {isActive && (
            <div className={styles.dropContent}>
              {carsBrands.map((car) => (
                <div
                  onClick={() => {
                    setFormData({ ...formData, car: car });
                    setIsActive(false);
                  }}
                  className={styles.dropItem}
                  key={car}
                >
                  {car}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.dropdown}>
          <div
            className={styles.dropdownBtn}
            onClick={() => {
              setIsActiveModels(!isActiveModels);
              setIsActive(false);
              fetchModels(formData.car);
            }}
          >
            {formData.model || "Выберите модель"}
            <span>show</span>
          </div>
          {isActiveModels && (
            <div className={styles.dropContent}>
              {carModels.length !== 0
                ? carModels.map((model) => (
                    <div
                      onClick={() => {
                        setFormData({ ...formData, model: model });
                        setIsActiveModels(false);
                      }}
                      className={styles.dropItem}
                      key={model}
                    >
                      {model}
                    </div>
                  ))
                : "Сначала выберите марку"}
            </div>
          )}
        </div>
        <div className={styles.mileage}>
          <label htmlFor="number">Введите пробег авто</label>
          <input
            type="number"
            min={0}
            max={1000000}
            value={formData.mileage}
            onChange={(e) => {
              setFormData({ ...formData, mileage: e.target.value });
            }}
          />
        </div>
        <div className={styles.year}>
          <input
            type="number"
            min={1965}
            max={2024}
            value={formData.year}
            onChange={(e) => {
              setFormData({ ...formData, year: e.target.value });
            }}
          />
        </div>
        <div className={styles.imgSelect}>
          <input
            className={styles.chooseImage}
            type="file"
            accept="image/*"
            onChange={(e: any) => setImage(e.target.files[0])}
          />
          <button
            className={styles.addImage}
            onClick={handleImageUpload}
            disabled={imageUploadProgress}
          >
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
        {formData.image && <img src={formData.image} alt="uploaded-img" />}
        <button className={styles.publish} type="submit">
          Добавить
        </button>
        {publishError && (
          <div>
            <p>{publishError}</p>
          </div>
        )}
      </form>
    </div>
  );
}
