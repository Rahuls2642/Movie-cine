import exprss from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = exprss();
const PORT = process.env.PORT || 5000;
app.use(exprss.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('api is running');
})
mongoose.connect(process.env.MONGODB_URL).then(() => {
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} and database is connected`);
})
}).catch((error) => {
  console.log(error.message);
});
