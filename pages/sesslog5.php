<?php

/**
 *	@fileoverview Session login test.
 *
 *	@version 0.0.2  [14.3.2007]
 *	@version 0.0.4  [21.3.2007]
 *	@version 0.0.7  [5.4.2007]
 *	@version 0.0.8  [11.4.2007]
 *	@version 0.0.9  [18.4.2007]
 *
 *	@version 0.2.6  [14.6.2007]		Start of server 4 version.
 *	@version 0.2.8  [5.7.2007]
 *	@version 0.2.11  [18.7.2007]
 *	@version 0.2.14  [26.7.2007]
 *	@version 0.2.15  [22.8.2007]
 *	@version 0.2.16  [26.9.2007]
 *	@version 0.2.19  [18.10.2007]
 *	@version 0.2.21  [15.11.2007]
 *	@version 0.2.22  [28.11.2007]
 *	@version 0.2.24  [4.7.2008]
 *	@version 0.6.1  [22.7.2008]		// start of prototype 6
 *	@version 0.6.2  [23.7.2008]
 *	@version 0.6.3  [13.8.2008]
 *	@version 0.6.4  [27.8.2008]
 *	@version 0.6.5  [5.9.2008]		// start of remodeling to version 5
 *	@version 0.6.6  [8.9.2008]
 *	@version 0.6.7  [16.10.2008]
 *	@version 0.6.9  [22.10.2008]
 *
 *	$_POST[] input args:
 *
 *	'transfer_id'
 *	'proj_agent'
 *	'rerun_code'
 *
 *	For testing only
 *	'refid'
 *	'set_reply'
 *	'set_delay'
 *
 */


// Login status codes.
define("OK",			TRUE);
define("FAILURE",		FALSE);

// Login state codes.
define("NO_STATE",		0);
define("LOGGED_OUT",	1);
define("LOGGING_IN",	2);
define("LOGGED_IN",		3);


// User details offsets.
define("UX_HASH",		0);
define("UX_REALNAME",	1);
define("UX_USERNAME",	2);

// Message header-field identifiers.
define("TR_SEQ",		0);
define("TR_ID",			1);
define("TR_CODE",		2);
define("TR_TEXT",		3);
define("TR_USER",		4);

// Message type identifiers.
define("NO_ID",			"");
define("CLEAR_ID",		"clear");
define("RESET_ID",		"reset");
define("LOGIN_ID",		"login");
define("REPLY_ID",		"reply");

define("LOGIN_TABLE_ID","my_datasets");

define("TR_SEPARATOR",	"!-!");
define("TR_PREFIX",		"  " . TR_SEPARATOR);
define("TR_SUFFIX",		TR_SEPARATOR . "  ");
//define("LOGIN_RESPONSE_LENGTH",	5);

define("HASH_LENGTH",	40);


//session_cache_limiter('private_no_expire');
//session_cache_limiter('nocache');


ob_start();
session_start();


require_once("../includes/era_config4.php");
require_once("../includes/qb_defs4.php");
require_once("../includes/qb_common4.php");

require_once("../includes/qb_datasets4.php");

require_once("../includes/qb_listgen4.php");
//require_once("../includes/sesslog5_trial.php");

ob_clean();

//header("Cache-control: no-store");

// seed with microseconds since last "whole" second
// (needed for to fix odd behaviour with IE).
mt_srand((double) microtime() * 1000000);


$stored_id = "";
$stored_hash = 0;
$login_state = NO_STATE;
$transfer_id = NO_ID;

$refid_code = "\x7f7n,2a";

$server_reply = "";
$server_delay = 0;

$db_linkID = FALSE;
$db_resultID = FALSE;

$new_code = 0;
$login_status = FAILURE;
$proj_agent = "";
$rerun_code = "";
$refid = "";
$user_hash = "";
$computed_hash = "";

//$response_code = get_response_code(FAILURE);

//display_input();

$agent_code = convert_string("\x7fbekf}~");

// Dummy connection status.
$dummy_connection_status = dummy_status();

// If this is a new session ensure it is properly initialised.
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

// Resolve the state of the session variables to a single state ID.
$stored_id = $_SESSION['user_id'];
$stored_hash = $_SESSION['auth_code'];
$_SESSION['auth_code'] = 0;				// ensures the code can only be used once
if (strlen($stored_id) > 0) {
	$login_state = LOGGED_IN;
	//print "LOGGED_IN\n";
}
else {
	if ($stored_hash != 0) {
		$login_state = LOGGING_IN;
		//print "LOGGING_IN\n";
	}
	else {
		$login_state = LOGGED_OUT;
		//print "LOGGED_OUT\n";
	}
}


// Complete building the encoded password.
$refid_code .= "e1";


// Only continue with a valid message-type otherwise send a clear-message and exit.
// It is not possible to send no reply because the headers have already been sent.
// A clear-message provides the best chance of resynchronising server and client.
if (  (array_key_exists("transfer_id", $_POST) == FALSE)
	|| (is_string($_POST['transfer_id']) == FALSE)
	|| (strlen($_POST['transfer_id']) == 0)  ) {
	send_clear();
	ob_end_flush();
	exit();
}
else {
	$transfer_id = $_POST['transfer_id'];
	if ((strcasecmp($transfer_id, CLEAR_ID) != MATCH)
		&& (strcasecmp($transfer_id, RESET_ID) != MATCH)
		&& (strcasecmp($transfer_id, LOGIN_ID) != MATCH)) {
		send_clear();
		ob_end_flush();
		exit();
	}
}


// Final tweak to the encoded password.
$refid_code = simple_encode(convert_string($refid_code));


// Was a server reply error requested ? (only used during testing).
if (  (array_key_exists("set_reply", $_POST) != FALSE)
	&& (is_string($_POST['set_reply']) != FALSE)
	&& (strlen($_POST['set_reply']) > 0)  ) {
	$server_reply = $_POST['set_reply'];
}
if (strcasecmp($server_reply, "empty") == MATCH) {
	ob_clean();
	exit();
}

// Set up any requested server delay (only used during testing).
if (  (strcasecmp($server_reply, "delay") == MATCH)
	&& (array_key_exists("set_delay", $_POST) != FALSE)
	&& (is_string($_POST['set_delay']) != FALSE)
	&& (strlen($_POST['set_delay']) > 0)  ) {
	$server_delay = $_POST['set_delay'];
}

if ($server_delay > 0) {		// a testing fix **********
	sleep($server_delay);
}

$table_owner_prefix = get_owner_prefix(convert_string(DB_OWNER));


// Identify and process the input message.
// We have already ensured a valid session is set
// and that a valid message-type has been received.
//
// Process a clear-message.
// Always reply with a clear-message.
if (strcasecmp($transfer_id, CLEAR_ID) == MATCH) {
	// If we're logged in then clear and destroy the session to logout.
	if ($login_state == LOGGED_IN) {

		// Fetch the settings received from the session cookie.
		// They'll be used when expiring the session cookie.
		$params = session_get_cookie_params();
		$save_session_name = session_name();
		$save_session_id = session_id();

		// Unset all of the session variables.
		$_SESSION = array();					// equivalent to a state change to LOGGED_OUT

		// Set to expire the session cookie to destroy
		// the client copy of the current session id.
		// Currently ignore any failure -- the FALSE return.
		// Note this is not buffered by the ob_start() call.
		//setcookie(session_name(), session_id(), (time() - 1800), 
		//		  $params['path'], $params['domain'], $params['secure']);
		setcookie(session_name(), "", (time() - 1800), 
				  $params['path'], $params['domain'], $params['secure']);

		// Destroy the server copy of the session.
		// (Ignore any failure -- the FALSE return).
		session_destroy();						// removes the session file but not the session cookie
												// (currently ignore any failure -- the FALSE return)
	}

	// Finally reply with a clear-message.
	// If we're not logged-in then this changes nothing
	// but acknowledge the clear-message anyway.
    send_clear();
}
//
// Process a reset-message.
// Always reply with a reset-message and a new reset-code. ??? **********
else if (strcasecmp($transfer_id, RESET_ID) == MATCH) {
	// If we're logged in then clear and destroy the session to logout
	// but then restart it ready for the new login.
	if ($login_state == LOGGED_IN) {

		// Unset all of the session variables.
		$_SESSION = array();					// equivalent to a state change to LOGGED_OUT

		// Don't expire the cookie (ie keep the current session id)
		// because it's about to be changed by a successful login.
		// Even if the new login fails the previous session info 
		// will already have been destroyed.

		// Destroy the server copy of the session.
		// (Ignore any failure -- the FALSE return).
		session_destroy();						// removes the session file but not the session cookie
												// (currently ignore any failure -- the FALSE return)

		sleep(3);

		// Creates a new session based on the current session ID.
		// Note the session ID will be changed after login is successful.
		// Would it be useful to change the session ID here also ??? **********
		session_start();
		$_SESSION['user_id'] = "";
		$_SESSION['prev_id'] = "";
		$_SESSION['real_id'] = "";
	}

	// generate a new authentication code (reset-code) for the session
	// even if one was already set (ie we were already in a logging-in state).
    $new_code = get_random_code();
	$_SESSION['auth_code'] = $new_code;		// equivalent to a state change to LOGGING_IN

	// Finally reply with a clear-message.
	send_reset($new_code);
}
//
// Process a login-message.
else if (strcasecmp($transfer_id, LOGIN_ID) == MATCH) {

	// Only if this is the second stage of the two part
	// login sequence do we attempt to complete a login.
	if ($login_state == LOGGING_IN) {

		$login_status = FAILURE;
		$real_name = "";
		$my_dataset_list = array();		// List of active datasets the user is registered for.
		$extra_dataset_list = array();	// List of untransferred datasets the user is registered for.

		// Make sure we have a user id and password (plus a refid if testing).
		//if ((check_login_args($proj_agent, $rerun_code, $refid) != FALSE)
		if ((check_login_args($proj_agent, $rerun_code) != FALSE)
			&& (connect_to_era() != FALSE)) {

			// Ensure the user exists.
			$user_details = array();
			if (get_user_details($proj_agent, $user_details) != FALSE) {
				// Validate the login.
				$computed_hash = sha1($user_details[UX_HASH] . substr($proj_agent, 0 , 3) . $stored_hash);
				if (strcasecmp($computed_hash, $rerun_code) == MATCH) {
					// Setting the session user_id is equivalent to a state change to LOGGED_IN
					$_SESSION['user_id'] = strtolower($proj_agent);
					$_SESSION['prev_id'] = $user_details[UX_USERNAME];
					$_SESSION['real_id'] = $user_details[UX_REALNAME];
					$login_status = OK;
					$real_name = $user_details[UX_REALNAME];
					// Generate a new session id -- standard practice.
					// (Currently ignore any failure -- the FALSE return).
					session_regenerate_id();	// (currently ignore any failure -- the FALSE return)

					// Now get a list of the datasets this user can access.
					$user_dataset_list = array();
					// First try the old era system table.
					if ((strlen($user_details[UX_USERNAME]) > 0)
						&& (get_authorised_datasets($user_details[UX_USERNAME], 
													$user_dataset_list, $errmsg) != FALSE)) {
						// Reduce this to include only the active datasets.
						//if (count($user_dataset_list) > 0) {
						//	for ($nx=0; $nx<count($user_dataset_list); $nx++) {
						//		$dataset = strtolower($user_dataset_list[$nx]);
						//		if (array_key_exists($dataset, $dataset_metadata) != FALSE) {
						//			$my_dataset_list[] = $dataset;
						//		}
						//		//$my_dataset_list = array("newrothmet", "parkcomp", "pkmasseff", "parkyield");
						//	}
						//}
						// Separate the list into the active/transferred datasets and those not yet transferred.
						if (count($user_dataset_list) > 0) {
							for ($nx=0; $nx<count($user_dataset_list); $nx++) {
								$dataset = strtolower($user_dataset_list[$nx]);
								if (array_key_exists($dataset, $dataset_metadata) != FALSE) {
									$my_dataset_list[] = $dataset;
								}
								else {
									$extra_dataset_list[] = $dataset;
								}
								//$my_dataset_list = array("newrothmet", "parkcomp", "pkmasseff", "parkyield");
								//$extra_dataset_list = array();
							}
						}
					}
				}
			}

			close_connection();
		}

		// If login was not successful reply with a clear-message.
		if ($login_status != OK) {
			send_clear();
		}
		// If login was successful reply with a login-message
		// which holds the user attributes and dataset list.
		else {
			//$response_code = get_response_code($login_status);
			//send_response($response_code, $real_name, $my_dataset_list);
			//send_response($real_name, $my_dataset_list);
			//send_response2($response_code, $real_name, $my_dataset_list, $extra_dataset_list);
			send_response2($real_name, $my_dataset_list, $extra_dataset_list);
		}
	}

	// Otherwise we're either fully logged-out or fully logged-in.
	// Either way a login-message is invalid. Send a clear-message
	// to facilitate end-to-end resynchronisation. This seems harsh
	// towards the user but hanging in an invalid state would be worse.
	else {
		// If we're logged in then clear and destroy the session to logout.
		if ($login_state == LOGGED_IN) {

			// Fetch the settings received from the session cookie.
			// They'll be used when expiring the session cookie.
			$params = session_get_cookie_params();
			$save_session_name = session_name();
			$save_session_id = session_id();

			// Unset all of the session variables.
			$_SESSION = array();					// equivalent to a state change to LOGGED_OUT

			// Set to expire the session cookie to destroy
			// the client copy of the current session id.
			// Currently ignore any failure -- the FALSE return.
			// Note this is not buffered by the ob_start() call.
			//setcookie(session_name(), session_id(), (time() - 1800), 
			//		  $params['path'], $params['domain'], $params['secure']);
			setcookie(session_name(), "", (time() - 1800), 
					  $params['path'], $params['domain'], $params['secure']);

			// Destroy the server copy of the session.
			// (Ignore any failure -- the FALSE return).
			session_destroy();						// removes the session file but not the session cookie
													// (currently ignore any failure -- the FALSE return)
		}

		// Finally reply with a clear-message.
		// If we're not logged-in then this changes nothing
		// but acknowledge the clear-message anyway.
		send_clear();
	}
}
//
// Process an unrecognised message.
// We shouldn't arrive here but in case we do
// reply with a clear-message before exiting.
else {
	send_clear();
}

ob_end_flush();
exit();


//
//	Dedicated functions
//

// Make sure we have a user id and hash (plus a refid if testing).
// Return FALSE if any are missing.
//function check_login_args(&$a_id, &$a_hash, &$a_refid) {
function check_login_args(&$a_id, &$a_hash) {

	if (  (array_key_exists("proj_agent", $_POST) == FALSE)
		|| (is_string($_POST['proj_agent']) == FALSE)
		|| (strlen($_POST['proj_agent']) == 0)  ) {
		return (FALSE);
	}

	if (  (array_key_exists("rerun_code", $_POST) == FALSE)
		|| (is_string($_POST['rerun_code']) == FALSE)
		|| (strlen($_POST['rerun_code']) == 0)  ) {
		return (FALSE);
	}

	//if (  (array_key_exists("refid", $_POST) == FALSE)
	//	|| (is_string($_POST['refid']) == FALSE)
	//	|| (strlen($_POST['refid']) == 0)  ) {
	//	return (FALSE);
	//}

	$a_id = strtolower($_POST['proj_agent']);
	$a_hash = $_POST['rerun_code'];
	//$a_refid = $_POST['refid'];
	return (TRUE);
}
/*
function get_response_code($a_key) {

	do {
		$random_code = get_random_code();
	} while ((($random_code % 7) == 1) != $a_key);

	return ($random_code);
}
*/
function get_random_code() {

	return (mt_rand(100, 999));
}

function get_authorisation_table_code($dummy_arg) {

	return (convert_string(DB_USERS));
}

function send_clear() {

	global $server_reply;

	$response_fields = array(0, "", 0, "", "");

	$response_fields[TR_SEQ] = 0;
	$response_fields[TR_ID] = CLEAR_ID;
	//$response_fields[TR_CODE] = 1;
	$response_fields[TR_CODE] = 0;
	$response_fields[TR_TEXT] = "";
	//$response_fields[TR_TEXT] = get_session_id();	// Only use during testing.
	$response_fields[TR_USER] = "";

	$response_msg = TR_PREFIX . implode("!-!", $response_fields) . TR_SUFFIX;

	if (strcasecmp($server_reply, "error") == MATCH) {
		$response_msg = TR_PREFIX . implode("!--!", $response_fields) . TR_SUFFIX;
	}

	print $response_msg;
}

function send_reset($a_new_code) {

	global $server_reply;

	$response_fields = array(0, "", 0, "", "");

	$response_fields[TR_SEQ] = 0;
	$response_fields[TR_ID] = RESET_ID;
	$response_fields[TR_CODE] = $a_new_code;
	$response_fields[TR_TEXT] = "";
	//$response_fields[TR_TEXT] = get_session_id();	// Only use during testing.
	$response_fields[TR_USER] = "";

	$response_msg = TR_PREFIX . implode("!-!", $response_fields) . TR_SUFFIX;

	if (strcasecmp($server_reply, "error") == MATCH) {
		$response_msg = TR_PREFIX . implode("!--!", $response_fields) . TR_SUFFIX;
	}

	print $response_msg;
}

//function send_response($a_response_code, $a_user_name, $a_dataset_list) {
function send_response($a_user_name, $a_dataset_list) {

	global $server_reply;

	$transfer_header = array(0, "", 0, "", "");

	$transfer_header[TR_SEQ] = 0;
	$transfer_header[TR_ID] = LOGIN_ID;
	//$transfer_header[TR_CODE] = $a_response_code;
	$transfer_header[TR_CODE] = 0;
	$transfer_header[TR_TEXT] = "";
	//$response_fields[TR_TEXT] = get_session_id();	// Only use during testing.
	$transfer_header[TR_USER] = $a_user_name;

	$dataset_definition = format_dataset_definition($a_dataset_list);
	$response_msg = TR_PREFIX . implode("!-!", $transfer_header) 
								. "!-!" . $dataset_definition . TR_SUFFIX;

	print $response_msg;
}

//function send_response2($a_response_code, $a_user_name, $a_dataset_list, $a_extra_list) {
function send_response2($a_user_name, $a_dataset_list, $a_extra_list) {

	global $server_reply;

	$transfer_header = array(0, "", 0, "", "");

	$transfer_header[TR_SEQ] = 0;
	$transfer_header[TR_ID] = LOGIN_ID;
	//$transfer_header[TR_CODE] = $a_response_code;
	$transfer_header[TR_CODE] = 1;
	$transfer_header[TR_TEXT] = "";
	//$response_fields[TR_TEXT] = get_session_id();	// Only use during testing.
	$transfer_header[TR_USER] = $a_user_name;

	$dataset_definition = format_dataset_definition2($a_dataset_list, $a_extra_list);
	$response_msg = TR_PREFIX . implode("!-!", $transfer_header) 
								. "!-!" . $dataset_definition . TR_SUFFIX;

	if (strcasecmp($server_reply, "error") == MATCH) {
		$response_msg = TR_PREFIX . implode("!--!", $transfer_header) 
									. "!--!" . $dataset_definition . TR_SUFFIX;
	}

	print $response_msg;
}

function send_null_reply() {

	global $server_reply;

	$response_fields = array(0, "", 0, "", "");

	$response_fields[TR_SEQ] = 0;
	$response_fields[TR_ID] = REPLY_ID;
	$response_fields[TR_CODE] = 1;
	$response_fields[TR_TEXT] = "";
	//$response_fields[TR_TEXT] = get_session_id();	// Only use during testing.
	$response_fields[TR_USER] = "";

	$response_msg = TR_PREFIX . implode("!-!", $response_fields) . TR_SUFFIX;

	print $response_msg;
}

function connect_to_era()
{
	global $db_linkID;
	global $db_resultID;
	global $agent_code;
	global $refid_code;

	$db_linkID = FALSE;
	$db_resultID = FALSE;
	//return (TRUE);			// a testing fix **********

	//$db_linkID = @mssql_connect(DB_SERVER, DB_AGENT, DB_REFID);
	$db_linkID = @mssql_connect(get_true_code(convert_string(DB_SERVER)), 
									get_true_code($agent_code), get_true_code($refid_code));
	if ($db_linkID != FALSE) {
		if (@mssql_select_db(get_true_code(convert_string(DB_DBASE)), $db_linkID) != FALSE) {
			return (TRUE);
		}

		@mssql_close($db_linkID);
		$db_linkID = FALSE;
	}

	return (FALSE);
}

function close_connection()
{
	global $db_linkID;
	global $db_resultID;

	if ($db_linkID != FALSE) {
		@mssql_close($db_linkID);
		$db_linkID = FALSE;
	}

	$db_resultID = FALSE;
}


// Return dummy connection status.
function dummy_status() {
	$st = connection_status();
	return (($st == 0) || ($st != 9));
}

function error_exit($errmsg)
{

//	printf("<b>%s</b><br>\n", $errmsg);

//	ob_end_flush();
	exit();
}


function get_user_details($a_id, &$a_details)
{
	//return (get_user_details_test($a_id, $a_details));		// a testing fix **********
	global $db_linkID;
	global $db_resultID;
	global $table_owner_prefix;

	$db_resultID = FALSE;
	$search_key = wrap_search_text(strtolower($a_id));

	$db_resultID = @mssql_query(get_authorisation_statement(3, $table_owner_prefix, $search_key), 
																						$db_linkID);
	if ($db_resultID == FALSE) {
		return (FALSE);
	}

	// Set to return user details.
	$user_details = array();
	if (@mssql_num_fields($db_resultID) != 3) {
		$errmsg = "Validation access error 1.";
		return (FALSE);
	}
	if (@mssql_num_rows($db_resultID) != 1) {
		return (FALSE);		// user id not found.
	}
    $row = @mssql_fetch_row($db_resultID);
	if (count($row) != 3) {
		$errmsg = "Validation access error 2.";
		return (FALSE);
	}
	if (strlen($row[2]) == HASH_LENGTH) {
		$user_details[UX_HASH] = $row[2];
		$user_details[UX_REALNAME] = $row[0];
		$user_details[UX_USERNAME] = $row[1];
	}
	//print count($user_details) . "<br>\n";
	//for (($nx=0; $nx<count($user_details); $nx++) {
	//	print $user_details[$nx] . "<br>\n";
	//}

	$a_details = $user_details;
	return (TRUE);
}

function get_authorised_datasets($username, &$list, &$errmsg)
{
	//print "get_authorised_datasets($username)<br>\n";					// a testing fix **********
	//return (get_authorised_datasets_test($username, $list, $errmsg));	// a testing fix **********
	global $db_linkID;
	global $db_resultID;
	global $table_owner_prefix;

	$db_resultID = FALSE;
	$errmsg = "";
	$full_query = "select distinct dataset from ";
	$full_query .= $table_owner_prefix . "access_fields where username='";
	$full_query .= strtoupper($username) . "' order by dataset";
	//print "[" . $full_query . "]<br>\n";

	$db_resultID = @mssql_query($full_query, $db_linkID);
	if ($db_resultID == FALSE) {
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

	// Extract and save list of names of all datasets user can access.
	//print @mssql_num_rows($db_resultID) . ", " . @mssql_num_fields($db_resultID) . "<br>\n";
	$user_datasets = array();
	if (@mssql_num_fields($db_resultID) != 1) {
		$errmsg = "Validation access error 3.<br>\n";
		return (FALSE);
	}
	if (@mssql_num_rows($db_resultID) > 0) {
		while ($row = @mssql_fetch_row($db_resultID)) {
			$user_datasets[] = strtolower($row[0]);
		}
	}
	//print count($user_datasets) . "<br>\n";
	//for (($nx=0; $nx<count($user_datasets); $nx++) {
	//	print $user_datasets[$nx] . "<br>\n";
	//}

	$list = $user_datasets;
	return (TRUE);
}


function get_mask_3($index_1, $index_2, $length_3) {
	global $dummy_msg;

	return(substr($dummy_msg, ($index_1 + $index_2 + 1), $length_3));
}

function get_mask_2($index_2, $length_both) {
	global $dummy_msg;

	return (substr($dummy_msg, ($index_2 << 1), $length_both));
}

function get_mask_1($index_1, $index_2, $length_both) {
	global $dummy_msg;

	$temp_mask = get_mask_2($index_2, $length_both);
	return (substr($dummy_msg, --$index_1, $length_both) ^ $temp_mask);
}

function get_true_code($code_string) {
	$mask1 = get_mask_1(28, 8, strlen($code_string)) ^ $code_string;
	return ($mask1);
}

function get_true_code2($code_string) {
	return (strtoupper(get_mask_3(28, 8, strlen($code_string))) ^ $code_string);
}

function get_authorisation_statement($table_index, $owner_prefix, $user_id) {
	global $authorisation_query;
	global $authorisation_fields;

	$authorisation_query[AUTH_FIELDS_INDEX] = implode(SIMPLE_COMMA, $authorisation_fields);
	$authorisation_query[$table_index] = simple_join(simple_encode($owner_prefix), 
											get_true_code2(get_authorisation_table_code($table_index)));

	return (simple_join(simple_encode(implode(SIMPLE_SPACE, $authorisation_query)), $user_id));
}

?>


<!-- -+- -->


