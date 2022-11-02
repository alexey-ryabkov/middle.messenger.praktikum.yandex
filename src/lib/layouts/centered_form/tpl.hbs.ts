export default `
<div class="icontainer icontainer--bg_glass icontainer--dropshadow icontainer--size_big _centeredFormLayout__content">
    <div class="icontainer__header">{{{caption}}}</div>
    {{#with areas}} 
    <div class="icontainer__content">
        <form action="" class="form _centeredFormLayout__form"> 
        {{{form}}}
        </form>
    </div>
    {{/with}}
</div>    
`.trim();
