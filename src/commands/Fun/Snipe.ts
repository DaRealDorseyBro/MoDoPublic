import {Command} from 'discord-akairo'
import {Message, MessageEmbed, Util, GuildChannel} from 'discord.js'


export default class Snipe extends Command {
    public constructor() {
        super("snipe", {
            aliases: ['snipe'],
            category: "Fun",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel',
                    default: (msg: Message) => msg.channel
                }
            ]
        });
    }
    public async exec(message: Message, { channel }: { channel: GuildChannel }): Promise<any> {
        const msg = this.client.snipes.get(channel.id);
        if (!msg)
            return message.util.send("Theres no deleted messages to snipe!");
        if (!msg.content) {
            message.util.send("The message was either a embed or had no content");
        } else {
            const embed = new MessageEmbed();
            embed.setTitle("Sniping <a:loading1:726722335075336263>");
            embed.setColor(0x38b6ff);
            message.channel.send(embed).then((sentmsg) => {
                embed.setAuthor(`Sent by: ${msg.author}`, msg.authoravatar);
                embed.setTitle("Sniped!");
                if (msg.image) {
                    embed.setDescription(
                        `**Message:** ${Util.escapeMarkdown(msg.content)}\n**Sent in:** ${
                            msg.where
                        }\n**↓ Image ↓**`
                    );
                } else {
                    embed.setDescription(
                        `**Message:** ${Util.escapeMarkdown(msg.content)}\n**Sent in:** ${
                            msg.where
                        }`
                    );
                }
                embed.setTimestamp(msg.time);
                embed.setFooter("MoDo | by Dorsey | Sent at ");
                if (msg.image) embed.setImage(msg.image);
                setTimeout(() => {
                    sentmsg.edit(embed);
                }, 100);
            });
        }
    }
}