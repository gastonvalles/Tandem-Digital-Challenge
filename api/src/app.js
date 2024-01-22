// Configuración principal de la aplicación express.
import express from "express";
import bodyParser from "body-parser";
import config from "./config";
import cors from "cors";
import usersRoutes from "./routes/users.routes";

const app = express();

// Configura el puerto para la aplicación.
app.set("port", config.port);

// Middleware para manejar datos JSON en las solicitudes.
app.use(express.json());

// Middleware para analizar datos codificados en la URL.
app.use(express.urlencoded({ extended: false }));

// Middleware para permitir solicitudes desde cualquier origen (CORS).
app.use(cors());

// Middleware de body-parser para analizar datos del cuerpo de las solicitudes.
app.use(bodyParser.json());

// Agrega las rutas relacionadas con los usuarios a la aplicación.
app.use(usersRoutes);

export default app;
