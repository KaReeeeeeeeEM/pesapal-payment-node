import express, { Response } from "express";
import logger from "./middlewares/logger";
import { createServer } from "http";
import cors from "cors";

// import routes
import paymentRoutes from "./routes/payments";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 7070;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger function
app.use(logger);

// health check
app.get("/", (_, res: Response) => {
  res.send("The API is running!");
});

app.use("/api/v1/payments/", paymentRoutes)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
