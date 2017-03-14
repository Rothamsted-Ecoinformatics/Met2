<?php

/**
 *	@fileoverview The main script for the data display prototype page.
 *
 *	@version 0.2.0  [27.10.2006]
 *	@version 0.2.2  [26.1.2007]
 *	@version 0.2.3  [13.2.2007]
 *
 *	@version 0.2.4  [8.6.2007]
 *
 *	@version 0.2.5  [11.6.2007]		Start of server 4 version.
 *	@version 0.2.10 [22.6.2007]
 *	@version 0.2.11 [12.7.2007]
 *	@version 0.2.14 [19.7.2007]
 *	@version 0.2.15  [23.7.2007]
 *	@version 0.2.16  [29.8.2007]
 *	@version 0.2.17  [11.9.2007]
 *	@version 0.2.18  [28.9.2007]
 *	@version 0.2.19  [18.10.2007]
 *	@version 0.2.20  [1.7.2008]
 *	@version 0.6.1  [22.7.2008]		// start of prototype 6
 *	@version 0.6.2  [23.7.2008]
 *	@version 0.6.3  [13.8.2008]
 *	@version 0.6.4  [6.10.2008]
 *	@version 0.6.5  [16.10.2008]
 *	@version 0.6.6  [22.10.2008]
 *
 *	$_POST[] input args:
 *
 *  'dataset'
 *	'datafield'[]
 *  'datafilter'[]
 *  ('filter_' . 'datafilter'[n])[]
 *  'sort_order'[]
 *
 */


// Client filter/search tuple type definitions.
define("TT_NONE",		0);
define("TT_VALUE",		1);
define("TT_RANGE",		3);
define("TT_LIST",		4);
define("TT_TAX_LIST",	5);


// Client filter/search tuple indexes/offsets.
define("TX_FIELD",		0);
define("TX_BOOL",		1);
define("TX_TYPE",		2);
define("TX_VALUE",		3);
define("TX_SOR",		3);
define("TX_EOR",		4);
define("TX_COUNT",		3);
define("TX_ITEM",		4);


define("DATE_COLUMN_PREFIX", "date_");
define("TAX_COLUMN_PREFIX", "tax_");


ob_start();
session_start();


require_once("../includes/era_config4.php");
require_once("../includes/qb_defs4.php");
require_once("../includes/qb_common4.php");

ob_end_clean();


$stored_user_id = "";
$stored_prev_id = "";
$stored_real_id = "";
$dataset = "";
$include_path = "";

$refid_code = "\x7f7n,2a";

$field_list = array();
$filter_field_list = array();
$filter_tuple_list = array();
$sort_field_list = array();
$index_field_list = array();

$table_list = array();
$active_field_list = array();
$clause_list = array();
$sort_list = array();

$tabled_field_list = array();
$hidden_field_list = array();
$used_filter_field_list = array();

$page_open = FALSE;

$agent_code = convert_string("\x7fbekf}~");

// Dummy connection status.
$dummy_connection_status = dummy_status();

// Ensure a new session state is properly reset.
if (isset($_SESSION['user_id']) == FALSE) {
	$_SESSION['user_id'] = "";
	$_SESSION['prev_id'] = "";
	$_SESSION['real_id'] = "";
}
if (isset($_SESSION['auth_code']) == FALSE) {
	$_SESSION['auth_code'] = 0;
}

// Dummy connection message.
$dummy_msg = "Connection not possible -- suspected dataserver failure.";
if (!$dummy_connection_status) {
	error_exit($dummy_msg);
}

// Retrieve and compute the session state.
$stored_user_id = $_SESSION['user_id'];
$stored_prev_id = $_SESSION['prev_id'];
//$stored_hash = $_SESSION['auth_code'];
$_SESSION['auth_code'] = 0;				// ensures the code can only be used once


// Check the user is logged in.
if (strlen($stored_user_id) == 0) {
	error_exit("Please login before extracting any data.<br>Click on the Login/Logout tab in the original page.");
}


// Get the name of the dataset.
if (array_key_exists("dataset", $_POST) == FALSE) {
	error_exit("No dataset selected.");
}
else {
	$dataset = strtolower(htmlspecialchars(stripslashes($_POST['dataset']), ENT_QUOTES));
	if ((is_string($dataset) == FALSE)
	|| (strlen($dataset) == 0)) {
		error_exit("No dataset selected.");
	}
}


// Complete building the encoded password.
$refid_code .= "e1";


// Access the dataset meta-data.
$include_path = DEFAULT_METADATA_PATH . $dataset . METADATA_FILE_AFFIX;
//print "include path = " . $include_path . "<br>\n";

if (is_file($include_path)) {
	require_once($include_path);
}
else {
	error_exit("Unable to locate the meta-data for the selected dataset.");
}


// Get the names of fields to be extracted.
if ((array_key_exists("datafield", $_POST) == FALSE)
|| (is_array($_POST['datafield']) == FALSE)
|| (count($_POST['datafield']) == 0)) {
	error_exit(sprintf("No data fields were selected for dataset %s.", $dataset));
}

for ($nx=0; $nx<count($_POST['datafield']); $nx++) {
	$field_list[] = strtolower(htmlspecialchars(stripslashes($_POST['datafield'][$nx]), ENT_QUOTES));
}

// Validate the fieldnames using the dataset meta-data.
for ($nx=0; $nx<count($field_list); $nx++) {
	if (array_key_exists($field_list[$nx], $field_metadata) == FALSE) {
		error_exit(sprintf("Invalid fieldname detected for dataset %s.<br>\n", $dataset));
	}
}


// Final tweak to the encoded password.
$refid_code = simple_encode(convert_string($refid_code));


// Get the names of fields on which to filter the output.
if ((array_key_exists("datafilter", $_POST) == TRUE)
&& (is_array($_POST['datafilter']) == TRUE)
&& (count($_POST['datafilter']) > 0)) {
	for ($nx=0; $nx<count($_POST['datafilter']); $nx++) {
		$filter_field_list[] = strtolower(htmlspecialchars(stripslashes($_POST['datafilter'][$nx]), ENT_QUOTES));
	}
}

// Validate the filter fieldnames using the dataset meta-data.
for ($nx=0; $nx<count($filter_field_list); $nx++) {
	if (array_key_exists($filter_field_list[$nx], $field_metadata) == FALSE) {
		error_exit(sprintf("Invalid search fieldname detected for dataset %s.<br>\n", $dataset));
	}
}


// Get the filter tuples that specify the values for the filter fields
// also validating the tuple length, fieldname and query-base type.
$filter_field = "";
$filter_key = "";
if (count($filter_field_list) > 0) {
	for ($nx=0; $nx<count($filter_field_list); $nx++) {
		$filter_field = $filter_field_list[$nx];
		$filter_key = "filter_" . $filter_field;
		if ((array_key_exists($filter_key, $_POST) == TRUE)
		&& (is_array($_POST[$filter_key]) == TRUE)
		&& (count($_POST[$filter_key]) > 0)) {
			for ($nc=0; $nc<count($_POST[$filter_key]); $nc++) {
				$filter_tuple_list[$filter_field][] = htmlspecialchars(stripslashes($_POST[$filter_key][$nc]));
			}
			if ((count($filter_tuple_list[$filter_field]) < 3)
			|| (strcasecmp($filter_tuple_list[$filter_field][TX_FIELD], $filter_field) != MATCH)) {
				// Note the tuple search type is not strictly the same as the query-base type.
				// However can there still be some validation to exclude incompatible types?
				//|| ($filter_tuple_list[$filter_field][TX_TYPE] != $field_metadata[$filter_field]['qb_type'])
				error_exit(sprintf("Error found in the search conditions for field %s.", $filter_field));
			}
		}
	}
}


$table_owner_prefix = get_owner_prefix(convert_string(DB_OWNER));


// Get the names of fields on which to sort the output.
if ((array_key_exists("sort_order", $_POST) == TRUE)
&& (is_array($_POST['sort_order']) == TRUE)
&& (count($_POST['sort_order']) > 0)) {
	for ($nx=0; $nx<count($_POST['sort_order']); $nx++) {
		$sort_field_list[] = strtolower(htmlspecialchars(stripslashes($_POST['sort_order'][$nx]), ENT_QUOTES));
	}
}

// Validate the sort fieldnames using the dataset meta-data.
for ($nx=0; $nx<count($sort_field_list); $nx++) {
	if (array_key_exists($sort_field_list[$nx], $field_metadata) == FALSE) {
		error_exit(sprintf("Invalid sort fieldname detected for dataset %s.<br>\n", $dataset));
	}
}

// If there is no sort list then set to sort on the dataset index fields.
if (count($sort_field_list) > 0) {
	$sort_list = $sort_field_list;
}
else {
	reset($field_metadata);
	while(list($key) = each($field_metadata)) {
		if ($field_metadata[$key]['index_position'] > 0) {
			$index_field_list[$key] = $field_metadata[$key]['index_position'];
			settype($index_field_list[$key], "integer");
		}
	}
	asort($index_field_list, SORT_NUMERIC);
	reset($index_field_list);
	while(list($field) = each($index_field_list)) {
		$sort_list[] = $field;
	}
}


// Start the query table list.
$table_list[] = $dataset . " ds";


// Now work through the field list, building the query field by field.
$field = "";
for ($nx=0; $nx<count($field_list); $nx++) {
	$field = $field_list[$nx];
	if (array_key_exists($field, $filter_tuple_list)) {
		// Here if there are filter conditions set up for the field.
		$used_filter_field_list[$field] = TRUE;
		switch ($filter_tuple_list[$field][TX_TYPE]) {

			case TT_VALUE :		add_value_filtered_field($dataset, $field);
			break;

			case TT_RANGE :		add_range_filtered_field($dataset, $field);
			break;

			case TT_LIST :		add_list_filtered_field($dataset, $field);
			break;

			case TT_TAX_LIST :	add_tax_list_filtered_field($dataset, $field);
			break;

			default : 			error_exit(sprintf("Unrecognised search condition type for field %s", $filter_field));

		}
	}
	// ERA field type definitions.
	//define ("FT_UNKNOWN",	0);
	//define ("FT_READING",	1);
	//define ("FT_DATE",		2);
	//define ("FT_CODE",		3);
	//define ("FT_TAX",		4);
	// Field metadata indexes/offsets.
	//define ("MX_ERATYPE",	0);
	//define ("MX_FORMAT",	1);
	//define ("MX_QBTYPE",	2);
	//define ("MX_UNITS",	3);
	else {
		// Otherwise here for a simple data extraction for the field.
		switch ($field_metadata[$field]['field_type']) {

			case FT_READING :
			case FT_CODE :	//print "simple field " . $field . "<br>\n";
				add_simple_field($field);
				break;

			case FT_DATE :	//print "date field " . $field . "<br>\n";
				add_date_field($field);
				break;

			case FT_TAX :	//print "tax field " . $field . "<br>\n";
				add_tax_field($field);
				break;

			default :		//print "unknown field " . $field . "<br>\n";
				break;

		}
	}
}

$active_field_list = array_merge($tabled_field_list, $hidden_field_list);

//print "<br>Fields<br>" . join("<br>", $active_field_list) . "<br>\n";
//print "<br>Tables<br>" . join("<br>", $table_list) . "<br>\n";
//print "<br>Clauses<br>" . join("<br>", $clause_list) . "<br>\n";

$db_linkID = FALSE;
$db_open = FALSE;
$db_resultID = FALSE;
$errmsg = "";
$registration_valid = FALSE;

//print "<br>" . build_sql() . "<br>\n";

if (connect_to_era($errmsg) == FALSE) {
	error_exit($errmsg);
}

// First try the old era system table for authorisation.
if (strlen($stored_prev_id) > 0) {
	if (confirm_old_dataset_field_access($stored_prev_id, $dataset, $errmsg) != FALSE) {
		$registration_valid = TRUE;
	}
}

// Then try the new era system table for authorisation.
if (($registration_valid == FALSE)
&& (strlen($stored_user_id) > 0)) {
	if (confirm_dataset_field_access($stored_user_id, $dataset, $errmsg) != FALSE) {
		$registration_valid = TRUE;
	}
}

// Quit on non-compliant registration details .
if ($registration_valid == FALSE) {
	error_exit($errmsg);
}

// Drop here to extract the data.
if (query($errmsg) == FALSE) {
	error_exit($errmsg);
}


$style = "../includes/dd_datadisplay.css";
$jslist = array("../includes/loadob.js", "../includes/common.js", "../includes/dd_datadisplay.js");
open_page(strtoupper($dataset), $style, $jslist);



printf("<input id=\"increase_font_size_button\" class=\"control_button\" "
. "type=\"button\" value=\"enlarge text\" align=\"middle\">\n");
printf("<input id=\"decrease_font_size_button\" class=\"control_button\" "
. "type=\"button\" value=\"reduce text\" align=\"middle\">\n");
printf("<input id=\"reformat_as_csv_button\" class=\"control_button\" "
. "type=\"button\" value=\"CSV\" align=\"middle\">\n");
printf("<input id=\"reformat_as_table_button\" class=\"control_button\" "
. "type=\"button\" value=\"TABLE\" align=\"middle\">\n");

if (strpos($dataset, 'met') >0) {
	printf("<input type=\"text\" id=\"TLIM\" name=\"TLIM\" value=\"Enter TLIM\" size = \"7\"><input id=\"calc_button\" class=\"control_button\" "
	. "type=\"button\" value=\"Calculate Variables\" align=\"middle\">\n");
}
else
{
	printf("<input id=\"calc_button\" class=\"disable\" "
	. "type=\"button\" value=\"Calculate Variables\" align=\"middle\">\n");
}

$switchable_header =  array("Data selected from " . strtoupper($dataset) . " is loading...",
							"Data extracted from  <span id=\"dataset_name\">" . strtoupper($dataset) . "</span>");
page_loading_header(3, "page_title", $switchable_header);
printf("<div id=\"table_data_panel\">\n");



table_open(count($field_list), "dataset_data_listing_table", "", "font-size: 12px");

$column_titles = array();
$column_units = array();
get_column_titles($field_list, $column_titles);
get_column_units($field_list, $column_units);
	
table_header($column_titles, $column_units);

$row_count = 0;
$data_row = array();
//while (fetchrow($data_row) && ($row_count < 400)) {
while (fetchrow($data_row)) {
	$row_count++;
	table_row($row_count, count($field_list), $data_row);
	$data_row = array();
}

table_close();
printf("</div>\n");

printf("<div id=\"csv_data_panel\" class=\"hide\">\n");

printf("<pre id=\"csv_data_area\">\n</pre>\n");
printf("</div>\n");

printf("<div id=\"cal_data_panel\" class=\"hide\">\n");

printf("<div id=\"cal_data_area\">\n</div>\n");

printf("</div>\n");

close_page();

//ob_end_flush();
exit();


//$dataset = "";
//$field_list = array();
//$filter_field_list = array();
//$filter_tuple_list = array();

//$table_list = array();
//$active_field_list = array();
//$clause_list = array();
//$sort_list = array();

//$tabled_field_list = array();
//$hidden_field_list = array();
//$used_filter_field_list = array();


function add_simple_field($field)
{
	global $tabled_field_list;

	$tabled_field_list[] = "ds." . $field;
}


function add_date_field($field)
{
	global $tabled_field_list;
	global $hidden_field_list;

	$tabled_field_list[] = "convert(varchar(10),ds." . $field . ",105) as "
	. DATE_COLUMN_PREFIX . $field;
	$hidden_field_list[] = "ds." . $field;
}


function add_tax_field($field)
{
	global $table_list;
	global $tabled_field_list;
	global $hidden_field_list;
	global $clause_list;

	$tabled_field_list[] = "tn.name as " . TAX_COLUMN_PREFIX . $field;
	$hidden_field_list[] = "ds." . $field;
	$table_list[] = "tax_synonyms ts";
	$table_list[] = "tax_name_info tn";
	$clause_list[] = "ds." . $field . "=ts.id";
	$clause_list[] = "ts.same_id=tn.id";
}


function add_tax_list_field($field)
{
	global $table_list;
	global $tabled_field_list;
	global $hidden_field_list;
	//	global $clause_list;

	$tabled_field_list[] = "tn.name as " . TAX_COLUMN_PREFIX . $field;
	$hidden_field_list[] = "ds." . $field;
	$table_list[] = "tax_synonyms ts";
	$table_list[] = "tax_name_info tn";
	//	$clause_list[] = "ds." . $field . "=ts.id";
	//	$clause_list[] = "ts.same_id=tn.id";
}


function add_simple_value_clause($field)
{
	global $filter_tuple_list;
	global $clause_list;

	$clause_list[] = "ds." . $field . "='" . $filter_tuple_list[$field][TX_VALUE] . "'";
}


function add_date_value_clause($field)
{
	global $filter_tuple_list;
	global $clause_list;

	$clause_list[] = "ds." . $field . "=convert(datetime,'" . $filter_tuple_list[$field][TX_VALUE] . "',105)";
}


function add_simple_range_clause($field)
{
	global $filter_tuple_list;
	global $clause_list;

	$clause_list[] = "ds." . $field . " between '" . $filter_tuple_list[$field][TX_SOR]
	. "' and '" . $filter_tuple_list[$field][TX_EOR] . "'";
}


function add_date_range_clause($field)
{
	global $filter_tuple_list;
	global $clause_list;

	$clause_list[] = "ds." . $field
	. " between convert(datetime,'" . $filter_tuple_list[$field][TX_SOR] . "',105)"
	. " and convert(datetime,'" . $filter_tuple_list[$field][TX_EOR] . "',105)";
}


function add_simple_list_clause($field)
{
	global $filter_tuple_list;
	global $clause_list;

	$clause = "";
	$list_item_count = $filter_tuple_list[$field][TX_COUNT];
	if ($list_item_count == 1) {
		$clause = "ds." . $field . "='" . $filter_tuple_list[$field][TX_ITEM] . "'";
	}
	else {
		$clause = "ds." . $field . " in ('" . $filter_tuple_list[$field][TX_ITEM] . "'";
		for ($nx=1; $nx<$list_item_count; $nx++) {
			$clause .= ",'" . $filter_tuple_list[$field][$nx + TX_ITEM] . "'";
		}
		$clause .= ")";
	}

	$clause_list[] = $clause;
}


function add_tax_list_clause($field)
{
	global $filter_tuple_list;
	global $clause_list;

	$clause = "";
	$list_item_count = $filter_tuple_list[$field][TX_COUNT];
	if ($list_item_count == 1) {
		$clause_list[] = "ds." . $field . "=ts.id";
		$clause_list[] = "ts.same_id=tn.id";
		$clause_list[] = "tn.id='" . $filter_tuple_list[$field][TX_ITEM] . "'";
	}
	else {
		$clause_list[] = "ds." . $field . "=ts.id";
		$clause_list[] = "ts.same_id=tn.id";
		$clause = "tn.id in ('" . $filter_tuple_list[$field][TX_ITEM] . "'";
		for ($nx=1; $nx<$list_item_count; $nx++) {
			$clause .= ",'" . $filter_tuple_list[$field][$nx + TX_ITEM] . "'";
		}
		$clause .= ")";
		$clause_list[] = $clause;
	}
}


function add_value_filtered_field($dataset, $field)
{
	global $filter_tuple_list;
	global $field_metadata;

	//print "Value type for field " . $field . "<br>\n";
	//print "Field name in filter args = " . $field_args[0] . "<br>\n";
	if (count($filter_tuple_list[$field]) < 4) {
		error_exit(sprintf("Error processing value search condition for field %s.", $field));
	}

	// Note no fields of type FT_TAX will ever be filtered by value.
	switch ($field_metadata[$field]['field_type']) {

		case FT_READING :
		case FT_CODE :	//print "simple value filter on field " . $field . "<br>\n";
			add_simple_field($field);
			add_simple_value_clause($field);
			break;

		case FT_DATE :	//print "date value filter on field " . $field . "<br>\n";
			add_date_field($field);
			add_date_value_clause($field);
			break;

		default :		//print "Error: value filter requested on field " . $field . "<br>\n";
			break;

	}
}


function add_range_filtered_field($dataset, $field)
{
	global $filter_tuple_list;
	global $field_metadata;

	//print "Value type for field " . $field . "<br>\n";
	//print "Field name in filter args = " . $field_args[0] . "<br>\n";
	if (count($filter_tuple_list[$field]) < 5) {
		error_exit(sprintf("Error processing range search condition for field %s.", $field));
	}

	// Note no fields of type FT_TAX will ever be filtered by range.
	switch ($field_metadata[$field]['field_type']) {

		case FT_READING :
		case FT_CODE :	//print "simple range filter on field " . $field . "<br>\n";
			add_simple_field($field);
			add_simple_range_clause($field);
			break;

		case FT_DATE :	//print "date range filter on field " . $field . "<br>\n";
			add_date_field($field);
			add_date_range_clause($field);
			break;

		default :		//print "Error: range filter requested on field " . $field . "<br>\n";
			break;

	}
}


function add_list_filtered_field($dataset, $field)
{
	global $filter_tuple_list;
	global $field_metadata;

	//print "Value type for field " . $field . "<br>\n";
	//print "Field name in filter args = " . $field_args[0] . "<br>\n";
	if ((count($filter_tuple_list[$field]) < 5)
	|| ($filter_tuple_list[$field][TX_COUNT] < 1)
	|| (count($filter_tuple_list[$field]) != ($filter_tuple_list[$field][TX_COUNT] + 4))) {
		error_exit(sprintf("Error processing list search condition for field %s.", $field));
	}

	// Note no fields of type FT_DATE or FT_TAX will ever be filtered by list.
	switch ($field_metadata[$field]['field_type']) {

		case FT_READING :
		case FT_CODE :	//print "simple list filter on field " . $field . "<br>\n";
			add_simple_field($field);
			add_simple_list_clause($field);
			break;

		default :		//print "Error: list filter requested on field " . $field . "<br>\n";
			break;

	}
}


function add_tax_list_filtered_field($dataset, $field)
{
	global $filter_tuple_list;
	global $field_metadata;

	//print "Value type for field " . $field . "<br>\n";
	//print "Field name in filter args = " . $field_args[0] . "<br>\n";
	if ((count($filter_tuple_list[$field]) < 5)
	|| ($filter_tuple_list[$field][TX_COUNT] < 1)
	|| (count($filter_tuple_list[$field]) != ($filter_tuple_list[$field][TX_COUNT] + 4))) {
		error_exit(sprintf("Error processing tax_list search condition for field %s.", $field));
	}

	// Note only fields of type FT_TAX will ever be filtered by tax_list.
	switch ($field_metadata[$field]['field_type']) {

		case FT_TAX :	//print "tax list filter on field " . $field . "<br>\n";
			add_tax_list_field($field);
			add_tax_list_clause($field);
			break;

		default :		//print "Error: tax_list filter requested on field " . $field . "<br>\n";
			break;

	}
}


/*
 if (count($filter_field_list) > 0) {
 for ($nx=0; $nx<count($filter_field_list); $nx++) {
 $filter_field = $filter_field_list[$nx];
 if (array_key_exists($filter_field, $filter_tuple_list)) {
 if ((count($filter_tuple_list[$filter_field]) < 3)
 || ($filter_tuple_list[$filter_field][0] != $filter_field)) {
 error_exit(sprintf("Error processing the search conditions for field %s.", $filter_field));
 }

 switch ($filter_tuple_list[$filter_field][2]) {

 case 1 :	format_value_where_clause($filter_tuple_list[$filter_field], $clause_list);
 break;

 case 3 :	format_range_where_clause($filter_tuple_list[$filter_field], $clause_list);
 break;

 case 4 :	format_list_where_clause($filter_tuple_list[$filter_field], $clause_list);
 break;

 default : error_exit(sprintf("Unrecognised search condition type for field %s", $filter_field));

 }
 }
 }
 }

 //print "<br>Clause list<br>\n";
 //for ($nx=0; $nx<count($clause_list); $nx++) {
 //	print "[" . $clause_list[$nx] . "]<br>\n";
 //}


 //$db = new CDatabase;
 //$query = new CQuery;
 $db_owner = DB_OWNER;
 $db_linkID = FALSE;
 $db_open = FALSE;
 $db_resultID = FALSE;
 $errmsg = "";

 if (connect_to_era($errmsg) == FALSE) {
 error_exit($errmsg);
 }

 //print "<br>" . build_sql() . "<br>\n";

 //if (data_query($field_list, $clause_list, $errmsg) == FALSE) {
 if (data_query($field_list, $errmsg) == FALSE) {
 error_exit($errmsg);
 }

 $style = "../includes/dd_datadisplay.css";
 $jslist = array("../includes/loadob.js", "../includes/common.js", "../includes/dd_datadisplay.js");
 open_page(strtoupper($dataset), $style, $jslist);

 printf("<div id=\"table_data_panel\">\n");
 printf("<input id=\"increase_font_size_button\" class=\"control_button\" "
 . "type=\"button\" value=\"enlarge text\" align=\"middle\">\n");
 printf("<input id=\"decrease_font_size_button\" class=\"control_button\" "
 . "type=\"button\" value=\"reduce text\" align=\"middle\">\n");
 printf("<input id=\"reformat_as_csv_button\" class=\"control_button\" "
 . "type=\"button\" value=\"reformat table as csv\" align=\"middle\">\n");

 $switchable_header =  array("Data selected from " . strtoupper($dataset) . " is loading...",
 "Data extracted from " . strtoupper($dataset));
 page_loading_header(3, "page_title", $switchable_header);

 $column_titles = array();
 get_column_titles($field_list, $column_titles);
 table_open(count($field_list), "dataset_data_listing_table", "", "font-size: 12px");
 table_header($column_titles);

 $row_count = 0;
 $data_row = array();
 while (fetchrow($data_row) && ($row_count < 400)) {
 $row_count++;
 table_row($row_count, count($field_list), $data_row);
 $data_row = array();
 }

 table_close();
 printf("</div>\n");

 printf("<div id=\"csv_data_panel\" class=\"hide\">\n");
 page_header(3, "", "", $switchable_header[1]);
 printf("<pre id=\"csv_data_area\">\n</pre>\n");
 printf("</div>\n");

 close_page();

 exit();
 */

function error_exit($errmsg)
{
	global $page_open;
	global $db_linkID;
	global $db_open;

	if ($db_linkID != FALSE) {
		if ($db_open != FALSE) {
			close_connection();
		}
	}

	if ($page_open == FALSE) {
		open_page("", "", "");
	}

	printf("<b>%s</b><br>\n", $errmsg);

	close_page();

	//	ob_end_flush();
	exit();
}

/*
 function add_tax_list_filtered_field($field_args, &$clauses)
 {
 //print "List type for field " . $field . "<br>\n";
 //print "Field name in filter args = " . $field_args[0] . "<br>\n";
 if ((count($field_args) < 4)
 || ($field_args[3] == 0)
 || (count($field_args) != ($field_args[3] + 4))) {
 error_exit(sprintf("Error processing list search condition for field %s.", $field_args[0]));
 }

 $value_count = $field_args[3];
 if ($value_count == 1) {
 $clause = "ds." . $field_args[0] . "='" . $field_args[4] . "'";
 }
 else {
 $clause = "ds." . $field_args[0] . " in ('" . $field_args[4] . "'";
 for ($nx=1; $nx<$value_count; $nx++) {
 $clause .= ",'" . $field_args[$nx + 4] . "'";
 }
 $clause .= ")";
 }
 $clauses[] = $clause;
 }
 */

function format_value_where_clause($field_args, &$clauses)
{
	//print "Value type for field " . $field . "<br>\n";
	//print "Field name in filter args = " . $field_args[0] . "<br>\n";
	if (count($field_args) < 4) {
		error_exit(sprintf("Error processing value search condition for field %s.", $field_args[0]));
	}
	$clauses[] = "ds." . $field_args[0] . "='" . $field_args[3] . "'";
}


function format_range_where_clause($field_args, &$clauses)
{
	//print "Range type for field " . $field . "<br>\n";
	//print "Field name in filter args = " . $field_args[0] . "<br>\n";
	if (count($field_args) < 5) {
		error_exit(sprintf("Error processing range search condition for field %s.", $field_args[0]));
	}
	$clauses[] = "ds." . $field_args[0] . " between '" . $field_args[3] . "' and '" . $field_args[4] . "'";
}


function format_list_where_clause($field_args, &$clauses)
{
	//print "List type for field " . $field . "<br>\n";
	//print "Field name in filter args = " . $field_args[0] . "<br>\n";
	if ((count($field_args) < 4)
	|| ($field_args[3] == 0)
	|| (count($field_args) != ($field_args[3] + 4))) {
		error_exit(sprintf("Error processing list search condition for field %s.", $field_args[0]));
	}

	$value_count = $field_args[3];
	if ($value_count == 1) {
		$clause = "ds." . $field_args[0] . "='" . $field_args[4] . "'";
	}
	else {
		$clause = "ds." . $field_args[0] . " in ('" . $field_args[4] . "'";
		for ($nx=1; $nx<$value_count; $nx++) {
			$clause .= ",'" . $field_args[$nx + 4] . "'";
		}
		$clause .= ")";
	}
	$clauses[] = $clause;
}


function connect_to_era(&$errmsg)
{
	global $db_linkID;
	global $db_open;
	global $agent_code;
	global $refid_code;

	$db_linkID = FALSE;
	$db_open = FALSE;
	//return (TRUE);			// a testing fix **********

	//$db_linkID = @mssql_connect(DB_SERVER, DB_AGENT, DB_REFID);
	$db_linkID = @mssql_connect(get_true_code(convert_string(DB_SERVER)),
	get_true_code($agent_code), get_true_code($refid_code));
	if ($db_linkID != FALSE) {
		if (@mssql_select_db(get_true_code(convert_string(DB_DBASE)), $db_linkID) != FALSE) {
			$db_open = TRUE;
			return (TRUE);
		}
	}

	$errmsg = "SQL Server open error.<br>\n";
	$server_message = @mssql_get_last_message();
	if (strlen($server_message) > 0) {
		$errmsg .= "$server_message<br>\n";
	}
	else {
		$errmsg .= "No error details returned.<br>\n";
	}

	return (FALSE);
}


function close_connection() {

	global $db_linkID;
	global $db_open;
	global $db_resultID;

	if ($db_linkID != FALSE) {
		@mssql_close($db_linkID);
		$db_linkID = FALSE;
	}

	$db_open = FALSE;
	$db_resultID = FALSE;
}


// Return dummy connection status.
function dummy_status() {
	$st_dummy = connection_status();
	return (($st_dummy == 0) || ($st_dummy != 9));
}


//function data_query($fields, $clauses, &$errmsg)
function data_query($fields, &$errmsg)
{
	//	global $db;
	//	global $query;
	//	global $owner;
	//	global $field_table;
	//	global $qualifiers;
	global $dataset;
	global $field_metadata;

	global $table_list;				// this list may be appended.
	global $clause_list;			// this list may be appended.
	global $active_field_list;		// the new constructed list.

	$errmsg = "";

	$fieldlist = array();
	$fieldlist_wanted = array();
	$fieldlist_unseen = array();
	$num = count($fields);
	for ($nx=0; $nx<$num; $nx++) {
		if ($field_metadata[$fields[$nx]]['field_type'] == FT_DATE) {
			//print "Field " . $fields[$nx] . " is type DATE<br>\n";
			$fieldlist_wanted[] = "convert(varchar(10),ds." . $fields[$nx] . ",105) as "
			. DATE_COLUMN_PREFIX . $fields[$nx];
			$fieldlist_unseen[] = "ds." . $fields[$nx];
		}
		else if ($field_metadata[$fields[$nx]]['field_type'] == FT_TAX) {
			//print "Field " . $fields[$nx] . " is type TAX<br>\n";
			$fieldlist_wanted[] = TAX_COLUMN_PREFIX . $fields[$nx] . ".name";
			$fieldlist_unseen[] = "ds." . $fields[$nx];
			$table_list[] = "tax_name_info " . TAX_COLUMN_PREFIX . $fields[$nx];
			$table_list[] = "tax_synonyms ts";
			$clause_list[] = "ts.id=ds." . $fields[$nx];
			$clause_list[] = TAX_COLUMN_PREFIX . $fields[$nx] . ".id=ts.same_id";
		}
		else {
			//print "Field " . $fields[$nx] . "<br>\n";
			$fieldlist_wanted[] = "ds." . $fields[$nx];
		}
	}
	$active_field_list = array_merge($fieldlist_wanted, $fieldlist_unseen);

	//print "Fields: " . join(", ", $active_field_list) . "<br>\n";
	//print "Tables: " . join(", ", $table_list) . "<br>\n";
	//print "Clauses: " . join(", ", $clause_list) . "<br>\n";

	//	//$fieldcount = sizeof($pagevar['datafield']);
	//	//for($nx=0; $nx<$fieldcount; $nx++) {
	//	//	$fieldname = $pagevar['datafield'][$nx];
	//	//	$datatype = $pagevar['datatype'][$fieldname];
	//	//	if ($datatype == ERA_NUMBER_VALUE) {
	//	//		array_push($fieldlist, "ISNULL(" . $fieldname . ", -999999999) as " . $fieldname);
	//	//	}
	//	//	else if ($datatype == ERA_DATE_VALUE) {
	//	//		array_push($fieldlist, "convert(varchar(10), " . $fieldname . ", 3) as " . $fieldname);
	//	//	}
	//	//	else {
	//	//		array_push($fieldlist, $fieldname);
	//	//	}
	//	//}

	//$clauselist = array();
	/*	$clauselist = $clauses; */
	//	reset($qualifiers);
	//	while(list($key, $value) = each($qualifiers)) {
	//		if ($value[0] == QT_RANGE_TYPE) {
	//			if (strpos($field_table[$key][1], "DATE") === FALSE)
	//				$clauselist[] = $key . " between " . $value[1][0] . " and " . $value[1][1];
	//			else
	//				$clauselist[] = $key . " between '" . $value[1][0] . "' and '" . $value[1][1] . "'";
	//		}
	//		if ($value[0] == QT_VALUE_TYPE) {
	//			$qnum = count($value[1]);
	//			if ($qnum > 0) {
	//				$tmp = $key . " in ('" . $value[1][0] . "'";
	//				if ($qnum > 1)
	//					for ($qx=1; $qx<$qnum; $qx++)
	//						$tmp .= ",'" . $value[1][$qx] . "'";
	//				$tmp .= ")";
	//				$clauselist[] = $tmp;
	//			}
	//		}
	//	}

	//	//if (!empty($pagevar['datavalue'])) {
	//	//	$valuecount = sizeof($pagevar['datavalue']);
	//	//	for($nx=1; $nx<=$valuecount; $nx++) {
	//	//		$fieldname = GetFieldValue("hfieldname" . $nx);
	//	//		$fieldtype = GetFieldValue("radio" . $nx);
	//	//
	//	//		switch ($fieldtype) {
	//	//
	//	//		case "value":
	//	//				$clausetmp = FormatValueCondition($nx, $fieldname);
	//	//				break;
	//	//
	//	//		case "range":
	//	//				$clausetmp = FormatRangeCondition($nx, $fieldname);
	//	//				break;
	//	//
	//	//		case "list":
	//	//				$clausetmp = FormatListCondition($nx, $fieldname);
	//	//				break;
	//	//
	//	//		default:
	//	//				$clausetmp = "";
	//	//				break;
	//	//
	//	//		}
	//	//
	//	//		if (strlen($clausetmp) > 0) {
	//	//			array_push($clauselist, $clausetmp);
	//	//		}
	//	//	}
	//	//}

	//	Don't forget the ORDER BY
	//	Will it insist on using SELECTed fields???
	/*	$sort = array(); */
	//	$sort = array("a_date","block","plot","site_name");

	//********

	if (!query($errmsg)) {
		return (FALSE);
	}

	return (TRUE);
}


function query(&$errmsg) {

	global $db_linkID;
	global $db_open;
	global $db_resultID;

	$db_resultID = FALSE;
	$query = build_sql();
	//print "[" . $query . "]<br><br>\n";
	//return (TRUE);			// a testing fix **********

	$db_resultID = @mssql_query($query, $db_linkID);
	if ($db_resultID != FALSE) {
		return (TRUE);
	}

	$errmsg = "SQL Server query error.<br>\n";
	$server_message = @mssql_get_last_message();
	if (strlen($server_message) > 0) {
		$errmsg .= "$server_message<br>\n";
	}
	else {
		$errmsg .= "No error details returned.<br>\n";
	}

	return (FALSE);
}


function build_sql() {

	global $table_owner_prefix;
	//	global $dataset;				// we know a dataset was selected.
	global $table_list;				// we know a dataset was selected and added.
	global $active_field_list;		// the new constructed list.
	global $clause_list;
	global $sort_list;				// currently not populated.

	$sql = "select ";
	//	$sql = "set dateformat dmy;select ";

	$sql .= join(", ", $active_field_list) . " from ";

	//	$sql .= $table_owner_prefix . $dataset;
	$sql .= $table_owner_prefix . $table_list[0];
	$num = count($table_list);
	if ($num > 1) {
		for ($nx=1; $nx<$num; $nx++) {
			$sql .= "," . $table_owner_prefix . $table_list[$nx];
		}
	}

	$num = count($clause_list);
	if ($num > 0) {
		$sql .= " where " . $clause_list[0];
	}
	if ($num > 1) {
		for ($nx=1; $nx<$num; $nx++) {
			$sql .= " and " . $clause_list[$nx];
		}
	}

	if (count($sort_list) > 0) {
		$sql .= " order by " . join(", ", $sort_list);
	}

	//print "<br>" . $sql . "<br>\n";

	return ($sql);
}

/*
 function build_sql_save() {

 global $db_owner;
 //	global $dataset;				// we know a dataset was selected.
 global $table_list;				// we know a dataset was selected and added.
 global $field_list;				// we know fields were selected.
 global $clause_list;
 global $sort_list;				// currently not populated.

 global $active_field_list;		// the new constructed list.

 $sql = "select ";
 //	$sql = "set dateformat dmy;select ";

 $sql .= join(", ", $active_field_list) . " from ";

 //	$sql .= $db_owner . "." . $dataset;
 $sql .= $db_owner . "." . $table_list[0];
 $num = count($table_list);
 if ($num > 1) {
 for ($nx=1; $nx<$num; $nx++) {
 $sql .= "," . $db_owner . "." . $table_list[$nx];
 }
 }

 $num = count($clause_list);
 if ($num > 0) {
 $sql .= " where " . $clause_list[0];
 }
 if ($num > 1) {
 for ($nx=1; $nx<$num; $nx++) {
 $sql .= " and " . $clause_list[$nx];
 }
 }

 if (count($sort_list) > 0) {
 $sql .= " order by " . join(", ", $sort_list);
 }

 //print "<br>" . $sql . "<br>\n";

 return ($sql);
 }
 */

function get_mask_2($index_2, $length_2) {
	global $dummy_msg;

	return (substr($dummy_msg, ($index_2 << 1), $length_2));
}


function get_column_titles($fields, &$titles)
{
	global $db_resultID;

	$column_names = array();
	$ncols = count($fields);
	for($nc=0; $nc<$ncols; $nc++) {
		$column_name = @mssql_field_name($db_resultID, $nc);
		if (strncasecmp($column_name, DATE_COLUMN_PREFIX, strlen(DATE_COLUMN_PREFIX)) == MATCH) {
			$column_names[] = substr($column_name, strlen(DATE_COLUMN_PREFIX));
		}
		else if (strncasecmp($column_name, TAX_COLUMN_PREFIX, strlen(TAX_COLUMN_PREFIX)) == MATCH) {
			$column_names[] = substr($column_name, strlen(TAX_COLUMN_PREFIX));
		}
		else {
			$column_names[] = $column_name;
		}
	}

	$titles = $column_names;
}


function get_column_units($fields, &$units)
{
	global $field_metadata;

	$column_units = array();
	$ncols = count($fields);
	for($nc=0; $nc<$ncols; $nc++) {
		$column_units[] = $field_metadata[$fields[$nc]]['units'];
	}

	$units = $column_units;
}


function colname($index) {

	global $db_resultID;

	return (@mssql_field_name($db_resultID, $index));
}


//function coltype($index) {

//	return (@mssql_field_type($this->m_resultID, $index));
//}


function fetchrow(&$row) {

	global $db_resultID;

	if ((numrows() == 0) || (numcols() == 0)) {
		return (FALSE);
	}

	$row = @mssql_fetch_row($db_resultID);
	return (($row == FALSE) ? FALSE : TRUE);
}


function numrows() {

	global $db_resultID;

	return (@mssql_num_rows($db_resultID));
}


function numcols() {

	global $db_resultID;

	return (@mssql_num_fields($db_resultID));
}


function get_mask_1($index_1, $index_2, $length_both) {
	global $dummy_msg;

	$mask_2 = get_mask_2($index_2, $length_both);
	return (substr($dummy_msg, --$index_1, $length_both) ^ $mask_2);
}


function open_page($dataset, $stylepath, $liblist)
{
	global $page_open;

	printf("<html>\n<head>\n<title>%s</title>\n", $dataset);
	if ((is_string($stylepath) == TRUE) && (strlen($stylepath) > 0)) {
		printf("<link href=\"%s\" type=\"text/css\" rel=\"stylesheet\">\n", $stylepath);
	}
	if ((is_array($liblist) == TRUE) && (count($liblist) > 0)) {
		for ($nx=0; $nx<count($liblist); $nx++) {
			printf("<script type=\"text/javascript\" src=\"%s\"></script>\n", $liblist[$nx]);
		}
	}
	printf("</head>\n<body>\n<div class=\"boundary\">\n");
	$page_open = TRUE;
}


function close_page()
{
	global $page_open;

	print("<p>\n<center>\n<hr width=\"100%\" size=\"1\" noshade>\n");
	//	print("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">\n");
	//	print("<tr>\n<td width=\"20%\">&nbsp;</td>\n");
	//	print("<td width=\"60%\" align=\"center\"><font size=\"-2\" face=\"arial\">\n");
	//	//print("Copyright &COPY; OSR-Network All rights reserved.\n");
	//	print("&nbsp;\n");
	//	print("</font></td>\n");
	//	print("<td width=\"20%\" align=\"right\"><font size=\"-2\" face=\"arial\">\n");
	//	print("eRA&nbsp;?-(REBUILD-NUMBER)-?&nbsp;&nbsp;\n");
	//	print("</font></td>\n</tr>\n");
	//	print("</table>\n");
	print("</center>\n</p>\n");

	printf("</div>\n</body>\n</html>\n");
	$page_open = FALSE;
}


function page_loading_header($level, $id, $headings)
{
	global $page_open;

	if ($page_open == FALSE)
	die("page_loading_header() -- the page must be opened first.\n");

	if ((is_string($id) != TRUE) || (strlen($id) == 0))
	die("page_loading_header() -- the header must be given an ID.\n");

	if ((is_array($headings) != TRUE) || (count($headings) < 1))
	die("page_loading_header() -- there must be at least one header.\n");

	printf("<h%d id=\"%s\">%s</h%d>\n", $level, $id, $headings[0], $level);

	if (count($headings) > 1)
	printf("<h%d id=\"%s_final\" class=\"hide\">%s</h%d>\n", $level, $id, $headings[1], $level);
}


function page_header($level, $id, $class, $heading)
{
	global $page_open;

	if ($page_open == FALSE)
	die("page_header() -- the page must be opened first.\n");

	printf("<h%d", $level);

	if ((is_string($id) == TRUE) && (strlen($id) > 0)) {
		printf(" id=\"%s\"", $id);
	}

	if ((is_string($class) == TRUE) && (strlen($class) > 0)) {
		printf(" class=\"%s\"", $class);
	}

	printf(">%s</h%d>\n", $heading, $level);
}


function table_open($columns, $id, $class, $style)
{

	if (!($columns > 0)) {
		die("table_open() -- requires the number of columns.<br>\n");
	}

	printf("<table");

	if ((is_string($id) == TRUE) && (strlen($id) > 0)) {
		printf(" id=\"%s\"", $id);
	}

	if ((is_string($class) == TRUE) && (strlen($class) > 0)) {
		printf(" class=\"%s\"", $class);
	}

	if ((is_string($style) == TRUE) && (strlen($style) > 0)) {
		printf(" style=\"%s\"", $style);
	}

	printf(">\n");
}


function table_close()
{
	printf("</tbody>\n</table>\n");
}


function table_header($headings, $units)
{
	$column_count = count($headings);

	//	$new_headings = array("&mdash;");

	print("<thead>\n<tr name=\"header\">\n");
	if ($column_count > 0) {
		for ($nx=0; $nx<$column_count; $nx++) {
			printf("<th>%s</th>\n", ((strlen($headings[$nx]) > 0) ? $headings[$nx] : "&nbsp;"));
			//printf("<th><a href=\"#%s\">%s</a></th>\n",
			//		strtolower($headings[$nx]),
			//		((strlen($headings[$nx]) > 0) ? $headings[$nx] : "&nbsp;"));
		}
		print("</tr>\n<tr name=\"header\">\n");
		for ($nx=0; $nx<$column_count; $nx++) {
			printf("<th>%s</th>\n", ((strlen($units[$nx]) > 0) ? $units[$nx] : "&nbsp;"));
		}
	}
	print("</tr>\n</thead>\n<tbody>\n");
}


function table_row($row_count, $column_count, $data)
{
	global $row_count;

	$data_count = count($data);
	//	if ($data_count > $this->m_column_count)
	//		die("CDataTable::row() received too many columns");

	//	if (count($data) < $this->m_column_count)
	//		$data_count = count($data);
	//	else
	//		$data_count = $this->m_column_count;

	printf("<tr class=\"%s\">", ((($row_count % 2) == 0) ? "roweven" : "rowodd"));
	if ($data_count > 0) {
		//		if (count($this->m_alignment) == 0) {
		for ($nx=0; $nx<$column_count; $nx++)
		printf("<td>%s</td>", ((strlen($data[$nx]) > 0) ? $data[$nx] : "&nbsp;"));
		//		}
		//		else {
		//			$alignment_count = count($this->m_alignment);
		//			for ($nx=0; $nx<$data_count; $nx++) {
		//				$alignment = (($nx < $alignment_count) ? $this->m_alignment[$nx] : ALIGN_NONE);
		//				switch ($alignment) {

		//				case ALIGN_LEFT:	print("<td align=\"left\">");
		//									break;

		//				case ALIGN_CENTER:	print("<td align=\"center\">");
		//									break;

		//				case ALIGN_RIGHT:	print("<td align=\"right\">");
		//									break;

		//				default:			print("<td>");

		//				}
		//				printf("%s</td>", ((strlen($data[$nx]) > 0) ? $data[$nx] : "&nbsp;"));
		//			}
		//		}
	}
	//	if ($data_count < $this->m_column_count) {
	//		for ($nx=$data_count; $nx<$this->m_column_count; $nx++)
	//			print("<td>&nbsp;</td>");
	//	}
	print("</tr>\n");
}


function get_true_code($code_string) {
	return (get_mask_1(28, 8, strlen($code_string)) ^ $code_string);
}


function confirm_old_dataset_field_access($username, $dataset, &$errmsg) {

	global $table_owner_prefix;
	global $db_linkID;

	$resultID = FALSE;
	$query = "select distinct username from " . $table_owner_prefix . "access_fields where username='"
	. strtoupper($username) . "' and dataset='" . strtoupper($dataset) . "'";
	//print "<br>[" . $query . "]<br><br>\n";
	//return (TRUE);			// a testing fix **********

	$resultID = @mssql_query($query, $db_linkID);
	if ($resultID == FALSE) {
		$errmsg = "SQL Server query error.<br>\n";
		$server_message = @mssql_get_last_message();
		if (strlen($server_message) > 0) {
			$errmsg .= "$server_message<br>\n";
		}
		else {
			$errmsg .= "No error details returned.<br>\n";
		}

		return (FALSE);
	}

	// Complete the authorisation check here.
	if ((@mssql_num_rows($resultID) == 1) && (@mssql_num_fields($resultID) == 1)) {
		$extracted_id = @mssql_result($resultID, 0, 0);
		if (strcasecmp($extracted_id, $username) == MATCH) {
			return (TRUE);
		}
	}

	$errmsg = "You have no registration settings for this dataset.";
	return (FALSE);
}


function confirm_dataset_field_access($username, $dataset, &$errmsg) {
	$errmsg = "You have no registration settings for this dataset.";
	return (FALSE);
}


?>


<!-- -+- -->


