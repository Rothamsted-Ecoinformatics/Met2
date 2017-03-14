/**
 *	@fileoverview Functions for the data display prototype page.
 *
 *	@version 0.1.7  [27.10.2006]
 *	@version 0.1.8  [26.1.2007]
 *	@version 0.1.9  [13.2.2007]
 *	@version 0.1.10  [24.6.2008]
 */

/**
 * Called to attach all event listeners on page load.
 * 
 * @return none
 * @type void
 */

function init_listeners() {

	var step_button = document.getElementById('increase_font_size_button');
	if (!step_button) {
		return;
	}
	add_event(step_button, 'click', step_font_click, false);

	var drop_button = document.getElementById('decrease_font_size_button');
	if (!drop_button) {
		return;
	}
	add_event(drop_button, 'click', drop_font_click, false);

	var csv_button = document.getElementById('reformat_as_csv_button');
	if (!csv_button) {
		return;
	}
	add_event(csv_button, 'click', csv_click, false);

	var table_button = document.getElementById('reformat_as_table_button');
	if (!table_button) {
		return;
	}
	add_event(table_button, 'click', table_click, false);

	var calc_button = document.getElementById('calc_button');
	if (!calc_button) {
		return;
	}
	add_event(calc_button, 'click', cal_click, false);

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}

	var rows = data_table.getElementsByTagName('tr');
	var row_count = rows.length;
	if (row_count == 0) {
		return;
	}

	// for (var nx=0; nx<row_count; nx++) {
	// if ((rows[nx].nodeName.toLowerCase() == 'tr')
	// && (rows[nx].getAttribute('name') == 'header')) {
	// var cells = rows[nx].getElementsByTagName('th');
	// var cell_count = cells.length;
	// if (cell_count == 0) {
	// return;
	// }
	// for (var nc=0; nc<cell_count; nc++) {
	// if ((cells[nc].childNodes.length > 0)
	// && (cells[nc].firstChild.nodeName.toLowerCase() == 'a')) {
	// add_event(cells[nc].firstChild, 'click', title_click, false);
	// }
	// }
	// break;
	// }
	// }
}

/**
 * Called to toggle the page 'loading header'.
 * 
 * @return none
 * @type void
 */

function toggle_loading_header($id) {

	var start_header = document.getElementById($id);
	if (!start_header)
		return;
	start_header.className = "hide";

	var final_header = document.getElementById($id + '_final');
	if (!final_header)
		return;
	final_header.className = "";
}

/**
 * A page load handler to set up the dataset data listing table.
 * 
 * Note this handler function is called by the window onload observer so it does
 * not receive an event object.
 * 
 * @return none
 * @type void
 */

function init_page() {

	if (!document.getElementById || !document.getElementsByTagName)
		return;

	init_listeners();
	toggle_loading_header("page_title");

	// stripe_table();
}

/**
 * An event handler to enlarge the data table font.
 * 
 * @param {object}
 *            e The event object (if not running in IE)
 * 
 * @return none
 * @type void
 */

function step_font_click(e) {

	var etarget = find_event_target(e, 'input', true);
	if (!etarget)
		return;

	if (etarget.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	etarget.blur();

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}
	// alert(data_table.style.fontSize);
	font_list = data_table.style.fontSize.split('px');
	if (font_list.length == 2) {
		font_list[0]++;
		font_list[0]++;
		data_table.style.fontSize = font_list[0] + "px";
	}
}

/**
 * An event handler to reduce the data table font.
 * 
 * @param {object}
 *            e The event object (if not running in IE)
 * 
 * @return none
 * @type void
 */

function drop_font_click(e) {

	var etarget = find_event_target(e, 'input', true);
	if (!etarget)
		return;

	if (etarget.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	etarget.blur();

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}
	// alert(data_table.style.fontSize);
	font_list = data_table.style.fontSize.split('px');
	if (font_list.length == 2) {
		font_list[0]--;
		font_list[0]--;
		data_table.style.fontSize = font_list[0] + "px";
	}
}

/**
 * An event handler to convert the data table to csv format.
 * 
 * @param {object}
 *            e The event object (if not running in IE)
 * 
 * @return none
 * @type void
 */

function csv_click(e) {

	var etarget = find_event_target(e, 'input', true);
	if (!etarget)
		return;

	if (etarget.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	etarget.blur();

	var table_panel = document.getElementById('table_data_panel');
	if (!table_panel) {
		return;
	}
	table_panel.className = "hide";

	var csv_panel = document.getElementById('csv_data_panel');
	if (!csv_panel) {
		return;
	}
	csv_panel.className = "";

	var cal_panel = document.getElementById('cal_data_panel');
	if (!cal_panel) {
		return;
	}
	cal_panel.className = "hide";

	var enlarge_button = document.getElementById('increase_font_size_button');
	if (!enlarge_button) {
		return;
	}
	enlarge_button.className = "disable";
	var reduce_button = document.getElementById('decrease_font_size_button');
	if (!reduce_button) {
		return;
	}
	reduce_button.className = "disable";

	transfer_data();
}

function table_click(e) {

	var etarget = find_event_target(e, 'input', true);
	if (!etarget)
		return;

	if (etarget.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	etarget.blur();

	var table_panel = document.getElementById('table_data_panel');
	if (!table_panel) {
		return;
	}
	table_panel.className = "";
	var enlarge_button = document.getElementById('increase_font_size_button');
	if (!enlarge_button) {
		return;
	}
	enlarge_button.className = "";

	var reduce_button = document.getElementById('decrease_font_size_button');
	if (!reduce_button) {
		return;
	}
	reduce_button.className = "";

	var csv_panel = document.getElementById('csv_data_panel');
	if (!csv_panel) {
		return;
	}
	csv_panel.className = "hide";

	var cal_panel = document.getElementById('cal_data_panel');
	if (!cal_panel) {
		return;
	}
	cal_panel.className = "hide";

	// transfer_data();
}

/**
 * An event handler to test data while Nathalie is working on it.
 * 
 * @param {object}
 *            e The event object (if not running in IE)
 * 
 * @return none
 * @type void
 */
function cal_click(e) {

	var etarget = find_event_target(e, 'input', true);
	if (!etarget)
		return;

	if (etarget.nodeName.toLowerCase() != 'input')
		return;

	// Remove the focus from the button to eliminate
	// the dotted line 'focus' box in Mozilla browsers.
	etarget.blur();

	var table_panel = document.getElementById('table_data_panel');
	if (!table_panel) {
		return;
	}
	table_panel.className = "hide";

	var csv_panel = document.getElementById('csv_data_panel');
	if (!csv_panel) {
		return;
	}
	csv_panel.className = "hide";

	var cal_panel = document.getElementById('cal_data_panel');
	if (!cal_panel) {
		return;
	}
	cal_panel.className = "";

	var enlarge_button = document.getElementById('increase_font_size_button');
	if (!enlarge_button) {
		return;
	}
	enlarge_button.className = "disable";
	var reduce_button = document.getElementById('decrease_font_size_button');
	if (!reduce_button) {
		return;
	}
	reduce_button.className = "disable";

	var nl = "\n";
	if (typeof window.ActiveXObject != "undefined") {
		nl = "\r";
	}

	build_table();

}
/**
 * this is just a way to reformat my function
 */

function empty(mixed_var) {
	var undef, key, i, len;
	var emptyValues = [ undef, null, false, 0, "", "0" ];
	for (i = 0, len = emptyValues.length; i < len; i++) {
		if (mixed_var === emptyValues[i]) {
			return true;
		}
	}

	if (typeof mixed_var === "object") {
		for (key in mixed_var) {

			return false;

		}
		return true;
	}

	return false;
}

function build_table() {
	var csstr = 'default';
	var defwindrun = 100;
	var defsun = 0.1;
	var debug = 'Debug Log:</br>';
	var header = '';
	var dest = document.getElementById('cal_data_area');

	if (!dest) {
		return;
	}
	var dataset_name = document.getElementById('dataset_name');

	var dataset = dataset_name.innerHTML;
	// debug += 'Dataset Name is <b>' + dataset + '<br />';
	var lat = 51.81; // rothamsted}
	var location = 'Rothamsted Research';

	if (dataset == 'ROTHMET') {
		lat = 51.81;
		location = 'Rothamsted Research';
	}
	if (dataset == 'BROOMET') {
		lat = 52.267;
		location = 'Brooms Barn Station';
	}
	if (dataset == 'WOBMET') {
		lat = 52.017;
		location = 'Woburn Station';
	}
	header += '<p>Latitude at ' + location + ' is <b>' + lat + '</b></p>';

	header += '<table style= \"font-size: 10px\; border:0;">';
	header += '<tr>';
	header += '<td style= \"font-size: 10px\; border:0;"><p>You need to extract the following data from eRA met Data';
	header += '				<ul>';

	var goodData = 1;

	var day = get('day');
	if (day[0] == 'day: NO DATA') {
		day = [ "DAY", "", "01-01-1970" ];
		header += '<li>DAY: Date of measurements MISSING</li>';
		goodData = 0;
	} else {
		header += '<li>DAY: Date of measurements</li>';
	}

	var tmax = get('tmax');
	if (tmax[0] == 'tmax: NO DATA') {
		var tmax = [ "TMAX", "", "0" ];
		header += '<li>TMAX: Daily maximum temperature (&deg;C) is <b>MISSING</b></li>';
		goodData = 0;
	} else {
		header += '<li>TMAX: Daily maximum temperature (&deg;C)</li>';
	}

	var tmin = get('tmin');
	if (tmin[0] == 'tmin: NO DATA') {
		var tmin = [ "TMIN", "", "10" ];
		header += '<li>TMIN: Daily minimum temperature (&deg;C) is <b>MISSING</b></li>';
		goodData = 0;
	} else {
		header += '<li>TMIN: Daily minimum temperature (&deg;C)</li>';
	}
	var wetb = get('wetb');
	if (wetb[0] == 'wetb: NO DATA') {
		var wetb = [ "WETB", "", "0" ];
		header += '<li>WETB: Wet bulb temperature (&deg;C) is  <b>MISSING</b>';
	} else {
		header += '<li>WETB: Wet bulb temperature (&deg;C)';
	}

	var dryb = get('dryb');
	if (dryb[0] == 'dryb: NO DATA') {
		var dryb = [ "dryb", "", "0" ];
		header += '<li>dryb: Dry bulb temperature (&deg;C) is <b>MISSING</b></li>';
		goodData = 0;
	} else {
		header += '<li>dryb: Dry bulb temperature (&deg;C)</li>';
	}

	var rain = get('rain');
	if (rain[0] == 'rain: NO DATA') {
		var rain = [ "RAIN", "", "0" ];
		header += '<li>RAIN:Rainfall in 24h, 0900GMT to 0900GMT (mm)is <b>MISSING</b></li>';
		goodData = 0;
	} else {
		header += '<li>RAIN:Rainfall in 24h, 0900GMT to 0900GMT (mm)</li>';
	}
	var sun = get('sun');
	if (sun[0] == 'sun: NO DATA') {
		var day = [ "SUN", "", "0" ];
		header += '<li>SUN:	Hours of sunshine (h) is <b>MISSING</b></li>';
		goodData = 0;
	} else {
		header += '<li>SUN:	Hours of sunshine (h)</li>';
	}

	var rad = get('rad');
	if (rad[0] == 'rad: NO DATA') {
		rad = [ "RAD", "", "0" ];
		header += '<li>RAD:	Radiation is <b>MISSING</b> - it will be calculated from Data</li>';
	} else {
		header += '<li>RAD:	Radiation</li>';
	}

	var windrun = get('windrun');
	if (windrun[0] == 'windrun: NO DATA') {
		var windrun = [ "WINDRUN", "", "0" ];
		header += '<li>WINDRUN:	Run of wind in 24h, 0900GMT to 0900GMT is <b>MISSING</b> - it will be calculated from Data</li>';
		goodData = 0;
	} else {
		header += '<li>WINDRUN:	Run of wind in 24h, 0900GMT to 0900GMT </li>';

	}
	var dewp_imp = get('dewp');
	if (dewp_imp[0] == 'dewp: NO DATA') {
		var dewp_imp = [ "DEWP", "", "0" ];
		header += '<li>DEWP:	Dew point (&deg;C) is <b>MISSING</b> - it will be calculated from Data</li>';

	} else {
		header += '<li>DEWP:	Dew point (&deg;C)</li>';
	}
	var relh_i = get('relh');
	if (relh_i[0] == 'relh: NO DATA') {
		var relh_i = [ "RELH", "%", "" ];
		header += '<li>RELH:	Relative Humidity (%) is <b>MISSING</b> - it will be calculated from Data</li>';

	} else {
		header += '<li>RELH:	Relative Humidity (%)</li>';
	}

	var vap_i = get('vap');
	if (vap_i[0] == 'vap: NO DATA') {
		var vap_imp = [ "VAP", "mb", "0" ];
		header += '<li>VAP:	Vapour pressure (mb) is <b>MISSING</b> - it will be calculated from Data</li>';

	} else {
		header += '<li>VAP:	Vapour pressure (mb)</li>';

	}
	var ddlim = 0;
	var ddlim_value = document.getElementById('TLIM');
	var input_ddlim = ddlim_value.value;

	if (isNaN(input_ddlim)) {
		// debug += 'TLIM is not defined: <b>default is 0</b><br />';
		header += '<li>TLIM: The (arbitrary) limiting or base temperature (set by user): <b>MISSING</b>, using 0 as default</li>';
		ddlim = 0;
	} else {
		ddlim = Number(input_ddlim);
		// debug += 'input_ddlim is a Number: ' + input_ddlim + '<br />';
		header += '<li>TLIM: The (arbitrary) limiting or base temperature (set by user) is <b>'
				+ ddlim + '</b></li>';

	}
	header += '				</ul></td>';
	header += '<td style= \"font-size: 10px\; border:0;"><p>You will be returned the following calculated';
	header += ' variables:</p>';
	header += '				<ul>';
	header += '<li>VAP:Vapour pressure (mb)</li>';
	header += '<li>RELH:Relative humidity at 0900 GMT (% value of saturation value)</li>';
	header += '<li>APSMD:Accumulated Potential Soil Moisture Deficit (mm)</li>';
	header += '<li>DDA:Day Degrees Above a base temperature (TLIM)</li>';
	header += '<li>DDB:Day Degrees Below a base TLIM</li>';
	header += '<li>ACCDDA: Accumulated Day Degrees Above TLIM</li>';
	header += '<li>ACCDDB: Accumulated Day Degrees Below TLIM</li>';
	header += '<li>EVAPG:Evaporation over Grass (mm)</li>';
	header += '	<li>EVAPW:Evaporation over Water (mm)</li>';
	header += '</ul></td>';
	header += '</tr>';
	header += '<tr>';
	header += '<td colspan="2">A pink row indicates that missing data will affect calculations for  more that one row (psmd).</td></tr>';
	header += '</table>';
	var date = day[2].split("-");
	if (!date) {
		var date = [ "01", "01", "1970" ];
		debug += 'could not split date </br>';
	}

	var year = date[2];
	debug += 'year = ' + year + '<br/>'

	var firstday = new Date(date[2] + '/' + date[1] + '/' + date[0]);

	var today = new Date(yearx + '/' + monthx + '/' + dayx);
	var t0 = Date.parse(firstday) / (1000 * 60 * 60 * 24);
	var leap = (((year % 4) == 0) && (((year % 100) != 0) || ((year % 400) == 0)));

	var d0g = 0.75;
	var d1g = 1;
	var d0w = 0.95;
	var d1w = 0.5;
	var c1 = 4.0621 * Math.pow(10, -7);
	var c2 = 3.721432778 * Math.pow(10, 7);

	var psmd = 0;

	var accdda = 0;
	var accddb = 0;

	var st_hd = '';

	st_hd = '<table style= "font-size: 10px">';
	st_hd += '<tr>';

	var h = get_titles();
	var data = new Array();
	for ( var i = 1, len = h.length; i < len; i++) {
		data[i] = get(h[i]);
		st_hd += '<th>' + data[i][0] + '</th>';
	}
	st_hd += '<th> rad (calc) </th>';
	st_hd += '<th> svap	</th>';
	st_hd += '<th> vap  </th>';
	st_hd += '<th> relh  </th>';
	st_hd += '<th> dda 	</th>';

	st_hd += '<th> accdda 			</th>';
	st_hd += '<th> ddb 				</th>';
	st_hd += '<th> accddb 			</th>';
	st_hd += '<th> avtemp 			</th>';
//	st_hd += '<th> angnd 			</th>';
//	st_hd += '<th> csd 				</th>';
//	st_hd += '<th> snd 				</th>';
//
//	st_hd += '<th> cs2d 			</th>';
//	st_hd += '<th> sn2d 			</th>';
//	st_hd += '<th> sndecl 			</th>';
//	st_hd += '<th> csdecl 			</th>';
//	st_hd += '<th> csl 				</th>';
//	st_hd += '<th> snl 				</th>';
//	st_hd += '<th> cshass 			</th>';
//	st_hd += '<th> snhass 			</th>';
//	st_hd += '<th> hass 			</th>';
	st_hd += '<th> hrday 			</th>';

//	st_hd += '<th> avt 				</th>';
//	st_hd += '<th> Es 				</th>';
//	st_hd += '<th> Delta 			</th>';
//	st_hd += '<th> ea_grass 		</th>';
//	st_hd += '<th> ea_water 		</th>';
//	st_hd += '<th> sunfr 			</th>';
//	st_hd += '<th> fnt2 			</th>';
//	st_hd += '<th> ev1 				</th>';
//	st_hd += '<th> hj-g 			</th>';
//	st_hd += '<th> hj-w 			</th>';

	st_hd += '<th> evapg 			</th>';
	st_hd += '<th> evapw 			</th>';
	st_hd += '<th> day nB 			</th>';
	st_hd += '<th> smd 			</th>';
	st_hd += '<th> psmd 			</th>';

	st_hd += '<th> dewp </th>';

	st_hd += '</tr>';

	st_hd += '<tr>';

	for ( var i = 1, len = h.length; i < len; i++) {
		unit = data[i][1].replace("degrees", "&deg;");
		st_hd += '<th>' + unit + '</th>';
	}
	st_hd += '<th> rad unit			</th>';
	st_hd += '<th> 	mb			</th>';
	st_hd += '<th> 	mb			</th>';
	st_hd += '<th> 	% 			</th>';
	st_hd += '<th>  &deg;C 				</th>';
	st_hd += '<th>  &deg;C 				</th>';
	st_hd += '<th>   	&deg;C			</th>';
	st_hd += '<th>  	&deg;C			</th>';
	st_hd += '<th>  &deg;C 				</th>';
//	st_hd += '<th>  	hidden			</th>';
//	st_hd += '<th> 		hidden		</th>';
//	st_hd += '<th>   		hidden		</th>';
//
//	st_hd += '<th>  	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>    	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>  	hidden			</th>';
	st_hd += '<th>  	h			</th>';

//	st_hd += '<th>  	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>    	hidden			</th>';
//	st_hd += '<th>   	hidden			</th>';
//	st_hd += '<th>  	hidden			</th>';
//	st_hd += '<th>  	hidden			</th>';

	st_hd += '<th>  	mm			</th>';
	st_hd += '<th>   	mm			</th>';
	st_hd += '<th>   	Days			</th>';
	st_hd += '<th>    	mm			</th>';
	st_hd += '<th>    	mm			</th>';

	st_hd += '<th>  		&deg;C		</th>';
	st_hd += '</tr>';

	// **************calculate the values****************//

	var dda = 0;
	var ddb = 0;
	var st = '';
	for (row = 2; row < day.length; row++) {
		csstr = 'default';
		var avtemp = (Number(tmin[row]) + Number(tmax[row])) / 2;

		var es = Math.exp((17.269 * avtemp) / (237.3 + avtemp)); // works
		if (!day[row]) {
		} else {
			if (tmin[row] >= ddlim) {
				dda = avtemp - ddlim;
				ddb = 0;
			} else {
				if (tmax[row] <= ddlim) {
					dda = 0;
					ddb = ddlim - avtemp;
				} else if ((tmax[row] - ddlim) >= (ddlim - tmin[row])) {
					dda = ((tmax[row] - ddlim) / 2) - ((ddlim - tmin[row]) / 4);
					ddb = (ddlim - tmin[row]) / 4;
				} else {
					dda = (tmax[row] - ddlim) / 4;
					ddb = ((ddlim - tmin[row]) / 2) - ((tmax[row] - ddlim) / 4);
				}
			}
		}

		var vap = 0;
		var relh = 0;
		var svap = 0;

		if (relh_i[row] > 0) {
			if (!day[row]) {
				vap = 0;
				svap = 0;
			} else {
				svap = 6.107799961
						+ dryb[row]
						* (4.436518521 * Math.pow(10, -1) + dryb[row]
								* (1.428945805 * Math.pow(10, -2) + dryb[row]
										* (2.650648471 * Math.pow(10, -4) + dryb[row]
												* (3.031240396 * Math.pow(10,
														-6) + dryb[row]
														* (2.034080948 * Math
																.pow(10, -8) + 6.136820929
																* Math.pow(10,
																		-11)
																* dryb[row])))));
				vap = relh_i[row] * svap / 100;
				relh = 100 * vap / svap; // just for checking..
			}

		} else {

			if (!day[row]) {
				vap = 0;
				svap = 0;
			} else {
				if (Number(wetb[row]) <= 0) {
					vap = 6.1389
							* Math.exp(22.452 * Number(wetb[row])
									/ (272.55 + Number(wetb[row]))) - 0.720
							* (Number(dryb[row]) - Number(wetb[row]));
				} else {
					vap = 6.1375
							* Math.exp(17.502 * Number(wetb[row])
									/ (240.97 + Number(wetb[row]))) - 0.799
							* (Number(dryb[row]) - Number(wetb[row]));
				}
				svap = 6.1375 * Math.exp(17.502 * Number(dryb[row])
						/ (240.97 + Number(dryb[row])));
				relh = 100 * vap / svap;
			}

		}

		var dewp = 240.97 * Math.log(vap / 6.1375)
				/ (17.502 - Math.log(vap / 6.1375));

		var datex = day[row].split("-");
		var yearx = datex[2];
		var monthx = datex[1];
		var dayx = datex[0];
		var today = new Date(yearx + '/' + monthx + '/' + dayx);
		var ts = Date.parse(today) / (1000 * 60 * 60 * 24);
		ts = Math.round(ts);

		if (row == 2) {
			accdda = dda;
			accddb = ddb;
		}
		if (row > 2) {
			var datey = day[row - 1].split("-"); // getting yesterday from
			// table
			var yeary = datey[2];
			var monthy = datey[1];
			var dayy = datey[0];
			var yesterday = new Date(yeary + '/' + monthy + '/' + dayy);
			var ty = Date.parse(yesterday) / (1000 * 60 * 60 * 24);
			ty = Math.round(ty);

			if (ts == ty + 1) {
				accdda += (dda * 10) / 10;

				accddb += ddb;

			} else {
				yesterday = 0;

			}

		} else {
			yesterday = 0;
		}

		var ndays = Math.round(1 + ts - t0);

		var angnd = (6.28318 * (ndays + 193 - (365 + leap))) / (365 + leap);

		var sndecl = 0.00678
				+ Math.cos(angnd)
				* 0.39762
				+ Math.sin(angnd)
				* 0.00613
				- (Math.cos(angnd) * Math.cos(angnd) - Math.sin(angnd)
						* Math.sin(angnd)) * 0.00661 - Math.cos(angnd)
				* Math.sin(angnd) * 0.00318;

		var csdecl = Math.sqrt(1 - sndecl * sndecl);

		var csl = Math.cos((lat * 3.14159) / 180);
		var snl = Math.sin((lat * 3.14159) / 180);
		var csd = Math.cos(angnd);
		var snd = Math.sin(angnd);
		var cs2d = (csd + snd) * (csd - snd);
		var sn2d = 2 * csd * snd;
		var sndecl2 = 0.00678 + (0.39762 * csd) + (0.00613 * snd)
				- (0.00661 * cs2d) - (0.00159 * sn2d);

		var csdecl2 = Math.sqrt(1 - sndecl2 * sndecl2);

		var cshass = (-0.014544 - (snl * sndecl)) / (csl * csdecl);

		var snhass = Math.sqrt(1 - cshass * cshass);

		var hass = Math.atan(snhass / cshass);

		if (hass < 0) {
			hass = hass + 3.14159;
		}

		var hrday = 24 * hass / 3.14159;
		if (sun[row] == 'NA') {
			csstr = 'trflag';
			//sun[row] = defsun;
		} else {
			//defsun = sun[row]; // setting default sun value to the last one
								// that worked
			
		}
		var sunfr = sun[row] / hrday;
		var avt = avtemp + 237.3;

		var Es = 6.1078 * Math.exp((17.269 * avtemp) / avt);

		var delta = (4097.93 * Es) / (avt * avt);

		// =IF(ISBLANK(DATE)," ",
		// 0.0048985 * (AVTEMP + 273) ^ 4)*(0.47 - (0.065 * SQRT (VAP) ))*(0.17
		// + 0.83 * sunfr)
		var fnt2 = 0.0048985 * Math.pow((avtemp + 273), 4)
				* (0.47 - (0.065 * Math.sqrt(vap))) * (0.17 + 0.83 * sunfr);

		var ev1 = c1 * delta;
		var rad_calc = 0;

		if (rad[row] == 'NA') {
			csstr = 'trflag';
			var inv = 1.00011 - (0.03258 * csd) - (0.00755 * snd)
					+ (0.00064 * cs2d) + (0.00034 * sn2d);
			rad_calc = (0.16 + (0.62 * (((sun[row]) / hrday)))) * c2 * inv
					* ((csl * csdecl * snhass) + (snl * sndecl * hass));
			rad_calc = rad_calc/1000000;
		} else {
			rad_calc = Number(rad[row]);
		}

		if (rad[1] === "J/cm2") {
			rad_calc = rad_calc / 100;

		}
		

		var ea_grass = 0;
		if (windrun[row] == 'NA') {
			csstr = 'trflag';
			windrun[row] = defwindrun;
		} else {
			//defwindrun = windrun[row];
		}
		ea_grass = (0.2625 * (Es - vap))
				* (1 + (Number(windrun[row]) * 0.0062137));

		if (ea_grass < 0) {
			ea_grass = 0;
		} else {
			ea_grass = Number(ea_grass);
		}

		var ea_water = 0;

		ea_water = (0.2625 * (Es - vap))
				* (0.5 + (Number(windrun[row]) * 0.0062137));

		if (ea_water < 0) {
			ea_water = 0;
		} else {
			ea_water = Number(ea_water);
		}

		var hj_g = d0g * (1000000 * rad_calc) - fnt2;

		var evapg = (hj_g * ev1 + (0.66 * ea_grass)) / (delta + 0.66);

		var hmm = (hj_g * ev1) / 0.66;

		var hj_w = d0w * (1000000 * rad_calc) - fnt2;

		var evapw = ((hj_w * ev1) + (0.66 * ea_water)) / (delta + 0.66);

		if (today) {
			if (row < 3) {
				psmd = 0;
			}
			var smd = evapg - Number(rain[row]);
			if (isNaN(smd)) { smd = 0; }
			// smd could be negative because
			// of missing value or naturally
			/*
			 * if smd <0 because of missing data: smd is NaN and psmd is left as
			 * yesterdays 

			 * 0
			 */

			var check = psmd + smd;

			if (check < 0) {
				psmd = psmd;
			} else {
				psmd = psmd + smd;
			}
		}
		// *****************format to correct decimal values************//
		avtemp = Number(avtemp.toFixed(1));
		dda = Number(dda.toFixed(1));
		ddb = Number(ddb.toFixed(1));
		cshass = Number(cshass.toFixed(2));
		snhass = Number(snhass.toFixed(2));
		hass = Number(hass.toFixed(2));
		csl = Number(csl.toFixed(2));
		snl = Number(snl.toFixed(2));
		csd = Number(csd.toFixed(2));
		snd = Number(snd.toFixed(2));
		cs2d = Number(cs2d.toFixed(2));
		sn2d = Number(sn2d.toFixed(2));
		sndecl2 = Number(sndecl2.toFixed(2));
		csdecl2 = Number(csdecl2.toFixed(2));
		csdecl = Number(csdecl.toFixed(2));
		sndecl = Number(sndecl.toFixed(2));
		angnd = Number(angnd.toFixed(1));
		accddb = Number(accddb.toFixed(1));
		accdda = Number(accdda.toFixed(1));
		vap = Number(vap.toFixed(1));
		dewp = Number(dewp.toFixed(1));
		svap = Number(svap.toFixed(1));
		relh = Number(relh.toFixed(1));
		hrday = hrday.toFixed(1);
		sunfr = Number(sunfr.toFixed(1));
		avt = Number(avt.toFixed(1));
		Es = Number(Es.toFixed(1));
		delta = Number(delta.toFixed(2));
		fnt2 = Number(fnt2.toFixed(1));
		ev1 = Number(ev1.toFixed(1));
		rad_calc = Number(rad_calc.toFixed(2));
		hj_g = Number(hj_g.toFixed(1));
		hj_w = Number(hj_w.toFixed(1));
		evapg = Number(evapg.toFixed(1));
		evapw = Number(evapw.toFixed(1));
		psmd = Number(psmd.toFixed(1));
		smd = Number(smd.toFixed(1));
		ea_water = Number(ea_water.toFixed(1));
		ea_grass = Number(ea_grass.toFixed(1));

		// ************** write the values in the table************//
		if (csstr == 'default') {
			if ((row % 2) == 0) {
				st += '<tr class="rowodd">';
			} else {
				st += '<tr class="roweven">';
			}
			;
		} else {

			st += '<tr class="' + csstr + '">';

		}
		for ( var i = 1, len = h.length; i < len; i++) {

			st += '<td>' + data[i][row] + '</td>';
		}
		st += '<td>'  + rad_calc + '</td>';
		st += '<td>'  + svap + '</td>';
		
		st += '<td>' + vap + '</td>';
		st += '<td>' + relh + '</td>';

		st += '<td>' + dda + '</td>';

		st += '<td>' + accdda + '</td>';
		st += '<td>' + ddb + '</td>';
		st += '<td>' + accddb + '</td>';
		st += '<td>' + avtemp + '</td>';
//		st += '<td>' + angnd + '</td>';
//		st += '<td>' + csd + '</td>';
//		st += '<td>' + snd + '</td>';
//
//		st += '<td>' + cs2d + '</td>';
//		st += '<td>' + sn2d + '</td>';
//		st += '<td>' + sndecl + '</td>';
//		st += '<td>' + csdecl + '</td>';
//		st += '<td>' + csl + '</td>';
//		st += '<td>' + snl + '</td>';
//		st += '<td>' + cshass + '</td>';
//		st += '<td>' + snhass + '</td>';
//		st += '<td>' + hass + '</td>';
		st += '<td>' + hrday + '</td>';

//		st += '<td>' + avt + '</td>';
//		st += '<td>' + Es + '</td>';
//		st += '<td>' + delta + '</td>';
//		st += '<td>' + ea_grass + '</td>';
//		st += '<td>' + ea_water + '</td>';
//		st += '<td>' + sunfr + '</td>';
//		st += '<td>' + fnt2 + '</td>';
//		st += '<td>' + ev1 + '</td>';
//		st += '<td>' + hj_g + '</td>';
//		st += '<td>' + hj_w + '</td>';

		st += '<td>' + evapg + '</td>';
		st += '<td>' + evapw + '</td>';
		st += '<td>' + ndays + '</td>';
		st += '<td>' + smd + '</td>';
		st += '<td>' + psmd + '</td>';

		st += '<td>' + dewp + '</td>';
		st += '</tr>';
	}

	var st_ft = '</table>';
	if (goodData == 0) {
		st_hd = '<b>Please select the missing fields and extract data again</b>';
		st = '';
		st_ft = '';
	}
	dest.innerHTML = h + header + debug + st_hd + st + st_ft;

}
/**
 * An event handler for sorting clicks on table column titles.
 * 
 * @param {object}
 *            e The event object (if not running in IE)
 * 
 * @return none
 * @type void
 */
/*
 * function title_click(e) {
 * 
 * var etarget = find_event_target(e, 'a', true); if (!etarget) return;
 * 
 * if (etarget.nodeName.toLowerCase() != 'a') return; // Remove the focus from
 * the title to eliminate // the dotted line 'focus' box in Mozilla browsers.
 * etarget.blur(); // var starget_label =
 * etarget.getAttribute("href").split('#')[1]; // alert("sort on " +
 * starget_label); }
 */

/* http://www.alistapart.com/articles/zebratables/ */
// function removeClassName (elem, className) {
// elem.className = elem.className.replace(className, "").trim();
// }
// function addCSSClass (elem, className) {
// removeClassName (elem, className);
// elem.className = (elem.className + " " + className).trim();
// }
// String.prototype.trim = function() {
// return this.replace( /^\s+|\s+$/, "" );
// }
/**
 * Stripe the dataset data listing table from whatever state it's currently in.
 * 
 * @return none
 * @type void
 */

function stripe_table() {

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}

	var rows = data_table.getElementsByTagName('tr');
	var row_count = rows.length;
	// alert(row_count + ' row(s)');
	if (row_count == 0) {
		return;
	}

	var data_row_count = 0;
	for ( var nx = 0; nx < row_count; nx++) {
		if ((rows[nx].nodeName.toLowerCase() == 'tr')
				&& (rows[nx].getAttribute('name') != 'header')) {
			data_row_count++;
			if ((data_row_count % 2) == 0) {
				rows[nx].className = 'roweven';
			} else {
				rows[nx].className = 'rowodd';
			}
		}
	}

	// var nx = 0;
	// for (nx=0; nx<row_count; nx++) {
	// removeClassName(rows[nx], 'alternateRow');
	// addCSSClass(rows[nx], 'normalRow');
	// }
	// for (nx=0; nx<row_count; nx+=2) {
	// removeClassName(trs[k], 'normalRow');
	// addCSSClass(trs[k], 'alternateRow');
	// }
}

/**
 * Transfer data from HTML table to preformatted CSV.
 * 
 * @return none
 * @type void
 */

function transfer_data() {

	var nl = "\n";
	if (typeof window.ActiveXObject != "undefined") {
		nl = "\r";
	}

	var dest = document.getElementById('csv_data_area');
	if (!dest) {
		return;
	}

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}
	var rows = data_table.getElementsByTagName('tr');
	var row_count = rows.length;
	// alert(row_count + ' row(s)');

	var nc = 0;
	var txt = new String;
	if (row_count > 1) {
		var cells = null;
		var cell_count = 0;
		for ( var nx = 0; nx < row_count; nx++) {
			if (rows[nx].nodeName.toLowerCase() == 'tr') {
				if (rows[nx].getAttribute('name') == 'header') {
					cells = rows[nx].getElementsByTagName('th');
					cell_count = cells.length;
					if ((cells[0].childNodes.length > 0)
							&& (cells[0].firstChild.nodeType == 3)) {
						txt += cells[0].firstChild.nodeValue;
					}
					if (cell_count > 1) {
						for (nc = 1; nc < cell_count; nc++) {
							if ((cells[nc].childNodes.length > 0)
									&& (cells[nc].firstChild.nodeType == 3)) {
								txt += ',' + cells[nc].firstChild.nodeValue;
							}
						}
					}
					// if ((cells[0].firstChild.childNodes.length > 0)
					// && (cells[0].firstChild.firstChild.nodeType == 3)) {
					// txt += cells[0].firstChild.firstChild.nodeValue;
					// }
					// if (cell_count > 1) {
					// for (nc=1; nc<cell_count; nc++) {
					// if ((cells[nc].firstChild.childNodes.length > 0)
					// && (cells[nc].firstChild.firstChild.nodeType == 3)) {
					// txt += ',' + cells[nc].firstChild.firstChild.nodeValue;
					// }
					// }
					// }
				} else {
					cells = rows[nx].getElementsByTagName('td');
					cell_count = cells.length;
					if ((cells[0].childNodes.length > 0)
							&& (cells[0].firstChild.nodeType == 3)) {
						txt += cells[0].firstChild.nodeValue;
					}
					if (cell_count > 1) {
						for (nc = 1; nc < cell_count; nc++) {
							if ((cells[nc].childNodes.length > 0)
									&& (cells[nc].firstChild.nodeType == 3)) {
								txt += ',' + cells[nc].firstChild.nodeValue;
							}
						}
					}
				}
				txt += nl;
			}
		}
	}

	csv_node = document.createTextNode(txt + nl + '** end of data **' + nl);
	dest.appendChild(csv_node);
}
/*
 * this will get all the data that people have downloaded returns and array [
 * [data,unit],...
 */
function get_titles() {

	if (typeof window.ActiveXObject != "undefined") {
		nl = "\r";
	}

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}
	var rows = data_table.getElementsByTagName('tr');
	var row_count = rows.length;
	// alert(row_count + ' row(s)');

	var nc = 0;
	var titles = [ 'headers' ];
	if (row_count > 1) {
		var cells = null;
		var cell_count = 0;
		var nx = 0;

		cells = rows[nx].getElementsByTagName('th');
		cell_count = cells.length;

		if ((cells[0].childNodes.length > 0)
				&& (cells[0].firstChild.nodeType == 3)) {

			titles[titles.length] = cells[0].firstChild.nodeValue;

		}
		if (cell_count > 1) {
			for (nc = 1; nc < cell_count; nc++) {
				if ((cells[nc].childNodes.length > 0)
						&& (cells[nc].firstChild.nodeType == 3)) {

					titles[titles.length] = cells[nc].firstChild.nodeValue;

				}
			}
		}
	}

	return titles;
}

/*
 * function to extract from the dataset_data_listing_table the headers of the
 * fields and the data.
 * 
 * similar to
 * 
 * function get($head) { global $data; $nbCols = $data->colcount(1)+1; $nbRows =
 * $data->rowcount(1); //First, find day for ($col = 0; $col < $nbCols; $col++) {
 * 
 * for ($row = 0; $row < $nbRows; $row++) {
 * 
 * if ($data->val($row,$col,1)=== $head) {
 * 
 * $coordDAY = $row.",".$col; //echo $data->val($row,$col,1)." = " . $coordDAY."<br />"; }
 * else {} } }
 * 
 * $coordDAYS = explode(',', $coordDAY) ; $i=0; for ($row = $coordDAYS[0]; $row<$nbRows;
 * $row++) { $header[$i] = $data->val($row, $coordDAYS[1],1); //echo ($row." -
 * ".$coordDAYS[1]." - ".$day[$i]."<br />"); $i++; } return $header; }
 * 
 */
function isBlank(str) {
	return (!str || /^\s*$/.test(str));
}
function get(h) {
	var nl = "\n";
	if (typeof window.ActiveXObject != "undefined") {
		nl = "\r";
	}

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}
	var rows = data_table.getElementsByTagName('tr');
	var row_count = rows.length;
	// alert(row_count + ' row(s)');

	var nc = 0;
	var row_h = 'none';
	var col_h = 'none';
	var values = [ h + ': NO DATA' ];
	var txt = new String;
	if (row_count > 1) {
		var cells = null;
		var cell_count = 0;
		var nx = 0;

		for (nx = 0; nx < row_count; nx++) { // nx is a row counter
			if (rows[nx].nodeName.toLowerCase() == 'tr') {
				if (rows[nx].getAttribute('name') == 'header') {
					cells = rows[nx].getElementsByTagName('th');
					units = rows[nx + 1].getElementsByTagName('th');
					cell_count = cells.length;

					if ((cells[0].childNodes.length > 0)
							&& (cells[0].firstChild.nodeType == 3)) {
						if (cells[0].firstChild.nodeValue == h) {
							row_h = nx;
							col_h = 0;
							// txt += cells[0].firstChild.nodeValue;
							values[0] = h;
							values[1] = units[0].firstChild.nodeValue;
						}
					}
					if (cell_count > 1) {
						for (nc = 1; nc < cell_count; nc++) {
							if ((cells[nc].childNodes.length > 0)
									&& (cells[nc].firstChild.nodeType == 3)) {
								if (cells[nc].firstChild.nodeValue == h) {
									txt += ',' + cells[nc].firstChild.nodeValue;
									row_h = nx;
									col_h = nc;
									values[0] = h;
									values[1] = units[nc].firstChild.nodeValue;
								}
							}
						}
					}
					// if ((cells[0].firstChild.childNodes.length > 0)
					// && (cells[0].firstChild.firstChild.nodeType == 3)) {
					// txt += cells[0].firstChild.firstChild.nodeValue;
					// }
					// if (cell_count > 1) {
					// for (nc=1; nc<cell_count; nc++) {
					// if ((cells[nc].firstChild.childNodes.length > 0)
					// && (cells[nc].firstChild.firstChild.nodeType == 3)) {
					// txt += ',' + cells[nc].firstChild.firstChild.nodeValue;
					// }
					// }
					// }
				} else {
					cells = rows[nx].getElementsByTagName('td');
					cell_count = cells.length;
					if ((cells[0].childNodes.length > 0)
							&& (cells[0].firstChild.nodeType == 3)) {
						if (col_h == 0) {
							txt += cells[0].firstChild.nodeValue;
							values[values.length] = cells[0].firstChild.nodeValue;
						}
					}
					if (cell_count > 1) {
						for (nc = 1; nc < cell_count; nc++) {
							if ((cells[nc].childNodes.length > 0)
									&& (cells[nc].firstChild.nodeType == 3)) {
								if (col_h == nc) {
									txt += ',' + cells[nc].firstChild.nodeValue;

									if (isBlank(cells[nc].firstChild.nodeValue)) {
										values[values.length] = 'NA';
									} else {
										values[values.length] = cells[nc].firstChild.nodeValue;
									}
								}
							}
						}
					}
				}
				txt += nl;
			}
		}
	}

	return values;
}

function calculate_data() {

	var nl = "\n";
	if (typeof window.ActiveXObject != "undefined") {
		nl = "\r";
	}

	var dest = document.getElementById('cal_data_area');
	if (!dest) {
		return;
	}

	var data_table = document.getElementById('dataset_data_listing_table');
	if (!data_table) {
		return;
	}
	var rows = data_table.getElementsByTagName('tr');
	var row_count = rows.length;
	// alert(row_count + ' row(s)');

	var nc = 0;
	var txt = new String;
	if (row_count > 1) {
		var cells = null;
		var cell_count = 0;
		for ( var nx = 0; nx < row_count; nx++) {
			if (rows[nx].nodeName.toLowerCase() == 'tr') {
				if (rows[nx].getAttribute('name') == 'header') {
					cells = rows[nx].getElementsByTagName('th');
					cell_count = cells.length;
					if ((cells[0].childNodes.length > 0)
							&& (cells[0].firstChild.nodeType == 3)) {
						txt += cells[0].firstChild.nodeValue;
					}
					if (cell_count > 1) {
						for (nc = 1; nc < cell_count; nc++) {
							if ((cells[nc].childNodes.length > 0)
									&& (cells[nc].firstChild.nodeType == 3)) {
								txt += ',' + cells[nc].firstChild.nodeValue;
							}
						}
					}
					// if ((cells[0].firstChild.childNodes.length > 0)
					// && (cells[0].firstChild.firstChild.nodeType == 3)) {
					// txt += cells[0].firstChild.firstChild.nodeValue;
					// }
					// if (cell_count > 1) {
					// for (nc=1; nc<cell_count; nc++) {
					// if ((cells[nc].firstChild.childNodes.length > 0)
					// && (cells[nc].firstChild.firstChild.nodeType == 3)) {
					// txt += ',' + cells[nc].firstChild.firstChild.nodeValue;
					// }
					// }
					// }
				} else {
					cells = rows[nx].getElementsByTagName('td');
					cell_count = cells.length;
					if ((cells[0].childNodes.length > 0)
							&& (cells[0].firstChild.nodeType == 3)) {
						txt += cells[0].firstChild.nodeValue;
					}
					if (cell_count > 1) {
						for (nc = 1; nc < cell_count; nc++) {
							if ((cells[nc].childNodes.length > 0)
									&& (cells[nc].firstChild.nodeType == 3)) {
								txt += ',' + cells[nc].firstChild.nodeValue;
							}
						}
					}
				}
				txt += nl;
			}
		}
	}

	cal_node = document.createTextNode(txt + nl + '** end of data **' + nl);
	dest.appendChild(cal_node);

}

// Register this module's page load handler with the window onload observer.
window.AddOnLoadClient(init_page);

/* -+- */

