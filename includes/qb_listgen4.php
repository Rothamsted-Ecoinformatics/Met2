<?php

/**
 *	Generate an ERA dataset definition download.
 *	@package ERA
 *
 *	@version 0.0.3  [5.7.2007]
 *	@version 0.0.5  [15.11.2007]
 *	@version 0.0.6  [1.7.2008]
 *	@version 0.6.1  [22.7.2008]		// start of prototype 6
 *	@version 0.6.2  [11.8.2008]
 *	@version 0.6.3  [9.9.2008]
 *	@version 0.6.4  [6.10.2008]
 */


require_once("../includes/qb_defs4.php");
//require_once("../includes/qb_common4.php");

require_once("../includes/qb_groups4.php");
require_once("../includes/qb_datasets4.php");
require_once("../includes/qb_datasets4x.php");


// $dataset_metadata[][] table indexes.		Indexes used.
// table_name								...
// display_label							...
// display_code								...
// description								...
// display_group							...


// $group_metadata[][] table indexes.		Indexes used.
// title									...
// list										...
// url										...
// info										...


define("EXTRA_GROUP",			"extra");

define("ENTRY_ATTRIB_DELIM",	"!-!");
define("LIST_ITEM_DELIM",		"#-#");


function format_dataset_definition($a_dataset_list) {

	global $group_metadata;
	global $dataset_metadata;

    $dataset_definition = "";

	// The datasets re-ordered to the dataset meta-data default.
	$ordered_dataset_list = array();
	// The distinct groups re-ordered to the group meta-data default.
	$ordered_group_list = array();

	// The distinct groups and their datasets all in meta-data specified order.
	$grouped_dataset_list = array();

	$field_index_list = array();

	$dataset_count = 0;
	$dataset_entry_count = 0;
	$ordered_group_count = 0;
	$ordering_entry_count = 0;
	$total_entry_count = 0;

	$client_download_array = array();


	// If there are no datasets then return the minimum default definition.
	if (count($a_dataset_list) == 0) {
		$dataset_definition = "0!-!0!-!2!-!3!-!" . LOGIN_TABLE_ID . "!-!"
							. "0!-!0!-!0!-!1!-!!-!"
							. "0!-!0!-!0!-!1!-!";
		return ($dataset_definition);
	}

	// Note we don't have to check there's a meta-data entry for each dataset
	// because we know that these entries were used to reduce an original list
	// of datasets to the current list - which holds only the active datasets.

	// Order the list of datasets using the preset default ordering.
	// This is defined by the dataset order in the meta-data table.
	// Note a side-effect is to eliminate any duplicate dataset names.
	//
	// A list of distinct groups the datasets belong to is created.
	// Order the list of dataset groups using the default ordering
	// defined by the dataset group order in the meta-data table.
	// Note: here there will be no duplications to eliminate.
	$group_list = array();
	reset($dataset_metadata);
	while (list($dataset, $dataset_entry) = each($dataset_metadata)) {
		if (in_array($dataset, $a_dataset_list)) {
			$ordered_dataset_list[] = $dataset;
			$dataset_group = $dataset_entry['display_group'];
			if (!in_array($dataset_group, $group_list)) {
				$group_list[] = $dataset_group;
			}
		}
	}
	//
	reset($dataset_metadata);
	reset($group_metadata);
	reset($group_metadata);
	while (list($group) = each($group_metadata)) {
		if (in_array($group, $group_list)) {
			$ordered_group_list[] = $group;
		}
	}

	// Can now arrange the list of datasets into the pre-defined groups
	// with the in-group ordering as defined in the group meta-data table.
	// Note we expect every dataset to be in a group - and in one group only.
	for ($nx=0; $nx<count($ordered_group_list); $nx++) {
		$grouped_dataset_list[$ordered_group_list[$nx]] = array();
	}
	reset($grouped_dataset_list);
	while (list($group) = each($grouped_dataset_list)) {
		for ($nx=0; $nx<count($group_metadata[$group]['list']); $nx++) {
			$dataset = $group_metadata[$group]['list'][$nx];
			if (in_array($dataset, $ordered_dataset_list)) {
				$grouped_dataset_list[$group][] = $dataset;
			}
		}
	}


	// Before building the definition download
	// compute the entry count totals for the definition headers.
	//
	// Total dataset entry count.
	//
	// +1 for the dataset definition header.
	// +n ie 1 entry for each dataset.
	$dataset_count = count($ordered_dataset_list);
	$dataset_entry_count = 1 + $dataset_count;
	//
	// Total ordering entry count.
	//
	// First there's always a default ordering entry.
	// +1 for the overall ordering header.
	// +1 for the default ordering header.
	// +1 for the default ordering entry.
	$ordering_entry_count = 3;
	//
	// For datasets there's always a grouped ordering entry.
	// +1 for the grouped ordering header.
	// +n ie 1 entry for each ordering block entry.
	$ordered_group_count = count($ordered_group_list);
	$ordering_entry_count += 1 + $ordered_group_count;
	//
	// Total entry count.
	//
	// +1 for the message transfer header.
	// + total dataset entry count.
	// + total ordering entry count.
	$total_entry_count = 1 + $dataset_entry_count + $ordering_entry_count;


	// Can now use the lists to generate the definition download.


	// Set up the message transfer header.
	$client_download_array[] = 0;					// ) Header marker fields.
	$client_download_array[] = 0;					// )
	$client_download_array[] = 2;					// number of sections.
	$client_download_array[] = $total_entry_count;	// total number of definition entries (+header).
	$client_download_array[] = LOGIN_TABLE_ID;		// app-wide target id.
	
	
	// Set up the dataset definition header.
	$client_download_array[] = 0;					// ) Header marker fields.
	$client_download_array[] = 0;					// )
	$client_download_array[] = $dataset_count;		// number of datasets.
	$client_download_array[] = $dataset_entry_count;// number of dataset definition entries (+header).
	$client_download_array[] = "";					// filler.
	
	
	// Set up the dataset definitions entries.
	for ($nx=0; $nx<count($ordered_dataset_list); $nx++) {
		$dataset = $ordered_dataset_list[$nx];
		$client_download_array[] = $dataset;		// app-wide name for dataset.
		$client_download_array[] = $dataset_metadata[$dataset]['display_label'];
		$client_download_array[] = $dataset_metadata[$dataset]['display_code'];
		$client_download_array[] = $dataset_metadata[$dataset]['description'];
		$client_download_array[] = "";				// filler.
	}


	// Set up the overall ordering header.
	$client_download_array[] = 0;					// ) Header marker fields.
	$client_download_array[] = 0;					// )
	$client_download_array[] = 2;					// number of alternate orderings.
	$client_download_array[] = $ordering_entry_count;//number of ordering definition entries (+header).
	$client_download_array[] = "";					// filler.
	
	
	// Set up the header for the default ordering entry.
	$client_download_array[] = 0;					// ordering entry SOH.
	$client_download_array[] = OT_DEFAULT;			// ordering id for the default/alphabetic ordering.
	$client_download_array[] = 1;					// only one group for the default ordering.
	$client_download_array[] = BT_PLAIN;			// display style.
	$client_download_array[] = "";					// filler.

	// Set up the default ordering entry.
	// First generate the list of field indexes - note the client-side application 
	// needs field indexes to number from 1 not zero because zero is a reserved id.
	$field_index_list = array();
	for ($nx=0; $nx<count($ordered_dataset_list); $nx++) {
		$field_index_list[] = ($nx + 1);
	}
	$field_index_string = implode(LIST_ITEM_DELIM, $field_index_list);
	//
	$client_download_array[] = 1;					// block number (1..n).
	$client_download_array[] = "";					// group title.
	$client_download_array[] = "";					// group url.
	$client_download_array[] = $field_index_string; // structured list of ordered indexes to dataset names.
	$client_download_array[] = "";					// filler (later will be the group info link).


	// Set up the header for the grouped ordering entries.
	$client_download_array[] = 0;					// ordering entry SOH.
	$client_download_array[] = OT_BLOCKED;			// ordering id for the blocked ordering.
	$client_download_array[] = $ordered_group_count;// number of ordering blocks.
	$client_download_array[] = BT_TITLE;			// display style.
	$client_download_array[] = "";					// filler.


	// Here to set up each ordering group/block entry.
	// First generate their list of field indexes - note the client-side application 
	// needs field indexes to number from 1 not zero because zero is a reserved id.
	for ($nx=0; $nx<count($ordered_group_list); $nx++) {
		$group = $ordered_group_list[$nx];
		$field_index_list = array();
		for ($nfield=0; $nfield<count($grouped_dataset_list[$group]); $nfield++) {
			$fieldname = $grouped_dataset_list[$group][$nfield];
			$fieldname_index = array_search($fieldname, $ordered_dataset_list);
			if ($fieldname_index !== FALSE) {
				$field_index_list[] = $fieldname_index + 1;
			}
		}
		// Note single and empty lists are also formatted correctly.
		$field_index_string = implode(LIST_ITEM_DELIM, $field_index_list);
	//
		$client_download_array[] = ($nx + 1);			// sequential ordering id.
		$client_download_array[] = $group_metadata[$group]['title'];
		$client_download_array[] = $group_metadata[$group]['url'];
		$client_download_array[] = $field_index_string;	// a structured field of ordered indexes to group members.
		$client_download_array[] = "";					// filler (later will be the group info link).
	}


	//$client_download_array[] = "  ";
	$dataset_definition = implode(ENTRY_ATTRIB_DELIM, $client_download_array);

	return ($dataset_definition);
}


function format_dataset_definition2($a_dataset_list, $a_extra_list) {

	global $dataset_metadata;
	global $group_metadata;
	global $dataset_complete;

    $dataset_definition = "";

	// The datasets re-ordered to the dataset meta-data default.
	$ordered_dataset_list = array();
	$ordered_extra_dataset_list = array();
	$combined_ordered_dataset_list = array();
	// The distinct groups re-ordered to the group meta-data default.
	$ordered_group_list = array();

	// The distinct groups and their datasets all in meta-data specified order.
	$grouped_dataset_list = array();

	$field_index_list = array();

	$dataset_count = 0;
	$dataset_entry_count = 0;
	$ordered_group_count = 0;
	$ordering_entry_count = 0;
	$total_entry_count = 0;

	$client_download_array = array();


	// If there are no datasets then return the minimum default definition.
	if ((count($a_dataset_list) == 0)
		&& (count($a_extra_list) == 0)) {
		$dataset_definition = "0!-!0!-!2!-!3!-!" . LOGIN_TABLE_ID . "!-!"
							. "0!-!0!-!0!-!1!-!!-!"
							. "0!-!0!-!0!-!1!-!";
		return ($dataset_definition);
	}

	// Note we don't have to check there's a meta-data entry for each dataset
	// because we know that these entries were used to reduce an original list
	// of datasets to the current list - which holds only the active datasets.

	// Order the list of datasets using the preset default ordering.
	// This is defined by the dataset order in the meta-data table.
	// Note a side-effect is to eliminate any duplicate dataset names.
	//
	// A list of distinct groups the datasets belong to is created.
	// Order the list of dataset groups using the default ordering
	// defined by the dataset group order in the meta-data table.
	// Note: here there will be no duplications to eliminate.
	$group_list = array();
	reset($dataset_metadata);
	while (list($dataset, $dataset_entry) = each($dataset_metadata)) {
		if (in_array($dataset, $a_dataset_list)) {
			$ordered_dataset_list[] = $dataset;
			$combined_ordered_dataset_list[] = $dataset;
			$dataset_group = $dataset_entry['display_group'];
			if (!in_array($dataset_group, $group_list)) {
				$group_list[] = $dataset_group;
			}
		}
	}
	//
	reset($dataset_metadata);
	reset($group_metadata);
	reset($group_metadata);
	while (list($group) = each($group_metadata)) {
		if (in_array($group, $group_list)) {
			$ordered_group_list[] = $group;
		}
	}

	// Can now arrange the list of datasets into the pre-defined groups
	// with the in-group ordering as defined in the group meta-data table.
	// Note we expect every dataset to be in a group - and in one group only.
	for ($nx=0; $nx<count($ordered_group_list); $nx++) {
		$grouped_dataset_list[$ordered_group_list[$nx]] = array();
	}
	reset($grouped_dataset_list);
	while (list($group) = each($grouped_dataset_list)) {
		for ($nx=0; $nx<count($group_metadata[$group]['list']); $nx++) {
			$dataset = $group_metadata[$group]['list'][$nx];
			if (in_array($dataset, $ordered_dataset_list)) {
				$grouped_dataset_list[$group][] = $dataset;
			}
		}
	}


	// If we were given a list of extra datasets then add them in an extra final group
	// for untransferred datasets in the order predefined by the full list of datasets.
	if (count($a_extra_list) > 0) {
		//$ordered_group_list[] = EXTRA_GROUP;
		//$grouped_dataset_list[EXTRA_GROUP] = array();
		$temp_extra_group = array();
		reset($dataset_complete);
		while (list($dataset, $dataset_entry) = each($dataset_complete)) {
			if (($dataset_entry['retrieval'] == RT_ORACLE)
				&& in_array($dataset, $a_extra_list)) {
				$ordered_extra_dataset_list[] = $dataset;
				$combined_ordered_dataset_list[] = $dataset;
				$temp_extra_group[] = $dataset;
				//$grouped_dataset_list[EXTRA_GROUP][] = $dataset;
			}
		}
		$temp_extra_group = array();	// Currently block display and access for the extra groups

		// Don't create the 'extra' group till we know it is not empty.
		// Re-working of ERA data may leave users authorised for datasets
		// that have been removed, renamed or split into smaller datasets.
		if (count($temp_extra_group) > 0) {
			$ordered_group_list[] = EXTRA_GROUP;
			$grouped_dataset_list[EXTRA_GROUP] = array();
			for ($nx=0; $nx<count($temp_extra_group); $nx++) {
				$grouped_dataset_list[EXTRA_GROUP][] = $temp_extra_group[$nx];
			}
		}
	}


	// Before building the definition download
	// compute the entry count totals for the definition headers.
	//
	// Total dataset entry count.
	//
	// +1 for the dataset definition header.
	// +n ie 1 entry for each dataset.
	$dataset_count = count($combined_ordered_dataset_list);
	$dataset_entry_count = 1 + $dataset_count;
	//
	// Total ordering entry count.
	//
	// First there's always a default ordering entry.
	// +1 for the overall ordering header.
	// +1 for the default ordering header.
	// +1 for the default ordering entry.
	$ordering_entry_count = 3;
	//
	// For datasets there's always a grouped ordering entry.
	// +1 for the grouped ordering header.
	// +n ie 1 entry for each ordering block entry.
	$ordered_group_count = count($ordered_group_list);
	$ordering_entry_count += 1 + $ordered_group_count;
	//
	// Total entry count.
	//
	// +1 for the message transfer header.
	// + total dataset entry count.
	// + total ordering entry count.
	$total_entry_count = 1 + $dataset_entry_count + $ordering_entry_count;


	// Can now use the lists to generate the definition download.


	// Set up the message transfer header.
	$client_download_array[] = 0;					// ) Header marker fields.
	$client_download_array[] = 0;					// )
	$client_download_array[] = 2;					// number of sections.
	$client_download_array[] = $total_entry_count;	// total number of definition entries (+header).
	$client_download_array[] = LOGIN_TABLE_ID;		// app-wide target id.
	
	
	// Set up the dataset definition header.
	$client_download_array[] = 0;					// ) Header marker fields.
	$client_download_array[] = 0;					// )
	$client_download_array[] = $dataset_count;		// number of datasets.
	$client_download_array[] = $dataset_entry_count;// number of dataset definition entries (+header).
	$client_download_array[] = "";					// filler.
	
	
	// Set up the dataset definition entries.
	for ($nx=0; $nx<count($ordered_dataset_list); $nx++) {
		$dataset = $ordered_dataset_list[$nx];
		$client_download_array[] = $dataset;		// app-wide name for dataset.
		$client_download_array[] = $dataset_metadata[$dataset]['display_label'];
		$client_download_array[] = $dataset_metadata[$dataset]['display_code'];
		$client_download_array[] = $dataset_metadata[$dataset]['description'];
		$client_download_array[] = "";				// filler.
	}


	// Set up any extra dataset definition entries.
	for ($nx=0; $nx<count($ordered_extra_dataset_list); $nx++) {
		$dataset = $ordered_extra_dataset_list[$nx];
		$client_download_array[] = $dataset;		// app-wide name for dataset.
		$client_download_array[] = $dataset_complete[$dataset]['display_label'];
		$client_download_array[] = 1;				// $dataset_metadata[$dataset]['display_code'];
		$client_download_array[] = $dataset_complete[$dataset]['description'];
		$client_download_array[] = "";				// filler.
	}


	// Set up the overall ordering header.
	$client_download_array[] = 0;					// ) Header marker fields.
	$client_download_array[] = 0;					// )
	$client_download_array[] = 2;					// number of alternate orderings.
	$client_download_array[] = $ordering_entry_count;//number of ordering definition entries (+header).
	$client_download_array[] = "";					// filler.
	
	
	// Set up the header for the default ordering entry.
	$client_download_array[] = 0;					// ordering entry SOH.
	$client_download_array[] = OT_DEFAULT;			// ordering id for the default/alphabetic ordering.
	$client_download_array[] = 1;					// only one group for the default ordering.
	$client_download_array[] = BT_PLAIN;			// display style.
	$client_download_array[] = "";					// filler.

	// Set up the default ordering entry.
	// First generate the list of field indexes - note the client-side application 
	// needs field indexes to number from 1 not zero because zero is a reserved id.
	$field_index_list = array();
	for ($nx=0; $nx<count($combined_ordered_dataset_list); $nx++) {
		$field_index_list[] = ($nx + 1);
	}
	$field_index_string = implode(LIST_ITEM_DELIM, $field_index_list);
	//
	$client_download_array[] = 1;					// block number (1..n).
	$client_download_array[] = "";					// group title.
	$client_download_array[] = "";					// group url.
	$client_download_array[] = $field_index_string; // structured list of ordered indexes to dataset names.
	$client_download_array[] = "";					// filler (later will be the group info link).


	// Set up the header for the grouped ordering entries.
	$client_download_array[] = 0;					// ordering entry SOH.
	$client_download_array[] = OT_BLOCKED;			// ordering id for the blocked ordering.
	$client_download_array[] = $ordered_group_count;// number of ordering blocks.
	$client_download_array[] = BT_TITLE;			// display style.
	$client_download_array[] = "";					// filler.


	// Here to set up each ordering group/block entry.
	// First generate their list of field indexes - note the client-side application 
	// needs field indexes to number from 1 not zero because zero is a reserved id.
	for ($nx=0; $nx<count($ordered_group_list); $nx++) {
		$group = $ordered_group_list[$nx];
		$field_index_list = array();
		for ($nfield=0; $nfield<count($grouped_dataset_list[$group]); $nfield++) {
			$fieldname = $grouped_dataset_list[$group][$nfield];
			$fieldname_index = array_search($fieldname, $combined_ordered_dataset_list);
			if ($fieldname_index !== FALSE) {
				$field_index_list[] = $fieldname_index + 1;
			}
		}
		// Note single and empty lists are also formatted correctly.
		$field_index_string = implode(LIST_ITEM_DELIM, $field_index_list);
	//
		$client_download_array[] = ($nx + 1);			// sequential ordering id.
		$client_download_array[] = $group_metadata[$group]['title'];
		$client_download_array[] = $group_metadata[$group]['url'];
		$client_download_array[] = $field_index_string;	// a structured field of ordered indexes to group members.
		$client_download_array[] = "";					// filler (later will be the group info link).
	}


	//$client_download_array[] = "  ";
	$dataset_definition = implode(ENTRY_ATTRIB_DELIM, $client_download_array);

	return ($dataset_definition);
}


?>


<!-- -+- -->


