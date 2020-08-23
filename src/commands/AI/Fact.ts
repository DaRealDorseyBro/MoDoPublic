import {Command} from "discord-akairo"
import {Message, MessageEmbed} from "discord.js"
import db from "quick.db"
import {prefix} from "../../Config";

export default class Fact extends Command {
    public constructor() {
        super("fact", {
            aliases: ['fact', ''],
            category: "AI",
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
        const args = message.content.slice(prefix.length).split(/ +/)
        let Text;
        let factName;
        let factValue;

        if (args.includes('is')) {
            Text = args.slice(1).join(' ').split("is")
            factName = Text[0].trim()
            factValue = Text[1].trim()
        } else if (args.includes('are')) {
            let Text = args.slice(1).join(' ').split("are")
            factName = Text[0].trim()
            factValue = Text[1].trim()
        }

        message.util.send(factName + ' space ' + factValue)
    }
}