/**
 *	@fileoverview This module allows users to cancel page unloads.
 *
 *	@version 0.0.2  [1.10.2006]
 */


/**
 *	This is a temporary event handler set up to receive notification
 *	that a page unload is about to occur ie that we're about to navigate
 *	away from this page. Warn the user why they may wish to cancel the
 *	navigation and give them a chance to cancel it and stay on this page.
 *
 *  Note the onunload event occurs too late plus it cannot be cancelled.
 *
 *	@return	none
 *	@type	void
 */

window.onbeforeunload = function(e) {
	return (	 'The state of this page cannot be saved.\n'
			+ 'If this is not OK then click the Cancel button and use another browser window\nfor the new page. '
			+ 'Otherwise click the OK button to continue to the new page.');
}


/* -+- */


