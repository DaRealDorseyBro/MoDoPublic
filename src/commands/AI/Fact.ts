import {Command} from "discord-akairo"
import {Message, MessageEmbed} from "discord.js"
import {Repository} from "typeorm"
import {Facts} from "../../models/Facts";
import {prefix} from "../../Config";
import {Warns} from "../../models/Warns";


export default class Fact extends Command {
    public constructor() {
        super("fact", {
            aliases: ['fact'],
            category: "AI",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3
        });
    }

    public async exec(message: Message): Promise<any> {
        const args = message.content.slice(prefix.length).split(/ +/)

        const embed = new MessageEmbed()
            .setAuthor(`I don\'t know what you mean by that :/`, "https://cdn.discordapp.com/emojis/747246083822059601.png?v=1")
            .setColor(0x38b6ff)
            .setFooter("MoDo | By Dorsey");

        let understands: string[] = ['Got it', 'Understood', 'Now I know']
        let random = Math.floor(Math.random() * understands.length)

        let Text;
        let factName;
        let factValue;

        if (!args.includes('is')) return message.util.send(embed)

        if (args.includes('is')) {
            Text = args.slice(1).join(' ').split("is")
            factName = Text[0].trim()
            factValue = Text[1].trim()
        }
        if (!factName && !factValue) return message.util.send(embed);
        if (factName && !factValue) return message.util.send(embed)
        const factRepo: Repository<Facts> = this.client.db.getRepository(Facts);

        const factSearch: Facts[] = await factRepo.find({fact: factName});

        if (factSearch.length) return message.util.send(new MessageEmbed()
            .setAuthor('I already know about ' + factName + ' :/', "https://cdn.discordapp.com/emojis/747246083822059601.png?v=1")
            .setColor(0x38b6ff)
            .setFooter("MoDo | By Dorsey")
        )

        await factRepo.insert({
            setby: message.author.id,
            fact: factName,
            value: factValue
        });

        const embed2 = new MessageEmbed()
            embed.setAuthor(`${understands[random]}: ${factName} is ${factValue}`, 'https://cdn.discordapp.com/emojis/747246056005304332.png?v=1')
            embed.setColor(0x38b6ff);
            embed.setFooter("MoDo | By Dorsey");
        return message.util.send(embed2)
    }
}