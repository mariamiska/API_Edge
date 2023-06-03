Para ejecutar el servidor y probar los puntos finales de la API, puedes ejecutar el archivo server.js utilizando Node.js.

1.Asegúrate de tener Node.js instalado en tu sistema.
2.En la línea de comandos, navega al directorio donde se encuentra el archivo server.js.
Instala las dependencias requeridas ejecutando el siguiente comando:

npm install express axios swagger-jsdoc swagger-ui-express body-parser jsonwebtoken passport passport-jwt

Una vez instaladas las dependencias, puedes iniciar el servidor ejecutando el siguiente comando:

node server.js

El servidor se iniciará y estará en funcionamiento en http://localhost:3000.
Deberías ver el mensaje "Servidor en ejecución en el puerto 3000" en la consola.

Se agrega el postman collection para consumir la api.
