import {Command} from "discord-akairo"
import {Message, MessageEmbed, GuildMember} from "discord.js"
import db from "quick.db"

export default class Rank extends Command {
    public constructor() {
        super("rank", {
            aliases: ['rank', 'level'],
            category: "Info",
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
                    default: (msg: Message) => msg.member,

                }
            ]
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember}): Promise<any> {
        if (member.user.bot)
            return message.util.send(`Bot's Dont Have XP Levels!`);

        let guildMessages = db.fetch(`guildMessages_${message.guild.id}`);
        if (guildMessages === null)
            return message.util.send(
                `Level Up Messages Are Currently Disabled!\n\`m-xp on\` To Enable`
            );

        let xp: any = db.fetch(`xp_${message.guild.id}_${member.id}`);
        let lvl: any = db.fetch(`lvl_${message.guild.id}_${member.id}`);

        if (lvl === null) lvl = 0;
        if (xp === null) xp = 0;

        let name;
        let curxp: any = xp;
        let curlvl: any = lvl;
        let nextLvlXp: any = db.fetch(`nextXp_${message.guild.id}_${member.id}`);
        if (nextLvlXp === null) nextLvlXp = 100;
        if (curlvl === 10) nextLvlXp = 1500;
        if (curlvl === 25) nextLvlXp = 9500;
        let difference2;
        if (curlvl <= 9 && curlvl >= 0) {
            name = "Casual";
        } else if (curlvl < 25 && curlvl >= 10) {
            name = "Known";
        } else if (curlvl <= 50 && curlvl >= 25) {
            name = "Active";
        }
        const embed = new MessageEmbed()
            .setTitle(`**${name} ${member.displayName}'s Level**`)
            .setDescription(
                `**Current Level - \`${curlvl} / 50\` | Total XP - \`${curxp} / ${nextLvlXp}\`\nXP Needed to level up - \`${
                    nextLvlXp - curxp
                }\`**`
            );

        embed.setColor(0x38b6ff);
        embed.setTimestamp();
        embed.setFooter("MoDo | By Dorsey");
        message.util.send(embed);
    }
}