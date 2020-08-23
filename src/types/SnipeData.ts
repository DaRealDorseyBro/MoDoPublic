import { Snowflake } from "discord.js";

export default interface SnipeData {
    content: string,
    author: Snowflake,
    authoravatar: string,
    time: Date,
    where: string,
    image?: string
}