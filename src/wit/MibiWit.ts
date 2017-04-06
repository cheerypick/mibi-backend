import {Wit} from "node-wit";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {MibiWitFunctions} from "./MibiWitFunctions";
// var _ = require('lodash');

export class MibiWit {

    public static sendMessage(io, msg, propertyReader, socket, mibiFirebase) {

        let context = {};
        let sessionId = socket.id;

        MibiWit.getClient(io, propertyReader, socket, mibiFirebase).runActions(
            sessionId, // the client's current session
            msg.text, // the client's message
            context // the client's current session state
        ).then((newContext) => {
            // Our bot did everything it has to do.
            // Now it's waiting for further messages to proceed.
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

    private static getClient(io, propertyReader, socket, mibiFirebase:FirebaseDatabaseReader){
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
                MibiWitFunctions.getPukPhoneNumber(context, entities, io, socket, mibiFirebase);
            },
            getPuk({context, entities}) {
                console.log(context);
                return MibiWitFunctions.getPuk(context, entities, socket, mibiFirebase);
            },
            getInvoice({context, entities}) {
                return MibiWitFunctions.getInvoice(context, entities, io, socket, mibiFirebase);
            },
            getUpdate({context, entities}) {
                return MibiWitFunctions.getUpdate(context, entities, io, socket, mibiFirebase);
            },
            orderData({context, entities}) {
                return MibiWitFunctions.orderData(context, entities, io, socket, mibiFirebase);
            },
            checkForUpdates({context, entities}){
                return MibiWitFunctions.checkForUpdates(context, entities, io, socket, mibiFirebase);
            },
            getJoke({context, entities}){
                return MibiWitFunctions.getJoke(context,entities);
            },
            sendEmail({context, entities}){
                return MibiWitFunctions.sendEmail(context, entities, io, socket, mibiFirebase);
            }
        };
        return new Wit({accessToken, actions});
    }
}