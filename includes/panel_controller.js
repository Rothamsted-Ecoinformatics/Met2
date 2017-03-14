/**
 *  @fileoverview The class Panel_Controller manages all tabbed panels.
 *
 *	@version 0.1.0  [8.12.2006]
 *	@version 0.1.1  [15.3.2007]
 *	@version 0.1.2  [13.7.2007]
 *	@version 0.1.3  [14.11.2007]
 *	@version 0.1.4  [10.9.2008]
 */


/**
 *	Constructor for the Panel_Controller class.
 *	@class	The class Panel_Controller is both the container and the display
 *	manager for all tabbed panels.
 *
 *	How to recover the controller state after backward navigation to the page ???
 *
 *	@constructor
 *	@param	{string} a_sController_Name A unique application-wide name for the panel controller.
 *
 *	@return	none
 *	@type	void
 */

function Panel_Controller(a_sController_Name)
{
	/**
	 *	The unique application-wide name for the panel controller.
	 *	@type	string
	 */
	this.m_sController_Name = a_sController_Name;

	/**
	 *  The unique ID of the HTML element maintained by the panel controller.
	 *	@type	string
	 */
	this.m_sController_Element = '';		// NOT USED

	/**
	 *	The unique ID of the HTML 'div' element used to force a minimum height
	 *	for the display panel - to synchronise it with the vertical tab panel.
	 *	@type	string
	 */
	this.m_sProp_ID = null;

	/**
	 *	The HTML 'div' element ID for the dedicated message panel.
	 *	@type	string
	 */
	this.m_sMessage_Panel = null;

	/**
	 *	The dedicated panel selection display handler (eg a tab panel).
	 *	@type	object
	 */
	//this.m_rSelection_Display = null;

	/**
	 *	The dedicated message panel HTML 'div' element.
	 *	@type	string
	 */
	//this.m_eMessage_Panel = null;

	/**
	 *	The ID of the current active panel display.
	 *	@type	string
	 */
	this.m_sActive_Display = '';

	/**
	 *	The contained/controlled collection of Panel_Display objects (references) as
	 *	an associative array, indexed by their unique application-wide display names.
	 *	@type	array
	 */
	this.m_arDisplay_List = new Array();

	/**
	 *	Any display-specific support objects required to restore the displayed state
	 *	of the Panel_Display objects. Also as an associative array, indexed by the
	 *	unique application-wide names of the display panels.
	 *	@type	array
	 */
	this.m_arSupport_List = new Array();
}


/**
 *	Installs the HTML elements used by the panel controller.
 *
 *	@param	{string} a_sElement_Name The main/containing HTML element ID used by the panel controller.
 *	@param	{array} a_asElement_List List of structural/template element IDs used by the panel controller.
 *
 *	@return	true if successfully configured, otherwise false.
 *	@type	boolean
 */

Panel_Controller.prototype.set_element_names = function(a_sElement_Name, a_asElement_List)
{
	if (!document.getElementById(a_sElement_Name)) {
		alert("Panel controller '" + this.m_sController_Name + "' element '" + a_sElement_Name + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 2;

	if (!is_array(a_asElement_List)
		|| (a_asElement_List.length != nElement_List_Length)) {
		alert("Bad element list for panel controller '" + this.m_sController_Name + "'.");
		return (false);
	}

	for (var nx=0; nx<nElement_List_Length; nx++) {
		if (!document.getElementById(a_asElement_List[nx])) {
			alert("Panel controller '" + this.m_sController_Name + "' element '" + a_asElement_List[nx] + "' was not found.");
			return (false);
		}
	}

	this.m_sController_Element = a_sElement_Name;
	this.m_sProp_ID = a_asElement_List[0];
	this.m_sMessage_Panel = a_asElement_List[1];
	return (true);
}


/**
 *  Set the selection display used by the controller. This can be any form of
 *	display (eg tabs) that allows users to select the display panel presented.
 *
 *	@param	{object} a_Selection_Display The controller's panel selection display.
 *
 *  @return	none
 *  @type	void
 */

//Panel_Controller.prototype.set_selection_display = function(a_Selection_Display) {
//	this.m_rSelection_Display = a_Selection_Display;
//}


/**
 *  Set the minimum height for the display panel.
 *	This synchronises its display with the number of tabs displayed.
 *
 *	@param	{integer} a_nMin_Height Minimum height required, in pixels.
 *
 *  @return	none
 *  @type	void
 */

Panel_Controller.prototype.set_minimum_height = function(a_nMin_Height) {
	var ePanel_Prop = document.getElementById(this.m_sProp_ID);
	if (!ePanel_Prop) {
		alert("Display panel prop '" + this.ePanel_Prop + "' no longer exists.");
		return;
	}

	ePanel_Prop.style.height = a_nMin_Height + 'px';
}


/**
 *	Get the unique app-wide name for the current active display.
 *
 *	@return	The name of the active display, an empty string if unsuccessful.
 *	@type	string
 */

Panel_Controller.prototype.get_active_display_name = function()
{
	if ( (!is_string(this.m_sActive_Display))
		|| (this.m_sActive_Display.length == 0)
		|| (is_undefined(this.m_arDisplay_List[this.m_sActive_Display]))
		|| (is_null(this.m_arDisplay_List[this.m_sActive_Display])) ) {
		return ('');
	}

	return (this.m_sActive_Display);
}


/**
 *	Get the handler for the current active display.
 *
 *	@return	A reference to the handler object, null if unsuccessful.
 *	@type	object
 */

Panel_Controller.prototype.get_active_display = function()
{
	if ( (!is_string(this.m_sActive_Display))
		|| (this.m_sActive_Display.length == 0)
		|| (is_undefined(this.m_arDisplay_List[this.m_sActive_Display]))
		|| (is_null(this.m_arDisplay_List[this.m_sActive_Display])) ) {
		return (null);
	}

	return (this.m_arDisplay_List[this.m_sActive_Display]);
}


/**
 *  Add a new panel to the controller.
 *
 *	@param	{array} a_arObject_Set An array of the objects supporting the new display,
 *          in a standard preset order (the first is always the display panel object).
 *
 *  @return	none
 *  @type	void
 */

Panel_Controller.prototype.add_new_display = function(a_arObject_Set)
{
	if ((is_undefined(this.m_arDisplay_List[a_arObject_Set[0].m_sDisplay_Name]))
		|| (is_null(this.m_arDisplay_List[a_arObject_Set[0].m_sDisplay_Name]))) {
		this.m_arDisplay_List[a_arObject_Set[0].m_sDisplay_Name] = a_arObject_Set[0];
		if (a_arObject_Set.length < 2) {
			this.m_arSupport_List[a_arObject_Set[0].m_sDisplay_Name] = null;
		}
		else {
			this.m_arSupport_List[a_arObject_Set[0].m_sDisplay_Name] = a_arObject_Set[1];
		}
	}
	else {
		alert('Panel controller already has a panel named \'' + a_arObject_Set[0].m_sDisplay_Name + '\'');
	}
}


/**
 *	Remove a panel from the controller.
 *
 *	@param	{string} a_sDisplay_Name The 'application' name of the panel to be removed.
 *
 *  @return	none
 *  @type	void
 */

Panel_Controller.prototype.remove_display = function(a_sDisplay_Name)
{
	if ((a_sDisplay_Name == null)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		return;
	}

	if ((is_undefined(this.m_arDisplay_List[a_sDisplay_Name]))
		|| (is_null(this.m_arDisplay_List[a_sDisplay_Name]))) {
		alert('Panel controller has no panel named \'' + a_sDisplay_Name + '\'.');
		return;
	}

	(this.m_arDisplay_List[a_sDisplay_Name]).remove_display();
	this.m_arDisplay_List[a_sDisplay_Name] = null;
	this.m_arSupport_List[a_sDisplay_Name] = null;

	return;
}


/**
 *	Confirm existence of panel display.
 *
 *	@param	{string} a_sDisplay_Name The 'application' name of the panel to be verified.
 *
 *	@return	true if the named panel exists, otherwise false
 *	@type	boolean
 */

Panel_Controller.prototype.check_display = function(a_sDisplay_Name)
{
	if ((a_sDisplay_Name == null)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		return (false);
	}

	if ((is_undefined(this.m_arDisplay_List[a_sDisplay_Name]))
		|| (is_null(this.m_arDisplay_List[a_sDisplay_Name]))) {
		alert('Unknown panel display \'' + a_sDisplay_Name + '\' selected.');
		return (false);
	}

	return (true);
}


/**
 *	Return the handler for the named panel/display.
 *
 *	@param	{string} a_sDisplay_Name The 'application' name of the panel to be returned.
 *
 *	@return	A reference to the handler object, null if unsuccessful.
 *	@type	object
 */

Panel_Controller.prototype.fetch_display = function(a_sDisplay_Name)
{
	if ((a_sDisplay_Name == null)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		return (null);
	}

	if ((is_undefined(this.m_arDisplay_List[a_sDisplay_Name]))
		|| (is_null(this.m_arDisplay_List[a_sDisplay_Name]))) {
		alert('Unknown panel display \'' + a_sDisplay_Name + '\' requested.');
		return (null);
	}

	return (this.m_arDisplay_List[a_sDisplay_Name]);
}


/**
 *	Switch to a new panel display.
 *
 *	@param	{string} a_sDisplay_Name The 'application' name of the panel to be displayed
 *
 *	@return	none
 *	@type	void
 */

Panel_Controller.prototype.select_new_display = function(a_sDisplay_Name)
{
	if (is_null(a_sDisplay_Name)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		return;
	}

	if ((is_undefined(this.m_arDisplay_List[a_sDisplay_Name]))
		|| (is_null(this.m_arDisplay_List[a_sDisplay_Name]))) {
		alert('Unknown panel display \'' + a_sDisplay_Name + '\' selected.');
		return;
	}

	if (this.m_sActive_Display != a_sDisplay_Name) {
		//alert('Panel controller hiding \'' + this.m_sActive_Display + '\'')
		if (this.m_sActive_Display != '') {
			this.m_arDisplay_List[this.m_sActive_Display].hide_display();
			this.m_sActive_Display = '';
		}

		if (a_sDisplay_Name != '') {
			//this.display_loading_message(true);
			if (!is_null(this.m_arSupport_List[a_sDisplay_Name])) {
				//alert('do_action()');
				this.m_arSupport_List[a_sDisplay_Name].do_action();
			}
			//alert('Panel controller showing \'' + a_sDisplay_Name + '\'')
			this.m_arDisplay_List[a_sDisplay_Name].show_display();
			//this.display_loading_message(false);
		}

		this.m_sActive_Display = a_sDisplay_Name;
	}

//	if (this.m_sActive_Display != a_sDisplay_Name) {
//		//alert('Panel controller hiding \'' + this.m_sActive_Display + '\'')
//		if (this.m_sActive_Display != '') {
//			this.m_arDisplay_List[this.m_sActive_Display].hide_display();
//			this.m_sActive_Display = '';
//		}
//	}

//	if ((this.m_sActive_Display == a_sDisplay_Name)
//		&& (this.m_arDisplay_List[a_sDisplay_Name].is_displayed() == false)) {
//		this.m_sActive_Display = '';
//	}

//	if (a_sDisplay_Name != '') {
//		//this.display_loading_message(true);
//		if (!is_null(this.m_arSupport_List[a_sDisplay_Name])) {
//			//alert('do_action()');
//			this.m_arSupport_List[a_sDisplay_Name].do_action();
//		}
//		//alert('Panel controller showing \'' + a_sDisplay_Name + '\'')
//		this.m_arDisplay_List[a_sDisplay_Name].show_display();
//		//this.display_loading_message(false);
//	}

//	this.m_sActive_Display = a_sDisplay_Name;
}


/**
 *	Determine if the specified panel is the current displayed panel.
 *
 *	@param	{string} a_sDisplay_Name The 'application' name of the panel
 *
 *	@return	True if the panel is the current display. Otherwise false.
 *	@type	boolean
 */

Panel_Controller.prototype.is_display_active = function(a_sDisplay_Name)
{
	if (is_null(a_sDisplay_Name)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		return (false);
	}

	if ((is_undefined(this.m_arDisplay_List[a_sDisplay_Name]))
		|| (is_null(this.m_arDisplay_List[a_sDisplay_Name]))) {
		alert('Unknown panel display \'' + a_sDisplay_Name + '\' queried.');
		return (false);
	}

	// Only process it now if it's the current active display.
	if (this.m_sActive_Display != a_sDisplay_Name) {
		return (false);
	}

	return (true);
}


/**
 *	Refresh an existing panel display.
 *	The panel display will be refreshed immediately only when it's the currently displayed panel.
 *	Otherwise it will be refreshed automatically the next time the user selects it for display.
 *
 *	@param	{string} a_sDisplay_Name The 'application' name of the panel to be displayed
 *
 *	@return	none
 *	@type	void
 */

Panel_Controller.prototype.refresh_display = function(a_sDisplay_Name)
{
	if (is_null(a_sDisplay_Name)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		return;
	}

	if ((is_undefined(this.m_arDisplay_List[a_sDisplay_Name]))
		|| (is_null(this.m_arDisplay_List[a_sDisplay_Name]))) {
		alert('Unknown panel display \'' + a_sDisplay_Name + '\' refresh.');
		return;
	}

	// Only process it now if it's the current active display.
	if (this.m_sActive_Display == a_sDisplay_Name) {
		//alert('Panel controller hiding \'' + this.m_sActive_Display + '\'')
		this.m_arDisplay_List[this.m_sActive_Display].hide_display();
		if (!is_null(this.m_arSupport_List[a_sDisplay_Name])) {
			//alert('do_action()');
			this.m_arSupport_List[a_sDisplay_Name].do_action();
		}
		//alert('Panel controller showing \'' + a_sDisplay_Name + '\'')
		this.m_arDisplay_List[a_sDisplay_Name].show_display();
	}
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Panel_Controller.prototype.print_state = function() {
	var sPanel_List = '';
	var nx = 0;

	for (xx in this.m_arDisplay_List) {
		nx++;
		sPanel_List += '\nPanel ' + nx + '.  --  \'' + xx + '\'\n'
					+ this.m_arDisplay_List[xx].print_state();
	}

	return ('[Panel_Controller]'
			+ '\nDedicated message panel = \'' + this.m_sMessage_Panel + '\''
			+ '\nProp = \'' + this.m_sProp_ID + '\''
			+ '\nActive display = \'' + this.m_sActive_Display + '\''
			+ sPanel_List);
}


/**
 *	Hide all tab panels. Note all tab panels are hidden temporarily (brute force)
 *	when switching the display to a new panel.
 *
 *	@private
 *
 *	@return	none
 *	@type	void
 */

Panel_Controller.prototype.hide_all_panels = function()
{
	for (xx in this.m_aePanel_List) {
		this.m_aePanel_List[xx].style.display = 'none';
	}
}


/**
 *	Display/hide a data-is-loading message.
 *
 *	The message is held in a normally hidden dedicated panel 'div' which
 *	must be identified in the initial call to the constructor.
 *
 *	It is temporarily made visible when switching the display to a new
 *	panel to cover any delay when loading the data from the server for
 *	the newly selected panel.
 *
 *	@private
 *	@param	{boolean} a_bOn True to display the message. False to hide it.
 *
 *	@return	none
 *	@type	void
 */

Panel_Controller.prototype.display_loading_message = function(a_bOn)
{

	var eMessage_Panel = document.getElementById(this.m_sMessage_Panel);
	if (!eMessage_Panel) {
		alert("The panel controller message panel '" + this.m_sMessage_Panel + "' no longer exists.");
		return;
	}

	if (a_bOn == true) {
		this.eMessage_Panel.style.display = '';
	}
	else {
		this.eMessage_Panel.style.display = 'none';
	}
}


/* -+- */


