# Tándem Digital Challenge

## Objetivo:
El propósito de esta prueba es evaluar la capacidad del desarrollador para diseñar y desarrollar una aplicación web completa utilizando Vue.js y Vuetify en el Front-end, Node.js en el Back-end y SQL Server como base de datos.

## Configuración Local:
Una vez que hayas descargado o clonado el proyecto en tu PC, sigue estos pasos para configurar el entorno de desarrollo:

1. Abre una terminal y navega a la carpeta "api" para instalar las dependencias necesarias:

    ```bash
    cd api/
    npm install
    ```

2. Repite el proceso para la carpeta "client":

    ```bash
    cd client/
    npm install
    ```

3. Inicia sesión en SQL Server Management Studio mediante SQL Server Authentication.

![sql auth](https://drive.google.com/file/d/1qenFt3rLZ2fnxHCYorcIYWtBtTKDDUYR/view)
   
4.  A continuación, crea una base de datos llamada "Tandem" y dentro de ella, una tabla llamada "Users" con los campos id, nombre, apellido, telefono, email, usuario y contraseña.

   (Adjunta capturas de pantalla para estos pasos, si es necesario)

5. En la carpeta "api", crea un archivo llamado ".env" con el siguiente contenido:

    ```
    PORT=3000
    DB_USER=nombre_con_el_que_iniciaste_sesion_en_sqlserver
    DB_PASSWORD=contraseña_con_la_que_iniciaste_sesion_en_sqlserver
    DB_SERVER=localhost
    DB_DATABASE=Tandem
    JWT_SECRET=SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
    REFRESH_TOKEN_SECRET=cdY45KvQ21Za4GQmbUzgLEVQJNbjtJcjtJPwE4YqMI8
    ```

6. Finalmente, en la consola de tu IDE favorito, ejecuta el siguiente comando en la carpeta "api" para iniciar el servidor:

    ```bash
    cd api/
    npm start
    ```

    Y en la carpeta "client", ejecuta el siguiente comando para iniciar la aplicación Front-end:

    ```bash
    cd client/
    npm run serve
    ```

¡Listo! Tu entorno local está configurado correctamente. Ahora puedes comenzar a trabajar en el Tándem Digital Challenge.
