/**
 *  @fileoverview The class Display_Factory constructs all Display objects.
 *
 *	@version 0.3.1  [15.12.2006]
 *	@version 0.3.2  [15.3.2007]
 *	@version 0.3.3  [23.4.2007]
 *	@version 0.3.4  [6.7.2007]
 *	@version 0.5.1  [9.11.2007]		// field-set definitions downloaded + message section
 *	@version 0.5.2  [12.11.2007]
 *	@version 0.6.1  [17.7.2008]		// start of prototype 6
 *	@version 0.6.2  [18.7.2008]
 */


//--------------------------------------------------------------------------------------------------
//
// Configuration table-entry indexes.

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
 *	Constructor for the Display_Factory class.
 *	@class	The class Display_Factory creates and configures all panel display
 *	objects, simple and composite, and all section display objects.
 *
 *	This is not the GoF way of implementing a Factory but it's suited to the
 *	JavaScript O-O environment. It encapsulates the information required to
 *	create all display objects. It also eases the translation from a display
 *	name string to the classes supporting that display type.
 *
 *	@constructor
 *	@param	{object} a_Selection_Display The panel selection display handler.
 *
 *	@return	none
 *	@type	void
 */

function Display_Factory()
{
	/**
	 *	Holding area for the configuration information for the current display.
	 *	@type	array
	 */
	this.m_aDisplay_Config = null;
}


/**
 *  Build and return a new panel display object and any associated support objects.
 *
 *	@param	{string} a_sDisplay_Name A unique application-wide name for the display panel.
 *	@param	{string} a_sDisplay_Set_Name If applicable, the Set the display name belongs to.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s).
 *			plus any support objects, if applicable, in a standard preset order.
 *
 *  @return	True if all object creation was successful, otherwise false.
 *  @type	boolean
 */


Display_Factory.prototype.make_new_panel = function(a_sDisplay_Name, a_sDisplay_Type, a_arObject_Set)
{
	if (a_arObject_Set.length != 0) {
		log_msg('make_new_panel() was given a non-empty object set.');
		return (false);
	}

	// Get the display type that implements this display panel.
	this.m_aDisplay_Config = this.get_display_config(a_sDisplay_Type);
	if (this.m_aDisplay_Config == null) {
		// Error message already output.
		log_msg('make_new_panel() failed to get display configuration for \'' + a_sDisplay_Type + '\'.');
		return (false);
	}

	var bResult_Status = false;
	switch (a_sDisplay_Type) {

	case 'main_controller':
				bResult_Status = this.make_main_controller(a_sDisplay_Name, a_arObject_Set);
				break;

	case 'main_selector':
				bResult_Status = this.make_main_selector(a_sDisplay_Name, a_arObject_Set);
				break;

	case 'loading_switching':
				bResult_Status = this.make_message_panel(a_sDisplay_Name, a_arObject_Set);
				break;

	case 'user_info':
				//bResult_Status = this.make_direct_panel(a_sDisplay_Name, a_arObject_Set);
				bResult_Status = this.make_tabbed_panel(a_sDisplay_Name, a_arObject_Set);
				break;

	case 'user_session':
				bResult_Status = this.make_session_panel(a_sDisplay_Name, a_arObject_Set);
				break;

	case 'dataset_type':
				bResult_Status = this.make_dataset_panel(a_sDisplay_Name, a_arObject_Set);
				break;

	case 'datafield_type':
				bResult_Status = this.make_datafield_panel(a_sDisplay_Name, a_arObject_Set);
				break;

	default:	log_msg('make_new_panel() found unhandled display type \''
					  + a_sDisplay_Type + '\' for \'' + a_sDisplay_Name + '\'.');
				bResult_Status = false;
	}

	return (bResult_Status);
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Display_Factory.prototype.print_state = function()
{
	return ('[Display_Factory]');
}


/**
 *	Build a new main panel controller.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the controller.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, no support objects.
 *
 *	@return	True if object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_main_controller = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Controller = null;
	var sElement_Name = '';
	var asElement_List = null;
	var bConfigured_OK = false;

	New_Controller = new Panel_Controller(a_sDisplay_Name);
	sElement_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	bConfigured_OK = New_Controller.set_element_names(sElement_Name, asElement_List);
	if (!bConfigured_OK) {
		log_msg('make_main_controller() failed to configure new controller \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Controller;
	return (true);
}


/**
 *	Build a new main panel selector.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the selector.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, no support objects.
 *
 *	@return	True if object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_main_selector = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Selector = null;
	var sElement_Name = '';
	var asElement_List = null;
	var bConfigured_OK = false;

	New_Selector = new Panel_Tabset(a_sDisplay_Name);
	sElement_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	bConfigured_OK = New_Selector.set_element_names(sElement_Name, asElement_List);
	if (!bConfigured_OK) {
		log_msg('make_main_selector() failed to configure new selector \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Selector;
	return (true);
}


/**
 *	Build a new loading/switching message display panel.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the display panel.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, no support objects.
 *
 *	@return	True if display object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_message_panel = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Display = null;
	var sElement_Name = '';
	var asElement_List = null;
	var bConfigured_OK = false;

	New_Display = new Direct_Display(a_sDisplay_Name);
	sElement_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	bConfigured_OK = New_Display.set_element_names(sElement_Name, asElement_List);
	if (!bConfigured_OK) {
		log_msg('make_message_panel() failed to configure new display panel \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Display;
	return (true);
}


/**
 *	Build a new direct/simple display panel.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the display panel.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, no support objects.
 *
 *	@return	True if display object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_direct_panel = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Display = null;
	var sElement_Name = '';
	var asElement_List = null;
	var bConfigured_OK = false;

	New_Display = new Direct_Display(a_sDisplay_Name);
	sElement_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	bConfigured_OK = New_Display.set_element_names(sElement_Name, asElement_List);
	if (!bConfigured_OK) {
		log_msg('make_direct_panel() failed to configure new display panel \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Display;
	return (true);
}


/**
 *	Build a new direct tabbed display panel.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the display panel.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, no support objects.
 *
 *	@return	True if display object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_tabbed_panel = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Display = null;
	var sPanel_Element_Name = '';
	var asElement_List = null;

	New_Display = new Tabbed_Display(a_sDisplay_Name);
	sPanel_Element_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	if (!New_Display.set_element_names(sPanel_Element_Name, asElement_List)) {
		log_msg('make_tabbed_panel() failed to configure new display panel \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Display;
	return (true);
}


/**
 *	Build a new user info display panel.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the display panel.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, no support objects.
 *
 *	@return	True if display object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_info_panel = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Display = null;
	var sElement_Name = '';
	var asElement_List = null;
	var bConfigured_OK = false;

	New_Display = new Direct_Display(a_sDisplay_Name);
	sElement_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	bConfigured_OK = New_Display.set_element_names(sElement_Name, asElement_List);
	if (!bConfigured_OK) {
		log_msg('make_info_panel() failed to configure new display panel \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Display;
	return (true);
}


/**
 *	Build a new user session display panel.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the display panel.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, no support objects.
 *
 *	@return	True if display object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_session_panel = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Display = null;
	var sElement_Name = '';
	var asElement_List = null;
	var bConfigured_OK = false;

	New_Display = new Session_Display(a_sDisplay_Name);
	sElement_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	bConfigured_OK = New_Display.set_element_names(sElement_Name, asElement_List);
	if (!bConfigured_OK) {
		log_msg('make_session_panel() failed to configure new display panel \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Display;
	return (true);
}


/**
 *	Build a new dataset display panel.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique application-wide name for the display panel
 *			and also the dataset group it displays.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, a mapper object to restore the table selection state.
 *
 *	@return	True if all object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_dataset_panel = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Display = null;
	var New_Mapper = null;
	var sPanel_Element_Name = '';
	var asElement_List = Array();

	New_Display = new Dataset_Table(a_sDisplay_Name);
	sPanel_Element_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	if (!New_Display.set_element_names(sPanel_Element_Name, asElement_List)) {
		log_msg('make_dataset_panel() failed to configure new display panel \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	New_Mapper = new Dataset_Mapper(New_Display);

	a_arObject_Set[0] = New_Display;
	a_arObject_Set[1] = New_Mapper;

	if (this.get_section_count(this.m_aDisplay_Config) > 0) {
		if (!this.make_all_sections(New_Display)) {
			log_msg('make_dataset_panel() failed to add all sections to display panel \'' + a_sDisplay_Name + '\'.');
			return (false);
		}
	}

	return (true);
}


/**
 *	Build a new dataset fields display panel.
 *
 *	@private
 *	@param	{string} a_sDisplay_Name The unique run-time server-specified name for the display panel.
 *	@param	{array} a_arObject_Set An empty array to receive the new display object(s),
 *			and in this case, ...
 *
 *	@return	True if all object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_datafield_panel = function(a_sDisplay_Name, a_arObject_Set)
{
	var New_Display = null;
	var sPanel_Element_Name = '';
	var asElement_List = Array();

//	New_Display = new Datafield_Table(a_sDisplay_Name);
	New_Display = new Datatable_Controller(a_sDisplay_Name);
	sPanel_Element_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	if (!New_Display.set_element_names(sPanel_Element_Name, asElement_List)) {
		log_msg('make_datafield_panel() failed to configure new display panel \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Display;

	if (this.get_section_count(this.m_aDisplay_Config) > 0) {
		if (!this.make_all_sections(New_Display)) {
			log_msg('make_datafield_panel() failed to add all sections to display panel \'' + a_sDisplay_Name + '\'.');
			return (false);
		}
	}

	return (true);
}


/**
 *  Build and configure all required section objects for a new panel display object.
 *
 *	@private
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *
 *  @return	True if panel object configuration was successful, otherwise false.
 *  @type	boolean
 */

Display_Factory.prototype.make_all_sections = function(a_rSection_Parent)
{
	var sSection_Name = '';
	var arLocal_Object_Set = null;
	var nSection_Count = this.get_section_count(this.m_aDisplay_Config);

	if (nSection_Count == 0) {
		return (true);
	}

	for (var nx=0; nx<nSection_Count; nx++) {
		sSection_Name = this.get_section_name(nx, this.m_aDisplay_Config);
		arLocal_Object_Set = Array();
		if (!this.make_new_section(nx, a_rSection_Parent, arLocal_Object_Set)) {
			log_msg('make_all_sections() failed make the \'' + sSection_Name 
					+ '\' section for display panel \'' + a_rSection_Parent.m_sDisplay_Name + '\'.');
			return (false);
		}
		if (!a_rSection_Parent.add_panel_section(sSection_Name, arLocal_Object_Set)) {
			log_msg('make_all_sections() failed to configure the \'' + sSection_Name 
					+ '\' section for display panel \'' + a_rSection_Parent.m_sDisplay_Name + '\'.');
			return (false);
		}
	}

	return (true);
}


/**
 *  Build and return the required section objects for a new panel display object.
 *
 *	@private
 *	@param	{integer} a_nSection_Number The index to the section config entry.
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *	@param	{array} a_arObject_Set The display object array to append with the new section object(s).
 *
 *  @return	True if section object creation was successful, otherwise false.
 *  @type	boolean
 */

Display_Factory.prototype.make_new_section = function(a_nSection_Number, a_rSection_Parent, a_arObject_Set)
{
	var bResult_Status = false;
	var sSection_Type = this.get_section_type(a_nSection_Number, this.m_aDisplay_Config);

	switch (sSection_Type) {

	case 'direct_type':
				bResult_Status = this.make_direct_section(a_nSection_Number, a_rSection_Parent, a_arObject_Set);
				break;

	case 'datatab_section_type':
				bResult_Status = this.make_datatab_section(a_nSection_Number, a_rSection_Parent, a_arObject_Set);
				break;

	case 'datamsg_section_type':
				bResult_Status = this.make_datamsg_section(a_nSection_Number, a_rSection_Parent, a_arObject_Set);
				break;

	case 'datafield_section_type':
				bResult_Status = this.make_datafield_section(a_nSection_Number, a_rSection_Parent, a_arObject_Set);
				break;

	case 'datafilter_section_type':
				bResult_Status = this.make_datafilter_section(a_nSection_Number, a_rSection_Parent, a_arObject_Set);
				break;

	case 'extract_section_type':
				bResult_Status = this.make_extract_section(a_nSection_Number, a_rSection_Parent, a_arObject_Set);
				break;

	default:	log_msg('make_new_section() found unhandled section type \''
					  + sSection_Type + '\' for display panel \'' + a_rSection_Parent.m_sDisplay_Name + '\'.');
				bResult_Status = false;
	}

	return (bResult_Status);
}


/**
 *	Build a new direct/simple section.
 *
 *	@private
 *	@param	{integer} a_nSection_Number The index to the section config entry.
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *	@param	{array} a_arObject_Set The display object array to append with the new section object(s).
 *
 *	@return	True if section object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_direct_section = function(a_nSection_Number, a_rSection_Parent, a_arObject_Set)
{
//function this.get_section_count(a_aDisplay_Config)
//function this.get_section_type(a_Section_Number, a_aDisplay_Config)
//function this.get_section_name(a_Section_Number, a_aDisplay_Config)
//function this.get_section_element(a_Section_Number, a_aDisplay_Config)
//function this.is_section_element_list(a_Section_Number, a_aDisplay_Config)
//function this.get_section_element_list(a_Section_Number, a_aDisplay_Config)
	var New_Section = null;
	var sSection_Element_Name = '';
	var asElement_List = Array();
	var bConfigured_OK = false;

	New_Section = new Direct_Display(a_sDisplay_Name);
	sSection_Element_Name = this.get_panel_element(this.m_aDisplay_Config);
	if (this.is_element_list(this.m_aDisplay_Config)) {
		asElement_List = this.get_element_list(this.m_aDisplay_Config);
	}

	bConfigured_OK = New_Section.set_element_names(sSection_Element_Name, asElement_List);
	if (!bConfigured_OK) {
		log_msg('make_direct_section() failed to configure new display section \'' + a_sDisplay_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Section;
	return (true);
}


/**
 *	Build a new dataset fields tab-bar display section.
 *
 *	@private
 *	@param	{integer} a_nSection_Number The index to the section config entry.
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *	@param	{array} a_arObject_Set The display object array to append with the new section object(s).
 *
 *	@return	True if section object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_datatab_section = function(a_nSection_Number, a_rSection_Parent, a_arObject_Set)
{
	var sSection_Name = '';
	var New_Section = null;
	var sSection_Element_Name = '';
	var asElement_List = Array();

	sSection_Name = this.get_section_name(a_nSection_Number, this.m_aDisplay_Config);
	New_Section = new Datatab_Display(sSection_Name, a_rSection_Parent);
	sSection_Element_Name = this.get_section_element(a_nSection_Number, this.m_aDisplay_Config);
	if (this.is_section_element_list(a_nSection_Number, this.m_aDisplay_Config)) {
		asElement_List = this.get_section_element_list(a_nSection_Number, this.m_aDisplay_Config);
	}

	if (!New_Section.set_element_names(sSection_Element_Name, asElement_List)) {
		log_msg('make_datatab_section() failed to configure new display section \'' + sSection_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Section;
	return (true);
}


/**
 *	Build a new dataset fields message display section.
 *
 *	@private
 *	@param	{integer} a_nSection_Number The index to the section config entry.
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *	@param	{array} a_arObject_Set The display object array to append with the new section object(s).
 *
 *	@return	True if section object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_datamsg_section = function(a_nSection_Number, a_rSection_Parent, a_arObject_Set)
{
	var sSection_Name = '';
	var New_Section = null;
	var sSection_Element_Name = '';
	var asElement_List = Array();

	sSection_Name = this.get_section_name(a_nSection_Number, this.m_aDisplay_Config);
	New_Section = new Datamsg_Display(sSection_Name, a_rSection_Parent);
	sSection_Element_Name = this.get_section_element(a_nSection_Number, this.m_aDisplay_Config);
	if (this.is_section_element_list(a_nSection_Number, this.m_aDisplay_Config)) {
		asElement_List = this.get_section_element_list(a_nSection_Number, this.m_aDisplay_Config);
	}

	if (!New_Section.set_element_names(sSection_Element_Name, asElement_List)) {
		log_msg('make_datamsg_section() failed to configure new display section \'' + sSection_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Section;
	return (true);
}


/**
 *	Build a new dataset fields field-table display section.
 *
 *	@private
 *	@param	{integer} a_nSection_Number The index to the section config entry.
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *	@param	{array} a_arObject_Set The display object array to append with the new section object(s).
 *
 *	@return	True if section object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_datafield_section = function(a_nSection_Number, a_rSection_Parent, a_arObject_Set)
{
	var sSection_Name = '';
	var New_Section = null;
	var sSection_Element_Name = '';
	var asElement_List = Array();

	sSection_Name = this.get_section_name(a_nSection_Number, this.m_aDisplay_Config);
	New_Section = new Datafield_Table(sSection_Name, a_rSection_Parent);
	sSection_Element_Name = this.get_section_element(a_nSection_Number, this.m_aDisplay_Config);
	if (this.is_section_element_list(a_nSection_Number, this.m_aDisplay_Config)) {
		asElement_List = this.get_section_element_list(a_nSection_Number, this.m_aDisplay_Config);
	}

	if (!New_Section.set_element_names(sSection_Element_Name, asElement_List)) {
		log_msg('make_datafield_section() failed to configure new display section \'' + sSection_Name + '\'.');
		return (false);
	}

	a_arObject_Set[0] = New_Section;
	return (true);
}


/**
 *	Build a new dataset fields filter-table display section.
 *
 *	@private
 *	@param	{integer} a_nSection_Number The index to the section config entry.
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *	@param	{array} a_arObject_Set The display object array to append with the new section object(s).
 *
 *	@return	True if section object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_datafilter_section = function(a_nSection_Number, a_rSection_Parent, a_arObject_Set)
{
	var sSection_Name = '';
	var New_Section = null;
	var New_Mapper = null;
	var sSection_Element_Name = '';
	var asElement_List = Array();

	sSection_Name = this.get_section_name(a_nSection_Number, this.m_aDisplay_Config);
	New_Section = new Datafilter_Table(sSection_Name, a_rSection_Parent);
	sSection_Element_Name = this.get_section_element(a_nSection_Number, this.m_aDisplay_Config);
	if (this.is_section_element_list(a_nSection_Number, this.m_aDisplay_Config)) {
		asElement_List = this.get_section_element_list(a_nSection_Number, this.m_aDisplay_Config);
	}

	if (!New_Section.set_element_names(sSection_Element_Name, asElement_List)) {
		log_msg('make_datafilter_section() failed to configure new display section \'' + sSection_Name + '\'.');
		return (false);
	}

	New_Mapper = new Datafilter_Mapper(a_rSection_Parent);

	a_arObject_Set[0] = New_Section;
	a_arObject_Set[1] = New_Mapper;
	return (true);
}


/**
 *	Build a new dataset fields extract-order display section.
 *
 *	@private
 *	@param	{integer} a_nSection_Number The index to the section config entry.
 *	@param	{object} a_rSection_Parent The parent/containing display object.
 *	@param	{array} a_arObject_Set The display object array to append with the new section object(s).
 *
 *	@return	True if section object creation and configuration was successful, otherwise false.
 *	@type	boolean
 */

Display_Factory.prototype.make_extract_section = function(a_nSection_Number, a_rSection_Parent, a_arObject_Set)
{
	var sSection_Name = '';
	var New_Section = null;
//	var New_Mapper = null;
	var sSection_Element_Name = '';
	var asElement_List = Array();

	sSection_Name = this.get_section_name(a_nSection_Number, this.m_aDisplay_Config);
	New_Section = new Extract_Display(sSection_Name, a_rSection_Parent);
	sSection_Element_Name = this.get_section_element(a_nSection_Number, this.m_aDisplay_Config);
	if (this.is_section_element_list(a_nSection_Number, this.m_aDisplay_Config)) {
		asElement_List = this.get_section_element_list(a_nSection_Number, this.m_aDisplay_Config);
	}

	if (!New_Section.set_element_names(sSection_Element_Name, asElement_List)) {
		log_msg('make_extract_section() failed to configure new display section \'' + sSection_Name + '\'.');
		return (false);
	}

//	New_Mapper = new Datafilter_Mapper(a_rSection_Parent);

	a_arObject_Set[0] = New_Section;
//	a_arObject_Set[1] = New_Mapper;
	return (true);
}


/*------------------------------------------------------------------------------------------------*/


/**
 *	The accessor for the global map of display type names for named application displays.
 *
 *	@private
 *	@param	{string} a_sDisplay_Type The unique display type.
 *
 *	@return	The configuration entry, or null on error.
 *	@type	array
 */

Display_Factory.prototype.get_display_config = function(a_sDisplay_Type)
{
	// Note the checks were really added to make sure I'd got the literal syntax for the maps right.

	if (typeof(asDisplay_Panel_Map[a_sDisplay_Type]) == 'undefined') {
		log_msg('get_display_config() call for unknown display type \'' + a_sDisplay_Type + '\'.');
		return (null);
	}

	if (!is_array(asDisplay_Panel_Map[a_sDisplay_Type])) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no element list.');
		return (null);
	}

	if ((asDisplay_Panel_Map[a_sDisplay_Type]).length == 0) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found empty element list.');
		return (null);
	}

	if ((asDisplay_Panel_Map[a_sDisplay_Type]).length < PX_ENTRY_COUNT) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found short element list.');
		return (null);
	}

	if (!is_string(asDisplay_Panel_Map[a_sDisplay_Type][PX_ELEMENT_ID])) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no panel element name.');
		return (null);
	}

	if ((asDisplay_Panel_Map[a_sDisplay_Type][PX_ELEMENT_ID]).length == 0) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found null panel element name.');
		return (null);
	}

	if (!is_array(asDisplay_Panel_Map[a_sDisplay_Type][PX_ELEMENT_LIST])) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no panel element list.');
		return (null);
	}

	// For now say that empty panel element lists are OK.

	if (!is_number(asDisplay_Panel_Map[a_sDisplay_Type][PX_SECTION_COUNT])) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no section count.');
		return (null);
	}

	if ((asDisplay_Panel_Map[a_sDisplay_Type]).length != (PX_ENTRY_COUNT + (SX_ENTRY_COUNT * asDisplay_Panel_Map[a_sDisplay_Type][PX_SECTION_COUNT]))) {
		log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found bad length config entry.');
		return (null);
	}

	for (var nx=0; nx<asDisplay_Panel_Map[a_sDisplay_Type][PX_SECTION_COUNT]; nx++) {
		if (!is_string(asDisplay_Panel_Map[a_sDisplay_Type][PX_ENTRY_COUNT + (SX_ENTRY_COUNT * nx) + SX_SECTION_ID])) {
			log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no section name.');
			return (null);
		}

		if ((asDisplay_Panel_Map[a_sDisplay_Type][PX_ENTRY_COUNT + (SX_ENTRY_COUNT * nx) + SX_SECTION_ID]).length == 0) {
			log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found null section name.');
			return (null);
		}

		if (!is_string(asDisplay_Panel_Map[a_sDisplay_Type][PX_ENTRY_COUNT + (SX_ENTRY_COUNT * nx) + SX_SECTION_TYPE])) {
			log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no section type.');
			return (null);
		}

		if ((asDisplay_Panel_Map[a_sDisplay_Type][PX_ENTRY_COUNT + (SX_ENTRY_COUNT * nx) + SX_SECTION_TYPE]).length == 0) {
			log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found null section type.');
			return (null);
		}

		if (!is_string(asDisplay_Panel_Map[a_sDisplay_Type][PX_ENTRY_COUNT + (SX_ENTRY_COUNT * nx) + SX_ELEMENT_ID])) {
			log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no section element name.');
			return (null);
		}

		if ((asDisplay_Panel_Map[a_sDisplay_Type][PX_ENTRY_COUNT + (SX_ENTRY_COUNT * nx) + SX_ELEMENT_ID]).length == 0) {
			log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found null section element name.');
			return (null);
		}

		if (!is_array(asDisplay_Panel_Map[a_sDisplay_Type][PX_ENTRY_COUNT + (SX_ENTRY_COUNT * nx) + SX_ELEMENT_LIST])) {
			log_msg('get_display_config() call for display type \'' + a_sDisplay_Type + '\' found no section element list.');
			return (null);
		}

		// For now say that empty section template lists are OK.
	}

    return (asDisplay_Panel_Map[a_sDisplay_Type]);
}

/*
Display_Factory.prototype.get_panel_type = function(a_aDisplay_Config)
{
	return (a_aDisplay_Config[0]);
}
*/

Display_Factory.prototype.get_panel_element = function(a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_ELEMENT_ID]);
}


Display_Factory.prototype.is_element_list = function(a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_ELEMENT_LIST].length > 0);
}


Display_Factory.prototype.get_element_list = function(a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_ELEMENT_LIST]);
}


Display_Factory.prototype.get_section_count = function(a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_SECTION_COUNT]);
}


// For section numbers base zero.
Display_Factory.prototype.get_section_name = function(a_nSection_Number, a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_ENTRY_COUNT + (SX_ENTRY_COUNT * a_nSection_Number) + SX_SECTION_ID]);
}


// For section numbers base zero.
Display_Factory.prototype.get_section_type = function(a_nSection_Number, a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_ENTRY_COUNT + (SX_ENTRY_COUNT * a_nSection_Number) + SX_SECTION_TYPE]);
}


// For section numbers base zero.
Display_Factory.prototype.get_section_element = function(a_nSection_Number, a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_ENTRY_COUNT + (SX_ENTRY_COUNT * a_nSection_Number) + SX_ELEMENT_ID]);
}


// For section numbers base zero.
Display_Factory.prototype.is_section_element_list = function(a_nSection_Number, a_aDisplay_Config)
{
	return ((a_aDisplay_Config[PX_ENTRY_COUNT + (SX_ENTRY_COUNT * a_nSection_Number) + SX_ELEMENT_LIST]).length > 0);
}


// For section numbers base zero.
Display_Factory.prototype.get_section_element_list = function(a_nSection_Number, a_aDisplay_Config)
{
	return (a_aDisplay_Config[PX_ENTRY_COUNT + (SX_ENTRY_COUNT * a_nSection_Number) + SX_ELEMENT_LIST]);
}


/* -+- */


