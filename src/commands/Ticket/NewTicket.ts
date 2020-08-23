import { Command } from "discord-akairo"
import { Message, MessageEmbed } from "discord.js"
import Discord from "discord.js"


export default class NewTicket extends Command {
    public constructor() {
        super("newticket", {
            aliases: ["newticket", "ticket"],
            category: "Ticket",
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
        if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
            return message.util.send(
                "I dont have permissions to create or delete channels!"
            );
        message.delete();
        const embed = new MessageEmbed()
            .setTitle("React to create your ticket in `15`s!")
            .setColor(0x38b6ff)
            .setTimestamp()
            .setFooter("MoDo | By Dorsey");
        message.util.send(embed).then((msg) => {
            msg.react("🎟️");

            const filter = (reaction, user) => {
                return reaction.emoji.name === "🎟️" && user.id === message.author.id;
            };

            const collector = msg.createReactionCollector(filter, {
                time: 15000,
                max: 1,
            });

            collector.on("collect", (reaction, user) => {
                msg.delete();
                message.guild.channels
                    .create(`${message.author.username}s-ticket`, {
                        type: "text",
                    })
                    .then((channel) => {
                        channel
                            .overwritePermissions(
                                [
                                    {
                                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
                                        id: message.author.id,
                                    },
                                    {
                                        deny: "VIEW_CHANNEL",
                                        id: reaction.message.guild.roles.everyone,
                                    },
                                    {
                                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "ADD_REACTIONS"],
                                        id: message.guild.me.id,
                                    },
                                ],
                                `Created Ticket for ${message.author.tag}`
                            )
                            .catch();
                        const close = new MessageEmbed()
                            .setTitle("React to close this ticket!")
                            .setColor(0x38b6ff)
                            .setTimestamp()
                            .setFooter("MoDo | By Dorsey");
                        channel.send(close).then((mssg) => {
                            mssg.react("🎟️");

                            const cFilter = (reaction, user) => {
                                return (
                                    reaction.emoji.name === "🎟️" && user.id === message.author.id
                                );
                            };
                            const cCollector = mssg.createReactionCollector(cFilter, {
                                max: 1,
                            });

                            cCollector.on("collect", (reaction, user) => {
                                channel.delete(`${message.author.username}s-ticket`);
                            });
                        });
                    });
            });
        });
    }
}