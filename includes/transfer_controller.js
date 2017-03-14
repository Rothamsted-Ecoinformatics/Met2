/**
 *  @fileoverview The class Transfer_Controller is the handler for the client-server message transfer service.
 *
 *  @version 0.1.3  [3.4.2006]
 *  @version 0.1.4  [9.3.2007]
 *
 *  @version 0.1.6  [13.3.2007]
 *  @version 0.1.10  [13.4.2007]
 *  @version 0.2.0  [27.7.2007]		// add cancel/abort and change function set up.
 *  @version 0.3.0  [26.10.2007]	// upgrade to Transfer_Controller.
 *  @version 0.3.6  [7.11.2007]
 *  @version 0.3.7  [13.11.2007]
 *  @version 0.3.8  [6.10.2008]
 */


//--------------------------------------------------------------------------------------------------
//
// Local constants.

var TRANSFER_LIST_SLOT_COUNT = 4;		// 10
var TRANSFER_DESCRIPTOR_SLOT_COUNT = 7;
var FIRST_TX_SEQUENCE_COUNT = 1;
var LAST_TX_SEQUENCE_COUNT = 255;

//--------------------------------------------------------------------------------------------------
//
// Field offsets.

/**
 *	Transfer descriptor field offsets.
 *	@final
 *	@type	integer
 */
// TD = Transfer Descriptor
var TD_STATE	= 0;		// The transfer state.
var TD_REQNUM	= 1;		// The transfer request order number.
var TD_IDTYPE	= 2;		// The transfer message type.
var TD_CALLER	= 3;		// The unique application-wide name of the caller.
var TD_TARGET	= 4;		// The target URL.
var TD_OUTPUT	= 5;		// The data to send to the target.
var TD_TXSEQC	= 6;		// The identifying transfer transmission sequence count (cycles through 1..255).

//--------------------------------------------------------------------------------------------------
//
// Request states.

/**
 *	Transfer descriptor request states.
 *	@final
 *	@type	integer
 */
// RS = Request State
var RS_NONE 	= 0;		// No request. The descriptor is empty/inactive.
var RS_SETUP	= 1;		// The descriptor has been allocated to set up a new request.
var RS_WAIT		= 2;		// The request has been queued and is awaiting transmission.
var RS_ACTIVE	= 3;		// The transfer has started and is awaiting a response or timeout.

//--------------------------------------------------------------------------------------------------
//
// Status flags and masks.


//--------------------------------------------------------------------------------------------------


/**
 *	Transfer_Controller constructor.
 *	@class	The class Transfer_Controller implements the support service for asynchronous message transfers 
 *	with the server -- providing message sequencing, message identification, transfer timeout and transfer abort.
 *
 *	@constructor
 *
 *  @return	none
 *  @type	void
 */

function Transfer_Controller()
{
	/**
	 *	The request sequence count of the last transfer request accepted and queued.
	 *	@type	integer
	 */
	this.m_nLast_Request_Received = 0;

	/**
	 *	The request sequence count of the last transfer request actioned/transmitted.
	 *	@type	integer
	 */
	this.m_nLast_Request_Actioned = 0;

	/**
	 *	The active transmission sequence count [1..255].
	 *	An initial value is set that will force a sequence restart.
	 *	@type	integer
	 */
	this.m_nLast_Transmission_Count = LAST_TX_SEQUENCE_COUNT;

	/**
	 *	State flag indicating a transfer is in progress.
	 *	@type	boolean
	 */
	this.m_bTransmission_Active = false;

	/**
	 *	A preset number of transfer descriptor slots 
	 *	holding details of both active and queued transfers
	 *	(built dynamically so it will not be shared by controllers).
	 *	@type	array
	 */
	this.m_aaTransfer_List = null;
	this.reset_transfer_list();
}


/**
 *  Nominates a pre-existing function for processing input messages.
 *
 *  @param	{function} a_fCompletion_Handler A reference to the handler for transfer completion.
 *
 *  @return	none
 *  @type	void
 */
/*
AsyncTransfer.prototype.set_handler = function(a_fCompletion_Handler)
{
	this.m_fCompletion_Handler = null;

	if (is_function(a_fCompletion_Handler)) {
		this.m_fCompletion_Handler = a_fCompletion_Handler;
	}
}
*/

/**
 *  Request a message transfer.
 *
 *  @param	{string} a_sType The message type
 *  @param	{string} a_sId The unique application-wide id of the caller
 *  @param	{string} a_sUrl The target URL
 *  @param	{string} a_sData Data to send to the server (in query-string format)
 *
 *  @return	True if request accepted, otherwise false.
 *  @type	boolean
 */

Transfer_Controller.prototype.request_transfer = function(a_sType, a_sId, a_sUrl, a_sData)
{
	//log_message('Here at Transfer_Controller::request_transfer()'
	//			+ '\ntype = \'' + a_sType + '\''
	//			+ '\ncaller = \'' + a_sId + '\''
	//			+ '\ntarget = \'' + a_sUrl + '\''
	//			+ '\ndata = \'' + a_sData + '\'');

	var nNext_Request = -1;

	// Get a free transfer descriptor.
	var nDescriptor_Slot = this.next_free_slot();
	if (nDescriptor_Slot == -1) {
		return (false);				// None free!
	}

	// Set up the transfer descriptor.
	// The Async_Transfer object will not be allocated until the transfer is ready
	// to be actioned and the transfer sequence count will also be assigned then.
	this.m_nLast_Request_Received++;
	this.m_aaTransfer_List[nDescriptor_Slot][TD_REQNUM] = this.m_nLast_Request_Received;
	this.m_aaTransfer_List[nDescriptor_Slot][TD_IDTYPE] = a_sType;
	this.m_aaTransfer_List[nDescriptor_Slot][TD_CALLER] = a_sId;
	this.m_aaTransfer_List[nDescriptor_Slot][TD_TARGET] = a_sUrl;
	this.m_aaTransfer_List[nDescriptor_Slot][TD_OUTPUT] = a_sData;
	this.m_aaTransfer_List[nDescriptor_Slot][TD_TXSEQC] = 0;
	this.m_aaTransfer_List[nDescriptor_Slot][TD_STATE] = RS_WAIT;
	//this.display_transfer_list();

	// If transmission is already active then just return request accepted.
	if (this.locate_active_transfer() != -1) {
		//log_message('Active transfer found.');
		return (true);
	}

	// Drop here to activate the next request.
	nNext_Request = this.locate_next_request();
	//log_message('Next request = ' + nNext_Request);
	if (nNext_Request == -1) {
		return (true);			// None queued? So what happened to this one?
	}
	this.start_transfer(nNext_Request);
	return (true);
}


/**
 *  Start a new transfer.
 *
 *	@private
 *  @param	{integer} a_nSlot_Index The index to the descriptor for the queued transfer.
 *
 *  @return	none
 *  @type	void
 */

Transfer_Controller.prototype.start_transfer = function(a_nSlot_Index)
{
	var rAsync_Handler = this.get_async_controller();

	// Set the new transmission sequence count and update the last-request-actioned number.
	if (this.m_nLast_Transmission_Count >= LAST_TX_SEQUENCE_COUNT) {
		this.m_nLast_Transmission_Count = FIRST_TX_SEQUENCE_COUNT;
	}
	else {
		this.m_nLast_Transmission_Count++;
	}
	this.m_aaTransfer_List[a_nSlot_Index][TD_TXSEQC] = this.m_nLast_Transmission_Count;
	this.m_nLast_Request_Actioned = this.m_aaTransfer_List[a_nSlot_Index][TD_REQNUM];

	// Request a 5 second timeout on the logout request.
	//rTimeout_Service.request_timeout(5, this.m_sDisplay_Name, '');

	this.m_bTransmission_Active = true;
	this.m_aaTransfer_List[a_nSlot_Index][TD_STATE] = RS_ACTIVE;
	rAsync_Handler.start_transfer(this.m_aaTransfer_List[a_nSlot_Index][TD_TXSEQC],
									this.m_aaTransfer_List[a_nSlot_Index][TD_IDTYPE],
										this.m_aaTransfer_List[a_nSlot_Index][TD_TARGET],
											this.m_aaTransfer_List[a_nSlot_Index][TD_OUTPUT]);
}


/**
 *  Validate and forward the transfer reply.
 *
 *	@param	{integer} a_nSequenceID The unique sequence id for the transfer
 *	@param	{integer} a_nStatus_Code The termination status code
 *	@param	{string} a_sStatus_Text The termination status text message
 *	@param	{string} a_sResponse_Text The received text
 *	@param	{object} a_sResponse_XML The received XML
 *
 *  @return	none
 *  @type	void
 */

Transfer_Controller.prototype.transfer_completion = function(a_nSequenceID, 
															 a_nStatus_Code, a_sStatus_Text, 
															 a_sResponse_Text, a_sResponse_XML)
{
	//log_message('Here at Transfer_Controller::transfer_completion() with sequence count ' + a_nSequenceID);

	var nActive_Slot = -1;
	var bValid_Transfer = false;
	var sTransfer_Response = '';

	// First ensure a transfer is active.
	nActive_Slot = this.locate_active_transfer();
	if (nActive_Slot == -1) {
		return;
	}

	if (nActive_Slot != this.locate_transfer_request(a_nSequenceID)) {
		// Note this exit leaves the unmatched transfer request active.
		return;
	}

	//log_message('transfer_completion() -- XmlHttp status code = ' + a_nStatus_Code 
	//			+ '\nstatus text = [' + a_sStatus_Text + ']');

	// Now we can identify the local client
	// check we've received a valid message.
	if (a_nStatus_Code != 200) {
		sTransfer_Response = a_nStatus_Code;
		if (a_sStatus_Text.length > 0) {
			sTransfer_Response += ': ' + a_sStatus_Text;
		}
		//log_message('transfer response = [' + sTransfer_Response + ']');
	}
	else {
		sTransfer_Response = a_sResponse_Text;
		//log_message('transfer response = [' + sTransfer_Response + ']');

		if (sTransfer_Response.length > 0) {
			nIndex1 = sTransfer_Response.indexOf(MESSAGE_FIELD_SEPARATOR);
			nIndex2 = sTransfer_Response.indexOf(MESSAGE_FIELD_SEPARATOR, (nIndex1 + 1));
			sReceived_Sequence_Count 
					= sTransfer_Response.substring((nIndex1 + MESSAGE_FIELD_SEPARATOR.length), nIndex2);
			//log_message('received sequence count \'' + sReceived_Sequence_Count + '\''
			//			+ ' and was expecting sequence count \'' + a_nSequenceID + '\'');
			if (sReceived_Sequence_Count != a_nSequenceID) {
				// Note this exit leaves the unmatched transfer request active.
				return;
			}
			bValid_Transfer = true;
		}
	}

	// Locate the original caller and forward the reply.
	// Don't use a callback function in case the caller
	// ceased to exist during the operation of the transfer.
	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('panel controller not found by Transfer_Controller::transfer_completion().');
		return;
	}

	// It's OK if the calling panel is not found because a user 
	// might have terminated it before its transfer completed.
	var rUser_Panel = rPanel_Controller.fetch_display(this.m_aaTransfer_List[nActive_Slot][TD_CALLER]);
	if (is_null(rUser_Panel)) {
		//alert('\'' + this.m_aaTransfer_List[nActive_Slot][TD_CALLER] 
		//	  + '\' panel not found by Transfer_Controller::transfer_completion().');
		return;
	}
	rUser_Panel.transfer_completion(this.m_aaTransfer_List[nActive_Slot][TD_IDTYPE], bValid_Transfer, sTransfer_Response);

	// Set this transfer request as no longer active.
	this.m_aaTransfer_List[nActive_Slot][TD_STATE] = RS_NONE;

	// If transmission is already active then just return request accepted.
	if (this.locate_active_transfer() != -1) {
		//log_message('Active transfer found2.');
		return;
	}

	// Drop here to activate the next request.
	var nNext_Request = this.locate_next_request();
	//log_message('Next request2 = ' + nNext_Request);
	if (nNext_Request == -1) {
		return;					// None queued.
	}
	this.start_transfer(nNext_Request);
}


/**
 *  Cancel/abort the current transfer.
 *
 *  @return	none
 *  @type	void
 */

Transfer_Controller.prototype.cancel_transfer = function()
{
	var nActive_Slot = -1;

	// First ensure a transfer is active.
	nActive_Slot = this.locate_active_transfer();
	if (nActive_Slot == -1) {
		return;
	}
}


/**
 *  Return the slot number of the descriptor for the current active transfer.
 *
 *	@private
 *
 *  @return	Descriptor list index of current active transfer descriptor, otherwise -1.
 *  @type	integer
 */

Transfer_Controller.prototype.locate_active_transfer = function()
{
	for (var nx=0; nx<TRANSFER_LIST_SLOT_COUNT; nx++) {
		if (this.m_aaTransfer_List[nx][TD_STATE] == RS_ACTIVE) {
			return (nx);
		}
	}

	// Drop here if there are no active transfers.
	return (-1);
}


/**
 *  Return the slot number of the descriptor using the specified sequence id.
 *
 *	@private
 *  @param	{integer} a_nSequence_Id The descriptor's allocated sequence id.
 *
 *  @return	Descriptor list index of the matching transfer descriptor, otherwise -1.
 *  @type	integer
 */

Transfer_Controller.prototype.locate_transfer_request = function(a_nSequence_Id)
{
	for (var nx=0; nx<TRANSFER_LIST_SLOT_COUNT; nx++) {
		if (this.m_aaTransfer_List[nx][TD_TXSEQC] == a_nSequence_Id) {
			return (nx);
		}
	}

	// Drop here if the sequence id was not found.
	return (-1);
}


/**
 *  Return the slot number of the descriptor for the next transfer to be actioned.
 *
 *	@private
 *
 *  @return	Descriptor list index of the next queued transfer descriptor, otherwise -1.
 *  @type	integer
 */

Transfer_Controller.prototype.locate_next_request = function()
{
	var nEarliest_Queued_Request_Number = 0;
	var nEarliest_Queued_Request_Index = -1;

	for (var nx=0; nx<TRANSFER_LIST_SLOT_COUNT; nx++) {
		if ((this.m_aaTransfer_List[nx][TD_STATE] == RS_WAIT)
			&& (this.m_aaTransfer_List[nx][TD_REQNUM] > this.m_nLast_Request_Actioned)) {
			if ((nEarliest_Queued_Request_Number == 0)
				|| (this.m_aaTransfer_List[nx][TD_REQNUM] < nEarliest_Queued_Request_Number)) {
				nEarliest_Queued_Request_Number = this.m_aaTransfer_List[nx][TD_REQNUM];
				nEarliest_Queued_Request_Index = nx;
			}
		}
	}

	// Drop here if there are no active transfers.
	return (nEarliest_Queued_Request_Index);
}


/**
 *  Return the slot number of the next free transfer descriptor in the descriptor list.
 *
 *	@private
 *
 *  @return	Descriptor list index of next free transfer descriptor, otherwise -1.
 *  @type	integer
 */

Transfer_Controller.prototype.next_free_slot = function()
{
	for (var nx=0; nx<TRANSFER_LIST_SLOT_COUNT; nx++) {
		if (this.m_aaTransfer_List[nx][TD_STATE] == RS_NONE) {
			// First clear the transfer descriptor then allocate it.
			this.reset_transfer_descriptor(this.m_aaTransfer_List[nx]);
			this.m_aaTransfer_List[nx][TD_STATE] = RS_SETUP;
			return (nx);
		}
	}

	// Drop here if no free slots were found.
	return (-1);
}


/**
 *  Builds and initialises the transfer descriptor list.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Transfer_Controller.prototype.reset_transfer_list = function()
{
	this.m_aaTransfer_List = new Array(TRANSFER_LIST_SLOT_COUNT);

	for (var nx=0; nx<TRANSFER_LIST_SLOT_COUNT; nx++) {
		this.m_aaTransfer_List[nx] = new Array(TRANSFER_DESCRIPTOR_SLOT_COUNT);
		this.reset_transfer_descriptor(this.m_aaTransfer_List[nx]);
	}

	//this.display_transfer_list();
}


/**
 *  Re-initialises a transfer descriptor.
 *
 *	@private
 *	@param	{array} a_aDescriptor A reference to a transfer descriptor.
 *
 *  @return	none
 *  @type	void
 */

Transfer_Controller.prototype.reset_transfer_descriptor = function(a_aDescriptor)
{
	a_aDescriptor[TD_STATE] = RS_NONE;
	a_aDescriptor[TD_REQNUM] = 0;
	a_aDescriptor[TD_IDTYPE] = '';
	a_aDescriptor[TD_CALLER] = '';
	a_aDescriptor[TD_TARGET] = '';
	a_aDescriptor[TD_OUTPUT] = '';
	a_aDescriptor[TD_TXSEQC] = 0;
}


/**
 *  Display each descriptor in the transfer descriptor list.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Transfer_Controller.prototype.display_transfer_list = function()
{
	for (var nx=0; nx<TRANSFER_LIST_SLOT_COUNT; nx++) {
		alert((nx + 1) + ".  slot count = " + this.m_aaTransfer_List[nx].length
			  + '\nstate = ' + this.format_descriptor_state(this.m_aaTransfer_List[nx][TD_STATE])
			  + '\nreqnum = ' + this.m_aaTransfer_List[nx][TD_REQNUM]
			  + '\nidtype = \'' + this.m_aaTransfer_List[nx][TD_IDTYPE] + '\''
			  + '\ncaller = \'' + this.m_aaTransfer_List[nx][TD_CALLER] + '\''
			  + '\ntarget = \'' + this.m_aaTransfer_List[nx][TD_TARGET] + '\''
			  + '\noutput = \'' + this.m_aaTransfer_List[nx][TD_OUTPUT] + '\''
			  + '\ntxseqc = ' + this.m_aaTransfer_List[nx][TD_TXSEQC]);
	}
}


/**
 *  Return the text-symbol equivalent of a transfer descriptor state.
 *
 *	@private
 *	@param	{array} a_nState A transfer descriptor numeric state.
 *
 *  @return	none
 *  @type	void
 */

Transfer_Controller.prototype.format_descriptor_state = function(a_nState)
{
	var sState_Symbol = 'RS_UNKNOWN';

	switch (a_nState) {

	case RS_NONE:	sState_Symbol = 'RS_NONE';
					break;

	case RS_SETUP:	sState_Symbol = 'RS_SETUP';
					break;

	case RS_WAIT:	sState_Symbol = 'RS_WAIT';
					break;

	case RS_ACTIVE:	sState_Symbol = 'RS_ACTIVE';
					break;

	default:		sState_Symbol = 'RS_UNKNOWN';
					break;
	}

	return (sState_Symbol);
}


/**
 *  Return the active Async_Transfer_Controller.
 *	This function hides the detail of how the Async_Transfer_Controller object is managed.
 *
 *	@private
 *
 *  @return	The current/new Async_Transfer_Controller.
 *  @type	reference
 */

Transfer_Controller.prototype.get_async_controller = function()
{
	var rAsync_Handler = null;

	// First ensure the asynchronous transfer controller exists.
	rAsync_Handler = locate_registered_object('async_controller');
	if (is_null(rAsync_Handler)) {
		rAsync_Handler = new Async_Transfer();
		register_new_object('async_controller', rAsync_Handler);
	}

	return (rAsync_Handler);
}


/* -+- */


