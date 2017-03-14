/**
 *  @fileoverview The class Extract_Display is the display handler for all extraction ordering displays.
 *
 *	@version 0.0.11  [5.1.2007]
 *	@version 0.0.13  [4.5.2007]
 *	@version 0.0.15  [15.5.2007]
 */


//--------------------------------------------------------------------------------------------------
//
// Status flags and masks.

// Table: Index fields are displayed as the default row sort order.
// Set:   --
var fShowindex_Flag = 1;
var fUnshowindex_Mask = (-1) ^ fShowindex_Flag;

// Table: Show all column help rows (0 = collapse all column help rows).
//			Co-ordinates the state of the 'show/hide' column help button.
// Set:   --
var fShowhelpx_Flag = 2;
var fUnshowhelpx_Mask = (-1) ^ fShowhelpx_Flag;

//--------------------------------------------------------------------------------------------------
//
// Return value for search failure.
var NOT_FOUND = -1;
//
// Sort-Order Set n-tuple field indexes.
var SO_FIELD_NAME = 0;
var SO_SORT_STATUS = 1;
var SO_TABLE_INDEX = 2;
var SO_SORT_OFFSET = 3;

//--------------------------------------------------------------------------------------------------


/**
 *	The dedicated sort function for sorting the Sort-Order Set to match the field table order.
 *
 *	@private
 *
 *	@return	A positive/zero/negative integer for argument 1 greater-than/equal-to/less-than argument 2.
 *	@type	integer
 */

function sort_by_table_order(a_aFirst_Tuple, a_aSecond_Tuple)
{
	return (a_aFirst_Tuple[SO_TABLE_INDEX] - a_aSecond_Tuple[SO_TABLE_INDEX]);
}


/**
 *	The dedicated sort function for sorting the Sort-Order Set by its sort-order offset field.
 *
 *	@private
 *
 *	@return	A positive/zero/negative integer for argument 1 greater-than/equal-to/less-than argument 2.
 *	@type	integer
 */

function sort_by_sort_order(a_aFirst_Tuple, a_aSecond_Tuple)
{
	return (a_aFirst_Tuple[SO_SORT_OFFSET] - a_aSecond_Tuple[SO_SORT_OFFSET]);
}


//--------------------------------------------------------------------------------------------------


/**
 *	Constructor for the Extract_Display class.
 *	@class	The class Extract_Display provides support for the selection or defaulting
 *	of the order of data field extraction. Currently it also supports authorisation for
 *	data extraction until full session support is implemented. This class requires the
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

function Extract_Display(a_sSection_Name, a_rSection_Parent)
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
	 *	The unique ID of the HTML listbox element displaying
	 *	the fields selected for extraction.
	 *	@type	string
	 */
	this.m_sSelected_Fields_List = '';

	/**
	 *	The unique ID of the HTML listbox element displaying
	 *	the selected sort order for extraction.
	 *	@type	string
	 */
	this.m_sSort_Order_List = '';

	/**
	 *	The unique ID of the HTML listbox element displaying
	 *	the default sort order for extraction.
	 *	@type	string
	 */
	this.m_sDefault_Order_List = '';

	/**
	 *	The unique identifier of the clonable option element
	 *	used for moving fields between the 'selected fields'
	 *	list and the 'sort order' list.
	 *	@type	string
	 */
	this.m_sFieldname_Option_Template = '';

	/**
	 *	The unique identifier of the hidden section used to hold all
	 *	sort-order info for transfer to the server via submit form.
	 *	@type	string
	 */
	this.m_sSort_Info_Section = '';

	/**
	 *	The unique identifier of the clonable element used to populate
	 *	the hidden section holding the sort-order info.
	 *	@type	string
	 */
	this.m_sSort_Info_Template = '';

	/**
	 *	The updated list of fields currently checked for extraction.
	 *	@type	array
	 */
	this.m_asChecked_Set = Array();

	/**
	 *	The status of fields displayed for sort-order selection.
	 *	@type	array
	 *
	 *	An ordered/numeric array of n-tuples retaining the field ordering of the field display table.
	 *	Each array element is itself a simple numeric array formatted as below:
	 *
	 *	Array( fieldname, sort_list_status { 0 | 1 },
	 *							field_table_index [0..n],
	 *                          	sort_order_list_position { 0 | [1..n] }
	 *	);
	 */
	this.m_asSort_Order_Set = Array();

	/**
	 *	A record of the display state for the panel.
	 *	@type	array
	 */
	this.m_afExtract_Display_State = Array();
//	this.reset_display_status(0);
	this.m_afExtract_Display_State[0] = 0;
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

Extract_Display.prototype.set_element_names = function(a_sSection_Element, a_asElement_List)
{
	var nx = 0;

	if (!document.getElementById(a_sSection_Element)) {
		alert("Display '" + this.m_sDisplay_Name + "' section element '" + a_sSection_Element + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 6;

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
	this.m_sSelected_Fields_List = a_asElement_List[0];
	this.m_sSort_Order_List = a_asElement_List[1];
	this.m_sDefault_Order_List = a_asElement_List[2];
	this.m_sFieldname_Option_Template = a_asElement_List[3];
	this.m_sSort_Info_Section = a_asElement_List[4];
	this.m_sSort_Info_Template = a_asElement_List[5];

	return (true);
}


/**
 *	Hide the display.
 *
 *	@return	none
 *	@type	void
 */

Extract_Display.prototype.hide_display = function()
{
/*	var sDataset_Name = this.m_rParent_Controller.m_sDisplay_Name;
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
*/
	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}
	eDisplay_Element.className = 'hidden';
}


/**
 *	Show the display, re-displaying the sort-order field set listing.
 *
 *	@return	none
 *	@type	void
 */

Extract_Display.prototype.show_display = function()
{
	//var sDataset_Filter_Set = Array();
	//sDataset_Filter_Set = (this.m_rParent_Controller).get_dataset_filter_set();

	//var sDataset_Name = this.m_rParent_Controller.m_sDisplay_Name;
	//alert('Showing \'' + sDataset_Name + '\' filter fields');

	var eDisplay_Element = document.getElementById(this.m_sSection_Element);
	if (!eDisplay_Element) {
		alert("Display section element '" + this.m_sSection_Element + "' no longer exists.");
		return;
	}

	this.delete_all_listbox_entries();

	// Only display the panel after the old listbox fields have been removed.
	eDisplay_Element.className = '';

	if ((this.m_rParent_Controller).get_dataset_field_count() > 0) {
        this.sync_sortlist_with_field_table();
        this.compact_sortlist_entries();
        this.resequence_sortorder_entries();

        //this.delete_all_listbox_entries();

        // Only display the panel after the old listbox fields have been removed.
        //eDisplay_Element.className = '';

        this.setup_all_listbox_entries();
	}
}


/**
 *  Handle the 'add sort field' button to support the construction of the sort-order list.
 *
 *  @return	none
 *  @type	void
 */
/*
Extract_Display.prototype.add_sort_field = function()
{
	var eSelected_Fields_List = document.getElementById(this.m_sSelected_Fields_List);
	if (!eSelected_Fields_List) {
		alert("selected fields list '" + this.m_sSelected_Fields_List + "' no longer exists.");
		return;
	}

	var eSort_Order_List = document.getElementById(this.m_sSort_Order_List);
	if (!eSort_Order_List) {
		alert("sort order list '" + this.m_sSort_Order_List + "' no longer exists.");
		return;
	}

	this.move_selected_fields(eSelected_Fields_List, eSort_Order_List);
}
*/

/**
 *  Handle the 'add sort field' button to support the construction of the sort-order list.
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.add_sort_field = function()
{
	var sField_Name = '';
	var nSet_Index = 0;
	var nx = 0;

	var eSelected_Fields_List = document.getElementById(this.m_sSelected_Fields_List);
	if (!eSelected_Fields_List) {
		alert("selected fields list '" + this.m_sSelected_Fields_List + "' no longer exists.");
		return;
	}

	var eSort_Order_List = document.getElementById(this.m_sSort_Order_List);
	if (!eSort_Order_List) {
		alert("sort order list '" + this.m_sSort_Order_List + "' no longer exists.");
		return;
	}

	// Note: using the .options collection doesn't work in IE.
	var aeSelected_Fields_Collection = eSelected_Fields_List.getElementsByTagName('option');
	var nSelected_Fields_Collection_Count = aeSelected_Fields_Collection.length;

	// Exit if list is empty - there can be no selected fields.
	if (nSelected_Fields_Collection_Count == 0) {
		return;
	}

	var anSelected_Entry_List = Array();
	var nSelected_Entry_Count = 0;
	for (nx=(nSelected_Fields_Collection_Count - 1); nx>=0; nx--) {
		if ( (aeSelected_Fields_Collection[nx].selected == true)
			&& (aeSelected_Fields_Collection[nx].childNodes.length > 0)
			&& (aeSelected_Fields_Collection[nx].firstChild.nodeType == 3) ) {
			sField_Name = aeSelected_Fields_Collection[nx].firstChild.nodeValue;
			nSet_Index = this.locate_status_entry(sField_Name);
			if (nSet_Index == NOT_FOUND) {
				alert('Status entry for listed field \'' + sField_Name + '\' not found.');
				return;
			}
			anSelected_Entry_List[nSelected_Entry_Count] = nSet_Index;
			nSelected_Entry_Count++;
			eSelected_Fields_List.removeChild(aeSelected_Fields_Collection[nx]);
		}
	}

	// Exit if no selected fields were found.
	if (nSelected_Entry_Count == 0) {
		return;
	}

	for (nx=0; nx<nSelected_Entry_Count; nx++) {
		nSet_Index = anSelected_Entry_List[nx];
		//this.log_entry('left-selected', this.m_asSort_Order_Set[nSet_Index]);
	}

	var eClonable_Field_List_Element = document.getElementById(this.m_sFieldname_Option_Template);
	if (!eClonable_Field_List_Element) {
		alert('Clonable field list element \'' + this.m_sFieldname_Option_Template + '\' no longer exists.');
		return;
	}

	// Note: using the .options collection doesn't work in IE.
	var aeSort_Order_Collection = eSort_Order_List.getElementsByTagName('option');
	var nSort_Order_Collection_Count = aeSort_Order_Collection.length;

	var eNew_List_Element = null;
	for (nx=(nSelected_Entry_Count - 1); nx>=0; nx--) {
		eNew_List_Element = eClonable_Field_List_Element.cloneNode(true);
		if (!eNew_List_Element) {
			alert('Failed to clone a new field list element.');
			return;
		}
		eNew_List_Element.removeAttribute('id');
		nSet_Index = anSelected_Entry_List[nx];
		sField_Name = this.m_asSort_Order_Set[nSet_Index][SO_FIELD_NAME];
		eNew_List_Element.firstChild.nodeValue = sField_Name;
		eNew_List_Element.value = sField_Name;
		eSort_Order_List.appendChild(eNew_List_Element);
		nSort_Order_Collection_Count++;
		this.m_asSort_Order_Set[nSet_Index][SO_SORT_STATUS] = 1;
		this.m_asSort_Order_Set[nSet_Index][SO_SORT_OFFSET] = nSort_Order_Collection_Count;
	}

//	var msg= 'add_sort_field()\n\n';
//	for (nx=0; nx<this.m_asSort_Order_Set.length; nx++) {
//		msg += this.m_asSort_Order_Set[nx] + '\n';
//	}
//	alert(msg);
}
//	Array( fieldname, field_table_position [1..n],
//						sort_field_list_position { 0 | [1..n] },
//							sort_order_list_position { 0 | [1..n] }
//	);
//	this.m_asSort_Order_Set = Array();
//var SO_FIELD_NAME = 0;
//var SO_TABLE_INDEX = 1;
//var SO_SORT_STATUS = 2;
//var SO_SORT_OFFSET = 3;


/**
 *  Handle the 'remove sort field' button to support the construction of the sort-order list.
 *
 *  @return	none
 *  @type	void
 */
/*
Extract_Display.prototype.remove_sort_field = function()
{
	var eSort_Order_List = document.getElementById(this.m_sSort_Order_List);
	if (!eSort_Order_List) {
		alert("sort order list '" + this.m_sSort_Order_List + "' no longer exists.");
		return;
	}

	var eSelected_Fields_List = document.getElementById(this.m_sSelected_Fields_List);
	if (!eSelected_Fields_List) {
		alert("selected fields list '" + this.m_sSelected_Fields_List + "' no longer exists.");
		return;
	}

	this.move_selected_fields(eSort_Order_List, eSelected_Fields_List);
}
*/

/**
 *  Handle the 'remove sort field' button to support the construction of the sort-order list.
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.remove_sort_field = function()
{
	var sField_Name = '';
	var nSet_Index = 0;
	var nx = 0;

	var eSelected_Fields_List = document.getElementById(this.m_sSelected_Fields_List);
	if (!eSelected_Fields_List) {
		alert("selected fields list '" + this.m_sSelected_Fields_List + "' no longer exists.");
		return;
	}

	var eSort_Order_List = document.getElementById(this.m_sSort_Order_List);
	if (!eSort_Order_List) {
		alert("sort order list '" + this.m_sSort_Order_List + "' no longer exists.");
		return;
	}

	// Before continuing we must ensure the sort order is reset to the field table order.
	// All sorts are performed in place so the original order could have been corrupted.
	this.m_asSort_Order_Set.sort(sort_by_table_order);

	// Note: using the .options collection doesn't work in IE.
	var aeSort_Order_Collection = eSort_Order_List.getElementsByTagName('option');
	var nSort_Order_Collection_Count = aeSort_Order_Collection.length;

	// Exit if list is empty - there can be no selected fields.
	if (nSort_Order_Collection_Count == 0) {
		return;
	}

	var anSelected_Entry_List = Array();
	var nSelected_Entry_Count = 0;
	for (nx=(nSort_Order_Collection_Count - 1); nx>=0; nx--) {
		if ( (aeSort_Order_Collection[nx].selected == true)
			&& (aeSort_Order_Collection[nx].childNodes.length > 0)
			&& (aeSort_Order_Collection[nx].firstChild.nodeType == 3) ) {
			sField_Name = aeSort_Order_Collection[nx].firstChild.nodeValue;
			nSet_Index = this.locate_status_entry(sField_Name);
			if (nSet_Index == NOT_FOUND) {
				alert('Status entry for listed field \'' + sField_Name + '\' not found.');
				return;
			}
			anSelected_Entry_List[nSelected_Entry_Count] = nSet_Index;
			nSelected_Entry_Count++;
			eSort_Order_List.removeChild(aeSort_Order_Collection[nx]);
		}
	}

	// Exit if no selected fields were found.
	if (nSelected_Entry_Count == 0) {
		return;
	}

	for (nx=0; nx<nSelected_Entry_Count; nx++) {
		nSet_Index = anSelected_Entry_List[nx];
		//this.log_entry('right-selected', this.m_asSort_Order_Set[nSet_Index]);
	}

	var eClonable_Field_List_Element = document.getElementById(this.m_sFieldname_Option_Template);
	if (!eClonable_Field_List_Element) {
		alert('Clonable field list element \'' + this.m_sFieldname_Option_Template + '\' no longer exists.');
		return;
	}

	// Note: using the .options collection doesn't work in IE.
	var aeSelected_Fields_Collection = eSelected_Fields_List.getElementsByTagName('option');
	var nSelected_Fields_Collection_Count = aeSelected_Fields_Collection.length;

	var eNew_List_Element = null;
	var nSort_Order_Set_Length = this.m_asSort_Order_Set.length;
	var np = 0;
	for (nx=(nSelected_Entry_Count - 1); nx>=0; nx--) {
		eNew_List_Element = eClonable_Field_List_Element.cloneNode(true);
		if (!eNew_List_Element) {
			alert('Failed to clone a new field list element.');
			return;
		}
		eNew_List_Element.removeAttribute('id');
		nSet_Index = anSelected_Entry_List[nx];
		sField_Name = this.m_asSort_Order_Set[nSet_Index][SO_FIELD_NAME];
		eNew_List_Element.firstChild.nodeValue = sField_Name;
		eNew_List_Element.value = sField_Name;
		if (nSelected_Fields_Collection_Count == 0) {
            eSelected_Fields_List.appendChild(eNew_List_Element);
		}
		else {
			np = 0;
			for (var nx2=0; nx2<nSort_Order_Set_Length; nx2++) {
				if (this.m_asSort_Order_Set[nx2][SO_SORT_STATUS] == 0) {
					if (this.m_asSort_Order_Set[nx2][SO_TABLE_INDEX] > this.m_asSort_Order_Set[nSet_Index][SO_TABLE_INDEX]) {
                        break;
					}
					np++;
				}
			}
			if (np >= nSelected_Fields_Collection_Count) {
				eSelected_Fields_List.appendChild(eNew_List_Element);
			}
			else {
				aeSelected_Fields_Collection = eSelected_Fields_List.getElementsByTagName('option');
				//nSelected_Fields_Collection_Count = aeSelected_Fields_Collection.length;
				eSelected_Fields_List.insertBefore(eNew_List_Element, aeSelected_Fields_Collection[np]);
			}
		}
		nSelected_Fields_Collection_Count++;
		this.m_asSort_Order_Set[nSet_Index][SO_SORT_STATUS] = 0;
		this.m_asSort_Order_Set[nSet_Index][SO_SORT_OFFSET] = 0;
	}


//	var msg= 'remove_sort_field()\n\n';
//	for (nx=0; nx<this.m_asSort_Order_Set.length; nx++) {
//		msg += this.m_asSort_Order_Set[nx] + '\n';
//	}
//	alert(msg);

	this.resequence_sortorder_entries();


//	msg= 'remove_sort_field() resequenced\n\n';
//	for (nx=0; nx<this.m_asSort_Order_Set.length; nx++) {
//		msg += this.m_asSort_Order_Set[nx] + '\n';
//	}
//	alert(msg);
}
//	Array( fieldname, field_table_position [1..n],
//						sort_field_list_position { 0 | [1..n] },
//							sort_order_list_position { 0 | [1..n] }
//	);
//	this.m_asSort_Order_Set = Array();
//var SO_FIELD_NAME = 0;
//var SO_TABLE_INDEX = 1;
//var SO_SORT_STATUS = 2;
//var SO_SORT_OFFSET = 3;


/**
 *  Handle the 'accept' button for a datafilter list selection.
 *	Better to have some extra IDs than do so much work here !!!
 *
 *	@param	{element} a_eActive_Element The activated list selection 'accept' button.
 *
 *  @return	none
 *  @type	void
 */
/*
Extract_Display.prototype.list_value_selection = function(a_eActive_Element)
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
*/

/**
 *  Build a hidden controls section to transfer all sort-order field names.
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Extract_Display.prototype.create_sort_elements = function()
{
	var nx = 0;

	// The local record of the fields selected for extraction is guaranteed to be already
	// fully synchronised with the check-box selections in the field table display because
	// this synchronisation is performed whenever the extract display panel is selected.

	// Locate the hidden sort-order section.
	var eHidden_Element_Section = document.getElementById(this.m_sSort_Info_Section);
	if (!eHidden_Element_Section) {
		alert("Sort order field names section '" + this.m_sSort_Info_Section + "' no longer exists.");
		return (false);
	}

	// Ensure the hidden sort-order section is empty.
	var aeElement_Collection = eHidden_Element_Section.getElementsByTagName('input');
	var nElement_Collection_Count = aeElement_Collection.length;

	if (nElement_Collection_Count > 0) {
		for (nx=(nElement_Collection_Count - 1); nx>=0; nx--) {
			aeElement_Collection[nx].parentNode.removeChild(aeElement_Collection[nx]);
		}
	}

	// Locate the sort-order listbox.
	var eSort_Order_List = document.getElementById(this.m_sSort_Order_List);
	if (!eSort_Order_List) {
		alert("sort order listbox '" + this.m_sSort_Order_List + "' no longer exists.");
		return (false);
	}

	// Has a sort-order been specified?
	// (Note: using the .options collection doesn't work in IE).
	var aeSort_Order_Collection = eSort_Order_List.getElementsByTagName('option');
	var nSort_Order_Collection_Count = aeSort_Order_Collection.length;
	if (nSort_Order_Collection_Count == 0) {
		return (true);
	}

	// Locate the clonable element used to populate the hidden sort-order section.
	var eClonable_Element = document.getElementById(this.m_sSort_Info_Template);
	if (!eClonable_Element) {
		alert("Clonable sort order element '" + this.m_sSort_Info_Template + "' no longer exists.");
		return (false);
	}

	var sField_Name = '';
	var eNew_Element = null;
	for (nx=0; nx<nSort_Order_Collection_Count; nx++) {
		if ( (aeSort_Order_Collection[nx].childNodes.length > 0)
			&& (aeSort_Order_Collection[nx].firstChild.nodeType == 3) ) {
			sField_Name = aeSort_Order_Collection[nx].firstChild.nodeValue;
			eNew_Element = this.create_hidden_element(sField_Name, eClonable_Element);
			if (is_null(eNew_Element)) {
				return (false);
			}
			eHidden_Element_Section.appendChild(eNew_Element);
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

Extract_Display.prototype.print_state = function()
{
	return ('[Extract_Display]'
			+ '\nDisplay name = ' + this.m_sDisplay_Name
			+ '\nSection element = ' + this.m_sSection_Element);
}


/**
 *  Append a new entry to the sort-order status list.
 *
 *	@private
 *	@param	{string} a_sField_Name The field name.
 *	@param	{integer} a_nField_Index The index of the field position in the field table [0..n].
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.append_sort_status = function(a_sField_Name, a_nField_Index)
{
	this.m_asSort_Order_Set[this.m_asSort_Order_Set.length] = Array(a_sField_Name, 0, a_nField_Index, 0);
	//this.log_entry('append', this.m_asSort_Order_Set[this.m_asSort_Order_Set.length - 1]);
}


/**
 *  Remove the sort-order status entry for a field.
 *	The array element is wiped (to null) not deleted from the array.
 *
 *	@private
 *	@param	{integer} a_nField_Index The index of the field entry in the sortlist [0..n].
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.remove_sort_status = function(a_nField_Index)
{
	//this.log_entry('remove', this.m_asSort_Order_Set[a_nField_Index]);
	this.m_asSort_Order_Set[a_nField_Index] = null;
}


/**
 *  Is the named field already displayed in the sort-order listboxes.
 *
 *	@private
 *
 *  @return	Index of field n-tuple in the sort-order set [0..n], otherwise NOT_FOUND.
 *  @type	integer
 */

Extract_Display.prototype.locate_status_entry = function(a_sField_Name)
{
	var nSort_Order_Set_Length = this.m_asSort_Order_Set.length;

	for (var nx=0; nx<nSort_Order_Set_Length; nx++) {
		if (is_array(this.m_asSort_Order_Set[nx])
			&& (this.m_asSort_Order_Set[nx][SO_FIELD_NAME] == a_sField_Name)) {
			return (nx);
		}
	}

	return (NOT_FOUND);
}


/**
 *  Is the named field already displayed in the sort-order listboxes.
 *
 *	@private
 *
 *  @return	Index of field n-tuple in the sort-order set [0..n], otherwise NOT_FOUND.
 *  @type	integer
 */

Extract_Display.prototype.is_sort_field_displayed = function(a_sField_Name)
{
	var nSort_Order_Set_Length = this.m_asSort_Order_Set.length;

	for (var nx=0; nx<nSort_Order_Set_Length; nx++) {
		if (is_array(this.m_asSort_Order_Set[nx])
			&& (this.m_asSort_Order_Set[nx][SO_FIELD_NAME] == a_sField_Name)) {
			return (nx);
		}
	}

	return (NOT_FOUND);
}


/**
 *  Return a list of the field names that have their extract checkbox selected.
 *
 *	@param	{array} a_asName_List An empty array to receive the list of field names
 *
 *  @return	An associative array indexed by the retrieved names with all valid element values set to 'true'.
 *  @type	array
 */

Extract_Display.prototype.get_extract_field_names = function()
{
	var rField_Display = (this.m_rParent_Controller).get_datafield_display();
	rField_Display.get_extract_field_names(this.m_asChecked_Set);
}


/**
 *	Synchronise the Sort-Order Set with the field table extract check-box selections.
 *	The Sort-Order Set is the local record, and state, of the selected extract fields.
 *	For now treat the field table selections as the master/definitive record.
 *
 *	@private
 *
 *	@return	none
 *	@type	void
 */

Extract_Display.prototype.sync_sortlist_with_field_table = function()
{
	var asFull_Field_List = Array();
	var nFull_Field_List_Length = 0;
	var sField_Name = '';
	var nSet_Index = 0;
	var nSet_Count = 0;

	// Result into m_asChecked_Set which will be later be updated by the datafilter_mapper. ???
	this.get_extract_field_names();

	(this.m_rParent_Controller).get_full_field_list(asFull_Field_List);
	nFull_Field_List_Length = asFull_Field_List.length;
	for (var nx=0; nx<nFull_Field_List_Length; nx++) {
		sField_Name = asFull_Field_List[nx];
		if (this.m_asChecked_Set[sField_Name] != true) {
			// If the field is in the sortlist remove it because it's field table entry has been unchecked.
			nSet_Index = this.is_sort_field_displayed(sField_Name);
			if (nSet_Index != NOT_FOUND) {
				// Just knock the field entry out of the list letting the final re-ordering step
				// restore all entries to form a valid list again.
				this.remove_sort_status(nSet_Index);
			}
		}
		else {
			nSet_Index = this.is_sort_field_displayed(sField_Name);
			if (nSet_Index == NOT_FOUND) {
				// Add the field entry with a simple append. Entries will be re-ordered as the final step
				// of the sortlist synchronisation to also cover the re-ordering of the field listing table.
				this.append_sort_status(sField_Name, nx);
			}
			else {
				// Already exists but the field listing table position for this field may now differ from
				// that held in the existing field element if the table has been re-ordered by the user.
				// So just update the entry's field table position ready for the final re-ordering step.
				this.m_asSort_Order_Set[nSet_Index][SO_TABLE_INDEX] = nx;
				//this.log_entry('update', this.m_asSort_Order_Set[nSet_Index]);
			}
			nSet_Count++;
		}
	}

	return;
}


/**
 *	Re-compact the entries in the Sort-Order Set to eliminate any gaps left by field removal.
 *	The Sort-Order Set is the local record, and state, of the fields selected for extraction.
 *
 *	@private
 *
 *	@return	none
 *	@type	void
 */

Extract_Display.prototype.compact_sortlist_entries = function()
{
	var nDeleted_Entry_Count = 0;
	var nSort_Order_Set_Length = this.m_asSort_Order_Set.length;

	// Immediate exit if list is empty.
	if (nSort_Order_Set_Length == 0) {
		return;
	}

	// Have there been any deletions.
	for (nx=0; nx<nSort_Order_Set_Length; nx++) {
		if (is_null(this.m_asSort_Order_Set[nx])) {
			nDeleted_Entry_Count++;
		}
	}

	// If all entries have been deleted then reset the list and exit.
	if (nDeleted_Entry_Count == nSort_Order_Set_Length) {
		this.m_asSort_Order_Set = Array();
		return;
	}

	// Process here to remove the unwanted (null) elements from the array.
	// First shuffle the list so the empty/null entries are at the end
	// and then slice the array to permanently remove them.
	var nip = 0;
	var nep = 0;
	if ((nSort_Order_Set_Length > 1)
		&& (nDeleted_Entry_Count > 0)) {
		while (!is_null(this.m_asSort_Order_Set[nep])) {
			nep++;
		}
		nip = nep;
		nep++;
		while (nep < nSort_Order_Set_Length) {
			if (!is_null(this.m_asSort_Order_Set[nep])) {
				this.m_asSort_Order_Set[nip] = this.m_asSort_Order_Set[nep];
				this.m_asSort_Order_Set[nep] = null;
				nip++;
			}
			nep++;
		}

		this.m_asSort_Order_Set = this.m_asSort_Order_Set.slice(0, (nSort_Order_Set_Length - nDeleted_Entry_Count));
	}
}


/**
 *	Re-sequence the entries selected into the sort-order list to an unbroken sequence,
 *	removing any gaps created by the removal of unselected fields. The list of fields
 *	selected from does not form an unbroken sequence and therefore is not re-sequenced
 *	(this order always shadows that of the field table listing - changed or unchanged).
 *	The Sort-Order Set is the local record, and state, of the fields selected for extraction.
 *
 *	@private
 *
 *	@return	none
 *	@type	void
 */

Extract_Display.prototype.resequence_sortorder_entries = function()
{
	var nSort_Order_Set_Length = this.m_asSort_Order_Set.length;
	var nSelected_Sort_List_Length = 0;
	var nx = 0;

	// Immediate exit if list is empty.
	if (nSort_Order_Set_Length == 0) {
		return;
	}

	// Count the fields selected to form the sort-order.
	for (nx=0; nx<nSort_Order_Set_Length; nx++) {
		if (this.m_asSort_Order_Set[nx][SO_SORT_OFFSET] > 0) {
			nSelected_Sort_List_Length++;
		}
	}

	// Exit if there are no sort-order selections yet.
	if (nSelected_Sort_List_Length == 0) {
		return;
	}

	// Before continuing we must ensure the user's selected sort order is re-established
	// in the sort order set. The set will then hold an initial block of unselected fields
	// (their select order = 0) followed by the selected sort fields in the correct order.
	// All sorts are performed in place so any existing order has now been corrupted.
	this.m_asSort_Order_Set.sort(sort_by_sort_order);
	var nTemp_Offset = nSort_Order_Set_Length - nSelected_Sort_List_Length - 1;

	for (nx=0; nx<nSort_Order_Set_Length; nx++) {
		//this.log_entry('sorted by sort offset but before resequence:', this.m_asSort_Order_Set[nx]);
	}

	for (nx=nSelected_Sort_List_Length; nx>0; nx--) {
		//this.log_entry('set sort offset to ' + nx, this.m_asSort_Order_Set[nTemp_Offset + nx]);
		this.m_asSort_Order_Set[nTemp_Offset + nx][SO_SORT_OFFSET] = nx;
	}

	for (nx=0; nx<nSort_Order_Set_Length; nx++) {
		//this.log_entry('after resequence:', this.m_asSort_Order_Set[nx]);
	}
}
//	Array( fieldname, field_table_position [1..n],
//						sort_field_list_position { 0 | [1..n] },
//							sort_order_list_position { 0 | [1..n] }
//	);
//	this.m_asSort_Order_Set = Array();
//var SO_FIELD_NAME = 0;
//var SO_TABLE_INDEX = 1;
//var SO_SORT_STATUS = 2;
//var SO_SORT_OFFSET = 3;


/**
 *  Delete all current entries from the sort-order listboxes.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.delete_all_listbox_entries = function()
{
	var eSelected_Fields_List = document.getElementById(this.m_sSelected_Fields_List);
	if (!eSelected_Fields_List) {
		alert("selected fields list '" + this.m_sSelected_Fields_List + "' no longer exists.");
		return;
	}

	// Delete any existing 'extraction' fields list.
	// (Note: using the .options collection doesn't work in IE).
	var aeSelected_Fields_Collection = eSelected_Fields_List.getElementsByTagName('option');
	var nSelected_Fields_Collection_Count = aeSelected_Fields_Collection.length;
	if (nSelected_Fields_Collection_Count > 0) {
		for (nx=(nSelected_Fields_Collection_Count - 1); nx>=0; nx--) {
			aeSelected_Fields_Collection[nx].parentNode.removeChild(aeSelected_Fields_Collection[nx]);
		}
	}

	var eSort_Order_List = document.getElementById(this.m_sSort_Order_List);
	if (!eSort_Order_List) {
		alert("sort order list '" + this.m_sSort_Order_List + "' no longer exists.");
		return;
	}

	// Delete any existing sort-order fields list.
	// (Note: using the .options collection doesn't work in IE).
	var aeSort_Order_Collection = eSort_Order_List.getElementsByTagName('option');
	var nSort_Order_Collection_Count = aeSort_Order_Collection.length;
	if (nSort_Order_Collection_Count > 0) {
		for (nx=(nSort_Order_Collection_Count - 1); nx>=0; nx--) {
			aeSort_Order_Collection[nx].parentNode.removeChild(aeSort_Order_Collection[nx]);
		}
	}

	var eDefault_Order_List = document.getElementById(this.m_sDefault_Order_List);
	if (!eDefault_Order_List) {
		alert("selected fields list '" + this.m_sDefault_Order_List + "' no longer exists.");
		return;
	}

	// Delete any existing default/index order fields list.
	// (Note: using the .options collection doesn't work in IE).
	var aeDefault_Order_Collection = eDefault_Order_List.getElementsByTagName('option');
	var nDefault_Order_Collection_Count = aeDefault_Order_Collection.length;
	if (nDefault_Order_Collection_Count > 0) {
		for (nx=(nDefault_Order_Collection_Count - 1); nx>=0; nx--) {
			aeDefault_Order_Collection[nx].parentNode.removeChild(aeDefault_Order_Collection[nx]);
		}
	}
}


/**
 *  Return all saved entries to the sort-order listboxes.
 *
 *	@private
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.setup_all_listbox_entries = function()
{
	var nSort_Order_Set_Length = this.m_asSort_Order_Set.length;
	var nSelected_Fields_List_Length = 0;
	var nSort_Order_List_Length = 0;
	var eNew_List_Element = null;
	var nx = 0;

	// Immediate exit if list is empty. NO because the default list is not processed.
//	if (nSort_Order_Set_Length == 0) {
//		return;
//	}

	var eSelected_Fields_List = document.getElementById(this.m_sSelected_Fields_List);
	if (!eSelected_Fields_List) {
		alert("selected fields list '" + this.m_sSelected_Fields_List + "' no longer exists.");
		return;
	}

	var eSort_Order_List = document.getElementById(this.m_sSort_Order_List);
	if (!eSort_Order_List) {
		alert("sort order list '" + this.m_sSort_Order_List + "' no longer exists.");
		return;
	}

	var eDefault_Order_List = document.getElementById(this.m_sDefault_Order_List);
	if (!eDefault_Order_List) {
        alert("selected fields list '" + this.m_sDefault_Order_List + "' no longer exists.");
        return;
	}

	var eClonable_Field_List_Element = document.getElementById(this.m_sFieldname_Option_Template);
	if (!eClonable_Field_List_Element) {
		alert('Clonable field list element \'' + this.m_sFieldname_Option_Template + '\' no longer exists.');
		return;
	}

	// Count the fields intended for the selected fields list and sort the fields list.
	for (nx=0; nx<nSort_Order_Set_Length; nx++) {
		if (this.m_asSort_Order_Set[nx][SO_SORT_STATUS] == 0) {
			// The fields remaining in the selected fields list.
			nSelected_Fields_List_Length++;
		}
		else {
			// The fields moved into the sort-order list.
			nSort_Order_List_Length++;
		}
	}

	// Populate the selected fields list.
	// Before continuing we must ensure the sort order is reset to the field table order.
	// All sorts are performed in place so the original order could have been corrupted.
	if (nSelected_Fields_List_Length > 0) {
		this.m_asSort_Order_Set.sort(sort_by_table_order);
		//var msg= 'Populate the selected fields list\n\n';
		//for (nx=0; nx<this.m_asSort_Order_Set.length; nx++) {
		//	msg += this.m_asSort_Order_Set[nx] + '\n';
		//}
		//alert(msg);
		for (nx=0; nx<nSort_Order_Set_Length; nx++) {
			if (this.m_asSort_Order_Set[nx][SO_SORT_STATUS] == 0) {
				//this.log_entry('left-list', this.m_asSort_Order_Set[nx]);
				eNew_List_Element = eClonable_Field_List_Element.cloneNode(true);
				if (!eNew_List_Element) {
					alert('Failed to clone a new field list element.');
					return;
				}
				eNew_List_Element.removeAttribute('id');
				eNew_List_Element.firstChild.nodeValue = this.m_asSort_Order_Set[nx][SO_FIELD_NAME];
				eNew_List_Element.value = this.m_asSort_Order_Set[nx][SO_FIELD_NAME];
				eSelected_Fields_List.appendChild(eNew_List_Element);
			}
		}
	}

	// Populate the sort-order list.
	// Before continuing we must ensure the user's selected sort order is re-established
	// in the sort order set. The set will then hold an initial block of unselected fields
	// (their sort order = 0) followed by the selected sort fields in the correct order.
	// All sorts are performed in place so any existing order has now been corrupted.
	if (nSort_Order_List_Length > 0) {
		this.m_asSort_Order_Set.sort(sort_by_sort_order);
		//msg= 'Populate the sort-order list\n\n';
		//for (nx=0; nx<this.m_asSort_Order_Set.length; nx++) {
		//	msg += this.m_asSort_Order_Set[nx] + '\n';
		//}
		//alert(msg);
		for (nx=0; nx<nSort_Order_Set_Length; nx++) {
			if (this.m_asSort_Order_Set[nx][SO_SORT_STATUS] > 0) {
				//this.log_entry('right-list', this.m_asSort_Order_Set[nx]);
				eNew_List_Element = eClonable_Field_List_Element.cloneNode(true);
				if (!eNew_List_Element) {
					alert('Failed to clone a new field list element.');
					return;
				}
				eNew_List_Element.removeAttribute('id');
				eNew_List_Element.firstChild.nodeValue = this.m_asSort_Order_Set[nx][SO_FIELD_NAME];
				eNew_List_Element.value = this.m_asSort_Order_Set[nx][SO_FIELD_NAME];
				eSort_Order_List.appendChild(eNew_List_Element);
			}
		}
	}

	// If there are index fields then display them as the default sort order.
	asDefault_Order_List = (this.m_rParent_Controller).get_fieldset_indexing_definition();
	nDefault_Order_List_Length = asDefault_Order_List.length;
	if (nDefault_Order_List_Length > 0) {
		// Populate the default/index order list.
		for (nx=0; nx<nDefault_Order_List_Length; nx++) {
			eNew_List_Element = eClonable_Field_List_Element.cloneNode(true);
			if (!eNew_List_Element) {
				alert('Failed to clone a new field list element.');
				return;
			}
			eNew_List_Element.removeAttribute('id');
			eNew_List_Element.firstChild.nodeValue = asDefault_Order_List[nx];
			eNew_List_Element.value = asDefault_Order_List[nx];
			eDefault_Order_List.appendChild(eNew_List_Element);
		}
	}
}
//	Array( fieldname, field_table_position [1..n],
//						sort_field_list_position { 0 | [1..n] },
//							sort_order_list_position { 0 | [1..n] }
//	);
//	this.m_asSort_Order_Set = Array();
//var SO_FIELD_NAME = 0;
//var SO_TABLE_INDEX = 1;
//var SO_SORT_STATUS = 2;
//var SO_SORT_OFFSET = 3;


/**
 *  Move selected fields between the 'selected fields' listbox and the 'sort order' listbox
 *	(in either direction).
 *
 *	@private
 *	@param	{array} a_eFrom_List The listbox element from which to extract any selected elements.
 *	@param	{array} a_eTo_List The listbox element to be appended with the moved elements.
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.move_selected_fields = function(a_eFrom_List, a_eTo_List)
{
	var nx = 0;

	// Note: using the .options collection doesn't work in IE.
	var aeSelected_Fields_Collection = a_eFrom_List.getElementsByTagName('option');
	var nSelected_Fields_Collection_Count = aeSelected_Fields_Collection.length;
	if (nSelected_Fields_Collection_Count == 0) {
		return;
	}

	var asSelected_Value_List = Array();
	var nSelected_Value_Count = 0;
	for (nx=(nSelected_Fields_Collection_Count - 1); nx>=0; nx--) {
		if ( (aeSelected_Fields_Collection[nx].selected == true)
			&& (aeSelected_Fields_Collection[nx].childNodes.length > 0)
			&& (aeSelected_Fields_Collection[nx].firstChild.nodeType == 3) ) {
			asSelected_Value_List[nSelected_Value_Count] = aeSelected_Fields_Collection[nx].firstChild.nodeValue;
			nSelected_Value_Count++;
			a_eFrom_List.removeChild(aeSelected_Fields_Collection[nx]);
		}
	}

	if (nSelected_Value_Count == 0) {
		return;
	}

	var eClonable_Field_List_Element = document.getElementById(this.m_sFieldname_Option_Template);
	if (!eClonable_Field_List_Element) {
		alert('Clonable field list element \'' + this.m_sFieldname_Option_Template + '\' no longer exists.');
		return;
	}

	var eNew_List_Element = null;
	for (nx=(nSelected_Value_Count - 1); nx>=0; nx--) {
		eNew_List_Element = eClonable_Field_List_Element.cloneNode(true);
		if (!eNew_List_Element) {
			alert('Failed to clone a new field list element.');
			return;
		}
		eNew_List_Element.removeAttribute('id');
		eNew_List_Element.firstChild.nodeValue = asSelected_Value_List[nx];
		eNew_List_Element.value = asSelected_Value_List[nx];
		a_eTo_List.appendChild(eNew_List_Element);
	}
}


/**
 *  Create and configure a hidden sort-order value element.
 *
 *	@private
 *	@param	{string} a_sField_Name The data field name - used to construct the .value attribute for the element.
 *	@param	{string} a_eClonable_Element The dedicated clonable <input> element. Passed as an
 *						argument by the caller to prevent a new search for it on every call.
 *						Also enables an earlier and tidier halt if the element has been lost.
 *
 *  @return	The created element if successful, otherwise null.
 *  @type	DOM-object
 */

Extract_Display.prototype.create_hidden_element = function(a_sField_Name, a_eClonable_Element)
{
	var eNew_Element = a_eClonable_Element.cloneNode(true);
	if (!eNew_Element) {
		alert('Failed to clone a sort order element.');
		return (null);
	}

	eNew_Element.removeAttribute('id');
	eNew_Element.name = 'sort_order[]';
	eNew_Element.value = a_sField_Name;

	return (eNew_Element);
}


/**
 *  Display a commented sort-order entry.
 *
 *	@private
 *	@param	{string} a_sEntry_Comment The comment to display with the entry.
 *	@param	{array} a_aEntry_Tuple The entry n-tuple to display.
 *
 *  @return	none
 *  @type	void
 */

Extract_Display.prototype.log_entry = function(a_sEntry_Comment, a_aEntry_Tuple)
{
	if (!is_array(a_aEntry_Tuple)) {
		alert('log_entry() did not receive an array for the n-tuple');
	}

	//alert(a_sEntry_Comment
	//		+ ' <' + a_aEntry_Tuple[SO_FIELD_NAME]
	//		+ ', ' + a_aEntry_Tuple[SO_TABLE_INDEX]
	//		+ ', ' + a_aEntry_Tuple[SO_SORT_STATUS]
	//		+ ', ' + a_aEntry_Tuple[SO_SORT_OFFSET] + '>');
}


/* -+- */


