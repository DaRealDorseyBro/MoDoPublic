import  { ConnectionManager } from "typeorm";
import { Warns } from "../models/Warns";
import { Facts } from "../models/Facts";
import { dbName } from "../Config";

const connectionManager: ConnectionManager = new ConnectionManager();
connectionManager.create({
    name: dbName,
    type: "sqlite",
    database: "./db.sqlite",
    entities: [
        Warns,
        Facts
    ]
});

export default connectionManager;