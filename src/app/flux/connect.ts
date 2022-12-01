import SurChat from '@app';
import {PlainObject, SingleOrPlural} from '@core/types';
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
	trackStorePath? : SingleOrPlural< string >
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

			let trackStoreEvents : string[] | null = null;
			if (trackStorePath)
			{
				const trackStorePathes = typeof trackStorePath == 'string' 
											? [trackStorePath] 
											: Array.from(trackStorePath);
				
				trackStoreEvents = trackStorePathes.map(path => Store.getEventName4path(path))
			}			

			app.store.on(
				trackStoreEvents ? trackStoreEvents : StoreEvents.updated, 
				() => {				
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
export function storeConnector (mapStateToProps : state2props, trackStorePathes? : SingleOrPlural< string >)
{
	return function (ComponentCls : typeof ComponentBlock)
	{
		return componentConnected2store(ComponentCls, mapStateToProps, trackStorePathes);
	};
}
