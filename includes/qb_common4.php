<?php

/**
 *	ERA query base common functions.
 *	@package ERA
 *
 *	@version 0.0.4  [31.5.2007]
 *	@version 0.0.5  [26.6.2007]
 *	@version 0.0.6  [1.8.2007]
 *	@version 0.0.7  [16.10.2008]
 *	@version 0.0.8  [7.11.2008]
 */


require_once("../includes/qb_defs4.php");


//  **** Scattered authorisation definitions. **********************************
//                                                                             *

// "select usr from checks where locate".
$authorisation_query = array("fryrpg", "hfe", "sebz", "purpxf", "jurer", "ybpngr");

// "refer, tag, notes".
$authorisation_fields = array("ersre", "gnt", "abgrf");

//                                                                             *
//  ****************************************************************************


// Field type codes.
function format_field_type_code($a_nType_Code)
{

	switch ($a_nType_Code) {

	case FT_UNKNOWN:
			$sText_Label = "FT_UNKNOWN";
            break;

	case FT_READING:
			$sText_Label = "FT_READING";
			break;

	case FT_DATE:
			$sText_Label = "FT_DATE";
			break;

	case FT_CODE:
			$sText_Label = "FT_CODE";
			break;

	case FT_TAX:
			$sText_Label = "FT_TAX";
			break;

	default:
			$sText_Label = "Unrecognised field type";
	}

	return ($sText_Label);
}


// Data type codes.
function format_data_type_code($a_nType_Code)
{

	switch ($a_nType_Code) {

	case DT_UNKNOWN:
			$sText_Label = "DT_UNKNOWN";
			break;

	case DT_TEXT:
			$sText_Label = "DT_TEXT";
			break;

	case DT_INTEGER:
			$sText_Label = "DT_INTEGER";
			break;

	case DT_DECIMAL:
			$sText_Label = "DT_DECIMAL";
			break;

	case DT_DATE:
			$sText_Label = "DT_DATE";
			break;

	default:
			$sText_Label = "Unrecognised data type";
	}

	return ($sText_Label);
}


// Query-base type codes.
function format_query_type_code($a_nType_Code)
{

	switch ($a_nType_Code) {

	case QT_NONE:
			$sText_Label = "QT_NONE";
			break;

	case QT_SINGLE:
			$sText_Label = "QT_SINGLE";
			break;

	case QT_VALUE:
			$sText_Label = "QT_VALUE";
			break;

	case QT_RANGE:
			$sText_Label = "QT_RANGE";
			break;

	case QT_LIST:
			$sText_Label = "QT_LIST";
			break;

	case QT_ERATAX:
			$sText_Label = "QT_ERATAX";
			break;

	case QT_GROUPED:
			$sText_Label = "QT_GROUPED";
			break;

	case QT_UNKNOWN:
			$sText_Label = "QT_UNKNOWN";
			break;

	case QT_NOTFOUND:
			$sText_Label = "QT_NOTFOUND";
			break;

	default:
			$sText_Label = "Unrecognised query-base type";
	}

	return ($sText_Label);
}


// Sort type codes.
function format_sort_type_code($a_nType_Code)
{

	switch ($a_nType_Code) {

	case ST_NONE:
			$sText_Label = "ST_NONE";
			break;

	case ST_NATURAL:
			$sText_Label = "ST_NATURAL";
			break;

	case ST_GROUPED:
			$sText_Label = "ST_GROUPED";
			break;

	case ST_UNKNOWN:
			$sText_Label = "ST_UNKNOWN";
			break;

	case ST_NOTFOUND:
			$sText_Label = "ST_NOTFOUND";
			break;

	default:
			$sText_Label = "Unrecognised sort type";
	}

	return ($sText_Label);
}


// Access type codes.
function format_access_type_code($a_nType_Code)
{

	switch ($a_nType_Code) {

	case AT_NORMAL:
			$sText_Label = "AT_NORMAL";
			break;

	case AT_EXPERT:
			$sText_Label = "AT_EXPERT";
			break;

	case AT_SYSTEM:
			$sText_Label = "AT_SYSTEM";
			break;

	default:
			$sText_Label = "Unrecognised access type";
	}

	return ($sText_Label);
}


// Block type codes.
function format_block_type_code($a_nType_Code)
{

	switch ($a_nType_Code) {

	case BT_PLAIN:
			$sText_Label = "BT_PLAIN";
			break;

	case BT_TITLE:
			$sText_Label = "BT_TITLE";
			break;

//	case BT_TITLE_LINK:
//			$sText_Label = "BT_TITLE_LINK";
//			break;

//	case BT_TITLE_INFO:
//			$sText_Label = "BT_TITLE_INFO";
//			break;

//	case BT_TITLE_PLUS:
//			$sText_Label = "BT_TITLE_PLUS";
//			break;

	default:
			$sText_Label = "Unrecognised block type";
	}

	return ($sText_Label);
}


//  **** Scattered authorisation functions. ************************************
//                                                                             *

function get_owner_prefix($a_owner_code) {
	$decoded_owner = get_true_code($a_owner_code) . SIMPLE_DOT;
	return ((strcmp($decoded_owner, DUMMY_PREFIX) == MATCH) ? "" : $decoded_owner);
}

function wrap_search_text($a_text) {
	return (SEARCH_START . $a_text . SEARCH_CLOSE);
}

function simple_encode($a_text) {
	eval(EVAL_PART1 . EVAL_PART2 . EVAL_PART3 . $a_text . EVAL_CLOSE);
	return ($text);
}

function simple_join($a_text1, $a_text2) {
	return ($a_text1 . $a_text2);
}

function convert_string($encoded_string) {
	//return (stripcslashes($encoded_string));
	return ($encoded_string);
}

//                                                                             *
//  ****************************************************************************


function MakeQueryString($params) {

	$querystring = "";

	if (!empty($params)) {
		//reset($params);
		while (list($key, $val) = each($params)) {
			if (!empty($querystring))
				$querystring .= "&";
			$querystring .= $key . "=" . $val;
		}
	}

	return ($querystring);
}


function print_array($list, $name) {

	if (sizeof($list) == 0) {
		print "Array $name is empty<BR>\n";
	}
	else {
		while (list($key, $val) = each($list))
			print "$name" . "[\"$key\"] = $val<BR>\n";
	}
}


?>


<!-- -+- -->


