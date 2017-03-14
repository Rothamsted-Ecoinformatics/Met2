/**
 *  @fileoverview The class Datamsg_Display manages a single message panel.
 *
 *	@version 0.0.3  [13.11.2007]
 */


/**
 *	Constructor for the Datamsg_Display class.
 *	@class	The class Datamsg_Display provides support for the display/re-display
 *	operations for a single variable text message and, optionally, a retry button.
 *
 *	(Note: the identity of the display section this class supports is pre-defined
 *	within the parent/containing controller display class).
 *
 *	@constructor
 *	@param	{string} a_sSection_Name The controller's preset name for this display section.
 *	@param	{object} a_rSection_Parent A reference to the parent controlling display object.
 *
 *	@return	none
 *	@type	void
 */

function Datamsg_Display(a_sSection_Name, a_rSection_Parent)
{
	/**
	 *	The (expected) name for this display.
	 *	@type	string
	 */
	this.m_sDisplay_Name = a_sSection_Name;

	/**
	 *	A reference to the parent/containing display.
	 *	@type	object
	 */
	this.m_rParent_Controller = a_rSection_Parent;

	/**
	 *	The unique ID of the containing HTML section element.
	 *	@type	string
	 */
	this.m_sSection_Element = '';

	/**
	*	The unique ID of the HTML 'span' element used as the container for the display message.
	*	@type	string
	 */
	this.m_sMessage_Element = '';

	/**
	 *	Set to True when the retry button is in use.
	 *	@type	boolean
	 */
	this.m_bRetry_Active = false;

	/**
	 *	The current text for the display message.
	 *	@type	string
	 */
	this.m_sMessage_Text = '';
}


/**
 *	Installs the HTML elements used by this display.
 *
 *	@param	{string} a_sSection_Element The unique ID of the HTML 'unordered-list' element for the tabs.
 *	@param	{array} a_asElement_List List of structural/template element IDs used by the display section.
 *
 *	@return	true if successfully configured, otherwise false.
 *	@type	boolean
 */

Datamsg_Display.prototype.set_element_names = function(a_sSection_Element, a_asElement_List)
{
	var nx = 0;

	if (!document.getElementById(a_sSection_Element)) {
		alert("Display section '" + this.m_sDisplay_Name + "' element '" + a_sSection_Element + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 1;

	if (!is_array(a_asElement_List)
		|| (a_asElement_List.length != nElement_List_Length)) {
		alert("Bad element list for display section '" + this.m_sDisplay_Name + "'.");
		return (false);
	}

	for (nx=0; nx<nElement_List_Length; nx++) {
		if (!document.getElementById(a_asElement_List[nx])) {
			alert("Display section '" + this.m_sDisplay_Name + "' element '" + a_asElement_List[nx] + "' was not found.");
			return (false);
		}
	}

	this.m_sSection_Element = a_sSection_Element;
	this.m_sMessage_Element = a_asElement_List[0];

	return (true);
}


/**
 *	Set to display only a text message.
 *
 *	@param	{string} a_sMessage_Text The text to display.
 *
 *	@return	none
 *	@type	void
 */

Datamsg_Display.prototype.set_message = function(a_sMessage_Text)
{
	this.m_bRetry_Active = false;
	this.m_sMessage_Text = a_sMessage_Text;
	this.update_when_active();
}


/**
 *	Set to display a text message with a retry button.
 *
 *	@param	{string} a_sMessage_Text The text to display.
 *
 *	@return	none
 *	@type	void
 */

Datamsg_Display.prototype.set_retry_message = function(a_sMessage_Text)
{
	this.m_bRetry_Active = true;
	this.m_sMessage_Text = a_sMessage_Text;
	this.update_when_active();
}


/**
 *	Clear the message panel.
 *
 *	@return	none
 *	@type	void
 */

Datamsg_Display.prototype.clear_panel = function()
{
	this.m_bRetry_Active = false;
	this.m_sMessage_Text = '';
	this.update_when_active();
}


/**
 *	Hide the display.
 *
 *	@return	none
 *	@type	void
 */

Datamsg_Display.prototype.hide_display = function()
{
	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
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

Datamsg_Display.prototype.show_display = function()
{
	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}

	var eMessage_Container = document.getElementById(this.m_sMessage_Element);
	if (!eMessage_Container) {
		alert("Message display element '" + this.m_sMessage_Element + "' no longer exists.");
		return;
	}

	if ((eMessage_Container.nodeName.toLowerCase() == 'span')
		&& (eMessage_Container.childNodes.length == 1)
		&& (eMessage_Container.firstChild.nodeType == 3)) {
        eMessage_Container.firstChild.nodeValue = ((this.m_sMessage_Text.length > 0) ? this.m_sMessage_Text : ' ');
	}

	eDisplay_Element.className = '';
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Datamsg_Display.prototype.print_state = function() 
{
	return ('[Datamsg_Display]'
            + '\nDisplay name = \'' + this.m_sDisplay_Name + '\''
            + '\nSection element = \'' + this.m_sSection_Element + '\'');
}


/**
 *	Force a screen update if this is part of the active displaying panel.
 *
 *	@private
 *
 *	@return	none
 *	@type	void
 */

Datamsg_Display.prototype.update_when_active = function()
{
	if ((this.m_rParent_Controller).is_displaying_now()) {
		this.show_display();
	}
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
Datamsg_Display.prototype.display_loading_message = function(a_bOn)
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


