import {Command} from "discord-akairo"
import {Message, MessageEmbed, GuildChannel} from "discord.js"
import db from "quick.db"

export default class StarBoard extends Command {
    public constructor() {
        super("starboard", {
            aliases: ['starboard'],
            category: "Config",
            description: {
                content: "test",
                usage: `test`,
                examples: [
                    'test'
                ]
            },
            ratelimit: 3,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    id: 'channel',
                    type: 'channel',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, Please send a channel for the starboard`,
                        retry: (msg: Message) => `${msg.author}, Please send a valid channel for the starboard`
                    },
                },
                {
                    id: 'amount',
                    type: 'number',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, Please send a minimum amount for the starboard`,
                        retry: (msg: Message) => `${msg.author}, Please send a valid minimum amount for the starboard`
                    }
                }
            ]
        });
    }

    public async exec(message:Message, {channel, amount}: {channel: GuildChannel, amount: any}): Promise<any> {
        await db.set(`starchannel_${message.guild.id}`, channel.id)
        await db.set(`starminimum_${message.guild.id}`, amount)
        message.util.send(new MessageEmbed()
            .setTitle(`Starboard for ${message.guild.name}`)
            .setDescription(`Minimum Stars: ${await db.fetch(`starminimum_${message.guild.id}`)}\nStarboard Channel: <#${await db.fetch(`starchannel_${message.guild.id}`)}>`)
            .setTimestamp()
            .setColor(0x38b6ff)
            .setFooter("MoDo | By Dorsey")
        );
        // @ts-ignore
        channel.send('Set this channel to the starboard channel')
    }
}