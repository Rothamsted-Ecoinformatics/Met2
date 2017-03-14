/**
 *	@fileoverview The main script for the data extraction prototype page which
 *				is a progression of the dataset table interaction prototype page.
 *
 *	@version 0.2.23  [16.1.2007]
 *	@version 0.2.26  [31.1.2007]
 *	@version 0.2.27  [26.2.2007]
 *	@version 0.2.29  [16.3.2007]
 *	@version 0.2.31  [21.3.2007]
 *	@version 0.2.32  [13.4.2007]
 *	@version 0.2.42  [30.4.2007]
 *	@version 0.2.43  [9.7.2007]
 *	@version 0.2.46  [31.7.2007]
 *	@version 0.2.47  [6.8.2007]
 *	@version 0.2.49  [14.8.2007]
 *	@version 0.2.50  [24.8.2007]
 *	@version 0.5.1  [9.11.2007]		// field-set definitions downloaded + message section
 *	@version 0.5.2  [12.11.2007]
 *	@version 0.5.4  [16.11.2007]
 *	@version 0.6.1  [11.7.2008]		// start of prototype 6
 *	@version 0.6.3  [18.7.2008]
 *	@version 0.6.7  [18.9.2008]
 *	@version 0.6.8  [6.10.2008]
 */


//alert(get_dataset_field_set2('bbksoils'));
//alert(All_Field_Sets['bbksoils']);
//var jo = 'bbksoils';
//alert(All_Field_Sets[jo]);
/*
function get_dataset_field_set2(a_sDataset_Name)
{
	if (is_undefined(All_Field_Sets[a_sDataset_Name])) {
		alert('undefined');
		return (false);
	}
	if (!is_string(All_Field_Sets[a_sDataset_Name])) {
		alert('not a string');
		return (false);
	}
	if (All_Field_Sets[a_sDataset_Name].length == 0) {
		alert('zero length');
		return (false);
	}
	return (true);
}
*/

// The encoded strings for each of the dataset groups.
//var all_datasets_string = new String();
//var sRegistered_Datasets = new String();
//var unregistered_datasets_string = new String();


var sDataset_Group_Response = '';
// Dataset name, status and description after splitting
// the received string for the selected dataset group.
// [n]   = dataset name
// [n+1] = dataset status
// [n+2] = dataset description
var aasDataset_Group_List = new Array();
//dataset_group_list = new Array();


// Indexed by dataset name. Holds/saves the encoded
// string for the full datafields panel (including
// preview) for each activated dataset.
var asDataset_Field_Responses = new Array();
//dataset_datafield_strings = new Array();


// Current active dataset fields string split into:
// [n]   = field name
// [n+1] = field description
// [n+2] = field preview sequence
var asDataset_Field_List = new Array();
//selected_datafields_list = new Array();


// Indexed by dataset name. Records the state of the
// datafields display for each activated dataset.
aafDatafield_Listing_States = new Array();
//dataset_datafield_state = new Array();


// Indexed by dataset name. Controls which datasets
// support filtered previewing and defines the filter.
preview_state = new Array();


// Status flags and masks.
unused_status = -1;

display_flag = 1;
check_flag = 2;
expand_flag = 4;
extended_flag = 8;
filter_flag = 16;

undisplay_mask = 30;
uncheck_mask = 29;
unexpand_mask = 27;
unextended_mask = 23;
unfilter_mask = 15;


// Global activation status for the column help displays of listing tables.
var bDataset_Column_Help_Active = false;
var bDatafield_Column_Help_Active = false;
var bDatafilter_Column_Help_Active = false;

// Column help button messages.
var sShow_Column_Help_Msg = 'Explain table columns';
var sHide_Column_Help_Msg = 'Collapse explanation';


// Button messages.
remove_msg = 'Remove unselected fields';
reshow_msg = 'Re-display removed fields';

var Day_Start = new Date();
var App_Start = new Date();
Day_Start.setHours(0);
Day_Start.setMinutes(0);
Day_Start.setSeconds(0);
Day_Start.setMilliseconds(0);
var Tenth_Rem = (App_Start.getTime() - Day_Start.getTime()) % 100;
var extract_count = (App_Start.getTime() - Day_Start.getTime() - Tenth_Rem) / 100;


// Objects locatable by the following global 'registry' function.
var Async_Transfer_Controller = null;
var Message_Transfer_Service = null;
var Page_Timeout_Service = null;
var Page_Display_Factory = null;
var Page_Panel_Controller = null;
var Page_Panel_Selector = null;
//var Page_Dataset_Mapper = null;


/**
 *	This function operates as a pseudo-registry for the main controlling objects.
 *
 *	@param	{string} a_sObject_Identifier The application-wide identifier used for the requested object.
 *
 *	@return	A reference to the requested object, otherwise null.
 *	@type	object reference
 */

function locate_registered_object(a_sObject_Identifier) 
{
	if (a_sObject_Identifier == 'async_controller') {
		return (Async_Transfer_Controller);
	}
	if (a_sObject_Identifier == 'message_service') {
		return (Message_Transfer_Service);
	}
	if (a_sObject_Identifier == 'timeout_service') {
		return (Page_Timeout_Service);
	}
	if (a_sObject_Identifier == 'main_factory') {
		return (Page_Display_Factory);
	}
	if (a_sObject_Identifier == 'main_controller') {
		return (Page_Panel_Controller);
	}
	if (a_sObject_Identifier == 'main_selector') {
		return (Page_Panel_Selector);
	}

	return (null);
}


/**
 *	This function operates as a pseudo-registry registration interface for the main controlling objects.
 *
 *	@param	{string} a_sObject_Identifier The application-wide identifier used for the requested object.
 *	@param	{reference} a_rObject_Reference A reference to the newly registered object.
 *
 *	@return	none
 *	@type	void
 */

function register_new_object(a_sObject_Identifier, a_rObject_Reference) 
{
	if (a_sObject_Identifier == 'async_controller') {
        Async_Transfer_Controller = a_rObject_Reference;
	}
}


/**
 *	A page load handler to set up the tab panels to their initial state.
 *
 *	Note this handler is the only function that accesses the page's main
 *	display controller, display selector and display factory by their
 *	defining variables rather than using the pseudo-registry function
 *	locate_registered_object() as throughout the rest of the application.
 *
 *	Note this handler function is called by the window onload observer
 *	so it does not receive an event object.
 *
 *	@return	none
 *	@type	void
 */

function init_page() {
	var nx = 0;

	var bResult_Status = false;
	var arObject_Set = Array();
	var bResult_Flag = false;

	var asGroup_Datasets = Array();
	var asGroup_Ordering = Array();
	var asError_Message = Array(1);

	var asTemp_Datasets = null;
	var nOrdering_Offset = 0;
	var asGroup_Definition = null;
	var asGroup_Ordering = null;

	if (!document.getElementById
		|| !document.getElementsByTagName)
		return;

	Page_Display_Factory = new Display_Factory();
	Message_Transfer_Service = new Transfer_Controller();
	Page_Timeout_Service = new Timeout_Manager('timeout_service');
	//Page_Timeout_Service.request_timeout(10);
	//alert(Page_Timeout_Service.print_state());

	// Create and configure the main panel controller for the page.
	arObject_Set = Array();
	bResult_Status = Page_Display_Factory.make_new_panel('main_controller', 'main_controller', arObject_Set);
	Page_Panel_Controller = arObject_Set[0];

	// Create and configure the main panel selector for the page.
	// (Currently uses a vertical set of tabs in a navigation panel).
	arObject_Set = Array();
	bResult_Status = Page_Display_Factory.make_new_panel('main_selector', 'main_selector', arObject_Set);
	Page_Panel_Selector = arObject_Set[0];

	// Set up an untabbed page-loading message panel as the active panel.
	arObject_Set = Array();
	bResult_Status = Page_Display_Factory.make_new_panel('loading_switching', 'loading_switching', arObject_Set);
	Page_Panel_Controller.add_new_display(arObject_Set);
	Page_Panel_Controller.select_new_display('loading_switching');

	//set_minimum_width('dataset', 4, 400);

	//
	// Set up the fixed selection (tab) group and their display panels.
	//

	// First the user info (help) panel.
	arObject_Set = Array();
	bResult_Status = Page_Display_Factory.make_new_panel('user_info', 'user_info', arObject_Set);
	Page_Panel_Controller.add_new_display(arObject_Set);
	Page_Panel_Selector.add_fixed_tab('user_info', 'Help');

	// Second the user session (login) panel.
	arObject_Set = Array();
	bResult_Status = Page_Display_Factory.make_new_panel('user_session', 'user_session', arObject_Set);
	Page_Panel_Controller.add_new_display(arObject_Set);
	Page_Panel_Selector.add_fixed_tab('user_session', 'Login/Logout');

	// Then the 'All Datasets' listing panel (and dataset group).
	// Note we can't wait to get the on-screen name lazily because it's needed for the tab panel,
	// which is OK in this case because we're handling a permanent (built-in) pre-defined display.
	arObject_Set = Array();
	bResult_Status = Page_Display_Factory.make_new_panel(FULL_TABLE_ID, 'dataset_type', arObject_Set);
	arObject_Set[0].set_label_name('All Datasets');
	Page_Panel_Controller.add_new_display(arObject_Set);
	Page_Panel_Selector.add_fixed_tab(FULL_TABLE_ID, 'All Datasets');

	// Get the predefined list of all datasets from the _response module.
	asGroup_Datasets = Array();
	asGroup_Ordering = Array();
	asError_Message[0] = '';
	if (process_dataset_group_definition(FULL_TABLE_ID, sAll_Datasets_Response,
									  asGroup_Datasets, asGroup_Ordering, asError_Message) == false) {
		alert(asError_Message[0]);
	}
//	split_dataset_group_definition(sAll_Datasets_Response, asGroup_Datasets, asGroup_Ordering);
//	bResult_Flag = arObject_Set[0].set_dataset_group(FULL_TABLE_ID, asGroup_Datasets, asGroup_Ordering);
	bResult_Flag = arObject_Set[0].set_dataset_group(asGroup_Datasets, asGroup_Ordering);

	// Then the 'My Datasets' listing panel (and dataset group).
	// This too is a permanent (built-in) display set up in the permanent section of the tab panel.
	arObject_Set = Array();
	bResult_Status = Page_Display_Factory.make_new_panel(LOGIN_TABLE_ID, 'dataset_type', arObject_Set);
	arObject_Set[0].set_label_name('My Datasets');
	Page_Panel_Controller.add_new_display(arObject_Set);
	Page_Panel_Selector.add_fixed_tab(LOGIN_TABLE_ID, 'My Datasets');

	// Get the predefined list of registered datasets from the _response module.
	asGroup_Datasets = Array();
	asGroup_Ordering = Array();
	asError_Message[0] = '';
	if (process_dataset_group_definition(LOGIN_TABLE_ID, sRegistered_Datasets_Response_empty,
									  asGroup_Datasets, asGroup_Ordering, asError_Message) == false) {
		alert(asError_Message[0]);
	}
//	split_dataset_group_definition(sRegistered_Datasets_Response, asGroup_Datasets, asGroup_Ordering);
//	bResult_Flag = arObject_Set[0].set_dataset_group(LOGIN_TABLE_ID, asGroup_Datasets, asGroup_Ordering);
	bResult_Flag = arObject_Set[0].set_dataset_group(asGroup_Datasets, asGroup_Ordering);

	// Un-hide the first-time user note on tab usage.
	Page_Panel_Selector.show_user_note(true);

	// Finally select the 'All Datasets' panel by selecting its tab and letting this invoke the display.
	Page_Panel_Selector.select_tab_by_name(FULL_TABLE_ID);

	// Now we're ready to consider that the user might want to do something.
	init_listeners();
}


/**
 *	Called to attach all event listeners on page load.
 *
 *	@return	none
 *	@type	void
 */

function init_listeners() {
//	var nx = 0;

	var eHeader_Home_Button = document.getElementById('header_bar_home_link');
	if (!eHeader_Home_Button) {
		alert('header bar home link button not found');
		return;
	}
	add_event(eHeader_Home_Button, 'click', goto_era_home, false);

	var eValue_Select_Field = document.getElementById('single_value_field');
	if (!eValue_Select_Field) {
		alert('single value selection field not found');
		return;
	}
	add_event(eValue_Select_Field, 'click', value_field_activation, false);

	var eRange_Start_Field = document.getElementById('start_range_field');
	if (!eRange_Start_Field) {
		alert('start-of-range selection field not found');
		return;
	}
	add_event(eRange_Start_Field, 'click', range_field_activation, false);

	var eRange_End_Field = document.getElementById('end_range_field');
	if (!eRange_End_Field) {
		alert('end-of-range selection field not found');
		return;
	}
	add_event(eRange_End_Field, 'click', range_field_activation, false);

	var eFilter_Range_Button = document.getElementById('datafilter_range_accept_button');
	if (!eFilter_Range_Button) {
		alert('datafilter range selection accept button not found');
		return;
	}
	add_event(eFilter_Range_Button, 'click', range_values_accept, false);

	var eFilter_List_Button = document.getElementById('datafilter_list_accept_button');
	if (!eFilter_List_Button) {
		alert('datafilter list selection accept button not found');
		return;
	}
	add_event(eFilter_List_Button, 'click', list_values_accept, false);

	var eData_Extract_Button = document.getElementById('data_extract_button');
	if (!eData_Extract_Button) {
		alert('data extraction request button not found');
		return;
	}
	add_event(eData_Extract_Button, 'click', extract_click, false);

	var eAdd_Sort_Field_Button = document.getElementById('add_sort_field_button');
	if (!eAdd_Sort_Field_Button) {
		alert('add sort field button not found');
		return;
	}
	add_event(eAdd_Sort_Field_Button, 'click', add_sort_field_click, false);

	var eRemove_Sort_Field_Button = document.getElementById('remove_sort_field_button');
	if (!eRemove_Sort_Field_Button) {
		alert('remove sort field button not found');
		return;
	}
	add_event(eRemove_Sort_Field_Button, 'click', remove_sort_field_click, false);

//	var field_remove_button = document.getElementById('dataset_field_listing_remove_button');
//	addEvent(field_remove_button, 'click', remove_click, false);
//	var field_preview_button = document.getElementById('dataset_field_listing_preview_button');
//	addEvent(field_preview_button, 'click', preview_click, false);
//	//var field_preview_howto_button = document.getElementById('dataset_field_listing_preview_howto_button');
//	//addEvent(field_preview_howto_button, 'click', field_preview_howto_click, false);

	// Remember there are text nodes in the cell with the toggle button/image (1 for IE, 2 for Mozilla).
//	var display_all_toggle_cell = document.getElementById('dataset_field_listing_table_toggle_cell');
//	if (display_all_toggle_cell) {
//		var cell_contents = display_all_toggle_cell.childNodes;
//		if (cell_contents.length > 0) {
//			for (nx=0; nx<cell_contents.length; nx++) {
//				if (cell_contents[nx].nodeName.toLowerCase() == 'img') {
//					addEvent(cell_contents[nx], 'click', toggle_all_click, false);
//					break;
//				}
//			}
//		}
//	}
}


/**
 *	An event handler for the system timeout.
 *
 *	Note: no event object is received with the call for this event.
 *
 *	@return	none
 *	@type	void
 */

function timeout_handler()
{
	//log_message('**********timeout_handler()');

	var rTimeout_Service = locate_registered_object('timeout_service');
	if (is_null(rTimeout_Service)) {
		alert('No timeout service found.');
		return;
	}

	rTimeout_Service.handle_timeout();
}


/**
 *	The common asynchronous transmission event handler.
 *
 *	@param	{string} a_sTransferID The unique identifier for the transfer
 *	@param	{integer} a_nStatus_Code The termination status code
 *	@param	{string} a_sStatus_Text The termination status text message
 *	@param	{string} a_sResponse_Text The received text
 *	@param	{object} a_sResponse_XML The received XML
 *
 *	@return	none
 *	@type	void
 */

function async_input_handler()
{
	//log_message('**********async_input_handler()');

	var rAsync_Handler = null;

	// Fetch what is almost certainly the active asynchronous transfer controller.
	rAsync_Handler = locate_registered_object('async_controller');
	if (is_null(rAsync_Handler)) {
		alert('async controller not found.');
		return;
	}

	// For now do nothing if the expected controller is not active.
	if (!rAsync_Handler.is_active()) {
		alert('expected async controller not active.');
		return;
	}

	//log_message('**********async_input_handler() -- readyState = [' + rAsync_Handler.m_xmlhttp.readyState + ']');

	// Identify and handle the state change causing the event.
    switch (rAsync_Handler.m_xmlhttp.readyState) {

			// Loading.
	case 1: break;

			// Loaded.
	case 2: break;

			// Interactive.
	case 3: break;

			// Complete.
    case 4: rAsync_Handler.transfer_completion();
			break;

			// Ignore any unknown state.
	default:
			break;
	};
}


/**
 *	An event handler for the 'header bar home link' button to return the user to the era home page.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function goto_era_home(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;
	window.open(ERA_HOMEPAGE_URL, 'homePage');
	//window.location = ERA_HOMEPAGE_URL;
}


/**
 *	An event handler for selection clicks on panel tabs.
 *
 *	@param	{object} e The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function nav_link_click(a_Event_Object) {
	var eEvent_Target = find_event_target(a_Event_Object, 'a', true);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'a')
		return;

	// Remove the focus from the tab to eliminate
	// the dotted line 'focus' box in Mozilla browsers
	// which ruins the tab/tab-panel connection effect.
	eEvent_Target.blur();

	var rPanel_Selector = locate_registered_object('main_selector');
	if (is_null(rPanel_Selector)) {
		return;
	}

	rPanel_Selector.tab_activation(eEvent_Target);
}


/**
 *	An event handler to hide the note in the navigation panel tab area.
 *
 *	@param	{object} e The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function hide_note_click(a_Event_Object) {
	var eEvent_Target = find_event_target(a_Event_Object, 'input', true);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the tab to eliminate
	// the dotted line 'focus' box in Mozilla browsers
	// which ruins the tab/tab-panel connection effect.
	//eEvent_Target.blur();

	var rPanel_Selector = locate_registered_object('main_selector');
	if (is_null(rPanel_Selector)) {
		return;
	}

	rPanel_Selector.show_user_note(false);
}


/**
 *	An event handler for the user info/help panel tab bar.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function tab_link_click(a_Event_Object)
{
//	var asActivated_Tab_Details = Array();

	var eEvent_Target = find_event_target(a_Event_Object, 'a', true);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'a')
		return;

	// Remove the focus from the tab to eliminate
	// the dotted line 'focus' box in Mozilla browsers
	// which ruins the tab/tab-panel connection effect.
	// TAKEN OUT FOR IE TO FIX A TAB BLANKING BUG
	if (typeof window.ActiveXObject == "undefined") {
		eEvent_Target.blur();
	}

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}
	Active_Display.tab_activation(eEvent_Target);
}


/**
 *	An event handler that processes user panel form events
 *	invoked by both the return key and the form submit button.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */
/*
function panel_form_handler(a_Event_Object)
{
	// When invoked by the 'return' key the event object may not be the form
	// but the input element that had the focus when the 'return' key was hit.
	// (However under IE the event object has always been the form).
	// Also block the event default action and bubbling (the 'true' argument).
	alert('Form');
	var eEvent_Target = find_event_target(a_Event_Object, 'form', true);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'form')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	Active_Display.form_handler();
}
*/

/**
 *	An event handler that processes the user panel login button.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function panel_login_handler(a_Event_Object)
{
	//log_message('**********panel_login_handler()');

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	Active_Display.login_handler();
}


/**
 *	An event handler for a pre-login reset message.
 *
 *	@param	{string} a_sTransferID The unique identifier for the transfer
 *	@param	{integer} a_nStatus_Code The termination status code
 *	@param	{string} a_sStatus_Text The termination status text message
 *	@param	{string} a_sResponse_Text The received text
 *	@param	{object} a_sResponse_XML The received XML
 *
 *	@return	none
 *	@type	void
 */

function reset_reply(a_sTransferID, a_nStatus_Code, a_sStatus_Text, a_sResponse_Text, a_sResponse_XML)
{
	var bValid_Transfer = true;
	var sTransfer_Response = '';

	//alert('reset_reply() - XmlHttp request termination status = ' + a_nStatus_Code + '\n' + a_sStatus_Text);
	//log_message('**********reset_reply() - XmlHttp request termination status = ' + a_nStatus_Code + '<br>[' + a_sStatus_Text + ']');

	if (a_nStatus_Code == 200) {
		bValid_Transfer = true;
		sTransfer_Response = a_sResponse_Text;
	}
	else {
		bValid_Transfer = false;
		sTransfer_Response = a_nStatus_Code;
		if (a_sStatus_Text.length > 0) {
			sTransfer_Response += ': ' + a_sStatus_Text;
		}
	}
	//alert('reset_reply -- sTransfer_Response = \n[' + sTransfer_Response + ']');
	//log_message('**********reset_reply() -- sTransfer_Response = <br>[' + sTransfer_Response + ']');

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('panel controller not found by reset_reply().');
		return;
	}

	var rUser_Panel = rPanel_Controller.fetch_display('user_session');
	if (is_null(rUser_Panel)) {
		alert('user_session panel not found by reset_reply().');
		return;
	}

	rUser_Panel.login_request(a_sTransferID, bValid_Transfer, sTransfer_Response);
}
/*	if (is_null(a_sTransferID)
		|| (!is_string(a_sTransferID))
		|| (a_sTransferID.length == 0)
		|| (a_sTransferID != RESET_ID)) {
		a_asError_Message[0] = 'Invalid transfer ID.';
		return;
	}

	alert('reset reply');
	//if (status != 200) {
		alert('XmlHttp request termination status = ' + status + '\n'
														+ statusText);
	//}
	//else {
		//dataset_datafield_strings[transferID] = responseText;
		//select_dataset_field_listing_panel_part2(transferID);
	//}

	var response = responseText;

	var display_list = document.getElementById("the_list");
	var response_element = document.createElement('li');
	var response_element_text = document.createTextNode('[' + response + '] (' + response.length + ')');
	response_element.appendChild(response_element_text);
	display_list.appendChild(response_element);

	login_handler(response);
}
*/

/**
 *	An event handler for a login completion message.
 *
 *	@param	{string} a_sTransferID The unique identifier for the transfer
 *	@param	{integer} a_nStatus_Code The termination status code
 *	@param	{string} a_sStatus_Text The termination status text message
 *	@param	{string} a_sResponse_Text The received text
 *	@param	{object} a_sResponse_XML The received XML
 *
 *	@return	none
 *	@type	void
 */

function register_reply(a_sTransferID, a_nStatus_Code, a_sStatus_Text, a_sResponse_Text, a_sResponse_XML)
{
	var bValid_Transfer = true;
	var sTransfer_Response = '';

	//alert('register_reply() - XmlHttp request termination status = ' + a_nStatus_Code + '\n' + a_sStatus_Text);
	//log_message('**********register_reply() - XmlHttp request termination status = ' + a_nStatus_Code + '<br>[' + a_sStatus_Text) + ']';

	if (a_nStatus_Code == 200) {
		bValid_Transfer = true;
		sTransfer_Response = a_sResponse_Text;
	}
	else {
		bValid_Transfer = false;
		sTransfer_Response = a_nStatus_Code;
		if (a_sStatus_Text.length > 0) {
			sTransfer_Response += ': ' + a_sStatus_Text;
		}
	}
	//alert('register_reply -- sTransfer_Response = \n[' + sTransfer_Response + ']');
	//log_message('**********register_reply() -- sTransfer_Response = <br>[' + sTransfer_Response + ']');

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('panel controller not found by register_reply().');
		return;
	}

	var rUser_Panel = rPanel_Controller.fetch_display('user_session');
	if (is_null(rUser_Panel)) {
		alert('user_session panel not found by register_reply().');
		return;
	}

	rUser_Panel.login_completion(a_sTransferID, bValid_Transfer, sTransfer_Response);
}
/*	if (is_null(a_sTransferID)
		|| (!is_string(a_sTransferID))
		|| (a_sTransferID.length == 0)
		|| (a_sTransferID != LOGIN_ID)) {
		a_asError_Message[0] = 'Invalid transfer ID.';
		return;
	}

	//if (status != 200) {
		alert('XmlHttp request termination status = ' + status + '\n'
														+ statusText);
	//}
	//else {
		//dataset_datafield_strings[transferID] = responseText;
		//select_dataset_field_listing_panel_part2(transferID);
	//}

	var response = responseText;

	var display_list = document.getElementById("the_list");
	var response_element = document.createElement('li');
	var response_element_text = document.createTextNode('[' + response + '] (' + response.length + ')');
	response_element.appendChild(response_element_text);
	display_list.appendChild(response_element);

	reply_handler(response);
}
*/

/**
 *	An event handler that processes the user panel logout button.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function panel_logout_handler(a_Event_Object)
{
	//log_message('**********panel_logout_handler()');

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	Active_Display.logout_handler();
}


/**
 *	An event handler for a logout confirmation message.
 *
 *	@param	{string} a_sTransferID The unique identifier for the transfer
 *	@param	{integer} a_nStatus_Code The termination status code
 *	@param	{string} a_sStatus_Text The termination status text message
 *	@param	{string} a_sResponse_Text The received text
 *	@param	{object} a_sResponse_XML The received XML
 *
 *	@return	none
 *	@type	void
 */

function clear_reply(a_sTransferID, a_nStatus_Code, a_sStatus_Text, a_sResponse_Text, a_sResponse_XML)
{
	var bValid_Transfer = true;
	var sTransfer_Response = '';

	//alert('clear_reply() - XmlHttp request termination status = ' + a_nStatus_Code + '\n' + a_sStatus_Text);
	//log_message('**********clear_reply() - XmlHttp request termination status = ' + a_nStatus_Code + '<br>' + a_sStatus_Text + ']');

	if (a_nStatus_Code == 200) {
		bValid_Transfer = true;
		sTransfer_Response = a_sResponse_Text;
	}
	else {
		bValid_Transfer = false;
		sTransfer_Response = a_nStatus_Code;
		if (a_sStatus_Text.length > 0) {
			sTransfer_Response += ': ' + a_sStatus_Text;
		}
	}
	//alert('clear_reply -- sTransfer_Response = \n[' + sTransfer_Response + ']');
	//log_message('**********clear_reply() -- sTransfer_Response = <br>[' + sTransfer_Response + ']');

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('panel controller not found by clear_reply().');
		return;
	}

	var rUser_Panel = rPanel_Controller.fetch_display('user_session');
	if (is_null(rUser_Panel)) {
		alert('user_session panel not found by clear_reply().');
		return;
	}

	rUser_Panel.logout_completion(a_sTransferID, bValid_Transfer, sTransfer_Response);
}
/*	if (is_null(a_sTransferID)
		|| (!is_string(a_sTransferID))
		|| (a_sTransferID.length == 0)
		|| (a_sTransferID != LOGIN_ID)) {
		a_asError_Message[0] = 'Invalid transfer ID.';
		return;
	}

	//if (status != 200) {
		alert('XmlHttp request termination status = ' + status + '\n'
														+ statusText);
	//}
	//else {
		//dataset_datafield_strings[transferID] = responseText;
		//select_dataset_field_listing_panel_part2(transferID);
	//}

	var response = responseText;

	var display_list = document.getElementById("the_list");
	var response_element = document.createElement('li');
	var response_element_text = document.createTextNode('[' + response + '] (' + response.length + ')');
	response_element.appendChild(response_element_text);
	display_list.appendChild(response_element);

	reply_handler(response);
}
*/


/**
 *	An event handler triggered only for new selections in the dataset panel dropdown box.
 *
 *	This selects the group of datasets to display in the panel table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function dataset_selector_change(a_Event_Object) {
	var eActive_Selector = find_event_target(a_Event_Object, 'select', false);
	if (eActive_Selector == null) {
		return;
	}

	// Finicky but both elements should be the same.
	var eDataset_Selector = document.getElementById('dataset_group');
	if (eDataset_Selector != eActive_Selector) {
		return;
	}

	get_dataset_group(eDataset_Selector.value);
}


/**
 *	An event handler that processes events for both the 'sort by name' and
 *	'group by experiment' checkboxes as used with the dataset listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */
/*
function dataset_row_ordering_click(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	Active_Display.set_row_ordering(eEvent_Target.name, eEvent_Target.checked);
}
*/

/**
 *	An event handler that processes events for the dataset listing table
 *	'group by experiment'/'sort by name' row order selection button.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function dataset_row_ordering_click(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

//	Active_Display.set_row_ordering(eEvent_Target);
	Active_Display.toggle_row_ordering();
}


/**
 *	An event handler for the column help button used with the dataset listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function dataset_column_help_click(a_Event_Object)
{
	var sNew_Button_Text = '';

	bDataset_Column_Help_Active = !bDataset_Column_Help_Active;
	sNew_Button_Text = ((bDataset_Column_Help_Active == true) ? sHide_Column_Help_Msg : sShow_Column_Help_Msg);

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	eEvent_Target.value = sNew_Button_Text;
	Active_Display.set_column_help(bDataset_Column_Help_Active);
}


/**
 *	An event handler for the dataset selection checkboxes in the dataset listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function check_click(a_Event_Object)
{
	var asIdentifier_List = Array(2);

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	// Identifier[0] = this.m_asGroup_Definition[nField_Definition_Offset + DG_NAME];
	// Identifier[1] = this.m_asGroup_Definition[nField_Definition_Offset + DG_LABEL];
	if (!Active_Display.get_dataset_details(eEvent_Target, asIdentifier_List)) {
		return;
	}

	var rPanel_Selector = locate_registered_object('main_selector');
	if (is_null(rPanel_Selector)) {
		return;
	}

	if (eEvent_Target.checked != true) {
		rPanel_Selector.remove_tab(asIdentifier_List[0]);
		rPanel_Controller.remove_display(asIdentifier_List[0]);
	}
	else {
		var rDisplay_Factory = locate_registered_object('main_factory');
		if (is_null(rDisplay_Factory)) {
			return;
		}

		var arObject_Set = Array();
		var bResult_Status = rDisplay_Factory.make_new_panel(asIdentifier_List[0],
															 'datafield_type', arObject_Set);
		if (bResult_Status == true) {
			//alert(arObject_Set[0].print_state());
			arObject_Set[0].set_label_name(asIdentifier_List[1]);
			rPanel_Controller.add_new_display(arObject_Set);
			//alert(rPanel_Controller.print_state());
			rPanel_Selector.append_tab(asIdentifier_List[0], asIdentifier_List[1]);
			//alert(rPanel_Selector.print_state());
		}
	}
}


/**
 *	An event handler for the dataset field listing tab bar.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function field_link_click(a_Event_Object)
{
//	var asActivated_Tab_Details = Array();

	var eEvent_Target = find_event_target(a_Event_Object, 'a', true);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'a')
		return;

	// Remove the focus from the tab to eliminate
	// the dotted line 'focus' box in Mozilla browsers
	// which ruins the tab/tab-panel connection effect.
	// TAKEN OUT FOR IE TO FIX A TAB BLANKING BUG
	if (typeof window.ActiveXObject == "undefined") {
		eEvent_Target.blur();
	}

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}
	//alert(Active_Display.m_sDisplay_Name);
	(Active_Display.get_selection_display()).tab_activation(eEvent_Target);


//	Active_Display.field_filtering_selection(eEvent_Target);

////	if (!Active_Display.get_activated_row_details(eEvent_Target, asActivated_Row_Details)) {
////		return;
////	}
}


/**
 *	An event handler that processes events for the field listing table
 *	'group by field type'/'sort by field name' row order selection button.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function datafield_row_ordering_click(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

//	Active_Display.set_row_ordering(eEvent_Target);
	Active_Display.toggle_row_ordering();
}


/**
 *	An event handler for the column help button used with the datafield listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function datafield_column_help_click(a_Event_Object)
{
	var sNew_Button_Text = '';

	bDatafield_Column_Help_Active = !bDatafield_Column_Help_Active;
	sNew_Button_Text = ((bDatafield_Column_Help_Active == true) ? sHide_Column_Help_Msg : sShow_Column_Help_Msg);

	//var eEvent_Target = find_event_target(a_Event_Object, 'button', false);
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	//if (eEvent_Target.nodeName.toLowerCase() != 'button')
	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	eEvent_Target.value = sNew_Button_Text;
	Active_Display.set_column_help(bDatafield_Column_Help_Active);
}


/**
 *	An event handler supporting requests to remove/reshow field listings.
 *
 *	@param	{object} e The event object (if not running in IE)
 *
 *	@return	none
 *	@type	void
 */
/*
function remove_click(e) {
	var etarget = find_event_target(e, 'input', true);
	if (!etarget) return;

	if (etarget.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	etarget.blur();

	var dataset_fields_dataset = document.getElementById('dataset_field_listing_dataset');
	if (!dataset_fields_dataset) {
		alert('dataset name control not found');
		return;
	}

	var state_descriptor = get_dataset_state(dataset_fields_dataset.value);

	if ((state_descriptor[0] & display_flag) != 0) {
		etarget.value = reshow_msg;
		state_descriptor[0] &= undisplay_mask;
		remove_unchecked_fields();
	}
	else {
		etarget.value = remove_msg;
		state_descriptor[0] |= display_flag;
		reshow_unchecked_fields();
	}
}
*/

/**
 *	An event handler for the field extraction selection checkboxes in the datafield listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function check_click2(a_Event_Object)
{
//	var asActivated_Row_Details = Array();

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafield_display()).field_extraction_selection(eEvent_Target);

//	if (!Active_Display.get_activated_row_details(eEvent_Target, asActivated_Row_Details)) {
//		return;
//	}
}


/**
 *	An event handler for the field filtering selection checkboxes in the datafield listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function check_click3(a_Event_Object)
{
//	var asActivated_Row_Details = Array();

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafield_display()).field_filtering_selection(eEvent_Target);

//	if (!Active_Display.get_activated_row_details(eEvent_Target, asActivated_Row_Details)) {
//		return;
//	}
}


/**
 *	An event handler for the field-range display toggle
 *	in the header of the dataset field listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function toggle_all_click(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'img', true);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'img')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafield_display()).header_toggle(eEvent_Target);
}

//	var label = new String('');
//	var target_row = find_target_toggle_row(e);
//	if (!target_row) return;
//
//	if (target_row.nodeName.toLowerCase() != 'tr')
//		return;
//
//	var cells = target_row.getElementsByTagName('td');
//	if (cells.length != 4) return;
//
//	if( (cells[1].childNodes.length > 0)
//		&& (cells[1].firstChild.nodeType == 3) ) {
//		label = cells[1].firstChild.nodeValue;
//	}
//
//	var expansion_data_string = get_datafield_expansion_data(label);
//	var expansion_type = extract_datafield_expansion_type(expansion_data_string);
//	var expansion_content = format_datafield_expansion_content(expansion_data_string);
//
//	var image = find_child_image(cells[2]);
//	if (!image) return;
//
//	if (image.src.indexOf('plus.gif') != -1) {
//		expand_datafield_row(target_row, expansion_type, expansion_content);
//		cells[2].className = 'merge2';
//		cells[3].className = 'continue';
//		var index = image.src.indexOf('plus.gif');
//		image.src = image.src.substr(0, index) + 'minus.gif';
//	}
//	else {
//		if (image.src.indexOf('minus.gif') != -1) {
//			collapse_datafield_row(target_row);
//			cells[2].className = 'merge';
//			cells[3].className = '';
//			var index = image.src.indexOf('minus.gif');
//			image.src = image.src.substr(0, index) + 'plus.gif';
//		}
//	}
//}


/**
 *	An event handler for the field-range display toggle
 *	in each row of the dataset field listing table.
 *
 *	@param	{object} e The event object (if not running in IE)
 *
 *	@return	none
 *	@type	void
 */
/*
function toggle_click(e)
{
//	var label = new String('');
	var target = find_event_target(e, 'img', true);
	if (!target) return;

	if (target.nodeName.toLowerCase() != 'img')
		return;

	var target_row = find_parent_element(target, 'tr');
	if (!target_row) return;

	if (target_row.nodeName.toLowerCase() != 'tr')
		return;

	var dataset_fields_dataset = document.getElementById('dataset_field_listing_dataset');
	if (!dataset_fields_dataset) {
		alert('dataset name control not found');
		return;
	}

	var state_descriptor = get_dataset_state(dataset_fields_dataset.value);

	var index = 0;
	switch (target.className) {

	case 'show_all':
			index = target.src.indexOf('plus.gif');
			target.src = target.src.substr(0, index) + 'minus.gif';
			target.className = 'hide_all';
			target.title = "Collapse";
			state_descriptor[target_row.name] |= expand_flag;
			show_field_range(target_row);
			break;

	case 'hide_all':
			index = target.src.indexOf('minus.gif');
			target.src = target.src.substr(0, index) + 'plus.gif';
			target.className = 'show_all';
			target.title = "Expand";
			state_descriptor[target_row.name] &= unexpand_mask;
			hide_field_range(target_row);
			break;

	default:
			break;
	}
}
*/

/**
 *	An event handler for the column help button used with the datafilter listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function datafilter_column_help_click(a_Event_Object)
{
	var sNew_Button_Text = '';

	bDatafilter_Column_Help_Active = !bDatafilter_Column_Help_Active;
	sNew_Button_Text = ((bDatafilter_Column_Help_Active == true) ? sHide_Column_Help_Msg : sShow_Column_Help_Msg);

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	eEvent_Target.value = sNew_Button_Text;
	Active_Display.set_column_help(bDatafilter_Column_Help_Active);
}



/**
 *	An event handler for the set field search value(s) button in the datafilter listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function set_button_click(a_Event_Object)
{
//	var asActivated_Row_Details = Array();

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafilter_display()).filter_field_selection(eEvent_Target);

//	if (!Active_Display.get_activated_row_details(eEvent_Target, asActivated_Row_Details)) {
//		return;
//	}
}



/**
 *	An event handler monitoring the activation of the search value field in the datafilter listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function value_field_activation(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafilter_display()).select_set_value();
}



/**
 *	An event handler monitoring the activation of the search range fields in the datafilter listing table.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function range_field_activation(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafilter_display()).select_set_range();
}


/**
 *	An event handler for the 'accept' button in the range selection section of the datafilter listing display.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function range_values_accept(a_Event_Object)
{
//	var asActivated_Row_Details = Array();

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafilter_display()).range_value_selection(eEvent_Target);

//	if (!Active_Display.get_activated_row_details(eEvent_Target, asActivated_Row_Details)) {
//		return;
//	}
}


/**
 *	An event handler for the 'accept' button in the list selection section of the datafilter listing display.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function list_values_accept(a_Event_Object)
{
//	var asActivated_Row_Details = Array();

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafilter_display()).list_value_selection(eEvent_Target);

//	if (!Active_Display.get_activated_row_details(eEvent_Target, asActivated_Row_Details)) {
//		return;
//	}
}


/**
 *	An event handler for the cell 'expander' button in the list selection section of the datafilter listing display.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function toggle_expander_cell(a_Event_Object)
{
	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	if (eEvent_Target.type != 'button')
		return;

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_datafilter_display()).toggle_expander_cell(eEvent_Target);
}


/**
 *	An event handler for the 'data extraction' button in the extract-order display.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function extract_click(a_Event_Object) {

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	eEvent_Target.blur();

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	Active_Display.request_data_extraction();
	//request_data_extraction();
}


/**
 *	An event handler for the 'add sort field' button in the extract-order display.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function add_sort_field_click(a_Event_Object) {

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	eEvent_Target.blur();

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_extract_display()).add_sort_field();
}


/**
 *	An event handler for the 'remove sort field' button in the extract-order display.
 *
 *	@param	{object} a_Event_Object The event object (when not running in IE)
 *
 *	@return	none
 *	@type	void
 */

function remove_sort_field_click(a_Event_Object) {

	var eEvent_Target = find_event_target(a_Event_Object, 'input', false);
	if (!eEvent_Target) return;

	if (eEvent_Target.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	eEvent_Target.blur();

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return;
	}

	var Active_Display = rPanel_Controller.get_active_display();
	if (is_null(Active_Display)) {
		return;
	}

	(Active_Display.get_extract_display()).remove_sort_field();
}


/**
 *	An event handler for the completion of a data field information transfer.
 *
 *	@param	{string} transferID The unique identifier for the transfer
 *	@param	{integer} status The termination status code
 *	@param	{string} statusText The termination status text message
 *	@param	{string} responseText The received text
 *	@param	{object} responseXML The received XML
 *
 *	@return	none
 *	@type	void
 */
/*
function DatafieldsReceived(transferID, status, statusText, responseText, responseXML)
{
	if (status != 200) {
		alert('XmlHttp request termination status = ' + xhr.status + '\n'
														+ xhr.statusText);
	}
	else {
		dataset_datafield_strings[transferID] = responseText;
		select_dataset_field_listing_panel_part2(transferID);
	}
}
*/

/**
 *	Validate and process metadata for a dataset group.
 *
 *	@param	{string} a_sGroup_Name The internal application-wide identifier for the group (and its display).
 *	@param	{string} a_sResponse_String The server response carrying the dataset group definition.
 *	@param	{array} a_asGroup_Datasets An array to receive the group dataset definition.
 *	@param	{array} a_asGroup_Ordering An array to receive the group dataset ordering definition.
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	True if successful, otherwise false.
 *	@type	boolean
 */

function process_dataset_group_definition(a_sGroup_Name, a_sResponse_String, a_asGroup_Datasets, a_asGroup_Ordering, a_asError_Message)
{
	var nTransfer_Number = 0;
	var asResponse_Fields = Array();
	var nResponse_Fields_Count = 0;
	var nHeader_Offset = 0;

	var asDefinition_Fields = Array();

	a_asError_Message[0] = '';

	if ((a_asGroup_Datasets.length != 0) || (a_asGroup_Ordering.length != 0)) {
		a_asError_Message[0] = 'Invalid group arrays in transfer call.';
		return (false);
	}

	if (is_null(a_sGroup_Name)
		|| (!is_string(a_sGroup_Name))
		|| (a_sGroup_Name.length == 0)) {
		a_asError_Message[0] = 'Invalid group name in transfer call.';
		return (false);
	}

	if (is_null(a_sResponse_String)
		|| (!is_string(a_sResponse_String))
		|| (a_sResponse_String.length == 0)) {
		a_asError_Message[0] = 'No response from server.';
		return (false);
	}

	asResponse_Fields = a_sResponse_String.split('!-!');
	nResponse_Fields_Count = asResponse_Fields.length;

	// Ensure we at least have a minimal valid response - ie a server error message.
	// (NB both a leading and a trailing string are always forced onto the response).
	if ((nResponse_Fields_Count < (DATASET_GROUP_UNIT_LENGTH + 2))
		|| ((nResponse_Fields_Count % DATASET_GROUP_UNIT_LENGTH) != 2)) {
		a_asError_Message[0] = 'Invalid response from server.';
		return (false);
	}

	nHeader_Offset = 1;

	// Ensure we have the correct/expected server response.
	if ((asResponse_Fields[nHeader_Offset + TR_SEQC] != nTransfer_Number)
		|| (asResponse_Fields[nHeader_Offset + TR_TYPE] != LOGIN_ID)) {
		a_asError_Message[0] = 'Unexpected server response.';
		return (false);
	}

	// Do we have a server error message?
	if (asResponse_Fields[nHeader_Offset + TR_CODE] == 0) {
		if ((asResponse_Fields[nHeader_Offset + TR_TEXT]).length > 0) {
			a_asError_Message[0] = asResponse_Fields[nHeader_Offset + TR_TEXT];
		}
		else {
			a_asError_Message[0] = 'Server error. No message attached.';
		}
		return (false);
	}

	asDefinition_Fields = asResponse_Fields.slice((DATASET_GROUP_UNIT_LENGTH + 1), -1);
	if (split_dataset_group_definition(a_sGroup_Name, asDefinition_Fields, a_asGroup_Datasets,
											a_asGroup_Ordering, a_asError_Message) == false) {
		if (a_asError_Message[0].length == 0) {
			a_asError_Message[0] = 'Invalid group definition from server.';
		}
		return (false);
	}

	return (true);
}


/**
 *	Split the isolated dataset group definition message after validating the message structure.
 *
 *	@param	{string} a_sGroup_Name The internal application-wide identifier for the group (and its display).
 *	@param	{string} a_asDefinition_Fields An array holding the received (full) dataset group definition.
 *	@param	{array} a_asGroup_Datasets An array to receive the separated dataset group definition.
 *	@param	{array} a_asGroup_Ordering An array to receive the separated dataset ordering definition.
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	True if successful, otherwise false.
 *	@type	boolean
 */

function split_dataset_group_definition(a_sGroup_Name, a_asDefinition_Fields, a_asGroup_Datasets, a_asGroup_Ordering, a_asError_Message)
{
	var nx = 0;
	var nip = 0;
	var nDefinition_Fields_Count = a_asDefinition_Fields.length;
	var nDataset_Header_Offset = 0;
	var nOrdering_Header_Offset = 0;

	// First confirm the total number of fields in the definition is valid/workable.
	// The leading string, trailing string and transfer header have all been removed
	// so the minimum valid message is 3 headers ie a message header followed by both
	// dataset group and dataset ordering section headers without any section elements.
	// Not only are all 3 headers needed to define even an empty dataset group but they
	// must always be present - as must any headers for sections added at a future date.
	// This is simply so that sections can be identified - from their pre-defined order.
	// To be able to completely omit empty sections, including their section headers,
	// all headers would need to carry a section identifier.
	if ((nDefinition_Fields_Count < (DATASET_GROUP_UNIT_LENGTH * 3))
		|| ((nDefinition_Fields_Count % DATASET_GROUP_UNIT_LENGTH) != 0)) {
		return (false);
	}

	// Check for the message header marker (ie the message header is located).
	if ((a_asDefinition_Fields[MT_FLAG_1] != 0)
		|| (a_asDefinition_Fields[MT_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate at least the minimum number of sections are present.
	if (a_asDefinition_Fields[MT_NUMBER] < 2) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate the total number of entries using the message header.
	if (nDefinition_Fields_Count !=
			(a_asDefinition_Fields[MT_ENTRYS] * DATASET_GROUP_UNIT_LENGTH)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate the intended message target using the message header.
	if (a_asDefinition_Fields[MT_TARGET] != a_sGroup_Name) {
		a_asError_Message[0] = 'Incorrect server response.';
		return (false);
	}

	nDataset_Header_Offset = DATASET_GROUP_UNIT_LENGTH;

	// Check the dataset group header marker is found.
	if ((a_asDefinition_Fields[nDataset_Header_Offset + DG_FLAG_1] != 0)
		|| (a_asDefinition_Fields[nDataset_Header_Offset + DG_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	nOrdering_Header_Offset = nDataset_Header_Offset
				+ (a_asDefinition_Fields[nDataset_Header_Offset + DG_ENTRYS] * DATASET_GROUP_UNIT_LENGTH);

	// Check the dataset ordering header marker is found
	// (also checks the dataset group header entry count).
	if ((a_asDefinition_Fields[nOrdering_Header_Offset + DO_FLAG_1] != 0)
		|| (a_asDefinition_Fields[nOrdering_Header_Offset + DO_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Now check all declared header lengths are in agreement
	// (also checks the dataset ordering header entry count).
	// NB need to add one for the message header itself.
	if (a_asDefinition_Fields[MT_ENTRYS] != (1
							+ parseInt(a_asDefinition_Fields[nDataset_Header_Offset + DG_ENTRYS], 10)
							+ parseInt(a_asDefinition_Fields[nOrdering_Header_Offset + DO_ENTRYS], 10))) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Validate the number of datasets listed.
	if (a_asDefinition_Fields[nDataset_Header_Offset + DG_NUMBER] != 
			(a_asDefinition_Fields[nDataset_Header_Offset + DG_ENTRYS] - 1)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Return valid and empty when no datasets are listed.
	if (a_asDefinition_Fields[nDataset_Header_Offset + DG_NUMBER] == 0) {
		//alert('no datasets');
		return (true);
	}

	// Return invalid and empty when there are datasets listed but no orderings for them.
	if ((a_asDefinition_Fields[nOrdering_Header_Offset + DO_NUMBER] == 0)
		|| (a_asDefinition_Fields[nOrdering_Header_Offset + DO_ENTRYS] == 1)) {
		//alert('no orderings');
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Validate the number of orderings listed.
	var nctr = 0;
	var nEntry_Offset = nOrdering_Header_Offset;
	var nEntry_Count = a_asDefinition_Fields[nOrdering_Header_Offset + DO_ENTRYS];
	for (nx=1; nx<nEntry_Count; nx++) {
		nEntry_Offset += DATASET_GROUP_UNIT_LENGTH;
		if (a_asDefinition_Fields[nEntry_Offset + DO_SOH] == 0) {
			nctr++;
		}
	}
	if (a_asDefinition_Fields[nOrdering_Header_Offset + DO_NUMBER] != nctr) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

//	// A final check on the definition offsets.
//	if ((((nOrdering_Header_Offset - DATASET_GROUP_UNIT_LENGTH) % DATASET_GROUP_UNIT_LENGTH) != 0)
//		|| (((nDefinition_Fields_Count - nOrdering_Header_Offset) % DATASET_GROUP_UNIT_LENGTH) != 0)) {
//		return (false);
//	}

	// NB must copy to outgoing dataset-group definition argument,
	// can't just use slice(((DATASET_GROUP_UNIT_LENGTH * 2) + 1), nOrdering_Header_Offset);
	// Also note we're not forwarding either the message header or the dataset-group header
	// but only the dataset-group dataset field definition entries.
	nip = 0;
	nx = DATASET_GROUP_UNIT_LENGTH + DATASET_GROUP_UNIT_LENGTH;		// skip both headers.
	while (nx<nOrdering_Header_Offset) {
		a_asGroup_Datasets[nip] = a_asDefinition_Fields[nx];
		nip++;
		nx++;
	}

	// NB must copy to outgoing dataset-group ordering argument,
	// can't just use slice((nOrdering_Header_Offset + DATASET_GROUP_UNIT_LENGTH), -1);
	// Also note we're not forwarding the dataset-group ordering header
	// but only the dataset-group ordering definition entries.
	nip = 0;
	nx = nOrdering_Header_Offset + DATASET_GROUP_UNIT_LENGTH;		// skip the ordering header.
	while(nx<nDefinition_Fields_Count) {
		a_asGroup_Ordering[nip] = a_asDefinition_Fields[nx];
		nip++;
		nx++
	}

	return (true);
}


/**
 *	Validate and process metadata for dataset fields.
 *
 *	@param	{string} a_sDisplay_Name The internal application-wide identifier for the dataset (and its display).
 *	@param	{string} a_sResponse_String The server response carrying the field-set definition.
 *	@param	{array} a_asField_Definition An array to receive the field-set definition.
 *	@param	{array} a_asField_Ordering An array to receive the field-set ordering definition.
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	True if successful, otherwise false.
 *	@type	boolean
 */

function process_dataset_fieldset_definition2(a_sDisplay_Name, a_sResponse_String, a_asField_Definition, a_asField_Ordering, a_asError_Message)
{
	var asResponse_Fields = Array();
	var nResponse_Fields_Count = 0;
	var nHeader_Offset = 0;

	var asDefinition_Fields = Array();

	a_asError_Message[0] = '';

	if ((a_asField_Definition.length != 0) || (a_asField_Ordering.length != 0)) {
		a_asError_Message[0] = 'Invalid fieldset arrays.';
		return (false);
	}

	if (is_null(a_sDisplay_Name)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		a_asError_Message[0] = 'Invalid dataset name.';
		return (false);
	}

	if (is_null(a_sResponse_String)
		|| (!is_string(a_sResponse_String))
		|| (a_sResponse_String.length == 0)) {
		a_asError_Message[0] = 'Response string error.';
		return (false);
	}

	asResponse_Fields = a_sResponse_String.split('!-!');
	nResponse_Fields_Count = asResponse_Fields.length;

	// Ensure we at least have a minimal valid response - ie a server error message.
	// (NB both a leading and a trailing string are always forced onto the response).
	if ((nResponse_Fields_Count < (DATAFIELD_SET_UNIT_LENGTH + 2))
		|| ((nResponse_Fields_Count % DATAFIELD_SET_UNIT_LENGTH) != 2)) {
		a_asError_Message[0] = 'Invalid response from server.';
		return (false);
	}

	nHeader_Offset = 1;

	// Ensure we have the correct/expected server response type.
	if (asResponse_Fields[nHeader_Offset + TR_TYPE] != TABLE_ID) {
		a_asError_Message[0] = 'Unexpected server response.';
		return (false);
	}

	// Do we have a server error message?
	if (asResponse_Fields[nHeader_Offset + TR_CODE] != 0) {
		a_asError_Message[0] = 'Server error: ' + asResponse_Fields[nHeader_Offset + TR_CODE];
		if ((asResponse_Fields[nHeader_Offset + TR_TEXT]).length > 0) {
			a_asError_Message[0] += ' -- ' + asResponse_Fields[nHeader_Offset + TR_TEXT];
		}
		return (false);
	}

	// Remove the transfer header before separating the message components.
	asDefinition_Fields = asResponse_Fields.slice((DATAFIELD_SET_UNIT_LENGTH + 1), -1);
	if (split_dataset_fieldset_definition2(a_sDisplay_Name, asDefinition_Fields, a_asField_Definition,
											a_asField_Ordering, a_asError_Message) == false) {
		if (a_asError_Message[0].length == 0) {
			a_asError_Message[0] = 'Invalid fieldset definition received from server.';
		}
		return (false);
	}

	return (true);
}


/**
 *	Split the isolated dataset field-set definition after validating its structural framework.
 *
 *	@param	{string} a_sDisplay_Name The internal application-wide identifier for the dataset (and its display).
 *	@param	{string} a_asDefinition_Fields An array holding the received (full) field-set definition.
 *	@param	{array} a_asField_Definition An array to receive the separated field-set definition.
 *	@param	{array} a_asField_Ordering An array to receive the separated field ordering definition.
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	True if successful, otherwise false.
 *	@type	boolean
 */

function split_dataset_fieldset_definition2(a_sDisplay_Name, a_asDefinition_Fields, a_asField_Definition, a_asField_Ordering, a_asError_Message)
{
	var nx = 0;
	var nip = 0;
	var nDefinition_Fields_Count = a_asDefinition_Fields.length;
	var nFieldset_Header_Offset = 0;
	var nOrdering_Header_Offset = 0;

	// First confirm the total number of fields in the definition is valid/workable.
	// The leading string, trailing string and transfer header have all been removed
	// so the minimum valid message is 3 headers ie a message header followed by both
	// field-set and field-set-ordering section headers without any section elements.
	// Not only are all 3 headers needed to define even an empty field-set but they
	// must always be present - as must any headers for sections added at a future date.
	// This is simply so that sections can be identified - from their pre-defined order.
	// To be able to completely omit empty sections, including their section headers,
	// all headers would need to carry a section identifier.
	if ((nDefinition_Fields_Count < (DATAFIELD_SET_UNIT_LENGTH * 3))
		|| ((nDefinition_Fields_Count % DATAFIELD_SET_UNIT_LENGTH) != 0)) {
		return (false);
	}

	// Check for the message header marker (ie the message header is located).
	if ((a_asDefinition_Fields[MT_FLAG_1] != 0)
		|| (a_asDefinition_Fields[MT_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate at least the minimum number of sections are present.
	if (a_asDefinition_Fields[MT_NUMBER] < 2) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate the total number of entries using the message header.
	if (nDefinition_Fields_Count !=
			(a_asDefinition_Fields[MT_ENTRYS] * DATAFIELD_SET_UNIT_LENGTH)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate the intended message target using the message header.
	if (a_asDefinition_Fields[MT_TARGET] != a_sDisplay_Name) {
		a_asError_Message[0] = 'Incorrect server response.';
		return (false);
	}

	nFieldset_Header_Offset = DATAFIELD_SET_UNIT_LENGTH;

	// Check the field-set header marker is found.
	if ((a_asDefinition_Fields[nFieldset_Header_Offset + FS_FLAG_1] != 0)
		|| (a_asDefinition_Fields[nFieldset_Header_Offset + FS_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	nOrdering_Header_Offset = nFieldset_Header_Offset
				+ (a_asDefinition_Fields[nFieldset_Header_Offset + FS_ENTRYS] * DATAFIELD_SET_UNIT_LENGTH);

	// Check the field-set ordering header marker is found
	// (also checks the field-set header entry count).
	if ((a_asDefinition_Fields[nOrdering_Header_Offset + FO_FLAG_1] != 0)
		|| (a_asDefinition_Fields[nOrdering_Header_Offset + FO_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Now check all declared header lengths are in agreement
	// (also checks the field-set ordering header entry count).
	// NB need to add one for the message header itself.
	if (a_asDefinition_Fields[MT_ENTRYS] != (1
							+ parseInt(a_asDefinition_Fields[nFieldset_Header_Offset + FS_ENTRYS], 10)
							+ parseInt(a_asDefinition_Fields[nOrdering_Header_Offset + FO_ENTRYS], 10))) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Validate the number of fields listed.
	if (a_asDefinition_Fields[nFieldset_Header_Offset + FS_NUMBER] != 
			(a_asDefinition_Fields[nFieldset_Header_Offset + FS_ENTRYS] - 1)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Return valid and empty when no fields are listed.
	if (a_asDefinition_Fields[nFieldset_Header_Offset + FS_NUMBER] == 0) {
		//alert('no fields');
		return (true);
	}

	// Return invalid and empty when there are fields listed but no orderings for them.
	if ((a_asDefinition_Fields[nOrdering_Header_Offset + FO_NUMBER] == 0)
		|| (a_asDefinition_Fields[nOrdering_Header_Offset + FO_ENTRYS] == 1)) {
		//alert('no orderings');
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Validate the number of orderings listed.
	var nOrdering_Count = 0;
	var nEntry_Count = a_asDefinition_Fields[nOrdering_Header_Offset + FO_ENTRYS];
	// Note the loop must start from 1 because we're skipping the ordering header.
	var nEntry_Offset = nOrdering_Header_Offset + DATAFIELD_SET_UNIT_LENGTH;
	for (nx=1; nx<nEntry_Count; nx++) {
		if (a_asDefinition_Fields[nEntry_Offset + FO_SOH] == 0) {
			nOrdering_Count++;
		}
		nEntry_Offset += DATAFIELD_SET_UNIT_LENGTH;
	}
	if (a_asDefinition_Fields[nOrdering_Header_Offset + FO_NUMBER] != nOrdering_Count) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

//	// A final check on the definition offsets.
//	if ((((nOrdering_Header_Offset - DATAFIELD_SET_UNIT_LENGTH) % DATAFIELD_SET_UNIT_LENGTH) != 0)
//		|| (((nDefinition_Fields_Count - nOrdering_Header_Offset) % DATAFIELD_SET_UNIT_LENGTH) != 0)) {
//		return (false);
//	}

	// NB must copy to outgoing field-set definition argument,
	// can't just use slice(((DATAFIELD_SET_UNIT_LENGTH * 2) + 1), nOrdering_Header_Offset);
	// Also note we're not forwarding either the message header or the field-set header
	// but only the field-set field definition entries.
	nip = 0;
	nx = DATAFIELD_SET_UNIT_LENGTH + DATAFIELD_SET_UNIT_LENGTH;		// skip both headers.
	while (nx<nOrdering_Header_Offset) {
		a_asField_Definition[nip] = a_asDefinition_Fields[nx];
		nip++;
		nx++;
	}

	// NB must copy to outgoing field-set ordering argument,
	// can't just use slice((nOrdering_Header_Offset + DATAFIELD_SET_UNIT_LENGTH), -1);
	// Also note we're not forwarding the field-set ordering header
	// but only the field-set ordering definition entries.
	nip = 0;
	nx = nOrdering_Header_Offset + DATAFIELD_SET_UNIT_LENGTH;		// skip the ordering header.
	while(nx<nDefinition_Fields_Count) {
		a_asField_Ordering[nip] = a_asDefinition_Fields[nx];
		nip++;
		nx++
	}

	return (true);
}


/**
 *	Validate and process metadata for dataset fields.
 *
 *	@param	{string} a_sDisplay_Name The internal application-wide identifier for the dataset (and its display).
 *	@param	{string} a_sResponse_String The server response carrying the field-set definition.
 *	@param	{array} a_asField_Definition An array to receive the field-set definition.
 *	@param	{array} a_asField_Ordering An array to receive the field-set ordering definition.
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	True if successful, otherwise false.
 *	@type	boolean
 */

function process_dataset_fieldset_definition(a_sDisplay_Name, a_sResponse_String, a_asField_Definition, a_asField_Ordering, a_asError_Message)
{
	var nTransfer_Number = 0;
	var asResponse_Fields = Array();
	var nResponse_Fields_Count = 0;
	var nHeader_Offset = 0;

	var asDefinition_Fields = Array();

	a_asError_Message[0] = '';

	if ((a_asField_Definition.length != 0) || (a_asField_Ordering.length != 0)) {
		a_asError_Message[0] = 'Invalid fieldset arrays in transfer call.';
		return (false);
	}

	if (is_null(a_sDisplay_Name)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		a_asError_Message[0] = 'Invalid dataset name in transfer call.';
		return (false);
	}

//	if (is_undefined(All_Field_Sets[a_sDisplay_Name])) {
//		a_asError_Message[0] = 'No response from server.';
//		return (false);
//	}

//	sResponse_String = All_Field_Sets[a_sDisplay_Name];

	if (is_null(a_sResponse_String)
		|| (!is_string(a_sResponse_String))
		|| (a_sResponse_String.length == 0)) {
		a_asError_Message[0] = 'No response from server.';
		return (false);
	}

	asResponse_Fields = a_sResponse_String.split('!-!');
	nResponse_Fields_Count = asResponse_Fields.length;

	// Ensure we at least have a minimal valid response - ie a server error message.
	// (NB both a leading and a trailing string are always forced onto the response).
	if ((nResponse_Fields_Count < (DATAFIELD_SET_UNIT_LENGTH + 2))
		|| ((nResponse_Fields_Count % DATAFIELD_SET_UNIT_LENGTH) != 2)) {
		a_asError_Message[0] = 'Invalid response from server.';
		return (false);
	}

	nHeader_Offset = 1;

	// Ensure we have the correct/expected server response.
	if ((asResponse_Fields[nHeader_Offset + TR_SEQC] != nTransfer_Number)
		|| (asResponse_Fields[nHeader_Offset + TR_TYPE] != TABLE_ID)) {
		a_asError_Message[0] = 'Unexpected server response.';
		return (false);
	}

	// Do we have a server error message?
	if (asResponse_Fields[nHeader_Offset + TR_CODE] != 0) {
		a_asError_Message[0] = 'Server error: ' + asResponse_Fields[nHeader_Offset + TR_CODE];
		if ((asResponse_Fields[nHeader_Offset + TR_TEXT]).length > 0) {
			a_asError_Message[0] += ' -- ' + asResponse_Fields[nHeader_Offset + TR_TEXT];
		}
		return (false);
	}

	// Remove the transfer header before separating the message components.
	asDefinition_Fields = asResponse_Fields.slice((DATAFIELD_SET_UNIT_LENGTH + 1), -1);
	if (split_dataset_fieldset_definition(a_sDisplay_Name, asDefinition_Fields, a_asField_Definition,
											a_asField_Ordering, a_asError_Message) == false) {
		if (a_asError_Message[0].length == 0) {
			a_asError_Message[0] = 'Invalid fieldset definition from server.';
		}
		return (false);
	}

	return (true);
}


/**
 *	Split the isolated dataset field-set definition after validating its structural framework.
 *
 *	@param	{string} a_sDisplay_Name The internal application-wide identifier for the dataset (and its display).
 *	@param	{string} a_asDefinition_Fields An array holding the received (full) field-set definition.
 *	@param	{array} a_asField_Definition An array to receive the separated field-set definition.
 *	@param	{array} a_asField_Ordering An array to receive the separated field ordering definition.
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	True if successful, otherwise false.
 *	@type	boolean
 */

function split_dataset_fieldset_definition(a_sDisplay_Name, a_asDefinition_Fields, a_asField_Definition, a_asField_Ordering, a_asError_Message)
{
	var nx = 0;
	var nip = 0;
	var nDefinition_Fields_Count = a_asDefinition_Fields.length;
	var nFieldset_Header_Offset = 0;
	var nOrdering_Header_Offset = 0;

	// First confirm the total number of fields in the definition is valid/workable.
	// The leading string, trailing string and transfer header have all been removed
	// so the minimum valid message is 3 headers ie a message header followed by both
	// field-set and field-set-ordering section headers without any section elements.
	// Not only are all 3 headers needed to define even an empty field-set but they
	// must always be present - as must any headers for sections added at a future date.
	// This is simply so that sections can be identified - from their pre-defined order.
	// To be able to completely omit empty sections, including their section headers,
	// all headers would need to carry a section identifier.
	if ((nDefinition_Fields_Count < (DATAFIELD_SET_UNIT_LENGTH * 3))
		|| ((nDefinition_Fields_Count % DATAFIELD_SET_UNIT_LENGTH) != 0)) {
		return (false);
	}

	// Check for the message header marker (ie the message header is located).
	if ((a_asDefinition_Fields[MT_FLAG_1] != 0)
		|| (a_asDefinition_Fields[MT_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate at least the minimum number of sections are present.
	if (a_asDefinition_Fields[MT_NUMBER] < 2) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate the total number of entries using the message header.
	if (nDefinition_Fields_Count !=
			(a_asDefinition_Fields[MT_ENTRYS] * DATAFIELD_SET_UNIT_LENGTH)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}
	// Validate the intended message target using the message header.
	if (a_asDefinition_Fields[MT_TARGET] != a_sDisplay_Name) {
		a_asError_Message[0] = 'Incorrect server response.';
		return (false);
	}

	nFieldset_Header_Offset = DATAFIELD_SET_UNIT_LENGTH;

	// Check the field-set header marker is found.
	if ((a_asDefinition_Fields[nFieldset_Header_Offset + FS_FLAG_1] != 0)
		|| (a_asDefinition_Fields[nFieldset_Header_Offset + FS_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	nOrdering_Header_Offset = nFieldset_Header_Offset
				+ (a_asDefinition_Fields[nFieldset_Header_Offset + FS_ENTRYS] * DATAFIELD_SET_UNIT_LENGTH);

	// Check the field-set ordering header marker is found
	// (also checks the field-set header entry count).
	if ((a_asDefinition_Fields[nOrdering_Header_Offset + FO_FLAG_1] != 0)
		|| (a_asDefinition_Fields[nOrdering_Header_Offset + FO_FLAG_2] != 0)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Now check all declared header lengths are in agreement
	// (also checks the field-set ordering header entry count).
	// NB need to add one for the message header itself.
	if (a_asDefinition_Fields[MT_ENTRYS] != (1
							+ parseInt(a_asDefinition_Fields[nFieldset_Header_Offset + FS_ENTRYS], 10)
							+ parseInt(a_asDefinition_Fields[nOrdering_Header_Offset + FO_ENTRYS], 10))) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Validate the number of fields listed.
	if (a_asDefinition_Fields[nFieldset_Header_Offset + FS_NUMBER] != 
			(a_asDefinition_Fields[nFieldset_Header_Offset + FS_ENTRYS] - 1)) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Return valid and empty when no fields are listed.
	if (a_asDefinition_Fields[nFieldset_Header_Offset + FS_NUMBER] == 0) {
		//alert('no fields');
		return (true);
	}

	// Return invalid and empty when there are fields listed but no orderings for them.
	if ((a_asDefinition_Fields[nOrdering_Header_Offset + FO_NUMBER] == 0)
		|| (a_asDefinition_Fields[nOrdering_Header_Offset + FO_ENTRYS] == 1)) {
		//alert('no orderings');
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

	// Validate the number of orderings listed.
	var nOrdering_Count = 0;
	var nEntry_Count = a_asDefinition_Fields[nOrdering_Header_Offset + FO_ENTRYS];
	// Note the loop must start from 1 because we're skipping the ordering header.
	var nEntry_Offset = nOrdering_Header_Offset + DATAFIELD_SET_UNIT_LENGTH;
	for (nx=1; nx<nEntry_Count; nx++) {
		if (a_asDefinition_Fields[nEntry_Offset + FO_SOH] == 0) {
			nOrdering_Count++;
		}
		nEntry_Offset += DATAFIELD_SET_UNIT_LENGTH;
	}
	if (a_asDefinition_Fields[nOrdering_Header_Offset + FO_NUMBER] != nOrdering_Count) {
		a_asError_Message[0] = 'Server response format error.';
		return (false);
	}

//	// A final check on the definition offsets.
//	if ((((nOrdering_Header_Offset - DATAFIELD_SET_UNIT_LENGTH) % DATAFIELD_SET_UNIT_LENGTH) != 0)
//		|| (((nDefinition_Fields_Count - nOrdering_Header_Offset) % DATAFIELD_SET_UNIT_LENGTH) != 0)) {
//		return (false);
//	}

	// NB must copy to outgoing field-set definition argument,
	// can't just use slice(((DATAFIELD_SET_UNIT_LENGTH * 2) + 1), nOrdering_Header_Offset);
	// Also note we're not forwarding either the message header or the field-set header
	// but only the field-set field definition entries.
	nip = 0;
	nx = DATAFIELD_SET_UNIT_LENGTH + DATAFIELD_SET_UNIT_LENGTH;		// skip both headers.
	while (nx<nOrdering_Header_Offset) {
		a_asField_Definition[nip] = a_asDefinition_Fields[nx];
		nip++;
		nx++;
	}

	// NB must copy to outgoing field-set ordering argument,
	// can't just use slice((nOrdering_Header_Offset + DATAFIELD_SET_UNIT_LENGTH), -1);
	// Also note we're not forwarding the field-set ordering header
	// but only the field-set ordering definition entries.
	nip = 0;
	nx = nOrdering_Header_Offset + DATAFIELD_SET_UNIT_LENGTH;		// skip the ordering header.
	while(nx<nDefinition_Fields_Count) {
		a_asField_Ordering[nip] = a_asDefinition_Fields[nx];
		nip++;
		nx++
	}

	return (true);
}


/**
 *	Retrieve metadata for dataset fields.
 *
 *	@param	{string} a_sDisplay_Name The internal application-wide identifier for the dataset (and its display).
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	Server response string if successful, otherwise empty string.
 *	@type	string
 */

function input_dataset_fieldset_definition(a_sDisplay_Name, a_asError_Message)
{
	var nTransfer_Number = 0;
	var sResponse_String = '';

	a_asError_Message[0] = '';

	if (is_null(a_sDisplay_Name)
		|| (!is_string(a_sDisplay_Name))
		|| (a_sDisplay_Name.length == 0)) {
		a_asError_Message[0] = 'Invalid dataset name in transfer call.';
		return ('');
	}

	if (is_undefined(All_Field_Sets[a_sDisplay_Name])) {
		a_asError_Message[0] = 'No response from server.';
		return ('');
	}

	sResponse_String = All_Field_Sets[a_sDisplay_Name];

	if (is_null(sResponse_String)
		|| (!is_string(sResponse_String))
		|| (sResponse_String.length == 0)) {
		a_asError_Message[0] = 'No response from server.';
		return ('');
	}

	return (sResponse_String);
}


/**
 *	Switch to displaying a new tab panel.
 *
 *	The selection is driven by the text label on the newly selected tab.
 *	@param	{string} label The text label displayed by the tab (not case sensitive)
 *
 *	@return	none
 *	@type	void
 */

function select_display_panel_by_label(label)
{
	if ((label == null) || (!label.toLowerCase)) {
		return;
	}

//	unselect_all_panels();
//	unselect_all_filter_panes();
//	display_loading_message(true);

//	if (label.toLowerCase() == 'guide') {
//		select_user_guide_panel();
//	}
//	else if (label.toLowerCase() == 'datasets') {
//		select_dataset_listing_panel();
//	}
//	else {
		select_dataset_field_listing_panel(label);
//	}
}


function select_dataset_field_listing_panel(label)
{
	get_dataset_fields(label);
}


function select_dataset_field_listing_panel_part2(label)
{
//	var dataset_field_listing_panel = document.getElementById('dataset_field_listing');

//	add_dataset_fields(label);
//	add_dataset_filters(label);

//	display_loading_message(false);
//	dataset_field_listing_panel.style.display = '';
}


function get_dataset_fields(name)
{
////	if ((dataset_datafield_strings[name] == undefined)
////		|| (dataset_datafield_strings[name].length == 0)) {
////		var transfer = new AsyncTransfer(name);
////		transfer.complete = DatafieldsReceived;
////		transfer.call('http://pc671-roth.rothamsted.bbsrc.ac.uk/extract/pages/pg_datafields.php', 'dataset=' + name);
////	}
////	else {
////		select_dataset_field_listing_panel_part2(name);
////	}

//	if ((dataset_datafield_strings[name] == undefined)
//		|| (dataset_datafield_strings[name].length == 0)) {
//		dataset_datafield_strings[name] = eval(name + '_fields_response');
//	}
	select_dataset_field_listing_panel_part2(name);
}


function get_registered_datasets()
{
	if ((typeof(aasDataset_Group_List['r']) == 'undefined')
		|| (aasDataset_Group_List['r'].length == 0)) {
		sDataset_Group_Response = sRegistered_Datasets_Response;

		var asTemp_Dataset_Group_List = sDataset_Group_Response.split('!-!');
		// Both a leading and a trailing string were forced.
		if (asTemp_Dataset_Group_List.length < (DATASET_GROUP_UNIT_LENGTH + 2)) {
			aasDataset_Group_List['r'] = new Array();
		}
		else {
			aasDataset_Group_List['r'] = asTemp_Dataset_Group_List.slice(1, -1);
		}

		if ((aasDataset_Group_List['r'].length % DATASET_GROUP_UNIT_LENGTH) != 0) {
			alert('Registered datasets list error');
			return;
		}
	}

	dataset_table_handler.display_new_group('r');
	dataset_mapper.restore_selection_status();
}


function get_dataset_group(a_sGroup_Name)
{
	// Have we already retrieved and saved it?
	if (typeof(aasDataset_Group_List[a_sGroup_Name]) != 'undefined') {
		display_dataset_group(a_sGroup_Name);
		return;
	}

	aasDataset_Group_List[a_sGroup_Name] = new Array();

	switch (a_sGroup_Name) {

	case 'a':
			sDataset_Group_Response = sAll_Datasets_Response;
			break;

	case 'r':
			sDataset_Group_Response = sRegistered_Datasets_Response;
			break;

	case 'u':
			sDataset_Group_Response = sUnregistered_Datasets_Response;
			break;

	default:
			return;
	}

	// What should I have in mind for length < (DATASET_GROUP_UNIT_LENGTH + 2) ???
	var asTemp_Dataset_Group_List = sDataset_Group_Response.split('!-!');
	// Both a leading and a trailing string were forced.
	if (asTemp_Dataset_Group_List.length < (DATASET_GROUP_UNIT_LENGTH + 2)) {
		aasDataset_Group_List[a_sGroup_Name] = Array();
	}
	else {
		if ((asTemp_Dataset_Group_List.length % DATASET_GROUP_UNIT_LENGTH) != 2) {
			alert('Stringlist error for dataset group \'' + a_sGroup_Name + '\'.');
			aasDataset_Group_List[a_sGroup_Name] = Array();
		}
		else {
			aasDataset_Group_List[a_sGroup_Name] = asTemp_Dataset_Group_List.slice(1, -1);
		}
	}

	display_dataset_group(a_sGroup_Name);
}


function display_dataset_group(a_sGroup_Name)
{
	if (typeof(aasDataset_Group_List[a_sGroup_Name]) == 'undefined') {
		return;
	}

	dataset_mapper.display_dataset_group(a_sGroup_Name);
	dataset_mapper.restore_selection_status();
}


function get_dataset_field_set(a_sDataset_Name)
{
	var sResponse_Name = a_sDataset_Name + '_fields_response';
	if (is_undefined(sResponse_Name)) {
		alert('undefined');
		return (false);
	}
	if (!is_string(sResponse_Name)) {
		alert('not a string');
		return (false);
	}
	if (sResponse_Name.length == 0) {
		alert('zero length');
		return (false);
	}
	return (true);

//	// Have we already retrieved and saved it?
//	if (typeof(aasDataset_Group_List[a_sGroup_Name]) != 'undefined') {
//		display_dataset_group(a_sGroup_Name);
//		return;
//	}

	aasDataset_Group_List[a_sGroup_Name] = Array();

	switch (a_sGroup_Name) {

	case 'a':
			sDataset_Group_Response = sAll_Datasets_Response;
			break;

	case 'r':
			sDataset_Group_Response = sRegistered_Datasets_Response;
			break;

	case 'u':
			sDataset_Group_Response = sUnregistered_Datasets_Response;
			break;

	default:
			return;
	}

	// What should I have in mind for length < (DATASET_GROUP_UNIT_LENGTH + 2) ???
	var asTemp_Dataset_Group_List = sDataset_Group_Response.split('!-!');
	// Both a leading and a trailing string were forced.
	if (asTemp_Dataset_Group_List.length < (DATASET_GROUP_UNIT_LENGTH + 2)) {
		aasDataset_Group_List[a_sGroup_Name] = Array();
	}
	else {
		if ((asTemp_Dataset_Group_List.length % DATASET_GROUP_UNIT_LENGTH) != 2) {
			alert('Stringlist error for dataset group \'' + a_sGroup_Name + '\'.');
			aasDataset_Group_List[a_sGroup_Name] = Array();
		}
		else {
			aasDataset_Group_List[a_sGroup_Name] = asTemp_Dataset_Group_List.slice(1, -1);
		}
	}

	display_dataset_group(a_sGroup_Name);
}


function suggested(e)
{
	alert('\nSuggested operation only.\n\n');
}

function selectAll()
{
	alert('\nEventually this will seelct all fields.\n\n');
}
function expt()
{
	alert('\nEventually this will link to the web page for this topic.\n\n');
}


/**
 *	Append a message to a dedicated in-page div.
 *
 *	@param	{string} a_sMessage The message to output.
 *
 *	@return	none
 *	@type	void
 */

function log_message(a_sMessage) 
{
	var eLog_Panel = null;
	var eNewline_Element = null;
	var eMessage_Element = null;
	var start_index = 0;
	var new_index = 0;
	var sub_msg = '{';

	eLog_Panel = document.getElementById('log_panel');
	if (is_null(eLog_Panel)
		|| (eLog_Panel.nodeName.toLowerCase() != 'div')
		|| (eLog_Panel.className.toLowerCase() == 'hidden')) {
		return;
	}

	if (a_sMessage.length == 0) {
		eNewline_Element = document.createElement('br');
		eMessage_Element = document.createTextNode('{}-(0)');
		eLog_Panel.appendChild(eNewline_Element);
		eLog_Panel.appendChild(eMessage_Element);
		return;
	}

	while (start_index < a_sMessage.length) {
		new_index = a_sMessage.indexOf('<br>', start_index);
		if (new_index == -1) {
			new_index = a_sMessage.length;
		}
		sub_msg += a_sMessage.substr(start_index, (new_index - start_index));
		start_index = new_index + 4;
		if (start_index >= a_sMessage.length) {
			sub_msg += '}-(' + a_sMessage.length + ')';
		}
		eNewline_Element = document.createElement('br');
		eMessage_Element = document.createTextNode(sub_msg);
		eLog_Panel.appendChild(eNewline_Element);
		eLog_Panel.appendChild(eMessage_Element);
		sub_msg = '';
	}
}


/**
 *	Is the group of test set up controls in operation.
 *
 *	@return	True if the test set up elements exist and are not hidden.
 *	@type	boolean
 */

function is_testgroup_active() 
{
	var bIs_Active = false;

	var eTest_Group = document.getElementById(SERVER_TEST_GROUP);
	if (!is_null(eTest_Group)
		&& (eTest_Group.className != 'hidden')) {
		bIs_Active = true;
	}

	return (bIs_Active);
}


/**
 *	Is one of the test replies requested for the active transfer.
 *
 *	@param	{integer} a_nSequence 0 for a single transfer or the sequence number in a multi-part transfer.
 *
 *	@return	True if set and is applicable to the transfer, otherwise False.
 *	@type	boolean
 */

function is_testreply_set(a_nSequence) 
{
	var eServer_Reply_Field = null;
	var sReply_Selection = '';
	var bIs_Requested = false;

	if (!is_testgroup_active()) {
		return (false);
	}

	eServer_Reply_Field = document.getElementById(SERVER_REPLY_ELEMENT);
	if (!is_null(eServer_Reply_Field)) {
		sReply_Selection = eServer_Reply_Field.value;
		if ((a_nSequence == 0)
			&& ((sReply_Selection == 'delay1')
				|| (sReply_Selection == 'delay2')
				|| (sReply_Selection == 'empty1')
				|| (sReply_Selection == 'empty2')
				|| (sReply_Selection == 'error1')
				|| (sReply_Selection == 'error2'))) {
			bIs_Requested = true;
		}
		else if ((a_nSequence == 1)
			&& ((sReply_Selection == 'delay1')
				|| (sReply_Selection == 'empty1')
				|| (sReply_Selection == 'error1'))) {
			bIs_Requested = true;
		}
		else if ((a_nSequence == 2)
			&& ((sReply_Selection == 'delay2')
				|| (sReply_Selection == 'empty2')
				|| (sReply_Selection == 'error2'))) {
			bIs_Requested = true;
		}
	}

	return (bIs_Requested);
}


/**
 *	Return the test reply type requested for the active transfer.
 *
 *	@param	{integer} a_nSequence 0 for a single transfer or the sequence number in a multi-part transfer.
 *
 *	@return	The name of the test reply type applicable to the transfer, otherwise an empty string.
 *	@type	string
 */

function get_testreply(a_nSequence) 
{
	var eServer_Reply_Field = null;
	var sReply_Selection = '';
	var sReply_Type = '';

	if (!is_testreply_set(a_nSequence)) {
		return ('');
	}

	eServer_Reply_Field = document.getElementById(SERVER_REPLY_ELEMENT);
	if (!is_null(eServer_Reply_Field)) {
		sReply_Selection = eServer_Reply_Field.value;
		if (a_nSequence == 0) {
			if ((sReply_Selection == 'delay1')
				|| (sReply_Selection == 'delay2')) {
				sReply_Type = 'delay';
			}
			else if ((sReply_Selection == 'empty1')
				|| (sReply_Selection == 'empty2')) {
				sReply_Type = 'empty';
			}
			else if ((sReply_Selection == 'error1')
				|| (sReply_Selection == 'error2')) {
				sReply_Type = 'error';
			}
		}
		else if (a_nSequence == 1) {
			if (sReply_Selection == 'delay1') {
				sReply_Type = 'delay';
			}
			else if (sReply_Selection == 'empty1') {
				sReply_Type = 'empty';
			}
			else if (sReply_Selection == 'error1') {
				sReply_Type = 'error';
			}
		}
		else if (a_nSequence == 2) {
			if (sReply_Selection == 'delay2') {
				sReply_Type = 'delay';
			}
			else if (sReply_Selection == 'empty2') {
				sReply_Type = 'empty';
			}
			else if (sReply_Selection == 'error2') {
				sReply_Type = 'error';
			}
		}
	}

	return (sReply_Type);
}


/**
 *	Return the test delay requested for the response to the active transfer.
 *
 *	@param	{integer} a_nSequence 0 for a single transfer or the sequence number in a multi-part transfer.
 *
 *	@return	The delay requested (in seconds) if applicable to the transfer, otherwise zero.
 *	@type	integer
 */

function get_testdelay(a_nSequence) 
{
	var eServer_Delay_Field = null;
	var nServer_Delay = 0;

	if (get_testreply(a_nSequence) != 'delay') {
		return (0);
	}

	eServer_Delay_Field = document.getElementById(SERVER_DELAY_ELEMENT);
	if (!is_null(eServer_Delay_Field)
		&& ((eServer_Delay_Field.value).length > 0)) {
		nServer_Delay = parseInt(eServer_Delay_Field.value, 10);
		if (!is_number(nServer_Delay)) {
			nServer_Delay = 0;
		}
		if (nServer_Delay < 0) {
			nServer_Delay = 0;
		}
	}

	return (nServer_Delay);
}


/**
 *	Is a parameter check requested for the active transfer.
 *
 *	@param	{integer} a_nSequence 0 for a single transfer or the sequence number in a multi-part transfer.
 *
 *	@return	True if a parameter check is requested and is applicable to the transfer, otherwise False.
 *	@type	boolean
 */

function is_testcheck_set(a_nSequence) 
{
	var eServer_Check_Field = null;
	var eServer_Reply_Field = null;
	var sReply_Selection = '';
	var bIs_Requested = false;

	if (!is_testgroup_active()) {
		return (false);
	}

	eServer_Check_Field = document.getElementById(SERVER_CHECK_ELEMENT);
	if (!is_null(eServer_Check_Field)
		&& (eServer_Check_Field.checked == true)) {
		return (true);
	}

	eServer_Reply_Field = document.getElementById(SERVER_REPLY_ELEMENT);
	if (!is_null(eServer_Reply_Field)) {
		sReply_Selection = eServer_Reply_Field.value;
		if ((a_nSequence == 0)
			&& ((sReply_Selection == 'check1')
				|| (sReply_Selection == 'check2'))) {
			bIs_Requested = true;
		}
		else if ((a_nSequence == 1)
			&& (sReply_Selection == 'check1')) {
			bIs_Requested = true;
		}
		else if ((a_nSequence == 2)
			&& (sReply_Selection == 'check2')) {
			bIs_Requested = true;
		}
	}

	return (bIs_Requested);
}


/**
 *	Return the transfer test settings query string.
 *
 *	@param	{integer} a_nSequence 0 for a single transfer or the sequence number in a multi-part transfer.
 *
 *	@return	A formatted query string with any applicable transfer test settings, otherwise an empty string.
 *	@type	string
 */

function get_testquerystring(a_nSequence) 
{
	var sServer_Reply = '';
	var nServer_Delay = 0;
	var sQuery_String = '';

	if (is_testreply_set(a_nSequence)) {
		sServer_Reply = get_testreply(a_nSequence);
		if (sServer_Reply == 'delay') {
			nServer_Delay = get_testdelay(a_nSequence);
			if (nServer_Delay == 0) {
				sServer_Reply = '';
				alert('Server delay cancelled.');
			}
		}
	}

	if (sServer_Reply.length > 0) {
		sQuery_String += 'set_reply=' + sServer_Reply;
	}
	if ((sServer_Reply == 'delay')
		&& (nServer_Delay > 0)) {
		sQuery_String += '&set_delay=' + nServer_Delay;
	}

	return (sQuery_String);
}


// Register this module's set up handler with the window onload observer.
window.AddOnLoadClient(init_page);


/* -+- */


