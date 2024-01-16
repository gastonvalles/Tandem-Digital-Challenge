import express from "express";
import bodyParser from "body-parser";
import config from "./config";
import cors from "cors";
import usersRoutes from "./routes/users.routes";

const app = express();

app.set("port", config.port);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(usersRoutes);

export default app;