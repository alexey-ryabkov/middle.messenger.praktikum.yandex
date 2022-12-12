import Templator from "@core/templator";
import {assert} from "chai";
import ComponentBlock from "./component";

const content = 'some content';

const dummyBlock = new class extends ComponentBlock
    {
        protected _prepareBemParams ()
        {
            return { name: 'dummyBlock' };
        }
        protected get _template () 
        {
            return new Templator( '{{content}}' );
        }    
    }  ({ content });

describe( 'Block', () => 
{
    it ('Expect block content rendered correctly', () =>  
    {
        assert.equal( dummyBlock.element.textContent, content );
    });
    it ('Expect block props are correctly changed by setProps method ', () =>  
    {
        dummyBlock.setProps({ content: 'some another content' });
        assert.notEqual( dummyBlock.element.textContent, content );
    });
});
