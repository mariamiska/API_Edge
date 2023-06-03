const express = require("express");
const axios = require("axios");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const users = [];

const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const { ExtractJwt, Strategy: JwtStrategy } = passportJWT;

// Configuración de JWT
const jwtOptions = {
  secretOrKey: "your-secret-key", // Reemplaza con tu propia clave secreta
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// Configuración de la estrategia JWT
const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
  // Aquí puedes verificar y buscar el usuario en tu base de datos utilizando el payload del token
  // Por simplicidad, este ejemplo utiliza un usuario estático
  const user = { id: 1, username: "admin" };

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

// Inicialización de Passport
passport.use(jwtStrategy);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Inicia sesión en la API con las credenciales proporcionadas
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Verifica las credenciales del usuario aquí (puedes usar una base de datos, un archivo JSON, etc.)
  if (username === "admin" && password === "password") {
    // Credenciales válidas
    const payload = { username }; // Puedes incluir más información en el payload si lo deseas
    const token = jwt.sign(payload, jwtOptions.secretOrKey);

    res.json({ token });
  } else {
    // Credenciales inválidas
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Registrar usuario
 *     description: Registra un nuevo usuario en la API
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       409:
 *         description: El usuario ya existe
 */
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Verifica si el usuario ya existe en la base de datos (puedes utilizar una base de datos, un archivo JSON, etc.)
  // Si el usuario ya existe, devuelve un error
  // De lo contrario, guarda el usuario en la base de datos (o realiza cualquier otra operación necesaria)
  // Por simplicidad, este ejemplo solo verifica si el usuario ya existe

  // Simulación de verificación del usuario
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    res.status(409).json({ error: "El usuario ya existe" });
  } else {
    // Agrega el nuevo usuario a la base de datos o realiza cualquier otra operación necesaria
    // Por simplicidad, este ejemplo utiliza un array para almacenar los usuarios
    users.push({ username, password });
    res.json({ message: "Usuario registrado exitosamente" });
  }
});

app.get("/", (req, res) => {
  res.send("Bienvenido a la API");
});

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints para operaciones relacionadas con los posts
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     description: Obtiene todos los posts de la API
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener los posts
 */
app.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const posts = response.data;
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los posts" });
    }
  }
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     description: Obtiene un post específico por su ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *       500:
 *         description: Error al obtener el post
 */
app.get("/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    const post = response.data;
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el post" });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

// Define la configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentación de mi REST API",
    },
    servers: [
      {
        url: "http://localhost:3000", // Reemplaza con la URL de tu servidor
        description: "Servidor local",
      },
    ],
  },
  apis: ["server.js"], // Ruta al archivo que contiene las rutas de tu API
};

// Configura Swagger usando swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Agrega la ruta de Swagger a tu API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
