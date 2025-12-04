import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { username, password } = req.body;

  // Dummy auth
  if (username === "admin" && password === "admin") {
    return res.status(200).json({
      message: "Login success",
      user: { username }
    });
  }

  return res.status(401).json({
    message: "Username/password salah"
  });
});

export default router;
