export default `
{{{button}}}
<div class="dropdownMenu__menuBox">                                        
    <nav class="icontainer icontainer--bg_grayLight icontainer--dropshadow icontainer--size_small dropdownMenu__menu">
        <ul class="dropdownMenu__menuOptions icontainer__content">
        {{#each options}}
            {{{this}}}
        {{/each}}     
        </ul>
    </nav>
    <i class="dropdownMenu__indicator"></i>
</div>
`.trim();
