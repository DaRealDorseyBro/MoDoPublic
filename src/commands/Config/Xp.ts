import {Command} from "discord-akairo"
import {Message} from "discord.js"
import quick from "quick.db"

export default class Xp extends Command {
    public constructor() {
        super("xp", {
            aliases: ['xp'],
            category: "Config",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    id: 'onoff',
                    type: 'string',
                    match: 'rest'
                }
            ]
        });
    }

    public async exec(message: Message, { onoff }: { onoff: string}): Promise<any> {

        if (onoff !== 'off' && onoff !== 'on') return message.util.send(`Please use \`on, off\``)
        else {
            if (onoff === 'off' && quick.fetch(`guildMessages_${message.guild.id}`) === 1) {
                await quick.delete(`guildMessages_${message.guild.id}`)
                message.util.send('Turned off XP')
            } else if (onoff === 'off' && quick.fetch(`guildMessages_${message.guild.id}`) === null) {
                message.util.send('XP is already off!')

            } else if (onoff === 'on' && quick.fetch(`guildMessages_${message.guild.id}`) === null) {
                await quick.add(`guildMessages_${message.guild.id}`, 1)
                message.util.send('Turned on XP')
            } else if (onoff === 'on' && quick.fetch(`guildMessages_${message.guild.id}`) === 1) {
                message.util.send('XP is already on!')
            }
        }
    }
}