import {Command} from "discord-akairo"
import {Message, MessageEmbed} from "discord.js"
import {Repository} from "typeorm"
import {Facts} from "../../models/Facts";


export default class Forget extends Command {
    public constructor() {
        super("forget", {
            aliases: ['forget'],
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
                    id: 'factName',
                    type: 'string',
                    match: 'rest',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, Please send what fact you want me to forget`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, {factName}: { factName: string }): Promise<any> {
        let forgets: string[] = [`I have forgotten ${factName}!`, `What is ${factName}? I already forgot`, `${factName} has been reduced to atoms`]
        let random = Math.floor(Math.random() * forgets.length)

        const factRepo: Repository<Facts> = this.client.db.getRepository(Facts);

        const factSearch: Facts[] = await factRepo.find({fact: factName});

        if (!factSearch.length) return message.util.send(new MessageEmbed()
            .setAuthor(`There isn't a fact called ${factName} :/`, "https://cdn.discordapp.com/emojis/747246083822059601.png?v=1")
            .setColor(0x38b6ff)
            .setFooter("MoDo | By Dorsey")
        )

        await factRepo.delete({fact: factName})
        message.util.send(new MessageEmbed()
            .setAuthor(forgets[random], "https://cdn.discordapp.com/emojis/747246056005304332.png?v=1")
            .setColor(0x38b6ff)
            .setFooter("MoDo | By Dorsey")
    );

    }
}