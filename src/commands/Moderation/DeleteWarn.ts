import {Command} from "discord-akairo"
import {Message, GuildMember, MessageEmbed} from "discord.js"
import {Repository} from "typeorm"
import {Warns} from "../../models/Warns";
import quick from "quick.db"

export default class DeleteWarn extends Command {
    public constructor() {
        super("deletewarn", {
            aliases: ['deletewarn', 'deletewarns', 'deleteinfraction'],
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
                    prompt: {
                        start: (msg: Message) => `${msg.author}, Please send a warn you want to delete ...`,
                        retry: (msg: Message) => `${msg.author}, Please send a valid warn you want to delete ...`,
                    }
                }
            ]
        });
    }

    public async exec(message: Message, {member, reason}: { member: GuildMember, reason: string }): Promise<any> {

        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns);
        let warningS = await warnRepo.find({
            reason: reason,
            user: member.id,
            guild: message.guild.id
        })
        if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID)
            return message.util.send('This member has a higher/same role as you!')


            if (reason === '--all') {
                await warnRepo.delete({user: member.id, guild: message.guild.id})
                const embed = new MessageEmbed()
                    .setAuthor(member.user.tag, member.user.displayAvatarURL())
                    .setTitle('Deleted Infraction')
                    .setDescription(`Warn Member: <@!${member.user.id}> [\`${member.id}\`]\n\nDeleted Warn: \`--all\` [All Warns]\n\nModerator: <@!${message.author.id}> [\`${message.author.id}\`]`)
                    .setTimestamp()
                    .setColor(0x38B6FF)
                    .setFooter('MoDo | By Dorsey')

                return message.util.send(embed)
            }
             else if (reason !== '--all') {
                if (warningS.length < 1) return message.util.send('There isn\'t a warn with that reason!')
                await warnRepo.delete({reason: reason, user: member.id, guild: message.guild.id})
                const embed = new MessageEmbed()
                    .setAuthor(member.user.tag, member.user.displayAvatarURL())
                    .setTitle('Deleted Infraction')
                    .setDescription(`Warn Member: <@!${member.user.id}> [\`${member.id}\`]\n\nDeleted Warn: \`${reason}\`\n\nModerator: <@!${message.author.id}> [\`${message.author.id}\`]`)
                    .setTimestamp()
                    .setColor(0x38B6FF)
                    .setFooter('MoDo | By Dorsey')

                return message.util.send(embed)
            }

    }
}