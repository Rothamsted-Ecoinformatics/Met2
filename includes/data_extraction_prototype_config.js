/**
 *	@fileoverview This module holds all the configured constants
 *	set up for the support code running the data extraction page.
 *
 *	@version 0.0.21  [9.2.2007]
 *	@version 0.0.22  [14.3.2007]
 *	@version 0.0.23  [19.3.2007]
 *	@version 0.0.31  [2.5.2007]
 *	@version 0.0.32  [3.7.2007]
 *	@version 0.0.33  [12.7.2007]
 *	@version 0.0.34  [18.7.2007]
 *	@version 0.0.35  [6.8.2007]
 *	@version 0.0.36  [16.11.2007]
 *	@version 0.0.37  [17.12.2007]
 *	@version 0.0.38  [8.1.2008]
 *	@version 0.0.39  [19.6.2008]
 *	@version 0.0.40  [9.9.2008]
 *	@version 0.0.43  [16.9.2008]
 */


var NOT_FOUND = -1;

var IMAGE_HOME = '../images/';
var TABLE_SUFFIX = '_listing_table';

var ERA_HOMEPAGE_URL = 'http://www.era.rothamsted.ac.uk/';
var ERA_METADATA_URL = 'index.php?area=home&page=index&dataset=';

var LOGIN_PAGE_URL = 'http://burdock.rothamsted.ac.uk/pgera/met2/pages/sesslog5.php';
var FIELDSET_PAGE_URL = 'http://burdock.rothamsted.ac.uk/pgera/met2/pages/setgen4.php';
var EXTRACT_PAGE_URL = 'http://burdock.rothamsted.ac.uk/pgera/met2/pages/arg_process4.php';
var ECHO_PAGE_URL = 'http://burdock.rothamsted.ac.uk/pgera/met2/pages/my_echo4.php';

var SERVER_TEST_GROUP = 'server_test_group';
var SERVER_REPLY_ELEMENT = 'server_reply';
var SERVER_DELAY_ELEMENT = 'server_delay';
var SERVER_CHECK_ELEMENT = 'server_check';

//var WIDTH_IMAGE = 'pone.png';
var WIDTH_IMAGE = 'bonep.png';


/**
 *	The name assigned to the separator-tab in the HTML page.
 *	This tab is not visible and is located at the boundary
 *	between the pre-defined fixed tab group and the variable
 *	application-generated tab group.
 *	@final
 *	@type	string
 */
var SEPARATOR_TAB_NAME = 'separator';


var anColumn_Adjust_Map = {
	'dataset': [4, 40],
	'datafield': [6, 40],
    'datafilter': [3, 40]
};


/**
 *	The number of fields for all login response messages.
 *	Note this includes the standard Transfer Response fields.
 *	@final
 *	@type	integer
 */
var LOGIN_RESPONSE_LENGTH = 5;

/**
 *	The transfer message types supported by the client-server dialogue.
 *	@final
 *	@type	string
 */
var RESET_ID = 'reset';
var LOGIN_ID = 'login';
var CLEAR_ID = 'clear';
var TABLE_ID = 'table';

/**
 *	Standard pre-configured unique application-wide identifiers
 *	(for which input may be requested).
 *	@final
 *	@type	integer
 */
var FULL_TABLE_ID = 'all_datasets';
var LOGIN_TABLE_ID = 'my_datasets';


/**
 *	The number of major fields for each dataset entry in
 *	the formatted string used to tranmsit a dataset group.
 *	Also for the ordering entries appended to the group.
 *	@final
 *	@type	integer
 */
var DATASET_GROUP_UNIT_LENGTH = 5;


/**
 *	The number of major fields for each dataset field entry in
 *	the formatted string used to tranmsit a dataset field set.
 *	@final
 *	@type	integer
 */
var DATAFIELD_SET_UNIT_LENGTH = 5;


/**
 *	Transfer response header field offsets.
 *	@final
 *	@type	integer
 */
//					The layout of the response header for any transfer from the server.
//						The returned sequence number enables transfer responses to be correctly
//						matched with their originating transfer requests/queries.
//						The header is not forwarded as part of the input it prefixes.
// TR = Transfer Response
//var TR_SEQ = 0;			// The transfer sequence number (cycles through 1..255).
var TR_SEQC = 0;		// The transfer sequence count (cycles through 1..255).
//var TR_ID = 1;			// The transfer message type.
var TR_TYPE = 1;		// The transfer message type.
var TR_CODE = 2;		// A server supplied completion or action code.
var TR_TEXT = 3;		// A server supplied text message or information.
var TR_USER = 4;		// This field is only used during interchanges supporting a user login.
//	TR_PAD = 4;			// Empty (unassigned) field used to pad the header.


/**
 *	Message type header field offsets.
 *	@final
 *	@type	integer
 */
//					The layout of the message type header for any input requested from the server.
//						The returned unique application-wide identifier enables the intended
//						target for the input (message content) to be validated/confirmed.
//						The header is forwarded as part of the input it prefixes so that
//						its entry count can be used to confirm the message is complete.
// MT = Message Type
var MT_FLAG_1 = 0;		// = 0	The overall message type header
var MT_FLAG_2 = 1;		// = 0	(starts with a double zero marker).
var MT_NUMBER = 2;		// Number of sections in the message (0..n)
var MT_ENTRYS = 3;		// Total number of entries in this definition (including the header).
var MT_TARGET = 4;		// The unique application-wide identifier of the target/receiver.
//	MT_FILLER = 4;		// Empty (unassigned) field used to pad the header.


/**
 *	Dataset group definition field offsets.
 *	@final
 *	@type	integer
 */
//					The layout of the overall dataset group header.
//						Holds the number of datasets thus permitting both completeness and consistency checks.
//						Enables the dataset ordering definitions to be located directly instead of scanning for them.
//						The header is not preserved as part of the internal dataset group definition
//						but is only used while extracting/decoding the dataset details.
// DG = Dataset Group
//var DG_HDR1 = 0;		// = 0	Dataset group listing header
//var DG_HDR2 = 1;		// = 0	(starts with a double zero marker).
var DG_FLAG_1 = 0;		// = 0	Dataset group listing header
var DG_FLAG_2 = 1;		// = 0	(starts with a double zero marker).
var DG_NUMBER = 2;		// Number of datasets in the group (0..n)
var DG_ENTRYS = 3;		// Total number of entries in this definition (including the header).
//var DG_DSETS = 2;		// Number of datasets in the group (0..n)
//var DG_TOTAL = 3;		// Count of the total number of entries in this definition
//						//		(including all dataset ordering entries and itself).
//	DG_FILLER = 4;		// Empty (unassigned) field used to pad the header.
//
//					The layout of a dataset definition.
var DG_NAME = 0;		// Unique application-wide name for the dataset
var DG_LABEL = 1;		// The dataset name to display for the user
var DG_CODE = 2;		// A multi-purpose action code (0 = normal operation, 1 = disable selection)
var DG_DESC = 3;		// Text description
//	DG_FILLER = 4;		// Empty (unassigned) field used to pad the definition.


/**
 *	Dataset-group ordering definition field offsets.
 *	@final
 *	@type	integer
 */
//					The layout of the overall dataset-group ordering header.
//						Holds the number of orderings and the number of ordering definition entries
//						thus permitting both completeness and consistency checks.
//						The header is not preserved as part of the internal dataset ordering definition
//						but is only used while extracting/decoding the ordering details.
// DO = Dataset Ordering
//var DO_HDR1 = 0;		// = 0	Overall ordering header
//var DO_HDR2 = 1;		// = 0	(starts with double zero)
var DO_FLAG_1 = 0;		// = 0	Dataset ordering header
var DO_FLAG_2 = 1;		// = 0	(starts with a double zero marker).
//var DO_ORDERS = 2;		// Number of the alternative orderings defined (1..n)
var DO_NUMBER = 2;		// Number of alternative orderings defined (0..n)
var DO_ENTRYS = 3;		// Total number of entries in this definition (including the header).
//	DO_FILLER = 4;		// Empty (unassigned) field used to pad the header.
//
//					The layout of an ordering definition header.
var DO_SOH = 0;			// = 0	New ordering start-of-header (always zero)
var DO_ID = 1;			// Ordering ID (1..3) as used on the display page (the page default must always have ID = 1)
var DO_COUNT = 2;		// Count of the groupings used for this ordering (1..n)
var DO_CODE = 3;		// Display code (0 = no extra action, 1 = display an ordering group title)
//						// NB THE CODE SHOULD NOT START FROM ZERO BECAUSE OF THE SOH FIELD OR ANY HEADER MARKER FIELD
//	DO_FILLER = 4;		// Empty (unassigned) field used to pad the header.
//
//					The layout for each ordering group definition.
var DO_GNO = 0;			// Number of the group within an ordering (1..n)
var DO_TITLE = 1;		// Ordering group title
var DO_LINK = 2;		// URL locating web page for ordering group and/or link to a drop-down summary
var DO_LIST = 3;		// A structured field holding ordered indexes (all 1..n) to the members of the group
//	DO_FILLER = 4;	   	// Empty (unassigned) field used to pad the definition.


/**
 *	Dataset display type codes.
 *	@final
 *	@type	integer
 */
// DD= Dataset Display
//						// NB THE CODE SHOULD NOT START FROM ZERO BECAUSE OF THE HEADER MARKER FIELDS
var DD_CODE_PLAIN = 0;	// Code 0 = no extra action
var DD_CODE_TITLE = 1;	// Code 1 = display ordering group titles (or empty title box if no title found)
var DD_CODE_ADDON = 2;	// Code 2 = present ordering group information in a drop-down box (when included)


/**
 *	Dataset field-set definition field offsets.
 *	@final
 *	@type	integer
 */
//					The layout of the overall field-set header.
//						Holds the number of fields thus permitting both completeness and consistency checks.
//						Enables the field-set ordering definitions to be located directly instead of scanning for them.
//						The header is not preserved as part of the internal dataset field-set definition
//						but is only used while extracting/decoding the field-set details.
// FS = Field Set
//var FS_HDR1 = 0;		// = 0	Overall field-set header
//var FS_HDR2 = 1;		// = 0	(starts with double zero)
var FS_FLAG_1 = 0;		// = 0	Overall field-set header
var FS_FLAG_2 = 1;		// = 0	(starts with a double zero marker).
//var FS_FIELDS = 2;		// Count of the fields in the field-set (1..n)
var FS_NUMBER = 2;		// Number of fields in the field-set (0..n)
var FS_ENTRYS = 3;		// Total number of entries in this definition (including the header).
//var FS_TOTAL = 3;		// Count of the total number of entries in this definition
//						//				(including all ordering entries and itself).
//	FS_NULL = 4;		// Empty (unassigned) field.
//
//					The layout of a field definition.
var FS_NAME = 0;		// Field name (as used within eRA)
var FS_CODE = 1;		// Encoded field data type plus field dataset type (normal field or index field)
var FS_UNIT = 2;		// Field units
var FS_DESC = 3;		// Text description
var FS_PREV = 4;		// A structured field holding preview/meta-data for the field


/**
 *	Dataset field-set ordering definition field offsets.
 *	@final
 *	@type	integer
 */
//					The layout of the overall field-set ordering header.
//						Holds the number of orderings and the number of ordering definition entries
//						thus permitting both completeness and consistency checks.
//						The header is not preserved as part of the internal field-set ordering definition
//						but is only used while extracting/decoding the ordering details.
// FO = Field Ordering
//var FO_HDR1 = 0;		// = 0	Overall ordering header
//var FO_HDR2 = 1;		// = 0	(starts with double zero)
var FO_FLAG_1 = 0;		// = 0	Field-set ordering header
var FO_FLAG_2 = 1;		// = 0	(starts with a double zero marker).
//var FO_ORDERS = 2;		// Count of the alternative orderings defined (1..n)
var FO_NUMBER = 2;		// Number of alternative orderings defined (0..n)
var FO_ENTRYS = 3;		// Total number of entries in this definition (including the header).
//var FO_ENTRYS = 3;		// Count of the total number of entries in the ordering definition (includes itself)
//	FO_NULL = 4;		// Empty (unassigned) field.
//
//					The layout of an ordering definition header.
var FO_SOH = 0;			// = 0	New ordering start-of-header (always zero)
var FO_ID = 1;			// Ordering ID (1..3) as used on the display page (the page default must always have ID = 1)
var FO_COUNT = 2;		// Count of the groupings used for this ordering (1..n)
var FO_CODE = 3;		// Display code (0 = no extra action, 1 = display a group title)
//	FO_NULL = 4;		// Empty (unassigned) field.
//
//					The layout for each ordering group definition.
var FO_GNO = 0;			// Number of the group within an ordering (1..n)
var FO_TITLE = 1;		// Ordering group title
var FO_LINK = 2;		// URL locating web page for ordering group and/or link to a drop-down summary
var FO_LIST = 3;		// A structured field holding ordered indexes (all 1..n) to the members of the group
//	FO_NULL = 4;		// Empty (unassigned) field.


/**
 *	Field display type codes.
 *	@final
 *	@type	integer
 */
// FD = Field Display
var FD_CODE_PLAIN = 0;	// Code 0 = no extra action
var FD_CODE_TITLE = 1;	// Code 1 = display ordering group titles (or empty title box if no title found)
//var FD_CODE_ADDON = 2;	// Code 2 = present ordering group information in a drop-down box (when included)


/**
 *	Data type codes.
 *	@final
 *	@type	integer
 */
var DT_UNKNOWN			= 0;
var DT_ALPHANUM			= 1;
var DT_INTEGER			= 2;
var DT_DECIMAL			= 3;
var DT_DATE				= 4;
var DT_INDEX			= 100;		// the base value for index field positions


/**
 *	Query-base codes defining the field extension/preview data type.
 *	@final
 *	@type	integer
 */
var QB_NONE				= 0;
var QB_ONE				= 1;
var QB_VALUE			= 2;
var QB_RANGE			= 3;
var QB_LIST				= 4;
var QB_TAX_LIST			= 5;
var QB_GROUP_LIST		= 6;
var QB_CLUSTERED_LIST	= 6;		// deprecated synonym
var QB_UNKNOWN			= 7;
var QB_NOTFOUND			= 8;


/**
 *	Search type codes defining the type of search returned to the server.
 *	@final
 *	@type	integer
 */
var ST_NONE				= 0;
var ST_VALUE			= 1;
var ST_RANGE			= 3;
var ST_LIST				= 4;
var ST_TAX_LIST			= 5;


/* -+- */


