import {CompilableTemplate} from '@models/types';
import DomComponent, {ComponentPropsEngine} from '@models/dom_component';

export default class SimpleProps implements ComponentPropsEngine
{
    protected _propsSubComponents : Record< string, DomComponent > = {};
    
    constructor (protected _component : DomComponent) 
    {}
    get component () 
    {
        return this._component;
    }
    get propsSubComponents () 
    {
        return this._propsSubComponents;
    }
    protected get _props () 
    {
        return Object.assign({}, this._component.props); //{...this._component.props};
    }
    processProps () : void
    {
        // console.log(this._props);
        
        Object.entries(this._props).forEach(([prop, value]) => 
        {
            if (value instanceof DomComponent) 
            {
                this._propsSubComponents[prop] = value;
            }
        });
    }
    compileWithProps (template : CompilableTemplate) : DocumentFragment
    {   
        // console.log(this._propsSubComponents); // , template
        // console.log(this._props);

        const propsAndStubs : Record< string, any > = {};

        Object.entries(this._props).forEach(([prop, value]) => 
        {
            propsAndStubs[prop] = prop in this._propsSubComponents
                                    ? `<div ${DomComponent.ID_ATTR}="${this._propsSubComponents[prop].id}"></div>` // stub 
                                    : value;
        });
        console.log(this._propsSubComponents);
        console.log(propsAndStubs);
        // debugger; 

        const fragment = document.createElement('template');
        fragment.innerHTML = template.compile(propsAndStubs); 

        // console.log(fragment.innerHTML);

        Object.values(this._propsSubComponents).forEach(child => 
        {
            fragment.content.querySelector(`[${DomComponent.ID_ATTR}="${child.id}"]`).replaceWith(child.content);
        });
        return fragment.content; 
    }
}
// protected _processProps (props : CompProps)
// {
//     const processed = {};

//     /*
//     TODO здесь не нужно ничего process, нужнопросто найти все чилдрены, не удаляя их из пропсов 
//     чтобы задиспачить о маунте этогохватит
//     если нужно дать вовне доступ для настройки пропсов, то
//     можно фильтровать дерево оставляя только компоненты (отдавать sub-? components)

//     если мы передали компонет, то он уже с заданными пропсами. 
//     потом если мы настраиваем пропсы, то по этому пути можем передавтать объект настроек.
//     если передается другой компонент или примитив, то оно заменит собой компонент в шаблоне  

//     если пропсы дочернего элемента не поменялись, то по идее его не нужно рендерить... хранить кеш рендеров? 

//     менять events ? для childs? другие параметры для childs? 

//     */

//     Object.entries(props).forEach((value, name) => 
//     {
//         if (value instanceof DomComponent) 
//         {
//             // children[name] = value; TODO по идее просто созранять ссылку.. но тогда мы в рекурсии должны сохранить объект. можно через Map ? 
//         } 
//         else if (value instanceof Array)
//         {
//             processed[name] = []
//             value.forEach((val, key) => 
//             {
//                 if (val instanceof DomComponent)
//                 {
//                     // TODO 
//                 }
//                 else if ('object' == typeof val)
//                 {
//                     val = this._processProps(val);
//                 }                    
//                 processed[name][key] = val;
//             });
//         }
//         else if ('object' == typeof value)
//         {
//             processed[name] = this._processProps(value);
//         }
//         else
//         {
//             processed[name] = value;
//         }
//     });
//     return processed;
// }
