import * as _ from 'lodash';
import * as dateformat from 'dateformat';
import {DataService} from "../service/DataService";

export class MibiWitFunctions{

    public static getPukPhoneNumber(context, entities, io, socket, mibiFirebase) {
        mibiFirebase.getNumbers(socket._userInfo.company,entities.name[0].value).then((numbers) => {
            let numberNotFound = numbers == null;

            if(numberNotFound){
                let response = {
                    text: 'Beklager, jeg finner ikke det navnet for din bedrift.'
                };
                io.to(socket.id).emit('message', response);
            }else {
                let quickreplies = [];

                // let array = numbers.val();

                for (let number in numbers) {
                    for (let num in numbers[number]) {
                        quickreplies.push(numbers[number][num]);
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
            context.name = _.startCase(subscription.name);
            context.puk = subscription.puk;
            context.number = entities.number[0].value;
            return context;
        });
    }

    public static getInvoice(context, entities, io, socket, mibiFirebase){
        let date = new Date(entities.datetime[0].value);

        if(date > new Date()) {
            date.setFullYear(date.getFullYear() - 1);
        }
        if(date > new Date()) {
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

                // let array = subscriptions.val();

                for (let subscription in subscriptions) {
                    total += subscriptions[subscription].priceTotal;
                }

                context.time = dateformat(date, 'mm/yyyy');
                // context.time = date.getDay()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
                context.total = total;
                context.link = link;

                return context;
            });
        }
    }

    public static getUpdate(context, entities, io, socket, mibiFirebase) {
        return mibiFirebase.getUpdate(entities.number[0].value).then((data) => {
            return mibiFirebase.getSubscription(data.companyName, data.number).then((data) => {
                let date = new Date();
                let daysLeft = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - date.getDate();
                context.subscription = _.startCase(data.name);
                context.used = data.dataUsed;
                context.total = data.dataTotal;
                context.days = daysLeft;
                context.admin = socket._userInfo.username;

                socket._updateData = entities.number[0].value;

                return context;
            });
        });
    }

    public static orderData(context, entities, io, socket, mibiFirebase){
        let phone = socket._updateData;
        return mibiFirebase.getUpdate(phone).then((data) => {
            return mibiFirebase.getSpecificPath(data.path).then((subscription) => {
                if(entities.data){
                    let info = DataService.mapData(entities.data[0].value);
                    let newData = subscription.dataTotal + info.data;
                    let newPrice = subscription.priceTotal + info.price;

                    let date = new Date();
                    date.setUTCMonth(date.getMonth()+1,1);
                    date.setUTCHours(0,0,0,0)
                    mibiFirebase.addProduct(subscription.companyName, phone, entities.data[0].value, newData, newPrice, date);
                    context.newdata = entities.data[0].value;
                }
                
                mibiFirebase.deleteUpdate(phone);
                return context;
            });
        });
    }

    public static checkForUpdates(context, entities, io, socket, mibiFirebase){
        return mibiFirebase.getUpdates().then((updates) => {
            context.doesntHaveUpdates=true;
            for(let update in updates){
                console.log('checking for updates');
                if(updates[update].companyName === socket._userInfo.company){
                    console.log('Updates!!!');
                    let msg = {
                        text: 'datausage '+updates[update].number,
                        reinit: true,
                        mine: true,
                        hidden: true
                    };
                    io.to(socket.id).emit('message', msg);
                    context.hasUpdate = true;
                    delete context.doesntHaveUpdates;
                    break;
                }
            }
            return context;
        });
    }

    public static getJoke(context, entities) {
        let jokes = [
            'Har du hørt om hønene som hadde så høy feber at det bare kom kokte egg?',
            'Hva får du om du krysser et virus med en klovn? - Syk humor',
            'Jeg synes sauen din løper fort, spesielt med tanke på at den var født lam!',
            'Vet du et ord på tre bokstaver som starter med bensin? - Bil.'
        ];

        let max = jokes.length;
        let jokeNumber = Math.floor(Math.random() * (max));

        console.log('Telling joke number ' + jokeNumber);

        context.joke = jokes[jokeNumber];
        return context;
    }
}