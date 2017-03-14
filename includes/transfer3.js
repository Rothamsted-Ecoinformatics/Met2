/**
 *  @fileoverview The class AsyncTransfer supports asynchronous Ajax POSTs.
 *
 *  @version 0.1.3  [3.4.2006]
 *  @version 0.1.4  [9.3.2007]
 *
 *  @version 0.1.6  [13.3.2007]
 *  @version 0.1.10  [13.4.2007]
 *  @version 0.2.0  [27.7.2007]		// add cancel/abort and change function set up.
 *	@version 0.2.1  [9.9.2008]
 */


/**
 *  AsyncTransfer constructor.
 *
 *  @param	{string} a_sID Unique identifier for the transfer.
 *
 *  @return	none
 *  @type	void
 */

function AsyncTransfer(a_sID)
{
	this.m_transferID = a_sID;
	this.m_fCompletion_Handler = null;
	this.m_xmlhttp = get_request_object();
}


/**
 *  Nominates a pre-existing function for processing input messages.
 *
 *  @param	{function} a_fCompletion_Handler A reference to the handler for transfer completion.
 *
 *  @return	none
 *  @type	void
 */

AsyncTransfer.prototype.set_handler = function(a_fCompletion_Handler)
{
	this.m_fCompletion_Handler = null;

	if (is_function(a_fCompletion_Handler)) {
		this.m_fCompletion_Handler = a_fCompletion_Handler;
	}
}


/**
 *  Start an asynchronous HTTP POST transfer.
 * 
 *  Note the use of the instance variable to overcome
 *  the loss of context when the completion callback is made.
 *
 *  @param	{string} a_sUrl The target URL
 *  @param	{string} a_sData Data to send to the server (in query-string format)
 *
 *  @return	none
 *  @type	void
 */

AsyncTransfer.prototype.start_transfer = function(a_sUrl, a_sData)
{
	var rThis_Instance = this;

	//var sNew_Url = a_sUrl + '?t=' + ((new Date()).valueOf());
	var sNew_Url = a_sUrl;
	// Issue the open first because this resets the XMLHttpRequest object.
	// Reminder: the 'true' argument specifies handling the request asynchronously.
	this.m_xmlhttp.open('POST', sNew_Url, true);
	this.m_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// state 0 = The request is not initialised. The object has been created but not yet opened.
	// state 1 = The request has been set up. Open has been called but the request has not been sent.
	// state 2 = The request has been sent.
	// state 3 = The request is in progress. A partial response has been received.
	// state 4 = The request is complete. A complete response has been received and the connection has been closed.
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
				alert('AsyncTransfer..sink');
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


/**
 *  Cancel/abort the current transfer.
 *	The object should become as usable as one freshly created 
 *	ie ready to be initialised by an open() request.
 *
 *  @return	none
 *  @type	void
 */

AsyncTransfer.prototype.cancel_transfer = function()
{
	this.m_fCompletion_Handler = null;
	this.m_xmlhttp.abort();
}


/* -+- */


