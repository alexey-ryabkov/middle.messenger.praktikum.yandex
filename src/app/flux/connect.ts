import SurChat from '@app';
import {PlainObject} from '@core/types';
import {StoreEvents} from '@core/store';
import {BlockEvents, BlockProps} from '@core/block';
import ComponentBlock, {ComponentParams} from '@core/block/component';

// TODO мы не можем использовать SurChat в папке lib !!!
// TODO type state2props = (state: AppStoreScheme) => PlainObject;

type state2props = (state: PlainObject) => PlainObject;

type CompConn2storeConstructor< PropsType > = 
	new (
		props? : PropsType, 
		events? : BlockEvents, 
		params? : ComponentParams
	) 
	=> ComponentBlock;

export function storeConnector (mapStateToProps: state2props)
{
	return function (ComponentCls : typeof ComponentBlock)
	{
		return componentConnected2store(ComponentCls, mapStateToProps);
	};
}

// TODO do we need generic here?
export default function componentConnected2store< CompProps extends BlockProps = BlockProps > 
(
	ComponentCls : typeof ComponentBlock, 
	mapStateToProps: state2props							
) 
: CompConn2storeConstructor< CompProps >
{
	const app = SurChat.instance;

	return class extends ComponentCls 
    {
		constructor (
			props? : CompProps, 
			events : BlockEvents = [], 
			params : ComponentParams = {}) 
		{
			// TODO store path as a parameter
			app.store.on(StoreEvents.updated, () => 
            {				
				this.setProps({ ...mapStateToProps( app.storeState ) });
			});
			super( {...props, ...mapStateToProps( app.storeState )}, events, params );
		}
	};
}
