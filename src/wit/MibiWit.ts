import {Wit} from "node-wit";
import {MiBiFirebase} from "../db/MiBiFirebase";

export class MibiWit {

    public static sendMessage(io, msg, propertyReader, socket, mibiFirebase) {

        let context = {};
        let sessionId = 'xep';

        MibiWit.getClient(io, propertyReader, socket, mibiFirebase).runActions(
            sessionId, // the client's current session
            msg.text, // the client's message
            context // the client's current session state
        ).then((newContext) => {
            // Our bot did everything it has to do.
            // Now it's waiting for further messages to proceed.
            console.log('Waiting for next client messages');

            // Based on the session state, you might want to reset the session.
            // This depends heavily on the business logic of your bot.
            // Example:
            // if (context['done']) {
            //   delete sessions[sessionId];
            // }

            // Updating the client's current session state
            context = newContext;
        })
            .catch((err) => {
                console.error('Oops! Got an error from MibiWit: ', err.stack || err);
            })
    }

    private static getClient(io, propertyReader, socket, mibiFirebase:MiBiFirebase){
        const accessToken = propertyReader.getAccessToken();

        const actions = {
            send(request, response) {
                const {sessionId, context, entities} = request;
                const {text, quickreplies} = response;
                // console.log(request);
                // console.log('client said...', request.text);
                io.to(socket.id).emit('message', response);
                // console.log('Yay, got MibiWit.ai response: ' +  JSON.stringify(response.text) );
                // console.log('wit said...', response);
            },
            getPukPhoneNumber({context, entities}) {
                mibiFirebase.getNumbers(socket._userInfo.company,entities.name[0].value).then((numbers) => {
                    let quickreplies = [];

                    let array = numbers.val();

                    for(let number in array){
                        for (let num in array[number]){
                            quickreplies.push(array[number][num])
                        }
                    }
                    quickreplies.push("Nei, det er ingen av de nummerene");

                    console.log(quickreplies);

                    let response = { text: 'Hvilke av disse nummerene vil du ha PUK for?',
                        quickreplies: quickreplies
                    };

                    console.log(response);
                    io.to(socket.id).emit('message', response);
                });
            },
            getPuk({context, entities}) {
                // console.log(socket._userInfo.company + ' and ' +  entities.number[0].value);
                mibiFirebase.getSubscription(socket._userInfo.company, entities.number[0].value).then((subscription) => {
                    console.log(context);
                   // context.name = subscription.val().name;
                   // context.puk = subscription.val().puk;
                   // context.number = entities.number[0].value;
                    // console.log(subscription.val().name);
                    // console.log(subscription.val().puk);
                });//.then( () => {
                //     return context;
                // });
            }
            // getForecast({context, entities}) {
            //     var location = firstEntityValue(entities, 'location')
            //     if (location) {
            //         console.log('got', location)
            //         context.forecast = 'sunny in ' + location; // we should call a weather API here
            //         delete context.missingLocation;
            //     } else {
            //         context.missingLocation = true;
            //         delete context.forecast;
            //     }
            //     return context;
            // },
        };
        return new Wit({accessToken, actions});
    }
}