/**
 *  @fileoverview The class Datafilter_Table is the display handler for all dataset filter listing tables.
 *
 *	@version 0.0.23  [26.1.2007]
 *	@version 0.0.25  [31.1.2007]
 *	@version 0.0.26  [14.8.2007]
 *	@version 0.0.29  [11.9.2007]
 */


//--------------------------------------------------------------------------------------------------
//
// Status flags and masks.

// Table: Show all column help rows (0 = collapse all column help rows).
//			Co-ordinates the state of the 'show/hide' column help button.
// Set:   --
var fShowhelps_Flag = 1;
var fUnshowhelps_Mask = (-1) ^ fShowhelps_Flag;

//--------------------------------------------------------------------------------------------------


/**
 *	Constructor for the Datafilter_Table class.
 *	@class	The class Datafilter_Table provides support for the display/re-display
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

function Datafilter_Table(a_sSection_Name, a_rSection_Parent)
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
	 *	The unique identifier of the fully formatted empty row
	 *	used when a dataset field filter set is found to be empty.
	 *	@type	string
	 */
	this.m_sEmpty_Row = '';

	/**
	 *	The unique identifier of the pre-formatted HTML 'table-row' element
	 *	configured in the current page for use by this datafilter table. New
	 *	rows are added to the HTML 'table' by cloning this pre-formatted row.
	 *	@type	string
	 */
	this.m_sTable_Template_Row = '';

	/**
	 *	The unique identifier of the HTML 'table' column help button.
	 *	@type	string
	 */
	this.m_sColumn_Help_Button = '';

	/**
	 *	The unique identifier of the display section supporting
	 *	range-based and value-based filter value selection.
	 *	@type	string
	 */
	this.m_sRange_Value_Selection_Section = '';

	/**
	 *	The unique identifier of the date format message.
	 *	@type	string
	 */
	this.m_sDate_Format_Message = '';

	/**
	 *	The unique identifier of the value selection button
	 *	indicating a single filter value is being selected.
	 *	@type	string
	 */
	this.m_sValue_Selection_Indicator = '';

	/**
	 *	The unique identifier of the input element
	 *	used to receive a single filter value.
	 *	@type	string
	 */
	this.m_sSingle_Value_Filter = '';

	/**
	 *	The unique identifier of the range selection button
	 *	indicating a filter range is being selected.
	 *	@type	string
	 */
	this.m_sRange_Selection_Indicator = '';

	/**
	 *	The unique identifier of the input element
	 *	used to receive a sitart-of-range filter value.
	 *	@type	string
	 */
	this.m_sRange_Start_Filter = '';

	/**
	 *	The unique identifier of the input element
	 *	used to receive an end-of-range filter value.
	 *	@type	string
	 */
	this.m_sRange_End_Filter = '';

	/**
	 *	The unique identifier of the display section supporting
	 *	list-based filter value selection.
	 *	@type	string
	 */
	this.m_sList_Value_Selection_Section = '';

	/**
	 *	The unique identifier of the date format message.
	 *	@type	string
	 */
	this.m_sExpander_Button = '';

	/**
	 *	The unique identifier of the date format message.
	 *	@type	string
	 */
	this.m_sExpander_Cell = '';

	/**
	 *	The unique identifier of the clonable option element
	 *	used to populate the filter value selection list.
	 *	@type	string
	 */
	this.m_sList_Option_Template = '';

	/**
	 *	The unique identifier of the hidden section used to hold all
	 *	filter selection info for transfer to the server via submit form.
	 *	@type	string
	 */
	this.m_sFilter_Info_Section = '';

	/**
	 *	The unique identifier of the clonable element used to populate
	 *	the hidden section holding the filter selection info.
	 *	@type	string
	 */
	this.m_sFilter_Info_Template = '';

	/**
	 *	The updated list of fields currently checked for filtering.
	 *	@type	array
	 */
	this.m_asChecked_Set = Array();

	/**
	 *	The list of fields displayed for filter value selection.
	 *	@type	array
	 *
	 *	An associative array indexed by field name. Array element values are:
	 *		null = no longer selected as a filter field
	 *	or
	 *		Array( fieldname, boolean, code {, value}* );
	 */
	this.m_asFilter_Set = Array();

	/**
	 *	The name of the currently selected filter field.
	 *	@type	string
	 */
	this.m_sActive_Filter = '';

	/**
	 *	The type of the currently selected filter field (temporary).
	 *	@type	string
	 */
	this.m_nActive_Filter_Type = QB_UNKNOWN;

	/**
	 *	A reference to the active filter table row.
	 *	@type	object
	 */
	this.m_rActive_Row = null;

//	/**
//	 *	Using this flag permits a degree of laziness for the data retrieval
//	 *	and also indicates when data retrieval has already been attempted
//	 *	ie when an empty field definition is the true end value.
//	 *	@type	boolean
//	 */
//	this.m_bContent_Retrieved = false;

	/**
	 *	The name of the dataset used by the database server (not the unique
	 *	application-wide name used to identify the display). This name will
	 *	be used when generating any SQL queries for the server database.
	 *	@type	string
	 */
	this.m_sDataset_Name = '';

	/**
	 *	A record of the display state for each field in the dataset field filter-set.
	 *	A numeric array of flag fields with the same order as the original field-set
	 *	(indexing from a base of 1).
	 *	The first entry (index zero) holds state information for the table as a whole.
	 *	@type	array
	 */
	this.m_afDatafilter_Display_State = Array();
//	this.reset_display_status(0);
	this.m_afDatafilter_Display_State[0] = 0;

	this.nHeight = 0;
	this.bAdjustable = false;
	this.bReduced = false;
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

Datafilter_Table.prototype.set_element_names = function(a_sSection_Element, a_asElement_List)
{
	var nx = 0;

	if (!document.getElementById(a_sSection_Element)) {
		alert("Display '" + this.m_sDisplay_Name + "' section element '" + a_sSection_Element + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 18;

	if (!is_array(a_asElement_List)
		|| (a_asElement_List.length != nElement_List_Length)) {
		alert("Bad element list for display '" + this.m_sDisplay_Name + "'.");
		return (false);
	}

	for (nx=0; nx<nElement_List_Length; nx++) {
		if (!document.getElementById(a_asElement_List[nx])) {
			alert("Display '" + this.m_sDisplay_Name + "' element '" + a_asElement_List[nx] + "' was not found.");
			return (false);
		}
	}

	this.m_sSection_Element = a_sSection_Element;
	this.m_sTable_ID = a_asElement_List[0];
	this.m_sTable_Footer = a_asElement_List[1];
	this.m_sEmpty_Row = a_asElement_List[2];
	this.m_sTable_Template_Row = a_asElement_List[3];
	this.m_sColumn_Help_Button = a_asElement_List[4];
	this.m_sRange_Value_Selection_Section = a_asElement_List[5];
	this.m_sDate_Format_Message = a_asElement_List[6];
	this.m_sValue_Selection_Indicator = a_asElement_List[7];
	this.m_sSingle_Value_Filter = a_asElement_List[8];
	this.m_sRange_Selection_Indicator = a_asElement_List[9];
	this.m_sRange_Start_Filter = a_asElement_List[10];
	this.m_sRange_End_Filter = a_asElement_List[11];
	this.m_sList_Value_Selection_Section = a_asElement_List[12];
	this.m_sExpander_Button = a_asElement_List[13];
	this.m_sExpander_Cell = a_asElement_List[14];
	this.m_sList_Option_Template = a_asElement_List[15];
	this.m_sFilter_Info_Section = a_asElement_List[16];
	this.m_sFilter_Info_Template = a_asElement_List[17];

	// Make sure the event handler for the column help button is set up.
	var eColumn_Help_Button = document.getElementById(this.m_sColumn_Help_Button);
	if (!eColumn_Help_Button) {
		alert("Column help button '" + this.m_sColumn_Help_Button + "' no longer exists.");
		return;
	}
	// Under DOM2 can have multiple event handlers registered.
	remove_event(eColumn_Help_Button, 'click', datafilter_column_help_click, false);
	add_event(eColumn_Help_Button, 'click', datafilter_column_help_click, false);

	return (true);
}


/**
 *  Set the dataset filter set, replacing any existing displayed filter set.
 *	This does not cause the immediate automatic display of the new filter set.
 *	NOT USED !!!
 *
 *	@param	{string} a_sDataset_Name The name of the new dataset.
 *	@param	{array} a_asFilter_Definition The dataset filter set definition.
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Datafilter_Table.prototype.set_dataset_filter_set = function(a_sDataset_Name, a_asFilter_Definition)
{
//	if ((a_asField_Definition.length % DATAFIELD_SET_UNIT_LENGTH) != 0) {
//		alert('dataset field set error');
//		return (false);
//	}

//	this.m_sDataset_Name = a_sDataset_Name;
//	this.m_asField_Definition = a_asField_Definition;

//	// Reset the display state for the new dataset field set.
//	this.m_afField_Display_State = Array();
//	this.m_afField_Display_State[0] = 0;

	return (true);
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
 *	datafilter, datafield and dataset display/re-display startups will be alike and the
 *	panel controller function select_new_display() will first call any auxiliary/support
 *	objects (eg mappers) and then the display object - for all display switching.
 *
 *	@param	{boolean} a_bNew_Display_State True to display the help, false to hide it.
 *
 *	@return	none
 *	@type	void
 */

Datafilter_Table.prototype.set_column_help = function(a_bNew_Display_State)
{
	var sNew_Help_Row_Class = '';

	var eDatafilter_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafilter_Listing_Table) {
		alert("Datafilter listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafilter_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;

	if (a_bNew_Display_State == true) {
		sNew_Help_Row_Class = '';
		this.m_afDatafilter_Display_State[0] |= fShowhelps_Flag;
	}
	else {
		sNew_Help_Row_Class = 'hidden_column_help_row';
		this.m_afDatafilter_Display_State[0] &= fUnshowhelps_Mask;
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

Datafilter_Table.prototype.hide_display = function()
{
	var sDataset_Name = this.m_rParent_Controller.m_sDisplay_Name;
	//alert('Hiding \'' + sDataset_Name + '\' filter fields');

	var eRange_Selection_Element = document.getElementById(this.m_sRange_Value_Selection_Section);
	if (!eRange_Selection_Element) {
		alert('Display section element \'' + this.m_sRange_Value_Selection_Section + '\' no longer exists.');
		return;
	}
	eRange_Selection_Element.className = 'hidden';

	var eList_Selection_Element = document.getElementById(this.m_sList_Value_Selection_Section);
	if (!eList_Selection_Element) {
		alert('Display section element \'' + this.m_sList_Value_Selection_Section + '\' no longer exists.');
		return;
	}
	eList_Selection_Element.className = 'hidden';

	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}
	eDisplay_Element.className = 'hidden';
}


/**
 *	Show the display, re-displaying the dataset filter set listing.
 *
 *	@return	none
 *	@type	void
 */

Datafilter_Table.prototype.show_display = function()
{
	var nFilter_Set_Count = 0;

	//var sDataset_Filter_Set = Array();
	//sDataset_Filter_Set = (this.m_rParent_Controller).get_dataset_filter_set();

	//var sDataset_Name = this.m_rParent_Controller.m_sDisplay_Name;
	//alert('Showing \'' + sDataset_Name + '\' filter fields');

	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}

	nFilter_Set_Count = this.sync_filters_with_field_table();

	this.remove_datafilter_rows();

	// Only display the template after the old table rows have been removed.
	//alert('classname was \'' + eDisplay_Element.className + '\'');
	eDisplay_Element.className = '';

	if (nFilter_Set_Count == 0) {
		this.display_empty_table();
	}
	else {
		this.add_datafilter_rows();
	}
}


/**
 *  Handle a filter field selection event (click).
 *
 *	@param	{element} a_eActive_Element The activated set search value(s) button within the target row.
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.filter_field_selection = function(a_eActive_Element)
{
	var nx = 0;

	var sField_Label = a_eActive_Element.name;
	this.m_sActive_Filter = sField_Label;

	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return;
	}
	this.m_rActive_Row = eActivated_Row;		// what's this for ???  (for later use on accept ???)

	var eRange_Selection_Element = document.getElementById(this.m_sRange_Value_Selection_Section);
	if (!eRange_Selection_Element) {
		alert('Display section element \'' + this.m_sRange_Value_Selection_Section + '\' no longer exists.');
		return;
	}
	eRange_Selection_Element.className = 'hidden';

	var eList_Selection_Element = document.getElementById(this.m_sList_Value_Selection_Section);
	if (!eList_Selection_Element) {
		alert('Display section element \'' + this.m_sList_Value_Selection_Section + '\' no longer exists.');
		return;
	}
	eList_Selection_Element.className = 'hidden';

	var eDate_Format_Message = document.getElementById(this.m_sDate_Format_Message);
	if (!eDate_Format_Message) {
		alert('Date format message \'' + this.m_sDate_Format_Message + '\' no longer exists.');
		return;
	}
	eDate_Format_Message.className = 'not_visible';

	var eExpander_Button = document.getElementById(this.m_sExpander_Button);
	if (!eExpander_Button) {
		alert("Expander button '" + this.m_sExpander_Button + "' no longer exists.");
		return;
	}
	eExpander_Button.className = 'hidden';

	var eExpander_Cell = document.getElementById(this.m_sExpander_Cell);
	if (!eExpander_Cell) {
		alert("Expander cell '" + this.m_sExpander_Cell + "' no longer exists.");
		return;
	}

	if (this.bAdjustable) {
		this.bAdjustable = false;
		this.bReduced = false;
		// Under DOM2 can have multiple event handlers registered.
		remove_event(eExpander_Button, 'click', toggle_expander_cell, false);
	}
/*
	var eName_Row = document.getElementById('datafilter_field_name_row');
	if (is_null(eName_Row)) {
		alert("Filter table name row '" + 'datafilter_field_name_row' + "' no longer exists.");
		return;
	}

	var eInfo_Row = document.getElementById('datafilter_field_info_row');
	if (is_null(eInfo_Row)) {
		alert("Filter table name row '" + 'datafilter_field_info_row' + "' no longer exists.");
		return;
	}
*/
	var nField_Data_Type = (this.m_rParent_Controller).get_field_datatype(sField_Label);
	var sField_Description = (this.m_rParent_Controller).get_field_description(sField_Label);
	var sExtension_Data = (this.m_rParent_Controller).get_field_extension_data(sField_Label);
	var nExtension_Type = (this.m_rParent_Controller).get_field_extension_type(sExtension_Data);
	var sExtension_Content = (this.m_rParent_Controller).format_field_extension_content(sExtension_Data);
	var asData_Values = (this.m_rParent_Controller).get_field_data_values(sExtension_Data);

	//alert('Field Description = ' + sField_Description);
	//alert('Extension Data = ' + sExtension_Data);
	//alert('Extension Type = ' + nExtension_Type);
	//alert('Extension Content = ' + sExtension_Content);
	//alert('Data Values = ' + asData_Values);

	var eSelection_Element = null;
	if ((this.m_rParent_Controller).extension_data_is_list(sExtension_Data)) {
		eSelection_Element = eList_Selection_Element;
	}
	else {
		eSelection_Element = eRange_Selection_Element;
	}
	this.m_nActive_Filter_Type = nExtension_Type;

	var aeRow_Collection = eSelection_Element.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;
	var aeCell_Collection = null;

	for (nx=0; nx<nRow_Count; nx++) {
		if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
			&& (aeRow_Collection[nx].getAttribute('name') == 'header')) {

			aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('th');
			if( (aeCell_Collection.length > 1)
				&& (aeCell_Collection[0].childNodes.length > 0)
				&& (aeCell_Collection[0].firstChild.nodeType == 3)
				&& (aeCell_Collection[1].childNodes.length > 0)
				&& (aeCell_Collection[1].firstChild.nodeType == 3) ) {
				aeCell_Collection[0].firstChild.nodeValue = sField_Label;
				aeCell_Collection[1].firstChild.nodeValue = sField_Description;
			}
			break;
		}
	}

	// This should now use the id 'expander_cell'
	// ie eInfo_Pane = eExpander_Cell
	var eInfo_Pane = null;
	for (nx=0; nx<nRow_Count; nx++) {
		if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
			&& (aeRow_Collection[nx].getAttribute('name') == 'info_row')) {

			aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
			if( (aeCell_Collection.length > 1)
				&& (aeCell_Collection[1].childNodes.length > 0)) {
				eInfo_Pane = find_child_element(aeCell_Collection[1], 'div');
				if (!is_null(eInfo_Pane)
					&& (eInfo_Pane.childNodes.length > 0)
					&& (eInfo_Pane.firstChild.nodeType == 3)) {
					eInfo_Pane.firstChild.nodeValue = sExtension_Content;
				}
			}
			break;
		}
	}
	eInfo_Pane.style.height = 'auto';

	var sRow_Class = '';
	if (!(this.m_rParent_Controller).extension_data_is_selectable(sExtension_Data)) {
		sRow_Class = 'hidden';
	}

	for (nx=0; nx<nRow_Count; nx++) {
		if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
			&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
			&& (aeRow_Collection[nx].getAttribute('name') != 'header')
			&& (aeRow_Collection[nx].getAttribute('name') != 'info_row')
			&& (aeRow_Collection[nx].getAttribute('name') != 'spacer')) {
			aeRow_Collection[nx].className = sRow_Class;
		}
	}

	// Value/Range selection.
	if (nRow_Count == 7) {
		var eTmp_Element = null;
		eTmp_Element = document.getElementById(this.m_sValue_Selection_Indicator);
		eTmp_Element.checked = false;
		eTmp_Element = document.getElementById(this.m_sRange_Selection_Indicator);
		eTmp_Element.checked = false;
		eTmp_Element = document.getElementById(this.m_sSingle_Value_Filter);
		eTmp_Element.value = '';
		eTmp_Element = document.getElementById(this.m_sRange_Start_Filter);
		eTmp_Element.value = '';
		eTmp_Element = document.getElementById(this.m_sRange_End_Filter);
		eTmp_Element.value = '';
		if (nField_Data_Type == DT_DATE) {
			eDate_Format_Message.className = 'is_visible';
		}
	}

	// List selection.
	if (nRow_Count == 4) {
		var eClonable_Option_Element = document.getElementById(this.m_sList_Option_Template);
		if (!eClonable_Option_Element) {
			alert('Clonable option element \'' + this.m_sList_Option_Template + '\' no longer exists.');
			return;
		}

		aeCell_Collection = aeRow_Collection[2].getElementsByTagName('td');
		var eSelect_Element = find_child_element(aeCell_Collection[1], 'select');
		if (!is_null(eSelect_Element)) {
			var aeSelect_Child_Nodes = eSelect_Element.childNodes;
			var aeSelect_Child_Node_Count = aeSelect_Child_Nodes.length;
			for (nx=aeSelect_Child_Node_Count - 1; nx>=0; nx--) {
				eSelect_Element.removeChild(aeSelect_Child_Nodes[nx]);
			}
			var nData_Value_Count = asData_Values.length;
			var eNew_Option = null;
			for (nx=0; nx<nData_Value_Count; nx++) {
				eNew_Option = eClonable_Option_Element.cloneNode(true);
				if (!eNew_Option) {
					alert('Failed to clone a new datafilter option element.');
					return;
				}
				eNew_Option.removeAttribute('id');
				eNew_Option.firstChild.nodeValue = asData_Values[nx];
				if (nExtension_Type == QB_TAX_LIST) {
					eNew_Option.value = asData_Values[nx + 1];
					nx++;
				}
				eSelect_Element.appendChild(eNew_Option);
			}
		}
	}

	eSelection_Element.className = '';

	// Manage size of display for List selections.
	if (nRow_Count == 4) {
		this.nHeight = Math.max(eInfo_Pane.clientHeight, eInfo_Pane.scrollHeight);
		//alert(this.nHeight);
		if (this.nHeight > 160) {
			//alert('reduce height');
			eInfo_Pane.style.height = '100px';
			eExpander_Button.value = 'show all';
			eExpander_Button.className = '';
			add_event(eExpander_Button, 'click', toggle_expander_cell, false);
			this.bAdjustable = true;
			this.bReduced = true;
		}
	}

//	var nField_Index = eActivated_Row.name;
////	if (nField_Index ...) {
////	}

//	if (a_eActive_Element.checked == true) {
//		this.m_afField_Display_State[nField_Index] |= fExtract_Flag;
//	}
//	else {
//		this.m_afField_Display_State[nField_Index] &= fUnextract_Mask;
//	}
}


/**
 *  Handle the 'expander' button to toggle the size of a large value listing display.
 *
 *	@param	{element} a_eActive_Element The activated 'expander' button.
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.toggle_expander_cell = function(a_eActive_Element)
{
	if (!this.bAdjustable) {
		return;
	}

	var eExpander_Cell = document.getElementById(this.m_sExpander_Cell);
	if (!eExpander_Cell) {
		alert("Expander cell '" + this.m_sExpander_Cell + "' no longer exists.");
		return;
	}

	if (this.bReduced) {
		eExpander_Cell.style.height = this.nHeight + 'px';
		a_eActive_Element.value = ' reduce ';
		this.bReduced = false;
	}
	else {
		eExpander_Cell.style.height = '100px';
		a_eActive_Element.value = 'show all';
		this.bReduced = true;
	}
}


/**
 *	Handle a search value field activation event (focus).
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.select_set_value = function()
{
	var eValue_Filter_Selector = document.getElementById(this.m_sValue_Selection_Indicator);
	if (!eValue_Filter_Selector) {
		alert("Value filter selector '" + this.m_sValue_Selection_Indicator + "' no longer exists.");
		return;
	}

	eValue_Filter_Selector.checked = true;
}


/**
 *	Handle a search range field activation event (focus).
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.select_set_range = function()
{
	var eRange_Filter_Selector = document.getElementById(this.m_sRange_Selection_Indicator);
	if (!eRange_Filter_Selector) {
		alert("Range filter selector '" + this.m_sRange_Selection_Indicator + "' no longer exists.");
		return;
	}

	eRange_Filter_Selector.checked = true;
}


/**
 *  Handle the 'accept' button for a datafilter range selection.
 *
 *	@param	{element} a_eActive_Element The activated range selection 'accept' button.
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.range_value_selection = function(a_eActive_Element)
{
	var sSingle_Value = '';
	var sStart_Range = '';
	var sEnd_Range = '';

	if (!is_string(this.m_sActive_Filter) || (this.m_sActive_Filter.length == 0)) {
		return;
	}

	// First confirm this activation is for the correct section.
	// ALSO NEED TO HAVE RECORDED THAT THIS SECTION IS CURRENTLY DISPLAYED !!!
	var eActivated_Section = find_parent_element(a_eActive_Element, 'div');
	if (is_null(eActivated_Section)) {
		return;
	}
	if (eActivated_Section.getAttribute('id') != this.m_sRange_Value_Selection_Section) {
		return;
	}

	var eValue_Filter_Selector = document.getElementById(this.m_sValue_Selection_Indicator);
	if (!eValue_Filter_Selector) {
		alert("Value filter selector '" + this.m_sValue_Selection_Indicator + "' no longer exists.");
		return;
	}

	var eRange_Filter_Selector = document.getElementById(this.m_sRange_Selection_Indicator);
	if (!eRange_Filter_Selector) {
		alert("Range filter selector '" + this.m_sRange_Selection_Indicator + "' no longer exists.");
		return;
	}

	// Remember that initially both selectors will be unchecked.
	if ((eValue_Filter_Selector.checked == false)
		&& (eRange_Filter_Selector.checked == false)) {
		alert('Did you forget to select a radio button?');
		return;
	}

	if (eValue_Filter_Selector.checked == true) {
		var eSingle_Value_Field = document.getElementById(this.m_sSingle_Value_Filter);
		if (!eSingle_Value_Field) {
			alert("Single value input '" + this.m_sSingle_Value_Filter + "' no longer exists.");
			return;
		}
		sSingle_Value = trim_string(eSingle_Value_Field.value);
		if (sSingle_Value.length == 0) {
			alert('no \'field value\' specified');
			return;
		}
		if (sSingle_Value == 'null') {
			alert('Note: null field values are currently not accepted as search values.\n\n'
				  + 'Please contact res.era@rothamsted.ac.uk if you will need to search for empty fields.\n\n'
				  + 'Thank you.');
			return;
		}

		// Only accept and record valid values.
		if (this.is_valid_value(sSingle_Value)) {
			this.m_asFilter_Set[this.m_sActive_Filter][2] = 1;
			if ((this.m_rParent_Controller).get_field_datatype(this.m_sActive_Filter) == DT_DATE) {
				this.m_asFilter_Set[this.m_sActive_Filter][3] = make_10char_date(sSingle_Value);
			}
			else {
				this.m_asFilter_Set[this.m_sActive_Filter][3] = sSingle_Value;
			}
		}
		else {
			alert('Invalid search value.');
		}
	}
	else {
		var eStart_Range_Field = document.getElementById(this.m_sRange_Start_Filter);
		if (!eStart_Range_Field) {
			alert("Range start input '" + this.m_sRange_Start_Filter + "' no longer exists.");
			return;
		}
		var eEnd_Range_Field = document.getElementById(this.m_sRange_End_Filter);
		if (!eEnd_Range_Field) {
			alert("Range end input '" + this.m_sRange_End_Filter + "' no longer exists.");
			return;
		}
		sStart_Range = trim_string(eStart_Range_Field.value);
		sEnd_Range = trim_string(eEnd_Range_Field.value);
		if (sStart_Range.length == 0) {
			alert('no \'start-of-range\' specified');
			return;
		}
		if (sEnd_Range.length == 0) {
			alert('no \'end-of-range\' specified');
			return;
		}
		if ((sStart_Range == 'null')
			|| (sEnd_Range == 'null')) {
			alert('Note: null field values are not accepted as range limits.');
			return;
		}

		// Only accept and record valid ranges.
		if (this.is_valid_range(sStart_Range, sEnd_Range)) {
			this.m_asFilter_Set[this.m_sActive_Filter][2] = 3;
			if ((this.m_rParent_Controller).get_field_datatype(this.m_sActive_Filter) == DT_DATE) {
				this.m_asFilter_Set[this.m_sActive_Filter][3] = make_10char_date(sStart_Range);
				this.m_asFilter_Set[this.m_sActive_Filter][4] = make_10char_date(sEnd_Range);
			}
			else {
				this.m_asFilter_Set[this.m_sActive_Filter][3] = sStart_Range;
				this.m_asFilter_Set[this.m_sActive_Filter][4] = sEnd_Range;
			}
		}
		else {
			alert('Invalid search range.');
		}
	}

	var eDatafilter_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafilter_Listing_Table) {
		alert("Datafilter listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafilter_Listing_Table.getElementsByTagName('tr');
	var nRow_Collection_Count = aeRow_Collection.length;

	if (nRow_Collection_Count < 3) {
		return;
	}

	// Display accepted value/range.
	for (nx=0; nx<nRow_Collection_Count; nx++) {
		if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
			&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
			&& (aeRow_Collection[nx].getAttribute('name') != 'header')
			&& (aeRow_Collection[nx].getAttribute('name') != 'footer')) {
			aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
			nCell_Collection_Count = aeCell_Collection.length;
			if (nCell_Collection_Count < 2) {
				return;
			}
			if ( (aeCell_Collection[1].childNodes.length > 0)
				&& (aeCell_Collection[1].firstChild.nodeType == 3)
				&& (aeCell_Collection[1].firstChild.nodeValue == this.m_sActive_Filter) ) {
				if ( (aeCell_Collection[2].childNodes.length > 0)
					&& (aeCell_Collection[2].firstChild.nodeType == 3) ) {
					aeCell_Collection[2].firstChild.nodeValue = this.format_filter_field_values(this.m_sActive_Filter);
				}
				break;
			}
		}
	}
}


/**
 *  Handle the 'accept' button for a datafilter list selection.
 *	Better to have some extra IDs than do so much work here !!!
 *
 *	@param	{element} a_eActive_Element The activated list selection 'accept' button.
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.list_value_selection = function(a_eActive_Element)
{
	var nx = 0;

	if (!is_string(this.m_sActive_Filter) || (this.m_sActive_Filter.length == 0)) {
		return;
	}

	// First confirm this activation is for the correct section.
	// ALSO NEED TO HAVE RECORDED THAT THIS SECTION IS CURRENTLY DISPLAYED !!!
	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return;
	}

	var aeCell_Collection = eActivated_Row.getElementsByTagName('td');
	var nCell_Collection_Count = aeCell_Collection.length;
	if (nCell_Collection_Count < 2) {
		return;
	}

	eSelect_Element = find_child_element(aeCell_Collection[1], 'select');
	if (is_null(eSelect_Element)) {
		return;
	}

	// Note: using the .options collection doesn't work in IE.
	var aeOptions_Collection = eSelect_Element.getElementsByTagName('option');
	var nOptions_Collection_Count = aeOptions_Collection.length;
	if (nOptions_Collection_Count == 0) {
		return;
	}

	for (nx=0; nx<nOptions_Collection_Count; nx++) {
		if ( (aeOptions_Collection[nx].selected == true)
			&& (aeOptions_Collection[nx].childNodes.length > 0)
			&& (aeOptions_Collection[nx].firstChild.nodeType == 3) ) {
			if (aeOptions_Collection[nx].firstChild.nodeValue == 'null') {
				alert('Note: null field values are currently not accepted as search values.\n\n'
					  + 'Please contact res.era@rothamsted.ac.uk if you will need to search for empty fields.\n\n'
					  + 'Thank you.');
				return;
			}
		}
	}

	var asSelected_Value_List = Array();
	var asSelected_Code_List = Array();
	var nSelected_Options_Count = 0;
	for (nx=0; nx<nOptions_Collection_Count; nx++) {
		if ( (aeOptions_Collection[nx].selected == true)
			&& (aeOptions_Collection[nx].childNodes.length > 0)
			&& (aeOptions_Collection[nx].firstChild.nodeType == 3) ) {
			asSelected_Value_List[nSelected_Options_Count] = aeOptions_Collection[nx].firstChild.nodeValue;
			if (this.m_nActive_Filter_Type == QB_TAX_LIST) {
				asSelected_Code_List[nSelected_Options_Count] = aeOptions_Collection[nx].value;
			}
			nSelected_Options_Count++;
		}
	}

	var eDatafilter_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafilter_Listing_Table) {
		alert("Datafilter listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafilter_Listing_Table.getElementsByTagName('tr');
	var nRow_Collection_Count = aeRow_Collection.length;

	if (nRow_Collection_Count < 3) {
		return;
	}

//	if (nSelected_Options_Count == 0) {
//		return;
//	}
	this.m_asFilter_Set[this.m_sActive_Filter][2] = ((this.m_nActive_Filter_Type == QB_TAX_LIST) ? ST_TAX_LIST : ST_LIST);
	this.m_asFilter_Set[this.m_sActive_Filter][3] = nSelected_Options_Count;
	var nip = 0;
	for (nx=0; nx<nSelected_Options_Count; nx++) {
		this.m_asFilter_Set[this.m_sActive_Filter][nip + 4] = asSelected_Value_List[nx];
		nip++;
		if (this.m_nActive_Filter_Type == QB_TAX_LIST) {
			this.m_asFilter_Set[this.m_sActive_Filter][nip + 4] = asSelected_Code_List[nx];
			nip++;
		}
	}

	for (nx=0; nx<nRow_Collection_Count; nx++) {
		if ((aeRow_Collection[nx].nodeName.toLowerCase() == 'tr')
			&& (aeRow_Collection[nx].getAttribute('name') != 'column_help_row')
			&& (aeRow_Collection[nx].getAttribute('name') != 'header')
			&& (aeRow_Collection[nx].getAttribute('name') != 'footer')) {
			aeCell_Collection = aeRow_Collection[nx].getElementsByTagName('td');
			nCell_Collection_Count = aeCell_Collection.length;
			if (nCell_Collection_Count < 2) {
				return;
			}
			if ( (aeCell_Collection[1].childNodes.length > 0)
				&& (aeCell_Collection[1].firstChild.nodeType == 3)
				&& (aeCell_Collection[1].firstChild.nodeValue == this.m_sActive_Filter) ) {
				if ( (aeCell_Collection[2].childNodes.length > 0)
					&& (aeCell_Collection[2].firstChild.nodeType == 3) ) {
					aeCell_Collection[2].firstChild.nodeValue = this.format_filter_field_values(this.m_sActive_Filter);
				}
				break;
			}
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
/*
Datafilter_Table.prototype.field_filtering_selection = function(a_eActive_Element)
{
	var eActivated_Row = find_parent_element(a_eActive_Element, 'tr');
	if (is_null(eActivated_Row)) {
		return;
	}

	var nField_Index = eActivated_Row.name;
//	if (nField_Index ...) {
//	}

	if (a_eActive_Element.checked == true) {
		this.m_afField_Display_State[nField_Index] |= fFilter_Flag;
	}
	else {
		this.m_afField_Display_State[nField_Index] &= fUnfilter_Mask;
	}
}
*/

/**
 *  Handle a table header toggle event (click).
 *
 *	@param	{element} a_eActive_Element The activated control within the table header.
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.header_toggle = function(a_eActive_Element)
{
	var nImage_Path_Index = 0;

	if ((this.m_afField_Display_State[0] & fExpand_Flag) != 0) {
		nImage_Path_Index = a_eActive_Element.src.indexOf('plus.png');
		if (nImage_Path_Index != -1) {
			a_eActive_Element.src = a_eActive_Element.src.substr(0, nImage_Path_Index) + 'minus.png';
		}
		a_eActive_Element.title = "Click to hide ranges for all fields";
		this.m_afField_Display_State[0] &= fUnexpand_Mask;
		this.extend_all_rows();
	}
	else {
		nImage_Path_Index = a_eActive_Element.src.indexOf('minus.png');
		if (nImage_Path_Index != -1) {
			a_eActive_Element.src = a_eActive_Element.src.substr(0, nImage_Path_Index) + 'plus.png';
		}
		a_eActive_Element.title = "Click to display ranges for all fields";
		this.m_afField_Display_State[0] |= fExpand_Flag;
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

Datafilter_Table.prototype.row_toggle = function(a_eActive_Element)
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

Datafilter_Table.prototype.get_activated_row_details = function(a_eActive_Element, a_asDetails_List)
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
 *  Build a hidden controls section to transfer all field filter values.
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Datafilter_Table.prototype.create_value_elements = function()
{
	var nx = 0;
	var nFilter_Set_Count = 0;

	// First ensure the local record of the state of the filter fields (the Filter Set)
	// is fully synchronised with the check-box selections in the field table display.
	// The extraction may have been initiated from the field table display.
	nFilter_Set_Count = this.sync_filters_with_field_table();

	var eHidden_Element_Section = document.getElementById(this.m_sFilter_Info_Section);
	if (!eHidden_Element_Section) {
		alert("Field filter values section '" + this.m_sFilter_Info_Section + "' no longer exists.");
		return (false);
	}

	var aeElement_Collection = eHidden_Element_Section.getElementsByTagName('input');
	var nElement_Collection_Count = aeElement_Collection.length;

	if (nElement_Collection_Count > 0) {
		for (nx=(nElement_Collection_Count - 1); nx>=0; nx--) {
			aeElement_Collection[nx].parentNode.removeChild(aeElement_Collection[nx]);
		}
	}

	if (nFilter_Set_Count == 0) {
		return (true);
	}

	var eClonable_Element = document.getElementById(this.m_sFilter_Info_Template);
	if (!eClonable_Element) {
		alert("Clonable filter value element '" + this.m_sFilter_Info_Template + "' no longer exists.");
		return (false);
	}

	var sField_Name = '';
	var nArray_Count = 0;
	var eNew_Element = null;
	var bTax_List = false;
	var nep = 0;
	for (var sField_Name in this.m_asFilter_Set) {

		if (!this.is_filter_field_displayed(sField_Name)) {
			continue;
		}

		bTax_List = false;
		switch (this.m_asFilter_Set[sField_Name][2]) {

		case ST_VALUE :		nArray_Count = 4;
							break;

		case ST_RANGE :		nArray_Count = 5;
							break;

		case ST_LIST :		if (this.m_asFilter_Set[sField_Name][3] == 0) {
								nArray_Count = 0;
							}
							else {
								nArray_Count = this.m_asFilter_Set[sField_Name][3] + 4;
							}
							break;

		case ST_TAX_LIST :	if (this.m_asFilter_Set[sField_Name][3] == 0) {
								nArray_Count = 0;
							}
							else {
								bTax_List = true;
								nArray_Count = this.m_asFilter_Set[sField_Name][3] + 4;
							}
							break;

		// No output for all others (valid and invalid).
		default :			nArray_Count = 0;

		}

		if (!bTax_List) {
			for (nx=0; nx<nArray_Count; nx++) {
				eNew_Element = this.create_hidden_element(sField_Name, this.m_asFilter_Set[sField_Name][nx],
																							eClonable_Element);
				if (!eNew_Element) {
					return (false);
				}
				eHidden_Element_Section.appendChild(eNew_Element);
			}
		}
		else {
			for (nx=0; nx<4; nx++) {
				eNew_Element = this.create_hidden_element(sField_Name, this.m_asFilter_Set[sField_Name][nx],
																							eClonable_Element);
				if (!eNew_Element) {
					return (false);
				}
				eHidden_Element_Section.appendChild(eNew_Element);
			}
			nArray_Count -= 4;
			nep = 5;
			for (nx=0; nx<nArray_Count; nx++) {
				eNew_Element = this.create_hidden_element(sField_Name, this.m_asFilter_Set[sField_Name][nep],
																							eClonable_Element);
				if (!eNew_Element) {
					return (false);
				}
				eHidden_Element_Section.appendChild(eNew_Element);
				nep++;
				nep++;
			}
		}
	}

	return (true);
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Datafilter_Table.prototype.print_state = function()
{
	return ('[Datafilter_Table]'
			+ '\nDisplay name = ' + this.m_sDisplay_Name
			+ '\nTable ID = ' + this.m_sTable_ID
			+ '\nEmpty row ID = ' + this.m_sEmpty_Row
			+ '\nRow template ID = ' + this.m_sTable_Template_Row
			+ '\nExtension row template ID = ' + this.m_sTable_Template_Ext
			+ '\nDataset name = ' + this.m_sDataset_Name);
}


/**
 *  Delete the currently displayed entries from the datafilter listing table.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.remove_datafilter_rows = function()
{
	var eDatafilter_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafilter_Listing_Table) {
		alert("Datafilter listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var aeRow_Collection = eDatafilter_Listing_Table.getElementsByTagName('tr');
	var nRow_Count = aeRow_Collection.length;

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
 *  Set up the datafilter listing table for an empty dataset filter set.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.display_empty_table = function()
{
	var eEmpty_Row = document.getElementById(this.m_sEmpty_Row);
	if (!eEmpty_Row) {
		alert("Pre-formatted empty row '" + this.m_sEmpty_Row
			  + "' for datafilter listing table '" + this.m_sTable_ID + "'  no longer exists.");
	}

	var eTable_Base = document.getElementById(this.m_sTable_Footer);
	if (!eTable_Base) {
		alert("The base row (footer) for datafilter listing table '" + this.m_sTable_ID
																+ "' no longer exists.");
		return;
	}

	var eNew_Row = eEmpty_Row.cloneNode(true);
	if (!eNew_Row) {
		alert('Failed to clone an empty datafilter listing row.');
		return;
	}

	eNew_Row.removeAttribute('id');
	eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);
}


/**
 *  Add a dataset filter set to the datafilter listing table.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.add_datafilter_rows = function()
{
	var eSet_Button = null;

	// Working from the full field list keeps the field order the same as in the field table.
	var asFull_Field_List = Array();
	(this.m_rParent_Controller).get_full_field_list(asFull_Field_List);
	var nFull_Field_Count = asFull_Field_List.length;

	var eDatafilter_Listing_Table = document.getElementById(this.m_sTable_ID);
	if (!eDatafilter_Listing_Table) {
		alert("Datafilter listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var eRow_Template = document.getElementById(this.m_sTable_Template_Row);
	if (!eRow_Template) {
		alert("Pre-formatted row '" + this.m_sTable_Template_Row
			+ "' for datafilter listing table '" + this.m_sTable_ID + "' no longer exists.");
		return;
	}

	var eTable_Base = document.getElementById(this.m_sTable_Footer);
	if (!eTable_Base) {
		alert("The base row (footer) for datafilter listing table '" + this.m_sTable_ID
																+ "' no longer exists.");
		return;
	}

	for (var nx=0; nx<nFull_Field_Count; nx++) {

		if (this.is_filter_field_displayed(asFull_Field_List[nx]) != true) {
			continue;
		}

		var eNew_Row = eRow_Template.cloneNode(true);
		if (!eNew_Row) {
			alert('Failed to clone a new datafilter listing row.');
			return;
		}

		eNew_Row.removeAttribute('id');
//		eNew_Row.name = nx + 1;

		var aeNew_Cells = eNew_Row.getElementsByTagName('td');
		eSet_Button = find_child_element(aeNew_Cells[0], 'input');
		if (eSet_Button == null) {
			return;
		}
		// Why the extra indexing ???
		// (this.m_asFilter_Set[asFull_Field_List[nx]][0] == asFull_Field_List[nx])
		eSet_Button.name = this.m_asFilter_Set[asFull_Field_List[nx]][0];
		add_event(eSet_Button, 'click', set_button_click, false);
		aeNew_Cells[1].firstChild.nodeValue = this.m_asFilter_Set[asFull_Field_List[nx]][0];
		aeNew_Cells[2].firstChild.nodeValue = this.format_filter_field_values(asFull_Field_List[nx]);

		eTable_Base.parentNode.insertBefore(eNew_Row, eTable_Base);
	}
}


/**
 *  Reset/initialise the status entry for a filter field.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.reset_filter_status = function(a_sField_Name)
{
	this.m_asFilter_Set[a_sField_Name] = Array(a_sField_Name, false, 0, 0, 0);
}


/**
 *  Clear/delete the status entry for a filter field.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Table.prototype.clear_filter_status = function(a_sField_Name)
{
	this.m_asFilter_Set[a_sField_Name] = null;
}


/**
 *  Is the named field already displayed in the filter table.
 *
 *	@private
 *
 *  @return	True if field is already set up in the table, otherwise false.
 *  @type	boolean
 */

Datafilter_Table.prototype.is_filter_field_displayed = function(a_sField_Name)
{
	if (is_undefined(this.m_asFilter_Set[a_sField_Name])
		|| is_null(this.m_asFilter_Set[a_sField_Name])) {
		return (false);
	}

	if (is_array(this.m_asFilter_Set[a_sField_Name])
		&& ((this.m_asFilter_Set[a_sField_Name]).length >= 5)) {
		return (true);
	}

	return (false);
}


/**
 *  Return a formatted string displaying the currently selected filter values for a field.
 *
 *	@private
 *
 *	@return	The fully formatted filter values for display, or single-space if no values found.
 *  @type	string
 */

Datafilter_Table.prototype.format_filter_field_values = function(a_sField_Name)
{
	if (is_undefined(this.m_asFilter_Set[a_sField_Name])
		|| is_null(this.m_asFilter_Set[a_sField_Name])) {
		alert('No status entry found for filter field \'' + a_sField_Name + '\'');
		return (' ');
	}

	if (is_array(this.m_asFilter_Set[a_sField_Name])
		&& ((this.m_asFilter_Set[a_sField_Name]).length >= 5)) {

		switch (this.m_asFilter_Set[a_sField_Name][2]) {

		case ST_NONE :		return ' ';

		case ST_VALUE :		return ('value-of: ' + this.m_asFilter_Set[a_sField_Name][3]);

		case ST_RANGE :		return ('range-of: ' + this.m_asFilter_Set[a_sField_Name][3]
										+ ' to ' + this.m_asFilter_Set[a_sField_Name][4]);

		case ST_LIST :		if (this.m_asFilter_Set[a_sField_Name][3] == 0) {
								return ' ';
							}

							return ('in-list: ' + (this.m_asFilter_Set[a_sField_Name].slice(4, (this.m_asFilter_Set[a_sField_Name][3] + 4))).join(', '));

		case ST_TAX_LIST :	var nActual_Value_Count = this.m_asFilter_Set[a_sField_Name][3];
							if (nActual_Value_Count == 0) {
								return ' ';
							}

							var nep = 0;
							var asCode_Free_List = Array();
							for (var nx=0; nx<nActual_Value_Count; nx++) {
								asCode_Free_List[nx] = this.m_asFilter_Set[a_sField_Name][nep + 4];
								nep++;
								nep++
							}

							return ('in-list: ' + asCode_Free_List.join(', '));

		// Reset the status if unknown type found.
		default :			this.reset_filter_status(a_sField_Name);
							return ' ';

		}
	}

	return (' ');
}


/**
 *  Create and configure a hidden filter value element.
 *
 *	@private
 *	@param	{string} a_sField_Name The data field name - used to construct the .name attribute for the element.
 *	@param	{string} a_sFilter_Value The filter value to be transmitted via the .value attribute for the element.
 *	@param	{string} a_eClonable_Element The dedicated clonable <input> element. Passed as an
 *						argument by the caller to prevent a new search for it on every call.
 *						Also enables an earlier and tidier halt if the element has been lost.
 *
 *  @return	The created element if successful, otherwise null.
 *  @type	DOM-object
 */

Datafilter_Table.prototype.create_hidden_element = function(a_sField_Name, a_sFilter_Value, a_eClonable_Element)
{
	var sField_Name = '';
	var eNew_Element = a_eClonable_Element.cloneNode(true);
	if (!eNew_Element) {
		alert('Failed to clone a filter value element.');
		return (null);
	}

	eNew_Element.removeAttribute('id');
	eNew_Element.name = 'filter_' + a_sField_Name.toLowerCase() + '[]';
	eNew_Element.value = a_sFilter_Value;

	return (eNew_Element);
}


/**
 *  Return a list of the field names that have their filter checkbox selected.
 *
 *	@param	{array} a_asName_List An empty array to receive the list of field names
 *
 *  @return	An associative array indexed by the retrieved names with all valid element values set to 'true'.
 *  @type	array
 */

Datafilter_Table.prototype.get_filter_field_names = function()
{
	var rField_Display = (this.m_rParent_Controller).get_datafield_display();
	rField_Display.get_filter_field_names(this.m_asChecked_Set);
}


/**
 *	Synchronise the Filter Set with the field table filter check-box selections.
 *	The Filter Set is the local record, and state, of the selected filter fields.
 *	For now treat the field table selections as the master/definitive record.
 *
 *	@private
 *
 *	@return	The resulting field count for the new Filter Set.
 *	@type	integer
 */

Datafilter_Table.prototype.sync_filters_with_field_table = function()
{
	var asFull_Field_List = Array();
	var nFilter_Set_Count = 0;

	// Result into m_asChecked_Set which will be later be updated by the datafilter_mapper.
	this.get_filter_field_names();

	(this.m_rParent_Controller).get_full_field_list(asFull_Field_List);
	nFull_Field_List_Length = asFull_Field_List.length;
	for (var nx=0; nx<nFull_Field_List_Length; nx++) {
		if (this.m_asChecked_Set[asFull_Field_List[nx]] != true) {
			if (this.is_filter_field_displayed(asFull_Field_List[nx]) == true) {
				// Remove field.
				this.clear_filter_status(asFull_Field_List[nx]);
			}
		}
		else {
			if (this.is_filter_field_displayed(asFull_Field_List[nx]) != true) {
				// Add field.
				this.reset_filter_status(asFull_Field_List[nx]);
			}
			nFilter_Set_Count++;
		}
	}

	return (nFilter_Set_Count);
}


/**
 *  Validate a user specified search/filter range.
 *
 *	@param	{string} a_sStart_String The start-of-range string from the displayed form.
 *	@param	{string} a_sEnd_String The end-of-range string from the displayed form.
 *
 *  @return	True if valid, otherwise false.
 *  @type	boolean
 */

Datafilter_Table.prototype.is_valid_range = function(a_sStart_String, a_sEnd_String)
{
	var sRange_Start = '';
	var sRange_End = '';
	var bValid_Range = true;
	var nField_Data_Type = (this.m_rParent_Controller).get_field_datatype(this.m_sActive_Filter);
	var sPreview_Data = (this.m_rParent_Controller).get_field_extension_data(this.m_sActive_Filter);
	var nQuery_Base_Type = (this.m_rParent_Controller).get_field_extension_type(sPreview_Data);
	var aPreview_Values = Array();

//	if ((nQuery_Base_Type == QB_ONE)		// Note single value fields aleady filtered out
//		|| (nQuery_Base_Type == QB_RANGE)) {
	if (nQuery_Base_Type == QB_RANGE) {
		aPreview_Values = (this.m_rParent_Controller).get_field_data_values(sPreview_Data);
		if ((aPreview_Values.length < 1)
			|| (aPreview_Values.length > 2)) {
			alert('Invalid field definition for ' + this.m_sActive_Filter);
			return (false);
		}
	}

	//alert('data type = ' + format_data_type_code(nField_Data_Type)
	//	  + '\nquery-base type = ' + format_query_base_code(nQuery_Base_Type)
	//	  + '\npreview values = ' + aPreview_Values
	//	  + '\nfull preview string = ' + sPreview_Data);

	switch (nField_Data_Type) {
/*
	case DT_INTEGER:
				//alert('Field ' + this.m_sActive_Filter + ' is an INTEGER');
				sRange_Start = to_range_integer(a_sStart_String);
				sRange_End = to_range_integer(a_sEnd_String);
				alert(a_sStart_String + ' --> \'' + sRange_Start + '\'');
				alert(a_sEnd_String + ' --> \'' + sRange_End + '\'');
				if ((sRange_Start.length == 0)
					|| (sRange_End.length == 0)) {
					alert('Failed before range checks.');
					bValid_Range = false;
				}
				else {
					if (nQuery_Base_Type == QB_RANGE) {
						if (!this.in_numeric_range(a_sStart_String, aPreview_Values[0], aPreview_Values[1])
							|| !this.in_numeric_range(a_sEnd_String, aPreview_Values[0], aPreview_Values[1])
							|| !this.isa_numeric_range(a_sStart_String, a_sEnd_String)) {
							bValid_Range = false;
						}
					}
				}
				break;

	case DT_DECIMAL:
				//alert('Field ' + this.m_sActive_Filter + ' is a DECIMAL');
				// Allow an integer to be returned as a valid decimal.
				if (isNaN(a_sStart_String)
					|| isNaN(a_sEnd_String)) {
					bValid_Range = false;
				}
				else {
					if (nQuery_Base_Type == QB_RANGE) {
						if (!this.in_numeric_range(a_sStart_String, aPreview_Values[0], aPreview_Values[1])
							|| !this.in_numeric_range(a_sEnd_String, aPreview_Values[0], aPreview_Values[1])
							|| !this.isa_numeric_range(a_sStart_String, a_sEnd_String)) {
							bValid_Range = false;
						}
					}
				}
				break;
*/
	// Note the numeric types used to specify the range
	// don't have to be the same as the data type.
	case DT_INTEGER:
	case DT_DECIMAL:
				//alert('Field ' + this.m_sActive_Filter + ' is an NUMBER (INTEGER or DECIMAL)');
				if (!this.is_valid_number(a_sStart_String)
					|| !this.is_valid_number(a_sEnd_String)) {
					bValid_Range = false;
				}
				else {
					if (nQuery_Base_Type == QB_RANGE) {
						if ((Number(a_sStart_String) > Number(a_sEnd_String))
							|| (Number(a_sStart_String) > Number(aPreview_Values[1]))
							|| (Number(aPreview_Values[0]) > Number(a_sEnd_String))) {
							bValid_Range = false;
						}
					}
				}
				break;

	case DT_DATE:
				//alert('Field ' + this.m_sActive_Filter + ' is a DATE');
				if (!is_valid_date(a_sStart_String)
					|| !is_valid_date(a_sEnd_String)) {
					bValid_Range = false;
				}
				else {
					if (nQuery_Base_Type == QB_RANGE) {
						if (this.is_later_than(a_sStart_String, a_sEnd_String)
							|| this.is_later_than(a_sStart_String, aPreview_Values[1])
							|| this.is_later_than(aPreview_Values[0], a_sEnd_String)) {
							bValid_Range = false;
						}
					}
				}
				break;

				// No checking performed for other types, so return true.
	default:    break;

	}

	return (bValid_Range);
}


/**
 *  Validate a user specified search/filter value.
 *
 *	@param	{string} a_sInput_String The input string from the displayed form.
 *
 *  @return	True if valid, otherwise false.
 *  @type	boolean
 */

Datafilter_Table.prototype.is_valid_value = function(a_sInput_String)
{
	var bValid_String = true;
	var nField_Data_Type = (this.m_rParent_Controller).get_field_datatype(this.m_sActive_Filter);
	var sPreview_Data = (this.m_rParent_Controller).get_field_extension_data(this.m_sActive_Filter);
	var nQuery_Base_Type = (this.m_rParent_Controller).get_field_extension_type(sPreview_Data);
	var aPreview_Values = Array();

	if ((nQuery_Base_Type == QB_ONE)
		|| (nQuery_Base_Type == QB_RANGE)) {
		aPreview_Values = (this.m_rParent_Controller).get_field_data_values(sPreview_Data);
		if ((aPreview_Values.length < 1)
			|| (aPreview_Values.length > 2)) {
			alert('Invalid field definition for ' + this.m_sActive_Filter);
			return (false);
		}
	}

	//alert('data type = ' + nField_Data_Type
	//	  + '\nquery-base type = ' + nQuery_Base_Type
	//	  + '\npreview values = ' + aPreview_Values
	//	  + '\nfull preview string = ' + sPreview_Data);

	switch (nField_Data_Type) {

	case DT_INTEGER:
				//alert('Field ' + this.m_sActive_Filter + ' is an INTEGER');
				if (isNaN(a_sInput_String)
					|| (a_sInput_String.indexOf('.') != -1)) {
					bValid_String = false;
				}
				else {
					if (nQuery_Base_Type == QB_RANGE) {
						bValid_String = this.in_numeric_range(a_sInput_String, aPreview_Values[0], aPreview_Values[1]);
					}
				}
				break;

	case DT_DECIMAL:
				//alert('Field ' + this.m_sActive_Filter + ' is a DECIMAL');
				// Allow an integer to be returned as a valid decimal.
				if (isNaN(a_sInput_String)) {
					bValid_String = false;
				}
				else {
					if (nQuery_Base_Type == QB_RANGE) {
						bValid_String = this.in_numeric_range(a_sInput_String, aPreview_Values[0], aPreview_Values[1]);
					}
				}
				break;

	case DT_DATE:
				//alert('Field ' + this.m_sActive_Filter + ' is a DATE');
				if (!is_valid_date(a_sInput_String)) {
					bValid_String = false;
				}
				else {
					if (nQuery_Base_Type == QB_RANGE) {
						bValid_String = this.in_date_range(a_sInput_String, aPreview_Values[0], aPreview_Values[1]);
					}
				}
				break;

				// No checking performed for other types, so return true.
	default:    break;

	}

	return (bValid_String);
}


/**
 *	Check the validity of a numeric string.
 *
 *	@param	{string} a_sNumeric_String The formatted date string to be validated.
 *
 *	@return	True for numeric string, otherwise false.
 *	@type	boolean
 */

Datafilter_Table.prototype.is_valid_number = function(a_sNumeric_String)
{
	// isNaN() returns false for null and empty string
	// so check for these values before calling it.
	if (is_undefined(a_sNumeric_String)
		|| is_null(a_sNumeric_String)
		|| !is_string(a_sNumeric_String)
		|| (a_sNumeric_String.length == 0)
		|| isNaN(a_sNumeric_String)) {
		return (false);
	}

	return (true);
}


/**
 *  Check a numeric field search/filter value is within the range of field values.
 *	(NB the input has already been validated as the correct type/format).
 *
 *	@param	{string} a_sInput_String The input string from the displayed form.
 *	@param	{string} a_sField_Minimum The minimum value for the search/filter field.
 *	@param	{string} a_sField_Maximum The maximum value for the search/filter field.
 *
 *  @return	True if valid, otherwise false.
 *  @type	boolean
 */

Datafilter_Table.prototype.in_numeric_range = function(a_sInput_String, a_sField_Minimum, a_sField_Maximum)
{
	if (parseFloat(a_sInput_String) < parseFloat(a_sField_Minimum)) {
		return (false);
	}

	if (parseFloat(a_sInput_String) > parseFloat(a_sField_Maximum)) {
		return (false);
	}

	return (true);
}


/**
 *  Check a numeric field search/filter range has appropriate min and max values.
 *	(NB the input has already been validated as the correct type/format).
 *
 *	@param	{string} a_sStart_String The input string for the minimum value from the displayed form.
 *	@param	{string} a_sEnd_String The input string for the maximum value from the displayed form.
 *
 *  @return	True if valid, otherwise false.
 *  @type	boolean
 */
/*
Datafilter_Table.prototype.isa_numeric_range = function(a_sStart_String, a_sEnd_String)
{
	if (parseFloat(a_sEnd_String) < parseFloat(a_sStart_String)) {
		return (false);
	}

	return (true);
}
*/

/**
 *  Check a date field search/filter value is within the range of field dates.
 *	(NB the input has already been validated as the correct type/format).
 *
 *	@param	{string} a_sInput_String The input string from the displayed form.
 *	@param	{string} a_sField_Minimum The minimum date for the search/filter field.
 *	@param	{string} a_sField_Maximum The maximum date for the search/filter field.
 *
 *  @return	True if valid, otherwise false.
 *  @type	boolean
 */

Datafilter_Table.prototype.in_date_range = function(a_sInput_String, a_sField_Minimum, a_sField_Maximum)
{
	var asInput_String_Parts = a_sInput_String.split("/");
	var asField_Minimum_Parts = a_sField_Minimum.split("/");
	var asField_Maximum_Parts = a_sField_Maximum.split("/");

	var Input_Date = new Date(asInput_String_Parts[2], (asInput_String_Parts[1] - 1), asInput_String_Parts[0], 0, 0, 0);
	var Minimum_Date = new Date(asField_Minimum_Parts[2], (asField_Minimum_Parts[1] - 1), asField_Minimum_Parts[0], 0, 0, 0);
	var Maximum_Date = new Date(asField_Maximum_Parts[2], (asField_Maximum_Parts[1] - 1), asField_Maximum_Parts[0], 0, 0, 0);

	//alert('in_range: ' + Input_Date.getTime() + ' < ' + Minimum_Date.getTime() + ' ?');
	if (Input_Date.getTime() < Minimum_Date.getTime()) {
		return (false);
	}

	//alert('in_range: ' + Maximum_Date.getTime() + ' < ' + Input_Date.getTime() + ' ?');
	if (Maximum_Date.getTime() < Input_Date.getTime()) {
		return (false);
	}

	return (true);
}


/**
 *  Check if the first argument is a later date than the second argument.
 *	(NB the input has already been validated as the correct type/format).
 *
 *	@param	{string} a_sStart_String The date string for the lower/earlier value.
 *	@param	{string} a_sEnd_String The date string for the higher/later value.
 *
 *  @return	True if later, otherwise false (also false if both are the same date).
 *  @type	boolean
 */

Datafilter_Table.prototype.is_later_than = function(a_sStart_String, a_sEnd_String)
{
	var asStart_String_Parts = a_sStart_String.split("/");
	var asEnd_String_Parts = a_sEnd_String.split("/");

	var Start_Date = new Date(asStart_String_Parts[2], (asStart_String_Parts[1] - 1), asStart_String_Parts[0], 0, 0, 0);
	var End_Date = new Date(asEnd_String_Parts[2], (asEnd_String_Parts[1] - 1), asEnd_String_Parts[0], 0, 0, 0);

	//alert('is_later_than: ' + Start_Date.getTime() + ' > ' + End_Date.getTime() 
	//							+ ' = ' + (Start_Date.getTime() > End_Date.getTime()));
	if (Start_Date.getTime() > End_Date.getTime()) {
		return (true);
	}

	return (false);
}


/**
 *	Return an integer string for both true integer strings and integer-equivalent decimal strings.
 *
 *	@param	{string} a_sNumeric_String The numeric string to be validated.
 *
 *	@return	The same or an equivalent integer string, otherwise the empty string.
 *	@type	string
 */
/*
function to_range_integer(a_sNumeric_String)
{
	var sFailure_Value = '';
	var sResult_String = '';
	var sRemainder_String = '';
	var sTemp_String = '';
	var nFirst_Index = 0;

	// Note the last test will also fail multiple decimal points.
	if (is_undefined(a_sNumeric_String)
		|| is_null(a_sNumeric_String)
		|| !is_string(a_sNumeric_String)
		|| isNaN(a_sNumeric_String)) {
		return (sFailure_Value);
	}

	// Return the original string if it's a true integer.
	nFirst_Index = a_sNumeric_String.indexOf('.');
	if (nFirst_Index == -1) {
		return (a_sNumeric_String);
	}

	// Isolate the integer part of a decimal string
	// then strip leading zeros (unless string = '0').
	sTemp_String = a_sNumeric_String.substring(0, nFirst_Index);
	sResult_String = strip_leading_zeros(sTemp_String);
	if (sResult_String.length == 0) {
		sResult_String = '0';
	}
	alert('sResult_String = \'' + sResult_String + '\'');

	// Now confirm the decimal string is a whole number.
	// If so then return the equivalent true integer string.
	sTemp_String = a_sNumeric_String.substr(nFirst_Index + 1);
	sRemainder_String = strip_trailing_zeros(sTemp_String);
	if (sRemainder_String.length > 0) {
		return (sFailure_Value);
	}

	return (sResult_String);
}
*/

/* -+- */


