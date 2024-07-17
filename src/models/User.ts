import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  image: { type: String },
  address: { type: String },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

const User = models["User"] || model("User", userSchema);

export default User;
