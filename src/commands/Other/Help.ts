import {Command} from "discord-akairo";
import {Message} from "discord.js";

import {prefix} from "../../Config";


export default class Help extends Command {
    public constructor() {
        super("help", {
            aliases: ["help", "commands"],
            category: "other",
            description: {
                content: "test",
                usage: `${prefix}help [ command name ]`,
                examples: [
                    `${prefix}help`,
                    `${prefix}help ping`
                ]
            },
            ratelimit: 3,
        });
    }

    public async exec(message: Message): Promise<any> {
        message.util.send("In Progress");
    }
}



