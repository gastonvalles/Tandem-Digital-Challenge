# Tándem Sistemas - Test de Conocimientos

## Objetivo
El propósito de esta prueba es evaluar la capacidad de la persona para diseñar y desarrollar una aplicación web completa utilizando Vue.js y Vuetify en el Front-end, Node.js en el Back-end y SQL Server como base de datos. Además, se busca evaluar la capacidad para implementar una funcionalidad de chat en tiempo real mediante Socket.io, permitiendo a los usuarios comunicarse entre sí de manera instantánea en una sala compartida.

## Versiones de las librerías en npm
- Vue.js 3.x.x preferible 3.4.9
- Vuetify 3.x.x preferible 3.4.10

## Parte 1: Desarrollo de Front-end
### Pantalla de inicio de sesión
La persona deberá crear una pantalla de inicio de sesión utilizando Vue.js, que incluya campos para ingresar el nombre de usuario y la contraseña. La pantalla deberá validar las credenciales ingresadas y permitir el acceso a la aplicación si son correctas.

### Pantalla de lista de usuarios
La persona deberá crear una pantalla que muestre una lista de usuarios en un data-table. La tabla deberá mostrar los campos "Nombre", "Apellido", "Email", "Teléfono" y "Acciones". La tabla deberá ser dinámica y permitir la selección de un usuario para su edición o eliminación.

### Pantalla de creación y edición de usuarios
La persona deberá crear una pantalla que muestre los campos necesarios para crear o editar un usuario. Los campos deberán incluir "Nombre", "Apellido", "Email", "Teléfono" y "Contraseña". La pantalla deberá ser la misma para crear y editar usuarios, y deberá permitir la edición de los datos del usuario seleccionado en la tabla. La pantalla deberá incluir un botón "Guardar" que permita guardar los cambios o crear un nuevo usuario, y un botón "Cancelar" que permita al usuario cancelar la operación y regresar a la pantalla anterior.

### Funcionalidad de guardado
La persona deberá implementar la funcionalidad de guardar los cambios o crear un nuevo usuario en la pantalla de creación y edición de usuarios. La información ingresada por el usuario deberá ser validada y enviada al back-end a través de una API REST.

### Funcionalidad de eliminación
La persona deberá implementar la funcionalidad de eliminación de usuarios en la tabla. La acción deberá requerir confirmación por parte del usuario antes de proceder.

### Funcionalidad de filtrado
La persona deberá implementar la funcionalidad de filtrado de usuarios en la tabla. La búsqueda deberá incluir todos los campos en la tabla y deberá ser dinámica.

## Parte 2: Desarrollo de Back-end
La aplicación empleará JWT y Refresh Tokens con plazos de expiración. Cuando un JWT caduque, el Refresh Token se empleará para generar un nuevo JWT. Esto asegura que los usuarios puedan seguir usando la aplicación sin interrupciones, al permitir la obtención de un nuevo JWT válido mediante el Refresh Token correspondiente.

### Servidor Node.js con Express
La persona deberá crear un servidor Node.js con Express para servir la aplicación y la API REST necesaria para el funcionamiento de la aplicación.

### Conexión a la base de datos SQL Server
La persona deberá implementar la conexión a la base de datos SQL Server utilizando el paquete "mssql".

### Endpoint de autenticación
La persona deberá crear un endpoint de autenticación que reciba un nombre de usuario y una contraseña, y verifique que la información es correcta. Si las credenciales son válidas, se deberá devolver un token de autenticación que será utilizado en los endpoints de la API REST.

### Endpoint CRUD de usuarios
La persona deberá crear endpoints para las operaciones CRUD de usuarios: crear, leer, actualizar y eliminar usuarios en la base de datos. La clave del usuario debe estar "hasheada" con bcrypt para que se almacene el hash y no la clave.

### Middleware de Autenticación
La persona deberá crear un middleware que se utilice en todas las rutas para verificar que el token de autenticación sea válido y el usuario puede ejecutar la ruta (Exceptuando el login).

## Parte 3: Implementar chat en tiempo real
La persona deberá implementar una funcionalidad de chat en tiempo real utilizando Socket.io. Esta funcionalidad deberá permitir a los usuarios registrados en la aplicación comunicarse entre sí de manera instantánea.

### Configuración de Socket.io en el servidor
La persona deberá configurar Socket.io en el servidor Node.js con Express. Se deberá crear un nuevo namespace llamado "chat_tandem" para el chat en tiempo real.

### Manejo de eventos en el servidor
En el servidor, se deben manejar los eventos de conexión y desconexión de usuarios, así como los eventos de envío y recepción de mensajes.

### Implementación de la interfaz de usuario para el chat en el Front-end
En el Front-end, la persona deberá implementar la interfaz de usuario para el chat. Deberá incluir una sección donde los usuarios puedan ver los mensajes en tiempo real y enviar nuevos mensajes.

### Conexión con Socket.io en el componente de Vue.js
En el componente de Vue.js correspondiente al chat, se deberá establecer la conexión con el servidor Socket.io y manejar los eventos de envío y recepción de mensajes.

### Sala de chat única
Todos los usuarios se conectan al mismo namespace, en este caso, "/chat_tandem". Este namespace actúa como la única sala de chat a la que los usuarios tienen acceso.

### Consideraciones de seguridad
La implementación debe considerar medidas de seguridad, como la autenticación de usuarios en el chat y la validación de los mensajes recibidos. Además, se debe manejar adecuadamente la desconexión de usuarios.

### Integración de la funcionalidad de chat en la aplicación
La persona deberá integrar la funcionalidad de chat en la aplicación, permitiendo a los usuarios acceder al chat después de iniciar sesión. Se pueden agregar nuevas rutas y componentes para gestionar la interfaz de usuario del chat.

## Opcionales
- Que la aplicación sea responsive.
- Que el back-end valide los datos antes de interactuar con la base de datos. Por ejemplo, se deben validar los datos ingresados en el formulario de creación de usuarios, para evitar errores de inserción de datos inválidos. Se recomienda utilizar un paquete de validación, para validar los datos antes de interactuar con la base de datos, pero no es obligatorio.
