import  { ConnectionManager } from "typeorm";
import { Warns } from "../models/Warns";
import { dbName } from "../Config";

const connectionManager: ConnectionManager = new ConnectionManager();
connectionManager.create({
    name: dbName,
    type: "sqlite",
    database: "./db.sqlite",
    entities: [
        Warns
    ]
});

export default connectionManager;