import {Listener} from "discord-akairo"
import Discord from "discord.js"
import {Message} from "discord.js"

export default class MessageDeleteListener extends Listener {
    public constructor() {
        super("messageDelete", {
            emitter: 'client',
            event: 'messageDelete',
            type: 'messages'
        });
    }
    public async exec(message: Message): Promise<void> {
        this.client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author.tag,
            authoravatar: message.author.displayAvatarURL(),
            time: message.createdAt,
            where: message.channel.id,
            image: message.attachments.first()
                ? message.attachments.first().proxyURL
                : null
        })
    }
}