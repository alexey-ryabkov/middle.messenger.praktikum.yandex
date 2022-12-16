export default `
<div class="icontainer icontainer--bg_grayLight icontainer--dropshadow icontainer--size_big _articleLayout__content">
    <div class="icontainer__header _articleLayout__header">{{{caption}}}</div>
    {{#with areas}} 
    <div class="icontainer__content">
        {{{article}}}        
    </div>
    {{/with}}
</div>    
`.trim();
