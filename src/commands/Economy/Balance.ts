import {Command} from "discord-akairo"
import {Message, MessageEmbed, GuildMember} from "discord.js"
import quick from "quick.db"


export default class Balance extends Command {
    public constructor() {
        super("balance", {
            aliases: ['balance', 'bal'],
            category: "Economy",
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
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: (msg: Message) => msg.member

                }
            ]
        });
    }

    public async exec(message: Message, {member}: { member: GuildMember }): Promise<any> {

        let bal: any = quick.fetch(`bal_${message.guild.id}_${message.author.id}`);
        let bank: any = quick.fetch(`bank_${message.guild.id}_${message.author.id}`);
        if (bal === null) bal = 0;
        if (bank === null) bank = 0;
        if (member.id === message.author.id) {
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTitle(message.author.username + "'s Balance")
                .setDescription(
                    "You have a balance of **$" +
                    bal +
                    `**\nYou have **$${bank}** in the bank`
                )
                .setColor(0x38b6ff)
                .setTimestamp()
                .setFooter("MoDo | By Dorsey");
            message.util.send(embed);
        } else {
            let bal2: any = quick.fetch(`bal_${message.guild.id}_${member.id}`);
            let bank2: any = quick.fetch(`bank_${message.guild.id}_${member.id}`);
            if (bal2 === null) bal2 = 0;
            if (bank2 === null) bank2 = 0;
            const embed = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setTitle(member.user.username + "'s Balance")
                .setDescription(
                    "They have a balance of **$" +
                    bal2 +
                    `**\nThey have **$${bank2}** in the bank`
                )
                .setColor(0x38b6ff)
                .setTimestamp()
                .setFooter("MoDo | By Dorsey");
            message.util.send(embed);
        }
    }

}