/**
 *	@fileoverview This module is a collection of
 * 	commonly used general page support functions.
 *
 *	@version 0.1.20  [26.1.2007]
 *	@version 0.1.21  [2.5.2007]
 *	@version 0.1.22  [26.7.2007]
 *	@version 0.1.23  [6.8.2007]
 *	@version 0.1.26  [11.9.2007]
 */


function is_undefined(a_var) {
	return (typeof(a_var) == 'undefined');
}


function is_defined(a_var) {
	return (typeof(a_var) != 'undefined');
}


function is_null(a_var) {
	return ((a_var == null) && (typeof(a_var) == 'object'));
}


//function is_empty(a_var) {


function is_string(a_var) {
	return (typeof(a_var) == 'string');
}


function is_object(a_var) {
	return ((a_var != null) && (typeof(a_var) == 'object'));
}


function is_array(a_var) {
	return (is_object(a_var) && (a_var.constructor == Array));
}


function is_boolean(a_var) {
	return (typeof(a_var) == 'boolean');
}


function is_number(a_var) {
	return ((typeof(a_var) == 'number') && isFinite(a_var));
}


function is_function(a_var) {
	return (typeof(a_var) == 'function');
}


function int_div(a_Number, a_Divisor)
{
	var nInteger_Result = 0;
	var nReal_Result = a_Number / a_Divisor;

	if (nReal_Result >= 0) {
		nInteger_Result = Math.floor(nReal_Result);
	}
	else {
		nInteger_Result = Math.ceil(nReal_Result);
	}

	// Better than this ???
	//var nReal_Remainder = a_Number % a_Divisor;
	//var nInteger_Result = (a_Number - nReal_Remainder) / a_Divisor;

	return (nInteger_Result);
}
function match_it(a_sSource_String) {
	var Reg_Exp = new RegExp('^0*[1-9.]');
	return (a_sSource_String.match(Reg_Exp));
}


/**
 *  Strip all leading zeros from a text string.
 *
 *	@param	{string} a_sSource_String The string to be trimmed.
 *
 *	@return	The trimmed string, or the original string if no trimming needed.
 *	@type	string
 */

function strip_leading_zeros(a_sSource_String)
{
	var Reg_Exp_Trim = new RegExp('^0*');
	var sResult_String = a_sSource_String.replace(Reg_Exp_Trim, '');

	return(sResult_String);
}


/**
 *  Strip all trailing zeros from a text string.
 *
 *	@param	{string} a_sSource_String The string to be trimmed.
 *
 *	@return	The trimmed string, or the original string if no trimming needed.
 *	@type	string
 */

function strip_trailing_zeros(a_sSource_String)
{
	var Reg_Exp_Trim = new RegExp('0*$');
	var sResult_String = a_sSource_String.replace(Reg_Exp_Trim, '');

	return(sResult_String);
}


/**
 *  Trim leading and trailing zeros from a text string.
 *
 *	@param	{string} a_sSource_String The string to be trimmed.
 *
 *	@return	The trimmed string, or the original string if no trimming needed.
 *	@type	string
 */
/*
function zero_trim_string(a_sSource_String)
{
	var Reg_Exp_Trim = new RegExp('^0*|0*$', 'g');

//	var sResult_String = a_sSource_String.replace(/^\s*|\s*$/g, '');
	var sResult_String = a_sSource_String.replace(Reg_Exp_Trim, '');

	return(sResult_String);
}
*/

/**
 *  Trim leading and trailing space from a text string.
 *
 *	@param	{string} a_sSource_String The string to be trimmed.
 *
 *	@return	The trimmed string, or the original string if no trimming needed.
 *	@type	string
 */

function trim_string(a_sSource_String)
{
	var Reg_Exp_Trim = new RegExp('^\\s*|\\s*$', 'g');

//	var sResult_String = a_sSource_String.replace(/^\s*|\s*$/g, '');
	var sResult_String = a_sSource_String.replace(Reg_Exp_Trim, '');

	return(sResult_String);
}


/**
 *  Display an alert message for the user.
 *
 *	Introduced to prevent alerts from blocking the execution of tests.
 *	Also to allow tests to verify the text of any 'displayed' messages.
 *
 *	@param	{string} a_sMessage_Text The user message.
 *
 *	@return	none
 *	@type	void
 */

function log_msg(a_sMessage_Text)
{
	if (!bMessage_Buffering_ON) {
		alert(a_sMessage_Text);
	}
	else {
		asMessage_Buffer[asMessage_Buffer.length] = a_sMessage_Text;
	}
}


/**
 *  Enable/Disable alert message buffering (intended only for testing).
 *
 *	@param	{boolean} a_bON True to enable message buffering, false to disable it.
 *
 *	@return	none
 *	@type	void
 */

function msg_buffer_on(a_bON)
{
	bMessage_Buffering_ON = a_bON;
}


var bMessage_Buffering_ON = false;
var asMessage_Buffer = Array();


/**
 *  Reset alert message insertion and clear the message buffer (intended only for testing).
 *
 *	@return	none
 *	@type	void
 */

function reset_msg_buffer()
{
    asMessage_Buffer = Array();
}


/**
 *  Return the number of messages held in the alert message buffer (intended only for testing).
 *
 *	@return	The number of buffered alert messages.
 *	@type	integer
 */

function get_log_msg_count()
{
    return (asMessage_Buffer.length);
}


/**
 *  Retrieve a message from the alert message buffer (intended only for testing).
 *
 *	@param	{integer} a_nMessage_Index The zero-based buffer index of the message to be returned.
 *
 *	@return	The buffered message text, or an empty string if the index was out-of-range.
 *	@type	string
 */

function get_log_msg(a_nMessage_Index)
{
	if ((a_nMessage_Index < 0)
		|| (a_nMessage_Index >= asMessage_Buffer.length)) {
		return ('');
	}

	return (asMessage_Buffer[a_nMessage_Index]);
}


/**
 *  Create and return a new XMLHttpRequest object.
 *
 *	@return	new XMLHttpRequest object or null on failure
 *	@type	object
 */

function get_request_object()
{
	var request_object = null;

	if (window.XMLHttpRequest) {
		request_object = new XMLHttpRequest();
	}
	else if (typeof window.ActiveXObject != "undefined") {
		request_object = new ActiveXObject("Microsoft.XMLHTTP");
	}

	return request_object;
}


/**
 *  A dummy/no-action function to receive/swallow/not-handle 
 *	XMLHttpRequest completions fired after abort was called.
 *
 *	@return	none
 *	@type	void
 */

function completion_sink(transferID, status, statusText, responseText, responseHTML)
{
	alert('completion_sink()');
}


/**
 *	Attach an event listener to a page element (DOM object).
 *
 *	Example:	add_event(window, 'load', initPanels, false);
 *
 *	@param	{object} a_Element The element (DOM object) being connected
 *	@param	{string} a_sEvent_Type The event type being registered
 *	@param	{function} a_fHandler The event handler to use
 *	@param	{boolean} a_bUse_Capture Set to false for no capture
 *
 *	@return	none
 *	@type	void
 */

function add_event(a_Element, a_sEvent_Type, a_fHandler, a_bUse_Capture)
{
	// cross-browser event handling for IE5+, NS6 and Mozilla
	// By Scott Andrew
	if (a_Element.addEventListener) {
		a_Element.addEventListener(a_sEvent_Type, a_fHandler, a_bUse_Capture);
		return true;
	} else if (a_Element.attachEvent) {
		var r = a_Element.attachEvent('on' + a_sEvent_Type, a_fHandler);
		return r;
	} else {
		a_Element['on' + a_sEvent_Type] = a_fHandler;
	}
}


/**
 *	Remove an event listener from an event target (DOM object).
 *
 *	Example:	remove_event(window, 'load', initPanels, false);
 *
 *	@param	{object} a_Element The element (DOM object) being disconnected
 *	@param	{string} a_sEvent_Type The event type that was registered
 *	@param	{function} a_fHandler The event handler being removed
 *	@param	{boolean} a_bUse_Capture Set to value used for original connection
 *
 *	@return	none
 *	@type	void
 */

function remove_event(a_Element, a_sEvent_Type, a_fHandler, a_bUse_Capture)
{
	if (a_Element.removeEventListener) {
		a_Element.removeEventListener(a_sEvent_Type, a_fHandler, a_bUse_Capture);
	} else if (a_Element.detachEvent) {
        a_Element.detachEvent('on' + a_sEvent_Type, a_fHandler);
	} else {
        a_Element['on' + a_sEvent_Type] = null;
	}
}


/**
 *	Find the most immediate parent element (DOM object)
 *	that matches the containing element type specified
 *	and return it as to be processed as the real/true
 *	target of the current active event.
 *
 *	Probably needs to have the parent specified as well so the search 
 *	can stop on either the parent being found or the 'body' being found.
 *	Or make it another version, say find_event_subtarget() for example,
 *	to indicate we're confining the search to a sub-tree of the DOM tree.
 *
 *	@param	{object} a_Event_Object The active event object (if not running in IE)
 *	@param	{string} a_sContainer The containing element type required (lower case)
 *	@param	{boolean} a_bCancel Set to true to cancel the elements default action and bubbling
 *
 *	@return	page element | null
 *	@type	DOM object
 */

function find_event_target(a_Event_Object, a_sContainer, a_bCancel)
{
	var eTarget_Element = null; 

	// If this is IE then we must query the global
	// event object for the activated element.
	if (window.event && window.event.srcElement)  {
		eTarget_Element = window.event.srcElement;
	}
	// Other browsers will have supplied an event object.
	else if (a_Event_Object && a_Event_Object.target) {
		eTarget_Element = a_Event_Object.target;
	}

	if (!eTarget_Element) {
		return null;
	}

	// Locate the containing parent element
	while (eTarget_Element != document.body 
		&& eTarget_Element.nodeName.toLowerCase() != a_sContainer) {
		eTarget_Element = eTarget_Element.parentNode;
	}

	if (eTarget_Element.nodeName.toLowerCase() != a_sContainer) {
		return null;
	}

	// Process here to block the default action and event bubbling.
	if (a_bCancel == true) {
		if (window.event) {
			window.event.cancelBubble = true;
			window.event.returnValue = false;
		}
		else if (a_Event_Object && a_Event_Object.stopPropagation && a_Event_Object.preventDefault) {
			a_Event_Object.stopPropagation();
			a_Event_Object.preventDefault();
		}
	}

	return eTarget_Element;
}


/**
 *	Set or append a new class to an element (if not already set).
 *	Also trims the class attribute string.
 *
 *	@param	{element} a_eTarget_Element The element on which the class will be set.
 *	@param	{string} a_sClass_Name The class being added to the element.
 *
 *	@return	none
 *	@type	void
 */

function add_class(a_eTarget_Element, a_sClass_Name)
{
	var Reg_Exp = new RegExp('\\b ?' + a_sClass_Name + '\\b', 'g');
	var Reg_Exp_Trim = new RegExp('^\\s*|\\s*$', 'g');

	// Trim the class from the start because IE doesn't.
	var sTarget_Class = a_eTarget_Element.className.replace(Reg_Exp_Trim, '');
	if (sTarget_Class.length == 0) {
		a_eTarget_Element.className = a_sClass_Name;
	}
	else {
		if (is_null(sTarget_Class.match(Reg_Exp))) {
			sTarget_Class += ' ' + a_sClass_Name;
		}
        // Also writes back the trimmed copy if the class was already set.
		a_eTarget_Element.className = sTarget_Class;
	}
}


/**
 *	Remove a class from an element. Also trims the class attribute string.
 *
 *	@param	{element} a_eTarget_Element The element from which the class will be deleted.
 *	@param	{string} a_sClass_Name The class being removed from the element.
 *
 *	@return	none
 *	@type	void
 */

function remove_class(a_eTarget_Element, a_sClass_Name)
{
	var Reg_Exp = new RegExp('\\b ?' + a_sClass_Name + '\\b', 'g');
	var Reg_Exp_Trim = new RegExp('^\\s*|\\s*$', 'g');

	var sTarget_Class = a_eTarget_Element.className;
	if (sTarget_Class.length == 0) {
		return;
	}

	// The second replace trims the element's new class. Firefox does this itself but IE does not.
	a_eTarget_Element.className = (sTarget_Class.replace(Reg_Exp, '')).replace(Reg_Exp_Trim, '');
}


/**
 *	Return the most immediate parent page element (DOM object)
 *	for the specified element that is of the defined type.
 *
 *	Same proviso about having a root or stop parent
 *	as for find_event_target(). This function could also
 *	do some of the work for find_event_target().
 *
 *	@param	{element} a_eChild_Element The starting (contained) element
 *	@param	{string} a_sParent_Tag The element tag-type of the required parent (lower case)
 *
 *	@return	The requested parent/containing page element, null if not found.
 *	@type	DOM object
 */

function find_parent_element(a_eChild_Element, a_sParent_Tag)
{
	var eTarget_Element = a_eChild_Element; 

	while ((eTarget_Element != document.body)
		&& (eTarget_Element.nodeName.toLowerCase() != a_sParent_Tag))
		eTarget_Element = eTarget_Element.parentNode;

	if (eTarget_Element.nodeName.toLowerCase() != a_sParent_Tag)
		return null;

	return (eTarget_Element);
}


/**
 *	Return the next row in an HTML table. Expect there to be a footer row
 *	on the table so there will always be a next-row for data rows in the table.
 *
 *	@param	{element} a_eRow_Element The starting data row element
 *
 *	@return	The requested next row, null if none found.
 *	@type	DOM object
 */

function find_next_row(a_eRow_Element)
{
	if (a_eRow_Element.nodeName.toLowerCase() != 'tr')
		return null;

	// This works because there is always a footer row on the table.
	var eTarget_Row = a_eRow_Element.nextSibling;
	while ((eTarget_Row != null)
			&& (eTarget_Row.nodeName.toLowerCase() != 'tr')) {
		eTarget_Row = eTarget_Row.nextSibling;
	}

	if (eTarget_Row.nodeName.toLowerCase() != 'tr')
		return null;

	return eTarget_Row;
}


/**
 *	Set the minimum width for a table column by inserting and resizing a standard transparent image in
 *	its title row. The title row must have the name attribute 'header' and contain only <th> elements.
 *
 *	@param	{string} a_sTable_Name Partial identifying name for the table
 *	@param	{integer} a_nColumn_Number Number of the column to be processed (not zero based).
 *	@param	{integer} a_nMinimum_Width Minimum width in pixels
 *
 *	@return	none
 *	@type	void
 */

function set_minimum_width(a_sTable_Name, a_nColumn_Number, a_nMinimum_Width)
{
	sImage_Path = IMAGE_HOME + WIDTH_IMAGE;
	nMinimum_Width = a_nMinimum_Width + 'px';

	// Construct the full name for the table and then locate it.
	var sTable_Name = a_sTable_Name + TABLE_SUFFIX;
	var eListing_Table = document.getElementById(sTable_Name);
	if (!eListing_Table) {
		alert(a_sTable_Name + ' table not found.');
		return;
	}

	var anRows_Collection = eListing_Table.getElementsByTagName('tr');
	var nRows_Collection_Count = anRows_Collection.length;
    if (nRows_Collection_Count == 0) {
		return;
	}

	var eHeader_Row = null;
	var aeHeader_Cells = null;
	var eColumn_Cell = null;
	var eNew_Node = null;
	for (var nx=0; nx<nRows_Collection_Count; nx++) {
		if (anRows_Collection[nx].getAttribute('name') == 'header') {
			eHeader_Row = anRows_Collection[nx];
			aeHeader_Cells = eHeader_Row.getElementsByTagName('th');
			if (aeHeader_Cells.length >= a_nColumn_Number) {
				eColumn_Cell = aeHeader_Cells[a_nColumn_Number - 1];
				eNew_Node = document.createElement('br');
				eColumn_Cell.appendChild(eNew_Node);
				eNew_Node = document.createElement('img');
				eNew_Node.setAttribute('src', sImage_Path);
				// IE sets styles differently so function sniff for IE.
				if (eNew_Node.style.setAttribute != null) {
					eNew_Node.style.setAttribute('height', '1px');
					eNew_Node.style.setAttribute('width', nMinimum_Width);
				}
				else {
					eNew_Node.setAttribute('height', '1px');
					eNew_Node.setAttribute('width', nMinimum_Width);
				}
				eColumn_Cell.appendChild(eNew_Node);
			}
		}
	}
}

/*
function find_child_image(cell)
{
	var image; 

	cell_contents = cell.childNodes;

	if (cell_contents.length == 0) {
		return null;
	}

	for (var nx=0; nx<cell_contents.length; nx++) {
		if (cell_contents[nx].nodeName.toLowerCase() == 'img') {
			return cell_contents[nx];
		}
	}
	return null;
}
*/

/**
 *	Return the first immediate child found (DOM object)
 *	for the specified element that is the requested element type.
 *
 *	Mainly used to cope with the difference between browsers
 *	of the number of text nodes set up in table cells.
 *
 *	@param	{element} a_eParent_Element The starting (containing) element
 *	@param	{string} a_sChild_Tag The element tag-type of the required child (lower case)
 *
 *	@return	The first matching child/contained page element, null if none found.
 *	@type	DOM object
 */

function find_child_element(a_eParent_Element, a_sChild_Tag)
{
	var aeCell_Contents = a_eParent_Element.childNodes;
	var nCell_Count = aeCell_Contents.length;

	if (nCell_Count == 0) {
		return null;
	}

	for (var nx=0; nx<nCell_Count; nx++) {
		if (aeCell_Contents[nx].nodeName.toLowerCase() == a_sChild_Tag) {
			return aeCell_Contents[nx];
		}
	}

	return null;
}


/**
 *	Check the date-validity and format of a formatted date string.
 *
 *	@param	{string} a_sDate_String The formatted date string to be validated.
 *
 *	@return	True for valid date and format, otherwise false.
 *	@type	boolean
 */

function is_valid_date(a_sDate_String)
{
	if (is_undefined(a_sDate_String)
		|| is_null(a_sDate_String)
		|| !is_string(a_sDate_String)
		|| (a_sDate_String.length == 0)) {
		return (false);
	}

	var asDate_Parts = a_sDate_String.split("/");
	if (asDate_Parts.length != 3) {
		return (false);
	}

	// Only upper limit on year is 4-digit format.
	var nYear_Num = parseInt(asDate_Parts[2], 10);
	if ((nYear_Num < 1752) || (nYear_Num > 9999)) {
		return (false);
	}
	var nMonth_Num = parseInt(asDate_Parts[1], 10);
	if ((nMonth_Num < 1) || (nMonth_Num > 12)) {
		return (false);
	}
	var nDay_Num = parseInt(asDate_Parts[0], 10);
	if ((nDay_Num < 1) || (nDay_Num > 31)) {
		return (false);
	}
	if (nDay_Num > 30) {
		if ((nMonth_Num == 4)
			|| (nMonth_Num == 6)
			|| (nMonth_Num == 9)
			|| (nMonth_Num == 11)) {
			return (false);
		}
	}
	if ((nMonth_Num == 2) && (nDay_Num > 29)) {
		return (false);
	}
	if ((nMonth_Num == 2) && (nDay_Num == 29)) {
		if ((nYear_Num % 4) != 0) {
			return (false);
		}
		if (((nYear_Num % 100) == 0) && ((nYear_Num % 400) != 0)) {
            return (false);
		}
	}

	// No Gregorian English dates prior to 14 Sept 1752.
	if (nYear_Num == 1752) {
		if (nMonth_Num < 9) {
			return (false);
		}
		if ((nMonth_Num == 9) && (nDay_Num < 14)) {
			return (false);
		}
	}

	return (true);
}


/**
 *	Make a full 10-character date string from a known valid date.
 *
 *	@param	{string} a_sDate_String The formatted date string to be re-formatted.
 *
 *	@return	The equivalent 10-character date string.
 *	@type	string
 */

function make_10char_date(a_sDate_String)
{
	if (is_undefined(a_sDate_String)
		|| is_null(a_sDate_String)
		|| !is_string(a_sDate_String)) {
		return ('');
	}

	// Might still be non-standard format if already 10 characters.
	// (eg 1/002/1998 - some clown is bound to try it).
	var asDate_Parts = a_sDate_String.split("/");
	if (asDate_Parts.length != 3) {
		return ('');
	}

	if (asDate_Parts[0].length < 2) {
		asDate_Parts[0] = '0' + asDate_Parts[0];
	}
	if (asDate_Parts[1].length < 2) {
		asDate_Parts[1] = '0' + asDate_Parts[1];
	}
	return (asDate_Parts.join("/"));
}


/**
 *  Convert a Data Type code to its equivalent text symbol.
 *
 *	@param	{integer) a_nType_Code The code value to be converted.
 *
 *	@return	The equivalent text symbol.
 *	@type	string
 */

function format_data_type_code(a_nType_Code)
{
	var sText_Symbol = '';

	switch (a_nType_Code) {

	case DT_UNKNOWN:
				sText_Symbol = 'DT_UNKNOWN';
				break;

	case DT_ALPHANUM:
				sText_Symbol = 'DT_ALPHANUM';
				break;

	case DT_INTEGER:
				sText_Symbol = 'DT_INTEGER';
				break;

	case DT_DECIMAL:
				sText_Symbol = 'DT_DECIMAL';
				break;

	case DT_DATE:
				sText_Symbol = 'DT_DATE';
				break;

	default:	sText_Symbol = 'UNCONVERTABLE_DATA_TYPE_CODE';
				break;
	}

	return (sText_Symbol);
}


/**
 *  Convert a Query-base code to its equivalent text symbol.
 *
 *	@param	{integer) a_nType_Code The code value to be converted.
 *
 *	@return	The equivalent text symbol.
 *	@type	string
 */

function format_query_base_code(a_nType_Code)
{
	var sText_Symbol = '';

	switch (a_nType_Code) {

	case QB_NONE:
				sText_Symbol = 'QB_NONE';
				break;

	case QB_ONE:
				sText_Symbol = 'QB_ONE';
				break;

	case QB_VALUE:
				sText_Symbol = 'QB_VALUE';
				break;

	case QB_RANGE:
				sText_Symbol = 'QB_RANGE';
				break;

	case QB_LIST:
				sText_Symbol = 'QB_LIST';
				break;

	case QB_TAX_LIST:
				sText_Symbol = 'QB_TAX_LIST';
				break;

	case QB_GROUP_LIST:
				sText_Symbol = 'QB_GROUP_LIST';
				break;

	case QB_UNKNOWN:
				sText_Symbol = 'QB_UNKNOWN';
				break;

	case QB_NOTFOUND:
				sText_Symbol = 'QB_NOTFOUND';
				break;

	default:	sText_Symbol = 'UNCONVERTABLE_QUERY_BASE_CODE';
				break;
	}

	return (sText_Symbol);
}


/**
 *  Convert a Search Type code to its equivalent text symbol.
 *
 *	@param	{integer) a_nType_Code The code value to be converted.
 *
 *	@return	The equivalent text symbol.
 *	@type	string
 */

function format_search_type_code(a_nType_Code)
{
	var sText_Symbol = '';

	switch (a_nType_Code) {

	case ST_NONE:
				sText_Symbol = 'ST_NONE';
				break;

	case ST_VALUE:
				sText_Symbol = 'ST_VALUE';
				break;

	case ST_RANGE:
				sText_Symbol = 'ST_RANGE';
				break;

	case ST_LIST:
				sText_Symbol = 'ST_LIST';
				break;

	case ST_TAX_LIST:
				sText_Symbol = 'ST_TAX_LIST';
				break;

	default:	sText_Symbol = 'UNCONVERTABLE_SEARCH_TYPE_CODE';
				break;
	}

	return (sText_Symbol);
}


/* -+- */


