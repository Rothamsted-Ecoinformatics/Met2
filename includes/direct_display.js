/**
 *  @fileoverview The class Direct_Display is the display handler for direct displays.
 *
 *	@version 0.0.3  [10.8.2006]
 */


/**
 *	Constructor for the Direct_Display class.
 *	@class	The class Direct_Display provides support for the display/re-display
 *	operations for all non-structured displays that can be simply switched on or
 *	off. There are no internal operations that re-process or re-configure the
 *	display content when it is re-displayed. This class requires the existence
 *	of appropriate event handlers in a lower-level service layer. These event
 *	handlers must identify and activate appropriate object methods in response
 *	to user activity. They are:
 *
 *	@constructor
 *	@param	{string} a_sDisplay_Name A unique application-wide name for the display.
 *
 *	@return	none
 *	@type	void
 */

function Direct_Display(a_sDisplay_Name)
{
	/**
	 *  A unique application-wide name for the panel display
	 *	@type	string
	 */
	this.m_sDisplay_Name = a_sDisplay_Name;

	/**
	 *  The unique ID of the HTML element that contains this display panel.
	 *	@type	string
	 */
	this.m_sPanel_Element = '';
}


/**
 *	Installs the HTML elements used by this display.
 *
 *	@param	{string} a_sPanel_Element List holding the HTML element ID used by the display panel.
 *	@param	{array} a_asElement_List List of structural/template element IDs used by the display panel.
 *
 *	@return	true if successfully configured, otherwise false.
 *	@type	boolean
 */

Direct_Display.prototype.set_element_names = function(a_sPanel_Element, a_asElement_List)
{
	if (!document.getElementById(a_sPanel_Element)) {
		alert("Display '" + this.m_sDisplay_Name + "' panel element '" + a_sPanel_Element + "' was not found.");
		return (false);
	}

	this.m_sPanel_Element = a_sPanel_Element;

	// Ignore the element list.

	return (true);
}


/**
 *	Hide the display.
 *
 *	@return	none
 *	@type	void
 */

Direct_Display.prototype.hide_display = function()
{
	//alert('Hiding \'' + this.m_sDisplay_Name + '\'');

	var eDisplay_Element = document.getElementById(this.m_sPanel_Element);
	if (!eDisplay_Element) {
		alert("Display panel element '" + this.m_sPanel_Element + "' no longer exists.");
		return;
	}

	eDisplay_Element.className = 'hidden';
}


/**
 *	Show the display.
 *
 *	@return	none
 *	@type	void
 */

Direct_Display.prototype.show_display = function()
{
	//alert('Showing \'' + this.m_sDisplay_Name + '\'');

	var eDisplay_Element = document.getElementById(this.m_sPanel_Element);
	if (!eDisplay_Element) {
		alert("Display panel element '" + this.m_sPanel_Element + "' no longer exists.");
		return;
	}

	eDisplay_Element.className = '';
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Direct_Display.prototype.print_state = function() {
	return ('[Direct_Display]'
            + '\nDisplay name = \'' + this.m_sDisplay_Name + '\''
            + '\nPanel element = \'' + this.m_sPanel_Element + '\'');
}


/**
 *	Display/hide a data-is-loading message.
 *
 *	The message is held in a normally hidden area of the panel 'div'. The ID
 *	can always be constructed by appending the template name with '_message'.
 *	During the process of data downloading the message display is toggled
 *	the download display area - whose name can always be constructed by
 *	appending the template name with '_display'.
 *
 *	(Note: Because the layout template ID must be unique then both the
 *	message area ID and the data display area ID will also be unique.)
 *
 *	@private
 *	@param	{boolean} a_bOn True to display the message and hide the data
 *							display area. False to restore the data display.
 *
 *	@return	none
 *	@type	void
 */
/*
Panel_Controller.prototype.display_loading_message = function(a_bOn)
{
	var eMessage_Area = document.getElementById(this.m_sPanel_Template + '_message');
	if (!eMessage_Area) {
		alert("Display template '" + this.m_sPanel_Template + "' has no message area.");
		return;
	}

	var eDisplay_Area = document.getElementById(this.m_sPanel_Template + '_display');
	if (!eMessage_Area) {
		alert("Display template '" + this.m_sPanel_Template + "' has no data display area.");
		return;
	}

	if (a_bOn == true) {
		this.eDisplay_Area.style.display = 'none';
		this.eMessage_Area.style.display = '';
	}
	else {
		this.eMessage_Area.style.display = 'none';
		this.eDisplay_Area.style.display = '';
	}
}
*/

/* -+- */


