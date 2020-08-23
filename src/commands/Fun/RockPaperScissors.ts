import { Message } from "discord.js"
import { Command } from "discord-akairo"
import { prefix } from "../../Config";
export default class RockPaperScissors extends Command {
    public constructor() {
        super("rockpaperscissors", {
            aliases: ["rockpaperscissors", "rps"],
            category: "Fun",
            description: {
                content: "Play rock paper scissors!",
                usage: 'rock paper or scissors',
                examples: [
                    "t-rockpaperscissors rock"
                ]
            },
            ratelimit: 3,
        });
    }

    public async exec(message: Message): Promise<any> {
        let args = message.content.slice(prefix.length).split(/ +/);
        let replies = ["rock", "paper", "scissors"];
        if (args.slice(1).length < 1)
            return message.util.send(
                `Please play with one of these responses: \`${replies.join(", ")}\``
            );

        let msgArgs = args.slice(1).join(" ");
        let result = Math.floor(Math.random() * replies.length);

        const uReply = args[1];


        if (!replies.includes(uReply))
            return message.util.send(
                `Only these responses are accepted: \`${replies.join(
                    ", "
                )}\`, you can not use \`` +
                msgArgs +
                `\` to play rock paper scissors`
            );
        else if (uReply === "paper") {
            if (replies[result] === "paper") {
                return message.util.send(
                    "I chose `Paper 📰` and you chose `Paper 📰`\n**It's a tie!**"
                );
            }
            if (replies[result] === "rock") {
                message.util.send(
                    "I chose: `Rock 🗿` and you chose `Paper 📰`\n**You Win!**"
                );
            }
            if (replies[result] === "scissors") {
                message.util.send(
                    "I chose: `Scissors ✂️` and you chose `Paper 📰`\n**I Win!**"
                );
            }
        } else if (uReply === "rock") {
            if (replies[result] === "rock") {
                return message.util.send(
                    "I chose `Rock 🗿` and you chose `Rock 🗿`\n**It's a tie!**"
                );
            }
            if (replies[result] === "paper") {
                message.util.send(
                    "I chose: `Paper 📰` and you chose `Rock 🗿`\n**I Win!**"
                );
            }
            if (replies[result] === "scissors") {
                message.util.send(
                    "I chose: `Scissors ✂️` and you chose `Rock 🗿`\n**You Win!**"
                );
            }
        } else if (uReply === "scissors") {
            if (replies[result] === "scissors") {
                return message.util.send(
                    "I chose `Scissors ✂️` and you chose `Scissors ✂️`\n**It's a tie!**"
                );
            }
            if (replies[result] === "rock") {
                message.util.send(
                    "I chose: `Rock 🗿` and you chose `Scissors ✂️`\n**I Win!**"
                );
            }
            if (replies[result] === "paper") {
                message.util.send(
                    "I chose: `Paper 📰` and you chose `Scissors ✂️`\n**You Win!**"
                );
            }
        }

    }
}
