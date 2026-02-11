import 'dotenv/config';

import { app } from './app';
import connectDB from './config/db';
import notificationRoutes from "./routes/notification.routes";


const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();
app.use("/api/notify", notificationRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
