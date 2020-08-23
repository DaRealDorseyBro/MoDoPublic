import {Command} from "discord-akairo"
import {Message, MessageEmbed} from "discord.js"
import ms from "parse-ms"
import quick from "quick.db"

export default class Daily extends Command {
    public constructor() {
        super("daily", {
            aliases: ['daily'],
            category: "Economy",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3,
        });
    }

    public async exec(message: Message): Promise<any> {
        let ration: any = Math.floor(Math.random() * 500) + 100;

        let timeout: any = 86400000;

        let daily = await quick.fetch(
            `daily_${message.guild.id}_${message.author.id}`
        );

        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));
            message.util.send(
                `You have to wait **${time.hours}h ${time.minutes}m ${time.seconds}s** before getting your ration again!`
            );
        } else {
            let now: any = Date.now()
            quick.set(`daily_${message.guild.id}_${message.author.id}`, now);
            quick.add(`bal_${message.guild.id}_${message.author.id}`, ration);
            const embed = new MessageEmbed()
                .setTitle("Daily Ration")
                .setDescription(`You got ${ration}$ as your daily ration!`)
                .setColor(0x38b6ff)
                .setTimestamp()
                .setFooter("MoDo | By Dorsey");
            message.util.send(embed);
        }
    }
}