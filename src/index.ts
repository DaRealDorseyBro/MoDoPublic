//--------------------IMPORT THE CLIENT--------------------
import { token, owners } from "./Config";
import MoDoClient from "./client/MoDoClient";
//--------------------CREATE THE CLIENT--------------------
console.log('Client starting...');
const client: MoDoClient = new MoDoClient({ token, owners });
//--------------------START THE CLIENT--------------------
client.start();