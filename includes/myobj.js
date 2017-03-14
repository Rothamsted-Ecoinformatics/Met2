/**
 *  @fileoverview The class My_Obj is used to match JSDoc operation with object declaration.
 *
 *	@version 0.0.3  [20.6.2006]
 *	@version 0.0.4  [3.7.2008]
 */


/**
 *	Constructor for the My_Obj JsUnit and JSDoc test class.
 *	@class	A simple test class used to exercise the features supported by JSDoc.
 *
 *	@constructor
 *	@param	{string} a_ID Unique identifier.
 *
 *	@return	none
 *	@type	void
 */

function My_Obj(a_ID)
{
	/**
	 *	The object's name.
	 *	@type	string
	 */
	this.m_ID = a_ID;
	/**
	 *	The object's value.
	 *	@type	integer
	 */
	this.m_value = 0;
	/**
	 *	The object's maximum permitted value.
	 *	Used as a class constant - but note that JavaScript does not enforce its immutability.
	 *	Note also that this data member will still appear in all the alphabetical 'field' lists
	 *	ie it will not be separated out as a constant.
	 *	@final
	 *	@type	integer
	 */
	this.m_maximum_value = 100;
	/**
	 *  Report the current value. This function is assigned in the class
	 *	constructor rather than using the prototype keyword.
	 *	So there will be a copy of this function for each object instantiated?
	 *
	 *  @return	Current value
	 *  @type	integer
	 */
	this.report2 = function() {
		alert(this.m_ID + ' = ' + this.m_value);
		return (this.m_value);
	}
}


/**
 *  Set new value.
 *
 *  @param	{integer} a_value New value.
 *
 *  @return	none
 *  @type	void
 */

My_Obj.prototype.set = function(a_value)
{
	this.m_value = a_value;
}


/**
 *  Report current value.
 *
 *  @return	Current value
 *  @type	integer
 */

My_Obj.prototype.print_state = function()
{
	return (this.m_ID + ' = ' + this.m_value);
}


/**
 *  Add to current value.
 *
 *  @param	{integer} a_increment Increment to current value.
 *
 *  @return	New current value
 *  @type	integer
 */

My_Obj.prototype.increment = function(a_increment)
{
	this.m_value += a_increment;
}


/**
 *  Return the maximum acceptable value. A test of the private-status tag only
 *	because the code is not set up to be enforcably private.
 *	Note that to be included in the documentation the --private command line
 *	option must be used when executing JSDoc. The function is then marked private
 *	in the documentation for its class but still appears in the alphabetical
 *	'method' lists ie it's not separated out from all the public functions.
 *
 *	@private
 *
 *  @return	Maximum value supported
 *  @type	integer
 */

My_Obj.prototype.get_max = function()
{
	return (this.m_maximum_value);
}


/* -+- */


