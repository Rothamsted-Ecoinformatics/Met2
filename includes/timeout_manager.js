/**
 *  @fileoverview The class Timeout_Manager implements the application timeout service.
 *
 *	@version 0.0.4  [23.7.2007]
 *	@version 0.0.5  [9.9.2008]
 */


//--------------------------------------------------------------------------------------------------
//
// Local constants.

// Panel-entry indexes.
var PX_ELEMENT_ID = 0;
var PX_ELEMENT_LIST = 1;
var PX_SECTION_COUNT = 2;

// Section-entry indexes.
var SX_SECTION_ID = 0;
var SX_SECTION_TYPE = 1;
var SX_ELEMENT_ID = 2;
var SX_ELEMENT_LIST = 3;

// Block lengths.
var PX_ENTRY_COUNT = 3;
var SX_ENTRY_COUNT = 4;

//--------------------------------------------------------------------------------------------------


/**
 *	Constructor for the Timeout_Manager class.
 *	@class	The class Timeout_Manager is both the container and the handler for all timeout requests.
 *	It is also designed to eliminate any scoping problems introduced when handling a timeout event.
 *	This class requires the existence of appropriate event handlers in a lower-level service layer
 * 	(with global/window scope).
 *
 *	@constructor
 *	@param	{string} a_sService_Name A unique application-wide name for the service provided.
 *
 *	@return	none
 *	@type	void
 */

function Timeout_Manager(a_sService_Name)
{
	/**
	 *	The unique application-wide name for the service provided by this module.
	 *	@type	string
	 */
	this.m_sService_Name = a_sService_Name;

	/**
	 *	This flag indicates when the handler is already waiting for a system timeout event.
	 *	@type	boolean
	 */
	this.m_bTimer_Active = false;

	/**
	 *	Holds the Id for the current active timeout (if there is one).
	 *	@type	integer
	 */
	this.m_nTimeout_Id = 0;

	/**
	 *	The unique app-wide id of the display panel (object) requesting the timeout.
	 *	@type	string
	 */
	this.m_sMain_Id = '';

	/**
	 *	The id (if any) of the display sub-panel (object) requesting the timeout.
	 *	@type	string
	 */
	this.m_sSub_Id = '';

	/**
	 *	The number of active client-timeout requests.
	 *	@type	integer
	 */
	this.m_nRequest_Count = 0;

	/**
	 *	The call-back details etc. for all active client-timeout requests.
	 *	@type	array
	 */
	this.m_asRequest_Details = Array();
}


/**
 *  Request a new timeout.
 *
 *	@param	{integer} a_nElapsed_Seconds The interval to the required timeout in seconds.
 *	@param	{string} a_sMain_Id The unique app-wide id of the requesting display panel.
 *	@param	{string} a_sSub_Id The internal panel id of the requesting display sub-panel.
 *						An empty string if the request was issued by a main display panel.
 *
 *  @return	none
 *  @type	void
 */

Timeout_Manager.prototype.request_timeout = function(a_nElapsed_Seconds, a_sMain_Id, a_sSub_Id)
{
	this.m_sMain_Id = a_sMain_Id;
	this.m_sSub_Id = a_sSub_Id;
	this.m_nTimeout_Id = setTimeout('timeout_handler()', (a_nElapsed_Seconds * 1000));
	this.m_bTimer_Active = true;
}


/**
 *  Cancel an existing timeout request.
 *
 *	@param	{string} a_sMain_Id The unique app-wide id of the requesting display panel.
 *	@param	{string} a_sSub_Id The internal panel id of the requesting display sub-panel.
 *						An empty string if the request was issued by a main display panel.
 *
 *  @return	none
 *  @type	void
 */

Timeout_Manager.prototype.cancel_timeout = function(a_sMain_Id, a_sSub_Id)
{
	if ((a_sMain_Id == this.m_sMain_Id)
		&& (a_sSub_Id == this.m_sSub_Id)) {
        this.clear_timeout();
	}
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Timeout_Manager.prototype.print_state = function()
{
	var sRequest_Detail_List = '';

//	for (var nx=0; nx<this.m_nRequest_Count; nx++) {
//		sDataset_Status_List += '\n' + this.m_asGroup_Definition[nGroup_Definition_Index + DG_NAME]
//                                + ' = ' + this.m_afDataset_Display_State[nx];
//	}

	return ('[Timeout_Manager]'
			+ '\nService name = ' + this.m_sService_Name
			+ '\nRequest active flag = ' + this.m_bTimer_Active
            + '\nActive timeout id = ' + this.m_nTimeout_Id
			+ '\nRequest count = ' + this.m_nRequest_Count
			+ '\nMain panel id = ' + this.m_sMain_Id
			+ '\nSub-panel id = ' + this.m_sSub_Id
            + '\nActive client-request details:'
			+ '\n' + sRequest_Detail_List);
}


/**
 *  Invoked by the timeout event handler to process a new timeout.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Timeout_Manager.prototype.handle_timeout = function()
{
	this.m_nTimeout_Id = 0;
	this.m_bTimer_Active = false;
	var sSaved_Main_Id = this.m_sMain_Id;
	this.m_sMain_Id = '';
	var sSaved_Sub_Id = this.m_sSub_Id;
	this.m_sSub_Id = '';

	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		alert('No panel controller found during a timeout.');
		return;
	}

	var rPanel_Display = rPanel_Controller.fetch_display(sSaved_Main_Id);
	if (is_null(rPanel_Display)) {
		alert('Display \'' + sSaved_Main_Id + '\' not found after a timeout.');
		return;
	}

	// Check we're targeting the display panel and not a display section within it.
	if ((sSaved_Sub_Id == null)
		|| (!is_string(sSaved_Sub_Id))
		|| (sSaved_Sub_Id.length == 0)) {
		rPanel_Display.handle_timeout();
		return;
	}

	// Otherwise ensure the display section is active before proceeding.
	var rSection_Display = rPanel_Display.fetch_display(sSaved_Sub_Id);
	if (is_null(rSection_Display)) {
		alert('Display section \'' + sSaved_Main_Id + '/' + sSaved_Sub_Id + '\' not found after a timeout.');
		return;
	}
	rSection_Display.handle_timeout();
}


/**
 *  Clear the existing outstanding system timeout.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Timeout_Manager.prototype.clear_timeout = function()
{
	if ((this.m_bTimer_Active == true)
		&& (this.m_nTimeout_Id != 0)) {
		clearTimeout(this.m_nTimeout_Id);
        this.m_nTimeout_Id = 0;
        this.m_bTimer_Active = false;
		this.m_sMain_Id = '';
		this.m_sSub_Id = '';
	}
}


/**
 *  Create and initialise a new display status descriptor.
 *
 *	@private
 *	@param	{integer} a_nRow_Count The number of rows (datasets) in the display table.
 *
 *  @return	none
 *  @type	void
 */
/*
Dataset_Table.prototype.reset_display_status = function(a_nRow_Count)
{
	// Note the first element is reserved for the table itself.
	var nElement_Count = a_nRow_Count + 1;
	this.m_afDataset_Display_State = Array(nElement_Count);

	// First reset the state for the table as a whole.
	this.m_afDataset_Display_State[0] = 0;

	// Reset the state for each dataset row (NB title rows are not included).
	if (a_nRow_Count > 0) {
		for (var nx=1; nx<nElement_Count; nx++) {
			this.m_afDataset_Display_State[nx] = 0;
		}
	}
}
*/

/* -+- */


