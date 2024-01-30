import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    car: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    mileage: { type: String, required: true },
    vin: { type: String },
    image: {
      type: String,
      default:
        "https://s7d1.scene7.com/is/image/hyundai/compare-vehicle-1225x619?wid=600&fmt=webp",
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", CarSchema);

export default Car;
