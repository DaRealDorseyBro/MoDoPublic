import db from "quick.db"
import { Message} from "discord.js"
import AssistantV1 from 'ibm-watson/assistant/v1';
import {IamAuthenticator} from 'ibm-watson/auth';
import {watsonKEY, watsonURL} from '../Config'

export default class AI {
    constructor(bot, origin, authorID) {
        Object.defineProperty(this, "client", {value: bot});
        Object.defineProperty(this, "origin", {value: origin});
        Object.defineProperty(this, "author", {value: authorID})
        Object.defineProperty(this, "active", {value: false})
    }

    async start(client, origin, author) {
        await origin.send(`Do you want to start the AI?`).then(async msg => {
            await msg.react('✅')
            await msg.react('❌')
            const filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === author;
            const no = msg.createReactionCollector(filter, {time: 15000, max: 1})
            const filter2 = (reaction, user) => reaction.emoji.name === '✅' && user.id === author;
            const yes = msg.createReactionCollector(filter2, {time: 15000, max: 1})

            no.on('collect', async collected => {
                await origin.send('Canceled');
                await yes.stop()
            })
            yes.on('collect', async collected => {
                if (await db.fetch(`AIActive_${origin.id}`) === 'true') return origin.send('This channel is already talking to the AI!');
                await no.stop()
                return this.accept(origin, author);
            })
        })
    }

    async accept(origin, author) {
        await origin.send('Starting AI...').then(async started => {
            await db.set(`AIActive_${origin.id}`, 'true')
            await this.send(origin, Message, author);
            return started.edit("Started the AI, use `--stop` to stop the AI!")
        })
    }

    send(channel, message, author) {
        const filter = (msg) => msg.author.id === author;
        const collector = channel.createMessageCollector(filter)

        collector.on('collect', msg => {


            const args = msg.content.split(/ +/);
            const text = args.join(' ')

            if (msg.author.bot) return;
            if (text.toLowerCase().startsWith('m-')) return;
            if (text === '--stop') {
                channel.send('Stopped the AI')
                db.delete(`AIActive_${channel.id}`)
                return collector.stop();
            }

            const assistant = new AssistantV1({
                authenticator: new IamAuthenticator({apikey: watsonKEY}),
                version: 'your version',
                url: watsonURL
            });

            const messageAsync = function (text, context) {
                const payload = {
                    workspaceId: 'your workspace id',
                    input: {
                        text: text,
                    },
                    context: context
                };
                return assistant.message(payload);
            };

            messageAsync(text, undefined)
                .then(response1 => {
                    return messageAsync(text.toLowerCase(), response1.result.context);
                })
                .then(async response2 => {
                    return channel.send(response2.result.output.text)
                })
                .catch(error => {
                    channel.send('Uh oh! There was a error :/')
                    console.error(JSON.stringify(error, null, 2));
            })
        })
    }
}