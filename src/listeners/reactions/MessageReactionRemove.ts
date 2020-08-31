import {Listener} from "discord-akairo"
import Discord, {Message, MessageEmbed, MessageReaction, Util} from "discord.js"
// @ts-ignore
import db from "quick.db"

export default class MessageReactionRemove extends Listener {
    public constructor() {
        super("messageReactionRemove", {
            emitter: 'client',
            event: 'messageReactionRemove',
            type: 'reactions'
        });
    }
    public async exec(reaction: MessageReaction): Promise<any> {
        let message = reaction.message;
        if (reaction.emoji.name !== '⭐' && reaction.emoji.name !== '🌟' && reaction.emoji.name !== '💫') return;
        if (!message.content) return;
        const channel = await message.guild.channels.cache.get(db.fetch(`starchannel_${message.guild.id}`))
        if (!channel) return;
        if (!db.fetch(`starboarded_${message.id}`)) return
            // @ts-ignore
            const msg = await channel.messages.fetch(await db.fetch(`starboarded_${message.id}`))
            if (reaction.count < await db.fetch(`starminimum_${message.guild.id}`)) {
                await db.delete(`starboarded_${message.id}`)
                msg.delete()
            }
            if (reaction.count >= await db.fetch(`starminimum_${message.guild.id}`)) {
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`${Util.escapeMarkdown(message.content)} | [Jump](${message.url})`)
                    .setFooter(`${reaction.count}⭐ - ${message.id}`)
                    .setTimestamp(message.createdAt)
                    .setColor(0x38b6ff)
                    if (message.attachments.first())embed.setImage(message.attachments.first().proxyURL)
                msg.edit(embed)
            }
        }
    }
