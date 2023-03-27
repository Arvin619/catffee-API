import express, { Application, Request, Response, NextFunction } from "express"
import morgan from "morgan"
import chalk from "chalk"
import fs from "fs"

export default function(isFocusColor: Boolean = false, stream?: fs.WriteStream): (req: Request, res: Response, next: NextFunction) => void {
    if (isFocusColor) {
        return morgan((tokens, req, res) => {
            return [
                chalk.hex('#f78fb3').bold(tokens.date(req, res)),
                chalk.yellow(tokens['remote-addr'](req, res)),
                chalk.hex('#34ace0').bold(tokens.method(req, res)).padStart(38),
                chalk.hex('#ffb142').bold(tokens.status(req, res)),
                chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms').padStart(42),
                chalk.hex('#ff5252').bold(tokens.url(req, res)),
            ].join('  |  ')
        });
    } else {
        return morgan((tokens, req, res) => {
            return [
                tokens.date(req, res),
                tokens['remote-addr'](req, res),
                tokens.method(req, res)?.padStart(8),
                tokens.status(req, res),
                (tokens['response-time'](req, res) + ' ms').padStart(10),
                tokens.url(req, res),
            ].join('  |  ')
        }, {stream: stream})
    }
}