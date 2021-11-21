require("dotenv").config()

const express = require('express')
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
const cors = require("cors")

const mailer = () => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "komboudilane125@gmail.com",
      pass: process.env.GMAIL_PASS
    }
  });

  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
  };

  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions))
  

  const setMailOptions = ({receiver, message, subject}) => (
    {
      from: "Dilane3 <dilane3@gmail.com>",
      to: receiver,
      subject: subject,
      template: 'email', // the name of the template file i.e email.handlebars
      context:{
          name: "Dilane"
      }
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