import { Command } from "discord-akairo"
import { Message, MessageEmbed } from "discord.js"
import moment from "moment"


export default class ServerInfo extends Command {
    public constructor() {
        super("serverinfo", {
            aliases: ['serverinfo', 'si'],
            category: "Info",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3
        });
    }
    public async exec(message: Message): Promise<any> {
        let { guild } = message;

        const {
            name,
            region,
            memberCount,
            owner,
            afkTimeout,
            channels,
            roles,
            createdTimestamp,
            members,
        } = guild;
        let { afkChannel }: any = guild;
        if (afkChannel === null) afkChannel = "No Channel";
        const icon = guild.iconURL();
        let roless: any = message.guild.roles.cache
            .map((roles) => roles)
            .sort((a, b) => b.position - a.position);
        if (roless.length > 35) roless = "To Many Roles!";
        let streamingCount = 0;
        await message.guild.members.cache.forEach((member) => {
            if (
                member.user.presence.activities.find((a) => a.type == "STREAMING") !==
                undefined
            ) {
                streamingCount += 1;
            }
        });
        const embed = new MessageEmbed()
            .setTitle("Server info for " + name)
            .setAuthor(
                `Created at ${moment(message.guild.createdTimestamp).format(
                    "LT"
                )} ${moment(message.guild.createdTimestamp).format("LL")} ${moment(
                    message.guild.createdTimestamp
                ).fromNow()}`
            )
            .setDescription(
                `**Main Info**\n📛-Name: \`${name}\`\n🏴‍☠️-Region: \`${region}\`\n🙎-Member Count: \`${memberCount}\`\n👑-Owner: ${owner}\n\n**Channels and Roles**\n😴-Afk Timeout: \`${
                    afkTimeout / 60
                }\`\n🎙️💤-Afk Channel: ${afkChannel}\n#🎙-Channel Count: \`${
                    channels.cache.size
                }\`\n#📔-Role Count: \`${
                    roles.cache.size
                }\`\n📔-Highest Role: ${roles.highest.toString()}\n\n**Members**\n<a:plexiOnline:478870259944783873>-Online Members: \`${
                    message.guild.members.cache.filter(
                        (user) => user.presence.status === "online"
                    ).size
                }\`\n<a:plexiLive:478870308430938113>-Streaming Members: \`${streamingCount}\`\n<a:plexiAway:478870515730087939>-Idle Members: \`${
                    message.guild.members.cache.filter(
                        (user) => user.presence.status === "idle"
                    ).size
                }\`\n<a:plexiDnd:478869699455746049>-Do Not Disturb Members: \`${
                    message.guild.members.cache.filter(
                        (user) => user.presence.status === "dnd"
                    ).size
                }\`\n<a:plexiOffline:478870457848823818>-Offline Members: \`${
                    message.guild.members.cache.filter(
                        (user) => user.presence.status === "offline"
                    ).size
                }\`\n:person_pouting:-Humans: \`${
                    message.guild.members.cache.filter((user) => !user.user.bot).size
                }\`\n:robot:-Bots: \`${
                    message.guild.members.cache.filter((user) => user.user.bot).size
                }\`\n\n**All Roles**\n${roless}\n\n**Settings**\n<a:GearsTurning:708336697460392027>-Default Notifications: \`${
                    message.guild.defaultMessageNotifications
                }\`\n<a:GearsTurning:708336697460392027>-Verification Level: \`${
                    message.guild.verificationLevel
                }\`\n\n**Boosts**\n<:booster:660789028861509633>-Boosts: \`${
                    message.guild.premiumSubscriptionCount
                }\`\n<:booster:660789028861509633>-Boost Level: \`${
                    message.guild.premiumTier
                }\``
            )
            .setImage(
                message.guild.bannerURL({ format: "png", size: 1024 })
            )
            .setThumbnail(icon)
            .setColor(0x38b6ff)
            .setTimestamp()
            .setFooter(`MoDo | By Dorsey`);
        message.util.send(embed);
    }
}