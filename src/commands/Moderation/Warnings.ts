import {Command} from "discord-akairo"
import {Message, MessageEmbed, GuildMember, User} from "discord.js"
import {Repository} from "typeorm"
import {Warns} from "../../models/Warns";
import Database from "../../structures/Database"
import {prefix} from "../../Config";

export default class Warnings extends Command {
    public constructor() {
        super("warnings", {
            aliases: ['warnings', 'infractions', 'warns'],
            category: "Moderation",
            description: {
                content: "Get the warns for a member",
                usage: `${prefix}warns [ mention ]`,
                examples: [
                    `${prefix}warns @DaRealDorseyBro#5000`,
                    `${prefix}warns Cinnamon Roll`
                ]
            },
                ratelimit: 3,
                userPermissions: ["MANAGE_MESSAGES"],
                args: [
                    {
                        id: 'member',
                        type: 'member',
                        default: (msg: Message) => msg.member
                    }
                ]
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember }): Promise<any> {
        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns);
        const warns: Warns[] = await warnRepo.find({user: member.id, guild: message.guild.id});

        if (!warns.length) return message.util.send('No infractions found for `' + member.user.tag + '`')

        const infractions = await Promise.all(warns.map(async (v: Warns, i: 0) => {
            const mod: User = await this.client.users.fetch(v.moderator).catch(() => null);
            if (mod) return {
                index: i + 1,
                moderator: mod.tag,
                reason: v.reason
            }
        }));

        return message.util.send(new MessageEmbed()
            .setAuthor(`Warns | ${member.user.tag}`, member.user.displayAvatarURL())
            .setDescription(infractions.map(v => `\`#${v.index}\` | Moderator: \`${v.moderator}\` | Reason: \`${v.reason}\``))
            .setTimestamp()
            .setColor(0x38B6FF)
            .setFooter('MoDo | By Dorsey')
        );
    }
}