import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
          if (data.cars.length < 5) {
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
        if (data.cars.length < 5) {
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
    <div>
      {currentUser && userCars.length > 0 ? (
        <>
          <div>
            {userCars.map((car: any) => (
              <div key={car.model}>
                <p>{car.car}</p>
                <p>{car.model}</p>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setCarIdToDelete(car._id);
                  }}
                >
                  delete
                </button>
              </div>
            ))}
          </div>
          {showMore && <button onClick={handleShowMore}>Показать ещё</button>}
        </>
      ) : (
        "no cars"
      )}
      {showModal && (
        <div className={styles.modal}>
          <div className="container">
            <button onClick={() => setShowModal(false)} className="closeModal">
              <img src="" alt="x" />
            </button>
            <div className="exclamation">
              <img src="" alt="!" />
            </div>
            <h1>Вы уверены что хотите удалить статью</h1>
            <div className="interaction">
              <button onClick={handleDeleteCar}>Подтвердить</button>
              <button onClick={() => setShowModal(false)}>Отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
