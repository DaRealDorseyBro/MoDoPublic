import {Command} from "discord-akairo"
import {Message} from "discord.js"
import db from "quick.db"

export default class ToggleFact extends Command {
    public constructor() {
        super("togglefact", {
            aliases: ['togglefact'],
            category: "AI",
            description: {
                content: "test",
                usage: `test`,
                examples: [
                    'test'
                ]
            },
            ratelimit: 3
        });
    }
    public async exec(message: Message): Promise<any> {
        if (!await db.fetch(`autoFacts_${message.guild.id}`)) {
            await db.set(`autoFacts_${message.guild.id}`, 'off')
            message.util.send('I have turned off the auto facts')
        } else if (await db.fetch(`autoFacts_${message.guild.id}`) === 'off') {
            await db.delete(`autoFacts_${message.guild.id}`)
            message.util.send('I have turned on the auto facts')
        }
    }
}