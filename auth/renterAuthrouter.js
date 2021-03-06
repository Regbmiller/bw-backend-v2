const router = require('express').Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = require("./renterAuthModel");

//register
  router.post('/registerRenter', (req, res) => {
    const cred = req.body
    const hash = bcrypt.hashSync(cred.password,7)
    cred.password = hash

    db.addRenter(cred)
    .then((userr)=>{
      res.status(201).json({
        data:userr,
        message:"you've registered as a Renter"
      })
  const token = newToken(user)
      console.log(token)    
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).json({
        message: "Unable to register as a renter",
      });
    });
  });

//login
  router.post("/loginRenter", async (req, res, next) => {
    try {
      const { username, password } = req.body
      const user = await db.findRenters({
        username
      }).first()
      if (!user) {
        return res.status(401).json({
          message: "unable to login-can't find user"
        })
      }
      const passwordValid = await bcrypt.compare(password, user.password)
      if (!passwordValid) {
        return res.status(401).json({
          message: "invalid password"
        })
      }
      const payload = {
        userId: user.id,
        username: user.username
      }
      res.cookie("token", jwt.sign(payload, "credentials verified"))
      res.json({
        message: `Welcome ${user.username}!`
      })
    } catch (err) {
      next(err)
    }
  })

//logout
  router.get("/logout", async (req, res, next) => {
    res.clearCookie("token")
    res.json({ message: "successfully logged out" })
  })

module.exports = router