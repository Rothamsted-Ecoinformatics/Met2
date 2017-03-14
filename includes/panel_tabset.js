/**
 *  @fileoverview The class Panel_Tabset is the display handler for the vertical tab list
 * 														used with the on-page display panel.
 *
 *	@version 0.0.16  [21.10.2006]
 *	@version 0.6.1  [11.7.2008]		// start of prototype 6
 *	@version 0.6.2  [15.7.2008]
 */


/**
 *	Constructor for the Panel_Tabset class.
 *	@class	The class Panel_Tabset maintains the list of vertical tabs used
 *	with the on-page display panel. The tab list is made up of an initial
 *	pre-defined group of fixed tabs followed by a variable number of dataset
 *	selection tabs.
 *
 *	Within the page the tab set is a simple HTML 'unordered-list' which is
 *	styled for display by CSS into a set of vertical tabs. It's display form
 *	should be irrelevant to this class except for the fact that it must
 *	re-set the minimum height of the on-page display panel each time the
 *	tabset is changed. This process ensures that the display panel is always
 *	longer than the combined length of the vertical tabs. Thus guaranteeing
 *	that all unselected vertical tabs join the tab pane at a solid boundary,
 *	so always presenting the image of a set of tabbed panels. This could not
 *	be guaranteed if the browser was left to adjust the panel length to its
 *	content.
 *
 *	(Note: the link between a tab and the display object it invokes is a
 *	unique application-wide name held by both the display object and its
 *	associated tab. The name is held in the tab 'link' and though it may
 *	also be used as the visible tab label the visible label is a separate
 *	modifiable user-oriented name string.
 *
 *	To support tab changes this class requires the existence of appropriate
 *	event handlers in a lower-level service layer. These event handlers must
 *	identify and activate appropriate object methods in response to user
 *	activity. They are:
 *
 *	@constructor
 *	@param	{string} a_sList_ID The unique ID of the HTML 'unordered-list' element for the tabs.
 *	@param	{object} a_rPanel_Controller A reference to the Panel Controller object.
 *
 *	@return	none
 *	@type	void
 */

function Panel_Tabset(a_sSelector_Name)
{
	/**
	 *	The unique application-wide name for the panel selector.
	 *	@type	string
	 */
	this.m_sSelector_Name = a_sSelector_Name;

	/**
	 *  The unique ID of the containing HTML element for the panel selector.
	 *	@type	string
	 */
	this.m_sSelector_Element = '';

	/**
	 *	The unique ID of the HTML 'unordered-list' element that is displayed as the tabs.
	 *	@type	string
	 */
	this.m_sList_ID = '';

	/**
	 *	The unique ID of the HTML 'div' element displaying the note on tab usage for first-time users.
	 *	@type	string
	 */
	this.m_sTab_Note = '';

	/**
	 *	The unique ID of the HTML 'button' element used to hide the first-time user note.
	 *	@type	string
	 */
	this.m_sHide_Tab_Note = '';

	/**
	 *	The display status of the first-time user note. True = still displayed, false = now hidden.
	 *	@type	boolean
	 */
	this.m_bTab_Note_Visible = true;

	/**
	 *	The unique ID of the service layer tab-click event handler.
	 *	@type	function
	 */
	//this.m_fTab_Click_Handler = null;

	/**
	 *	The lock on accepting tab activation events for processing.
	 *	Intended to prevent premature activation processing ie before the page
	 *	is either fully initialised (first visit) or fully restored (re-visit).
	 *	@type	boolean
	 */
	this.m_bPermit_Activation_Events = false;

	/**
	 *	A reference to the one-and-only Panel Controller object.
	 *	@type	object
	 */
	//this.m_rPanel_Controller = a_rPanel_Controller;

	/**
	 *	The application-wide name held by the currently selected tab.
	 *	@type	string
	 */
	this.m_sTab_Name = '';
}


/**
 *	Installs the HTML elements used by the panel selector.
 *
 *	@param	{string} a_sElement_Name The main/containing HTML element ID used by the panel selector.
 *	@param	{array} a_asElement_List List of structural/template element IDs used by the panel selector.
 *
 *	@return	true if successfully configured, otherwise false.
 *	@type	boolean
 */

Panel_Tabset.prototype.set_element_names = function(a_sElement_Name, a_asElement_List)
{
	if (!document.getElementById(a_sElement_Name)) {
		alert("Panel selector '" + this.m_sSelector_Name + "' element '" + a_sElement_Name + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 3;

	if (!is_array(a_asElement_List)
		|| (a_asElement_List.length != nElement_List_Length)) {
		alert("Bad element list for panel selector '" + this.m_sSelector_Name + "'.");
		return (false);
	}

	for (var nx=0; nx<nElement_List_Length; nx++) {
		if (!document.getElementById(a_asElement_List[nx])) {
			alert("Panel selector '" + this.m_sSelector_Name + "' element '" + a_asElement_List[nx] + "' was not found.");
			return (false);
		}
	}

	this.m_sSelector_Element = a_sElement_Name;
	this.m_sList_ID = a_asElement_List[0];
	this.m_sTab_Note = a_asElement_List[1];
	this.m_sHide_Tab_Note = a_asElement_List[2];

	// Make sure the event handler for the button to hide the tab usage note is set up.
	var eHide_Note_Button = document.getElementById(this.m_sHide_Tab_Note);
	if (!eHide_Note_Button) {
		alert("Hide tabe usage note button '" + this.m_sHide_Tab_Note + "' no longer exists.");
		return;
	}
//	// Under DOM2 can have multiple event handlers registered.
//	remove_event(eColumn_Help_Button, 'click', datafilter_column_help_click, false);
	// Rely on there only being one set up for the navigation tabs.
	add_event(eHide_Note_Button, 'click', hide_note_click, false);

	return (true);
}


/**
 *  Enable/Disable tab event processing. The initial enable should be
 *	called only when the whole page is fully configured/re-configured.
 *	Only then can other objects properly accept calls from this tabset.
 *
 *	@param	{boolean} a_bEnable_Tabs The new tab clicks enabled state
 *
 *  @return	none
 *  @type	void
 */

Panel_Tabset.prototype.activate_tabs = function(a_bEnable_Tabs) {

	if (a_bEnable_Tabs) {
		this.m_bPermit_Activation_Events = true;
	}
	else {
		this.m_bPermit_Activation_Events = false;
	}
}


/**
 *  Handle a tab selection event (click).
 *
 *	@param	{element} a_eTarget_Tab A reference to the activated tab link
 *
 *  @return	none
 *  @type	void
 */

Panel_Tabset.prototype.tab_activation = function(a_eTarget_Tab)
{
	var bHandle_Tab_Note = this.m_bTab_Note_Visible;

	//if (this.m_bPermit_Activation_Events != true)
	//	return;

	if (a_eTarget_Tab.className == 'selected')
		return;

	var sTarget_Name = a_eTarget_Tab.getAttribute("href").split('#')[1];

	var eTab_List = document.getElementById(this.m_sList_ID);
	if (!eTab_List) {
		alert("Vertical tab list '" + this.m_sList_ID + "' no longer exists.");
		return;
	}

	var rPage_Controller = locate_registered_object('main_controller');
	if (is_null(rPage_Controller)) {
		alert("Page panel controller no longer exists.");
		return;
	}

	var sCurrent_Tab_Name = '';
	if (rPage_Controller.check_display(sTarget_Name) == true) {
		var aeTab_Links = eTab_List.getElementsByTagName('a');
		var nTab_Link_Count = aeTab_Links.length;
		for (var nx=0; nx<nTab_Link_Count; nx++) {
			aeTab_Links[nx].className = '';

			if (bHandle_Tab_Note) {
				sCurrent_Tab_Name = aeTab_Links[nx].getAttribute("href").split('#')[1];
				if (sCurrent_Tab_Name == sTarget_Name) {
					bHandle_Tab_Note = false;
				}
				else if	(sCurrent_Tab_Name == 'separator') {
					bHandle_Tab_Note = false;
					this.show_user_note(false);
				}
			}
		}
		a_eTarget_Tab.className = 'selected';
		this.m_sTab_Name = sTarget_Name;

		//alert('selected [' + sTarget_Name + ']');
		rPage_Controller.select_new_display(sTarget_Name);
	}
}


/**
 *  Return a list of the tab names (not labels) in the variable tab group
 *	which will be the unique application-wide names of the active datasets.
 *
 *	@param	{array} a_asName_List An empty array to receive the list of tab names
 *
 *  @return	An associative array indexed by the retrieved names with all valid element values set to 'true'.
 *  @type	array
 */

Panel_Tabset.prototype.get_variable_group_names = function(a_asName_List) {
	var eTab_List = document.getElementById(this.m_sList_ID);
	if (!eTab_List) {
		alert("Vertical tab list '" + this.m_sList_ID + "' no longer exists.");
		return;
	}

	// Ensure any existing array entries are set to 'false'.
	for (xx in a_asName_List) {
		a_asName_List[xx] = false;
	}

	// Add names of the tabs that appear after the 'separator' tab
	// into the associative array with element values set to 'true'.
	var bSeparator_Found = false;
	var sTab_Name = '';
	var aeTab_Links = eTab_List.getElementsByTagName('a');
	nTab_Link_Count = aeTab_Links.length;
	for (var nx=0; nx<nTab_Link_Count; nx++) {
		//alert('href = ' + aeTab_Links[nx].getAttribute("href").split('#')[1]);
		//alert('#children = ' + aeTab_Links[nx].childNodes.length);
		//alert('nodeType = ' + aeTab_Links[nx].firstChild.nodeType);
		//alert('nodeValue = ' + aeTab_Links[nx].firstChild.nodeValue);
		if (aeTab_Links[nx].firstChild.nodeType == 3) {
			sTab_Name = ((aeTab_Links[nx].getAttribute("href")).split('#')[1]);
			if (bSeparator_Found) {
				a_asName_List[sTab_Name] = true;
			}
			else {
				if (sTab_Name == SEPARATOR_TAB_NAME) {
					bSeparator_Found = true;
				}
			}
		}
	}

	if (!bSeparator_Found) {
		alert('Tab group separator no longer exists.');
	}
}


/**
 *	Permits program-driven selection of a tab eg on page load or auto-test.
 *
 *	@param	{string} a_sName The application-wide name the tab invokes
 *
 *	@return	none
 *	@type	void
 */

Panel_Tabset.prototype.select_tab_by_name = function(a_sName)
{
	if (a_sName == null) {
		return;
	}

	var eTab_List = document.getElementById(this.m_sList_ID);
	if (!eTab_List) {
		alert("Vertical tab list '" + this.m_sList_ID + "' no longer exists.");
		return;
	}

	var aeTab_Links = eTab_List.getElementsByTagName('a');
	var nTab_Link_Count = aeTab_Links.length;

	for (var nx=0; nx<nTab_Link_Count; nx++) {
		//alert('href = ' + aeTab_Links[nx].getAttribute("href").split('#')[1]);
		//alert('#children = ' + aeTab_Links[nx].childNodes.length);
		//alert('nodeType = ' + aeTab_Links[nx].firstChild.nodeType);
		//alert('nodeValue = ' + aeTab_Links[nx].firstChild.nodeValue);
		if ( (aeTab_Links[nx].firstChild.nodeType == 3)
			&& (aeTab_Links[nx].getAttribute("href").split('#')[1] == a_sName) ) {
			this.tab_activation(aeTab_Links[nx]);
			return;
		}
	}

	alert('No tab for ' + a_sName + ' was found.');
}


/**
 *  Add a tab to the end of the fixed group of tabs.
 *
 *	@param	{string} a_sName The application-wide name to be returned by the tab
 *	@param	{string} a_sLabel The visible label for the new tab
 *
 *  @return	none
 *  @type	void
 */

Panel_Tabset.prototype.add_fixed_tab = function(a_sName, a_sLabel) {
	// Specify append to fixed group of tabs.
	this.add_new_tab(a_sName, a_sLabel, 0);
}


/**
 *  Add a tab to the end of the variable group of tabs.
 *
 *	@param	{string} a_sName The application-wide name to be returned by the tab
 *	@param	{string} a_sLabel The visible label for the new tab
 *
 *  @return	none
 *  @type	void
 */

Panel_Tabset.prototype.append_tab = function(a_sName, a_sLabel) {
	// Specify append to variable group of tabs.
	this.add_new_tab(a_sName, a_sLabel, 1);
}


/**
 *  Remove a tab from any position in the variable group of tabs.
 *
 *	@param	{string} a_sName The application-wide name returned by the tab
 *	@param	{string} a_sLabel The identifier for the discarded tab
 *
 *  @return	none
 *  @type	void
 */

Panel_Tabset.prototype.remove_tab = function(a_sName) {
	var sAppwide_Name = '';
	var bGroup_Separator_Found = false;

	var eTab_List = document.getElementById(this.m_sList_ID);
	if (!eTab_List) {
		alert("Vertical tab list '" + this.m_sList_ID + "' no longer exists.");
		return;
	}

	var aeTab_Elements = eTab_List.getElementsByTagName('li');
	var aeTab_Links = eTab_List.getElementsByTagName('a');
	var nTab_Link_Count = aeTab_Links.length;

	for (var nx=0; nx<nTab_Link_Count; nx++) {
		//alert('href = ' + aeTab_Links[nx].getAttribute("href").split('#')[1]);
		//alert('#children = ' + aeTab_Links[nx].childNodes.length);
		//alert('nodeType = ' + aeTab_Links[nx].firstChild.nodeType);
		//alert('nodeValue = ' + aeTab_Links[nx].firstChild.nodeValue);
		sAppwide_Name = aeTab_Links[nx].getAttribute("href").split('#')[1];
		if (sAppwide_Name == SEPARATOR_TAB_NAME) {
			bGroup_Separator_Found = true;
		}
		if ((bGroup_Separator_Found == true) && (sAppwide_Name == a_sName)) {
			aeTab_Elements[nx].parentNode.removeChild(aeTab_Elements[nx]);
			this.synchronise_display_height(aeTab_Elements);
			return;
		}
	}

	if (bGroup_Separator_Found) {
		alert('Whoops: no tab named ' + a_sName + ' exists.');
	}
	else {
		alert('Tab group separator no longer exists.');
	}
}


/**
 *	Show/Hide the note on tab usage for first-time users.
 *
 *	@param	{boolean} a_bState Set to true to show the message and false to hide it.
 *
 *	@return	none
 *	@type	void
 */

Panel_Tabset.prototype.show_user_note = function(a_bState)
{
	var ePanel_Selector_Element = document.getElementById(this.m_sSelector_Element);
	if (!ePanel_Selector_Element) {
		alert("Panel selector element '" + this.m_sSelector_Element + "' no longer exists.");
		return;
	}

	var eUser_Note_Element = document.getElementById(this.m_sTab_Note);
	if (!eUser_Note_Element) {
		alert("User note element '" + this.m_sTab_Note + "' no longer exists.");
		return;
	}

	if (a_bState) {
		eUser_Note_Element.className = '';
		this.m_bTab_Note_Visible = true;
	}
	else {
		eUser_Note_Element.className = 'hidden';
		this.m_bTab_Note_Visible = false;
	}
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Panel_Tabset.prototype.print_state = function()
{
	var sTab_List = '';
	var nTab_Number = 0;

	var eTab_List = document.getElementById(this.m_sList_ID);
	if (!eTab_List) {
		alert("Vertical tab list '" + this.m_sList_ID + "' was not found.");
	}

	var aeTab_Links = eTab_List.getElementsByTagName('a');
	var nTab_Link_Count = aeTab_Links.length;

	var sTab_Name = '';
	var sTab_Label = '';
	for (var nx=0; nx<nTab_Link_Count; nx++) {
		//alert('href = ' + aeTab_Links[nx].getAttribute("href").split('#')[1]);
		//alert('#children = ' + aeTab_Links[nx].childNodes.length);
		//alert('nodeType = ' + aeTab_Links[nx].firstChild.nodeType);
		//alert('nodeValue = ' + aeTab_Links[nx].firstChild.nodeValue);
		if (aeTab_Links[nx].firstChild.nodeType == 3) {
			sTab_Label = aeTab_Links[nx].firstChild.nodeValue;
			sTab_Name = aeTab_Links[nx].getAttribute("href").split('#')[1];

			if (sTab_Name == SEPARATOR_TAB_NAME) {
				sTab_List += '\nTab separator.\n'
					+ '    Name = \'' + sTab_Name + '\'';
			}
			else {
				nTab_Number++;
				sTab_List += '\nTab ' + nTab_Number + '.\n'
					+ '    Name = \'' + sTab_Name + '\'\n'
					+ '    Label = \'' + sTab_Label + '\'';
			}
		}
	}

	return ('[Panel_Tabset]'
			+ '\nList ID = ' + this.m_sList_ID
			+ '\nTab activation permitted = ' + this.m_bPermit_Activation_Events
			+ '\nActive tab name = \'' + this.m_sTab_Name + '\''
			+ sTab_List);
}


/**
 *  Add a new tab - handles additions to both the fixed and variable groups of tabs.
 *
 *	@private
 *	@param	{string} a_sName The application-wide name to be returned by the tab
 *	@param	{string} a_sLabel The visible label for the new tab
 *	@param	{integer} a_nTab_Group 0 = fixed group, 1 = variable group
 *
 *  @return	none
 *  @type	void
 */

Panel_Tabset.prototype.add_new_tab = function(a_sName, a_sLabel, a_nTab_Group) {
	var sAppwide_Name = '';
	var eGroup_Separator = null;

	var eTab_List = document.getElementById(this.m_sList_ID);
	if (!eTab_List) {
		alert("Vertical tab list '" + this.m_sList_ID + "' no longer exists.");
		return;
	}

	var aeTab_Elements = eTab_List.getElementsByTagName('li');
	var aeTab_Links = eTab_List.getElementsByTagName('a');
	var nTab_Link_Count = aeTab_Links.length;

	// Locate the 'separator' tab while checking for duplication.
	for (var nx=0; nx<nTab_Link_Count; nx++) {
		//alert('href = ' + aeTab_Links[nx].getAttribute("href").split('#')[1]);
		//alert('#children = ' + aeTab_Links[nx].childNodes.length);
		//alert('nodeType = ' + aeTab_Links[nx].firstChild.nodeType);
		//alert('nodeValue = ' + aeTab_Links[nx].firstChild.nodeValue);
		if (aeTab_Links[nx].firstChild.nodeType == 3) {
			if (aeTab_Links[nx].firstChild.nodeValue == a_sLabel) {
				alert('Whoops: a tab labelled ' + a_sLabel + ' already exists.');
				return;
			}
			sAppwide_Name = aeTab_Links[nx].getAttribute("href").split('#')[1];
			if (sAppwide_Name == a_sName) {
				alert('Whoops: a tab for ' + a_sName + ' already exists.');
				return;
			}
			if (sAppwide_Name == SEPARATOR_TAB_NAME) {
				eGroup_Separator = aeTab_Elements[nx];
			}
		}
	}

	if (eGroup_Separator == null) {
		alert('Tab group separator no longer exists.');
		return;
	}

	// Create a new navigation list element which the CSS will style as a new tab.
	var eNew_Tab = document.createElement('li');
	var eNew_Tab_Link = document.createElement('a');
	eNew_Tab.appendChild(eNew_Tab_Link);
	eNew_Tab_Link.setAttribute("href", '#' + a_sName);
	var eNew_Tab_Link_Text = document.createTextNode(a_sLabel);
	eNew_Tab_Link.appendChild(eNew_Tab_Link_Text);

	// Attach the new list element to the chosen group.
	if (a_nTab_Group == 0) {
		eGroup_Separator.parentNode.insertBefore(eNew_Tab, eGroup_Separator);
	}
	else {
		eGroup_Separator.parentNode.appendChild(eNew_Tab);
	}

	// Set the new minimum height for display panels.
	this.synchronise_display_height(aeTab_Elements);

	// Finally connect the tab to the event handler.
	add_event(eNew_Tab, 'click', nav_link_click, false);
}


/**
 *  Compute and set the minimum height required for the display panel,
 *	to synchronise it with the number of tabs displayed.
 *
 *	@private
 *	@param	{array} a_aeTab_Elements An ordered array of the HTML 'list' elements
 *					which the CSS is styling as a the vertical tabs
 *
 *  @return	none
 *  @type	void
 */

Panel_Tabset.prototype.synchronise_display_height = function(a_aeTab_Elements) {

	var nTab_Height = 0;
	var nTotal_Height = 0;

	if (a_aeTab_Elements[0].offsetHeight)
		nTab_Height = a_aeTab_Elements[0].offsetHeight;
	else if (a_aeTab_Elements[0].style.pixelHeight)
		nTab_Height = a_aeTab_Elements[0].style.pixelHeight;

	// Remember the 'separator' tab is not visible but is included in the count.
	nTotal_Height = (nTab_Height + 8) * (a_aeTab_Elements.length);

	var rPage_Controller = locate_registered_object('main_controller');
	if (is_null(rPage_Controller)) {
		alert("Page panel controller no longer exists.");
		return;
	}
	rPage_Controller.set_minimum_height(nTotal_Height);
}


/* -------------------------------------------------------------------------- */


/**
 *	The global event handler for selection clicks on panel tabs.
 *	Conceptually this function is part of the service layer but
 *	it is uniquely coupled with this class and therefore is
 *	defined here to facilitate maintenance.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */
/*
function nav_link_click(a_Event_Object) {
	var eEvent_Target = find_event_target(a_Event_Object, 'a', true);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'a')
		return;

	// Remove the focus from the tab to eliminate
	// the dotted line 'focus' box in Mozilla browsers
	// which ruins the tab/tab-panel connection effect.
	eEvent_Target.blur();

	Page_Panel_Selector.tab_activation(eEvent_Target);
}
*/

/* -+- */


