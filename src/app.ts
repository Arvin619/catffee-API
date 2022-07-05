import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv"

dotenv.config()

const app: Application = express()

const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Server running http://127.0.0.1:${port}`);
});