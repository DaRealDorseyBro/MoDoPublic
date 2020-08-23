import {Command} from "discord-akairo"
import {Message, GuildMember, MessageEmbed} from "discord.js"
import {Repository} from "typeorm"
import {Warns} from "../../models/Warns";
import {prefix} from "../../Config";


export default class EditWarn extends Command {
    public constructor() {
        super("editwarn", {
            aliases: ['editwarn', 'editwarns', 'editinfractions'],
            category: "Moderation",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3,
            userPermissions: ["MANAGE_MESSAGES"],
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ]
        });
    }

    public async exec(message: Message, {member}: { member: GuildMember }): Promise<any> {
        if (!member) return message.util.send('Please mention a member!')
        const args = message.content.slice(prefix.length).split(/ +/);

        if (!args.includes("|")) return message.util.send(`Please follow the format, heres a example: ${prefix}${args[0]} <@${message.author.id}> Spamming | Spamming Multiple Times`)

        let Text = args.slice(2).join(' ').split("|")
        let reason = Text[0].trim();
        const newReason = Text[1].trim();



        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns);
        let warningS = await warnRepo.find({
            reason: reason,
            user: member.id,
            guild: message.guild.id
        })
        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID)
            return message.util.send('This member has a higher/same role as you!')

        if (warningS.length < 1) return message.util.send('There isn\'t a warn with that reason!')
        await warnRepo.delete({reason: reason, user: member.id, guild: message.guild.id})
        var i;
        for (i = 0; i < warningS.length; i++) {
            await warnRepo.insert({
                guild: message.guild.id,
                user: member.id,
                moderator: message.author.id,
                reason: newReason
            });
        }

        const embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setTitle('Edited Infraction')
            .setDescription(`Warn Member: <@!${member.user.id}> [\`${member.id}\`]\n\nOld Reason: \`${reason}\`\n\nNew Reason: \`${newReason}\`\n\nModerator: <@!${message.author.id}> [\`${message.author.id}\`]`)
            .setTimestamp()
            .setColor(0x38B6FF)
            .setFooter('MoDo | By Dorsey')

        return message.util.send(embed)
    }
}
