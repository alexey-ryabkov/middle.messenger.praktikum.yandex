import SurChat from '@app';
import {PlainObject} from '@core/types';
import {StoreEvents} from '@core/flux/store';
import {BlockEvents, BlockProps} from '@core/block';
import ComponentBlock, {ComponentParams} from '@core/block/component';

type state2props = (state: PlainObject) => PlainObject;

type CompConn2storeConstructor< PropsType > = new (
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
// TODO store path as a parameter
// TODO do we need generic here?
export default function componentConnected2store< CompProps extends BlockProps = BlockProps > 
						(
							ComponentCls : typeof ComponentBlock, 
							mapStateToProps: state2props							
						) 
						: CompConn2storeConstructor< CompProps >
{
	const store = SurChat.instance.store;

	return class extends ComponentCls 
    {
		constructor (
			props? : CompProps, 
			events : BlockEvents = [], 
			params : ComponentParams = {}) 
		{
			store.on(StoreEvents.updated, () => 
            {
				this.setProps({ ...mapStateToProps( store.state ) });
			});
			super( {...props, ...mapStateToProps( store.state )}, events, params );
		}
	};
}
