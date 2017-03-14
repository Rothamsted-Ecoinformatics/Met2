<?php

/**
 *	Download ERA dataset field-set definitions.
 *	@package ERA
 *
 *	@version 0.0.3  [19.11.2007]
 *	@version 0.0.4  [1.7.2008]
 *
 *	$_POST[] input args:
 *
 *	'seq_id'
 *	'msg_id'
 *	'dataset'
 *
 */


define("FIRST_TX_SEQUENCE_COUNT",	  1);
define("LAST_TX_SEQUENCE_COUNT",	255);

// Message header-field identifiers.
define("TR_SEQ",		0);
define("TR_ID",			1);
define("TR_CODE",		2);
define("TR_TEXT",		3);
define("TR_USER",		4);

// Message type identifiers.
define("NO_ID",			"");
define("CLEAR_ID",		"clear");
define("TABLE_ID",		"table");

define("TR_SEPARATOR",	"!-!");
define("TR_PREFIX",		"  " . TR_SEPARATOR);
define("TR_SUFFIX",		TR_SEPARATOR . "  ");
define("TR_SHORTSUFFIX","  ");


ob_start();
session_start();


require_once("../includes/era_config4.php");
//require_once("../includes/qb_defs4.php");
//require_once("../includes/qb_common4.php");

//require_once("../includes/qb_datasets4.php");
//require_once("../includes/qb_groups4.php");

ob_clean();


$seq_id = 0;
$msg_id = "";
$dataset_id = "";

// Only continue if a valid sequence id was received.
if (  (array_key_exists("seq_id", $_POST) == FALSE)
	|| (is_string($_POST['seq_id']) == FALSE)
	|| (strlen($_POST['seq_id']) == 0)
	|| ($_POST['seq_id'] < FIRST_TX_SEQUENCE_COUNT)
	|| ($_POST['seq_id'] > LAST_TX_SEQUENCE_COUNT)  ) {
	exit();
}

// Only continue if a valid message id was received.
if (  (array_key_exists("msg_id", $_POST) == FALSE)
	|| (is_string($_POST['msg_id']) == FALSE)
	|| (strlen($_POST['msg_id']) == 0)  ) {
	exit();
}

// Only continue if a valid dataset id was received.
if (  (array_key_exists("dataset", $_POST) == FALSE)
	|| (is_string($_POST['dataset']) == FALSE)
	|| (strlen($_POST['dataset']) == 0)  ) {
	exit();
}

$seq_id = $_POST['seq_id'];
$msg_id = $_POST['msg_id'];
$dataset_id = $_POST['dataset'];


// Locate the dataset field-set definition.
$include_path = DEFAULT_METADATA_PATH . $dataset_id . DOWNLOAD_FILE_AFFIX;
//print "include path = " . $include_path . "<br>\n";

if (is_file($include_path)) {
	require_once($include_path);
}
else {
	send_reply($seq_id, $msg_id, sprintf("Field-set definition for dataset %s not found.", $dataset_id));
	exit();
}


if ((is_string($fieldset_definition) == FALSE)
	|| (strlen($fieldset_definition) == 0)) {
	send_reply($seq_id, $msg_id, sprintf("Field-set definition element for dataset %s not found.", $dataset_id));
	exit();
}


//if (array_key_exists($dataset_id, $field_set) == FALSE) {
//	send_reply($seq_id, $msg_id, sprintf("Field-set definition element for dataset %s not found.", $dataset_id));
//	exit();
//}

send_response($seq_id, $msg_id);
exit();


function send_reply($a_seq_id, $a_msg_id, $a_error_msg) {

	$response_fields = array(0, "", 0, "", "");

	$response_fields[TR_SEQ] = $a_seq_id;
	$response_fields[TR_ID] = $a_msg_id;
	$response_fields[TR_CODE] = 1;
	$response_fields[TR_TEXT] = $a_error_msg;
	$response_fields[TR_USER] = "";

	$response_msg = TR_PREFIX . implode(TR_SEPARATOR, $response_fields) . TR_SUFFIX;

	print $response_msg;
}


function send_clear() {
/*
	$response_fields = array(0, "", 0, "", "");

	$response_fields[TR_SEQ] = 0;
	$response_fields[TR_ID] = CLEAR_ID;
	$response_fields[TR_CODE] = 1;
	//$response_fields[TR_TEXT] = "";
	$response_fields[TR_TEXT] = get_session_id();
	$response_fields[TR_USER] = "";

	$response_msg = TR_PREFIX . implode("!-!", $response_fields) . TR_SUFFIX;

	print $response_msg;
*/}


function send_response($a_seq_id, $a_msg_id) {

	global $fieldset_definition;

	$transfer_header = array(0, "", 0, "", "");

	$transfer_header[TR_SEQ] = $a_seq_id;
	$transfer_header[TR_ID] = $a_msg_id;
	$transfer_header[TR_CODE] = 0;
	$transfer_header[TR_TEXT] = "";
	$transfer_header[TR_USER] = "";

	$response_msg = TR_PREFIX . implode(TR_SEPARATOR, $transfer_header) 
								. TR_SEPARATOR . $fieldset_definition . TR_SHORTSUFFIX;

	print $response_msg;
}


?>


<!-- -+- -->


