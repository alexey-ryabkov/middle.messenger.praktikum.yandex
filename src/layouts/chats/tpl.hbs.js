export default `
<div class="icontainer icontainer--bg_grayLight icontainer--dropshadow icontainer--size_big _chatsLayout__content {{areas.containerCssClass}}">
    <div class="icontainer__header">
        <h1 class="caption _chatsLayout__caption">
            <span class="caption__headline caption__headline--size_h1">Чаты</span>
        </h1>
    </div>
    <div class="icontainer__content">
    {{{areas.content}}}        
    </div>
</div>
`.trim();