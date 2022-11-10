export default `
<div class="_leftcolWindowLayout__wrapper">
    <div class="icontainer icontainer--bg_glass icontainer--dropshadow icontainer--size_big _leftcolWindowLayout__container">
        <div class="icontainer__header icontainer__header--bg_grayLight _leftcolWindowLayout__conrainerHeader"></div>
        {{#with areas}} 
        <div class="icontainer__content _leftcolWindowLayout__content">
            <section class="_leftcolWindowLayout__leftcol">
                {{{leftcol}}}        
            </section>
            <section class="_leftcolWindowLayout__workarea">
                {{{workarea}}}        
            </div>
        </section>
        {{/with}}
        <div class="icontainer__footer icontainer__footer--bg_grayLight _leftcolWindowLayout__conrainerFooter"></div>
    </div>
</div>
`.trim();
