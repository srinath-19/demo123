import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./routes/index.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { setupSocket } from "./socket.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.js";
import { instrument } from "@socket.io/admin-ui";
import { connectKafkaProducer } from "./config/kafka.config.js";
import { consumeMessages } from "./helper.js";

const app: Application = express();

// * Middleware
app.use(cors(
//   {
//   origin: ["https://demo123-xvrs.vercel.app"],  // Allow only your frontend domain
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // if you're using cookies or auth headers
// }
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working Guys 🙌");
});

// * Routes
app.use("/api", Routes);

// * Add Kafka Producer
connectKafkaProducer().catch((err) => console.log("Kafka Consumer error", err));
consumeMessages(process.env.KAFKA_TOPIC!).catch((err) =>
  console.log("The Kafka Consume error", err)
);

// * Create HTTP server and Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_APP_URL, "https://admin.socket.io"],
  },
  adapter: createAdapter(redis),
});

instrument(io, {
  auth: false,
  mode: "development",
});

setupSocket(io);

export default app;

// Only listen if NOT running on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 7000;
  server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
}
