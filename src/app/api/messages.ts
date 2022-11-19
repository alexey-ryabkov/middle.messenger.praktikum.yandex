import EventBus from "@models/event_bus";

const API_HOST = 'wss://ya-praktikum.tech';
const API_BASE_URL = `${API_HOST}/ws/chats`;

/* {
    image : string,
    name : string,
    isOpened : boolean,
    datetime? : string,
    msg? : string,
    author : 'you' | null,
    tag? : string,
    newMsgCnt? : number
}; */

/* {
    msg : string,
    datetime : string,    
    of : 'you' | 'chat',
    type? : MessageTypes,
}; */

type MessageFile = {
    id : number,
    user_id : number,
    path : string,
    filename : string,
    content_type : string,
    content_size : number,
    upload_date : string,
};

type MessageType = 'message' | 'file' | 'sticker';
type Message = 
{
    id : number,
    userId : number,
    datetime : Date,
    type: MessageType,
    content : string,   
    file? : MessageFile | null,      
}; 
type HistoryMessage = Message &
{
    chatId : number,
    isRead: boolean,
};

export interface MsgApi extends EventBus
{
    send (content : string, type : MessageType) : Promise< void >;
    getHistory (offset : number) : Promise< HistoryMessage[] >;
}

export enum MsgApiEvents {
    opened = 'opened',
    userConnected = 'userConnected',
    message = 'message',
    history = 'history',
    // msgError = 'msgError',
    closed = 'closed',
    error = 'error',
}
// MsgWsApi
export default class MessagesApi extends EventBus implements MsgApi
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
            let resolver : (history : HistoryMessage[]) => void;
            let rejecter : (error : string) => void;

            const history = new Promise< HistoryMessage[] >((resolve, reject) => 
            {
                this._socket.send(JSON.stringify(
                {
                    content: `${offset}`,
                    type: 'get old',
                }));                
                resolver = resolve;
                rejecter = reject;
            });
            
            const historyHandler = (history : HistoryMessage[]) =>
            {
                resolver(history);
            };
            this.oneTime(MsgApiEvents.history, historyHandler);

            setTimeout(() => 
            {
                rejecter('get-history timeout');
                this.off(MsgApiEvents.history, historyHandler);
            }, 
            MessagesApi.AWAIT_WS_RESULT_TIME);

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
            this._socket.close(MessagesApi.MANUALLY_CLOSE_CODE, 'manually closed');
        }
    }    
    protected _setupEvents ()
    {
        this._socket.addEventListener('open', () => 
        {
            this.emit(MsgApiEvents.opened);
        }); 
        this._socket.addEventListener('message', event => 
        {
            try 
            {
                const data = JSON.parse(event.data);

                console.log('message', data); // 

                if (Array.isArray(data))
                {
                    const messages : HistoryMessage[] = [];

                    data.forEach( dataItem => messages.push( MessagesApi._processHistoryMessage(dataItem) as HistoryMessage ));

                    this.emit(MsgApiEvents.history, messages);
                }
                else
                    switch (data.type)
                    {
                        case 'user connected':
                            this.emit(MsgApiEvents.userConnected, {userId: +data.content});    
                            break;

                        case 'message':
                        case 'file':
                        case 'sticker':
                            // console.log(data);
                            this.emit( MsgApiEvents.message, MessagesApi._processMessage(data) as Message );                          
                            break;

                        case 'error':
                            this.emit(MsgApiEvents.error, data.content);
                            break;

                        case 'pong':
                            // do nothing 
                            break;

                        default:
                            console.log('Unknown type data', data);
                            break;
                    }
            } catch {
                this.emit(MsgApiEvents.error, 'bad json message recieved');
            }
        });  
        this._socket.addEventListener('close', event => 
        {
            if (!event.wasClean) 
            {
                console.warn(`Disconnected. Code: ${event.code}, reason: ${event.reason}. Restart in ${MessagesApi.RECONNECT_DELAY}ms`);
                this._restartTimer = window.setTimeout(() => this.open(), MessagesApi.RECONNECT_DELAY);
            } 
            else
            {
                console.log('closed', event); // 
                this.emit(MsgApiEvents.closed);
            }
        });
        this._socket.addEventListener('error', error => 
        {
            console.log('error', error); // 
            this.emit(MsgApiEvents.error, error);
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
            MessagesApi.PING_DELAY);
        }
    }
    protected static _processMessage (data : any)
    {
        const {user_id: userId, time, ...messageData} = data;
        const datetime = new Date(time);

        return {...messageData, userId, datetime};
    }
    protected static _processHistoryMessage (data : any)
    {
        const {chat_id: chatId, is_read: isRead, ...messageData} = MessagesApi._processMessage(data);

        return {...messageData, chatId, isRead};
    }
}
window.messagesApi = MessagesApi;


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
