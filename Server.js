const express = require('express');
const cors = require("cors");
require('dotenv').config();
const {v4: uuid4} = require('uuid');
const mongoose = require("mongoose");
const initateDB = require('./src/config/db.config');
const users = require("./src/routers/api/v1/users/users.routes")
const expert = require("./src/routers/api/v1/expert/expert.routes")

//app config
const app = express();
const port = process.env.PORT||5000;
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const cookieParser = require("cookie-parser");
    //middleware
app.use(cookieParser());
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var corsOptions = {
    methods: "GET, PUT, POST, DELETE, PATCH",
    credentials: true,
    origin: "http://localhost:3000"
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,User-Authorization,Expert-Authorization');
    res.header('responseType', 'blob')
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

    next();
}

app.use(allowCrossDomain);
app.options('*', cors())
app.use(cors(corsOptions));

//db config
initateDB();

const uri = process.env.MONGO_URI;

const conn = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
);

//routes
app.get("/", (req, res) => res.status(200).send("ExpertHub Server Connected"))
app.use("/user", users);
app.use("/expert",expert);
app.use('/peerjs', peerServer);
app.get('/connect',(req, res) => {
    res.redirect(`/${uuid4()}`);
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
         socket.join(roomId);
         socket.to(roomId).emit('user-connected', userId);
         socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
         })
    })

})

//Listening
server.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});

