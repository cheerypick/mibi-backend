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
                 console.log(request);
                // console.log('client said...', request.text);

                io.to(socket.id).emit('message', response);
                // console.log('Yay, got MibiWit.ai response: ' +  JSON.stringify(response.text) );
                 console.log('wit said...', response);
            },
            getPukPhoneNumber({context, entities}) {
                mibiFirebase.getNumbers(socket._userInfo.company,entities.name[0].value).then((numbers) => {
                    let numberNotFound = numbers.val() == null;

                    if(numberNotFound){
                        let response = {
                            text: 'Beklager, jeg finner ikke det navnet for din bedrift.'
                        };
                        io.to(socket.id).emit('message', response);
                    }else {
                        let quickreplies = [];

                        let array = numbers.val();

                        for (let number in array) {
                            for (let num in array[number]) {
                                quickreplies.push(array[number][num])
                            }
                        }
                        quickreplies.push("Nei, det er ingen av de nummerene");

                        let response = {
                            text: 'Hvilke av disse nummerene vil du ha PUK for?',
                            quickreplies: quickreplies
                        };
                        io.to(socket.id).emit('message', response);
                    }
                });
            },
            getPuk({context, entities}) {
                return mibiFirebase.getSubscription(socket._userInfo.company, entities.number[0].value).then((subscription) => {
                    context.name = subscription.val().name;
                    context.puk = subscription.val().puk;
                    context.number = entities.number[0].value;
                    return context;
                });
            }
        };
        return new Wit({accessToken, actions});
    }
}