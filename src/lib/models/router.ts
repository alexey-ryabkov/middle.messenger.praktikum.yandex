// import Block from "@models/block";
import {Routable, Nullable} from "@models/types";

export default class Router 
{
    protected _history : History;
    protected _routes : Set< Routable >;
    protected _currentRoute : Nullable< Routable >;

    constructor () 
    {
        this._history = window.history;
        this._routes = new Set();
        this._currentRoute = null;
    }
    get routes ()
    {
        return this._routes;
    }
    get currentRoute ()
    {
        return this._currentRoute;
    }
    getRoute (pathname : string) 
    {
        return [...this.routes].find(route => route.isPathnameMatch(pathname));
    }
    use (route : Routable) 
    {
        this._routes.add(route);
        return this;
    }
    start () 
    {
        window.onpopstate = ( (event : PopStateEvent) => this._onRoute(event.state.url) ).bind(this);

        const d = this._onRoute(location.pathname);

        console.log(d, location.pathname);

        return d;
    }    
    go (pathname: string, state : object = {}) 
    {
        const route = this._onRoute(pathname);

        if (route)
        {
            this._history.pushState(state, route.title, pathname);
        }
        return route;
    }
    back () 
    {
      this._history.back();
    }
    forward() 
    {
      this._history.forward();
    }    
    protected _onRoute (pathname : string) 
    {
        const route = this.getRoute(pathname);

        if (!route) 
        {
            return null;
        }
        if (this._currentRoute) 
        {
            this._currentRoute.unmount();
        }
        return (this._currentRoute = route).mount();
    }
}
