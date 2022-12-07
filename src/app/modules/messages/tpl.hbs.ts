export default `
{{#if messages}}
<ul class="_messages__box">
    <li class="_messages__dayGroup">
        <!--<div class="_messages__day">{{messagesDay}}</div>-->    
        <ul class="_messages__list">
            {{#each msgGroups}}
                {{{this}}}
            {{/each}}
        </ul>
    </li>
</ul>   
{{else}}
<div class="_messages__box">    
    <div class="text _messages__emptyMsg">
    {{#if noActiveChat}}
    Выберите чат, чтобы отправить сообщение.
    {{else}}
    Отправьте сообщение, используя поле внизу. Оно станет первым в этом чате!
    {{/if}} 
    </div>
</div>
{{/if}} 
{{{loader}}}
<div class="_messages__sendMessage _sendMessage">
    {{{inputSend}}}
    {{{buttonSend}}}
    {{{buttonAttach}}}
</div> 
`.trim();
