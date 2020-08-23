import {Message} from "discord.js"
import Discord from "discord.js"
import {Command} from "discord-akairo"
import weather from "weather-js"
import {prefix} from "../../Config";


export default class Weather extends Command {
    public constructor() {
        super("weather", {
            aliases: ["weather", "forecast"],
            category: "Fun",
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
        const args = message.content.slice(prefix.length).split(/ +/);
        let msgArgs = args.slice(2).join(" ");
        let deg = args[1];
        let replies = ["f", "c", "F", "C"];
        let type;
        if (deg === "c" || deg === "C") type = "Celsius";
        if (deg === "f" || deg === "F") type = "Fahrenheit";

        if (!deg)
            return message.util.send(
                `Please use one these responses: \`${replies.join(", ")}\``
            );

        if (!replies.includes(deg))
            return message.util.send(
                `Only these degrees are supported: \`F\` or \`C\``
            );
        if (!args[1])
            return message.util.send(
                "Please specify a place to report the weather like `Vancouver, WA` or `London, England`"
            );

        weather.find({search: `${msgArgs}`, degreeType: `${deg}`}, function (
            err,
            result
        ) {
            if (err) console.log(err);
            const embed = new Discord.MessageEmbed().setTitle(
                "Going outside <a:LoadingGif:746146152923267093>"
            ).setColor(0x38b6ff).setFooter("MoDo | By Dorsey");
            message.util.send(embed).then((sentmsg) => {
                embed.setAuthor("Weather", result[0].current.imageUrl);
                embed.setTitle(`Weather - ${result[0].location.name}`);
                embed.setDescription(
                    `Temperature: **${result[0].current.temperature}° ${type}**\nSky: **${result[0].current.skytext}**\nReal Feel: **${result[0].current.feelslike}° ${type}**\nHumidity: **${result[0].current.humidity}%**\nWind speed: **${result[0].current.winddisplay}**\nDate and Time: **${result[0].current.shortday}**, **${result[0].current.date} at ${result[0].current.observationtime}**`
                ).setColor(0x38b6ff).setFooter("MoDo | By Dorsey");
                embed.setThumbnail(result[0].current.imageUrl);
                embed.setColor(0x38b6ff);
                embed.setFooter("MoDo | By Dorsey");
                setTimeout(() => {
                    sentmsg.edit(embed);
                }, 100);
            });
        });
    }
}