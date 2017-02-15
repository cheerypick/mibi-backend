// declare module "lol"{
export class mibiWit {

        // constructor(){};

        public static sendMessage(client, sessionId, msg, context) {
            client.runActions(
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
                    console.error('Oops! Got an error from mibiWit: ', err.stack || err);
                })
        }


    // }

}