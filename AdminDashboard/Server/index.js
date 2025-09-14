const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const authModel = require("./Model/authModel")
const productModel = require("./Model/product");

const axios = require("axios");

require("dotenv").config();

const port = 5000;

app.use(express.json());
app.use(cors());


// Routes
app.get("/", async (req, res) => {
    res.json({ message: "Server is running" })
});

mongoose.connect("mongodb://localhost:27017/dashboard_db")
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Database connection error:", err));

//Signup
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.json({ message: "⚠️ All fields are required" });
        }

        const checkEmail = await authModel.findOne({ email });
        if (checkEmail) {
            return res.json({ message: "This email is already registered." });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await authModel.create({
            username: username,
            email: email,
            password: hashedPass
        })

        res.json({ message: "User registered successfully", newUser });
    }
    catch (err) {
        console.error("Signup error:", err);
        // res.status(500).json({ message: err.message });
        res.json({ message: "Something went wrong, please try again later." });
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password, token } = req.body;

        const adminEmail = "admin@gmail.com"
        const adminPassword = "Admin@1234"

        const superAdminEmail = "superadmin@gmail.com"
        const superAdminPass = "Super@dmin12"

        if (!token) {
            return res.json({ message: "⚠️ Captcha is required" });
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const captchaVerify = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
        );

        if (!captchaVerify.data.success) {
            return res.json({ message: "Captcha verification failed" });
        }

        const checkUser = await authModel.findOne({ email });
        if (!checkUser) {
            return res.json({ message: "User not found" });
        }

        if (email === adminEmail && password === adminPassword) {
            checkUser.role = "admin"
            await checkUser.save();
        }

        if (email === superAdminEmail && password === superAdminPass) {
            checkUser.role = "superadmin"
            await checkUser.save();
        }

        const pass = await bcrypt.compare(password, checkUser.password);
        if (!pass) {
            return res.json({ message: "⚠️ Invalid Password" });
        }

        const userRole = await checkUser.role;

        const jwtToken = jwt.sign({ id: checkUser._id }, "admin@1234", { expiresIn: "4h" });

        res.json({ message: "✅ Login successfully", jwtToken, userRole });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error, please try again" });
    }
})

//forgot password
// let forgotOtp = [];
app.post("/forgotpsw", async (req, res) => {
    try {
        const { forgotEmail } = req.body;
        console.log(forgotEmail);

        const user = await authModel.findOne({ email: forgotEmail });
        if (!user) {
            return res.json({ message: "⚠️ Email not registered" })
        }

        const otp = await Math.floor(100000 + Math.random() * 900000)

        // forgotOtp[forgotEmail] = otp;

        const otpExpire = new Date(Date.now() + 2 * 60 * 1000);

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        let nodemailerTransport = await nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: "kinjalkaneriya2311@gmail.com",
                pass: "hyeulrngyawpjcjc"
            }
        })

        nodemailerTransport.sendMail({
            from: "kinjalkaneriya2311@gmail.com",
            to: forgotEmail,
            subject: "OTP for reset password",
            text: `Your OTP is ${otp}`

        })

        res.json({ message: "✅ OTP sent to your email", otp });

    }
    catch (err) {
        console.log(err);
        res.json({ message: "Something went wrong" });
    }

})

//verify otp
app.post("/verifyotp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await authModel.findOne({ email });
        if (!user) {
            return res.json({ message: "⚠️ Email not registered" });
        }

        if (!user.otp || !user.otpExpire) {
            return res.json({ message: "⚠️ OTP not generated. Please request again" });
        }

        if (user.otpExpire < Date.now()) {
            user.otp = null;
            user.otpExpire = null;
            await user.save();

            return res.json({ message: "⚠️ OTP expired. Please request a new one" });
        }

        if (user.otp != otp) {
            return res.json({ message: "❌ Invalid OTP" });
        }

        user.otp = null;
        user.otpExpire = null;
        await user.save();

        res.json({ message: "✅ OTP verified successfully" });
    }
    catch (err) {
        console.log(err);
        res.json({ message: "Something went wrong" });
    }
})

//resend otp
app.post("/resendotp", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await authModel.findOne({ email: email });
        if (!user) {
            return res.json({ message: "⚠️ Email not registered" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + 2 * 60 * 1000);

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();

        let nodemailerTransport = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "kinjalkaneriya2311@gmail.com",
                pass: "hyeulrngyawpjcjc"
            }
        });

        await nodemailerTransport.sendMail({
            from: "kinjalkaneriya2311@gmail.com",
            to: email,
            subject: "Resend OTP for reset password",
            text: `Your new OTP is ${otp}`
        });

        res.json({ message: "🔄 New OTP sent to your email" });
    }
    catch (err) {
        console.log(err);
        res.json({ message: "Something went wrong" });
    }
});

//new Password
app.post("/newpassword", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "Missing Data" });
        }

        const user = await authModel.findOne({ email });
        if (!user) {
            return res.json({ message: "⚠️ Email not found" });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        await user.save();

        res.json({ message: "✅ Password updated successfully" });

    }
    catch (err) {
        console.log(err);
        res.json({ message: "Something went wrong" });
    }
})

//home
app.get("/home", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const verifiedToken = await jwt.verify(token, "admin@1234");
        console.log(verifiedToken);

        const user = await authModel.findById(verifiedToken.id);
        console.log(user);
        if (!user) {
            return res.json({ message: "User not found" });
        }

        res.json({ message: "User verified", username: user.username || user.name || "User" });
    }
    catch (err) {
        res.json({ message: "Invalid or expired token" });
    }
})


//super admin dashboard
app.get("/spdash", async (req, res) => {
    try {
        const users = await authModel.find();
        console.log(users);

        if (!users) {
            return res.json({ message: "No data found" });
        }

        res.json({ message: "Data synced", users });
    }
    catch (err) {
        console.log(err);
    }
})

//admin dashboard
app.get("/admindash", async (req, res) => {
    try {
        let users = await authModel.find();

        if (!users) {
            return res.json({ message: "No data found" });
        }

        res.json({ message: "Data synced", users });
    }
    catch (err) {
        console.log(err);
    }
})

app.post("/sprole", async (req, res) => {
    const { role, id } = req.body;

    const roleUpdate = await authModel.findByIdAndUpdate(id, { role: role }, { new: true });
    if (!roleUpdate) {
        return res.json({ message: "Role not updated" });
    }

    res.json({ message: "Role Updated" });
})

app.post("/productsAdd", async (req, res) => {
    try {
        const { name, price, quantity, color, image } = req.body;
        console.log(name, price, quantity, color, image);

        if (!name || !price || !quantity || !color || !image) {
            return res.json({ message: "All fields are required" });
        }

        const products = await productModel.create({
            name,
            price,
            quantity,
            color,
            image
        })

        res.json({ message: "Product added", products })
    }
    catch (err) {
        res.json({ message: "Product is not added..." });
    }
});

app.get("/products", async (req, res) => {
    try {
        const products = await productModel.find();
        console.log(products);

        res.json({message : "Products fetched successfully", products});
    }
    catch (err) {
        console.log(err);
        res.json({message : "Error fetching products"})
    }
})

//delete
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const deleteUser = await authModel.deleteOne({ _id: id });

        if (deleteUser.deletedCount === 0) {
            return res.json({ message: "No user found with this ID" });
        }

        console.log(deleteUser);

        res.json({ message: "user deleted successfully", deleteUser });
    }
    catch (err) {
        console.log(err);
    }
})

app.put("/productsdata/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {name, price, quantity, color} = req.body;

        const updatedProduct = await productModel.findByIdAndUpdate(id, {name, price, quantity, color}, {new : true});

        res.json({message : "Product updated successfully", updatedProduct});
    }
    catch (err) {
        console.log(err);
        res.json({message : "Error updating product"});
    }
})

app.delete("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const product = await productModel.deleteOne({_id : id});

        if(product.deletedCount === 0) {
            return res.json({message : "No product found with this ID"});
        }

        console.log(product);

        res.json({message : "Product deleted successfully", product});
    }
    catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})