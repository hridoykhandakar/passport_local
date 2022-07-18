import express from "express";
const app = express();
import passport from "passport";
import expressSession from "express-session";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { connectMongoose } from "./config/db.js";
import { initializingPassport, isAuthenticated } from "./config/passport.js";

// port
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.set("view engine", "ejs");

// mongoose connection
connectMongoose();

// passport middle
initializingPassport(passport);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// router
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isAuthenticated, (req, res) => {
  // res.send(req.user);
  res.render("profile", {
    name: req.user.name,
  });
});
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post("/register", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (user) return res.status(400).send("user already registered");
  const { name, username, password } = req.body;

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const newUser = new User({
      name: name,
      username: username,
      password: hash,
    });
    await newUser.save();
  });

  // const newUser = await User.create(req.body);
  res.redirect("/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/profile",
  }),
  (req, res) => {}
);

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
