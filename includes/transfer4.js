/**
 *  @fileoverview The class Async_Transfer is the handler for asynchronous client-server transmissions.
 *
 *  @version 0.1.3  [3.4.2006]
 *  @version 0.1.4  [9.3.2007]
 *
 *  @version 0.1.6  [13.3.2007]
 *  @version 0.1.10  [13.4.2007]
 *  @version 0.2.0  [27.7.2007]		// add cancel/abort and change function set up.
 *  @version 0.3.0  [1.11.2007]		// no longer needs to create a closure.
 *  @version 0.3.3  [7.11.2007]
 *  @version 0.3.5  [13.11.2007]
 *  @version 0.3.6  [18.9.2008]
 *  @version 0.3.7  [6.10.2008]
 */


//--------------------------------------------------------------------------------------------------
//
// Local constants.

//var COMMON_TRANSMISSION_HANDLER = async_input_handler;	// creates module loading order problems.
var MESSAGE_FIELD_SEPARATOR = '!-!';

//--------------------------------------------------------------------------------------------------
//
// Transmission states.

/**
 *	Client-server transmission states.
 *	@final
 *	@type	integer
 */
// TS = Transmission State
var TS_INACTIVE = 0;		// No transmission active.
var TS_TRANSFER	= 1;		// Transfer in progress.
var TS_COMPLETE	= 2;		// Processing for a transfer completion.
var TS_ABORTING	= 3;		// Processing for a transfer abort.

//--------------------------------------------------------------------------------------------------


/**
 *  Async_Transfer constructor.
 *	@class	The class Async_Transfer implements support for asynchronous Ajax POSTs
 *	while providing a wrapper for the browser XMLHttpRequest object.
 *
 *	@constructor
 *
 *  @return	none
 *  @type	void
 */

function Async_Transfer()
{
	/**
	 *  The transmission state = INACTIVE | TRANSFER | COMPLETE	| ABORTING.
	 *	@type	integer
	 */
	this.m_nTransmission_State = TS_INACTIVE;

	/**
	 *  The active identifying transmission sequence count used to
	 *  associate a transfer request with its transmission message.
	 *	@type	integer
	 */
	this.m_nSequence_Count = 0;

	/**
	 *	A reference to a replacement transmission event handler.
	 *	@type	reference
	 */
	this.m_fEvent_Handler = null;

	/**
	 *	A reference to the contained XMLHttpRequest object.
	 *	@type	reference
	 */
	this.m_xmlhttp = get_request_object();
}


/**
 *  Nominates a new pre-existing target function to process transmission events.
 *	Allows a replacement asynchronous event handler to be declared for a transmission.
 *
 *  @param	{function} a_fEvent_Handler A reference to the new event handler.
 *
 *  @return	none
 *  @type	void
 */

Async_Transfer.prototype.set_handler = function(a_fEvent_Handler)
{
	this.m_fEvent_Handler = null;

	if (is_function(a_fEvent_Handler)) {
		this.m_fEvent_Handler = a_fEvent_Handler;
	}
}


/**
 *  Confirm that transmission is active.
 *
 *  @return	True when in the 'Transfer in progress' state. Otherwise false.
 *  @type	boolean
 */

Async_Transfer.prototype.is_active = function()
{
	return (this.m_nTransmission_State == TS_TRANSFER);
}


/**
 *  Start an asynchronous HTTP POST transfer.
 *
 *  @param	{string} a_nSeq The identifying transmission sequence count
 *  @param	{string} a_sType The transfer message type
 *  @param	{string} a_sUrl The target URL
 *  @param	{string} a_sData Data to send to the server (in query-string format)
 *
 *  @return	True if successful/accepted. Otherwise false.
 *  @type	boolean
 */

Async_Transfer.prototype.start_transfer = function(a_nSeq, a_sType, a_sUrl, a_sData)
{
	//log_message('Here at Async_Transfer::start_transfer()'
	//			+ '\na_nSeq = ' + a_nSeq
	//			+ '\na_sType = ' + a_sType
	//			+ '\na_sUrl = ' + a_sUrl
	//			+ '\na_sData = ' + a_sData);

	// Can only start a new transfer if we're currently inactive.
	if (this.m_nTransmission_State != TS_INACTIVE) {
		//log_message('Still active');
		return (false);
	}

	//var sNew_Url = a_sUrl + '?t=' + ((new Date()).valueOf());
	var sNew_Url = a_sUrl;
	this.m_xmlhttp.open('POST', sNew_Url, true);
	this.m_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// Ensure the transmission event handler (state-change handler) is set up.
	if (is_null(this.m_fEvent_Handler)) {
		// Normally use the common asynchronous transmission handler.
		this.m_xmlhttp.onreadystatechange = async_input_handler;
	}
	else {
		this.m_xmlhttp.onreadystatechange = this.m_fEvent_Handler;
	}

	var sNew_Data_String = 'seq_id=' + escape(a_nSeq) + '&msg_id=' + a_sType;
	if (a_sData.length > 0) {
		sNew_Data_String += '&' + a_sData;
	}

	this.m_nTransmission_State = TS_TRANSFER;
	this.m_nSequence_Count = a_nSeq;
	this.m_xmlhttp.send(sNew_Data_String);

	return (true);
}
/*
Async_Transfer.prototype.start_transfer = function(a_sUrl, a_sData)
{
	var rThis_Instance = this;

	//var sNew_Url = a_sUrl + '?t=' + ((new Date()).valueOf());
	var sNew_Url = a_sUrl;
	this.m_xmlhttp.open('POST', sNew_Url, true);
	this.m_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	this.m_xmlhttp.onreadystatechange = function() {
		switch (rThis_Instance.m_xmlhttp.readyState) {
		case 1:
			// loading.
			break;
		case 2:
			// loaded.
			break;
		case 3:
			// interactive.
			break;
		case 4:
			// complete.
			if (rThis_Instance.m_fCompletion_Handler) {
				rThis_Instance.m_fCompletion_Handler(rThis_Instance.m_transferID, 
													rThis_Instance.m_xmlhttp.status,
														rThis_Instance.m_xmlhttp.statusText, 
															rThis_Instance.m_xmlhttp.responseText, 
																rThis_Instance.m_xmlhttp.responseXML);
			}
			else {
				alert('Async_Transfer..sink');
			}
			break;
		}
	};

	var sNew_Data_String = 'transfer_id=' + escape(this.m_transferID);
	if (a_sData.length > 0) {
		sNew_Data_String += '&' + a_sData;
	}

	this.m_xmlhttp.send(sNew_Data_String);
}
*/

/**
 *  Validate and forward the tranmsission response.
 *
 *  @return	none
 *  @type	void
 */

Async_Transfer.prototype.transfer_completion = function()
{
	//log_message('Async_Transfer.transfer_completion()');

	var rMessage_Transfer_Service = null;
	var nIndex1 = 0;
	var nIndex2 = 0;
	var sReceived_Sequence_Count = '';

	//log_message('Async_Transfer.m_xmlhttp.responseText = <br>[' + this.m_xmlhttp.responseText + ']');

	// Only continue if we have the correct message sequence id.
    if (this.m_xmlhttp.responseText.length == 0) {
		return;
	}
	else {
		nIndex1 = this.m_xmlhttp.responseText.indexOf(MESSAGE_FIELD_SEPARATOR);
		nIndex2 = this.m_xmlhttp.responseText.indexOf(MESSAGE_FIELD_SEPARATOR, (nIndex1 + 1));
		sReceived_Sequence_Count 
			= this.m_xmlhttp.responseText.substring((nIndex1 + MESSAGE_FIELD_SEPARATOR.length), nIndex2);
		//log_message('Received \'' + sReceived_Sequence_Count + '\' and expected \'' + this.m_nSequence_Count + '\'');
		if (sReceived_Sequence_Count != this.m_nSequence_Count) {
			return;
		}
	}

	this.m_nTransmission_State = TS_COMPLETE;
	this.m_xmlhttp.onreadystatechange = function() { };

	// Finally forward the reply to the parent service.
	rMessage_Transfer_Service = locate_registered_object('message_service');
	if (is_null(rMessage_Transfer_Service)) {
		alert('message_service not found');
		return;
	}
	// Note that resetting the state here is based on the premise
	// that the Message Service will not set up a new transfer
	// until the input from this transfer has been forwarded
	// to the caller ie either processed or copied.
	this.m_nTransmission_State = TS_INACTIVE;
	rMessage_Transfer_Service.transfer_completion(this.m_nSequence_Count,
												  this.m_xmlhttp.status, this.m_xmlhttp.statusText, 
												  this.m_xmlhttp.responseText, this.m_xmlhttp.responseXML);
}


/**
 *  Cancel/abort the current transfer.
 *
 *  @return	none
 *  @type	void
 */

Async_Transfer.prototype.cancel_transfer = function()
{
	this.m_nTransmission_State = TS_ABORTING;
	this.m_fEvent_Handler = null;
	this.m_xmlhttp.onreadystatechange = function() { };
	this.m_xmlhttp.abort();
	this.m_xmlhttp = null;
}


/**
 *  Who/What Am I.
 *
 *  @return	An identifiying string.
 *  @type	string
 */

Async_Transfer.prototype.wai = function()
{
	return ('Async_Transfer');
}


/* -+- */


