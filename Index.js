import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT;



import { createOrder, verifyPayment } from './payment_services.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/createOrder', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const order = await createOrder(amount, currency, receipt);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
app.post('/verifyPayment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  
  if (isValid) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
