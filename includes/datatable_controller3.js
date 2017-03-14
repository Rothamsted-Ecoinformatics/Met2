/**
 *  @fileoverview The class Datatable_Controller is the display handler for all dataset field listing tables.
 *
 *	@version 0.2.11  [24.1.2007]
 *	@version 0.2.12  [31.1.2007]
 *	@version 0.2.13  [26.2.2007]
 *	@version 0.2.16  [27.4.2007]
 *	@version 0.2.18  [3.5.2007]
 *	@version 0.3.1  [8.11.2007]		// Now generates the download request + message section
 *	@version 0.3.4  [16.11.2007]
 *	@version 0.3.5  [16.9.2008]
 *	@version 0.3.6  [6.10.2008]
 */


//--------------------------------------------------------------------------------------------------
//
// Local constants.

//var TRANSFER_LIST_SLOT_COUNT = 4;		// 10
//var TRANSFER_DESCRIPTOR_SLOT_COUNT = 7;
//var FIRST_TX_SEQUENCE_COUNT = 1;
//var LAST_TX_SEQUENCE_COUNT = 255;

//--------------------------------------------------------------------------------------------------
//
// Field offsets.

/**
 *	Transfer descriptor field offsets.
 *	@final
 *	@type	integer
 */
// TD = Transfer Descriptor
//var TD_STATE	= 0;		// The transfer state.
//var TD_REQNUM	= 1;		// The transfer request order number.
//var TD_IDTYPE	= 2;		// The transfer message type.
//var TD_CALLER	= 3;		// The unique application-wide name of the caller.
//var TD_TARGET	= 4;		// The target URL.
//var TD_OUTPUT	= 5;		// The data to send to the target.
//var TD_TXSEQC	= 6;		// The identifying transfer transmission sequence count (cycles through 1..255).

//--------------------------------------------------------------------------------------------------
//
// Display states.

/**
 *	Display panel states.
 *	@final
 *	@type	integer
 */
// DS = Display State
var DS_INIT		= 0;		// Initial/startup state. No field-set definition retrieved yet.
var DS_LOAD		= 1;		// Field-set download already initiated. Awaiting its completion.
var DS_EXEC		= 2;		// Fully operational. Field-set definition downloaded and installed.
var DS_FAIL		= 3;		// Field-set download failed or was aborted. Await retry request.

//--------------------------------------------------------------------------------------------------
//
// Status flags and masks.


//--------------------------------------------------------------------------------------------------


/**
 *	Constructor for the Datatable_Controller class.
 *	@class	The class Datatable_Controller provides support for the display/re-display
 *	operations for all dataset field listing tables. This class requires the
 *	existence of appropriate event handlers in a lower-level service layer. These
 *	event handlers must identify and activate appropriate object methods in response
 *	to user activity. They are:
 *
 *	@constructor
 *	@param	{string} a_sDisplay_Name A unique application-wide name for the display.
 *
 *	@return	none
 *	@type	void
 */

function Datatable_Controller(a_sDisplay_Name)
{
	/**
	 *	The unique application-wide name for this display (and dataset field-set).
	 *	@type	string
	 */
	this.m_sDisplay_Name = a_sDisplay_Name;

	/**
	 *	The on-screen name used for this display (and dataset field-set).
	 *	@type	string
	 */
	this.m_sDisplay_Label = '';

	/**
	 *  The panel's operational display state = INIT | LOAD | EXEC | FAIL.
	 *	@type	integer
	 */
	this.m_nDisplay_State = DS_INIT;

	/**
	 *	The locally pre-defined section dataset field-set selection display name.
	 *	(Note: this must be identical to the associative array index used in both the
	 *	section display object list and the section support object list).
	 *	@type	string
	 */
	this.m_sSelection_Display = 'tabs';

	/**
	 *	The locally pre-defined section dataset field-set message display name.
	 *	(Note: this must be identical to the associative array index used in both the
	 *	section display object list and the section support object list).
	 *	@type	string
	 */
	this.m_sMessage_Display = 'message';

	/**
	 *	The locally pre-defined section dataset field-set listing display name.
	 *	(Note: this must be identical to the associative array index used in both the
	 *	section display object list and the section support object list).
	 *	@type	string
	 */
	this.m_sDatafield_Display = 'fields';

	/**
	 *	The locally pre-defined section dataset field-set search filters display name.
	 *	(Note: this must be identical to the associative array index used in both the
	 *	section display object list and the section support object list).
	 *	@type	string
	 */
	this.m_sDatafilter_Display = 'filters';

	/**
	 *	The locally pre-defined section dataset field-set extract-order display name.
	 *	(Note: this must be identical to the associative array index used in both the
	 *	section display object list and the section support object list).
	 *	@type	string
	 */
	this.m_sExtract_Display = 'extract';

	/**
	 *  The unique ID of the HTML element that contains this display panel.
	 *	@type	string
	 */
	this.m_sPanel_Element = '';

	/**
	 *  The unique ID of the HTML FORM element used to initiate data extraction.
	 *	@type	string
	 */
	this.m_sForm_Element = '';

	/**
	 *  The unique ID of the HTML INPUT element used to transmit the dataset name.
	 *	(NB later this will be the unique application-wide name for this display
	 *	and the translation between this name - which was set on the server - and
	 *	the true dataset name will be made on the server prior to data extraction).
	 *	@type	string
	 */
	this.m_sDataset_Element = '';

	/**
	 *	The containing HTML element ID for the dedicated message section.
	 *	@type	string
	 */
	//this.m_sMessage_Section = null;

	/**
	 *	The ID of the current active tabbed display. This can represent either a single section
	 *	or a pre-defined group of sections.
	 *	@type	string
	 */
	this.m_sActive_Display = this.m_sDatafield_Display;

	/**
	 *	The contained/controlled collection of component section display objects (references)
	 *	as an associative array, indexed by their unique locally pre-defined display names.
	 *	@type	array
	 */
	this.m_arDisplay_List = {
		tabs: null,
		message: null,
		fields: null,
		filters: null,
		extract: null
	};

	/**
	 *	Any display-specific support objects required to restore the displayed state of the
	 *	section display objects. An associative array, indexed by the unique locally pre-defined
	 *	display names.
	 *	@type	array
	 */
	this.m_arSupport_List = {
		tabs: null,
		message: null,
		fields: null,
		filters: null,
		extract: null
	};

	/**
	 *	The name of the dataset used by the database server (not the unique
	 *	application-wide name used to identify the display). This name will
	 *	be used when generating any SQL queries for the server database.
	 *
	 *	DEPRECATED. Is it still used ???
	 *	(NB any messages for the user will use the display name/label).
	 *
	 *	@type	string
	 */
	//this.m_sDataset_Name = '';

	/**
	 *	This flag permits a degree of laziness for data retrieval.
	 *	It indicates when data retrieval has already been attempted
	 *	ie when an empty field set definition is the true end value.
	 *	@type	boolean
	 */
//	this.m_bContent_Retrieved = false;

	/**
	 *	The number of fields in the field-set.
	 *	@type	integer
	 */
	this.m_nField_Count = 0;

	/**
	 *	A reference to the definition of the field-set.
	 *	@type	array
	 */
	this.m_asField_Set_Definition = Array();

	/**
	 *	A reference to the ordering option definitions for the field-set.
	 *	@type	array
	 */
	this.m_asField_Set_Ordering = Array();

	/**
	 *	A reference to the index order definition for the field-set.
	 *	(Will be displayed as the default row extraction sort order).
	 *	@type	array
	 */
	this.m_asField_Set_Indexing = Array();

	/**
	 *	A reference to the definition of the dataset field set.
	 *	@type	array
	 *
	 *	Current active dataset fields string split into:
	 *		[n]   = field name
	 *		[n+1] = field description
	 *		[n+2] = field preview sequence
	 */
	//this.m_asField_Definition = Array();
}


/**
 *	Set the name used on-screen to identify this display (and dataset field-set).
 *
 *	@param	{string} a_sDisplay_Label The on-screen name for this display.
 *
 *	@return	none
 *	@type	void
 */

Datatable_Controller.prototype.set_label_name = function(a_sDisplay_Label)
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

Datatable_Controller.prototype.set_element_names = function(a_sPanel_Element, a_asElement_List)
{
	if (!document.getElementById(a_sPanel_Element)) {
		alert("Display '" + this.m_sDisplay_Name + "' panel element '" + a_sPanel_Element + "' was not found.");
		return (false);
	}

	// Expected length of the element list.
	var nElement_List_Length = 2;

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
	this.m_sForm_Element = a_asElement_List[0];
	this.m_sDataset_Element = a_asElement_List[1];

	return (true);
}


/**
 *	Add a component display section to the field set controller.
 *
 *	@param	{string} a_sSection_Name The controller's preset name for the expected display section.
 *	@param	{array} a_arObject_Set An array of the objects supporting the new section display,
 *          in a standard preset order (the first is always the display section object).
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Datatable_Controller.prototype.add_panel_section = function(a_sSection_Name, a_arObject_Set)
{
	if (is_undefined(this.m_arDisplay_List[a_sSection_Name])) {
		alert('Unknown section \'' + a_sSection_Name + '\' sent to Datatable_Controller.add_panel_section()');
		return (false);
	}

	if (!is_null(this.m_arDisplay_List[a_sSection_Name])) {
		alert('Datatable_Controller has already configured section \'' + a_sSection_Name + '\'');
		return (false);
	}

	if (a_arObject_Set.length == 0) {
		alert('No \'' + a_sSection_Name + '\' section object(s) sent to Datatable_Controller.add_panel_section()');
		return (false);
	}

	//alert(a_arObject_Set.length + ' \'' + a_sSection_Name + '\' section object(s) sent to Datatable_Controller.add_panel_section()');
	this.m_arDisplay_List[a_sSection_Name] = a_arObject_Set[0];
	if (a_arObject_Set.length < 2) {
		this.m_arSupport_List[a_sSection_Name] = null;
	}
	else {
		this.m_arSupport_List[a_sSection_Name] = a_arObject_Set[1];
	}

	return (true);
}


/**
 *	Return the unique application-wide name for this display (and dataset field-set).
 *
 *	@return The unique application-wide name for the display/field-set.
 *	@type	string
 */

Datatable_Controller.prototype.get_display_name = function()
{
	return (this.m_sDisplay_Name);
}


/**
 *	Get the handler for the section selection display (eg a tab bar).
 *
 *	@return	A reference to the handler object, null if unsuccessful.
 *	@type	object
 */

Datatable_Controller.prototype.get_selection_display = function()
{
	return (this.m_arDisplay_List[this.m_sSelection_Display]);
}


/**
 *	Get the handler for the section message display.
 *
 *	@return	A reference to the handler object, null if unsuccessful.
 *	@type	object
 */

Datatable_Controller.prototype.get_message_display = function()
{
	return (this.m_arDisplay_List[this.m_sMessage_Display]);
}


/**
 *	Get the handler for the section field listing display.
 *
 *	@return	A reference to the handler object, null if unsuccessful.
 *	@type	object
 */

Datatable_Controller.prototype.get_datafield_display = function()
{
	return (this.m_arDisplay_List[this.m_sDatafield_Display]);
}


/**
 *	Get the handler for the section filter listing display.
 *
 *	@return	A reference to the handler object, null if unsuccessful.
 *	@type	object
 */

Datatable_Controller.prototype.get_datafilter_display = function()
{
	return (this.m_arDisplay_List[this.m_sDatafilter_Display]);
}


/**
 *	Get the handler for the section extract-order display.
 *
 *	@return	A reference to the handler object, null if unsuccessful.
 *	@type	object
 */

Datatable_Controller.prototype.get_extract_display = function()
{
	return (this.m_arDisplay_List[this.m_sExtract_Display]);
}


/**
 *	Remove all component display sections from the field set controller.
 *
 *  @return	none
 *  @type	void
 */

Datatable_Controller.prototype.remove_display = function()
{
	this.m_arDisplay_List[this.m_sSelection_Display] = null;
	this.m_arDisplay_List[this.m_sMessage_Display] = null;
	this.m_arDisplay_List[this.m_sDatafield_Display] = null;
	this.m_arDisplay_List[this.m_sDatafilter_Display] = null;
	this.m_arDisplay_List[this.m_sExtract_Display] = null;
	this.m_arSupport_List[this.m_sSelection_Display] = null;
	this.m_arSupport_List[this.m_sMessage_Display] = null;
	this.m_arSupport_List[this.m_sDatafield_Display] = null;
	this.m_arSupport_List[this.m_sDatafilter_Display] = null;
	this.m_arSupport_List[this.m_sExtract_Display] = null;
}


/**
 *	Confirm existence of section display. Performs no check because this controller
 *	uses local pre-defined names only.
 *
 *	@param	{string} a_sSection_Display_Name The name of the section/section-group to be verified.
 *
 *	@return	true if the named panel exists, otherwise false. (Always true).
 *	@type	boolean
 */

Datatable_Controller.prototype.check_display = function(a_sSection_Display_Name)
{
	return (true);
}


/**
 *	Switch to a new section/section-group display.
 *
 *	@param	{string} a_sSection_Display_Name One of the locally pre-defined section display names.
 *
 *  @return	None.
 *  @type	void
 */

Datatable_Controller.prototype.select_new_display = function(a_sSection_Display_Name)
{
	if (is_null(a_sSection_Display_Name) || (!is_string(a_sSection_Display_Name))) {
		return;
	}

	if ((is_undefined(this.m_arDisplay_List[a_sSection_Display_Name]))
		|| (is_null(this.m_arDisplay_List[a_sSection_Display_Name]))) {
		alert('Unknown section display \'' + a_sSection_Display_Name + '\' selected.');
		return;
	}

	//alert('Datatable controller selecting from \'' + this.m_sActive_Display + '\' to \'' 
	//													+ a_sSection_Display_Name + '\'');
	if (this.m_sActive_Display != a_sSection_Display_Name) {
		if (this.m_sActive_Display != '') {
			this.m_arDisplay_List[this.m_sActive_Display].hide_display();
			this.m_sActive_Display = '';
		}

		if (a_sSection_Display_Name != '') {
			//this.display_loading_message(true);
			if (!is_null(this.m_arSupport_List[a_sSection_Display_Name])) {
				//alert('do_action()');
				(this.m_arSupport_List[a_sSection_Display_Name]).do_action();
			}
			//alert(a_sSection_Display_Name + ' before select_new_display show');
			(this.m_arDisplay_List[a_sSection_Display_Name]).show_display();
			//alert(a_sSection_Display_Name + ' after select_new_display show');
			//this.display_loading_message(false);
		}

		this.m_sActive_Display = a_sSection_Display_Name;
	}
	//alert('end of Controller::select_new_display()');
}


/**
 *  Set the dataset field set, replacing any existing displayed field set.
 *	This does not cause the immediate automatic display of the new field set.
 *	NOT USED BUT LEAVE IN FOR NOW !!!
 *
 *	@param	{string} a_sDataset_Name The name of the new dataset.
 *	@param	{array} a_asField_Definition The dataset field set definition.
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */
/*
Datatable_Controller.prototype.set_dataset_field_set = function(a_sDataset_Name, a_asField_Definition)
{
	alert('Datatable_Controller..set_dataset_field_set()');
	if ((a_asField_Definition.length % DATAFIELD_SET_UNIT_LENGTH) != 0) {
		alert('dataset field set error');
		return (false);
	}

	this.m_sDataset_Name = a_sDataset_Name;
	this.m_asField_Definition = a_asField_Definition;

	// Reset the display state for the new dataset field set.
	this.m_afField_Display_State = Array();
	this.m_afField_Display_State[0] = 0;

	return (true);
}
*/

/**
 *	Invoked by the event handler for the row order selection button.
 *	Just delegate the call to the current active display.
 *
 *	@return	none
 *	@type	void
 */

Datatable_Controller.prototype.toggle_row_ordering = function()
{
	if (!is_null(this.m_arDisplay_List[this.m_sActive_Display])) {
		this.m_arDisplay_List[this.m_sActive_Display].toggle_row_ordering();
	}
}


/**
 *	Invoked by the event handler for the column help button.
 *	Just delegate the call to the current active display.
 *
 *	@param	{boolean} a_bNew_Display_State True to display the help, false to hide it.
 *
 *	@return	none
 *	@type	void
 */

Datatable_Controller.prototype.set_column_help = function(a_bNew_Display_State)
{
	if (!is_null(this.m_arDisplay_List[this.m_sActive_Display])) {
		this.m_arDisplay_List[this.m_sActive_Display].set_column_help(a_bNew_Display_State);
	}
	//alert(this.print_state());
}


/**
 *	Determine if this panel is the current displayed panel.
 *
 *	@return	True if the panel is the current display. Otherwise false.
 *	@type	boolean
 */

Datatable_Controller.prototype.is_displaying_now = function()
{
	var rPanel_Controller = locate_registered_object('main_controller');
	if (is_null(rPanel_Controller)) {
		return (false);
	}

	return (rPanel_Controller.is_display_active(this.m_sDisplay_Name));
}


/**
 *	Hide the display.
 *
 *	@return	none
 *	@type	void
 */

Datatable_Controller.prototype.hide_display = function()
{
	//alert('Datatable controller hiding \'' + this.m_sDisplay_Name + '\'');

	if (!is_null(this.m_arDisplay_List[this.m_sSelection_Display])) {
		this.m_arDisplay_List[this.m_sSelection_Display].hide_display();
	}

	if (!is_null(this.m_arDisplay_List[this.m_sMessage_Display])) {
		this.m_arDisplay_List[this.m_sMessage_Display].hide_display();
	}

	if (!is_null(this.m_arDisplay_List[this.m_sActive_Display])) {
		this.m_arDisplay_List[this.m_sActive_Display].hide_display();
	}

	var eDisplay_Element = document.getElementById(this.m_sPanel_Element);
	if (!eDisplay_Element) {
		alert("Display panel element '" + this.m_sPanel_Element + "' no longer exists.");
		return;
	}

	eDisplay_Element.className = 'hidden';
}


/**
 *	Show the display, its selection element and its current active section.
 *
 *	@return	none
 *	@type	void
 */

Datatable_Controller.prototype.show_display = function()
{
	//alert('m_nDisplay_State = ' + this.m_nDisplay_State);

	var eDisplay_Element = document.getElementById(this.m_sPanel_Element);
	if (!eDisplay_Element) {
		alert("Display panel element '" + this.m_sPanel_Element + "' no longer exists.");
		return;
	}

	switch (this.m_nDisplay_State) {

                    // Initial/startup state.
	case DS_INIT:   if (this.request_fieldset_download()) {
						if (!is_null(this.m_arDisplay_List[this.m_sMessage_Display])) {
							this.m_arDisplay_List[this.m_sMessage_Display].set_message('Loading...');
							this.m_arDisplay_List[this.m_sMessage_Display].show_display();
						}
                        this.m_nDisplay_State = DS_LOAD;
						eDisplay_Element.className = '';
					}
					break;

					// Field-set downloading.
	case DS_LOAD:   if (!is_null(this.m_arDisplay_List[this.m_sMessage_Display])) {
                        this.m_arDisplay_List[this.m_sMessage_Display].show_display();
                    }
					eDisplay_Element.className = '';
					break;

					// Normal operation.
	case DS_EXEC:   if (!is_null(this.m_arDisplay_List[this.m_sSelection_Display])) {
						this.m_arDisplay_List[this.m_sSelection_Display].show_display();
					}

					if (!is_null(this.m_arDisplay_List[this.m_sActive_Display])) {
						this.m_arDisplay_List[this.m_sActive_Display].show_display();
					}

					eDisplay_Element.className = '';
					break;

					// Set up failed or aborted.
	case DS_FAIL:   if (!is_null(this.m_arDisplay_List[this.m_sMessage_Display])) {
						this.m_arDisplay_List[this.m_sMessage_Display].show_display();
					}
					eDisplay_Element.className = '';
					break;

					// Take no action for an invalid state.
	default:        return;

	}
}


/**
 *	Retrieve field-set metadata for a dataset to hold locally and return a copy to caller.
 *
 *	@return	Dataset field definitions as an array, or empty array on error.
 *	@type	array
 */
/*
Datatable_Controller.prototype.get_dataset_fieldset_definition = function()
{
	// Note where the dataset name comes from. Should it ???  YESSS !!!
	var sDataset_Name = this.m_sDisplay_Name;
	var sDataset_Field_Definition = '';

	if (is_null(sDataset_Name) || (!is_string(sDataset_Name))) {
		return ('');
	}

	if (this.m_bContent_Retrieved == false) {
		sDataset_Field_Definition = get_dataset_fieldset_definition(sDataset_Name);
		if (sDataset_Field_Definition.length == 0) {
			this.m_asField_Definition = Array();
			alert('Error retrieving field definitions for dataset \'' + sDataset_Name + '\'');
		}
		else {
			// What should I have in mind for length < (DATAFIELD_SET_UNIT_LENGTH + 2) ???
			var asTemp_Dataset_Field_Set = sDataset_Field_Definition.split('!-!');
			// Both a leading and a trailing string were forced.
			if (asTemp_Dataset_Field_Set.length < (DATAFIELD_SET_UNIT_LENGTH + 2)) {
				alert('Bad field definitions retrieved for dataset \'' + sDataset_Name + '\'');
				this.m_asField_Definition = Array();
			}
			else {
				if ((asTemp_Dataset_Field_Set.length % DATAFIELD_SET_UNIT_LENGTH) != 2) {
					alert('Stringlist error for dataset field set \'' + sDataset_Name + '\'.');
					 this.m_asField_Definition = Array();
				}
				else {
					 this.m_asField_Definition = asTemp_Dataset_Field_Set.slice(1, -1);
				}
			}
		}
		this.m_bContent_Retrieved = true;
		//alert('Controller::get_dataset_fieldset_definition(' + sDataset_Name + ') -- ' + sDataset_Field_Definition);
	}
	//alert('Controller::get_dataset_fieldset_definition(' + sDataset_Name + ') -- length = ' + this.m_asField_Definition.length);

    //return (sDataset_Field_Definition);
	return (this.m_asField_Definition);
}
*/

/**
 *	Return the field-set definitions for the current dataset.
 *	If necessary retrieve all field-set metadata for the current dataset to hold
 *	locally before returning a copy of the field-set definitions to the caller.
 *
 *	@param	{array} a_asError_Message A single element text array to receive any error message.
 *
 *	@return	Dataset field definitions as an array, or empty array on error.
 *	@type	array
 */
/*
Datatable_Controller.prototype.get_dataset_fieldset_definition = function(a_asError_Message)
{
	var sField_Definition = '';

	var asField_Set_Definition = Array();
	var asField_Set_Ordering = Array();
	var asError_Message = Array(1);

	if (is_null(this.m_sDisplay_Name) || (!is_string(this.m_sDisplay_Name))) {
		return ('');
	}

	if (this.m_bContent_Retrieved == false) {
		this.m_nField_Count = 0;
		this.m_asField_Set_Definition = Array();
		this.m_asField_Set_Ordering = Array();
//		this.reset_display_status(0);

		asError_Message[0] = '';
		sField_Definition = input_dataset_fieldset_definition(this.m_sDisplay_Name, asError_Message);
		if (is_null(sField_Definition)
			|| (!is_string(sField_Definition))
			|| (sField_Definition.length == 0)) {
			if (asError_Message[0].length > 0) {
                a_asError_Message[0] = asError_Message[0];
			}
			else {
                a_asError_Message[0] = 'No response from server.';
			}
			return (this.m_asField_Set_Definition);
		}

		asError_Message[0] = '';
		if (process_dataset_fieldset_definition(this.m_sDisplay_Name, sField_Definition,
							asField_Set_Definition, asField_Set_Ordering, asError_Message) == false) {
			if (asError_Message[0].length > 0) {
				a_asError_Message[0] = asError_Message[0];
			}
			else {
				a_asError_Message[0] = 'No response from server.';
			}
			return (this.m_asField_Set_Definition);
		}

		this.m_nField_Count = asField_Set_Definition.length / DATAFIELD_SET_UNIT_LENGTH;
		this.m_asField_Set_Definition = asField_Set_Definition;
		this.m_asField_Set_Ordering = asField_Set_Ordering;

		if ((!this.transform_ordering_definition())
			|| (!this.build_indexing_definition())) {
			this.m_nField_Count = 0;
			this.m_asField_Set_Definition = Array();
			this.m_asField_Set_Ordering = Array();
			//this.m_sActive_Message = 'Ordering definition error.';
			alert('Field-set definition error.');
			return (this.m_asField_Set_Definition);
		}

		//this.reset_display_status(this.m_nDataset_Count);
		this.m_bContent_Retrieved = true;
	}

	return (this.m_asField_Set_Definition);
}
/*
		sDataset_Field_Definition = get_dataset_fieldset_definition(this.m_sDisplay_Name);
		if (sDataset_Field_Definition.length == 0) {
			this.m_asField_Definition = Array();
			alert('Error retrieving field definitions for dataset \'' + this.m_sDisplay_Name + '\'');
		}
		else {
			// What should I have in mind for length < (DATAFIELD_SET_UNIT_LENGTH + 2) ???
			var asTemp_Dataset_Field_Set = sDataset_Field_Definition.split('!-!');
			// Both a leading and a trailing string were forced.
			if (asTemp_Dataset_Field_Set.length < (DATAFIELD_SET_UNIT_LENGTH + 2)) {
				alert('Bad field definitions retrieved for dataset \'' + this.m_sDisplay_Name + '\'');
				this.m_asField_Definition = Array();
			}
			else {
				if ((asTemp_Dataset_Field_Set.length % DATAFIELD_SET_UNIT_LENGTH) != 2) {
					alert('Stringlist error for dataset field set \'' + this.m_sDisplay_Name + '\'.');
					 this.m_asField_Definition = Array();
				}
				else {
					 this.m_asField_Definition = asTemp_Dataset_Field_Set.slice(1, -1);
				}
			}
		}
		this.m_bContent_Retrieved = true;
		//alert('Controller::get_dataset_fieldset_definition(' + this.m_sDisplay_Name + ') -- ' + sDataset_Field_Definition);
	}
	//alert('Controller::get_dataset_fieldset_definition(' + this.m_sDisplay_Name + ') -- length = ' + this.m_asField_Definition.length);

    //return (sDataset_Field_Definition);
*/


/**
 *	Register a request for the field-set definitions to be downloaded.
 *
 *	@private
 *
 *	@return	True if request issued successfully. Otherwise false.
 *	@type	boolean
 */

Datatable_Controller.prototype.request_fieldset_download = function()
{
	var rMessage_Transfer_Service = null;
	var sTarget_Page = ((!is_testcheck_set(0)) ? FIELDSET_PAGE_URL : ECHO_PAGE_URL);

	rMessage_Transfer_Service = locate_registered_object('message_service');
	if (is_null(rMessage_Transfer_Service)) {
		alert("Message Transfer Service not found by Datatable Controller.");
		return (false);
	}
	rMessage_Transfer_Service.request_transfer('table', this.m_sDisplay_Name, sTarget_Page, 
																'dataset=' + this.m_sDisplay_Name);
	return (true);
}


/**
 *  Handle the completion of an asynchronous message transfer.
 *
 *	@param	{string} a_sMessage_Type The initiating message type specified for the transfer
 *	@param	{boolean} a_bValid_Transfer True indicates a processable transfer response
 *	@param	{string} a_sTransfer_Response The received response text or an error report
 *
 *  @return	none
 *  @type	void
 */

Datatable_Controller.prototype.transfer_completion = function(a_sMessage_Type, a_bValid_Transfer, a_sTransfer_Response)
{
	//log_message('Datatable_Controller.prototype.transfer_completion()'
	//	  + '\nMessage Type = \'' + a_sMessage_Type + '\'' 
	//	  + '\nValid Transfer = \'' + a_bValid_Transfer + '\'' 
	//	  + '\nTransfer Response = \'' + a_sTransfer_Response + '\'');

	var asField_Set_Definition = Array();
	var asField_Set_Ordering = Array();
	var asError_Message = Array(1);
	asError_Message[0] = '';

	this.m_nField_Count = 0;
	this.m_asField_Set_Definition = Array();
	this.m_asField_Set_Ordering = Array();
////	this.reset_display_status(0);

	if (is_null(a_sTransfer_Response)
		|| (!is_string(a_sTransfer_Response))
		|| (a_sTransfer_Response.length == 0)) {
		this.m_arDisplay_List[this.m_sMessage_Display].set_message('No response from server.');
        this.m_nDisplay_State = DS_FAIL;
		return;
	}

	if (process_dataset_fieldset_definition2(this.m_sDisplay_Name, a_sTransfer_Response,
						asField_Set_Definition, asField_Set_Ordering, asError_Message) == false) {
		if (asError_Message[0].length > 0) {
            this.m_arDisplay_List[this.m_sMessage_Display].set_message(asError_Message[0]);
		}
		else {
			this.m_arDisplay_List[this.m_sMessage_Display].set_message('Failed to process response from server.');
		}
		this.m_nDisplay_State = DS_FAIL;
		return;
	}

	this.m_nField_Count = asField_Set_Definition.length / DATAFIELD_SET_UNIT_LENGTH;
	this.m_asField_Set_Definition = asField_Set_Definition;
	this.m_asField_Set_Ordering = asField_Set_Ordering;

	if ((!this.transform_ordering_definition())
		|| (!this.build_indexing_definition())) {
		this.m_nField_Count = 0;
		this.m_asField_Set_Definition = Array();
		this.m_asField_Set_Ordering = Array();
		this.m_arDisplay_List[this.m_sMessage_Display].set_message('Ordering definition error.');
		this.m_nDisplay_State = DS_FAIL;
		return;
	}

	//this.reset_display_status(this.m_nDataset_Count);
//	this.m_bContent_Retrieved = true;
	this.m_nDisplay_State = DS_EXEC;
	if (this.is_displaying_now()) {
		this.hide_display();
		this.show_display();
	}
	return;
}


/**
 *	Return the field-set definitions for the current dataset.
 *
 *	@return	Dataset field definitions as an array.
 *	@type	array
 */

Datatable_Controller.prototype.get_dataset_fieldset_definition = function(a_asError_Message)
{
//	var sField_Definition = '';

//	var asField_Set_Definition = Array();
//	var asField_Set_Ordering = Array();
//	var asError_Message = Array(1);

//	if (is_null(this.m_sDisplay_Name) || (!is_string(this.m_sDisplay_Name))) {
//		return ('');
//	}
/*
	if (this.m_bContent_Retrieved == false) {
		this.m_nField_Count = 0;
		this.m_asField_Set_Definition = Array();
		this.m_asField_Set_Ordering = Array();
//		this.reset_display_status(0);

		asError_Message[0] = '';
		sField_Definition = input_dataset_fieldset_definition(this.m_sDisplay_Name, asError_Message);
		if (is_null(sField_Definition)
			|| (!is_string(sField_Definition))
			|| (sField_Definition.length == 0)) {
			if (asError_Message[0].length > 0) {
                a_asError_Message[0] = asError_Message[0];
			}
			else {
                a_asError_Message[0] = 'No response from server.';
			}
			return (this.m_asField_Set_Definition);
		}

		asError_Message[0] = '';
		if (process_dataset_fieldset_definition(this.m_sDisplay_Name, sField_Definition,
							asField_Set_Definition, asField_Set_Ordering, asError_Message) == false) {
			if (asError_Message[0].length > 0) {
				a_asError_Message[0] = asError_Message[0];
			}
			else {
				a_asError_Message[0] = 'No response from server.';
			}
			return (this.m_asField_Set_Definition);
		}

		this.m_nField_Count = asField_Set_Definition.length / DATAFIELD_SET_UNIT_LENGTH;
		this.m_asField_Set_Definition = asField_Set_Definition;
		this.m_asField_Set_Ordering = asField_Set_Ordering;

		if ((!this.transform_ordering_definition())
			|| (!this.build_indexing_definition())) {
			this.m_nField_Count = 0;
			this.m_asField_Set_Definition = Array();
			this.m_asField_Set_Ordering = Array();
			//this.m_sActive_Message = 'Ordering definition error.';
			alert('Field-set definition error.');
			return (this.m_asField_Set_Definition);
		}

		//this.reset_display_status(this.m_nDataset_Count);
		this.m_bContent_Retrieved = true;
	}
*/
	return (this.m_asField_Set_Definition);
}


/**
 *	Return the number of fields in the field-set for the current dataset.
 *
 *	@return	Number of fields in the field-set for the current dataset.
 *	@type	integer
 */

Datatable_Controller.prototype.get_dataset_field_count = function()
{
//	var asError_Message = Array(1);
//	asError_Message[0] = '';

//	if (!this.m_bContent_Retrieved) {
//		this.get_dataset_fieldset_definition(asError_Message);
//	}

	return (this.m_nField_Count);
}


/**
 *	Return the field-set ordering definitions for the current dataset.
 *
 *	@return	Field-set ordering definitions as an array, or empty array on error.
 *	@type	array
 */

Datatable_Controller.prototype.get_fieldset_ordering_definition = function()
{
//	var asError_Message = Array(1);
//	asError_Message[0] = '';

//	if (!this.m_bContent_Retrieved) {
//		this.get_dataset_fieldset_definition(asError_Message);
//	}

	return (this.m_asField_Set_Ordering);
}


/**
 *	Return the field-set ordering definitions for the current dataset.
 *
 *	@return	Field-set ordering definitions as an array, or empty array on error.
 *	@type	array
 */

Datatable_Controller.prototype.get_fieldset_indexing_definition = function()
{
//	var asError_Message = Array(1);
//	asError_Message[0] = '';

//	if (!this.m_bContent_Retrieved) {
//		this.get_dataset_fieldset_definition(asError_Message);
//	}

	return (this.m_asField_Set_Indexing);
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

Datatable_Controller.prototype.transform_ordering_definition = function()
{
	var nx = 0;
	var nList_Count = 0;
	var nGroup_Count = 0;
	var nCurrent_Group = 0;
	var nOrdering_Definition_Length = this.m_asField_Set_Ordering.length;
	var nEntry_Index = 0;

	// Loop from here to process each ordering.
	while (nEntry_Index < nOrdering_Definition_Length) {
		// Check we have a valid ordering start-of-header and a valid group count.
		if ((this.m_asField_Set_Ordering[nEntry_Index + FO_SOH] != 0)
			|| (this.m_asField_Set_Ordering[nEntry_Index + FO_COUNT] < 1)) {
			alert('Ordering definition error.');
			return (false);
		}

		nGroup_Count = this.m_asField_Set_Ordering[nEntry_Index + FO_COUNT];
		nCurrent_Group = 1;		// The numeric id for the first group.

		// Loop from here to process each group within the ordering.
		// (NB the groups must be ordered by their numeric id).
		while (nCurrent_Group <= nGroup_Count) {
			nEntry_Index += DATAFIELD_SET_UNIT_LENGTH;
			// Check the entry index is still in-range and that we have the correct group id.
			if ((nEntry_Index >= nOrdering_Definition_Length)
				|| (nCurrent_Group != this.m_asField_Set_Ordering[nEntry_Index + FO_GNO])) {
				return (false);
			}
			this.m_asField_Set_Ordering[nEntry_Index + FO_LIST]
								= this.m_asField_Set_Ordering[nEntry_Index + FO_LIST].split('#-#');
			// Confirm the list of indexes was converted OK.
			if (!is_array(this.m_asField_Set_Ordering[nEntry_Index + FO_LIST])
				|| (this.m_asField_Set_Ordering[nEntry_Index + FO_LIST].length == 0)) {
				return (false);
			}
			nList_Count = this.m_asField_Set_Ordering[nEntry_Index + FO_LIST].length;
			// Loop from here to check each listed index [1 <= index <= #fields].
			for (nx=0; nx<nList_Count; nx++) {
				if ((this.m_asField_Set_Ordering[nEntry_Index + FO_LIST][nx] < 1)
					|| (this.m_asField_Set_Ordering[nEntry_Index + FO_LIST][nx] > this.m_nField_Count)) {
					alert('Ordering definition error.');
					return (false);
				}
			}
			nCurrent_Group++;
		}

		nEntry_Index += DATAFIELD_SET_UNIT_LENGTH;
	}

	return (true);
}


/**
 *	Extract the indexing definition from its downloaded response-oriented format
 *	to an internal format more readily processed when generating a new display.
 *
 *	@private
 *
 *  @return	True if successful, otherwise false.
 *  @type	boolean
 */

Datatable_Controller.prototype.build_indexing_definition = function()
{
	var nx = 0;
	var np = 0;
	var nIndex_Position = 0;
	var nPossible_Index_Field_Count = 0;
	var nField_Definition_Length = this.m_asField_Set_Definition.length;

	this.m_asField_Set_Indexing = Array();

	for (nx=0; nx<nField_Definition_Length; nx++) {
		nIndex_Position = this.is_index_field(this.m_asField_Set_Definition[np + FS_CODE]);
		if (nIndex_Position > 0) {
			if (is_undefined(this.m_asField_Set_Indexing[nIndex_Position - 1])) {
				this.m_asField_Set_Indexing[nIndex_Position - 1] = this.m_asField_Set_Definition[np + FS_NAME];
			}
			else {
				this.m_asField_Set_Indexing = Array();
				return (false);
			}
		}
		np += DATAFIELD_SET_UNIT_LENGTH;
	}

	nPossible_Index_Field_Count = this.m_asField_Set_Indexing.length;
	for (nx=0; nx<nPossible_Index_Field_Count; nx++) {
		if (is_undefined(this.m_asField_Set_Indexing[nx])) {
			this.m_asField_Set_Indexing = Array();
			return (false);
		}
	}

	return (true);
}


/**
 *	Get the field filter set for a dataset.
 *
 *	@return	Dataset filter set as a numeric array, or empty array on error.
 *	@type	array
 */

Datatable_Controller.prototype.get_dataset_filter_set = function()
{
	return (Array());
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

Datatable_Controller.prototype.get_activated_row_details = function(a_eActive_Element, a_asDetails_List)
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

Datatable_Controller.prototype.print_state = function()
{
	return ('[Datatable_Controller]'
			+ '\nDisplay name = ' + this.m_sDisplay_Name
			+ '\nDisplay label = ' + this.m_sDisplay_Label
			+ '\nActive display = ' + this.m_sActive_Display
			+ '\nDataset name = ' + this.m_sDataset_Name
//			+ '\nContent retrieved flag = ' + this.m_bContent_Retrieved
			+ '\nField count = ' + this.m_nField_Count);
}


//******************************************************************************


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */
/*
Panel_Controller.prototype.print_state = function() {
	var sPanel_List = '';
	var nx = 0;

	for (xx in this.m_arDisplay_List) {
		nx++;
		sPanel_List += '\nPanel ' + nx + '.  --  \'' + xx + '\'\n'
					+ this.m_arDisplay_List[xx].print_state();
	}

	return ('[Panel_Controller]'
			+ '\nDedicated message panel = \'' + this.m_sMessage_Section + '\''
			+ '\nProp = \'' + this.m_sProp_ID + '\''
			+ '\nActive display = \'' + this.m_sActive_Display + '\''
			+ sPanel_List);
}
*/

/**
 *	Hide all tab panels. Note all tab panels are hidden temporarily (brute force)
 *	when switching the display to a new panel.
 *
 *	@private
 *
 *	@return	none
 *	@type	void
 */
/*
Panel_Controller.prototype.hide_all_panels = function()
{
	for (xx in this.m_aePanel_List) {
		this.m_aePanel_List[xx].style.display = 'none';
	}
}
*/

/**
 *	Display/hide a data-is-loading message.
 *
 *	The message is held in a normally hidden dedicated panel 'div' which
 *	must be identified in the initial call to the constructor.
 *
 *	It is temporarily made visible when switching the display to a new
 *	panel to cover any delay when loading the data from the server for
 *	the newly selected panel.
 *
 *	@private
 *	@param	{boolean} a_bOn True to display the message. False to hide it.
 *
 *	@return	none
 *	@type	void
 */
/*
Panel_Controller.prototype.display_loading_message = function(a_bOn)
{
	if (a_bOn == true) {
		this.m_eMessage_Panel.style.display = '';
	}
	else {
		this.m_eMessage_Panel.style.display = 'none';
	}
}
*/

//******************************************************************************


/**
 *  Return the full list of field names in the original order.
 *	The field list is returned in the array argument.
 *
 *	@param	{array} a_asField_List An empty array to receive the list of field names
 *
 *  @return	none
 *  @type	void
 */

Datatable_Controller.prototype.get_full_field_list = function(a_asField_List)
{
	var np = 0;
	for (var nx=0; nx<this.m_nField_Count; nx++) {
		a_asField_List[nx] = this.m_asField_Set_Definition[np];
		np += DATAFIELD_SET_UNIT_LENGTH;
	}
}


/**
 *  Return a field description (from the field set).
 *
 *	@param	{string} a_sField_Label The field name (as used within eRA).
 *
 *  @return	The field description or empty string if not found.
 *  @type	string
 */

Datatable_Controller.prototype.get_field_description = function(a_sField_Label)
{
	if ((this.m_asField_Set_Definition.length % DATAFIELD_SET_UNIT_LENGTH) != 0) {
		alert('get_field_description() -- field set error');
		return ('');
	}

	var nField_Definition_Length = this.m_asField_Set_Definition.length;
	for (var nx=0; nx<nField_Definition_Length; nx+=DATAFIELD_SET_UNIT_LENGTH) {
		if (this.m_asField_Set_Definition[nx + FS_NAME] == a_sField_Label) {
			return (this.m_asField_Set_Definition[nx + FS_DESC]);
		}
	}

	return ('');
}


/**
 *  Is this the field code for an index field.
 *
 *	@param	{number} a_sField_Code The multi-encoded field type code a field being inspected.
 *
 *  @return	The index position for index fields (1..n), otherwise zero.
 *  @type	number
 */

Datatable_Controller.prototype.is_index_field = function(a_nField_Code)
{
    return(int_div(a_nField_Code, DT_INDEX));
}


/**
 *  Return a field data-type (from the field set).
 *
 *	@param	{string} a_sField_Label The field name (as used within eRA).
 *
 *  @return	The field data-type or zero if not found.
 *  @type	integer
 */

Datatable_Controller.prototype.get_field_datatype = function(a_sField_Label)
{
	var nType_Code = 0;

	if ((this.m_asField_Set_Definition.length % DATAFIELD_SET_UNIT_LENGTH) != 0) {
		alert('get_field_description() -- field set error');
		return ('');
	}

	var nField_Definition_Length = this.m_asField_Set_Definition.length;
	for (var nx=0; nx<nField_Definition_Length; nx+=DATAFIELD_SET_UNIT_LENGTH) {
		if (this.m_asField_Set_Definition[nx + FS_NAME] == a_sField_Label) {
			nType_Code = this.m_asField_Set_Definition[nx + FS_CODE] % DT_INDEX;
			break;
		}
	}

	return (nType_Code);
}


/**
 *  Return preview information from the field set for a field display extension row.
 *
 *	@param	{string} a_sField_Label The field name (as used within eRA).
 *
 *  @return	The full data preview string for the specified field or empty string if not found.
 *  @type	string
 */

Datatable_Controller.prototype.get_field_extension_data = function(a_sField_Label)
{
	if ((this.m_asField_Set_Definition.length % DATAFIELD_SET_UNIT_LENGTH) != 0) {
		alert('get_field_extension_data() -- field set error');
		return ('');
	}

	var nField_Definition_Length = this.m_asField_Set_Definition.length;
	for (var nx=0; nx<nField_Definition_Length; nx+=DATAFIELD_SET_UNIT_LENGTH) {
		if (this.m_asField_Set_Definition[nx + FS_NAME] == a_sField_Label) {
			return (this.m_asField_Set_Definition[nx + FS_PREV]);
		}
	}

	return ('');
}


/**
 *	Return a list of the data values from the field preview string.
 *
 *	@private
 *	@param	{array} a_sPreview_String The full data preview string for the field being processed.
 *
 *	@return	The list of data values as a simple numeric array, or an empty array if none found.
 *  @type	array
 */

Datatable_Controller.prototype.get_field_data_values = function(a_sPreview_String)
{
	if ( (a_sPreview_String == undefined)
		|| (a_sPreview_String == null)
		|| (a_sPreview_String == '') ) {
		return (Array());
	}

	var asFull_Preview_List = a_sPreview_String.split('#-#');
	if (asFull_Preview_List.length < 2) {
		return (Array());
	}

	// Lose the prefixed type field.
	return (asFull_Preview_List.slice(1));
}


/**
 *	Determine if the preview data for a field is valid/searchable.
 *
 *	@private
 *
 *	@return	True if preview data is valid/searchable, otherwise false.
 *  @type	boolean
 */

Datatable_Controller.prototype.extension_data_is_selectable = function(a_sPreview_String)
{
	if ( (a_sPreview_String == undefined)
		|| (a_sPreview_String == null)
		|| (a_sPreview_String == '') ) {
		return (false);
	}

	var asContent_List = a_sPreview_String.split('#-#');
	if (asContent_List.length < 2) {
		return (false);
	}

	switch (parseInt(asContent_List[0], 10)) {

	case QB_VALUE :
	case QB_RANGE :
	case QB_LIST :
	case QB_TAX_LIST :	return (true);

	default :			return (false);

	}
}


/**
 *	Determine if the field preview data should be displayed as a list.
 *
 *	@private
 *
 *	@return	True if preview data is a list type, otherwise false.
 *  @type	boolean
 */

Datatable_Controller.prototype.extension_data_is_list = function(a_sPreview_String)
{
	if ( (a_sPreview_String == undefined)
		|| (a_sPreview_String == null)
		|| (a_sPreview_String == '') ) {
		return (false);
	}

	var asContent_List = a_sPreview_String.split('#-#');
	if (asContent_List.length < 2) {
		return (false);
	}

	switch (parseInt(asContent_List[0], 10)) {

	case QB_NONE :
	case QB_ONE :
	case QB_VALUE :
	case QB_RANGE :		return (false);

	case QB_LIST :
	case QB_TAX_LIST :	return (true);

	default :			return (false);

	}
}


/**
 *	Determine if the field preview data should be displayed as a taxonomic list.
 *
 *	@private
 *
 *	@return	True if preview data is a taxonomic list type, otherwise false.
 *  @type	boolean
 */

Datatable_Controller.prototype.extension_data_is_tax_list = function(a_sPreview_String)
{
	if ( (a_sPreview_String == undefined)
		|| (a_sPreview_String == null)
		|| (a_sPreview_String == '') ) {
		return (false);
	}

	var asContent_List = a_sPreview_String.split('#-#');
	if (asContent_List.length < 2) {
		return (false);
	}

	switch (parseInt(asContent_List[0], 10)) {

	case QB_NONE :
	case QB_ONE :
	case QB_VALUE :
	case QB_RANGE :
	case QB_LIST :		return (false);

	case QB_TAX_LIST :	return (true);

	default :			return (false);

	}
}


/**
 *  Return the organising type for the extension row preview information specified.
 *
 *	@private
 *
 *  @return	The type for the preview information specified, otherwise the code for UNKNOWN.
 *  @type	integer
 */

Datatable_Controller.prototype.get_field_extension_type = function(a_sPreview_String)
{
	if ( (a_sPreview_String == undefined)
		|| (a_sPreview_String == null)
		|| (a_sPreview_String == '') ) {
		return (QB_UNKNOWN);
	}

	var asContent_List = a_sPreview_String.split('#-#');
	if (asContent_List.length < 2) {
		return (QB_UNKNOWN);
	}

	switch (parseInt(asContent_List[0], 10)) {

	case QB_NONE :			return (QB_NONE);

	case QB_ONE :			return (QB_ONE);

	case QB_VALUE :			return (QB_VALUE);

	case QB_RANGE :			return (QB_RANGE);

	case QB_LIST :			return (QB_LIST);

	case QB_TAX_LIST :		return (QB_TAX_LIST);

	case QB_GROUP_LIST :	return (QB_GROUP_LIST);

	default :				return (QB_UNKNOWN);

	}
}


/**
 *	Return a formatted string displaying all preview values for the extension row preview information specified.
 *
 *	@private
 *
 *	@return	The fully formatted preview values for display in the extension row or a message string.
 *  @type	string
 */

Datatable_Controller.prototype.format_field_extension_content = function(a_sPreview_String)
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
							return ('text values ...');
						}
						return ('text values such as: ' + asContent_List[1]);

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

	default :			return 'unknown content type';

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

Datatable_Controller.prototype.create_field_extension_row = function(a_ePrimary_Display_Row, a_sExtension_Content)
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
	if ((aeExtension_Cells.length >= 3)
		&& (aeExtension_Cells[3].firstChild.nodeType == 3)) {
		aeExtension_Cells[3].firstChild.nodeValue = a_sExtension_Content;
		// This works because there is always a footer row on the table.
		a_ePrimary_Display_Row.parentNode.insertBefore(eRow_Extension, eNext_Row);
	}

	return (eRow_Extension);
}


/**
 *	Initiate dataset field extraction into a new browser window.
 *
 *	@private
 *
 *	@return	none
 *	@type	void
 */

Datatable_Controller.prototype.request_data_extraction = function()
{
	extract_count++;
	var extract_name = 'era_' + extract_count;
	var sTarget_Page = ((!is_testcheck_set(0)) ? EXTRACT_PAGE_URL : ECHO_PAGE_URL);

	var eDataset_Element = document.getElementById(this.m_sDataset_Element);
	if (!eDataset_Element) {
		alert("Dataset value element '" + this.m_sDataset_Element + "' no longer exists.");
		return;
	}
	//eDataset_Element.value = this.m_sDataset_Name;
	eDataset_Element.value = this.m_sDisplay_Name;

	if (!this.m_arDisplay_List[this.m_sDatafilter_Display].create_value_elements()) {
		return;
	}

	if (!this.m_arDisplay_List[this.m_sExtract_Display].create_sort_elements()) {
		return;
	}

//	var jim = window.open('about:blank', 'fred', 'height=400, width=600, menubar=yes, toolbar=yes, '
//						+ 'location=no, status=yes, resizable=yes, scrollbars=yes, directories=no');
	var jim = window.open('about:blank', extract_name, 'height=400, width=600, menubar=yes, toolbar=yes, '
						+ 'location=no, status=yes, resizable=yes, scrollbars=yes, directories=no');
	jim.moveTo(100, 100);

	var myform = document.getElementById(this.m_sForm_Element);
	myform.target = extract_name;
	myform.action = sTarget_Page;
	myform.submit();

	jim.focus();
	//alert('end-of-request_data_extraction()');
}


/**
 *  Return the text-symbol equivalent of a panel operational display state.
 *
 *	@private
 *	@param	{array} a_nState A numeric operational display state.
 *
 *  @return	none
 *  @type	void
 */

Datatable_Controller.prototype.format_descriptor_state = function(a_nState)
{
	var sState_Symbol = 'DS_UNKNOWN';

	switch (a_nState) {

	case DS_INIT:	sState_Symbol = 'DS_INIT';
					break;

	case DS_LOAD:	sState_Symbol = 'DS_LOAD';
					break;

	case DS_EXEC:	sState_Symbol = 'DS_EXEC';
					break;

	case DS_FAIL:	sState_Symbol = 'DS_FAIL';
					break;

	default:		sState_Symbol = 'DS_UNKNOWN';
					break;
	}

	return (sState_Symbol);
}


/* -+- */


