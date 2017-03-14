/**
 *	@fileoverview This module implements the Observer pattern
 *	to support multiple users of the page load completion event.
 *
 *	@version 0.0.5  [27.10.2006]
 *	@version 0.0.6  [3.8.2007]
 */


window.afOnLoad_Listeners = new Array();


/**
 *	Register a request for notification of the page onload event.
 *
 *	@param	{function} a_fListener The caller's event handler
 *
 *	@return	none
 *	@type	void
 */

window.AddOnLoadClient = function(a_fListener) {

	window.afOnLoad_Listeners[window.afOnLoad_Listeners.length] = a_fListener;
}


/**
 *	This must be the only event handler set up to receive direct notification of
 *	the page load completion event. It invokes all of the registered event handlers.
 *
 *	@return	none
 *	@type	void
 */

window.onload = function(e) {

	//window.resizeTo(950, (screen.availHeight - 100));
	//window.moveTo(50, 50);

	for (var nx=0; nx<window.afOnLoad_Listeners.length; nx++) {
		var func = window.afOnLoad_Listeners[nx];
		func.call();
	}
}


/* -+- */


