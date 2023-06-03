const request = require("supertest");
const server = require("./server");

describe("API endpoints", () => {
  let app;

  beforeAll(() => {
    app = server;
  });

  afterAll((done) => {
    server.close(done);
  });

  test("POST /login should return a JWT token for valid credentials", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "admin", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("POST /signup should return a success message for a new user", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ username: "newuser", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Usuario registrado exitosamente"
    );
  });

  test("GET /posts should return all posts with a valid JWT token", async () => {
    // First, obtain a valid token by logging in
    const loginResponse = await request(app)
      .post("/login")
      .send({ username: "admin", password: "password" });

    const token = loginResponse.body.token;

    // Use the obtained token to access the protected endpoint
    const response = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("GET /posts/:id should return a specific post", async () => {
    const response = await request(app).get("/posts/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });
});
