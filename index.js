import express from "express";
import cors from "cors";

const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

// [POST] sign-up
app.post("/sign-up", (req, res) => {
    const user = req.body;
    if (user.username && user.avatar) {
        users.push(user);
        res.status(201).send(user);
    } else {
        res.status(400).end("Todos os campos são obrigatórios!");
    }
});

// [POST] tweets
app.post("/tweets", (req, res) => {
    const tweet = req.body;
    const username = req.header("user");
    if (username && tweet.tweet) {
        tweet.username = username;
        tweet.avatar = users.find(e => e.username === username).avatar;
        tweets.push(tweet);
        res.status(201).send(tweet);
    } else {
        res.status(400).end("Todos os campos são obrigatórios!");
    }
});

// [GET] tweets
app.get("/tweets", (req, res) => {
    const {page} = req.query;
    if (page > 0) {
        const filter = [];
        const x = (page * 10) - 10;
        const y = Math.min(tweets.length, page * 10);
        for (let i = x; i < y; i++) {
            filter.push(tweets[i]);
        }
        res.send(filter);
    }
    else res.status(400).end("Informe uma página válida!");
});

// [GET] tweets/:user
app.get("/tweets/:user", (req, res) => {
    const {user} = req.params;
    res.send(tweets.filter(e => e.username === user));
});

app.listen(port, () => {
    console.log("Running at port " + port);
});
