function get_dds(i)
{
	var dryb = get('dryb');
	var day = get('day');
	var tmin = get('tmin');
	var tmax = get('tmax');
	var wetb = get('wetb');
	var rain = get('rain');
	var sun = get('sun');
	var rad = get('rad');
	var windrun = get('windrun');
	var vap = get('vap');
	var date = explode ('/',day[3]);
	var year = date[2];
	var leap = (((year % 4) == 0) && (((year % 100) != 0) || ((year %400) == 0)));
	
	
	d0g=0.75;
	d1g = 1;
	d0w = 0.95;
	d1w = 0.5;
	c1 = 4.0621 *pow(10,-7);
	c2 = 3.721432778 * pow(10,7);
	if (!lat) {lat = 51.81;} // rothamsted}

	if (is_numeric(tmax[i]) && is_numeric(tmin[i]))
	{
		dd['avtemp'] = (tmax[i]+tmin[i])/2;
		dd['es'] = exp((17.269*dd['avtemp'])/(237.3+dd['avtemp'])); //works

		if (!day) {}
		else {
			if (tmin[i] >= ddlim)
			{
				dd['dda'] = avtemp - ddlim;
				dd['ddb'] = 0;
			}
			else
			{
				if (tmax[i] <= ddlim)
				{
					dd['dda'] = 0;
					dd['ddb'] = ddlim - avtemp;
				}
				else
				if ((tmax[i] - ddlim) >= (ddlim - tmin[i]))
				{
					dd['dda'] = ((tmax[i] - ddlim)/2) - ((ddlim-tmin[i])/4);
					dd['ddb'] = (ddlim - tmin[i])/4;
				}
				else
				{
					dd['dda'] = (tmax[i] - ddlim)/4;
					dd['ddb'] = ((ddlim - tmin[i])/2 )- ((tmax[i] -ddlim)/4);
				}
			}
		}
	}
	if (!day[i])
	{
		dd['vap'] =  '';
		dd['svap'] =  '';
	}
	else
	{
		if (wetb[i] <= 0)
		{
			dd['vap'] = 6.1389*exp(22.452*wetb[i]/(272.55+wetb[i]))-0.720*(dryb[i]-wetb[i]);

		}
		else
		{
			dd['vap'] = 6.1375*exp(17.502*wetb[i]/(240.97+wetb[i]))-0.799*(dryb[i]-wetb[i]);

		}
	}
	dd['dewp']= 240.97*log(dd['vap']/6.1375)/(17.502-log(dd['vap']/6.1375));

	if (!day[i]) {dd['relh'] =  '';dd['relh'] =  '';}
	else
	{
		dd['svap'] = 6.1375*exp(17.502*dryb[i]/(240.97+dryb[i]));
		dd['relh'] = 100*dd['vap']/dd['svap'];
	}

	dd['ndays'] = 1+(strtotime(day[i]) - strtotime(day[2]))/(60*60*24);

	dd['angnd'] = (6.28318*(dd['ndays']+193-(365+leap)))/(365+leap);

	dd['sndecl'] = 0.00678 + cos(dd['angnd'])*0.39762 + sin(dd['angnd'])*0.00613-(cos(dd['angnd'])*
	cos(dd['angnd'])-sin(dd['angnd'])*sin(dd['angnd']))*0.00661-cos(dd['angnd'])*sin(dd['angnd'])*
	0.00318;

	dd['csdecl'] = sqrt(1-dd['sndecl']*dd['sndecl']);

	dd['csl'] = cos((lat*3.14159)/180);
	dd['snl'] = sin((lat*3.14159)/180);
	dd['csd'] = cos(dd['angnd']);
	dd['snd'] = sin(dd['angnd']);
	dd['cs2d'] = (dd['csd'] + dd['snd'] )*(dd['csd'] - dd['snd'] );
	dd['sn2d'] = 2*dd['csd']*dd['snd'] ;
	dd['sndecl2'] = 0.00678 + (0.39762*dd['csd']) + (0.00613*dd['snd']) - (0.00661*dd['cs2d']) - (0.00159*dd['sn2d'] );

	dd['csdecl2'] = sqrt(1-dd['sndecl2']*dd['sndecl2']);
	dd['cshass'] = (-0.014544 - (dd['snl']*dd['sndecl']))/(dd['csl']*dd['csdecl']);
	dd['snhass'] = sqrt(1 - dd['cshass']*dd['cshass']);
	dd['hass'] = atan(dd['snhass']/dd['cshass']);

	if (dd['hass'] < 0)
	{
		dd['hass'] = dd['hass'] + 3.14159;
	}
	dd['hrday'] = 24*dd['hass']/3.14159;
	dd['sunfr'] = sun[i]/ dd['hrday'];
	dd['avt'] = dd['avtemp'] + 237.3;
	dd['Es'] = 6.1078 * exp((17.269 * dd['avtemp']) / dd['avt']) ;
	dd['es'] = exp((17.269*dd['avtemp'])/(237.3+dd['avtemp'])); //works
	dd['delta'] = (4097.93 *  dd['Es']) / (dd['avt'] * dd['avt']);
	dd['fnt2'] = (0.0048985 * pow((dd['avtemp'] + 273.0) , 4)) *(0.47- (0.065 * sqrt(vap[i]))) * (0.17 + 0.83 * dd['sunfr']);
	dd['ev1'] = c1 * dd['delta'];
	if(!is_numeric(rad[i]))
	{
	 dd['inv'] = 1.00011 - (0.03258*dd['csd'])-(0.00755*dd['snd'] )+(0.00064*dd['cs2d'])+(0.00034*dd['sn2d']);
	 dd['rad'] = (0.16+(0.62*(((sun[i])/dd['hrday']))))*c2*dd['inv']*((dd['csl']*dd['csdecl']*dd['snhass']) + (dd['snl']*dd['sndecl']*dd['hass']));
	}
	else
	{
		if (rad[1] === "J/cm2") {
			dd['rad'] = rad[i]/100; 
		} else {
		dd['rad'] = rad[i];
		}
	}

	dd['ea_grass'] = 0.2625 * ((6.1078 * exp((17.269 * dd['avtemp'])/(237.3 + dd['avtemp'])
	-(dd['vap'])*(d1g +(windrun[i]* 0.0062137)))));

	if (dd['ea_grass'] < 0 )
	{
		dd['ea_grass'] = 0;
	}
	dd['hj_g'] = d0g * (1000000 * dd['rad']) - dd['fnt2'];
	dd['evapg'] = ( (dd['hj_g'] * dd['ev1']) + (0.66 * dd['ea_grass'] )) / (dd['delta'] + 0.66);
	dd['hmm'] = (dd['hj_g'] * dd['ev1'])/ 0.66;

	dd['ea_water']= 0.2625 * ((6.1078 * exp((17.269 * dd['avtemp'])/(237.3 + dd['avtemp'])) - (dd['vap'])*(d1w + (windrun[i] * 0.0062137))));
	if (dd['ea_water'] < 0 ) {
		dd['ea_water'] = 0;
	}
	dd['hj_w'] = d0w * (1000000 * dd['rad']) - dd['fnt2'];
	dd['evapw'] = ((dd['hj_w'] * dd['ev1']) + (0.66 * dd['ea_water'] )) / (dd['delta'] +0.66);


	return dd;
}
