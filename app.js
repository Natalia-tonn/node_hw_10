import express from "express"
import "dotenv/config"
import jwt from "jsonwebtoken"



const app = express()
app.use(express.json) 
const PORT = process.env.PORT || 3333;
const jwtSecret = process.env.JWT_SECRET;

const users = [
    {
      id: "1",
      name: "Author",
      password: "123455",
      email: "author@web.de",
      role: "user"
    },
    {
      id: "2",
      name: "Ava",
      password: "123455",
      email: "ava@web.de",
      role: "admin"
    },
  ];


  function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "Access denied: No token provided"})
    }
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
return res.status(403).json({message: "Invalid token"})
    }
  }
  app.post("/login", (req, res) => {
    const { username, password} = req.body
const user = user.find((user) => username === username && user.password === password )

if (!user) {
    return res.status(401).json({ message: "User not found"})
}
const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    {expiresIn: "1h" }
)
res.status(200).json({ message: "Login successful", token})
  })

app.put("/update-email", authenticateJWT, (req, res) => {
    const {email} = req.body
if(!email){
    return res.status(400).json({ message: "Email is required" })
} 
const user = user.find((user) => user.id === req.user.id)
if (!user) {
    return res.status(404).json({ message: "User not found"})
}

    user.email = email

    res.status(200).json({message: "Email update successfully", user})
})

app.delete("/delete-account", authenticateJWT, (req,res) => {
    const userIndex = users.findIndex((user) => user.id === req.user.id)
if(userIndex === -1){
    return res.status(404).json({ message: "User not found"})
}
user.splice(userIndex, 1)

res.status(200).json({ message: "Account deleted successfully"})

})

app.listen( PORT, ()=> {
    console.log(`Server is running on PORT  ${PORT}`)
})