
const express = require('express');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
// const firebase = require('firebase');
const cors = require('cors');

const bcrypt = require("bcrypt")
const saltRounds = 3;
require('dotenv').config();

const firebaseConfig = {
    apiKey: "AIzaSyC5lVu-Kjfg9QTtvEL6l0mhmI8sscfK10Y",
    authDomain: "akiraboutique-45674.firebaseapp.com",
    projectId: "akiraboutique-45674",
    storageBucket: "akiraboutique-45674.appspot.com",
    messagingSenderId: "145802658668",
    appId: "1:145802658668:web:bf072793f055471d1b2949",
    measurementId: "G-7YP2BTSZ1B"
};

// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);
// console.log(firebaseApp);
// console.log(auth);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static("public"))
app.set('view engine', 'ejs');

let userVar;

mongoose.connect("mongodb+srv://admin-aryan:test123@cluster0-bamzo.mongodb.net/akiraDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    Phone: Number,
    Orders: [{
        Cost: Number,
        Type: String,
        Quantity: Number,
        DueDate: Date,
        Status: Boolean,
    }]
})

const typeSchema = new mongoose.Schema({
    Type: String,
    Cost: String,
})

const User = mongoose.model('User', userSchema);
const Type = mongoose.model('Type', typeSchema);


app.get("/", (req, res) => {
    res.render("Home")
})

app.get("/admin", (req, res) => {

    User.find({}, (err, users) => {

        if (err) {
            console.log(err)
        } else {
            Type.find({}, (err, types) => {
                if (err) {
                    console.log(err)
                } else {


                    res.render("Admin", {
                        users: users,
                        types: types
                    })
                }
            })


        }
    }).sort({
        Name: 1
    })
})


app.post("/addType", (req, res) => {
    const type = new Type({
        Type: req.body.type,
        Cost: req.body.cost
    })
    type.save()
    res.status(200).redirect("/admin")
})

app.post("/deleteType", (req, res) => {
    const { typeId } = req.body;
    Type.findOneAndDelete({ _id: typeId }, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).redirect("/admin")
        }
    }
    )
    // Type.findOneAndUpdate({
    //     _id: req.body.id
    // }, {
    //     $set: {
    //         Type: req.body.type,
    //         Cost: req.body.cost
    //     }
    // }, (err, type) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         res.status(200).redirect("/admin")
    //     }
    // })
})

app.post("/doneOrder", (req, res) => {
    User.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.body.userId)
    }, {
        $set: {
            "Orders.$[i].Status": true
        }
    }, {
        arrayFilters: [{
            "i._id": mongoose.Types.ObjectId(req.body.orderId)
        }]
    }, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).redirect("/admin")
        }
    }).sort({
        Name: 1
    })
})

app.post("/placeOrder", (req, res) => {
    console.log(req.body);
    const {
        userId,
        quantity,
        dueDate
    } = req.body;
    let type = JSON.parse(req.body.type);
    User.findByIdAndUpdate(userId, {
        $push: {
            Orders: {
                Cost: parseInt(type.Cost) * parseInt(quantity),
                Type: type.Type,
                Quantity: quantity,
                DueDate: dueDate,
                Status: false
            }
        }
    }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            User.findOne({
                _id: userId
            }).then(user => {

                Type.find({}, (err, types) => {
                    if (err) {
                        console.log(err)
                    } else {

                        res.render("Profile", { user: user, types: types });

                    }
                })
            })

            // console.log(data);
            // res.send("Order Placed")

        }
    })
})

app.post("/deleteOrder", async (req, res) => {
    const { userId, orderId } = req.body;

    let userIdObj = mongoose.Types.ObjectId(userId);
    let orderIdObj = mongoose.Types.ObjectId(orderId);

    User.findByIdAndUpdate({ '_id': userIdObj }, {
        $pull: {
            Orders: {
                '_id': orderIdObj
            }
        }
    }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            User.findOne({
                _id: userId
            }).then(user => {
                Type.find({}, (err, types) => {
                    if (err) {
                        console.log(err)
                    } else {

                        res.render("Profile", { user: user, types: types });

                    }
                })
            })
        }
    }
    )
})


app.post("/deleteOrderAdmin", async (req, res) => {
    const { userId, orderId } = req.body;

    let userIdObj = mongoose.Types.ObjectId(userId);
    let orderIdObj = mongoose.Types.ObjectId(orderId);

    User.findByIdAndUpdate({ '_id': userIdObj }, {
        $pull: {
            Orders: {
                '_id': orderIdObj
            }
        }
    }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).redirect("/admin")
        }
    }
    )
})

app.get("/login", (req, res) => {
    res.render("Login", { error: "" });
})

app.get("/signUp", (req, res) => {
    res.render("SignUp");
})

app.post("/signUp", (req, res) => {
    const {
        name,
        email,
        password,
        phone
    } = req.body;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (!err) {

            const user = new User({
                Name: name,
                Email: email,
                Password: hash,
                Phone: phone,
                Orders: []
            })
            // console.log(user);
            user.save()
            res.redirect("/login")
        } else {
            console.log(err);
        }


    })
});

app.post("/signIn", async (req, res) => {

    const { email, password } = req.body;

    // console.log(email, password);
    const user = await User.findOne({
        Email: email
    });
    // console.log(user);
    if (user) {
        bcrypt.compare(password, user.Password, function (err, result) {
            if (result) {

                Type.find({}, (err, types) => {
                    if (err) {
                        console.log(err)
                    } else {

                        res.render("Profile", { user: user, types: types });

                    }
                })
            } else {
                res.render("Login", { error: "Invalid Password" });
            }
        }
        )
    }
    else {

        res.redirect("/signUp");
    }
}
)




const PORT = process.env.PORT || 8000;


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(PORT, () => console.log(`Server is Running Successfully on Port ${PORT} `));