export default `
<div class="_errorPageLayout__content {{areas.containerCssClass}}">
    <div class="caption _errorPageLayout__caption">
        <h1 class="caption__headline">{{areas.errorCode}}</h1>
    </div>
    <div>
        <div class="text _errorPageLayout__descPhrase">{{areas.errorDesc}}</div>
        <div class="text _errorPageLayout__awayPhrase">Перейти <a href="{{chatsPageUrl}}" class="link">к чатам</a></div>
    </div>
</div>
`.trim();
