import {Command} from "discord-akairo"
import {Message} from "discord.js"
import {MessageEmbed} from "discord.js"


export default class Ping extends Command {
    public constructor() {
        super("ping", {
            aliases: ["ping"],
            category: "Other",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3,
        });
    }

    public async exec(message: Message): Promise<any> {
        const now: number = Date.now();
        const embed: MessageEmbed = new MessageEmbed().setTitle('Ponging...')
        // Placeholder for pinging ...
        embed.setColor(0x38b6ff).setFooter("MoDo | By Dorsey");
        message.util.send(embed).then(msg => {
            embed.setTitle(
                "<:websocket:740064742386696214>-Websocket Ping: `" +
                this.client.ws.ping +
                `ms\`\n<:DiscordSupporter:746063443580157953>-Message Took: \`${
                    Date.now() - now
                }ms\` to send`
            );
            msg.edit(embed)
        })
        // Resolve promise
        // Edits message with current timestamp minus timestamp of message
    }

}
