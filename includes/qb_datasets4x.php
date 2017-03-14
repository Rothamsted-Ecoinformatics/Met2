<?php

/**
 *	Full dataset listing for data-extraction-display.
 *	@package ERA
 *
 *	@version 0.0.2  [30.11.2007]
 *	@version 0.0.3  [8.1.2008]
 *	@version 0.0.6  [30.6.2008]
 *	@version 0.0.8  [10.7.2008]
 *	@version 0.6.1  [22.7.2008]		// start of prototype 6
 *	@version 0.6.2  [24.7.2008]
 *	@version 0.6.3  [30.9.2008]
 *	@version 0.6.4  [9.1.2009]		// site release version
 *	@version 0.6.5  [27.1.2009]
 *	@version 0.6.6  [19.5.2009]		// institute release version
 *	@version 0.6.7  [6.8.2009]		// add new Broadbalk datasets
 *	@version 0.6.8  [5.1.2010]		// Met. dataset date updates
 *	@version 0.6.9  [2.12.2011]		// add test HOOSBEAN dataset
 *	@version 0.6.10  [4.5.2012]		// add test BKOATS dataset  by nathalie
 *	@version 0.6.11  [8.11.2012]		// add test BBKWHNUTRI dataset  by nathalie
 */


$dataset_complete = array(

	'broomet'		=>	array(
			'table_name'		=>	"broomet",
			'display_label'		=>	"BROOMET",
			'description'		=>	"Brooms Barn meteorological records 1982 - Current Date",
			'retrieval'			=>	RT_ONLINE

),

	'daymetschool'		=>	array(
			'table_name'		=>	"daymetschool",
			'display_label'		=>	"SCHOOLMETDAY",
			'description'		=>	"Daily Rothamsted weather data for schools 1990 - Current Date",
			'retrieval'			=>	RT_ONLINE
),

	'rothmet'		=>	array(
			'table_name'		=>	"rothmet",
			'display_label'		=>	"ROTHMET",
			'description'		=>	"Rothamsted meteorological records 1853 - Current Date",
			'retrieval'			=>	RT_ONLINE
),

	'schoolmetmth'		=>	array(
			'table_name'		=>	"schoolmetmth",
			'display_label'		=>	"SCHOOLMETMTH",
			'description'		=>	"Monthly Rothamsted weather data for schools 1878-2013",
			'retrieval'			=>	RT_ONLINE

)
,

	'wobmet'		=>	array(
			'table_name'		=>	"wobmet",
			'display_label'		=>	"WOBMET",
			'description'		=>	"Woburn meteorological records 1928 - Current Date",
			'retrieval'			=>	RT_ONLINE

)
);


?>


<!-- -+- -->


