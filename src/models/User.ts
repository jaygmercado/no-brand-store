import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  image: { type: String },
  address: { type: String },
  cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Supplier = models["User"] || model("User", userSchema);

export default Supplier;
