import {Command} from "discord-akairo"
import {Message, MessageEmbed, GuildChannel, GuildEmoji} from "discord.js"
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
                  id: 'emoji',
                  type: 'string',
                  prompt: {
                      start: (msg: Message) => `${msg.author}, Please send a emoji for the starboard`,
                      retry: (msg: Message) => `${msg.author}, Please send a valid emoji for the starboard`
                  }
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

    public async exec(message:Message, {channel, emoji, amount}: {channel: GuildChannel, emoji: GuildEmoji, amount: any}): Promise<any> {
        function isCustomEmoji(emoji5) {
            return emoji5.split(":").length === 1 ? false : true;
        }
        let emojiCheck = isCustomEmoji(emoji)
        if (emojiCheck === true) return message.util.send('Sorry! Can\' use custom emojis!')
        await db.set(`starchannel_${message.guild.id}`, channel.id)
        await db.set(`staremoji_${message.guild.id}`, emoji)
        await db.set(`starminimum_${message.guild.id}`, amount)
        message.util.send(new MessageEmbed()
            .setTitle(`Starboard for ${message.guild.name}`)
            .setDescription(`Emoji: ${await db.fetch(`staremoji_${message.guild.id}`)}\nMinimum Stars: ${await db.fetch(`starminimum_${message.guild.id}`)}\nStarboard Channel: <#${await db.fetch(`starchannel_${message.guild.id}`)}>`)
            .setTimestamp()
            .setColor(0x38b6ff)
            .setFooter("MoDo | By Dorsey")
        );
        // @ts-ignore
        channel.send('Set this channel to the starboard channel')
    }
}