/**
 *  @fileoverview The class Datafield_Table is the display handler for all dataset field listing tables.
 *
 *	@version 0.1.24  [24.1.2007]
 *	@version 0.1.25  [29.1.2007]
 *	@version 0.1.28  [2.5.2007]
 *	@version 0.1.29  [31.7.2007]
 *	@version 0.1.30  [28.9.2007]
 *	@version 0.2.1  [9.11.2007]		// No longer initiates the download request
 */


//--------------------------------------------------------------------------------------------------
//
// Local constants.

// Initial value for the ordering id.
var DATAFIELD_DEFAULT_ORDERING = 2;

//--------------------------------------------------------------------------------------------------
//
// Status flags and masks.

// Table: Records the active group ordering option (1-3, 1 being the default/initial option).
// Set:   --
var fActive_Orderingf_Bits = 3;
var fReset_Orderingf_Mask = (-1) ^ fActive_Orderingf_Bits;

// Table: All rows have been created (whether visible or not).
// Field: The primary row is displayed (not hidden as after a 'hide unchecked fields' operation).
//			NB: could have been unchecked after the 'hide' operation.
var fDisplay_Flag = 4;
var fUndisplay_Mask = (-1) ^ fDisplay_Flag;

// Table: All extended rows have been created (whether visible or not).
// Field: The row extension is visible.
var fExtended_Flag = 8;
var fUnextended_Mask = (-1) ^ fExtended_Flag;

// Table: --
// Field: The checkbox selecting the field for extraction or preview is ticked.
var fExtract_Flag = 16;
var fUnextract_Mask = (-1) ^ fExtract_Flag;

// Table: --
// Field: The checkbox selecting the field as a search filter is ticked.
var fFilter_Flag = 32;
var fUnfilter_Mask = (-1) ^ fFilter_Flag;

// Table: Expand all extensions (0 = collapse all extensions).
//			Co-ordinates the state of the 'expand/collapse' graphic/button.
// Field: --
var fExpand_Flag = 64;
var fUnexpand_Mask = (-1) ^ fExpand_Flag;

// Table: Show all column help rows (0 = collapse all column help rows).
//			Co-ordinates the state of the 'show/hide' column help button.
// Set:   --
var fShowhelpf_Flag = 128;
var fUnshowhelpf_Mask = (-1) ^ fShowhelpf_Flag;

//--------------------------------------------------------------------------------------------------


/**
 *	Constructor for the Datafield_Table class.
 *	@class	The class Datafield_Table provides support for the display/re-display
 *	operations for all dataset field listing tables. This class requires the
 *	existence of appropriate event handlers in a lower-level service layer. These
 *	event handlers must identify and activate appropriate object methods in response
 *	to user activity. They are:
 *
 *	(Note: the identity of the display section this class supports is pre-defined
 *	within the parent/containing controller display class).
 *
 *	@constructor
 *	@param	{string} a_sSection_Name The controller's preset name for this display section.
 *	@param	{object} a_rSection_Parent A reference to the parent controlling display object.
 *
 *	@param	{string} a_sDisplay_Name A unique application-wide name for the display.
 *
 *	@return	none
 *	@type	void
 */

function Datafield_Table(a_sSection_Name, a_rSection_Parent)
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
	 *	The unique identifier of the table header cell containing
	 *	the row toggle control (button or image).
	 *	@type	string
	 */
	this.m_sHeader_Toggle_Cell = '';

	/**
	 *	The unique identifier of the fully formatted empty row
	 *	used when a dataset field set is found to be empty.
	 *	@type	string
	 */
	this.m_sEmpty_Row = '';

	/**
	 *	The unique identifier of the pre-formatted HTML 'table-row' element
	 *	configured in the current page for use by this datafield table. New
	 *	rows are added to the HTML 'table' by cloning this pre-formatted row.
	 *	@type	string
	 */
	this.m_sTable_Template_Row = '';

	/**
	 *	The unique identifier of the pre-formatted HTML 'table-row' element
	 *	configured in the current page and used for creating extended rows.
	 *	Table rows are extended by cloning and inserting this pre-formatted row.
	 *	@type	string
	 */
	this.m_sTable_Template_Ext = '';

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
	this.m_asOrder_Button_Labels = Array('', 'Group by field type', 'Order by field name');

	/**
	 *	The unique identifier of the HTML 'table' column help button.
	 *	@type	string
	 */
	this.m_sColumn_Help_Button = '';

	/**
	 *	The filename of the 'expand preview' header button image.
	 *	@type	string
	 */
	this.m_sExpand_Preview_Image = '';

	/**
	 *	The filename of the 'collapse preview' header button image.
	 *	@type	string
	 */
	this.m_sCollapse_Preview_Image = '';

//	/**
//	 *	The name of the dataset used by the database server (not the unique
//	 *	application-wide name used to identify the display). This name will
//	 *	be used when generating any SQL queries for the server database.
//	 *	@type	string
//	 */
//	this.m_sDataset_Name = '';

	/**
	 *	A record of the display state for each field in the dataset field-set.
	 *	A numeric array of flag fields with the same order as the original field
	 *	set (indexing from a base of 1).
	 *	The first entry (index zero) holds state information for the table as a whole.
	 *	@type	array
	 */
	this.m_afDatafield_Display_State = Array();
	this.reset_display_status(0);
}


/**
 *	Installs the HTML elements used by this display.
 *
 *	@param	{string} a_sSection_Element The ID of the HTML element containing the display section.
 *	@param	{array} a_asElement_List List of structural/template element IDs used by the display section.
 *
 *	@return	true if successfully configured, otherwise false.
 *	@type	boolean
 */

Datafield_Table.prototype.set_element_names = function(a_sSection_Element, a_asElement_List)
{
	var nx = 0;

	if (!document.getElementById(a_sSection_Element)) {
		alert("Display '" + this.m_sDisplay_Name + "' section element '" + a_sSection_Element + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 11;

	if (!is_array(a_asElement_List)
		|| (a_asElement_List.length != nElement_List_Length)) {
		alert("Bad element list for display '" + this.m_sDisplay_Name + "'.");
		return (false);
	}

	// Note the last 2 items in the list are not page elements but image filenames.
	for (nx=0; nx<(nElement_List_Length - 2); nx++) {
		if (!document.getElementById(a_asElement_List[nx])) {
			alert("Display '" + this.m_sDisplay_Name + "' element '" + a_asElement_List[nx] + "' was not found.");
			return (false);
		}
	}

	this.m_sSection_Element = a_sSection_Element;
	this.m_sTable_ID = a_asElement_List[0];
	this.m_sTable_Footer = a_asElement_List[1];
	this.m_sHeader_Toggle_Cell = a_asElement_List[2];
	this.m_sEmpty_Row = a_asElement_List[3];
	this.m_sTable_Template_Row = a_asElement_List[4];
	this.m_sTable_Template_Ext = a_asElement_List[5];
	this.m_sGroup_Title_Row = a_asElement_List[6];
	this.m_sTable_Order_Button = a_asElement_List[7];
	this.m_sColumn_Help_Button = a_asElement_List[8];
	this.m_sExpand_Preview_Image = a_asElement_List[9];
	this.m_sCollapse_Preview_Image = a_asElement_List[10];

	// Make sure the event handler for the group-by/sort-by row order button is set up.
	var eTable_Order_Button = document.getElementById(this.m_sTable_Order_Button);
	if (!eTable_Order_Button) {
		alert("Table order button '" + this.m_sTable_Order_Button + "' no longer exists.");
		return;
	}
	// Under DOM2 can have multiple event handlers registered.
	remove_event(eTable_Order_Button, 'click', datafield_row_ordering_click, false);
	add_event(eTable_Order_Button, 'click', datafield_row_ordering_click, false);

	// Make sure the event handler for the column help button is set up.
	var eColumn_Help_Button = document.getElementById(this.m_sColumn_Help_Button);
	if (!eColumn_Help_Button) {
		alert("Column help button '" + this.m_sColumn_Help_Button + "' no longer exists.");
		return;
	}
	// Under DOM2 can have multiple event handlers registered.
	remove_event(eColumn_Help_Button, 'click', datafield_column_help_click, false);
	add_event(eColumn_Help_Button, 'click', datafield_column_help_click, false);

	// Make sure the event handler for the toggle control in the table header is set up.
	var eHeader_Toggle_Cell = document.getElementById(this.m_sHeader_Toggle_Cell);
	if (!eHeader_Toggle_Cell) {
		alert("Header toggle cell '" + this.m_sHeader_Toggle_Cell + "' no longer exists.");
		return;
	}

	// Remember there are text nodes in the cell with the toggle button/image (1 for IE, 2 for Mozilla).
	var aeCell_Contents = eHeader_Toggle_Cell.childNodes;
	var nCell_Content_Count = aeCell_Contents.length;
	if (nCell_Content_Count > 0) {
		for (nx=0; nx<nCell_Content_Count; nx++) {
			if (aeCell_Contents[nx].nodeName.toLowerCase() == 'img') {
				// Under DOM2 can have multiple event handlers registered.
				remove_event(aeCell_Contents[nx], 'click', toggle_all_click, false);
				add_event(aeCell_Contents[nx], 'click', toggle_all_click, false);
				break;
			}
		}
	}

	return (true);
}


/**
 *  Set the dataset field set, replacing any existing displayed field set.
 *	This does not cause the immediate automatic display of the new field set.
 *	NOT USED !!!
 *
 *	@param	{string} a_sDataset_Name The name of the new dataset.
 *	@param	{array} a_asField_Definition The dataset field set definition.
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */
/*
Datafield_Table.prototype.set_dataset_field_set = function(a_sDataset_Name, a_asField_Definition)
{
	if ((a_asField_Definition.length % DATAFIELD_SET_UNIT_LENGTH) != 0) {
		alert('dataset field set error');
		return (false);
	}
	var nDatafield_Count = a_asField_Definition.length / DATAFIELD_SET_UNIT_LENGTH;

	// Reset the display state for the new dataset field set.
	this.reset_display_status(nDatafield_Count);

	this.m_sDataset_Name = a_sDataset_Name;
	this.m_asField_Definition = a_asField_Definition;

	return (true);
}
*/

/**
 *	Select a new row ordering. Invoked by the event handler for the row order selection button.
 *  (NB Only handles 2 ordering options, plus no event expected when only one ordering exists).
 *
 *	@return	none
 *	@type	void
 */

Datafield_Table.prototype.toggle_row_ordering = function()
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
 *	Note this comment was written for the dataset table version of set_column_help().
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

Datafield_Table.prototype.set_column_help = function(a_bNew_Display_State)
{
	var sNew_Help_Row_Class = '';

	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafield_Listing_Table) {
		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafield_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;

	if (a_bNew_Display_State == true) {
		sNew_Help_Row_Class = '';
		this.m_afDatafield_Display_State[0] |= fShowhelpf_Flag;
	}
	else {
		sNew_Help_Row_Class = 'hidden_column_help_row';
		this.m_afDatafield_Display_State[0] &= fUnshowhelpf_Mask;
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

Datafield_Table.prototype.hide_display = function()
{
	var sDataset_Name = this.m_rParent_Controller.m_sDisplay_Name;
	//alert('Hiding \'' + sDataset_Name + '\'');

	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}

	eDisplay_Element.className = 'hidden';
}


/**
 *	Show the display, re-displaying the dataset field set listing.
 *
 *	@return	none
 *	@type	void
 */

Datafield_Table.prototype.show_display = function()
{
	var nDatafield_Count = 0;

	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}

	this.remove_datafield_rows();

	// Make sure the ordering element is in the right state for us
	// because it's shared with the other field-set listing tables.
	var nActive_Ordering = this.get_active_ordering();
	this.set_ordering_element(nActive_Ordering);

	// Only display the template after the old table rows have been removed.
	eDisplay_Element.className = '';

	nDatafield_Count = (this.m_rParent_Controller).get_dataset_field_count();
	if (nDatafield_Count == 0) {
		this.display_empty_table();
	}
	else {
		// Only on first-time display is the table-display-flag not set.
		if ((this.m_afDatafield_Display_State[0] & fDisplay_Flag) == 0) {
			// Note: We can let reset_display_status() reset the active ordering back to 1
			// even though set_ordering_element() has already/just been called (see above).
			// It's OK because the ordering should still be set at 1 from the initialising
			// call of reset_display_status(0) in the constructor.
			this.reset_display_status(nDatafield_Count);
		}
		this.add_datafield_rows();
	}
}


/**
 *  Return a list of the field names that have their extract checkbox selected.
 *
 *	@param	{array} a_asName_List An empty array to receive the list of field names
 *
 *  @return	An associative array indexed by the retrieved names with all valid element values set to 'true'.
 *  @type	array
 */

Datafield_Table.prototype.get_extract_field_names = function(a_asName_List)
{
	var asFull_Field_List = Array();

//	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
//	if (!eDatafield_Listing_Table) {
//		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
//		return;
//	}

	// Ensure any existing array entries are set to 'false'.
	for (xx in a_asName_List) {
		a_asName_List[xx] = false;
	}

	(this.m_rParent_Controller).get_full_field_list(asFull_Field_List);
	if (this.m_afDatafield_Display_State.length != (asFull_Field_List.length + 1)) {
		return;
	}

	for (var nx=0; nx<asFull_Field_List.length; nx++) {
		if ((this.m_afDatafield_Display_State[nx + 1] & fExtract_Flag) != 0) {
			a_asName_List[asFull_Field_List[nx]] = true;
		}
	}

//	var aeRow_Collection = eDatafield_Listing_Table.getElementsByTagName('tr');
//	var nRow_Count = aeRow_Collection.length;
//	var sRow_Label = '';

//	if (nRow_Count > 2) {
//		for (var nx=0; nx<nRow_Count; nx++) {
//			if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
//				&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
//				&& (aeRow_Collection[nx].getAttribute('name') != 'header')
//				&& (aeRow_Collection[nx].getAttribute('name') != 'footer')) {

//				var aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
//				if( (aeCell_Collection[1].childNodes.length > 0)
//					&& (aeCell_Collection[1].firstChild.nodeName.toLowerCase() == 'input') ) {
//					if (aeCell_Collection[1].firstChild.checked == true) {
//						sRow_Label = aeCell_Collection[1].firstChild.value;
//						a_asName_List[sRow_Label] = true;
//					}
//				}
//			}
//		}
//	}
}


/**
 *  Return a list of the field names that have their extract checkbox selected.
 *
 *	@param	{array} a_asName_List An empty array to receive the list of field names
 *
 *  @return	An associative array indexed by the retrieved names with all checked fieldname values
 *			set to their row ordinal in the field table [1..n].
 *  @type	array
 */

Datafield_Table.prototype.get_extract_field_names2 = function(a_asName_List)
{
	var asFull_Field_List = Array();

//	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
//	if (!eDatafield_Listing_Table) {
//		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
//		return;
//	}

	// Ensure any existing array entries are set to zero.
	for (xx in a_asName_List) {
		a_asName_List[xx] = 0;
	}

	(this.m_rParent_Controller).get_full_field_list(asFull_Field_List);
	if (this.m_afDatafield_Display_State.length != (asFull_Field_List.length + 1)) {
		return;
	}

	for (var nx=0; nx<asFull_Field_List.length; nx++) {
		if ((this.m_afDatafield_Display_State[nx + 1] & fExtract_Flag) != 0) {
			a_asName_List[asFull_Field_List[nx]] = nx + 1;
		}
	}
}


/**
 *  Return a list of the field names that have their filter checkbox selected.
 *
 *	@param	{array} a_asName_List An empty array to receive the list of field names
 *
 *  @return	An associative array indexed by the retrieved names with all valid element values set to 'true'.
 *  @type	array
 */

Datafield_Table.prototype.get_filter_field_names = function(a_asName_List)
{
	var asFull_Field_List = Array();

//	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
//	if (!eDatafield_Listing_Table) {
//		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
//		return;
//	}

	// Ensure any existing array entries are set to 'false'.
	for (xx in a_asName_List) {
		a_asName_List[xx] = false;
	}

	(this.m_rParent_Controller).get_full_field_list(asFull_Field_List);
	if (this.m_afDatafield_Display_State.length != (asFull_Field_List.length + 1)) {
		return;
	}

	for (var nx=0; nx<asFull_Field_List.length; nx++) {
		if ((this.m_afDatafield_Display_State[nx + 1] & fFilter_Flag) != 0) {
			a_asName_List[asFull_Field_List[nx]] = true;
		}
	}

//	var aeRow_Collection = eDatafield_Listing_Table.getElementsByTagName('tr');
//	var nRow_Count = aeRow_Collection.length;
//	var sRow_Label = '';

//	if (nRow_Count > 2) {
//		for (var nx=0; nx<nRow_Count; nx++) {
//			if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
//				&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
//				&& (aeRow_Collection[nx].getAttribute('name') != 'header')
//				&& (aeRow_Collection[nx].getAttribute('name') != 'footer')) {

//				var aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
//				if( (aeCell_Collection[1].childNodes.length > 0)
//					&& (aeCell_Collection[1].firstChild.nodeName.toLowerCase() == 'input') ) {
//					if (aeCell_Collection[1].firstChild.checked == true) {
//						sRow_Label = aeCell_Collection[1].firstChild.value;
//						a_asName_List[sRow_Label] = true;
//					}
//				}
//			}
//		}
//	}
}


/**
 *  Resynchronise the dataset checkbox settings with the panel tab list.
 *	Note it's IE that needs a separate traversal of the constructed table
 *  to restore the dataset check-box settings.
 *
 *	@param	{array} a_asTab_Labels A list of the current panel tab labels
 *					as an associative array indexed by tab label with all
 *					array elements for the active labels set to 'true'.
 *
 *  @return	none
 *  @type	void
 */
/*
Dataset_Table.prototype.restore_dataset_selection_state = function(a_asTab_Labels)
{
	var eDataset_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDataset_Listing_Table) {
		alert("Dataset listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDataset_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;
	var sRow_Label = '';

	if (nRow_Count > 2) {
		for (var nx=0; nx<nRow_Count; nx++) {
			if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
				&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
				&& (aeRow_Collection[nx].getAttribute('name') != 'header')
				&& (aeRow_Collection[nx].getAttribute('name') != 'footer')) {

				var aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
				if( (aeCell_Collection[1].childNodes.length > 0)
					&& (aeCell_Collection[1].firstChild.nodeType == 3) ) {
					sRow_Label = aeCell_Collection[1].firstChild.nodeValue.toLowerCase();
					if (a_asTab_Labels[sRow_Label] == true) {
						aeCell_Collection[0].firstChild.checked = true;
					}
				}
			}
		}
	}
}
*/

/**
 *  Return both the application and the display identifiers for an activated row.
 *
 *	@param	{element} a_eActive_Element The activated element within the target row
 *	@param	{array} a_asDetails_List An empty array to receive the row details
 *
 *  @return	True if all identifiers located successfully, otherwise false.
 *  @type	boolean
 */
/*
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

	var aeCell_Collection = eActivated_Row.getElementsByTagName('td');
	if( (aeCell_Collection.length > 1)
		&& (aeCell_Collection[1].childNodes.length > 0)
		&& (aeCell_Collection[1].firstChild.nodeType == 3) ) {
		sRow_Label = aeCell_Collection[1].firstChild.nodeValue;
	}

	a_asDetails_List[0] = a_eActive_Element.checked;
	a_asDetails_List[1] = a_eActive_Element.name;
	a_asDetails_List[2] = sRow_Label;
	return (true);
}
*/

/**
 *  Handle a field extraction selection event (click).
 *
 *	@param	{element} a_eActive_Element The activated checkbox within the target row
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.field_extraction_selection = function(a_eActive_Element)
{
	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return;
	}

	var nField_Index = eActivated_Row.name;
//	if (nField_Index ...) {
//	}

	if (a_eActive_Element.checked == true) {
		this.m_afDatafield_Display_State[nField_Index] |= fExtract_Flag;
	}
	else {
		this.m_afDatafield_Display_State[nField_Index] &= fUnextract_Mask;

		if ((this.m_afDatafield_Display_State[nField_Index] & fFilter_Flag) != 0) {
			this.m_afDatafield_Display_State[nField_Index] &= fUnfilter_Mask;

			var aeRow_Cells = eActivated_Row.getElementsByTagName('td');
			aeRow_Cells[1].firstChild.checked = false;
		}
	}
}


/**
 *  Handle a field filtering selection event (click).
 *
 *	@param	{element} a_eActive_Element The activated checkbox within the target row
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.field_filtering_selection = function(a_eActive_Element)
{
	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return;
	}

	var nField_Index = eActivated_Row.name;
//	if (nField_Index ...) {
//	}

	if (a_eActive_Element.checked != true) {
		this.m_afDatafield_Display_State[nField_Index] &= fUnfilter_Mask;
	}
	else {
		this.m_afDatafield_Display_State[nField_Index] |= fFilter_Flag;

		if ((this.m_afDatafield_Display_State[nField_Index] & fExtract_Flag) == 0) {
			this.m_afDatafield_Display_State[nField_Index] |= fExtract_Flag;

			var aeRow_Cells = eActivated_Row.getElementsByTagName('td');
			aeRow_Cells[0].firstChild.checked = true;
		}
	}
}


/**
 *  Handle a table header toggle event (click).
 *
 *	@param	{element} a_eActive_Element The activated control within the table header.
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.header_toggle = function(a_eActive_Element)
{
	var nImage_Path_Index = 0;

	if ((this.m_afDatafield_Display_State[0] & fExpand_Flag) != 0) {
		nImage_Path_Index = a_eActive_Element.src.indexOf(this.m_sExpand_Preview_Image);
		if (nImage_Path_Index != -1) {
			a_eActive_Element.src = a_eActive_Element.src.substr(0, nImage_Path_Index)
										+ this.m_sCollapse_Preview_Image;
		}
		a_eActive_Element.title = "Click to hide ranges for all fields";
		this.m_afDatafield_Display_State[0] &= fUnexpand_Mask;
		this.extend_all_rows();
	}
	else {
		nImage_Path_Index = a_eActive_Element.src.indexOf(this.m_sCollapse_Preview_Image);
		if (nImage_Path_Index != -1) {
			a_eActive_Element.src = a_eActive_Element.src.substr(0, nImage_Path_Index)
										+ this.m_sExpand_Preview_Image;
		}
		a_eActive_Element.title = "Click to display ranges for all fields";
		this.m_afDatafield_Display_State[0] |= fExpand_Flag;
		this.collapse_all_rows();
	}
}


/**
 *  Handle a field row toggle event (click).
 *
 *	@param	{element} a_eActive_Element The activated control within the target row.
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.row_toggle = function(a_eActive_Element)
{
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

Datafield_Table.prototype.get_activated_row_details = function(a_eActive_Element, a_asDetails_List)
{
	var nRow_Number = 0;
	var sField_Name = '';

	if (a_asDetails_List.length != 0) {
		alert('get_activated_row_details() was given a non-empty list.');
		return (false);
	}

	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return (false);
	}

	var aeCell_Collection = eActivated_Row.getElementsByTagName('td');
	if( (aeCell_Collection.length > 2)
		&& (aeCell_Collection[2].childNodes.length > 0)
		&& (aeCell_Collection[2].firstChild.nodeType == 3) ) {
		sField_Name = aeCell_Collection[2].firstChild.nodeValue;
	}

	a_asDetails_List[0] = a_eActive_Element.checked;
	a_asDetails_List[1] = sField_Name;
	a_asDetails_List[2] = eActivated_Row.name;
	a_asDetails_List[3] = a_eActive_Element.value;
	return (true);
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Datafield_Table.prototype.print_state = function()
{
	return ('[Datafield_Table]'
			+ '\nDisplay name = ' + this.m_sDisplay_Name
			+ '\nTable ID = ' + this.m_sTable_ID
			+ '\nEmpty row ID = ' + this.m_sEmpty_Row
			+ '\nRow template ID = ' + this.m_sTable_Template_Row
			+ '\nExtension row template ID = ' + this.m_sTable_Template_Ext
			+ '\nDataset name = ' + this.m_sDataset_Name);
}


/**
 *  Create and initialise a new display status descriptor.
 *
 *	@private
 *	@param	{integer} a_nRow_Count The number of rows (dataset fields) in the display table.
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.reset_display_status = function(a_nRow_Count)
{
	// Note the first element is reserved for the table itself.
	var nElement_Count = a_nRow_Count + 1;
	this.m_afDatafield_Display_State = Array(nElement_Count);

	// First reset the state for the table as a whole.
	this.m_afDatafield_Display_State[0] = 0;
	this.set_active_ordering(DATAFIELD_DEFAULT_ORDERING);

	// Reset the state for each field row (NB title rows are not included).
	if (a_nRow_Count > 0) {
		for (var nx=1; nx<nElement_Count; nx++) {
			this.m_afDatafield_Display_State[nx] = 0;
		}
	}
}


/**
 *  Delete the currently displayed entries from the datafield listing table.
 *	Makes no difference what the ordering is or whether groups have titles.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.remove_datafield_rows = function()
{
	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafield_Listing_Table) {
		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafield_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;

	// Delete both field rows and title rows.
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
 *  Set up the datafield listing table for an empty dataset field set.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.display_empty_table = function()
{
	var eEmpty_Row = document.getElementById(this.m_sEmpty_Row);
	if (!eEmpty_Row) {
		alert("Pre-formatted empty row '" + this.m_sEmpty_Row
			  + "' for datafield listing table '" + this.m_sTable_ID + "'  no longer exists.");
		return;
	}

	var eTable_Base = document.getElementById(this.m_sTable_Footer);
	if (!eTable_Base) {
		alert("The base row (footer) for datafield listing table '" + this.m_sTable_ID
																+ "' no longer exists.");
		return;
	}

	var eNew_Row = eEmpty_Row.cloneNode(true);
	if (!eNew_Row) {
		alert('Failed to clone an empty datafield listing row.');
		return;
	}

	eNew_Row.removeAttribute('id');
	eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);
}


/**
 *  Add the dataset field-set to the datafield listing table using the currently selected layout.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.add_datafield_rows = function()
{
	var nx = 0;
	var nn = 0;
	var asError_Message = Array(1);
	asError_Message[0] = '';

	var bFirst_Time = false;
	var nDatafield_Count = (this.m_rParent_Controller).get_dataset_field_count();
	var asField_Definition = (this.m_rParent_Controller).get_dataset_fieldset_definition(asError_Message);

	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafield_Listing_Table) {
		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var eRow_Template = document.getElementById(this.m_sTable_Template_Row);
	if (!eRow_Template) {
		alert("Pre-formatted row '" + this.m_sTable_Template_Row
			+ "' for datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var eGroup_Title_Template = document.getElementById(this.m_sGroup_Title_Row);
	if (!eGroup_Title_Template) {
		alert("Pre-formatted group title row '" + this.m_sGroup_Title_Row
			+ "' for datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var eTable_Base = document.getElementById(this.m_sTable_Footer);
	if (!eTable_Base) {
		alert("The base row (footer) for datafield listing table '" + this.m_sTable_ID
																+ "' no longer exists.");
		return;
	}

	// Only on first-time display is the table-display-flag not set.
	if ((this.m_afDatafield_Display_State[0] & fDisplay_Flag) == 0) {
		this.m_afDatafield_Display_State[0] |= fDisplay_Flag;
		bFirst_Time = true;
	}
	else {
		// Remove the 'all extended rows have been created' status when re-displaying the table
		// because all rows were destroyed at the start of show_display() before rebuilding the table.
		this.m_afDatafield_Display_State[0] &= fUnextended_Mask;
	}

	// -------------------------------------------------------------------------------------
	// Now to work via the active ordering, accessing field details via the field definition
	// and status record (note the status record took its order from the field definition). 
	// -------------------------------------------------------------------------------------

	var nEntry_Index = this.locate_active_ordering();
	var nDisplay_Type = (this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + DO_CODE];
	var nGroup_Count = (this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + DO_COUNT];

	var eNew_Row = null;
	var aeNew_Cells = Array();

	var nCurrent_Group = 1;
	var nGroup_Member_Count = 0;
	var nGroup_Member_Index = 0;
	var Group_Member_Definition_Index = 0;
	nEntry_Index += DATAFIELD_SET_UNIT_LENGTH;				// skip the active ordering's header entry

	var nGroups_Displayed_Counter = 0;						// controls row shading
	var fSelection_Mask = fExtract_Flag | fFilter_Flag;		// identifies rows that need check-boxes set

	// Loop from here to process each ordering group-entry within the active ordering.
	while (nCurrent_Group <= nGroup_Count) {
		// Check we have the correct group and it has a valid list.
		if (((this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + FO_GNO] != nCurrent_Group)
			|| !is_array((this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + FO_LIST])
			|| ((this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + FO_LIST].length < 1)) {
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

			// Add title to the third cell. The first two are left empty to offset the title.
			aeNew_Cells = eNew_Row.getElementsByTagName('td');
			// Replace the clones text node contents with the group title.
			if( (aeNew_Cells[2].childNodes.length > 0)
				&& (aeNew_Cells[2].firstChild.nodeType == 3)
				&& (((this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + FO_TITLE]).length > 0) ) {
				aeNew_Cells[2].firstChild.nodeValue 
								= (this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + FO_TITLE];
			}

			eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);
		}

		nGroup_Member_Count = (this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + FO_LIST].length;

		// Loop from here to process each member within the ordering-group.
		for (nx=0; nx<nGroup_Member_Count; nx++) {
			// Note the ordering-group member index can be used to access the display status record directly
			// as both take their order from the Field-Set definition and both indexes start from 1 not zero.
			// However the index on the Field-Set definition itself must be computed.
			nGroup_Member_Index = (this.m_rParent_Controller).m_asField_Set_Ordering[nEntry_Index + FO_LIST][nx];
			if ((nGroup_Member_Index < 1)
				|| (nGroup_Member_Index > nDatafield_Count)) {
				alert('Ordering definition corrupted.');
				return;
			}
			Group_Member_Definition_Index = (nGroup_Member_Index - 1) * DATAFIELD_SET_UNIT_LENGTH;

			if (bFirst_Time == true) {
				this.m_afDatafield_Display_State[nGroup_Member_Index] = fDisplay_Flag;
			}

			eNew_Row = eRow_Template.cloneNode(true);
			if (!eNew_Row) {
				alert('Failed to clone a new datafield listing row.');
				return;
			}

			// The name of each row is set to the index on the display status record for the contained field.
			// This ...
			eNew_Row.removeAttribute('id');
			eNew_Row.name = nGroup_Member_Index;
			if ((this.m_afDatafield_Display_State[nGroup_Member_Index] & fDisplay_Flag) != 0) {
				eNew_Row.className = '';
			}
			else {
				eNew_Row.className = 'not_displayed';
			}

			// Handle alternating plain & shading of successive groups.
			if ((nDisplay_Type != DD_CODE_PLAIN)
				&& ((nGroups_Displayed_Counter & 1) == 0)) {
				add_class(eNew_Row, 'shaded');
			}

//			// Currently the dataset definition action codes are only used to disable selection.
			aeNew_Cells = eNew_Row.getElementsByTagName('td');
			add_event(aeNew_Cells[0].firstChild, 'click', check_click2, false);
			aeNew_Cells[0].firstChild.value = asField_Definition[Group_Member_Definition_Index + FS_NAME];
			add_event(aeNew_Cells[1].firstChild, 'click', check_click3, false);
			aeNew_Cells[1].firstChild.value = asField_Definition[Group_Member_Definition_Index + FS_NAME];
			aeNew_Cells[2].firstChild.nodeValue = asField_Definition[Group_Member_Definition_Index + FS_NAME];
			aeNew_Cells[3].firstChild.nodeValue = asField_Definition[Group_Member_Definition_Index + FS_UNIT];
			//aeNew_Cells[4].firstChild.title = "Expand";
			//add_event(aeNew_Cells[4].firstChild, 'click', toggle_click, false);
			aeNew_Cells[5].firstChild.nodeValue = asField_Definition[Group_Member_Definition_Index + FS_DESC];

			if ((this.m_rParent_Controller).is_index_field(asField_Definition[Group_Member_Definition_Index + FS_CODE]) > 0) {
			//if (asField_Definition[Group_Member_Definition_Index + FS_CODE] >= DT_INDEX) {
				aeNew_Cells[0].className = 'index';
				//aeNew_Cells[1].className = 'index';
				if (bFirst_Time == true) {
					this.m_afDatafield_Display_State[nGroup_Member_Index] |= fExtract_Flag;
				}
			}

			eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);

			// Restore the checkbox settings after row insertion because IE won't action it before row insertion.
			// (Remember the listed group-member-index is still the index required for the row's display status).
			if ((this.m_afDatafield_Display_State[nGroup_Member_Index] & fSelection_Mask) != 0) {
				aeNew_Cells = eNew_Row.getElementsByTagName('td');
                if ((this.m_afDatafield_Display_State[nGroup_Member_Index] & fExtract_Flag) != 0) {
                    aeNew_Cells[0].firstChild.checked = true;
                    //aeNew_Cells[0].firstChild.setAttribute('checked', true);
                }
                if ((this.m_afDatafield_Display_State[nGroup_Member_Index] & fFilter_Flag) != 0) {
                    aeNew_Cells[1].firstChild.checked = true;
                    //aeNew_Cells[1].firstChild.setAttribute('checked', true);
				}
			}
		}

		// Skip to the next group/entry.
		nCurrent_Group++;
		nEntry_Index += DATAFIELD_SET_UNIT_LENGTH;
	}

	// Prepare to check the set up of the expand control/image in the table header.
	var eHeader_Toggle_Cell = document.getElementById(this.m_sHeader_Toggle_Cell);
	if (!eHeader_Toggle_Cell) {
		alert("Header toggle cell '" + this.m_sHeader_Toggle_Cell + "' no longer exists.");
		return;
	}
	// Remember there are text nodes in the cell with the toggle button/image (1 for IE, 2 for Mozilla).
	var aeImage_Collection = eHeader_Toggle_Cell.getElementsByTagName('img');
	if (aeImage_Collection.length == 0) {
		alert("Header toggle control/image no longer exists.");
		return;
	}
	var nImage_Path_Index = -1;

	// On a first-time display set up the 'expand' expand control/image in the table header.
	if (bFirst_Time == true) {
		// Currently working with only one image.
		nImage_Path_Index = aeImage_Collection[0].src.indexOf(this.m_sCollapse_Preview_Image);
		if (nImage_Path_Index != -1) {
			aeImage_Collection[0].src = aeImage_Collection[0].src.substr(0, nImage_Path_Index)
											+ this.m_sExpand_Preview_Image;
		}
		aeImage_Collection[0].title = "Click to display ranges for all fields";
		this.m_afDatafield_Display_State[0] |= fExpand_Flag;
	}

	//
	// Continue here when re-displaying this field set.
	//
	// And now on first-time set up. MUST TIDY THIS UP.

	// Ensure the correct expand control/image is set up in the table header.
	// Currently working with only one image.
	if (bFirst_Time != true) {
		if ((this.m_afDatafield_Display_State[0] & fExpand_Flag) != 0) {
			nImage_Path_Index = aeImage_Collection[0].src.indexOf(this.m_sCollapse_Preview_Image);
			if (nImage_Path_Index != -1) {
				aeImage_Collection[0].src = aeImage_Collection[0].src.substr(0, nImage_Path_Index)
												+ this.m_sExpand_Preview_Image;
			}
			aeImage_Collection[0].title = "Click to display ranges for all fields";
		}
		else {
			nImage_Path_Index = aeImage_Collection[0].src.indexOf(this.m_sExpand_Preview_Image);
			if (nImage_Path_Index != -1) {
				aeImage_Collection[0].src = aeImage_Collection[0].src.substr(0, nImage_Path_Index)
												+ this.m_sCollapse_Preview_Image;
			}
			aeImage_Collection[0].title = "Click to hide ranges for all fields";
		}
	}

	// If the 'collapse' expand control/image status is set then the row extensions must be needed.
	if ((this.m_afDatafield_Display_State[0] & fExpand_Flag) == 0) {
		this.extend_all_rows();
	}
/*
	var field_remove_button = document.getElementById('dataset_field_listing_remove_button');
	if ((state_descriptor[0] & display_flag) != 0) {
		field_remove_button.value = remove_msg;
	}
	else {
		field_remove_button.value = reshow_msg;
	}
*/
}


/**
 *  Collapse all field set rows that have been extended to show field preview information.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.collapse_all_rows = function()
{
	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafield_Listing_Table) {
		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafield_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;
	var aeCell_Collection = null;
	if (nRow_Count > 2) {
		for (var nx=(nRow_Count - 2); nx>0; nx--) {
			if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
				&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
				&& (aeRow_Collection[nx].getAttribute('name') != 'header')
				&& (aeRow_Collection[nx].getAttribute('name') != 'footer')) {
				aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
				// Process only the primary field rows.
				if (aeCell_Collection.length >= 6) {
					this.hide_field_extension_row(aeRow_Collection[nx]);
					aeCell_Collection[4].className = 'merge';	// Needed for Firefox
					aeCell_Collection[5].className = '';		// but IE OK without them.
				}
			}
		}
	}
}


/**
 *  Extend all field set rows in the listing table to show field preview information.
 *	No handling of the individual field extended state information yet.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafield_Table.prototype.extend_all_rows = function()
{
//	var nDatafield_Count = (this.m_rParent_Controller).get_dataset_field_count();

	var eDatafield_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafield_Listing_Table) {
		alert("Datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafield_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;
	if (nRow_Count > 2) {
		var aeCell_Collection = null;
		var nField_Index = 0;
		var sField_Label = '';
		var sExtension_Data = '';
//		var sExtension_Type = '';
		var sExtension_Content = '';
		var eExtension_Row = null;
		for (var nx=(nRow_Count - 2); nx>0; nx--) {
			if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
				&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
				&& (aeRow_Collection[nx].getAttribute('name') != 'header')
				&& (aeRow_Collection[nx].getAttribute('name') != 'footer')
				&& (!is_undefined(aeRow_Collection[nx].name))) {
				nField_Index = aeRow_Collection[nx].name;
				eExtension_Row = null;
				aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
				// Process only the primary field rows.
				if (aeCell_Collection.length >= 6) {
					// If table has not been extended before then create all extension rows
					// otherwise they will already exist.
					if (( this.m_afDatafield_Display_State[0] & fExtended_Flag) == 0) {
						if( (aeCell_Collection[2].childNodes.length > 0)
							&& (aeCell_Collection[2].firstChild.nodeType == 3) ) {
							sField_Label = aeCell_Collection[2].firstChild.nodeValue;

							sExtension_Data = (this.m_rParent_Controller).get_field_extension_data(sField_Label);
							//sExtension_Type = this.get_field_extension_type(sExtension_Data);
							sExtension_Content = this.format_field_extension_content(sExtension_Data);
							eExtension_Row = this.create_field_extension_row(aeRow_Collection[nx], sExtension_Content);
							//aeCell_Collection[3].className = 'merge2';
							//aeCell_Collection[4].className = 'continue';
						}
					}
					// Only display the extension row if it's marked as visible.
					// Is the first clause in the following an unnecessary left-over.
					if ((aeRow_Collection[nx].name != undefined)
						&& ((this.m_afDatafield_Display_State[nField_Index] & fDisplay_Flag) != 0)) {
						// If we didn't just create the extension row because it already existed
						// then it will be the next row.
						if (eExtension_Row == null) {
							eExtension_Row = find_next_row(aeRow_Collection[nx]);
						}
						//eExtension_Row.className = '';		// this statement makes the extension visible
						// Make the extension visible with a grouping background matching its primary row.
						eExtension_Row.className = aeRow_Collection[nx].className;
					}
				}
			}
		}
	}

	this.m_afDatafield_Display_State[0] |= fExtended_Flag;
}


/**
 *  Return the organising type for the extension row preview information specified.
 *	NO LONGER USED !!!
 *
 *	@private
 *
 *  @return	The type keyword for the preview information specified, otherwise an empty string.
 *  @type	string
 */
/*
Datafield_Table.prototype.get_field_extension_type = function(a_sPreview_String)
{
	if ( (a_sPreview_String == undefined)
		|| (a_sPreview_String == null)
		|| (a_sPreview_String == '') ) {
		return '';
	}

	var asContent_List = a_sPreview_String.split('#-#');
	if (asContent_List.length < 2) {
		return '';
	}

	switch (parseInt(asContent_List[0], 10)) {

	case 0 :	return ('value:');

	case 1 :	return ('values:');

	case 2 :	return ('range:');

	default :	return '';

	}
}
*/

/**
 *	Return a formatted string displaying all preview values for the extension row preview information specified.
 *
 *	@private
 *
 *	@return	The fully formatted preview values for display in the extension row or a message string.
 *  @type	string
 */

Datafield_Table.prototype.format_field_extension_content = function(a_sPreview_String)
{
	if ( (a_sPreview_String == undefined)
		|| (a_sPreview_String == null)
		|| (a_sPreview_String == '') ) {
		return 'no metadata';
	}

	var asContent_List = a_sPreview_String.split('#-#');
	if (asContent_List.length < 2) {
		return 'metadata error';
	}

	switch (parseInt(asContent_List[0], 10)) {

//	case 0 :	return ('value: ' + asContent_List[1]);

//	case 1 :	return ('values: ' + (asContent_List.slice(1)).join(', '));

//	case 2 :	if (asContent_List.length < 3) {
//					return ('range: ' + asContent_List[1] + ' to ...');
//				}

//				return ('range: ' + asContent_List[1] + ' to ' + asContent_List[2]);

//	default :	return 'metadata error';

	case QB_NONE :		return 'no values';

	case QB_ONE :		return ('single value: ' + asContent_List[1]);

	case QB_VALUE :		if (asContent_List[1].length == 0) {
							return ('values ...');
						}
						return ('values such as: ' + asContent_List[1]);

	case QB_RANGE :		if (asContent_List[2].length == 0) {
							return ('range: ' + asContent_List[1] + ' to ...');
						}
						return ('range: ' + asContent_List[1] + ' to ' + asContent_List[2]);

	case QB_LIST :		return ('list: ' + (asContent_List.slice(1)).join(', '));

	case QB_TAX_LIST :	var nip = 0;
						var asCode_Free_List = Array();
						var nContent_List_Length = asContent_List.length;
						for (var nc=1; nc<nContent_List_Length; nc++) {
							asCode_Free_List[nip] = asContent_List[nc];
							nip++;
							nc++;
						}
						return ('list: ' + asCode_Free_List.join(', '));

	default :	return 'unknown content type';

	}
}


/**
 *	Create and format a HTML row element as a field set extension row.
 *
 *	@private
 *
 *	@return	A fully formatted preview extension row element or empty string.
 *  @type	string
 */

Datafield_Table.prototype.create_field_extension_row = function(a_ePrimary_Display_Row, a_sExtension_Content)
{
	var eNext_Row = find_next_row(a_ePrimary_Display_Row);
	if (!eNext_Row)
		return ('');

	var eRow_Extension_Template = document.getElementById(this.m_sTable_Template_Ext);
	if (!eRow_Extension_Template) {
		alert("Pre-formatted row extension '" + this.m_sTable_Template_Ext
			+ "' for datafield listing table '" + this.m_sTable_ID + "' no longer exists.");
		return ('');
	}

	var eRow_Extension = eRow_Extension_Template.cloneNode(true);
	if (!eRow_Extension) {
		alert('field listing extension row not cloned');
		return ('');
	}

	eRow_Extension.className = 'not_displayed';
	eRow_Extension.removeAttribute('id');

	var aeExtension_Cells = eRow_Extension.getElementsByTagName('td');
	if ((aeExtension_Cells.length >= 5)
		&& (aeExtension_Cells[4].firstChild.nodeType == 3)) {
		aeExtension_Cells[4].firstChild.nodeValue = a_sExtension_Content;
		// This works because there is always a footer row on the table.
		a_ePrimary_Display_Row.parentNode.insertBefore(eRow_Extension, eNext_Row);
	}

	return (eRow_Extension);
}


/**
 *	Collapse a field set row, removing the extension row from view.
 *
 *	@private
 *	@param	{element} a_ePrimary_Display_Row A field set primary display row.
 *
 *	@return	none
 *  @type	void
 */

Datafield_Table.prototype.hide_field_extension_row = function(a_ePrimary_Display_Row)
{
	var eNext_Row = find_next_row(a_ePrimary_Display_Row);
	if (!eNext_Row) return;

	// Confirm the next row is a row extension.
	// Note the footer will also pass the test but it's unlikely
	// to be found here and it's set not visible already.
	var aeNext_Row_Cells = eNext_Row.getElementsByTagName('td');
	if (aeNext_Row_Cells.length < 6) {
		//eNext_Row.parentNode.removeChild(eNext_Row);		// No longer destroy the extension row
		eNext_Row.className = 'not_displayed';				// but now just hide it.
	}
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

Datafield_Table.prototype.locate_active_ordering = function()
{
	var nActive_Id = this.get_active_ordering();	// Get the active (numeric) ordering id.
	var nOrdering_Definition_Length = (this.m_rParent_Controller).m_asField_Set_Ordering.length;

	var nx = 0;
	while (nx < nOrdering_Definition_Length) {
		// Check we have a valid group start-of-header.
		if ((this.m_rParent_Controller).m_asField_Set_Ordering[nx + FO_SOH] != 0) {
			alert('Ordering definition corrupted.');
			return (0);
		}

		// If the ordering is found then return its header index.
		if ((this.m_rParent_Controller).m_asField_Set_Ordering[nx + FO_ID] == nActive_Id) {
			return (nx);
		}

		// Skip the ordering header and all its groups.
		nx += (parseInt((this.m_rParent_Controller).m_asField_Set_Ordering[nx + FO_COUNT], 10) + 1) 
																		* DATAFIELD_SET_UNIT_LENGTH;
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

Datafield_Table.prototype.get_active_ordering = function()
{
	// Currently no shifting is required.
	return (this.m_afDatafield_Display_State[0] & fActive_Orderingf_Bits);
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

Datafield_Table.prototype.set_active_ordering = function(a_nOrdering_Id)
{
//	this.set_ordering_element(a_nOrdering_Id);

	// Currently no shifting is required.
	var nOrdering_Bits = a_nOrdering_Id & fActive_Orderingf_Bits;
	this.m_afDatafield_Display_State[0] &= fReset_Orderingf_Mask;
	this.m_afDatafield_Display_State[0] |= nOrdering_Bits;
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

Datafield_Table.prototype.set_ordering_element = function(a_nOrdering_Id)
{
	var eTable_Order_Button = document.getElementById(this.m_sTable_Order_Button);
	if (!eTable_Order_Button) {
		alert("Table order button '" + this.m_sTable_Order_Button + "' no longer exists.");
		return;
	}

	eTable_Order_Button.value = this.m_asOrder_Button_Labels[a_nOrdering_Id];
}


/* -+- */


