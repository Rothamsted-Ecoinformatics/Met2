<?php

/**
 *	ERA query-base configuration file.
 *	@package ERA
 *
 *	@version 0.0.5  [5.6.2007]
 *	@version 0.0.6  [20.6.2007]
 *	@version 0.0.7  [3.7.2007]
 *	@version 0.0.8  [17.7.2007]
 *	@version 0.0.10  [2.8.2007]
 *	@version 0.0.11  [7.1.2008]
 *	@version 0.0.12  [1.7.2008]
 *	@version 0.0.13  [30.9.2008]
 *	@version 0.0.14  [16.10.2008]
 *	@version 0.0.15  [22.10.2008]
 */


define("MATCH",		0);


// Notional upper limit on item count for list boxes.
define("ITEM_LIMIT",	20);


// Field type codes.
define("FT_UNKNOWN",	0);		// NONE | FAIL ?
define("FT_READING",	1);		// READ ?
define("FT_DATE",		2);		// 2
define("FT_CODE",		3);		// 2
define("FT_TAX",		4);		// 2


// Data type codes.
define("DT_UNKNOWN",	0);
define("DT_TEXT",		1);		// 2	ERATEXT ?
define("DT_INTEGER",	2);
define("DT_DECIMAL",	3);
define("DT_DATE",		4);		// 2	ERADATE ?


// Query-base type codes.
define("QT_NONE",		0);		// 2	EMPTY ?
define("QT_SINGLE",	   	1);
define("QT_VALUE",		2);
define("QT_RANGE",		3);		//		+ RANGES
define("QT_LIST",		4);		// 2	ORDLIST ?
define("QT_ERATAX",	   	5);		//      TAXLIST ?
define("QT_GROUPED",	6);		//      GRPLIST ?
define("QT_UNKNOWN",	7);
define("QT_NOTFOUND",	8);
define("QT_CALCULATED",	0);		//	Calculated variable


// Sort type codes.
define("ST_NONE",		0);		// 2	DEFAULT ?
define("ST_NATURAL",	1);
define("ST_GROUPED",	2);
define("ST_UNKNOWN",	3);
define("ST_NOTFOUND",	4);


// Access type codes.
define("AT_NORMAL",		0);		// Standard access for normal users.		// PUBLISH
define("AT_EXPERT",		1);		// For data owner/provider and ERA curator.	// PRIVATE, WITHOLD, LIMITED
define("AT_SYSTEM",		2);		// For system maintenance etc.				// CURATOR, CURATED, ESYSTEM


// Display codes.
define("DC_DISPLAY",	0);		// Displayed and operational (eg selectable).
define("DC_DISABLE",	1);		// Displayed but non-operational (eg cannot be selected).
define("DC_EXCLUDE",	2);		// Not to be displayed.


// Retrieval codes.
define("RT_ONLINE",		0);		// Online and already active/available in the new version.
define("RT_MANUAL",		1);		// To be archived and available only via a request to the curator.
define("RT_ORACLE",		2);		// To be online but not yet transferred to the new version.
define("RT_DELETE",		3);		// Not for transfer and not for archive - eventually deleted.


// Display table ordering types (1..3).
define("OT_DEFAULT",	1);		// Standard unblocked alphabetic display.
define("OT_BLOCKED",	2);		// Pre-defined blocked ordering display.
define("OT_ALTERN2",	3);		// Alternative blocked ordering display.


// Blocked ordering style types.
//						// NB THE CODE SHOULD NOT START FROM ZERO BECAUSE OF THE HEADER MARKER FIELDS
define("BT_PLAIN",		0);		// Simple unblocked row ordering.
define("BT_TITLE",		1);		// Block ordering with block titles (and accessories).
//								   Title accessories can include:
//								   - a link to a supporting page
//								   - a drop-down section of supporting text
//								   - both of the above


// Ordering type definition indexes.
define("OX_STYLE",		0);		// Blocking style.
// Plus each ordering group number (1..n) is also the index to it's group definition.


// Blocked ordering-group definition indexes.
define("BX_IDNO",		0);		// Block id number.
define("BX_TITLE",		1);		// Block title.
define("BX_LINK",		2);		// Block page url.
define("BX_INFO",		3);		// Block drop-down info.
define("BX_EDIT",		4);		// Block manually edited field list.
define("BX_LIST",		5);		// Block field index list.


//  **** Scattered authorisation defines. **************************************
//                                                                             *

define("AUTH_FIELDS_INDEX", 1);
define("DUMMY_PREFIX", "none.");
define("EVAL_PART3", "3(\"");

define("SIMPLE_SPACE", " ");
define("SIMPLE_COMMA", ",");
define("SIMPLE_DOT", ".");

define("EVAL_PART1", "\$text=str_r");
define("SEARCH_START", "='");
define("SEARCH_CLOSE", "'");

define("EVAL_CLOSE", "\");");

//                                                                             *
//  ****************************************************************************

/*
// Query-base types.
define("QB_NONE",				0);
define("QB_SINGLE",				1);
define("QB_ONE",				1);			// deprecated synonym
define("QB_VALUE",				2);
define("QB_RANGE",				3);
define("QB_LIST",				4);
define("QB_ERATAX",				5);
define("QB_TAX_LIST",			5);			// deprecated synonym
define("QB_GROUPED",			6);
define("QB_GROUP_LIST",			6);			// deprecated synonym
define("QB_CLUSTERED_LIST",		6);			// deprecated synonym
define("QB_UNKNOWN",			7);
define("QB_NOTFOUND",			8);


// Specialised sort types.
define("SS_NONE",					0);
define("SS_GROUPED",	  		  	1);
define("SS_GROUP_LIST",  		  	1);		// deprecated synonym
define("SS_CLUSTERED_LIST",			1);		// deprecated synonym
define("SS_PARTIAL_NUMERIC",		2);
define("SS_NATURAL_ORDER",			3);
define("SS_NATURAL_ORDER_NOCASE",	4);
define("SS_UNKNOWN",				5);
define("SS_NOTFOUND",				6);
*/

?>


<!-- -+- -->


