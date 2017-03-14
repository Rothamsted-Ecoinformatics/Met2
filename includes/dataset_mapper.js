/**
 *  @fileoverview The class Dataset_Mapper is the isolating mapper for dataset listing resources.
 *  The mapper mediates between the page panel selector display object and dataset table listing
 *	objects so these objects need neither knowledge of each other's details nor even awareness
 *	of each other's existence.
 *
 *	@version 0.1.1  [11.12.2006]
 */


/**
 *	Constructor for the Dataset_Mapper class.
 *	@class	The class Dataset_Mapper prevents any direct coupling between
 *	the layout processing of Dataset_Table objects and the Panel_Tabset object.
 *
 *	Known data resources are:
 *	1.	aasDataset_Group_List[][]	An associative array of arrays of strings
 *		indexed by dataset group ('a', 'r', 'u') with the contained arrays
 *		holding a pair of strings for each dataset listed <name, description>.
 *	2.	abProhibited_Datasets[]		An associative array of inaccessible datasets
 *		indexed by dataset name with each prohibited dataset element set to true.
 *		(Note: only the prohibited datasets are held in this array. It does not
 *		list all of the datasets.)
 *
 *	@constructor
 *	@param	{object} a_Panel_Tabset The panel (vertical) tabset handler.
 *	@param	{object} a_Dataset_Table A dataset listing table handler.
 *
 *	@return	none
 *	@type	void
 */

function Dataset_Mapper(a_Dataset_Table)
{
	/**
	 *	The handler object for the dataset listing table display.
	 *	@type	object-reference
	 */
	this.m_Dataset_Table = a_Dataset_Table;
}


/**
 *	Part of the display support object interface - actioning the configured operation.
 *  Resynchronise a dataset group status record with the global (for all dataset groups)
 *	'Dataset Column Help' status and the panel tab list - because these may have changed
 *	while the new group was hidden and inactive.
 *
 *  @return	none
 *  @type	void
 */

Dataset_Mapper.prototype.do_action = function() {
	var asName_List = Array();

	var rPage_Selector = locate_registered_object('main_selector');
	if (is_null(rPage_Selector)) {
		alert("Page panel selector no longer exists.");
		return;
	}

	rPage_Selector.get_variable_group_names(asName_List);
	// NB: currently the 'Dataset Column Help' state is the application global
	// bDataset_Column_Help_Active whose state is common to all dataset groups.
	this.m_Dataset_Table.resynchronise_dataset_group(bDataset_Column_Help_Active, asName_List);
	//alert(this.print_state());
}


/**
 *  Return state of object as a formatted text string.
 *
 *  @return	Current state
 *  @type	string
 */

Dataset_Mapper.prototype.print_state = function() {

	return ('[Dataset_Mapper]'
			+ '\n\nDataset table handler:\n' + this.m_Dataset_Table.print_state());
}


/* -+- */


