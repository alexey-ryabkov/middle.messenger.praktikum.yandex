export default `
<div class="icontainer__content chat__wrapper">
    {{{avatar}}}
    <div class="chat__header">
        {{{caption}}}
        <div class="chat__datetime">{{datetime}}</div>
    </div>
    <div class="chat__msg">
        <div class="text chat__msgContent">{{msg}}</div>
    </div> 
</div>                                        
`.trim();
