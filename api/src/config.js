// Configuración de variables de entorno utilizando dotenv.
import { config } from "dotenv";

config();

// Exporta un objeto con la configuración de la aplicación, como el puerto y la información de la base de datos.
export default {
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbServer: process.env.DB_SERVER,
  dbDatabase: process.env.DB_DATABASE,
};
