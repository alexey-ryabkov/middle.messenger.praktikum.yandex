export default `
<div class="icontainer__content chat__wrapper">
    {{{avatar}}}
    <div class="chat__header">
        {{{caption}}}
        <div class="chat__datetime">{{datetime}}</div>
    </div>
    {{#if msg}}
    <div class="chat__msg">
        {{#if msgAuthor}}
        <strong class="chat__msgAuthor">{{msgAuthor}}:</strong>
        {{/if}}
        <div class="text chat__msgContent">{{author}}</div>
    </div> 
    {{/if}}
    {{#if newMsgCnt}}
    <span class="badge chat__newMsgCnt">{{newMsgCnt}}</span>
    {{/if}}
</div>                                        
`.trim();
