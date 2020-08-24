import {Repository} from "typeorm"
import {Facts} from "../../models/Facts";
import {Command} from "discord-akairo"
import {Message, MessageEmbed, User} from "discord.js"
import {prefix} from "../../Config";
import {Warns} from "../../models/Warns";

export default class WhoSaid extends Command {
    public constructor() {
        super("whosaid", {
            aliases: ['whosaid'],
            category: "AI",
            description: {
                content: "test",
                usage: `test`,
                examples: [
                    'test'
                ]
            },
            ratelimit: 3,
            args: [
                {
                    id: 'text',
                    type: 'string',
                    match: 'rest',
                    prompt: {
                        start: (msg: Message) => `${msg.author} Please send a fact...`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { text }: { text: string }): Promise<any> {
        let idk: string[] = ['I\'m not sure', 'I dont know', 'You might want to ask someone else']
        let random = Math.floor(Math.random() * idk.length)

        const factRepo: Repository<Facts> = this.client.db.getRepository(Facts);
        const facts: Facts[] = await factRepo.find({fact: text});
        if (!facts.length) return message.util.send(new MessageEmbed()
            .setAuthor(`${idk[random]} what ${text} is :/`, "https://cdn.discordapp.com/emojis/747246083822059601.png?v=1")
            .setColor(0x38b6ff)
            .setFooter("MoDo | By Dorsey")
        );

        const factSearch = await Promise.all(facts.map(async (v: Facts) => {
            const setter: User = await this.client.users.fetch(v.setby).catch(() => null);
            if (setter) return {
                setby: setter.tag,
                avatar: setter.displayAvatarURL(),
                fact: v.fact,
                value: v.value
            }
        }));

        return message.util.send(new MessageEmbed()
            .setAuthor(`Fact | ${factSearch.map(v => `${v.fact}`)}`, `${factSearch.map(v => `${v.avatar}`)}`)
            .setDescription(factSearch.map(v => `Set by \`${v.setby}\` | Value: \`${v.value}\``))
            .setTimestamp()
            .setColor(0x38B6FF)
            .setFooter('MoDo | By Dorsey')
        );
    }
}