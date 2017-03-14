/**
 *  @fileoverview The class Datatab_Display is the display handler for the tab bar
 * 										used with the dataset field listing displays.
 *
 *	@version 0.0.4  [29.8.2006]
 */


/**
 *	Constructor for the Datatab_Display class.
 *	@class	The class Datatab_Display maintains the tab bar used to switch
 *	between field views/sections in dataset field display panels. The tab
 *	bar holds a fixed set of tabs with pre-defined IDs, labels and invoked
 *	actions.
 *
 *	Within the page the tab set is a pre-existing HTML 'unordered-list'
 *	which is styled for display by CSS into a tab bar. The form of its
 *	display should be irrelevant to this class.
 *
 *	(Note: the link between a tab and the display object it invokes is 
 *	pre-defined within the parent/containing controller display class).
 *
 *	To support tab changes this class requires the existence of appropriate
 *	event handlers in a lower-level service layer. These event handlers must
 *	identify and activate appropriate object methods in response to user
 *	activity. They are:
 *
 *	@constructor
 *	@param	{string} a_sSection_Name The controller's preset name for this display section.
 *	@param	{object} a_rSection_Parent A reference to the parent controlling display object.
 *
 *	@return	none
 *	@type	void
 */

function Datatab_Display(a_sSection_Name, a_rSection_Parent)
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
	 *	The unique ID of the HTML 'unordered-list' element that is displayed as the tabs.
	 *	@type	string
	 */
	this.m_sList_Element = '';

	/**
	 *	The unique ID of the service layer tab-click event handler.
	 *	@type	function
	 */
	this.m_fTab_Click_Handler = null;

	/**
	 *	The lock on accepting tab activation events for processing.
	 *	Intended to prevent premature activation processing ie before
	 *	the full display is set on-screen (co-ordinated by the parent
	 *	controller).
	 *	@type	boolean
	 */
	this.m_bPermit_Activation_Events = false;

	/**
	 *	The local display name held by the currently selected tab.
	 *	@type	string
	 */
	this.m_sTab_Name = 'fields';

//	var eTab_List = document.getElementById(this.m_sList_ID);
//    if (!eTab_List) {
//		alert("Vertical tab list '" + this.m_sList_ID + "' was not found.");
//	}
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

Datatab_Display.prototype.set_element_names = function(a_sSection_Element, a_asElement_List)
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
	this.m_sList_Element = a_asElement_List[0];

	// Attach event handler to all tabs.
	var eTab_List = document.getElementById(this.m_sList_Element);
	var aeTab_Elements = eTab_List.getElementsByTagName('li');
	var nTab_Element_Count = aeTab_Elements.length;
	for (nx=0; nx<nTab_Element_Count; nx++) {
		// Under DOM2 can have multiple event handlers registered.
		remove_event(aeTab_Elements[nx], 'click', field_link_click, false);
		add_event(aeTab_Elements[nx], 'click', field_link_click, false);
	}

	return (true);
}


/**
 *	Hide the display.
 *
 *	@return	none
 *	@type	void
 */

Datatab_Display.prototype.hide_display = function()
{
	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}

	eDisplay_Element.className = 'hidden';
}


/**
 *	Show the display, restoring the tab elements to the correct state for this tab-bar object.
 *
 *	@return	none
 *	@type	void
 */

Datatab_Display.prototype.show_display = function()
{
	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}

	var sTarget_Name = '';

	var eTab_List = document.getElementById(this.m_sList_Element);
	var aeTab_Links = eTab_List.getElementsByTagName('a');
	var nTab_Link_Count = aeTab_Links.length;
	for (var nx=0; nx<nTab_Link_Count; nx++) {
		sTarget_Name = aeTab_Links[nx].getAttribute("href").split('#')[1];
		if (sTarget_Name == this.m_sTab_Name) {
			aeTab_Links[nx].className = 'selected';
		}
		else {
			aeTab_Links[nx].className = '';
		}
	}

	eDisplay_Element.className = '';
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

Datatab_Display.prototype.activate_tabs = function(a_bEnable_Tabs) {

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
 *	@param	{element} a_eTarget_Tab A reference to the activated tab link.
 *
 *  @return	none
 *  @type	void
 */

Datatab_Display.prototype.tab_activation = function(a_eTarget_Tab)
{
//	//if (this.m_bPermit_Activation_Events != true)
//	//	return;

	if (a_eTarget_Tab.className == 'selected')
		return;

	var sTarget_Name = a_eTarget_Tab.getAttribute("href").split('#')[1];

	var eTab_List = document.getElementById(this.m_sList_Element);
	if (!eTab_List) {
		alert("Tab bar list '" + this.m_sList_Element + "' no longer exists.");
		return;
	}

//	if (sTarget_Name == 'extract') {
//		this.m_rParent_Controller.select_new_display(sTarget_Name);
//		return;
//	}

//	if (this.m_rPanel_Controller.check_display(sTarget_Name) == true) {
	var aeTab_Links = eTab_List.getElementsByTagName('a');
	var nTab_Link_Count = aeTab_Links.length;
	for (var nx=0; nx<nTab_Link_Count; nx++) {
		aeTab_Links[nx].className = '';
	}
	a_eTarget_Tab.className = 'selected';
	this.m_sTab_Name = sTarget_Name;

	this.m_rParent_Controller.select_new_display(sTarget_Name);
//	}
}


/**
 *  Return a list of the tab labels in the variable tab group which in this case
 *	will be the application-wide names of the active datasets.
 *
 *	@param	{array} a_asName_List An empty array to receive the list of tab names
 *
 *  @return	An associative array indexed by the retrieved names with all valid element values set to 'true'.
 *  @type	array
 */

Datatab_Display.prototype.get_variable_group_names = function(a_asName_List) {
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

Datatab_Display.prototype.select_tab_by_name = function(a_sName)
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

Datatab_Display.prototype.add_fixed_tab = function(a_sName, a_sLabel) {
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

Datatab_Display.prototype.append_tab = function(a_sName, a_sLabel) {
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

Datatab_Display.prototype.remove_tab = function(a_sName) {
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
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Datatab_Display.prototype.print_state = function()
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

	return ('[Datatab_Display]'
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

Datatab_Display.prototype.add_new_tab = function(a_sName, a_sLabel, a_nTab_Group) {
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

Datatab_Display.prototype.synchronise_display_height = function(a_aeTab_Elements) {

	var nTab_Height = 0;
	var nTotal_Height = 0;

	if (a_aeTab_Elements[0].offsetHeight)
		nTab_Height = a_aeTab_Elements[0].offsetHeight;
	else if (a_aeTab_Elements[0].style.pixelHeight)
		nTab_Height = a_aeTab_Elements[0].style.pixelHeight;

	// Remember the 'separator' tab is not visible but is included in the count.
	nTotal_Height = (nTab_Height + 8) * (a_aeTab_Elements.length);

	this.m_rPanel_Controller.set_minimum_height(nTotal_Height);
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

	Page_Datatab_Display.tab_activation(eEvent_Target);
}
*/

/* -+- */


