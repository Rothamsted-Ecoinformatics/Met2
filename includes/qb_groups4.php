<?php

/**
 *	Dataset data-extraction-display grouping meta-data.
 *	@package ERA
 *
 *	@version 0.0.2  [3.7.2007]
 *	@version 0.0.3  [26.9.2007]
 *	@version 0.0.4  [15.11.2007]
 *	@version 0.0.5  [28.11.2007]
 *	@version 0.0.6  [7.1.2008]
 *	@version 0.0.8  [18.6.2008]
 *	@version 0.0.11  [30.6.2008]
 *	@version 0.0.12  [4.7.2008]
 *	@version 0.6.1  [23.7.2008]		// start of prototype 6
 *	@version 0.6.2  [23.9.2008]
 *	@version 0.6.3  [30.9.2008]
 *	@version 0.6.3  [30.9.2008]
 *	@version 0.6.4  [9.1.2009]		// release version
 *	@version 0.6.5  [27.1.2009]
 *	@version 0.6.6  [6.8.2009]		// add new Broadbalk datasets
 *	@version 0.6.7  [2.12.2011]		// add test HOOSBEAN dataset in group test
   *	@version 0.6.11  [8.11.2012]		// add test BBKWHNUTRI dataset  by nathalie 
 */


$group_metadata = array(

	'broadbalk'		=>  array(
			'title'				=>	"Broadbalk Experiment",
			'list'				=>  array( 
											"bbkyield", "bbkyield_f", "bkyield_f85", "bkyield_r85",
											 "bkbeans",	"bbkmaize", "bkoats", "bkpotato", 
											 "bbkwhnutri", "bkoatnutri", "bkbeannutri", "bbkmaiznutri", "bkpotsnutri",


											 "bbkweeds_fal", "bbkweeds_rot",  "bkweed_sum", "bkweeds_plot",
											 "bbkdisease","bkgr_quality"
											),
			'url'				=>  "4",
			'info'				=>  "?"
	),

	'hoosfield'		=>  array(
			'title'				=>	"Hoosfield Spring Barley Experiment",
			'list'				=>  array("hoosyield", 
											"hoosyield1", "hoosyield2", "hoosyield3", "hoosyield4", 
											"hoosyield5a"),
			'url'				=>  "5",
			'info'				=>  "?"
	),

	'park_grass'	=>  array(
			'title'				=>	"Park Grass Experiment",
			'list'				=>  array("parkyield", "pghayequiv",
								"parkcomp", "parkpartcomp", "parkcompic"
								),
			'url'				=>  "1",
			'info'				=>  "?"
	),

	'wheatfallow'		=>  array(
			'title'				=>	"Alternate Wheat / Fallow",
			'list'				=>  array("wheatfal", "falwheat"),
			'url'				=>  "6",
			'info'				=>  "?"
	),
	'met_data'		=>  array(
			'title'				=>	"Meteorological Records - click for important met data corrections and updates",
			'list'				=>  array("broomet", "rothmet", "wobmet", "daymetschool", "schoolmetmth"),
			'url'				=>  "2&sub=importantmeteorologicaldataupdates",
			'info'				=>  "?"
	)
);


?>


<!-- -+- -->


