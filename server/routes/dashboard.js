const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// Get the owner of the company
router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT owner AS ownerId, id FROM Company WHERE id = $1",
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a new employee
router.post("/add", async (req, res) => {
  try {
    const { name, username, password, cid, role } = req.body;

    if (!name || !username || !password || !cid || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (role === "Uploader") {
      const user = await pool.query("SELECT * FROM Uploader WHERE username = $1", [username]);
      if (user.rows.length !== 0) {
        return res.status(401).send("User Already Exists");
      }
      const result = await pool.query(
        "INSERT INTO Uploader (name, username, password, cid) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, username, password, cid]
      );
      res.status(201).json(result.rows[0]);
    } else if (role === "Quality Evaluator") {
      const user = await pool.query("SELECT * FROM qualityevaluator WHERE username = $1", [username]);
      if (user.rows.length !== 0) {
        return res.status(401).send("User Already Exists");
      }
      const result = await pool.query(
        "INSERT INTO qualityevaluator (name, username, password, cid) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, username, password, cid]
      );
      res.status(201).json(result.rows[0]);
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/view/:id", authorization, async (req, res) => {
  try {
    const id = req.params.id;
    const employees = await pool.query("SELECT * FROM Uploader UNION ALL SELECT * FROM qualityevaluator WHERE cid = $1", [id]);
    res.json(employees.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;