import * as _ from 'lodash';

export class MibiWitFunctions{

    public static getPukPhoneNumber(context, entities, io, socket, mibiFirebase) {
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
                        quickreplies.push(array[number][num]);
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
    }

    public static getPuk(context, entities, socket, mibiFirebase) {
        return mibiFirebase.getSubscription(socket._userInfo.company, entities.number[0].value).then((subscription) => {
            context.name = _.startCase(subscription.val().name);
            context.puk = subscription.val().puk;
            context.number = entities.number[0].value;
            return context;
        });
    }
}