import {Wit} from "node-wit";
import {FirebaseDatabaseReader} from "../db/FirebaseDatabaseReader";
import {MibiWitFunctions} from "./MibiWitFunctions";

export class MibiWit {

    public static sendMessage(io, msg, propertyReader, socket, mibiFirebase, username) {

        let context = {};
        let sessionId = socket.id;

        MibiWit.getClient(io, propertyReader, socket, mibiFirebase, username).runActions(
            sessionId, // the client's current session
            msg.text, // the client's message
            context // the client's current session state
        ).then((newContext) => {
                context = newContext;
            })
            .catch((err) => {
                console.error('Oops! Got an error from MibiWit: ', err.stack || err);
            })
    }

    private static linkify(text) {
        let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlRegex, function (url) {
            console.log(text);
            return '<a href="' + url + '">' + url + '</a>';
        });
    }


    public static getClient(io, propertyReader, socket, mibiFirebase:FirebaseDatabaseReader, username) {

        const accessToken = propertyReader.getAccessToken();

        const actions = {
            send(request, response) {
                const {sessionId, context, entities} = request;
                const {text, quickreplies} = response;
                console.log(request);
                console.log('response', response);
                if (response.text) {
                    response.text = MibiWit.linkify(response.text);
                    console.log(response.text);
                    mibiFirebase.postMessage(username, response);
                }
            },
            getPukPhoneNumber({context, entities}) {
                MibiWitFunctions.getPukPhoneNumber(context, entities, io, socket, mibiFirebase, username);
            },
            getPuk({context, entities}) {
                return MibiWitFunctions.getPuk(context, entities, socket, mibiFirebase, username);
            },
            getInvoice({context, entities}) {
                return MibiWitFunctions.getInvoice(context, entities, io, socket, mibiFirebase, username);
            },
            getUpdate({context, entities}) {
                return MibiWitFunctions.getUpdate(context, entities, io, socket, mibiFirebase, username);
            },
            orderData({context, entities}) {
                return MibiWitFunctions.orderData(context, entities, io, socket, mibiFirebase, username);
            },
            checkForUpdates({context, entities}) {
                return MibiWitFunctions.checkForUpdates(context, entities, io, socket, mibiFirebase, username);
            },
            getJoke({context, entities}){
                return MibiWitFunctions.createJokeContext(context);
            },
            sendEmail({context, entities}) {
                return MibiWitFunctions.sendEmail(context, entities, io, socket, mibiFirebase, username);
            }
        };
        return new Wit({accessToken, actions});
    }
}