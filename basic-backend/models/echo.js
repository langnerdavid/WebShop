import { echoDb } from "./databases.js";

export function createEchoLog(message) {
    const currentTimestamp = new Date().toISOString();
    const doc = {
        message: message,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };

    return echoDb.insertAsync(doc);
}

export function queryEchos(containsString) {
    return echoDb.findAsync(containsString ? {message: new RegExp(containsString)} : {});
}
