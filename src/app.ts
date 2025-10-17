import dotenv from "dotenv";
import app from "./routes/index";
import { initDatabase } from "./config/initDatabase";

dotenv.config();
initDatabase().then(() => {
    console.log("Database initialized successfully.");
}).catch((error) => {
    console.error("Error initializing database:", error);
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
});