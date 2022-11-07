export default `
<div class="_centeredMsgLayout__content" bem-element="content">
    {{{caption}}}
    <div>
        <div class="text _centeredMsgLayout__descPhrase" bem-element="descPhrase">{{msg}}</div>
        <div class="text _centeredMsgLayout__awayPhrase" bem-element="awayPhrase">Перейти <a href="{{url}}" class="link">к чатам</a></div>
    </div>
</div>
`.trim();
