import {Wit} from "node-wit";

export class MibiWit {

    public static sendMessage(io, msg) {

        let context = {};
        let sessionId = 'xep';

        MibiWit.getClient(io).runActions(
            sessionId, // the user's current session
            msg.text, // the user's message
            context // the user's current session state
        ).then((newContext) => {
            // Our bot did everything it has to do.
            // Now it's waiting for further messages to proceed.
            console.log('Waiting for next user messages');

            // Based on the session state, you might want to reset the session.
            // This depends heavily on the business logic of your bot.
            // Example:
            // if (context['done']) {
            //   delete sessions[sessionId];
            // }

            // Updating the user's current session state
            context = newContext;
        })
            .catch((err) => {
                console.error('Oops! Got an error from MibiWit: ', err.stack || err);
            })
    }

    private static getClient(io){
        const accessToken = (() => {
            return "FCK4QSTUY2XYMRLWFXYOBOECNNGYDHCY";
        })();

        const actions = {
            send(request, response) {
                const {sessionId, context, entities} = request;
                const {text, quickreplies} = response;
                console.log(request);
                console.log('user said...', request.text);
                //io.sockets.emit('message', JSON.stringify(response.text));
                io.emit('message', response);
                console.log('Yay, got MibiWit.ai response: ' +  JSON.stringify(response.text) );
                console.log('wit said...', response);
            },
        };
        return new Wit({accessToken, actions});
    }
}