import {Command} from "discord-akairo"
import {Message} from "discord.js"
import AI from "../../structures/AI";

export default class StartAI extends Command {
    public constructor() {
        super("startai", {
            aliases: ["startai", "ai"],
            category: "AI",
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
                    id: 'text',
                    type: 'string',
                    match: 'rest'
                }
            ]
        });
    }

    public async exec(message: Message, {text}: { text: string }): Promise<any> {

        let id = message.channel.id
        this.client.ais.set(id, new AI(this.client, message.channel, message.author.id));
        await this.client.ais.get(id).start(this.client, message.channel, message.author.id)


    }
}