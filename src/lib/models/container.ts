import {BemCompParams} from '@models/bem_block';
import {CompilableTemplate} from '@models/types';
import SimpleBlock from '@models/simple_block';
// import mount from '../utils/mount';

// TODO по умолчанию ставить какой-то контейнер... 

export default class Container
{
    protected _view : SimpleBlock;
    
    constructor (template : CompilableTemplate, params : BemCompParams) 
    {   
        this._view = new (class extends SimpleBlock
                    {
                        _template = template;
                        // componentDidUpdate = () => false;

                    }) (params);
    }
    get view ()
    {
        return this._view;
    }
    // static createAndMount (template, params, node)
    // {
    //     // mount(new this(template, params).compile(), node);
    //     // container.dispatchComponentDidMount();
    //     // return container;
    // }
    // TODO чтоб это был синтаксический сахар для одноразовых простых контейнерных блоков. типа создал и замаунтил сразу куда-то. больше он нам вообще не нужен
    // примитивный блок - тоже сахар. тот у которого нет никакой логики при рендеринге, по сути весь компонент - это шаблон
}
