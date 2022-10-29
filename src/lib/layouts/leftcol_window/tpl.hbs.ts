export default `
<div class="icontainer icontainer--bg_grayLight icontainer--dropshadow icontainer--size_big _leftcolWindowLayout__content">
    <div class="icontainer__header">
        <h1 class="caption _leftcolWindowLayout__caption">
            <span class="caption__headline caption__headline--size_h1">Чаты</span>
        </h1>
    </div>
    {{#with areas}} 
    <div class="icontainer__content" style="display: flex; flex-direction: row;">
        <div style="width: 30%">
            {{{leftcol}}}        
        </div>
        <div style="width: 70%">
            {{{workarea}}}        
        </div>
    </div>
    {{/with}}
</div>
`.trim();
