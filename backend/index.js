import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import watchListRoutes from './routes/watchListRoutes.js';
import watchedRoutes from './routes/watchedRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('api is running');
})
//Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchListRoutes);
app.use('/api/watched', watchedRoutes);

//database connection
mongoose.connect(process.env.MONGODB_URL).then(() => {
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} and database is connected`);
})
}).catch((error) => {
  console.log(error.message);
});
