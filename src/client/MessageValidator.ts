export class MessageValidator{

    public static initiationMessage(msg):boolean{
        if(msg && msg.text && msg.text.toLowerCase() === 'har du noen oppdateringer for meg?'){
            return true
        }
        return false;
    }
}