export interface CartItem {
  productId: string;
  quantity: Number;
}
export interface User {
  _id: string;
  email: string;
  name: string;
  cart: string[];
}
