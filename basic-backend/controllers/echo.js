import express from 'express';
import { listEchos, saveEcho } from "../services/echo.js";

const router = express.Router();

router.post('/', validateEcho, async (req, res) => {
    const message = req.body.message;

    try {
        const data = await saveEcho(message);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.get('/', async (req, res) => {
    const containsString = req.query.contains;

    try {
        const data = await listEchos(containsString);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

function validateEcho(req, res, next) {
    if (req.body.message) {
        next();
    } else {
        res.status(400);
        res.send('Body invalid');
    }
}

export { router as echoController };
