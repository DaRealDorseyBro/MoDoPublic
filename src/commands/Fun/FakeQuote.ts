import {Command} from "discord-akairo"
import {Message, Snowflake, MessageAttachment} from "discord.js"
import { createCanvas, registerFont, loadImage } from "canvas";
import roundRect from "../../functions/roundRect";
import { fillTextWithTwemoji } from "node-canvas-with-twemoji";
import {prefix} from "../../Config";


export default class FakeQuote extends Command {
    public constructor() {
        super("fakequote", {
            aliases: ['fakequote'],
            category: "other",
            description: {
                content: "test",
                usage: `test`,
                examples: [
                    'test'
                ]
            },
            ratelimit: 3,
        });
    }
    public async exec(message: Message): Promise<any> {
        const args = message.content.slice(prefix.length + 9).split(/ +/)
        if (!args.includes("|")) return message.channel.send(`Please use the correct format: \`m-fakequote im dumb | ${message.author.id}\``);

        const Text = args.join(" ").split("|");

        let imgMsg = Text[0].trim();
        const userToQuote = Text[1].trim();

        if (message.mentions.members.first() && userToQuote.match(/<@!?\d{18}>/g)) return message.channel.send("Please only use a users ID in the user ID position. (On the right of the |)");

        const member = userToQuote.match(/\d{18}/) ? message.guild.members.cache.get(userToQuote) : message.guild.members.cache.find(member => member.user.username === userToQuote);

        if (!member) return message.util.send(`I couldn't find that user! Make sure you either provide an ID or their username`);

        const wordsToWrite = [];

        for (const word of imgMsg.split(" ")) {
            if (word.match(/<@!?\d{18}>/)) {
                const id = word.includes("!") ? word.slice(3, 21).trim() : word.slice(2, 20).trim();
                wordsToWrite.push({ id, word });
            }
        }

        for (const { id, word } of wordsToWrite) {
            imgMsg = imgMsg.replace(word, `|@${id}|`);
        }

        registerFont("/home/MoDo-Beta/src/fonts/Whitney-Book.ttf", {
            family: "whitney",
        });
        registerFont("../src/fonts/Whitney-Medium.otf", {
            family: "whitneyMedium",
        });

        const canvas = createCanvas(1000, 200);
        const ctx = canvas.getContext("2d");
        ctx.font = "38px whitney";

        let measureString = "";

        for (const word of imgMsg.split("|@").join("").split("|")) {
            const mem = message.guild.members.cache.get(word);
            if (mem) measureString += mem.user.username;
            else measureString += word;
        }

        const msgWidth = ctx.measureText(measureString).width;
        if (155 + msgWidth > canvas.width) canvas.width = canvas.width * (msgWidth / canvas.width) + 220;

        ctx.fillStyle = "#36393E";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";

        let x = 166;

        for (const word of imgMsg.split("|")) {
            const id = word.split("@").join("");
            const mem = message.guild.members.cache.get(id);
            if (word.match(/@\d{18}/) && mem) {

                const fill = mem.user.username;

                ctx.fillStyle = '#7289da';
                ctx.globalAlpha = 0.1;

                const width = ctx.measureText(`@${fill}`).width;
                roundRect(ctx, x - 4, 102, width + 9, 49, 6, true, false);

                ctx.globalAlpha = 1;
                ctx.font = "38px whitneyMedium";

                ctx.fillText(`@${fill}`, x, 138);
                x += width + 2;
            } else {
                ctx.font = "38px whitney";
                ctx.fillStyle = "#ffffff";

                const width = ctx.measureText(word).width;
                fillTextWithTwemoji(ctx, word, x, 138);
                x += width + 6;
            }
        }

        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 1;
        ctx.font = "38px whitneyMedium";
        ctx.fillStyle = member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor;
        await fillTextWithTwemoji(ctx, member.user.username, 165, 85);
        const usernameWidth = ctx.measureText(member.user.username).width;

        ctx.font = "26px whitneyMedium";
        ctx.fillStyle = "#7a7c80";

        const time = message.createdAt.toLocaleString().split(",")[1].split(":");
        const ampm = time.splice(2).join("").split(" ")[1];

        if (!member.user.bot) {
            ctx.fillText(`Today at${time.join(":")} ${ampm}`, usernameWidth + 184, 85);
        } else {
            const Flags = (await message.guild.members.cache.get(member.id).user.fetchFlags()).toArray();
            if (!Flags.includes("VERIFIED_BOT")) {
                ctx.fillText(`Today at${time.join(":")} ${ampm}`, usernameWidth + 255, 85);
                ctx.fillStyle = "#7289da";
                roundRect(ctx, usernameWidth + 175, 52, 60, 35, 8, true, false);
                ctx.fillStyle = "#ffffff";
                ctx.font = "23px whitneyMedium";
                ctx.fillText("BOT", usernameWidth + 184, 78);
            } else {
                ctx.fillText(`Today at${time.join(":")} ${ampm}`, usernameWidth + 285, 85);
                ctx.fillStyle = "#7289da";
                roundRect(ctx, usernameWidth + 175, 52, 90, 35,8, true, false);

                ctx.beginPath()
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 3.8;
                ctx.moveTo(usernameWidth + 184, 85 - 15)
                ctx.lineTo(usernameWidth + 191, 85 - 10)
                ctx.lineTo(usernameWidth + 201, 85 - 24)
                ctx.stroke()
                ctx.closePath();

                ctx.fillStyle = "#ffffff";
                ctx.fillText("BOT", usernameWidth + 209, 85 - 7);
            }
        }

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(90, 100, 50, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#36393E";
        ctx.stroke();
        ctx.closePath();
        ctx.clip();

        const avatar = await loadImage(member.user.displayAvatarURL({ format: "png", size: 2048 }));
        ctx.drawImage(avatar, 38, 48, 105, 105);

        return message.util.send(new MessageAttachment(canvas.toBuffer(), "fakequote.png"));
    }
}