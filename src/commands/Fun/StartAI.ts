import {Command} from "discord-akairo"
import {Message} from "discord.js"
import AssistantV1 from 'ibm-watson/assistant/v1';
import {IamAuthenticator} from 'ibm-watson/auth';
import {watsonKEY, watsonURL} from '../../Config'

export default class StartAI extends Command {
    public constructor() {
        super("startai", {
            aliases: ["startai", "ai"],
            category: "Fun",
            description: {
                content: "test",
                usage: 'test',
                examples: [
                    "test"
                ]
            },
            ratelimit: 3,
            args: [
                {
                    id: 'text',
                    type: 'string',
                    match: 'rest'
                }
            ]
        });
    }

    public async exec(message: Message, {text}: { text: string }): Promise<any> {
        const filter = (m) => m.author.id === message.author.id
        const q2 = message.channel.createMessageCollector(filter, {
            max: 1,
            time: 60000
        })


        const assistant = new AssistantV1({
            authenticator: new IamAuthenticator({apikey: watsonKEY}),
            version: '2020-08-22',
            url: watsonURL
        });

        const messageAsync = function (text, context) {
            const payload = {
                workspaceId: '',
                input: {
                    text: text,
                },
                context: context
            };
            return assistant.message(payload);
        };


        messageAsync(text, undefined)
            .then(response1 => {
                return messageAsync(text, response1.result.context);
            })
            .then(response2 => {
                message.util.send(response2.result.output.text);
                q2.on('collect', collected2 => {
                    const filter2 = (m) => m.author.id === message.author.id && m.content !== collected2.content
                    const q3 = message.channel.createMessageCollector(filter2, {
                        max: 1,
                        time: 60000
                    })
                    q2.on('end', async fishy => {
                        messageAsync(collected2.content, response2.result.context)
                            .then(response3 => {
                                message.channel.send(response3.result.output.text)
                            })
                            .catch(error => {
                                console.log('Uh oh! There was a error :/')
                                console.error(JSON.stringify(error, null, 2));
                            })

                        q3.on('collect', collected3 => {
                            const filter3 = (m) => m.author.id === message.author.id && m.content !== collected3.content
                            const q4 = message.channel.createMessageCollector(filter3, {
                                max: 1,
                                time: 60000
                            })
                            q3.on('end', async fishyboi => {
                                messageAsync(collected3.content, response2.result.context)
                                    .then(response4 => {
                                        message.channel.send(response4.result.output.text)
                                    })
                                    .catch(error => {
                                        console.log('Uh oh! There was a error :/')
                                        console.error(JSON.stringify(error, null, 2));
                                    })

                                q4.on('collect', collected4 => {
                                    const filter4 = (m) => m.author.id === message.author.id && m.content !== collected4.content
                                    const q5 = message.channel.createMessageCollector(filter4, {
                                        max: 1,
                                        time: 60000
                                    })
                                    q4.on('end', yeet => {
                                        messageAsync(collected4.content, response2.result.context)
                                            .then(response5 => {
                                                message.channel.send(response5.result.output.text)
                                            })
                                            .catch(error => {
                                                console.log('Uh oh! There was a error :/')
                                                console.error(JSON.stringify(error, null, 2));
                                            })
                                        q5.on('collect', collected5 => {
                                            const filter5 = (m) => m.author.id === message.author.id && m.content !== collected5.content
                                            const q6 = message.channel.createMessageCollector(filter5, {
                                                max: 1,
                                                time: 60000
                                            })
                                            q5.on('end', yeet => {
                                                messageAsync(collected5.content, response2.result.context)
                                                    .then(response6 => {
                                                        message.channel.send(response6.result.output.text)
                                                    })
                                                    .catch(error => {
                                                        console.log('Uh oh! There was a error :/')
                                                        console.error(JSON.stringify(error, null, 2));
                                                })
                                                q6.on('collect', collected6 => {
                                                    q6.on('end', fishtimebois => {
                                                        return message.channel.send('Sorry! Only 5 questions for now!')
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
            .catch(error => {
                console.log('Uh oh! There was a error :/')
                console.error(JSON.stringify(error, null, 2));
            });

    }
}