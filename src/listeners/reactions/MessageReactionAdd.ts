import {Listener} from "discord-akairo"
import Discord, {MessageEmbed, MessageReaction, Util} from "discord.js"
// @ts-ignore
import db from "quick.db"

export default class MessageReactionAdd extends Listener {
    public constructor() {
        super("messageReactionAdd", {
            emitter: 'client',
            event: 'messageReactionAdd',
            type: 'reactions'
        });
    }
    public async exec(reaction: MessageReaction): Promise<any> {
        let message = reaction.message;
        let emoji = await db.fetch(`staremoji_${message.guild.id}`) ? await db.fetch(`staremoji_${message.guild.id}`) : '⭐'
        if (reaction.emoji.name !== emoji) return;
        if (!message.content) return;
        if (reaction.count < await db.fetch(`starminimum_${message.guild.id}`)) return;
        const channel = await message.guild.channels.cache.get(db.fetch(`starchannel_${message.guild.id}`))
        let mes = await db.fetch(`starboarded_${message.id}`)
        if (!channel) return;
        if (!mes) {
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Util.escapeMarkdown(message.content)} | [Jump](${message.url})`)
                .setFooter(`${reaction.count}${emoji} - ${message.id}`)
                .setTimestamp(message.createdAt)
                .setColor(0x38b6ff)
            if (message.attachments.first())embed.setImage(message.attachments.first().proxyURL)
            // @ts-ignore
            channel.send(embed).then(fishy => {
                db.set(`starboarded_${message.id}`, fishy.id)
            })
        } else {
            // @ts-ignore
            const msg = await channel.messages.fetch(await db.fetch(`starboarded_${message.id}`))
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${Util.escapeMarkdown(message.content)} | [Jump](${message.url})`)
                .setFooter(`${reaction.count}${emoji} - ${message.id}`)
                .setTimestamp(message.createdAt)
                .setColor(0x38b6ff)
                if (message.attachments.first())embed.setImage(message.attachments.first().proxyURL)
            msg.edit(embed);
        }
    }
}