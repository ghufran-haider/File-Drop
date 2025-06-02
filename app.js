const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })


const SALTROUNDS = 5;
const SECRET = "I AM BATMAN";
let connection;
const PORT = 8000;

function AuthMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    req.isAuth = true;
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
}

app.use(
  cors({
    origin: "*",
  })
);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, async function () {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Ghufran@1234",
      database: "filetransfer",
    });

    console.log(`Server start listining on PORT : ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/", AuthMiddleware, async function (req, res) {
  let userId = req.userId;
  res.render("home", {
    isAuth: req.isAuth,
  });
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/download", AuthMiddleware, function (req, res) {
  let fileName = req.query.filelocation;
  res.render("download", {
    isAuth: req.isAuth,
    fileName,
  });
});
app.get("/giveFile", function (req, res) {
  let fileName = req.query.fileName;
  res.download(__dirname + "/public/uploads/" + fileName, "FileTransfer.png");
});

app.post("/upload", upload.array("file",3),AuthMiddleware, function (req, res) {
  try {
    let userFile = req.files;
    let userId = req.userId;
    let linksArr = [];

    userFile.forEach(function (element) {
        let file = {
          link : "http://localhost:8000/download?flName=" + userId + element.filename,
          filename : element.originalname
        }
        linksArr.push(file);
    })

    res.send(linksArr);
    // let userId = req.userId;
    // let linksArr = [];
    // if (userFile.length == undefined) {

    //   let fileName = __dirname + "/public/uploads/" + userId + userFile.name;
    //   userFile.mv(fileName, function () {
    //     let link = "http://localhost:8000/download?filelocation=" + userId + userFile.name;
    //       linksArr.push(link);
    //   });
    //   res.send(linksArr);
    // } else if (userFile.length != undefined) {

    //   userFile.forEach(function (currentFile) {
    //     let fileName = __dirname + "/public/uploads/" + userId + currentFile.name;
    //     currentFile.mv(fileName, function () {
    //       let link = "http://localhost:8000/download?filelocation=" + userId + currentFile.name;
    //         linksArr.push(link);
    //     });
    //   })

    //   console.log(linksArr);
    //   res.send(linksArr);
    // } else {
    //   throw {
    //     message: "File Not Found",
    //   };
    // }
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/login", async function (req, res) {
  try {
    console.log(req.body.email, req.body.password);

    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      const result = await connection.query(
        "select * from user where email = ?",
        [email]
      );
      const user = result[0][0];
      if (user && bcrypt.compareSync(password, user.password_hash)) {
        res.cookie(
          "token",
          jwt.sign(
            {
              userId: user.id,
            },
            SECRET
          )
        );
        console.log("Login");

        res.send("Login Successfull");
      } else {
        throw {
          message: "email/Password is invalid",
        };
      }
    } else {
      throw {
        message: "Please provide neccessary details.",
      };
    }
  } catch (error) {
    res.status(400).send({
      message: error.message ? error.message : "Something went wrong",
    });
  }
});

app.post("/register", async function (req, res) {
  try {
    // Getting Credentials from Request Body .email , req.body.password , req.body.fullname , req.body.mobile , req.body.State
    console.log(req.body);

    if (req.body.email && req.body.password && req.body.fullname) {
      console.log("in register");
      const { fullname, email, password } = req.body;
      let response = await connection.query(
        "select * from user where email = ?",
        [email]
      );
      if (response[0].length == 0) {
        await connection.query(
          `INSERT INTO user (username, email, password_hash)
          VALUES (?,?,?)`,
          [fullname, email, bcrypt.hashSync(req.body.password, SALTROUNDS)]
        );
        res.send({
          message: "Signup Successfull",
        });
      } else {
        throw {
          message: "Email Already exist",
        };
      }
    } else {
      throw {
        message: "Please provide neccessary details.",
      };
    }
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: error.message ? error.message : "Something went wrong",
    });
  }
});

app.get("/logout", async function (req, res, next) {
  res.clearCookie("token");
  res.send({
    message: "Logout successful",
  });
});
