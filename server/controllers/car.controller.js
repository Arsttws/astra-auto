import Car from "../models/car.model.js";
import { errorHandler } from "../utils/error.js";

export const addCar = async (req, res, next) => {
  if (!req.body.car || !req.body.model || !req.body.mileage) {
    return next(errorHandler(400, "Заполните все необходимые поля"));
  }
  const newCar = new Car({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    next(error);
  }
};

export const getCars = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const cars = await Car.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.carId && { _id: req.query.carId }),
    })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      cars,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "Вам не разрешено удалять данный автомобиль")
    );
  }
  try {
    await Car.findByIdAndDelete(req.params.carId);
    res.status(200).json("Автомобиль успешно удален");
  } catch (error) {
    next(error);
  }
};
