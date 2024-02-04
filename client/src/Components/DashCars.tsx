import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import mileage from "../assets/mileage.svg";
import year from "../assets/year.svg";
import dt from "../assets/dt.svg";
import ai92 from "../assets/ai92.svg";
import ai95 from "../assets/ai95.svg";
import ai98 from "../assets/ai98.svg";
import adblue from "../assets/adblue.svg";
import gas from "../assets/gas.svg";
import close from "../assets/close.svg";

import styles from "../styles/modules/dashCars.module.scss";

export default function DashCars() {
  const { currentUser } = useSelector((state: any) => state.user);

  const [userCars, setUserCars] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [carIdToDelete, setCarIdToDelete] = useState<any>("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`/api/car/getcars?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserCars(data.cars);
          if (data.cars.length < 3) {
            setShowMore(false);
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    if (currentUser) {
      fetchCars();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userCars.length;
    try {
      const res = await fetch(
        `/api/car/getcars?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserCars((prev) => [...prev, ...data.cars]);
        if (data.cars.length < 3) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCar = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/car/deletecar/${carIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserCars((prev: any) =>
          prev.filter((car: any) => car._id !== carIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.userCarsAll}>
        {currentUser && userCars.length > 0 ? (
          <>
            <div className={styles.cars}>
              <h2>Ваши авто</h2>
              {userCars.map((car: any) => (
                <div key={car.model} className={styles.singleCar}>
                  <div className={styles.carMain}>
                    <div className={styles.carImg}>
                      <img src={car.image} alt="car" />
                    </div>
                    <div className={styles.carInfo}>
                      <div className={styles.mainInfo}>
                        <p className={styles.brand}>{car.car}</p>
                        <p className={styles.model}>{car.model}</p>
                      </div>
                      <div className={styles.addInfo}>
                        <div className={styles.year}>
                          <img src={year} alt="year" />
                          <p>{car.year} год</p>
                        </div>
                        <div className={styles.mileage}>
                          <img src={mileage} alt="miles" />
                          <p>{car.mileage} км</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.average}>
                    <p>
                      Средний пробег в год:
                      <span>
                        {(
                          car.mileage /
                          (new Date().getFullYear() - car.year + 1)
                        ).toFixed(2)}{" "}
                        км
                      </span>
                    </p>
                  </div>
                  <div className={styles.oil}>
                    <p>
                      Рекомендуем сменить масло через:
                      <span>
                        {10000 -
                          +Array.from(car.mileage.slice(-4), Number).join(
                            ""
                          )}{" "}
                        км
                      </span>
                    </p>
                  </div>
                  <div className={styles.action}>
                    <button
                      className={styles.delete}
                      onClick={() => {
                        setShowModal(true);
                        setCarIdToDelete(car._id);
                      }}
                    >
                      Удалить
                    </button>
                    <a
                      href={`https://unicars.by/carparts/${car.car}/`}
                      target="_blank"
                      className={styles.buy}
                    >
                      Купить запчасти
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {showMore && (
              <button onClick={handleShowMore} className={styles.showMore}>
                Показать ещё
              </button>
            )}
          </>
        ) : (
          <>
            <p>
              Вы еще не добавили авто,
              <br /> давйте это скорее исправим
            </p>
          </>
        )}
        <a href="/add-car" className={styles.addCar}>
          Добавить авто
        </a>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.fuelPrice}>
          <h2 className={styles.priceHeadline}>Стоимость топлива в Беларуси</h2>
          <div className={styles.fuels}>
            <div className={`${styles.dt} ${styles.fuel}`}>
              <div className={styles.info}>
                <p>ДТ Евро</p>
                <p className={styles.price}>2.36 б.р.</p>
              </div>
              <div className={styles.img}>
                <img src={dt} alt="ДТ" />
              </div>
            </div>

            <div className={`${styles.ai92} ${styles.fuel}`}>
              <div className={styles.info}>
                <p>АИ-92</p>
                <p className={styles.price}>2.26 б.р.</p>
              </div>
              <div className={styles.img}>
                <img src={ai92} alt="АИ-92" />
              </div>
            </div>

            <div className={`${styles.ai95} ${styles.fuel}`}>
              <div className={styles.info}>
                <p>АИ-95</p>
                <p className={styles.price}>2.36 б.р.</p>
              </div>
              <div className={styles.img}>
                <img src={ai95} alt="АИ-95" />
              </div>
            </div>

            <div className={`${styles.ai98} ${styles.fuel}`}>
              <div className={styles.info}>
                <p>АИ-98</p>
                <p className={styles.price}>2.58 б.р.</p>
              </div>
              <div className={styles.img}>
                <img src={ai98} alt="АИ-98" />
              </div>
            </div>

            <div className={`${styles.adBlue} ${styles.fuel}`}>
              <div className={styles.info}>
                <p>AdBlue</p>
                <p className={styles.price}>3.29 б.р.</p>
              </div>
              <div className={styles.img}>
                <img src={adblue} alt="AdBlue" />
              </div>
            </div>

            <div className={`${styles.gas} ${styles.fuel}`}>
              <div className={styles.info}>
                <p>Газ</p>
                <p className={styles.price}>1.23 б.р.</p>
              </div>
              <div className={styles.img}>
                <img src={gas} alt="Газ" />
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.spendings}>
          <h2>Расходы</h2>
          <div className={styles.fuel}>
            <p>Расходы на бензин</p>
            <div className={`${styles.progess} ${styles.fuelProg}`}>
              <span></span>
              <button>+</button>
            </div>
          </div>
          <div className={styles.services}>
            <p>Расходы на обслуживание</p>
            <div className={`${styles.progress} ${styles.servicesProg}`}>
              <span></span>
              <button>+</button>
            </div>
          </div>
        </div> */}
      </div>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContainer}>
            <button
              onClick={() => setShowModal(false)}
              className={styles.closeModal}
            >
              <img src={close} alt="x" />
            </button>
            <h1>Вы уверены, что хотите удалить авто?</h1>
            <div className={styles.interaction}>
              <button onClick={handleDeleteCar}>Подтвердить</button>
              <button onClick={() => setShowModal(false)}>Отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
