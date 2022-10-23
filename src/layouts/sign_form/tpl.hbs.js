export default `
<div class="icontainer icontainer--bg_glass icontainer--dropshadow icontainer--size_big _signFormLayout__content {{areas.containerCssClass}}">
    <div class="icontainer__header">  
    {{#with areas}}      
    {{> caption tag="h1" caption=formTitle cssClass="_signFormLayout__caption" headlineCssClass="caption__headline--size_h1"}}
    {{/with}}
    </div>
    <div class="icontainer__content">
        <form action="" class="form _signFormLayout__form"> 
        {{{areas.form}}}
        </form>
    </div>
</div>    
`.trim();
//  <h1 class="caption _signFormLayout__caption">
// <span class="caption__headline caption__headline--size_h1">{{areas.formTitle}}</span>
// </h1>
// areas.formTitle
