/**
 *  @fileoverview The class Dataset_Table is the display handler for all dataset listing tables.
 *
 *	@version 0.1.18  [24.1.2007]
 *	@version 0.1.19  [29.1.2007]
 *	@version 0.1.26  [1.5.2007]
 *	@version 0.1.27  [13.7.2007]
 *	@version 0.1.29  [28.9.2007]
 */


//--------------------------------------------------------------------------------------------------
//
// Local constants.

// Initial value for the ordering id.
var DATASET_DEFAULT_ORDERING = 2;

//--------------------------------------------------------------------------------------------------
//
// Status flags and masks.

// Table: Records the active group ordering option (1-3, 1 being the default/initial option).
// Set:   --
var fActive_Orderingd_Bits = 3;
var fReset_Orderingd_Mask = (-1) ^ fActive_Orderingd_Bits;

// Table: All rows have been created (whether visible or not).
// Set:   The row is displayed (not hidden as after a 'hide unchecked fields' operation) ???
//			NB: could have been unchecked after the 'hide' operation.
//var fDisplay_Flag = 1;
//var fUndisplay_Mask = (-1) ^ fDisplay_Flag;
var fListed_Flag = 4;
var fUnlisted_Mask = (-1) ^ fListed_Flag;

// Table: --
// Set:   The checkbox selecting the dataset is ticked.
var fSelect_Flag = 8;
var fUnselect_Mask = (-1) ^ fSelect_Flag;

// Table: Show all column help rows (0 = collapse all column help rows).
//			Co-ordinates the state of the 'show/hide' column help button.
// Set:   --
var fShowhelpd_Flag = 16;
var fUnshowhelpd_Mask = (-1) ^ fShowhelpd_Flag;

//--------------------------------------------------------------------------------------------------


/**
 *	Constructor for the Dataset_Table class.
 *	@class	The class Dataset_Table provides support for the display/re-display
 *	operations for all dataset listing tables. This class requires the existence
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

function Dataset_Table(a_sDisplay_Name)
{
	/**
	 *	The unique application-wide name for this display (and dataset group).
	 *	@type	string
	 */
	this.m_sDisplay_Name = a_sDisplay_Name;

	/**
	 *	The on-screen name used for this display (and dataset group).
	 *	@type	string
	 */
	this.m_sDisplay_Label = '';

	/**
	 *  The unique ID of the HTML element that contains this display panel.
	 *	@type	string
	 */
	this.m_sPanel_Element = '';

	/**
	 *	The unique identifier of the HTML 'table' element.
	 *	@type	string
	 */
	this.m_sTable_ID = '';

	/**
	 *	The unique identifier of the HTML 'table' footer element.
	 *	@type	string
	 */
	this.m_sTable_Footer = '';

	/**
	 *	The unique identifier of the fully formatted empty row
	 *	used when a dataset group is found to be empty.
	 *	@type	string
	 */
	this.m_sEmpty_Row = '';

	/**
	 *	The unique identifier of the pre-formatted HTML 'table-row' element
	 *	configured in the current page for use by this dataset table. New rows
	 *	are added to the HTML 'table' by cloning this pre-formatted row.
	 *	@type	string
	 */
	this.m_sTable_Template_Row = '';

	/**
	 *	The unique identifier of the pre-formatted HTML 'group-title-row' element.
	 *  Group title rows are cloned for the HTML 'table' just like the normal rows.
	 *	@type	string
	 */
	this.m_sGroup_Title_Row = '';

	/**
	 *	The unique identifier of the HTML 'table' group-by/sort-by row order selection button.
	 *	@type	string
	 */
	this.m_sTable_Order_Button = '';

	/**
	 *	The group-by/sort-by row order selection button label text.
	 *	(NB. The array is accessed by the active ordering ID to retrieve the label
	 *	for the ordering to be activated on the next click of the selection button).
	 *	@type	array
	 */
	this.m_asOrder_Button_Labels = Array('', 'Group by experiment', 'Order by dataset name');

	/**
	 *	The unique identifier of the HTML 'table' column help button.
	 *	@type	string
	 */
	this.m_sColumn_Help_Button = '';

	/**
	 *	The name of the dataset group. So what is this ???
	 *	@type	string
	 *	DEPRECATED
	 */
//	this.m_sGroup_Name = '';

	/**
	 *	The text of the current active message.
	 *	This will be displayed instead of the dataset table
	 *	usually either while the table is being loaded from the server
	 *	or after a load failure - indicating why no table is displayed.
	 *	@type	string
	 */
	this.m_sActive_Message = '';

	/**
	 *	This flag permits a degree of laziness for data retrieval.
	 *	It indicates when data retrieval has already been attempted
	 *	ie when an empty group definition is the true end value.
	 *	@type	boolean
	 */
	this.m_bContent_Retrieved = false;

	/**
	 *	The number of datasets in the dataset group.
	 *	@type	integer
	 */
	this.m_nDataset_Count = 0;

	/**
	 *	A reference to the definition of the dataset group.
	 *	@type	array
	 */
	this.m_asGroup_Definition = Array();

	/**
	 *	A reference to the ordering option definitions for the dataset group.
	 *	@type	array
	 */
	this.m_asGroup_Ordering = Array();

	/**
	 *	A record of the display state for each dataset in the dataset group.
	 *	A numeric array of flag fields with the same order as the original dataset
	 *	group (indexing from a base of 1).
	 *	The first entry (index zero) holds state information for the table as a whole.
	 *	@type	array
	 */
	this.m_afDataset_Display_State = Array();
	this.reset_display_status(this.m_nDataset_Count);
}


/**
 *	Set the name used on-screen to identify this display (and dataset group).
 *
 *	@param	{string} a_sDisplay_Label The on-screen name for this display.
 *
 *	@return	none
 *	@type	void
 */

Dataset_Table.prototype.set_label_name = function(a_sDisplay_Label)
{
	this.m_sDisplay_Label = a_sDisplay_Label;
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

Dataset_Table.prototype.set_element_names = function(a_sPanel_Element, a_asElement_List)
{
	if (!document.getElementById(a_sPanel_Element)) {
		alert("Display '" + this.m_sDisplay_Name + "' panel element '" + a_sPanel_Element + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 7;

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
	this.m_sTable_ID = a_asElement_List[0];
	this.m_sTable_Footer = a_asElement_List[1];
	this.m_sEmpty_Row = a_asElement_List[2];
	this.m_sTable_Template_Row = a_asElement_List[3];
	this.m_sGroup_Title_Row = a_asElement_List[4];
	this.m_sTable_Order_Button = a_asElement_List[5];
	this.m_sColumn_Help_Button = a_asElement_List[6];

	// Make sure the event handler for the group-by/sort-by row order button is set up.
	var eTable_Order_Button = document.getElementById(this.m_sTable_Order_Button);
	if (!eTable_Order_Button) {
		alert("Table order button '" + this.m_sTable_Order_Button + "' no longer exists.");
		return;
	}
	// Under DOM2 can have multiple event handlers registered.
	remove_event(eTable_Order_Button, 'click', dataset_row_ordering_click, false);
	add_event(eTable_Order_Button, 'click', dataset_row_ordering_click, false);

	// Make sure the event handler for the column help button is set up.
	var eColumn_Help_Button = document.getElementById(this.m_sColumn_Help_Button);
	if (!eColumn_Help_Button) {
		alert("Column help button '" + this.m_sColumn_Help_Button + "' no longer exists.");
		return;
	}
	// Under DOM2 can have multiple event handlers registered.
	remove_event(eColumn_Help_Button, 'click', dataset_column_help_click, false);
	add_event(eColumn_Help_Button, 'click', dataset_column_help_click, false);

	return (true);
}


/**
 *  Set the dataset group, replacing any existing displayed group.
 *	This does not cause the immediate automatic display of the new group.
 *
 *	@param	{string} a_sGroup_Name The name of the new dataset group.
 *	@param	{array} a_asGroup_Definition The dataset group definition.
 *	@param	{array} a_asGroup_Ordering The display ordering option definitions.
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Dataset_Table.prototype.set_dataset_group = function(a_asGroup_Definition, a_asGroup_Ordering)
{
	if ((a_asGroup_Definition.length % DATASET_GROUP_UNIT_LENGTH) != 0) {
		alert('dataset group list error');
		return (false);
	}

 	if ((a_asGroup_Ordering.length % DATASET_GROUP_UNIT_LENGTH) != 0) {
		alert('dataset ordering list error');
		return (false);
	}

	this.m_nDataset_Count = a_asGroup_Definition.length / DATASET_GROUP_UNIT_LENGTH;
	this.m_asGroup_Definition = a_asGroup_Definition;
	this.m_asGroup_Ordering = a_asGroup_Ordering;

	if (!this.transform_ordering_definition()) {
		this.m_nDataset_Count = 0;
		this.m_asGroup_Definition = Array();
		this.m_asGroup_Ordering = Array();
		alert('Ordering definition error.');
		return (false);
	}

	// Finally, reset the display state for the new dataset group.
	this.reset_display_status(this.m_nDataset_Count);
	this.set_active_ordering(DATASET_DEFAULT_ORDERING);
	this.m_bContent_Retrieved = true;

	// If this was done while displaying as the active panel then request a refresh.
	var Active_Display_Name = '';
	var rPanel_Controller = locate_registered_object('main_controller');
	if (!is_null(rPanel_Controller)) {
		Active_Display_Name = rPanel_Controller.get_active_display_name();
		if ((is_string(Active_Display_Name))
			&& (Active_Display_Name.length > 0)
			&& (Active_Display_Name == this.m_sDisplay_Name)) {
			rPanel_Controller.refresh_display(this.m_sDisplay_Name);
		}
	}

	return (true);
}


/**
 *	Select a new row ordering. Invoked by the event handler for the row order selection button.
 *  (NB Only handles 2 ordering options, plus no event expected when only one ordering exists).
 *
 *	@param	{integer} a_nSelected_Ordering The selected numeric ordering id (1..3).
 *	@param	{boolean} a_bOrdering_State Is the selected ordering being turned on (true) or off (false).
 *
 *	@return	none
 *	@type	void
 */
/*
Dataset_Table.prototype.set_row_ordering = function(a_nSelected_Ordering, a_bOrdering_State)
{
	var nNew_Ordering = 0;

	if (a_nSelected_Ordering == 1) {
		nNew_Ordering = ((a_bOrdering_State == true) ? 1 : 2);
	}
	else {
		nNew_Ordering = ((a_bOrdering_State == true) ? 2 : 1);
	}

	this.set_active_ordering(nNew_Ordering);
	this.show_display();
}
*/

/**
 *	Select a new row ordering. Invoked by the event handler for the row order selection button.
 *  (NB Only handles 2 ordering options, plus no event expected when only one ordering exists).
 *
 *	@return	none
 *	@type	void
 */

Dataset_Table.prototype.toggle_row_ordering = function()
{
	var nNew_Ordering = 0;
	var nActive_Ordering = this.get_active_ordering();

	nNew_Ordering = ((nActive_Ordering == 1) ? 2 : 1);

	this.set_active_ordering(nNew_Ordering);
	this.show_display();
}


/**
 *	Set column help on/off. Invoked by the event handler for the column help button.
 *
 *	Should this function just change the table status and then call show_display()
 *	which would check/set the column_help_row style before re-displaying the table.
 *	This would only handle cases where the column help status has been changed with
 *	another table when the whole re-display is driven from the status which is updated
 *	by the dataset mapper prior to the reselection of the dataset display. At this stage
 *	both the datafield and the dataset display/re-display startups will be alike and the
 *	panel controller function select_new_display() will first call any auxiliary/support
 *	objects (eg mappers) and then the display object - for all display switching.
 *
 *	@param	{boolean} a_bNew_Display_State True to display the help, false to hide it.
 *
 *	@return	none
 *	@type	void
 */

Dataset_Table.prototype.set_column_help = function(a_bNew_Display_State)
{
	//alert(this.print_state());
	var sNew_Help_Row_Class = '';

	var eDataset_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDataset_Listing_Table) {
		alert("Dataset listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDataset_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;

	if (a_bNew_Display_State == true) {
		sNew_Help_Row_Class = '';
		this.m_afDataset_Display_State[0] |= fShowhelpd_Flag;
	}
	else {
		sNew_Help_Row_Class = 'hidden_column_help_row';
		this.m_afDataset_Display_State[0] &= fUnshowhelpd_Mask;
	}

	for (var nx=0; nx<nRow_Count; nx++) {
		if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
			&& (aeRow_Collection[nx].getAttribute('name') == 'column_help_row')) {
			aeRow_Collection[nx].className = sNew_Help_Row_Class;
		}
	}

	// Needed by IE for the first time the column help is shown.
	this.show_display();
}


/**
 *	Hide the display.
 *
 *	@return	none
 *	@type	void
 */

Dataset_Table.prototype.hide_display = function()
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
 *	Show the display, re-displaying the dataset group listing.
 *
 *	@return	none
 *	@type	void
 */

Dataset_Table.prototype.show_display = function()
{
	var eDisplay_Element = document.getElementById(this.m_sPanel_Element);
	if (!eDisplay_Element) {
		alert("Display panel element '" + this.m_sPanel_Element + "' no longer exists.");
		return;
	}

	this.remove_dataset_rows();

	var nActive_Ordering = this.get_active_ordering();
	this.set_ordering_element(nActive_Ordering);

	// Only display the template after the old table rows have been removed.
	eDisplay_Element.className = '';

    if (this.m_nDataset_Count == 0) {
		this.display_empty_table();
	}
	else {
		this.add_dataset_rows();
	}
}


/**
 *  Resynchronise the dataset group status record with the global (for all
 *	dataset groups) 'Dataset Column Help' status and the panel tab list.
 *
 *	Using a scan and check approach protects the local status record from
 *	being corrupted when it is out of sync with the application environment
 *	ie the display content is about to be updated by the following show().
 *
 *	@param	{boolean} a_bColumn_Help_Active True if column help is active
 *					(and therefore active for all dataset group displays),
 *					otherwise false.
 *	@param	{array} a_asTab_Labels A list of the current panel tab labels
 *					as an associative array indexed by tab label with all
 *					array elements for the active labels set to 'true'.
 *
 *  @return	none
 *  @type	void
 */

Dataset_Table.prototype.resynchronise_dataset_group = function(a_bColumn_Help_Active, a_asTab_Labels)
{
	if (a_bColumn_Help_Active == true) {
		this.m_afDataset_Display_State[0] |= fShowhelpd_Flag;
	}
	else {
		this.m_afDataset_Display_State[0] &= fUnshowhelpd_Mask;
	}

	var sDataset_Id = '';
	var nStatus_Index = 1;
	var nGroup_Definition_Length = this.m_asGroup_Definition.length;
	for (var nx=0; nx<nGroup_Definition_Length; nx += DATASET_GROUP_UNIT_LENGTH) {
		sDataset_Id = this.m_asGroup_Definition[nx + DG_NAME];
		if (a_asTab_Labels[sDataset_Id] == true) {
			this.m_afDataset_Display_State[nStatus_Index] |= fSelect_Flag;
		}
		else {
			this.m_afDataset_Display_State[nStatus_Index] &= fUnselect_Mask;
		}
		nStatus_Index++;
	}
}


/**
 *  Return both the application and the display identifiers for a selected dataset.
 *
 *	@param	{element} a_eActive_Element The activated element within the dataset row
 *	@param	{array} a_asDetails_List An empty array to receive the identifiers
 *
 *  @return	True if all identifiers located successfully, otherwise false.
 *  @type	boolean
 */

Dataset_Table.prototype.get_dataset_details = function(a_eActive_Element, a_asIdentifier_List)
{
	var sRow_Label = '';

	if (a_asIdentifier_List.length != 2) {
		alert('get_dataset_details() was given an invalid list.');
		return (false);
	}

	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return (false);
	}

	var nStatus_Index = eActivated_Row.name;
	if (a_eActive_Element.checked == true) {
		this.m_afDataset_Display_State[nStatus_Index] |= fSelect_Flag;
	}
	else {
		this.m_afDataset_Display_State[nStatus_Index] &= fUnselect_Mask;
	}

	var nField_Definition_Offset = (nStatus_Index - 1) * DATASET_GROUP_UNIT_LENGTH;
	a_asIdentifier_List[0] = this.m_asGroup_Definition[nField_Definition_Offset + DG_NAME];
	a_asIdentifier_List[1] = this.m_asGroup_Definition[nField_Definition_Offset + DG_LABEL];

	return (true);
}


/**
 *  Return both the application and the display identifiers for an activated row.
 *
 *	@param	{element} a_eActive_Element The activated element within the target row
 *	@param	{array} a_asDetails_List An empty array to receive the row details
 *
 *  @return	True if all identifiers located successfully, otherwise false.
 *  @type	boolean
 */

Dataset_Table.prototype.get_activated_row_details = function(a_eActive_Element, a_asDetails_List)
{
	var sRow_Label = '';

	if (a_asDetails_List.length != 0) {
		alert('get_activated_row_details() was given a non-empty list.');
		return (false);
	}

	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return (false);
	}

	var nStatus_Index = eActivated_Row.name;
	if (a_eActive_Element.checked == true) {
		this.m_afDataset_Display_State[nStatus_Index] |= fSelect_Flag;
	}
	else {
		this.m_afDataset_Display_State[nStatus_Index] &= fUnselect_Mask;
	}

	var nField_Definition_Offset = (nStatus_Index - 1) * DATASET_GROUP_UNIT_LENGTH;
	a_asDetails_List[0] = a_eActive_Element.checked;
	a_asDetails_List[1] = this.m_asGroup_Definition[nField_Definition_Offset + DG_NAME];
	a_asDetails_List[2] = this.m_asGroup_Definition[nField_Definition_Offset + DG_LABEL];

	a_sActivated_Identifier = this.m_asGroup_Definition[nField_Definition_Offset + DG_NAME];

	return (true);
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Dataset_Table.prototype.print_state = function()
{
	var sDataset_Status_List = '';
	var nGroup_Definition_Index = 0;

	for (var nx=1; nx<=this.m_nDataset_Count; nx++) {
		sDataset_Status_List += '\n' + this.m_asGroup_Definition[nGroup_Definition_Index + DG_NAME]
                                + ' = ' + this.m_afDataset_Display_State[nx];
		nGroup_Definition_Index += DATASET_GROUP_UNIT_LENGTH;
	}

	return ('[Dataset_Table]'
			+ '\nDisplay name/group = ' + this.m_sDisplay_Name
			+ '\nDisplay label = ' + this.m_sDisplay_Label
//			+ '\nDataset group = ' + this.m_sGroup_Name
            + '\nDataset count = ' + this.m_nDataset_Count
            + '\nTable status = ' + this.m_afDataset_Display_State[0]
			+ '\n' + sDataset_Status_List);
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


/**
 *  Delete the currently displayed entries from the dataset listing table.
 *	Makes no difference what the ordering is or whether groups have titles.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Dataset_Table.prototype.remove_dataset_rows = function()
{
	var eDataset_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDataset_Listing_Table) {
		alert("Dataset listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDataset_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;

	// Delete both dataset rows and title rows.
	if (nRow_Count > 2) {
		for (var nx=(nRow_Count - 2); nx>0; nx--) {
			if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
				&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
				&& (aeRow_Collection[nx].getAttribute('name') != 'header')
				&& (aeRow_Collection[nx].getAttribute('name') != 'footer')) {
				aeRow_Collection[nx].parentNode.removeChild(aeRow_Collection[nx]);
			}
		}
	}
}


/**
 *  Set up the dataset listing table for an empty dataset group.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Dataset_Table.prototype.display_empty_table = function()
{
	var eEmpty_Row = document.getElementById(this.m_sEmpty_Row);
	if (!eEmpty_Row) {
		alert("Pre-formatted empty row '" + this.m_sEmpty_Row
			  + "' for dataset listing table '" + this.m_sTable_ID + "'  no longer exists.");
		return;
	}

	var eTable_Base = document.getElementById(this.m_sTable_Footer);
	if (!eTable_Base) {
		alert("The base row (footer) for dataset listing table '" + this.m_sTable_ID
																+ "' no longer exists.");
		return;
	}

	var eNew_Row = eEmpty_Row.cloneNode(true);
	if (!eNew_Row) {
		alert('Failed to clone an empty dataset listing row.');
		return;
	}

	eNew_Row.removeAttribute('id');
	eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);
}


/**
 *  Add the dataset group to the dataset listing table using the currently selected layout.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Dataset_Table.prototype.add_dataset_rows = function()
{
	var nx = 0;
	var nn = 0;

	var eRow_Template = document.getElementById(this.m_sTable_Template_Row);
	if (!eRow_Template) {
		alert("Pre-formatted row '" + this.m_sTable_Template_Row
			+ "' for dataset listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var eGroup_Title_Template = document.getElementById(this.m_sGroup_Title_Row);
	if (!eGroup_Title_Template) {
		alert("Pre-formatted group title row '" + this.m_sGroup_Title_Row
			+ "' for dataset listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var eTable_Base = document.getElementById(this.m_sTable_Footer);
	if (!eTable_Base) {
		alert("The base row (footer) for dataset listing table '" + this.m_sTable_ID
																+ "' no longer exists.");
		return;
	}

	// -------------------------------------------------------------------------------------
	// Now to work via the active ordering, accessing field details via the field definition
	// and status record (note the status record took its order from the field definition). 
	// -------------------------------------------------------------------------------------

	var nEntry_Index = this.locate_active_ordering();
	var nDisplay_Type = this.m_asGroup_Ordering[nEntry_Index + DO_CODE];
	var nGroup_Count = this.m_asGroup_Ordering[nEntry_Index + DO_COUNT];

	var eNew_Row = null;
	var aeNew_Cells = Array();
	var aeCell_Nodes = Array();
	var nCell_Node_Count = 0;
	var aeLink_Nodes = Array();
	var nLink_Node_Count = 0;

	var nCurrent_Group = 1;
	var nGroup_Member_Count = 0;
	var nGroup_Member_Index = 0;
	var Group_Member_Definition_Index = 0;
	nEntry_Index += DATASET_GROUP_UNIT_LENGTH;	// skip the active ordering's header entry

	var nGroups_Displayed_Counter = 0;	// controls row shading

	// Loop from here to process each ordering group-entry within the active ordering.
	while (nCurrent_Group <= nGroup_Count) {
		// Check we have the correct group and it has a valid list.
		if ((this.m_asGroup_Ordering[nEntry_Index + DO_GNO] != nCurrent_Group)
			|| !is_array(this.m_asGroup_Ordering[nEntry_Index + DO_LIST])
			|| (this.m_asGroup_Ordering[nEntry_Index + DO_LIST].length < 1)) {
			alert('Ordering definition corrupted.');
			return;
		}

		nGroups_Displayed_Counter++;	// alternate group row shading

		// This block adds a group title row (when specified).
		if (nDisplay_Type != DD_CODE_PLAIN) {
			eNew_Row = eGroup_Title_Template.cloneNode(true);
			if (!eNew_Row) {
				alert('Failed to clone a new group title row.');
				return;
			}

			// The name of the group title row is set to the number of the current group.
			// This ...
			eNew_Row.removeAttribute('id');
			eNew_Row.name = nCurrent_Group;

			// Handle alternating plain & shading of successive groups.
			if ((nGroups_Displayed_Counter & 1) == 0) {
				add_class(eNew_Row, 'shaded');
			}

			// Add title to the second cell. The first is left empty to offset the title.
			aeNew_Cells = eNew_Row.getElementsByTagName('td');
			aeCell_Nodes = aeNew_Cells[1].childNodes;
			nCell_Node_Count = aeCell_Nodes.length;
			// Find the hyperlink that wraps the contents of the title row.
			for (nx=0; nx<nCell_Node_Count; nx++) {
				if ((aeCell_Nodes[nx].nodeType == 1)
					&& (aeCell_Nodes[nx].nodeName.toLowerCase() == 'a')) {
					aeCell_Nodes[nx].setAttribute('href', ERA_HOMEPAGE_URL + ERA_METADATA_URL+ this.m_asGroup_Ordering[nEntry_Index + DO_LINK]);
					aeLink_Nodes = aeCell_Nodes[nx].childNodes;
					nLink_Node_Count = aeLink_Nodes.length;
					
					// Find and replace the first text field within the hyperlink.
					for (nn=0; nn<nLink_Node_Count; nn++) {
						if (aeLink_Nodes[nn].nodeType == 3) {
                            aeLink_Nodes[nn].nodeValue = this.m_asGroup_Ordering[nEntry_Index + DO_TITLE];
							break;
						}
					}
				}
			}

			eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);
		}

		nGroup_Member_Count = this.m_asGroup_Ordering[nEntry_Index + DO_LIST].length;

		// Loop from here to process each member within the ordering-group.
		for (nx=0; nx<nGroup_Member_Count; nx++) {
			// Note the ordering-group member index can be used to access the display status record directly as
			// both take their order from the Dataset-Group definition and both indexes start from 1 not zero.
			// However the index on the Dataset-Group definition itself must be computed.
			nGroup_Member_Index = this.m_asGroup_Ordering[nEntry_Index + DO_LIST][nx];
			if ((nGroup_Member_Index < 1)
				|| (nGroup_Member_Index > this.m_nDataset_Count)) {
				alert('Ordering definition corrupted.');
				return;
			}
			Group_Member_Definition_Index = (nGroup_Member_Index - 1) * DATASET_GROUP_UNIT_LENGTH;

			eNew_Row = eRow_Template.cloneNode(true);
			if (!eNew_Row) {
				alert('Failed to clone a new dataset listing row.');
				return;
			}

			// The name of each row is set to the index on the display status record for the contained dataset.
			// This ...
			eNew_Row.removeAttribute('id');
			eNew_Row.name = nGroup_Member_Index;

			// Handle alternating plain & shading of successive groups.
			if ((nDisplay_Type != DD_CODE_PLAIN)
				&& ((nGroups_Displayed_Counter & 1) == 0)) {
				add_class(eNew_Row, 'shaded');
			}

			// Currently the dataset definition action codes are only used to disable selection.
			aeNew_Cells = eNew_Row.getElementsByTagName('td');
			if (this.m_asGroup_Definition[Group_Member_Definition_Index + DG_CODE] != 0) {
				aeNew_Cells[0].firstChild.disabled = true;
			}
			else {
				add_event(aeNew_Cells[0].firstChild, 'click', check_click, false);
			}
			aeNew_Cells[0].firstChild.name = (this.m_asGroup_Definition[Group_Member_Definition_Index + DG_NAME]);
			aeNew_Cells[1].firstChild.nodeValue = this.m_asGroup_Definition[Group_Member_Definition_Index + DG_LABEL];
			aeNew_Cells[3].firstChild.nodeValue = this.m_asGroup_Definition[Group_Member_Definition_Index + DG_DESC];

			eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);

			// Restore the checkbox settings after row insertion because IE won't action it before row insertion.
			// (Remember the listed group-member-index is still the index required for the row's display status).
			if ((this.m_afDataset_Display_State[nGroup_Member_Index] & fSelect_Flag) != 0) {
				aeNew_Cells = eNew_Row.getElementsByTagName('td');
				aeNew_Cells[0].firstChild.checked = true;
			}
		}

		// Skip to the next group/entry.
		nCurrent_Group++;
		nEntry_Index += DATASET_GROUP_UNIT_LENGTH;
	}
}


/**
 *	Convert the ordering definition from its downloaded response-oriented format
 *	to an internal format more readily processed when generating a new display.
 *
 *	@private
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Dataset_Table.prototype.transform_ordering_definition = function()
{
	var nx = 0;
	var nList_Count = 0;
	var nGroup_Count = 0;
	var nCurrent_Group = 0;
	var nOrdering_Definition_Length = this.m_asGroup_Ordering.length;
	var nEntry_Index = 0;

	// Loop from here to process each ordering.
	while (nEntry_Index < nOrdering_Definition_Length) {
		// Check we have a valid ordering start-of-header and a valid group count.
		if ((this.m_asGroup_Ordering[nEntry_Index + DO_SOH] != 0)
			|| (this.m_asGroup_Ordering[nEntry_Index + DO_COUNT] < 1)) {
			alert('Ordering definition error.');
			return (false);
		}

		nGroup_Count = this.m_asGroup_Ordering[nEntry_Index + DO_COUNT];
		nCurrent_Group = 1;		// The numeric id for the first group.

		// Loop from here to process each group within the ordering.
		// (NB the groups must be ordered by their numeric id).
		while (nCurrent_Group <= nGroup_Count) {
			nEntry_Index += DATASET_GROUP_UNIT_LENGTH;
			// Check the entry index is still in-range and that we have the correct group id.
			if ((nEntry_Index >= nOrdering_Definition_Length)
				|| (nCurrent_Group != this.m_asGroup_Ordering[nEntry_Index + DO_GNO])) {
				return (false);
			}
			this.m_asGroup_Ordering[nEntry_Index + DO_LIST]
								= this.m_asGroup_Ordering[nEntry_Index + DO_LIST].split('#-#');
			// Confirm the list of indexes was converted OK.
			if (!is_array(this.m_asGroup_Ordering[nEntry_Index + DO_LIST])
				|| (this.m_asGroup_Ordering[nEntry_Index + DO_LIST].length == 0)) {
				return (false);
			}
			nList_Count = this.m_asGroup_Ordering[nEntry_Index + DO_LIST].length;
			// Loop from here to check each listed index [1 <= index <= #datasets].
			for (nx=0; nx<nList_Count; nx++) {
				if ((this.m_asGroup_Ordering[nEntry_Index + DO_LIST][nx] < 1)
					|| (this.m_asGroup_Ordering[nEntry_Index + DO_LIST][nx] > this.m_nDataset_Count)) {
					alert('Ordering definition error.');
					return (false);
				}
			}
			nCurrent_Group++;
		}

		nEntry_Index += DATASET_GROUP_UNIT_LENGTH;
	}

	return (true);
}


/**
 *	Return the index to the header for the active ordering definition.
 *	This function hides the way the ordering definition is scanned.
 *
 *	@private
 *
 *  @return	The index to the header of the active ordering definition (m..n), or 0 if not successful.
 *  @type	integer
 */

Dataset_Table.prototype.locate_active_ordering = function()
{
	var nActive_Id = this.get_active_ordering();	// Get the active (numeric) ordering id.
	var nOrdering_Definition_Length = this.m_asGroup_Ordering.length;

	var nx = 0;
	while (nx < nOrdering_Definition_Length) {
		// Check we have a valid group start-of-header.
		if (this.m_asGroup_Ordering[nx + DO_SOH] != 0) {
			alert('Ordering definition corrupted.');
			return (0);
		}

		// If the ordering is found then return its header index.
		if (this.m_asGroup_Ordering[nx + DO_ID] == nActive_Id) {
			return (nx);
		}

		// Skip the ordering header and all its groups.
		nx += (parseInt(this.m_asGroup_Ordering[nx + DO_COUNT], 10) + 1) * DATASET_GROUP_UNIT_LENGTH;
	}

	// Drop here if not found.
	return (0);
}


/**
 *	Get the active ordering ID. Hides and localises any shift
 *	operations needed to retrieve the value in the bit field.
 *
 *	@private
 *
 *  @return	The active numeric ordering id (1..3).
 *  @type	integer
 */

Dataset_Table.prototype.get_active_ordering = function()
{
	// Currently no shifting is required.
	return (this.m_afDataset_Display_State[0] & fActive_Orderingd_Bits);
}


/**
 *	Set the active ordering ID. Hides and localises any
 *	shift operations needed to correctly set the bit field.
 *	Also sets the in-page selection element (necessary after
 *	initial creation and also when re-invoked/re-displayed).
 *
 *	@private
 *	@param	{integer} a_nOrdering_Id The new active numeric ordering id (1..3).
 *
 *  @return	none
 *  @type	void
 */

Dataset_Table.prototype.set_active_ordering = function(a_nOrdering_Id)
{
	this.set_ordering_element(a_nOrdering_Id);

	// Currently no shifting is required.
	var nOrdering_Bits = a_nOrdering_Id & fActive_Orderingd_Bits;
	this.m_afDataset_Display_State[0] &= fReset_Orderingd_Mask;
	this.m_afDataset_Display_State[0] |= nOrdering_Bits;
}


/**
 *	Set the in-page ordering selection element state/message-text
 *	(needed on initial creation and when re-invoked/re-displayed).
 *
 *	@private
 *	@param	{integer} a_nOrdering_Id The active numeric ordering id (1..3).
 *
 *  @return	none
 *  @type	void
 */

Dataset_Table.prototype.set_ordering_element = function(a_nOrdering_Id)
{
	var eTable_Order_Button = document.getElementById(this.m_sTable_Order_Button);
	if (!eTable_Order_Button) {
		alert("Table order button '" + this.m_sTable_Order_Button + "' no longer exists.");
		return;
	}

	eTable_Order_Button.value = this.m_asOrder_Button_Labels[a_nOrdering_Id];
}


/* -+- */


