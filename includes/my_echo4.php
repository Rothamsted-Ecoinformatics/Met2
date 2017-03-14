<?php

/**
 *	@fileoverview Display the query-string values sent by the client plus any active session variables.
 *
 *	@version 0.0.1  [22.8.2007]
 *	@version 0.0.4  [16.9.2008]
 *
 *	$_POST[].
 *	$_SESSION[].
 *
 */


session_start();

// List all POST message variables.
reset($_POST);
print "<br>\$_POST[]: ";
while(list($key) = each($_POST)) {
	print " '$key' = [" . $_POST[$key] . "] ";
}

// List the elements of any POST message array variables.
reset($_POST);
while(list($key) = each($_POST)) {
	if (is_array($_POST[$key])) {
		reset($_POST[$key]);
		print "<br>. . " . $key . "[]: ";
		while(list($element) = each($_POST[$key])) {
			print " '$element' = [" . $_POST[$key][$element] . "] ";
		}
	}
}

// List all SESSION variables.
reset($_SESSION);
print "<br>\$_SESSION[]: ";
while(list($key) = each($_SESSION)) {
	print " '$key' = [" . $_SESSION[$key] . "] ";
}


exit();

?>


<!-- -+- -->


