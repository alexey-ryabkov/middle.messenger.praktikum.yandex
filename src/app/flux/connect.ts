import SurChat from '@app';
import {SingleOrPlural} from '@core/types';
import Store, {StoreEvents} from '@core/store';
import {BlockEvents, BlockProps} from '@core/block';
import {AppStoreScheme} from '@entities/types';
import ComponentBlock, {ComponentParams} from '@core/block/component';
import {isEqual} from '@lib-utils-kit';

type state2props< PropsType > = (state : AppStoreScheme) => Partial< PropsType >;

type CompConn2storeConstructor< PropsType > = 
	new (
		props? : PropsType | null, 
		events? : BlockEvents, 
		params? : ComponentParams
	) 
	=> ComponentBlock;

export default function componentConnected2store< CompProps extends BlockProps = BlockProps > 
	(
		ComponentCls : typeof ComponentBlock, 
		mapStateToProps : state2props< CompProps >,
		trackStorePath? : SingleOrPlural< string >
	) 
	: CompConn2storeConstructor< CompProps >
{
	const app = SurChat.instance;

	return class extends ComponentCls 
    {
		constructor (
			props? : CompProps | null, 
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

					console.log(`componentConnector store.on fired`, trackStoreEvents ? trackStoreEvents : StoreEvents.updated, compNextState);
					
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
export function storeConnector< CompProps extends BlockProps = BlockProps > 
(
	mapStateToProps : state2props< CompProps >, 
	trackStorePathes? : SingleOrPlural< string >
) {
	return function (ComponentCls : typeof ComponentBlock)
	{
		return componentConnected2store< CompProps >(ComponentCls, mapStateToProps, trackStorePathes);
	};
}
