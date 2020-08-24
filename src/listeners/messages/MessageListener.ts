import {Listener} from "discord-akairo"
import Discord from "discord.js"
import {Message, User} from "discord.js"
import quick from "quick.db"
import {Facts} from "../../models/Facts";
import {Repository} from "typeorm"

export default class MessageListener extends Listener {
    public constructor() {
        super("message", {
            emitter: 'client',
            event: 'message',
            category: 'messages'
        });
    }

    public async exec(message: Message): Promise<void> {

            if (message.author.bot) return;

            let args = message.content.split(/ +/)
        if (!await quick.fetch(`autoFacts_${message.guild.id}`)) {
            if (args.includes('is') && !message.content.startsWith('m-') && args[0] !== 'what') {
                let Text = args.join(' ').split("is")
                let factName = Text[0].trim()
                let factValue = Text[1].trim()
                if (factName && factValue) {
                    const factRepo: Repository<Facts> = this.client.db.getRepository(Facts);

                    const factSearch: Facts[] = await factRepo.find({fact: factName});

                    if (!factSearch.length) {

                        factRepo.insert({
                            setby: message.author.id,
                            fact: factName,
                            value: factValue
                        });
                    }
                }
            }

            if (args.includes('is') && !message.content.startsWith('m-') && args[0] === 'what') {
                let whatis = args.join(' ').split("is")
                let factsName = whatis[1].trim()
                if (factsName) {
                    const factRepo: Repository<Facts> = this.client.db.getRepository(Facts);

                    const facts: Facts[] = await factRepo.find({fact: factsName});
                    if (facts.length) {
                        const factSearch = await Promise.all(facts.map(async (v: Facts) => {
                            const setter: User = await this.client.users.fetch(v.setby).catch(() => null);
                            if (setter) return {
                                fact: v.fact,
                                value: v.value
                            }
                        }));
                        let random = Math.floor(Math.random() * 2) + 1
                        if (random === 3)
                            message.util.send(factSearch.map(v => `I was told ${v.fact} is ${v.value}`))
                        else if (random === 2)
                            message.util.send(factSearch.map(v => `Someone once said that ${v.fact} is ${v.value}`))
                        else if (random === 1)
                            message.util.send(factSearch.map(v => `I think ${v.fact} is ${v.value}`))
                    }
                }
            }
        }

            if (message.channel.type === "text") return;
            let timeout = 60000;
            let wait = await quick.fetch(
                `messageWait_${message.guild.id}_${message.author.id}`
            );
            if (wait !== null && timeout - (Date.now() - wait) > 0) return;
            let messageFetch = quick.fetch(`guildMessages_${message.guild.id}`);
            if (messageFetch === 1) {
                let now: any = Date.now()
                let level = quick.fetch(`lvl_${message.guild.id}_${message.author.id}`);
                quick.add(`xp_${message.guild.id}_${message.author.id}`, 5);
                quick.set(
                    `messageWait_${message.guild.id}_${message.author.id}`,
                    now
                );
                let messagefetch = quick.fetch(
                    `xp_${message.guild.id}_${message.author.id}`
                );
                let messages: any;
                if (messagefetch == 0) messages = 0;
                //Level 0
                else if (messagefetch == 100) messages = 100;
                // Level 1
                else if (messagefetch == 200) messages = 200;
                // Level 2
                else if (messagefetch == 300) messages = 300;
                // Level 3
                else if (messagefetch == 400) messages = 400;
                // Level 4
                else if (messagefetch == 500) messages = 500;
                // Level 5
                else if (messagefetch == 600) messages = 600;
                // Level 6
                else if (messagefetch == 700) messages = 700;
                // Level 7
                else if (messagefetch == 800) messages = 800;
                // Level 8
                else if (messagefetch == 900) messages = 900;
                // Level 9
                else if (messagefetch == 1000) messages = 1000;
                // Level 10
                else if (messagefetch == 1500) messages = 1500;
                // Level 11
                else if (messagefetch == 2000) messages = 2000;
                // Level 12
                else if (messagefetch == 2500) messages = 2500;
                // Level 13
                else if (messagefetch == 3000) messages = 3000;
                // Level 14
                else if (messagefetch == 3500) messages = 3500;
                // Level 15
                else if (messagefetch == 4000) messages = 4000;
                // Level 16
                else if (messagefetch == 4500) messages = 4500;
                // Level 17
                else if (messagefetch == 5000) messages = 5000;
                // Level 18
                else if (messagefetch == 5500) messages = 5500;
                // Level 19
                else if (messagefetch == 6000) messages = 6000;
                // Level 20
                else if (messagefetch == 6500) messages = 6500;
                // Level 21
                else if (messagefetch == 7000) messages = 7000;
                // Level 22
                else if (messagefetch == 7500) messages = 7500;
                // Level 23
                else if (messagefetch == 8000) messages = 8000;
                // Level 24
                else if (messagefetch == 8500) messages = 8500;
                // Level 25
                else if (messagefetch == 9500) messages = 9500;
                // Level 26
                else if (messagefetch == 10000) messages = 10000;
                // Level 27
                else if (messagefetch == 11000) messages = 11000;
                // Level 28
                else if (messagefetch == 12000) messages = 12000;
                // Level 29
                else if (messagefetch == 13000) messages = 13000;
                // Level 30
                else if (messagefetch == 14000) messages = 14000;
                // Level 31
                else if (messagefetch == 15000) messages = 15000;
                // Level 32
                else if (messagefetch == 16000) messages = 16000;
                // Level 33
                else if (messagefetch == 17000) messages = 17000;
                // Level 34
                else if (messagefetch == 18000) messages = 18000;
                // Level 35
                else if (messagefetch == 19000) messages = 19000;
                // Level 36
                else if (messagefetch == 20000) messages = 20000;
                // Level 37
                else if (messagefetch == 21000) messages = 21000;
                // Level 38
                else if (messagefetch == 22000) messages = 22000;
                // Level 39
                else if (messagefetch == 23000) messages = 23000;
                // Level 40
                else if (messagefetch == 24000) messages = 24000;
                // Level 41
                else if (messagefetch == 25000) messages = 25000;
                // Level 42
                else if (messagefetch == 26000) messages = 26000;
                // Level 43
                else if (messagefetch == 27000) messages = 27000;
                // Level 44
                else if (messagefetch == 28000) messages = 28000;
                // Level 45
                else if (messagefetch == 29000) messages = 29000;
                // Level 46
                else if (messagefetch == 30000) messages = 30000;
                // Level 47
                else if (messagefetch == 31000) messages = 31000;
                // Level 48
                else if (messagefetch == 32000) messages = 32000;
                // Level 49
                else if (messagefetch == 33000) messages = 33000; // level 50
                if (!isNaN(messages)) {
                    if (level < 10 && level >= 0) {
                        quick.set(
                            `nextXp_${message.guild.id}_${message.author.id}`,
                            messages + 100
                        );
                    } else if (level < 25 && level >= 10) {
                        quick.set(
                            `nextXp_${message.guild.id}_${message.author.id}`,
                            messages + 500
                        );
                    } else if (level <= 50 && level >= 25) {
                        quick.set(
                            `nextXp_${message.guild.id}_${message.author.id}`,
                            messages + 1000
                        );
                    }
                    await quick.add(`lvl_${message.guild.id}_${message.author.id}`, 1);
                    let levelfetch = await quick.fetch(
                        `lvl_${message.guild.id}_${message.author.id}`
                    );
                    if (levelfetch === null) levelfetch = 0;
                    quick.add(
                        `bal_${message.guild.id}_${message.author.id}`,
                        levelfetch * 100
                    );
                    let levelembed = new Discord.MessageEmbed()
                        .setTitle("👏 Level up! 👏")
                        .setDescription(
                            `**${
                                message.author
                            }**, You have leveled up to level \`${levelfetch}\` and won \`$${
                                levelfetch * 100
                            }\`!`
                        )
                        .setColor(0x38b6ff)
                        .setTimestamp()
                        .setFooter("MoDo | By Dorsey");
                    message.util.send(levelembed).then((msg) => {
                        setTimeout(() => {
                            msg.delete();
                        }, 15000);
                    });
                }
            } else return;
        }
    }



























