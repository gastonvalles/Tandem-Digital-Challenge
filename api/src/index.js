// Este archivo inicia el servidor express y lo hace escuchar en el puerto especificado en la configuración.
import app from "./app";

app.listen(app.get("port"));

console.log("Server listening on port " + app.get("port"));
