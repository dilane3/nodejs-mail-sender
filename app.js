const express = require('express')
const nodemailer = require('nodemailer')
const cors = require("cors")

const mailer = () => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "komboudilane125@gmail.com",
      pass: "dilane1420gmail"
    }
  });
  

  const setMailOptions = ({receiver, message, subject}) => (
    {
      from: "komboudilane125@gmail.com",
      to: receiver,
      subject: subject,
      text: message,
      html: `<b>${message}</b>`
    }
  )

  return {transporter, setMailOptions}
}

const app = express()

// use middlewares
const corsOptions = {
  origin: "*",
  credentials: true
}

app.use("/", cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

app.post("/api/sendmail", (req, res) => {
  const {message, receiver, subject} = req.body

  console.log(req.body)

  if (message && receiver && subject) {
    const {transporter, setMailOptions} = mailer()

    transporter.sendMail(setMailOptions({receiver, message, subject}))
    .then(response => {
      console.log(response)

      return res.status(200).json({message: "success"})
    })
    .catch(err => {
      console.error(err)

      return res.status(500).json({error: "failed to send mail"})
    })
  } else {
    return res.status(500).json({error: "failed to send mail"})
  }
})

app.post("/test", (req, res) => {
  const {name} = req.body

  res.json({response: name})
})

app.listen(5000, () => {console.log("Server up on http://localhost:5000")})