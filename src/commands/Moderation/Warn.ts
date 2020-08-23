import {Command} from "discord-akairo"
import {Message, GuildMember, MessageEmbed} from "discord.js"
import {Repository} from "typeorm"
import {Warns} from "../../models/Warns";
import {prefix} from "../../Config";

export default class Warn extends Command {
    public constructor() {
        super("warn", {
            aliases: ['warn', 'infraction'],
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
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, Please send a member to warn ...`,
                        retry: (msg: Message) => `${msg.author}, Please send a valid member to warn ...`,
                    }
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    default: 'No Reason Provided',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, Please send a reason for the warn ...`,
                        retry: (msg: Message) => `${msg.author}, Please send a valid reason for the warn ...`,
                    }
                }
            ]
        });
    }

    public async exec(message: Message, {member, reason}: { member: GuildMember, reason: string }): Promise<any> {

        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns);
        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID)
            return message.util.send('This member has a higher/same role as you!')
        if (reason === '--all')
            return message.util.send('You cannot use `--all` as a warning!')

        await warnRepo.insert({
            guild: message.guild.id,
            user: member.id,
            moderator: message.author.id,
            reason: reason
        });

        const embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .setTitle('New Infraction')
            .setDescription(`Warned Member: <@!${member.user.id}> [\`${member.id}\`]\n\nReason: \`${reason}\`\n\nModerator: <@!${message.author.id}> [\`${message.author.id}\`]`)
            .setTimestamp()
            .setColor(0x38B6FF)
            .setFooter('MoDo | By Dorsey')

        return message.util.send(embed)
    }
}
