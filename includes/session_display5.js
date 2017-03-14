/**
 *  @fileoverview The class Session_Display is the display handler for session support.
 *
 *	@version 0.0.5  [21.3.2007]
 *	@version 0.0.6  [13.4.2007]
 *	@version 0.0.12  [25.4.2007]
 *	@version 0.0.13  [1.5.2007]
 *	@version 0.0.14  [6.7.2007]
 *	@version 0.0.17  [13.7.2007]
 *	@version 0.0.22  [27.7.2007]
 *	@version 0.6.1  [8.9.2008]      // start of remodeling to version 5 in prototype 6
 *	@version 0.6.4  [15.9.2008]
 *	@version 0.6.5  [6.10.2008]
 */


//--------------------------------------------------------------------------------------------------
//
// Local constants.

// Session login states.
var SS_NOT_ACTIVE		= 0;
var SS_LOGGED_OUT		= 1;
var SS_LOGIN_PRESET		= 2;
var SS_LOGGING_IN		= 3;
var SS_LOGGED_IN		= 4;
var SS_LOGGING_OUT		= 5;

// Login status message definitions.
// RN = Report Number
var RN_PROCESSING_LOGIN				=  1;
var RN_INPUT_FIELD_NOT_FOUND		=  2;
var RN_INVALID_INPUT_FOUND			=  3;
var RN_INCORRECT_MESSAGE_TYPE		=  4;
var RN_DECODING_ERROR				=  5;
var RN_RESPONSE_FIELDS_NOT_CLEARED	=  6;
var RN_SERVER_MESSAGE_EMPTY			=  7;
var RN_SERVER_MESSAGE_FORMAT_ERROR	=  8;
var RN_LOGGED_IN_AFFIX				=  9;
var RN_LOGIN_SUCCESSFUL				= 10;
var RN_LOGIN_FAILED					= 11;
var RN_LOGIN_TIMED_OUT				= 12;
var RN_PROCESSING_LOGOUT			= 13;
var RN_LOGOUT_SUCCESSFUL			= 14;
var RN_LOGOUT_ANYWAY				= 15;
var RN_LOGOUT_TIMED_OUT				= 16;

var asStatus_Messages = Array('',
							  'Processing login.',
							  'Input field no longer exists.',
							  'Invalid input found.',
							  'Incorrect message type received.',
							  'Decoding error -- ',
							  'Preset response fields found.',
							  'No server response text found.',
							  'Invalid response from server.',
							  ' logged in.',
							  'Login successful.',
							  'Login failed.',
							  'Login timed out.',
							  'Processing logout.',
							  'Logged out.',
							  'Logged out without server.',
							  'Logout timed out.'
							  );

//--------------------------------------------------------------------------------------------------


/**
 *	Constructor for the Session_Display class.
 *	@class	The class Session_Display provides support for user login/logout
 *	and session/state save/restore operations. This class requires the existence
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

function Session_Display(a_sDisplay_Name)
{
	/**
	 *	The unique application-wide name for this display.
	 *	@type	string
	 */
	this.m_sDisplay_Name = a_sDisplay_Name;

	/**
	 *  The unique ID of the HTML element that contains this display panel.
	 *	@type	string
	 */
	this.m_sPanel_Element = '';

	/**
	 *  The unique identifier of the panel 'form' element.
	 *	@type	string
	 */
	this.m_sPanel_Form = '';

	/**
	 *	The unique identifier of the username 'input' element.
	 *	@type	string
	 */
	this.m_sUsername_Field = '';

	/**
	 *	The unique identifier of the password 'input' element.
	 *	@type	string
	 */
	this.m_sPassword_Field = '';

	/**
	 *  The unique identifier of the login 'button' element.
	 *	@type	string
	 */
	this.m_sLogin_Button = '';

	/**
	 *  The unique identifier of the logout 'button' element.
	 *	@type	string
	 */
	this.m_sLogout_Button = '';

	/**
	 *	The unique identifier of the progress message element.
	 *	@type	string
	 */
	this.m_sProgress_Message = '';

	/**
	 *	The text of the current active progress message.
	 *	@type	string
	 */
	//this.m_sActive_Progress_Message = '';

	/**
	 *  A reference to the active asynchronous transfer object.
	 *  @type	object-reference
	 */
	this.m_rAsync_Sender = null;

	/**
	 *  Record the event handling state for the form.
	 *	This also controls the displayed state of the login and logout buttons.
	 *  @type	boolean
	 */
	this.m_bEvent_Handling_Active = true;

	/**
	 *  The session login state.
	 *  @type	integer
	 */
	this.m_nSession_State = SS_LOGGED_OUT;
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

Session_Display.prototype.set_element_names = function(a_sPanel_Element, a_asElement_List)
{
	if (!document.getElementById(a_sPanel_Element)) {
		alert("Display '" + this.m_sDisplay_Name + "' panel element '" + a_sPanel_Element + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 6;

	if (!is_array(a_asElement_List)
		|| (a_asElement_List.length != nElement_List_Length)) {
		alert("Bad element list for display '" + this.m_sDisplay_Name + "'.");
		return (false);
	}

	for (var nx=0; nx<nElement_List_Length; nx++) {
		if (!document.getElementById(a_asElement_List[nx])) {
			alert("Display '" + this.m_sDisplay_Name + "' element '" + a_asElement_List[nx] + "' was not found.");
			return (false);
		}
	}

	this.m_sPanel_Element = a_sPanel_Element;
	this.m_sPanel_Form = a_asElement_List[0];
	this.m_sUsername_Field = a_asElement_List[1];
	this.m_sPassword_Field = a_asElement_List[2];
	this.m_sLogin_Button = a_asElement_List[3];
	this.m_sLogout_Button = a_asElement_List[4];
	this.m_sProgress_Message = a_asElement_List[5];

	var elem = null;

	// No handler for the form event is used because it can lead to
	// confusion over which action is being requested by a <return>.
	// When a text input element is selected then <return> invokes
	// a form submit event. But if the logout button is the current
	// active/selected element then <return> invokes a button event.
	// It won't be clear that a user is repeating the wrong request.
	//
	// Note also that a submit button is needed before a form event
	// can be fired using <return> -- true for both IE and Firefox.
	//elem = document.getElementById(this.m_sPanel_Form);
	//if (!elem) {
	//	alert('User panel form no longer exists.');
	//	return (false);
	//}
	//add_event(elem, 'submit', panel_form_handler, false);

	// Set up the event handler for the login button.
	elem = document.getElementById(this.m_sLogin_Button);
	if (!elem) {
		alert('Panel login button no longer exists.');
		return (false);
	}
	add_event(elem, 'click', panel_login_handler, false);

	// Set up the event handler for the logout button.
	elem = document.getElementById(this.m_sLogout_Button);
	if (!elem) {
		alert('Panel logout button no longer exists.');
		return (false);
	}
	add_event(elem, 'click', panel_logout_handler, false);

	//this.dump_values();
	return (true);
}


/**
 *  Invoked on a timeout from the Timeout Manager.
 *
 *  @return	none
 *  @type	void
 */

Session_Display.prototype.handle_timeout = function()
{
	//log_message('Session_Display.handle_timeout() -- state=' + this.format_login_state(this.m_nSession_State));

	// ***** Expect only to be in the LOGIN_PRESET, LOGGING_IN or LOGGING_OUT state *****

	// ***** And always exit in the LOGGED_OUT state *****

	// Immediate exit if we're no longer in a valid timeout state.
	if ((this.m_nSession_State != SS_LOGIN_PRESET)
		&& (this.m_nSession_State != SS_LOGGING_IN)
		&& (this.m_nSession_State != SS_LOGGING_OUT)) {
		return;
	}

	// Next ensure we're in a non-active state.
	// SHOULD THERE BE A SPECIFIC NON-ACTIVE STATE ???
	var nSaved_Session_State = this.m_nSession_State;
	this.m_nSession_State = SS_LOGGED_OUT;

	// Then the first real action must be to abort the current transfer.
	if (this.m_rAsync_Sender) {
		this.m_rAsync_Sender.cancel_transfer();
	}
	this.m_rAsync_Sender = null;

	// Output the appropriate user message.
	var nMessage_Index = 0;
	if ((nSaved_Session_State == SS_LOGIN_PRESET)
		|| (nSaved_Session_State == SS_LOGGING_IN)) {
		nMessage_Index = RN_LOGIN_TIMED_OUT;
	}
	else if (nSaved_Session_State == SS_LOGGING_OUT) {
		nMessage_Index = RN_LOGOUT_TIMED_OUT;
	}
	this.set_completion_message(asStatus_Messages[nMessage_Index]);

	var bResult_Flag = false;
	var asGroup_Datasets = Array();
	var asGroup_Ordering = Array();
	var asError_Message = Array(1);
	asError_Message[0] = '';

	// Process the internal template set for an empty 'My Datasets' listing table
	// because we always exit in the LOGGED_OUT state and, obviously, the server
	// is unable to supply any info on the default state for the 'My Datasets' table.
	process_dataset_group_definition(LOGIN_TABLE_ID, sRegistered_Datasets_Response_empty,
										asGroup_Datasets, asGroup_Ordering, asError_Message);

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('panel controller not found by handle_timeout().');
		// Re-enable form event support before exiting.
		this.set_form_event_handling(true);
		return;
	}

	var rUser_Display = rPanel_Controller.fetch_display(LOGIN_TABLE_ID);
	if (is_null(rUser_Display)) {
		alert('user datasets display not found by handle_timeout().');
		// Re-enable form event support before exiting.
		this.set_form_event_handling(true);
		return;
	}

	// Set an empty datasets table.
	bResult_Flag = rUser_Display.set_dataset_group(asGroup_Datasets, asGroup_Ordering);

	// Finally re-enable form event support.
	this.set_form_event_handling(true);
}


/**
 *  Initiate a user login. Invoked by the event handler for the panel login button.
 *
 *  @return	none
 *  @type	void
 */

Session_Display.prototype.login_handler = function()
{
	// Take no action if form event handling is blocked.
	if (!this.m_bEvent_Handling_Active) {
		alert('Login blocked.');
		return;
	}

	// Disable further events immediately.
	this.set_form_event_handling(false);

	// Ignore the current login session state.
	// For the logged_out and logged_in states it's OK to login/re-login.
	// For the remaining 3 transient states login_preset, logging_in and 
	// logging_out it should not be possible to initiate a login, however
	// allowing logins in these states may prevent a session stuck state.

	// If we cannot access the input fields then exit without changing state.
	var eUsername_Field = document.getElementById(this.m_sUsername_Field);
	var ePassword_Field = document.getElementById(this.m_sPassword_Field);
	if ((!eUsername_Field) || (!ePassword_Field)) {
		this.set_completion_message(asStatus_Messages[RN_INPUT_FIELD_NOT_FOUND]);
		// Re-enable form event support before aborting.
		this.set_form_event_handling(true);
		return;
	}

	var sTrimmed_Username = trim_string(eUsername_Field.value);
	var sTrimmed_Password = trim_string(ePassword_Field.value);

	// First some simple checks to make sure we have a username and password.
	// There is no point in even starting the login process without them.
	// If the checks fail then exit without changing state.
	if ((sTrimmed_Username.length == 0)
		|| (sTrimmed_Password.length == 0)
		|| (eUsername_Field.value.length != sTrimmed_Username.length)
		|| (ePassword_Field.value.length != sTrimmed_Password.length)) {
		this.set_completion_message(asStatus_Messages[RN_INVALID_INPUT_FOUND]);
		// Re-enable form event support before aborting.
		this.set_form_event_handling(true);
		return;
	}

	var sParam_String = get_testquerystring(1);

	var sTarget_Page = ((!is_testcheck_set(1)) ? LOGIN_PAGE_URL : ECHO_PAGE_URL);

	// Request a 10 second timeout on the complete login process.
	// If the timeout request fails then exit without changing state.
	if (!this.start_timeout(10)) {
		// Re-enable form event support before aborting.
		this.set_form_event_handling(true);
		return;
	}

	// Set up a new transfer object to send a login reset.
	this.m_rAsync_Sender = new AsyncTransfer(RESET_ID);
	//this.m_rAsync_Sender.complete = reset_reply;
	this.m_rAsync_Sender.set_handler(reset_reply);

	// Send a reset-message and now change the state because
	// only now have we taken any action to initiate a login.
	this.set_completion_message(asStatus_Messages[RN_PROCESSING_LOGIN]);
	this.m_nSession_State = SS_LOGIN_PRESET;
	this.m_rAsync_Sender.start_transfer(sTarget_Page, sParam_String);
//	reset_reply(RESET_ID, 200, "", "  !-!0!-!reset!-!123!-!0!-!0!-!  ", "")
}


/**
 *  Request a user login. Invoked by the event handler for a pre-login reset message.
 *
 *	@param	{string} a_sTransferID The unique identifier for the transfer
 *	@param	{boolean} a_bValid_Transfer True indicates a processable transfer response
 *	@param	{string} a_sTransfer_Response The received response text or an error report
 *
 *  @return	none
 *  @type	void
 */

Session_Display.prototype.login_request = function(a_sTransferID, a_bValid_Transfer, a_sTransfer_Response)
{
	var eUser_Field = null;
	var ePass_Field = null;

	var asError_Message = Array(1);
	var asReset_Fields = Array();
	var sHash_Seed = '';

	var sUser_Id = '';
	var sEscaped_Id = '';
	var sUser_Password = '';
	var sEncoded_Password = '';

	//alert('login_request [' + a_sTransfer_Response + ']');

	// ***** Expect only to be in the LOGIN_PRESET state *****

	// ***** What about killing the timeout and releasing the transfer object ?????  *****

	// Must only arrive here with an async reset transfer ID.
	// Otherwise exit, re-enabled and in the logged-out state.
	if ((this.m_nSession_State != SS_LOGIN_PRESET) 
		|| (is_null(a_sTransferID))
		|| (!is_string(a_sTransferID))
		|| (a_sTransferID.length == 0)
		|| (a_sTransferID != RESET_ID)) {
		this.m_nSession_State = SS_LOGGED_OUT;
		this.kill_timeout();
		this.set_completion_message(asStatus_Messages[RN_INCORRECT_MESSAGE_TYPE]);
		this.set_form_event_handling(true);
		return;
	}

	// If a server error message was received then display it for the user
	// and re-enable form event support because the login attempt ends here.
	if (!a_bValid_Transfer) {
		this.m_nSession_State = SS_LOGGED_OUT;
		this.kill_timeout();
		this.set_completion_message(a_sTransfer_Response);
		this.set_form_event_handling(true);
		return;
	}

	// If we don't like the login transfer response header then tell the user
	// and re-enable form event support because the login attempt ends here.
	if (!this.decode_login_response_header(a_sTransfer_Response, asReset_Fields, asError_Message)) {
		this.m_nSession_State = SS_LOGGED_OUT;
		this.kill_timeout();
		this.set_completion_message(asStatus_Messages[RN_DECODING_ERROR] + asError_Message[0]);
		this.set_form_event_handling(true);
		return;
	}
	this.add_to_list('*' + asReset_Fields[TR_CODE]);	// ???

	//alert('login_request field count = ' + asReset_Fields.length);

	// Release the transfer object.
	this.m_rAsync_Sender = null;

	// If we can't retrieve the user id and password from the form then abort
	// and re-enable form event support because the login attempt ends here.
	eUser_Field = document.getElementById(this.m_sUsername_Field);
	ePass_Field = document.getElementById(this.m_sPassword_Field);
	if (!eUser_Field || !ePass_Field) {
		this.m_nSession_State = SS_LOGGED_OUT;
		this.kill_timeout();
		this.set_completion_message(asStatus_Messages[RN_INPUT_FIELD_NOT_FOUND]);
		this.set_form_event_handling(true);
		return;
	}

	sHash_Seed = asReset_Fields[TR_CODE];
	sUser_Id = trim_string(eUser_Field.value);
	sEscaped_Id = escape(sUser_Id);
	sUser_Password = trim_string(ePass_Field.value);
	sEncoded_Password = hex_sha1(hex_sha1(sUser_Password)
								 + sUser_Id.substring(0, 3) + sHash_Seed.toString());
	//alert(sUser_Id + " --> " + sEscaped_Id);

	//alert('escaped username=[' + sEscaped_Id + ']  (' + sEscaped_Id.length + ')'
	//	  + '\nhashed password=[' + sEncoded_Password + ']  (' + sEncoded_Password.length + ')');

	var sParam_String = 'proj_agent=' + sEscaped_Id + '&rerun_code=' + sEncoded_Password;
	//var sParam_String = 'proj_agent=' + sEscaped_Id + '&rerun_code=' + sEncoded_Password
	//												+ '&refid=' + escape(sUser_Password);

	var sExtra_Param_String = get_testquerystring(2);
	if (sExtra_Param_String.length > 0) {
		sParam_String += '&' + sExtra_Param_String;
	}

	var sTarget_Page = ((!is_testcheck_set(2)) ? LOGIN_PAGE_URL : ECHO_PAGE_URL);

	// Set up a new transfer object to send a login request.
	this.m_rAsync_Sender = new AsyncTransfer(LOGIN_ID);
	//this.m_rAsync_Sender.complete = register_reply;
	this.m_rAsync_Sender.set_handler(register_reply);

	// Send a login-message and now change the state because
	// only now have we actioned stage 2 of the login process.
	this.m_nSession_State = SS_LOGGING_IN;
	this.m_rAsync_Sender.start_transfer(sTarget_Page, sParam_String);
	//register_reply(LOGIN_ID, 200, "", "  !-!0!-!login!-!1!-!" + LOGIN_TABLE_ID + "!-!" + sUser_Id + "!-!  ", "");
//	if (sEscaped_Id == 'fred') {
//        register_reply(LOGIN_ID, 200, "", sRegistered_Datasets_Response, "");
//	}
//	else {
//		register_reply(LOGIN_ID, 200, "", sRegistered_Datasets_Response2, "");
//	}
}


/**
 *  Complete a user login. Invoked by the event handler for a login completion message.
 *
 *	@param	{string} a_sTransferID The unique identifier for the transfer
 *	@param	{boolean} a_bValid_Transfer True indicates a processable transfer response
 *	@param	{string} a_sTransfer_Response The server response text or an error report
 *
 *  @return	none
 *  @type	void
 */

Session_Display.prototype.login_completion = function(a_sTransferID, a_bValid_Transfer, a_sTransfer_Response)
{
	var nSaved_Session_State = SS_NOT_ACTIVE;
	var asError_Message = Array(1);
	var asLogin_Fields = Array();
	var bLogin_Accepted = false;

	// ***** Expect only to be in the LOGGING_IN state *****

	// ***** What about killing the timeout and releasing the transfer object ?????  *****

	// Set initially as unsuccessful
	// which prevents any action by an untimely timeout.
	nSaved_Session_State = this.m_nSession_State;
	this.m_nSession_State = SS_LOGGED_OUT;

	// Cancel the timeout. Ignore a cancel timeout failure.
	this.kill_timeout();

	// Must only arrive here with an async login transfer ID.
	// Otherwise exit, re-enabled, still in the logged-out state.
	if ((nSaved_Session_State != SS_LOGGING_IN)
		|| (is_null(a_sTransferID))
		|| (!is_string(a_sTransferID))
		|| (a_sTransferID.length == 0)
		|| (a_sTransferID != LOGIN_ID)) {
		this.set_completion_message(asStatus_Messages[RN_INCORRECT_MESSAGE_TYPE]);
		this.set_form_event_handling(true);
		return;
	}

	//alert('login_completion [' + a_sTransfer_Response + ']');

	// If a server error message was received then display it for the user
	// and re-enable form event support because the login attempt ends here.
	if (!a_bValid_Transfer) {
		this.set_completion_message(a_sTransfer_Response);
		this.set_form_event_handling(true);
		return;
	}

	// If we don't like the transfer response header then tell the user
	// and re-enable form event support because the login attempt ends here.
	if (!this.decode_login_response_header(a_sTransfer_Response, asLogin_Fields, asError_Message)) {
		this.set_completion_message(asStatus_Messages[RN_DECODING_ERROR] + asError_Message[0]);
		this.set_form_event_handling(true);
		return;
	}
	this.add_to_list(asLogin_Fields[TR_CODE]);	// ???
	this.add_to_list(asLogin_Fields[TR_TEXT]);	// ???
	this.add_to_list(asLogin_Fields[TR_USER]);	// ???

	//alert('login_completion field count = ' + asLogin_Fields.length);

	// Release the transfer object.
	this.m_rAsync_Sender = null;

//	var dump_msg = 'TR_SEQC = [' + asLogin_Fields[TR_SEQC] + ']';
//	dump_msg += '\nTR_TYPE = [' + asLogin_Fields[TR_TYPE] + ']';
//	dump_msg += '\nTR_CODE = [' + asLogin_Fields[TR_CODE] + ']';
//	dump_msg += '\nTR_TEXT = [' + asLogin_Fields[TR_TEXT] + ']';
//	dump_msg += '\nTR_USER = [' + asLogin_Fields[TR_USER] + ']';
//	alert(dump_msg);

	// A clear-message is received if the server failed the login attempt.
	bLogin_Accepted = (asLogin_Fields[TR_TYPE] == LOGIN_ID);
	if (!bLogin_Accepted) {
		this.set_completion_message(asStatus_Messages[RN_LOGIN_FAILED]);
	}
	else {
		this.m_nSession_State = SS_LOGGED_IN;
		if (asLogin_Fields[TR_USER].length == 0) {
			this.set_completion_message(asStatus_Messages[RN_LOGIN_SUCCESSFUL]);
		}
		else {
			this.set_completion_message(asLogin_Fields[TR_USER] + asStatus_Messages[RN_LOGGED_IN_AFFIX]);
		}
	}

	// ***** Now we're already in the correct exit state *****
	// From here on we're just setting or clearing the registered 'My Datasets' listing table
	// depending on whether the login was successful or not. Because we could have already been
	// logged-in then the 'My Datasets' table will need to be cleared if the login was failed.

	var bValid_List_Flag = true;
	var bResult_Flag = false;
	var asGroup_Datasets = Array();
	var asGroup_Ordering = Array();
	var asError_Message = Array(1);
	asError_Message[0] = '';
    log_message (a_sTransfer_Response);
	log_message (asGroup_Datasets);
	
	// Process and validate the received 'My Datasets' listing for a successful login.
	if (bLogin_Accepted) {
		bValid_List_Flag = process_dataset_group_definition(LOGIN_TABLE_ID, a_sTransfer_Response,
											asGroup_Datasets, asGroup_Ordering, asError_Message);
		if (!bValid_List_Flag) {
			alert(asError_Message[0]);
		}
	}

	// Revert to using an internal template set for an empty 'My Datasets' listing table
	// for failed logins or for successful logins returning invalid 'My Datasets' listings.
	// Then the server needs no knowledge of the default state for the 'My Datasets' table.
	if ((!bLogin_Accepted)
		|| (!bValid_List_Flag)) {
		process_dataset_group_definition(LOGIN_TABLE_ID, sRegistered_Datasets_Response_empty,
											asGroup_Datasets, asGroup_Ordering, asError_Message);
	}

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('panel controller not found by login_completion().');
		// Re-enable form event support before exiting.
		this.set_form_event_handling(true);
		return;
	}

	var rUser_Display = rPanel_Controller.fetch_display(LOGIN_TABLE_ID);
	if (is_null(rUser_Display)) {
		alert('user datasets display not found by login_completion().');
		// Re-enable form event support before exiting.
		this.set_form_event_handling(true);
		return;
	}

	// Set up the datasets listing table.
	bResult_Flag = rUser_Display.set_dataset_group(asGroup_Datasets, asGroup_Ordering);

	// Finally re-enable form event support.
	this.set_form_event_handling(true);
}


/**
 *  Request a user logout. Invoked by the event handler for the panel logout button.
 *
 *  @return	none
 *  @type	void
 */

Session_Display.prototype.logout_handler = function()
{
	// Take no action if form event handling is blocked.
	if (!this.m_bEvent_Handling_Active) {
		alert('Logout blocked.');
		return;
	}

	// Disable further events immediately.
	this.set_form_event_handling(false);

	var sParam_String = get_testquerystring(0);

	var sTarget_Page = ((!is_testcheck_set(0)) ? LOGIN_PAGE_URL : ECHO_PAGE_URL);

	// Request a 5 second timeout on the logout request.
	// If the timeout request fails then exit without changing state.
	if (!this.start_timeout(5)) {
		// Re-enable form event support before aborting.
		this.set_form_event_handling(true);
		return;
	}

	// Set up a new transfer object to send a clear/logout request.
	this.m_rAsync_Sender = new AsyncTransfer(CLEAR_ID);
	//this.m_rAsync_Sender.complete = clear_reply;
	this.m_rAsync_Sender.set_handler(clear_reply);

	// Send a clear-message and now change the state because
	// only now have we taken any action to initiate a logout.
	this.set_completion_message(asStatus_Messages[RN_PROCESSING_LOGOUT]);
	this.m_nSession_State = SS_LOGGING_OUT;
	this.m_rAsync_Sender.start_transfer(sTarget_Page, sParam_String);
//	clear_reply(CLEAR_ID, 200, "", "  !-!0!-!clear!-!1!-!0!-!0!-!  ", "")
}


/**
 *  Complete a user logout. Invoked by the event handler for a logout confirmation message.
 *
 *	@param	{string} a_sTransferID The unique identifier for the transfer
 *	@param	{boolean} a_bValid_Transfer True indicates a processable transfer response
 *	@param	{string} a_sTransfer_Response The received response text or an error report
 *
 *  @return	none
 *  @type	void
 */

Session_Display.prototype.logout_completion = function(a_sTransferID, a_bValid_Transfer, a_sTransfer_Response)
{
	var nSaved_Session_State = SS_NOT_ACTIVE;
	var asError_Message = Array(1);
	var asLogout_Fields = Array();
	var bLogout_Accepted = false;

	// ***** Expect only to be in the LOGGING_OUT state *****

	// ***** What about killing the timeout and releasing the transfer object ?????  *****

	// Immediately set the logout as successful
	// which prevents any action by an untimely timeout.
	nSaved_Session_State = this.m_nSession_State;
	this.m_nSession_State = SS_LOGGED_OUT;

	// Cancel the timeout. Ignore a cancel timeout failure.
	this.kill_timeout();

	// Must only arrive here with an async clear/logout transfer ID.
	// But will always exit, re-enabled, still in the logged-out state.
	if ((nSaved_Session_State != SS_LOGGING_OUT)
		|| (is_null(a_sTransferID))
		|| (!is_string(a_sTransferID))
		|| (a_sTransferID.length == 0)
		|| (a_sTransferID != CLEAR_ID)) {
		this.set_completion_message(asStatus_Messages[RN_INCORRECT_MESSAGE_TYPE]);
		this.set_form_event_handling(true);
		return;
	}

	//alert('logout_completion [' + a_sTransfer_Response + ']');

	// If a server error message was received then display it for the user
	// and re-enable form event support because the logout attempt ends here.
	if (!a_bValid_Transfer) {
		this.set_completion_message(a_sTransfer_Response);
		this.set_form_event_handling(true);
		return;
	}

	// If we don't like the transfer response header then tell the user
	// and re-enable form event support because the logout attempt ends here.
	if (!this.decode_login_response_header(a_sTransfer_Response, asLogout_Fields, asError_Message)) {
		this.set_completion_message(asStatus_Messages[RN_DECODING_ERROR] + asError_Message[0]);
		this.set_form_event_handling(true);
		return;
	}
	this.add_to_list(asLogout_Fields[TR_CODE]);		// ???
	this.add_to_list(asLogout_Fields[TR_TEXT]);		// ???
	this.add_to_list(asLogout_Fields[TR_USER]);		// ???

	//alert('logout_completion field count = ' + asLogout_Fields.length);

	// Release the transfer object.
	this.m_rAsync_Sender = null;

//	var dump_msg = 'TR_SEQC = [' + asLogout_Fields[TR_SEQC] + ']';
//	dump_msg += '\nTR_TYPE = [' + asLogout_Fields[TR_TYPE] + ']';
//	dump_msg += '\nTR_CODE = [' + asLogout_Fields[TR_CODE] + ']';
//	dump_msg += '\nTR_TEXT = [' + asLogout_Fields[TR_TEXT] + ']';
//	dump_msg += '\nTR_USER = [' + asLogout_Fields[TR_USER] + ']';
//	alert(dump_msg);

	// A clear-message is received if the server actioned the logout request.
	bLogout_Accepted = (asLogout_Fields[TR_TYPE] == CLEAR_ID);
	if (!bLogout_Accepted) {
		this.set_completion_message(asStatus_Messages[RN_LOGOUT_ANYWAY]);
	}
	else {
        this.set_completion_message(asStatus_Messages[RN_LOGOUT_SUCCESSFUL]);
	}

	var bResult_Flag = false;
	var asGroup_Datasets = Array();
	var asGroup_Ordering = Array();
	var asError_Message = Array(1);
	asError_Message[0] = '';

	// Always process the internal template set for an empty 'My Datasets' listing table
	// whether logout was successful or not because we always exit in the LOGGED_OUT state.
	// (The server needs no knowledge of the default state for the 'My Datasets' table.)
	process_dataset_group_definition(LOGIN_TABLE_ID, sRegistered_Datasets_Response_empty,
										asGroup_Datasets, asGroup_Ordering, asError_Message);

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('panel controller not found by logout_completion().');
		// Re-enable form event support before exiting.
		this.set_form_event_handling(true);
		return;
	}

	var rUser_Display = rPanel_Controller.fetch_display(LOGIN_TABLE_ID);
	if (is_null(rUser_Display)) {
		alert('user datasets display not found by logout_completion().');
		// Re-enable form event support before exiting.
		this.set_form_event_handling(true);
		return;
	}

	// Set up the datasets listing table.
	bResult_Flag = rUser_Display.set_dataset_group(asGroup_Datasets, asGroup_Ordering);

	// Finally re-enable form event support.
	this.set_form_event_handling(true);
}


/**
 *	Hide the display.
 *
 *	@return	none
 *	@type	void
 */

Session_Display.prototype.hide_display = function()
{
	var eDisplay_Element = document.getElementById(this.m_sPanel_Element);
	if (!eDisplay_Element) {
		alert("Display panel element '" + this.m_sPanel_Element + "' no longer exists.");
		return;
	}

	eDisplay_Element.className = 'hidden';
}


/**
 *	Show the display, re-displaying the dataset group listing.
 *
 *	@return	none
 *	@type	void
 */

Session_Display.prototype.show_display = function()
{
	var eDisplay_Element = document.getElementById(this.m_sPanel_Element);
	if (!eDisplay_Element) {
		alert("Display panel element '" + this.m_sPanel_Element + "' no longer exists.");
		return;
	}

	var elem = null;

	// It's useful to reset the form fields for security.
	// Also a reset forces the form fields to be selected when re-entering the user id and password
	// for unless a form field is selected, then hitting a return won't initiate a form submit/login.
	elem = document.getElementById(this.m_sPanel_Form);
	if (elem != null) {
		elem.reset();
	}

	// Set the appropriate enable/disabled state for both the login and logout buttons.
	this.set_form_event_handling(this.m_bEvent_Handling_Active);

	eDisplay_Element.className = '';
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Session_Display.prototype.print_state = function()
{
	return ('[Session_Display]'
			+ '\nDisplay name = ' + this.m_sDisplay_Name
			+ '\nActive progress message = ' + this.m_sActive_Progress_Message);
}


/**
 *  Display a new completion message in the user panel.
 *
 *	@private
 *	@param	{string} a_sCompletion_Message The message text for display.
 *
 *  @return	none.
 *  @type	void
 */

Session_Display.prototype.set_completion_message = function(a_sCompletion_Message)
{
	var sCompletion_Message = '';

	var eProgress_Message = document.getElementById(this.m_sProgress_Message);
	if (!eProgress_Message) {
		alert('Progress message field no longer exists.');
		return;
	}

	if ((eProgress_Message.nodeName.toLowerCase() != 'p')
		|| (eProgress_Message.childNodes.length == 0)
		|| (eProgress_Message.firstChild.nodeType != 3)) {
		return;
	}

	if (is_null(a_sCompletion_Message)
		|| (!is_string(a_sCompletion_Message))
		|| (a_sCompletion_Message.length == 0)) {
		sCompletion_Message = '>>';
	}
	else {
		sCompletion_Message = '>> ' + a_sCompletion_Message;
	}

	eProgress_Message.firstChild.nodeValue = sCompletion_Message;
}


/**
 *  Switch event support for the login form On/Off. Purpose is to prevent users issuing
 *	multiple requests. Buttons display state and message text communicates intent to users.
 *
 *	@private
 *	@param	{boolean} a_bOn True to enable event handling, False to disable/block it.
 *
 *  @return	none.
 *  @type	void
 */

Session_Display.prototype.set_form_event_handling = function(a_bOn)
{
	// Kill event handling immediately (until we're finished).
    this.m_bEvent_Handling_Active = false;

	var sLogin_Text = '  Login  ';
	var sLogout_Text = ' Logout  ';
	var sDisabled_Login_Text = '  Wait  ';
	var sDisabled_Logout_Text = '  Wait   ';
	var elem = null;

	var eLogin_Button = document.getElementById(this.m_sLogin_Button);
	if (!eLogin_Button) {
		alert('Panel login button no longer exists.');
		return;
	}

	var eLogout_Button = document.getElementById(this.m_sLogout_Button);
	if (!eLogout_Button) {
		alert('Panel logout button no longer exists.');
		return;
	}

	if (a_bOn) {
		eLogin_Button.value = sLogin_Text;
		//eLogin_Button.disabled = false;

		eLogout_Button.value = sLogout_Text;
		//eLogout_Button.disabled = false;

		this.m_bEvent_Handling_Active = true;
	}
	else {
		eLogin_Button.value = sDisabled_Login_Text;
		//eLogin_Button.disabled = true;

		eLogout_Button.value = sDisabled_Logout_Text;
		//eLogout_Button.disabled = true;

		this.m_bEvent_Handling_Active = false;
	}
}


/**
 *	Start a timeout.
 *
 *	@private
 *	@param	{integer} a_nPeriod Number of seconds.
 *
 *	@return	True if successful, otherwise False.
 *	@type	boolean
 */

Session_Display.prototype.start_timeout = function(a_nPeriod)
{
	var rTimeout_Service = this.get_timeout_service();
	if (is_null(rTimeout_Service)) {
		return (false);
	}

	rTimeout_Service.request_timeout(a_nPeriod, this.m_sDisplay_Name, '');
	return (true);
}


/**
 *	Cancel a timeout.
 *
 *	@private
 *
 *	@return	True if successful, otherwise False.
 *	@type	boolean
 */

Session_Display.prototype.kill_timeout = function()
{
	var rTimeout_Service = this.get_timeout_service();
	if (is_null(rTimeout_Service)) {
		return (false);
	}

    rTimeout_Service.cancel_timeout(this.m_sDisplay_Name, '');
	return (true);
}


/**
 *	Set up access to the Timeout Service.
 *
 *	@private
 *
 *	@return	A reference to the Timeout Service if successful, otherwise null.
 *	@type	object reference
 */

Session_Display.prototype.get_timeout_service = function()
{
	var rTimeout_Service = locate_registered_object('timeout_service');
	if (is_null(rTimeout_Service)) {
		alert('No timeout service found.');
	}

	return (rTimeout_Service);
}


/**
 *  Decode a login transfer response header and return its component fields.
 *
 *	@private
 *	@param	{string} a_sResponse_String The text response received from the server.
 *	@param	{array} a_asResponse_Fields An empty array to receive the response fields.
 *	@param	{array} a_asError_Message A single element array to receive an error message.
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Session_Display.prototype.decode_login_response_header 
								= function(a_sResponse_String, a_asResponse_Fields, a_asError_Message)
{
	//var nTransfer_Number = 0;
	var asTemp_Fields = Array();
	var nTemp_Fields_Count = 0;

	//var asDefinition_Fields = Array();

	a_asError_Message[0] = '';

	if (a_asResponse_Fields.length != 0) {
		a_asError_Message[0] = asStatus_Messages[RN_RESPONSE_FIELDS_NOT_CLEARED];
		return (false);
	}

	if (is_null(a_sResponse_String)
		|| (!is_string(a_sResponse_String))
		|| (a_sResponse_String.length == 0)) {
		a_asError_Message[0] = asStatus_Messages[RN_SERVER_MESSAGE_EMPTY];
		return (false);
	}

	asTemp_Fields = a_sResponse_String.split('!-!');
	nTemp_Fields_Count = asTemp_Fields.length;

	// Ensure we have a full login response message.
	// (NB both a leading and a trailing string are always forced onto any response).
	if (nTemp_Fields_Count < (LOGIN_RESPONSE_LENGTH + 2)) {
		a_asError_Message[0] = asStatus_Messages[RN_SERVER_MESSAGE_FORMAT_ERROR];
		return (false);
	}

	// Must copy to outgoing response fields argument. Cannot use
	//		a_asResponse_Fields = asTemp_Fields.slice(1, -1);
	// to remove the forced leading and trailing string fields.
	for (var nx=1; nx<=LOGIN_RESPONSE_LENGTH; nx++) {
		a_asResponse_Fields[nx - 1] = asTemp_Fields[nx];
	}

	return (true);
}
/*
	nHeader_Offset = 1;

	// Now we can check the transfer header.
	// Is this the response we're expecting?
	if ((asResponse_Fields[nHeader_Offset + TR_SEQC] != nTransfer_Number)
		|| (asResponse_Fields[nHeader_Offset + TR_TYPE] != a_sDisplay_Name)) {
		a_asError_Message[0] = 'Incorrect server response.';
		return (false);
	}

	// Do we have a server error message?
	if ((asResponse_Fields[nHeader_Offset + TR_CODE] != 0)) {
		if ((asResponse_Fields[nHeader_Offset + TR_TEXT]).length > 0) {
			a_asError_Message[0] = asResponse_Fields[nHeader_Offset + TR_TEXT];
		}
		else {
			a_asError_Message[0] = 'Server error code '
									+ asResponse_Fields[nHeader_Offset + TR_CODE] + '.';
		}
		return (false);
	}

	asDefinition_Fields = asResponse_Fields.slice((DATAFIELD_SET_UNIT_LENGTH + 1), -1);
	if (split_dataset_fieldset_definition(asDefinition_Fields, a_asField_Definition,
										  a_asField_Ordering, a_asError_Message) == false) {
		if (a_asError_Message[0].length == 0) {
			a_asError_Message[0] = 'Invalid fieldset definition from server.';
		}
		return (false);
	}

	return (true);
}
*/

Session_Display.prototype.dump_values = function()
{
	var msg = '[Session_Display]';

	msg += '\nthe application-wide name for this display = [' + this.m_sDisplay_Name + ']';
	msg += '\nthe ID of the HTML element that contains the display panel = [' + this.m_sPanel_Element + ']';
	msg += '\nthe identifier of the panel \'form\' element = [' + this.m_sPanel_Form + ']';
	msg += '\nthe identifier of the username \'input\' element = [' + this.m_sUsername_Field + ']';
	msg += '\nthe identifier of the password \'input\' element = [' + this.m_sPassword_Field + ']';
	msg += '\nthe identifier of the login \'button\' element = [' + this.m_sLogin_Button + ']';
	msg += '\nthe identifier of the logout \'button\' element = [' + this.m_sLogout_Button + ']';
	msg += '\nthe identifier of the progress message element = [' + this.m_sProgress_Message + ']';
	msg += '\nan asynchronous sender is ' + ((this.m_rAsync_Sender != null) ? '' : 'not ') + 'allocated';
	msg += '\nthe event handling state for the form = [' + this.m_bEvent_Handling_Active + ']';
	msg += '\nthe session login state = [' + this.format_login_state(this.m_nSession_State) + ']';

	alert(msg);
}


Session_Display.prototype.format_login_state = function(a_nState)
{
	var sText_State = '';

	switch (a_nState) {
	case SS_NOT_ACTIVE:		sText_State = 'SS_NOT_ACTIVE';
							break;
    case SS_LOGGED_OUT:		sText_State = 'SS_LOGGED_OUT';
							break;
    case SS_LOGIN_PRESET:	sText_State = 'SS_LOGIN_PRESET';
							break;
	case SS_LOGGING_IN:		sText_State = 'SS_LOGGING_IN';
							break;
    case SS_LOGGED_IN:		sText_State = 'SS_LOGGED_IN';
							break;
    case SS_LOGGING_OUT:	sText_State = 'SS_LOGGING_OUT';
							break;
	default:				sText_State = 'UNKNOWN';
	}

	return (sText_State);
}


Session_Display.prototype.add_to_list = function(a_sText)
{
/*
	var display_list = document.getElementById("the_list");
	var new_list_element = document.createElement('li');
	var new_list_element_text = document.createTextNode('[' + a_sText + '] (' + a_sText.length + ')');
	new_list_element.appendChild(new_list_element_text);
	display_list.appendChild(new_list_element);
*/
}


/* -+- */


