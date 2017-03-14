/**
 *  @fileoverview This module is closely coupled with the display factory.
 *	Its pre-configured maps specify both the HTML template elements and the
 *	display types used for each unique display panel and display section name.
 *	Display panel names that are set at run-time use a predefined placeholder
 *	(a name type) to map to the required elements.
 *
 *	For structured display panels the maps also specify their display sections
 *	and the elements required. This must correspond with the HTML template layout.
 *
 *	@version 0.1.9  [23.1.2007]
 *	@version 0.1.10  [29.1.2007]
 *	@version 0.1.11  [15.3.2007]
 *	@version 0.1.12  [13.4.2007]
 *	@version 0.1.14  [2.5.2007]
 *	@version 0.1.15  [6.7.2007]
 *	@version 0.5.1  [9.11.2007]		// field-set definitions downloaded + message section
 *	@version 0.5.2  [12.11.2007]
 *	@version 0.6.1  [11.7.2008]		// start of prototype 6
 *	@version 0.6.3  [18.7.2008]
 *	@version 0.6.5  [4.9.2008]
 */

// Left just in case it is later encapsulated in a class.
/**
 *	Constructor for the Display_Factory class.
 *	@class	The class Display_Factory creates and configures Panel_Display
 *	objects. There is more than one operational type of Panel_Display object
 *	but they all support a common interface for use by the panel controller.
 *
 *	@constructor
 *
 *	@return	none
 *	@type	void
 */
/*
 function Display_Config()
 {

 }
 */

/* -------------------------------------------------------------------------- */

/**
 * The unique application display names mapped to their display type name and
 * their page-based HTML template element IDs. Declared using object literal
 * syntax (for convenience) but accessed as an associative array of arrays.
 * 
 * @type array
 */
var asDisplay_Panel_Map = {

	'main_controller' : [ 'display_panel', [ 'prop', 'loading_message' ], 0 ],

	'main_selector' : [ 'tab_area',
			[ 'nav_links', 'tab_note', 'hide_tab_note' ], 0 ],

	'loading_switching' : [ 'loading_message', [], 0 ],

	'user_info' : [
			'user_guide',
			[ 'user_guide_tab_section', 'user_guide_selections',
					'user_guide_summary_section', 'user_guide_browse_section',
					'user_guide_extract_section', 'user_guide_filter_section',
					'user_guide_retrieve_section' ], 0 ],

	'user_session' : [
			'user_panel',
			[ 'user_panel_form', 'user_name', 'pass_word', 'panel_login',
					'panel_logout', 'user_panel_progress' ], 0 ],

	'fred_zero' : 0,
	'fred_nullinfo' : [],
	'fred_shortinfo' : [ 0, 0, 0 ],
	'fred_zeroinfo' : [ 0, 0, 0, 0 ],
	'fred_typelessinfo' : [ '', 0, 0, 0 ],
	'fred_typeinfo' : [ 'type', 0, 0, 0 ],
	'fred_panellessinfo' : [ 'type', '', 0, 0 ],
	'fred_lastinfo' : [ 'type', 'panel', 0, 0 ],
	'fred_stringinfo' : [ 'type', 'panel', [], 'section_count' ],
	'fred_lengthinfo' : [ 'type', 'panel', [], 1, '' ],
	'fred_length2info' : [ 'type', 'panel', [], 1, '', [], 0 ],
	'fred_firstnameinfo' : [ 'type', 'panel', [], 1, 0, [] ],
	'fred_firstnamelessinfo' : [ 'type', 'panel', [], 1, '', [] ],
	'fred_firstsectionlessinfo' : [ 'type', 'panel', [], 1, 'section', 0 ],
	'fred_secondnameinfo' : [ 'type', 'panel', [], 2, 'section', [], 0, [] ],
	'fred_secondnamelessinfo' : [ 'type', 'panel', [], 2, 'section', [], '', [] ],
	'fred_secondsectionlessinfo' : [ 'type', 'panel', [], 2, 'section', [],
			'section2', 0 ],

	'dataset_type' : [
			'dataset_listing',
			[ 'dataset_listing_table', 'dataset_listing_table_base',
					'dataset_listing_empty_row',
					'dataset_listing_clonable_row',
					'dataset_listing_clonable_group_title_row',
					'dataset_listing_grouping', 'dataset_listing_column_help' ],
			0 ],

	'datafield_type' : [
			'datafield_listing',
			[ 'datafield_listing_form', 'datafield_listing_dataset' ],
			5,

			'tabs',
			'datatab_section_type',
			'datafield_listing_tab_section',
			[ 'datafield_listing_selections' ],

			'message',
			'datamsg_section_type',
			'datafield_listing_message_section',
			[ 'datafield_listing_message' ],

			'fields',
			'datafield_section_type',
			'datafield_listing_table_section',
			[ 'datafield_listing_table', 'datafield_listing_table_base',
			  'datafield_listing_select_all',
					'datafield_listing_empty_row',
					'datafield_listing_clonable_row',
					'datafield_listing_clonable_extension_row',
					'datafield_listing_clonable_group_title_row',
					'datafield_listing_grouping',
					'datafield_listing_column_help', 'plus.png', 'minus.png' ],

			'filters',
			'datafilter_section_type',
			'datafilter_listing_table_section',
			[ 'datafilter_listing_table', 'datafilter_listing_table_base',
					'datafilter_listing_empty_row',
					'datafilter_listing_clonable_row',
					'datafilter_listing_column_help',
					'datafilter_range_value_selection_section',
					'date_format_message', 'value_filter_selector',
					'single_value_field', 'range_filter_selector',
					'start_range_field', 'end_range_field',
					'datafilter_list_value_selection_section',
					'expander_button', 'expander_cell',
					'datafilter_select_clonable_option',
					'datafilter_hidden_values_section',
					'datafilter_clonable_hidden_value' ],

			'extract',
			'extract_section_type',
			'data_extract_order_section',
			[ 'sort_field_options', 'sort_field_order', 'default_sort_order',
					'sortorder_select_clonable_option',
					'sortorder_hidden_values_section',
					'sortorder_clonable_hidden_value' ] ]
};

/* -+- */

