import EventBus from "@core/event_bus";
import { ChatMessage, Message, MessageType, MessengerApi, MessengerEvents } from "@models/types";

const API_HOST = 'wss://ya-praktikum.tech';
const API_BASE_URL = `${API_HOST}/ws/chats`;

export default class Messenger extends EventBus implements MessengerApi
{
    protected static readonly MANUALLY_CLOSE_CODE = 1000;    
    protected static readonly AWAIT_WS_RESULT_TIME = 3000;
    protected static readonly RECONNECT_DELAY = 1000;
    protected static readonly PING_DELAY = 20000;
    
    protected _socket : WebSocket;
    protected _restartTimer : number; 
    protected _pingTimer : number; 

    constructor (
        protected _userId : number, 
        protected _chatId : number, 
        protected _token : string)
    {
        super();
        this.open();     
    }
    get state ()
    {
        return this._socket.readyState;
    }
    get isOpened () 
    {
        return this._socket && this.state === WebSocket.OPEN;
    }
    open ()
    {
        if (!this._socket || [WebSocket.CLOSED, WebSocket.CLOSING].includes(this.state)) 
        {
            this._socket = new WebSocket(`${API_BASE_URL}/${this._userId}/${this._chatId}/${this._token}`);

            this._setupEvents();
            this._ping();
        }
    }
    send (content : string, type : MessageType = 'message')
    {
        if (this.isOpened) 
        {
            this._socket.send( JSON.stringify({ content, type }) );
        }
        return Promise.resolve();
    }
    getHistory (offset = 0)
    {
        if (this.isOpened) 
        {   
            let resolver : (history : ChatMessage[]) => void;
            let rejecter : (error : string) => void;

            const history = new Promise< ChatMessage[] >((resolve, reject) => 
            {
                this._socket.send(JSON.stringify(
                {
                    content: `${offset}`,
                    type: 'get old',
                }));                
                resolver = resolve;
                rejecter = reject;
            });
            
            const historyHandler = (history : ChatMessage[]) =>
            {
                resolver(history);
            };
            this.oneTime(MessengerEvents.history, historyHandler);

            setTimeout(() => 
            {
                rejecter('get-history timeout');
                this.off(MessengerEvents.history, historyHandler);
            }, 
            Messenger.AWAIT_WS_RESULT_TIME);

            return history;
        }
        else
            return Promise.reject('no active socket for get-history');
    }
    close ()
    {
        clearTimeout(this._restartTimer);
        clearTimeout(this._pingTimer);

        if (this.isOpened) 
        {
            this._socket.close(Messenger.MANUALLY_CLOSE_CODE, 'manually closed');
        }
    }    
    protected _setupEvents ()
    {
        this._socket.addEventListener('open', () => 
        {
            this.emit(MessengerEvents.opened);
        }); 
        this._socket.addEventListener('message', event => 
        {
            try 
            {
                const data = JSON.parse(event.data);

                console.log('message', data); // 

                if (Array.isArray(data))
                {
                    const messages : ChatMessage[] = [];

                    data.forEach( dataItem => messages.push( Messenger._processChatMessage(dataItem) ));

                    this.emit(MessengerEvents.history, messages);
                }
                else
                    switch (data.type)
                    {
                        case 'user connected':
                            this.emit(MessengerEvents.userConnected, {userId: +data.content});    
                            break;

                        case 'message':
                        case 'file':
                        case 'sticker':
                            // console.log(data);
                            this.emit( MessengerEvents.message, Messenger.processMessage(data) );                          
                            break;

                        case 'error':
                            this.emit(MessengerEvents.error, data.content);
                            break;

                        case 'pong':
                            // do nothing 
                            break;

                        default:
                            console.log('Unknown type data', data);
                            break;
                    }
            } catch {
                this.emit(MessengerEvents.error, 'bad json message recieved');
            }
        });  
        this._socket.addEventListener('close', event => 
        {
            if (!event.wasClean) 
            {
                console.warn(`Disconnected. Code: ${event.code}, reason: ${event.reason}. Restart in ${Messenger.RECONNECT_DELAY}ms`);
                this._restartTimer = window.setTimeout(() => this.open(), Messenger.RECONNECT_DELAY);
            } 
            else
            {
                console.log('closed', event); // 
                this.emit(MessengerEvents.closed);
            }
        });
        this._socket.addEventListener('error', error => 
        {
            console.log('error', error); // 
            this.emit(MessengerEvents.error, error);
        });
    }
    protected _ping ()
    {
        if (this._socket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(this.state)) 
        {
            this._pingTimer = window.setTimeout(() => 
            {
                this._socket.send(JSON.stringify({
                    type: 'ping'
                }));
                this._ping();
            }, 
            Messenger.PING_DELAY);
        }
    }
    static processMessage (data : any)
    {
        const {user_id: userId, time, ...messageData} = data;
        const datetime = new Date(time);

        return {...messageData, userId, datetime} as Message;
    }
    protected static _processChatMessage (data : any)
    {
        const {chat_id: chatId, is_read: isRead, ...messageData} = data;

        return {...Messenger.processMessage(messageData), chatId, isRead} as ChatMessage;
    }
}
window.messagesApi = Messenger;


// Promise ((resolve, reject)
// {
//     MessagesApi.send();
//     MessagesApi
//         .on('message', ()
//         {
//             // проверяем соответствие контента 
//             // и тогда ресолвим как отправленное
//         })
//         .on('msgError', ()
//         {
//             // если приходит такая отбивка и сообщение не приходит как доставленное
//         })
// })
