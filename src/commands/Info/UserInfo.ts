import { Message, MessageEmbed } from "discord.js"
import { Command } from "discord-akairo"
import { prefix } from "../../Config";
import moment from "moment"

export default class UserInfo extends Command {
    public constructor() {
        super("userinfo", {
            aliases: ["userinfo", "ui"],
            category: "Info",
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
        function position(id) {
            let arr = message.guild.members.cache
                .sorted((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                .array();

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == id) return i + 1;
            }
        }

        function trimArray(arr, maxLen = 10) {
            if (arr.length > maxLen) {
                const len = arr.length - maxLen;
                arr = arr.slice(0, maxLen);
                arr.push(`${len} more...`);
            }
            return arr;
        }

        let mention =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[1]) ||
            message.guild.members.cache.find((c) =>
                c.displayName.toLowerCase().includes(args.slice(1).join(" ").toLowerCase())
            );
        if (!args[1]) mention = message.member;
        if (!mention) return message.util.send("Please mention someone!");

        const defaultRole = message.guild.roles.cache.get(message.guild.id);
        const member = await message.guild.members.fetch(mention.user.id);
        const roles = member.roles.cache
            .filter((role) => role.id !== defaultRole.id)
            .sort((a, b) => b.position - a.position)
            .map((role) => `${role}`);

        let roless = roles.length ? trimArray(roles, 6).join(" • ") : "None";

        let allStatus = ``;

        let nick = mention.displayName;
        if (nick === mention.user.username) nick = "No Nicknane";

        let status;

        if (
            mention.user.presence.activities.find((a) => a.type == "STREAMING") !==
            undefined
        ) {
            status = "<a:LiveGif:746137601408237639>\n";
        } else if (mention.presence.status === "online")
            status = "<a:OnlineGif:746137774490648596>";
        else if (mention.presence.status === "idle")
            status = "<a:IdleGif:746137721789218939>";
        else if (mention.presence.status === "dnd")
            status = "<a:DndGif:746137649240211558>";
        else if (mention.presence.status === "offline")
            status = "<a:OfflineGif:746137551097692310>\n";

        let statusName;

        if (
            mention.user.presence.activities.find((a) => a.type == "STREAMING") !==
            undefined
        ) {
            statusName = "Streaming";
        } else if (mention.presence.status === "online") statusName = "Online";
        else if (mention.presence.status === "idle") statusName = "Idle";
        else if (mention.presence.status === "dnd") statusName = "Do Not Disturb";
        else if (mention.presence.status === "offline") statusName = "Offline";

        const embed = new MessageEmbed();

        if (!mention.presence.activities.length) {
            allStatus += `<:bio:743964379128528947> Custom Status: \`"No Status"
            \` | Emoji: "\`No Emoji\`"
            \n\n`;
        } else {
            mention.presence.activities.forEach((activity) => {
                if (activity.type === "PLAYING") {
                    let name1 = activity.name;

                    let details1 = activity.details;

                    let state1 = activity.state;

                    allStatus += `🎮 Playing: \`${
                        name1 ? name1 : "No Name"
                    }\` | Details: \`${details1 ? details1 : "No Details"}\` | State: \`${
                        state1 ? state1 : "No State"
                    }\`\n\n`;
                }
                if (
                    activity.type === "LISTENING" &&
                    activity.name === "Spotify" &&
                    activity.assets !== null
                ) {
                    let trackName = activity.details;

                    let trackAuthor = activity.state;

                    let trackAlbum = activity.assets.largeText;

                    trackAuthor = trackAuthor.replace(/;/g, ",");

                    allStatus += `<:Spotify:723917484117196872> Listening to: \`${trackName}\` | Author: \`${trackAuthor}\` | Album: \`${trackAlbum}\`\n\n`;
                }

                if (activity.type === "CUSTOM_STATUS") {
                    allStatus += `<:bio:743964379128528947> Custom Status: \`${
                        activity.state ? activity.state : "No Status"
                    }\` | Emoji: ${activity.emoji ? activity.emoji : "`No Emoji`"}\n\n`;
                }
            });
        }
        embed.setTitle(`User info for ${mention.user.tag}`);

        embed.setDescription(
            `**Basic Info**\n🇮🇩 ID: \`${
                mention.id ? mention.id : "0"
            }\`\n📛 Name: \`${
                mention.user.username ? mention.user.username : "Unknown User"
            }\`\n<:Incognito:743672082017288283> Nickname: \`${
                nick ? nick : "Unknown Nickname"
            }\`\n\🔖 Tag: \`#${
                mention.user.discriminator ? mention.user.discriminator : "0000"
            }\`\n<:Bot:746138221880016986> Bot: \`${
                mention.user.bot ? "Yes" : "No"
            }\`\n${status} Status: \`${statusName}\`\n\n${allStatus}**Guild Info**\n<a:PepeWave:746138212975509514> Joined at: \`${moment(
                mention.joinedTimestamp
            ).format("MMMM Do YYYY, h:mm a")} (${moment(
                mention.joinedAt
            ).fromNow()})\`\n<:DiscordSupporter:746063443580157953> Account Made On: \`${moment(
                mention.user.createdAt
            ).format("MMMM Do YYYY, h:mm a")} (${moment(
                mention.user.createdAt
            ).fromNow()})\`\n📧 Join Position: [ **${position(mention.id)}** / **${
                message.guild.members.cache.size
            }** ]\n\n🔖 Roles: ${roless}`
        );
        embed.setColor(0x38b6ff);
        embed.setThumbnail(
            mention.user.displayAvatarURL({ format: "png", dynamic: true })
        );
        embed.setTimestamp();
        embed.setFooter("MoDo | By Dorsey");
        return message.util.send(embed);
    }
}