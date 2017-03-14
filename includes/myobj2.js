/**
 *  @fileoverview The class My_Obj2 is used for JsUnit set up.
 *
 *	@version 0.0.3  [20.6.2006]
 *	@version 0.0.4  [3.7.2008]
 */


/**
 *	Constructor for the My_Obj2 JsUnit test class.
 *	@class	A simple test class used to set up JsUnit.
 *
 *	@constructor
 *	@param	{string} a_ID Unique identifier.
 *
 *	@return	none
 *	@type	void
 */

function My_Obj2(a_ID)
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
}


/**
 *  Set new value.
 *
 *  @param	{integer} a_value New value.
 *
 *  @return	none
 *  @type	void
 */

My_Obj2.prototype.set = function(a_value)
{
	this.m_value = a_value;
}


/**
 *  Report current value.
 *
 *  @return	Current value
 *  @type	integer
 */

My_Obj2.prototype.print_state = function()
{
	return (this.m_ID + ' = ' + this.m_value);
}


/* -+- */


