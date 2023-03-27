import express, { Application, Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import logger from "./middleware/logger"

dotenv.config()

const app: Application = express()

const port = process.env.PORT || 5000

let isShutdown = false

let logFile: fs.WriteStream = fs.createWriteStream(path.join(__dirname, "../log", "test.log"), {flags: "w"})

app.use((req: Request, res: Response, next: NextFunction) => {
    if (!isShutdown) {
        return next()
    }
    res.setHeader("Connection", "close")
    res.status(503).send("Server is in the process of restarting")
})

// to log file
app.use(logger(false, logFile))

// to console
app.use(logger(true))

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        "message": 'Hello'
    })
});

app.post('/', express.json(), (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.body).forEach(key => {
        console.log(req.body[key])
    })
    // console.log(req.body)
    res.json({
        "message": 'OK'
    })
})

let server = app.listen(port, () => {
    console.log(`Server running http://127.0.0.1:${port}`)
});

let cleanUp = () => {
    isShutdown = true
    console.log(`server is shuting down`)
    server.close(() => {
        console.log(`server is already shutdown`)
        logFile.close()
        process.exit()
    })

    setTimeout(() => {
        console.error(`could not close connections in time, forcing shut down`)
        process.exit(-1)
    }, 30 * 1000)
}

process.on("SIGINT", cleanUp)
process.on("SIGTERM", cleanUp)
