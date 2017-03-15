import * as _ from 'lodash';
import * as dateformat from 'dateformat';

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

    public static getInvoice(context, entities, io, socket, mibiFirebase){
        let date = new Date(entities.datetime[0].value);

        if(date > new Date()){
            let response = {
                text: 'Beklager, det ser ut som om jeg har fått en dato i framtiden ('+dateformat(date, 'mm/yyyy')+'). Prøv å være mer spesifikk!'
            };
            io.to(socket.id).emit('message', response);
        }else {
            return mibiFirebase.getSubscriptions(socket._userInfo.company).then((subscriptions) => {
                let total = 0;
                // let date = new Date(entities.datetime[0].value);

                console.log(entities.datetime[0].value);

                let link = 'https://fakturahotel.no/' + socket._userInfo.company + '/' + date.getFullYear() + '/' + (date.getMonth() + 1);
                link = _.replace(link, ' ', '_');

                let array = subscriptions.val();

                for (let subscription in array) {
                    total += array[subscription].priceTotal;
                }

                context.time = dateformat(date, 'mm/yyyy');
                // context.time = date.getDay()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
                context.total = total;
                context.link = link;

                return context;
            });
        }
    }
}