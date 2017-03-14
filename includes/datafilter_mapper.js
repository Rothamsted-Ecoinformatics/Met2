/**
 *  @fileoverview The class Datafilter_Mapper is the isolating mapper for dataset filter listings.
 *
 *	@version 0.0.4  [13.12.2006]
 *	@version 0.0.5  [26.4.2007]
 */


/**
 *	Constructor for the Datafilter_Mapper class.
 *	@class	The class Datafilter_Mapper prevents any direct coupling between
 *	the layout processing of Datafield_Table and Datafilter_Table objects.
 *
 *	@constructor
 *	@param	{object} a_Datafield_Table A datafield listing table handler.
 *	@param	{object} a_Datafilter_Table A datafilter listing table handler.
 *
 *	@return	none
 *	@type	void
 */

function Datafilter_Mapper(a_rSection_Parent)
{
	/**
	 *	A reference to the parent/containing panel display
	 *	holding the section displays to be synchronised.
	 *	@type	object
	 */
	this.m_rParent_Controller = a_rSection_Parent;

//	/**
//	 *	The handler object for a datafield listing table display.
//	 *	@type	object-reference
//	 */
//	this.m_Datafield_Table = a_Datafield_Table;

//	/**
//	 *	The handler object for a datafilter listing table display.
//	 *	@type	object-reference
//	 */
//	this.m_Datafilter_Table = a_Datafilter_Table;

	/**
	 *	A reference to the definition of the dataset field set.
	 *	@type	array
	 *
	 *	Current active dataset fields string split into:
	 *		[n]   = field name
	 *		[n+1] = field description
	 *		[n+2] = field preview sequence
	 */
	this.m_asField_Definition = Array();
}


/**
 *	Part of the display support object interface - actioning the configured operation.
 *  Resynchronise the datafield filter checkbox settings with the datafilter field list.
 *	Note it's IE that needs a separate traversal of the constructed table
 *  to restore the dataset check-box settings.  ***  SHOULD I KEEP THIS COMMENT IN ??? ***
 *
 *  @return	none
 *  @type	void
 */

Datafilter_Mapper.prototype.do_action = function()
{
	var asError_Message = Array(1);
	asError_Message[0] = '';

    this.m_asField_Definition = this.m_rParent_Controller.get_dataset_fieldset_definition(asError_Message);
	var nField_Definition_Length = this.m_asField_Definition.length / DATAFIELD_SET_UNIT_LENGTH;
	//alert('do_action length = ' + nField_Definition_Length);
	for (var nx=0; nx<nField_Definition_Length; nx++) {
		//alert(this.m_asField_Definition[nx * DATAFIELD_SET_UNIT_LENGTH]);
	}

	var asName_List = Array(nField_Definition_Length);
	//alert('array length = ' + asName_List.length);

	//this.m_Datafield_Table.get_filter_field_names(asName_List);
	//this.m_Datafilter_Table.update_filter_field_names(asName_List);
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Datafilter_Mapper.prototype.print_state = function()
{
	return ('[Datafilter_Mapper]'
			+ '\nDatatable panel controller reference ' 
			+ ((is_null(this.m_rParent_Controller)) ? 'is' : 'is not') + ' null'
			+ '\nRetrieved datafield table handler reference ' 
			+ ((is_null((this.m_rParent_Controller).get_datafield_display())) ? 'is' : 'is not') + ' null'
			+ '\n\nRetrieved datafilter table handler reference ' 
			+ ((is_null((this.m_rParent_Controller).get_datafilter_display())) ? 'is' : 'is not') + ' null');
}


/* -+- */


