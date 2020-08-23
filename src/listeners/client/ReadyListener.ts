import {Listener} from "discord-akairo"
import {owners, prefix, token} from "../../Config";
import Discord from "discord.js"
import fs from "fs"


export default class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            category: "client"
        });
    }

    public exec(): void {

        let Client = this.client;
        console.log(`${Client.user.tag} is now online :D`)
        let statuss = [
            `${prefix}help | ${Client.guilds.cache.size} Servers!`,
            `${prefix}help | 154.9K Users!`,
            `${prefix}help | 2K Channels!`,
        ];

        setInterval(function () {
            let status = statuss[Math.floor(Math.random() * statuss.length)]
            Client.user.setActivity(status, {type: "PLAYING"})
        }, 5555)

        console.log(
            `${Client.user.username} is online on ${Client.guilds.cache.size} servers, protecting ${Client.users.cache.size} users, looking over ${Client.channels.cache.size} channels`
        );


    }
}