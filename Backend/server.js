import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './src/config/db.js';
import userRoutes from './src/routes/user.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
const PORT = process.env.PORT || 5001;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
