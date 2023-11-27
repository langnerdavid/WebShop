import { createEchoLog, queryEchos } from "../models/echo.js";

export function saveEcho(message) {
    return createEchoLog(message);
}

export function listEchos(containsString) {
    return queryEchos(containsString);
}
