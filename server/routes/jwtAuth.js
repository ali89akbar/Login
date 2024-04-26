const router = require("express").Router()
const pool = require("../db.js")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../Utils/jwtGenerator.js")
const validinfo = require("../middleware/validinfo.js");
const authorize = require("../middleware/authorization.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');


router.post("/register",validinfo ,async (req, res) => {
    try {
        const { name, email, password } = req.body

        const user = await pool.query("SELECT * FROM Company WHERE email = $1", [email])
        if (user.rows.length !== 0) {
            return res.status(401).send("User Already Exists")
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptpassword = await bcrypt.hash(password, salt)

        const newUser = await pool.query("INSERT INTO Company (name, email, password) VALUES ($1, $2, $3) RETURNING id", [name, email, bcryptpassword])
        
        if (newUser.rows.length === 0) {
            return res.status(500).send("Failed to register user")
        }

        const userId = newUser.rows[0].id;
        const token = jwtGenerator(userId);
        
        console.log("User registered:", { id: userId, name, email });
        console.log("Generated token:", token);

        res.json({ token })

    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error");
    }
})

router.post("/login",validinfo,async(req,res)=>{
    try {
        const {email,password}= req.body;

        const user = await pool.query("SELECT * FROM Company WHERE email = $1",[email]);

        if(user.rows.length ===0 ){
        return res.status(401).json("Password or Email is Incorrect");
        } 
        const validpassword = await bcrypt.compare(password,user.rows[0].password)
        if(!validpassword){
            return res.status(401).json("Password and Email is Incorrect");
        }
    const token = jwtGenerator(user.rows[0].id);

    res.json({token})
    }   
        catch (error) {
        console.log(error)
        return res.status(500).send("Error")
        
    }
})

router.get("/verify",authorize ,async(req,res)=>{
    try {
        res.json(true);
        
    } catch (error) {
        console.log(error)
        return res.status(403).json("Not Verified")
        
    }
})


const FRONTEND_URL = "http://localhost:3000/";
// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM Company WHERE email = $1", [email]);
  
      if (!user.rows.length) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a reset token and expiration date
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiration
  
      // Update the user's reset token and expiration date in the database
      await pool.query("UPDATE Company SET resetToken = $1, resetTokenExpiration = $2 WHERE email = $3", [resetToken, resetTokenExpiration, email]);
  
      // Send the reset email with the token and expiration date
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: pool.email,
          pass: pool.password,
        },
      });
  
      const mailOptions = {
        from: pool.name,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <p>Click the link below to reset your password:</p>
          <a href="${FRONTEND_URL}/reset-password/${resetToken}">${FRONTEND_URL}/reset-password/${resetToken}</a>
          <p>The link will expire in 1 hour.</p>
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error sending email' });
        }
        console.log(`Email sent: ${info.response}`);
        res.status(200).json({ message: 'Reset link sent to your email' });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await pool.query("SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiration > $2", [token, Date.now()]);
  
      if (!user.rows.length) {
        return res.status(404).json({ message: 'Invalid or expired reset token' });
      }
  
      // Hashthe new password
      const hashPassword = bcrypt.hashSync(newPassword, 8);
      newPassword.password = hashPassword;
  
      // update user credentials and remove the temporary link from database before saving
      const updatedCredentials = {
        password: newPassword.password,
        resetLink: null
      }
  
      await pool.query("UPDATE users SET password = $1, reset_token = $2 WHERE email = $3", [updatedCredentials.password, updatedCredentials.resetLink, user.rows[0].email]);
  
      res.status(200).json({ message: 'Password updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
