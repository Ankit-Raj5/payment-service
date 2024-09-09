import Razorpay from 'razorpay';
import crypto from 'crypto'; 
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRET_KEY
});
 
export const createOrder = async (amount, currency, receipt) => {
  const options = {
    amount: amount * 100, 
    currency: currency,
    receipt: receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


export const verifyPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const hmac = crypto.createHmac('sha256', 'your_razorpay_key_secret');
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    return true;
  } else {
    return false;
  }
};
