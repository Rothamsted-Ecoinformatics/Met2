<?php

/**
 *	Dataset data-extraction-display meta-data.
 *	@package ERA
 *
 *	@version 0.0.1   [2.7.2007]
 *	@version 0.0.2   [22.8.2007]
 *	@version 0.0.3   [26.9.2007]
 *	@version 0.0.6   [30.11.2007]
 *	@version 0.0.7   [8.1.2008]
 *	@version 0.0.9   [18.6.2008]
 *	@version 0.0.15  [10.7.2008]
 *	@version 0.6.1   [22.7.2008]	// start of prototype 6
 *	@version 0.6.2   [30.9.2008]
 *	@version 0.6.4   [9.1.2009]		// site release version
 *	@version 0.6.6   [30.1.2009]
 *	@version 0.6.7   [10.2.2009]
 *	@version 0.6.8   [5.5.2009]
 *	@version 0.6.9   [19.5.2009]	// institute release version
 *	@version 0.6.10  [6.8.2009]		// add new Broadbalk datasets
 *	@version 0.6.11  [5.1.2010]		// Met. dataset date updates
 *	@version 0.6.12  [11.6.2010]	// enable PARKCOMPIC dataset
 *	@version 0.6.13  [23.7.2010]	// enable BBKDISEASE dataset
 *	@version 0.6.14  [2.12.2011]	// add test HOOSBEAN dataset
 *@version 0.6.15  [8.11.2012]		// add test BBKWHNUTRI dataset  by nathalie
 *@version 0.6.16		[10.03.2016] //removed farm platform data
 */


$dataset_metadata = array(

	'broomet'		=>	array(
			'table_name'		=>	"broomet",
			'display_label'		=>	"BROOMET",
			'display_code'		=>  DC_DISPLAY,
			'description'		=>	"Brooms Barn meteorological records 1982 - Current Date",
			'display_group'		=>  "met_data"
			),
	'daymetschool'		=>	array(
			'table_name'		=>	"daymetschool",
			'display_label'		=>	"SCHOOLMETDAY",
			'display_code'		=>  DC_DISPLAY,
			'description'		=>	"Daily Rothamsted weather data for schools 1990 - Current Date",
			'display_group'		=>  "met_data"
			),
	'rothmet'		=>  array(
			'table_name'		=>	"rothmet",
			'display_label'		=>  "ROTHMET",
			'display_code'		=>  DC_DISPLAY,
			'description'		=>  "Rothamsted meteorological records 1853 - Current Date",
			'display_group'		=>  "met_data"
			),
	'schoolmetmth'		=>	array(
			'table_name'		=>	"schoolmetmth",
			'display_label'		=>	"SCHOOLMETMTH",
			'display_code'		=>  DC_DISPLAY,
			'description'		=>	"Monthly Rothamsted weather data for schools 1878-2013",
			'display_group'		=>  "met_data"
			),

	'wobmet'		=>	array(
			'table_name'		=>	"wobmet",
			'display_label'		=>	"WOBMET",
			'display_code'		=>  DC_DISPLAY,
			'description'		=>	"Woburn meteorological records 1928 - Current Date",
			'display_group'		=>  "met_data"
			)
			);


			?>


<!-- -+- -->


