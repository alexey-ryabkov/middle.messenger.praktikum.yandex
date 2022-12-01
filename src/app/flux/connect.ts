import SurChat from '@app';
import {PlainObject} from '@core/types';
import Store, {StoreEvents} from '@core/store';
import {BlockEvents, BlockProps} from '@core/block';
import {AppStoreScheme} from '@models/types';
import ComponentBlock, {ComponentParams} from '@core/block/component';
import { isEqual } from '@lib-utils-kit';

type state2props = (state : AppStoreScheme) => PlainObject;

type CompConn2storeConstructor< PropsType > = 
	new (
		props? : PropsType, 
		events? : BlockEvents, 
		params? : ComponentParams
	) 
	=> ComponentBlock;

export default function componentConnected2store< CompProps extends BlockProps = BlockProps > 
(
	ComponentCls : typeof ComponentBlock, 
	mapStateToProps : state2props,
	trackStorePath? : string
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
			let compState = mapStateToProps( app.storeState );

			app.store.on(trackStorePath ? Store.getEventName4path(trackStorePath) : StoreEvents.updated, () => 
            {				
				const compNextState = mapStateToProps( app.storeState );
				
				if (!isEqual(compState, compNextState))
				{
					this.setProps({ ...compNextState });

					compState = compNextState;
				}
			});
			
			super( {...props, ...compState}, events, params );
		}
	};
}
export function storeConnector (mapStateToProps : state2props, trackStorePath? : string)
{
	return function (ComponentCls : typeof ComponentBlock)
	{
		return componentConnected2store(ComponentCls, mapStateToProps, trackStorePath);
	};
}
