<?php


$field_metadata = array(

    'bar'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Barometric pressure, 1928-70; 1988-99",
            'units'             =>  "mb",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "1080.0",
            'item_list'         =>  array()
    ),

    'bar_msl'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Air pressure at mean sea level, 1928-67",
            'units'             =>  "mb",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "963.5",
            'maximum'           =>  "1092.2",
            'item_list'         =>  array()
    ),

    'cloud'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Cloud cover (in Oktas with 9=Fog) at 0900 GMT, 1928-99",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                                    "10", "41")
    ),

    'day'           =>  array(
            'index_position'    =>  "1",
            'description'       =>  "Date (specify day, month and year)",
            'units'             =>  "",
            'field_type'        =>  FT_DATE,
            'data_type'         =>  DT_DATE,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "01/10/1928",
            'maximum'           =>  "Current Date",
            'item_list'         =>  array()
    ),

    'dda'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Derived day degrees above 42 deg F",
            'units'             =>  "degC",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "-18",
            'maximum'           =>  "61",
            'item_list'         =>  array()
    ),

    'ddb'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Derived day degrees below 42 deg F",
            'units'             =>  "degC",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "-18",
            'maximum'           =>  "11",
            'item_list'         =>  array()
    ),

    'dewp'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Dew point (derived from DRYB and WETB), 1968-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "-19.0",
            'maximum'           =>  "25.9",
            'item_list'         =>  array()
    ),

    'diary1'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary midnight - 9 GMT coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "(bc & bcx)",
            'maximum'           =>  "xf,bcw",
            'item_list'         =>  array()
    ),

    'diary1_'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary, midnight to 0900 GMT (coded)",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "b",
            'maximum'           =>  "xwb.",
            'item_list'         =>  array()
    ),

    'diary2'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary 0900 GMT - midnight - coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "(m).bc(w)bc(d)(w)",
            'maximum'           =>  "wbc,o,od",
            'item_list'         =>  array()
    ),

    'diary2_'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary, 0900GMT to midnight coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "- or0r-1600hrs, c.",
            'maximum'           =>  "xoss.",
            'item_list'         =>  array()
    ),

    'diary_'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary 0900 GMT - 0900 GMT - coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "b at first, bc late morning, c afternoon and night.",
            'maximum'           =>  "xw early, mostly b till early afternoon, c rest of day becoming bc at night.",
            'item_list'         =>  array()
    ),

    'dryb'          =>  array(
            'index_position'    =>  "7",
            'description'       =>  "Dry bulb temperature, 1928-current date ",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-16.3",
            'maximum'           =>  "32.1",
            'item_list'         =>  array()
    ),

    'dygale'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating day with gales, 1968-87",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1")
    ),

    'dyhail'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating type of hail, 1968-87; 1997-99",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5")
    ),

    'dysnow'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating day with snow or sleet, 1968-87; 1997-99",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "5")
    ),

    'dythun'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating day with thunder, 1968-87; 1997-99",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1")
    ),

    'dy_air_frost'  =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating Day of Air Frost",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "1",
            'maximum'           =>  "1",
            'item_list'         =>  array()
    ),

    'dy_gnd_frost'  =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating Day of Ground Frost",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "1",
            'maximum'           =>  "1",
            'item_list'         =>  array()
    ),

    'e30t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature at 30cm under grass, 1928-70; 1988-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-1.7",
            'maximum'           =>  "24.2",
            'item_list'         =>  array()
    ),

    'e50t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature at 50cm under grass, 1971-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "1.6",
            'maximum'           =>  "20.2",
            'item_list'         =>  array()
    ),

    'e60t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature at 60cm under grass, 1968-70",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "2.4",
            'maximum'           =>  "17.3",
            'item_list'         =>  array()
    ),

    'e100t'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature at 100cm under grass, 1928-67; 1971-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "3.2",
            'maximum'           =>  "19.7",
            'item_list'         =>  array()
    ),

    'e122t'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil Temperature at 122cm under grass, 1968-70",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "4.9",
            'maximum'           =>  "15.1",
            'item_list'         =>  array()
    ),

    'fog'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating fog at 0900 GMT, 1968-78",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1")
    ),

    'fsnowd'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Depth of freshly-fallen snow at 0900 GMT, 1968-78",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "10", "20", "25", "30", "40", "51", "60", 
                                    "70", "76", "100", "127", "152", "203")
    ),

    'g30t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature at 30cm under grass, 1971-87",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.9",
            'maximum'           =>  "21.4",
            'item_list'         =>  array()
    ),

    'ground'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating state of ground at 0900 GMT",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NATURAL,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "0", "0A", "0B", "0C", "1", "1A", "1B", "2", "3", 
                                    "4", "4A", "4B", "5", "6", "7", "8", "9", "10", "11", "12", 
                                    "13", "17", "20", "30", "31", "32", "40", "50", "60", "70", 
                                    "71", "72", "73", "87", "90")
    ),

    'grsmin'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Grass minimum temperature, 1929-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-25.0",
            'maximum'           =>  "27.2",
            'item_list'         =>  array()
    ),

    'present'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather summary coded in Beaufort letters at 0900 GMT, 1928-67",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "(cs)", "(f.x)", "(fw)", "b", "b & some fog", 
                                    "b (r)", "b (snow lying)", "b(dew)", "b(f)", "b(f.x.)", 
                                    "b(fog)", "b(w)", "b(w)f", "b(w)hazy", "b(x)", "b(xf)", 
                                    "b,snow lying", "b.f.(w)", "bc", "bc(d)", "bc(dew)", "bc(Fo)", 
                                    "bc(fx)", "bc(m)ground m", "bc(q)", "bc(r)", "bc(s)", "bc(w)", 
                                    "bc(wo)", "bc(x)", "bc(xf)", "bc,x", "bc. gale", "bc:f", "bcw", 
                                    "bcw,bcw", "bcwf", "bcx", "bf(w)", "bw", "bx", "bx(x)", "c", 
                                    "c & b(w)", "c (glazed frost", "c o to o", "c snow lying", 
                                    "c&fd", "c(d)", "c(dew)", "c(f)", "c(f)(x)", "c(f.w)", 
                                    "c(f.x)", "c(fo)", "c(fog)", "c(fw)", "c(fx)", "c(gale)", 
                                    "c(glazed frost)", "c(m)", "c(r & h)", "c(r)", "c(rs)", "c(s)", 
                                    "c(s)(x)", "c(s)o", "c(snow)", "c(so)", "c(t)", "c(w)", "c(x)", 
                                    "c(xf)", "c(xo)", "c,gale", "c:fx", "cd", "cd & o(f)", "cf", 
                                    "cfx", "cr", "cw", "cx", "cxf", "d(f)", "f", "f(w)", "f(x)", 
                                    "f.x.", "f:d", "f:o(x)", "fc", "fd", "fe", "fe(x)", "fo", 
                                    "fo x", "fo(d)", "fog", "fog (dew)", "fog (slight)", "fog w", 
                                    "fog(e & w)", "fog(r)", "fog(r0)", "fog(w)", "fog(x)", "fs", 
                                    "fw", "fx", "fx:d", "gale(v)", "light fog", "low hazy cloud", 
                                    "mist", "mist c(w)", "mist(w)", "o", "o (f & d)", 
                                    "o (snow lying)", "o(*)", "o(d)", "o(d).f", "o(d)f", "o(d)o", 
                                    "o(dew)", "o(df)", "o(do)", "o(ds)", "o(f & w)", "o(f & x)", 
                                    "o(f)", "o(f)(r)", "o(f)(x)", "o(f):s", "o(f)x", "o(f,d)", 
                                    "o(f,w)", "o(f.d)", "o(f.w)", "o(f.x)", "o(fd)", "o(fe)", 
                                    "O(fo)", "o(fog)", "o(fr)", "o(fs)", "o(fw)", "o(fx)", 
                                    "o(gale)", "o(h)", "o(m)", "o(m,w)", "o(m.x)", "o(mist)", 
                                    "o(pr)", "o(r & s)", "o(r)", "o(r) gale", "o(r)(f)", 
                                    "o(r)(gale)", "o(r).f", "o(r)f", "o(r.f)", "o(rf)", "o(ro)", 
                                    "o(rs)", "o(rtl)", "o(s & f)", "o(s)", "o(s)(f)", "o(s),f", 
                                    "o(s).x", "o(s):f", "o(s)f", "o(snow)", "o(w)", "o(w) mist", 
                                    "o(w)f", "o(w.f)", "o(wf)", "o(wo)", "o(x & w)", "o(x)", 
                                    "o(x,s)", "o,f", "oc", "oc(w)", "od", "of", "ofs", "ofw", "or", 
                                    "ors", "os", "ow", "ox", "scotch mist", "slight fog(x)", 
                                    "slight mist (d)", "wbc", "wet fog", "wf", "x.fog")
    ),

    'rad'           =>  array(
            'index_position'    =>  "9",
            'description'       =>  "Total radiation, 1981-current date",
            'units'             =>  "MJ/m2",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "32.0",
            'item_list'         =>  array()
    ),

    'rain'          =>  array(
            'index_position'    =>  "4",
            'description'       =>  "Rainfall, 1928-current date ",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "85.8",
            'item_list'         =>  array()
    ),

    'rain_amt02'    =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rain amount (?) 0.2mm or more",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "1",
            'maximum'           =>  "1",
            'item_list'         =>  array()
    ),

    'rain_amt10'    =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rain amount (?) 1.0mm or more",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "1",
            'maximum'           =>  "1",
            'item_list'         =>  array()
    ),

    'rain_amt50'    =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rain amount (?) 5.0mm or more",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "1",
            'maximum'           =>  "1",
            'item_list'         =>  array()
    ),

    'rain_info'     =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace amounts of rainfall (x = less than 0.05mm rain or snow, xx = less than 0.05mm mist/dew/fog)",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "X", "XX")
    ),

    'rdur'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall duration, 1988-99",
            'units'             =>  "hr",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "21.0",
            'item_list'         =>  array()
    ),

    'relh'          =>  array(
            'index_position'    =>  "10",
            'description'       =>  "Relative Humidity, 1928-70; 2009-current date",
            'units'             =>  "%",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "24",
            'maximum'           =>  "110",
            'item_list'         =>  array()
    ),

    'remarks'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "General remarks using text, Beaufort letters and symbols",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "(4:1)",
            'maximum'           =>  "Windy.Broken cloud with sleet showers.Hail showers at 1600.Cloudy.",
            'item_list'         =>  array()
    ),

    's10t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Bare soil temperature at 10cm depth, 1968-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-2.8",
            'maximum'           =>  "24.2",
            'item_list'         =>  array()
    ),

    's20t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Bare soil temperature at 20cm depth, 1968-current depth",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-0.3",
            'maximum'           =>  "24.0",
            'item_list'         =>  array()
    ),

    'snowd'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Total depth of snow, 1968-99",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "406.0",
            'item_list'         =>  array()
    ),

    'snowl'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating whether snow lying, 1968-78",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1")
    ),

    'soilmin'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Minimum temperature on bare soil",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_NONE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  NULL,
            'maximum'           =>  NULL,
            'item_list'         =>  array()
    ),

    'sun'           =>  array(
            'index_position'    =>  "5",
            'description'       =>  "Hours sunshine, 1928-current date ",
            'units'             =>  "hr",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "15.6",
            'item_list'         =>  array()
    ),

    'therm'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Attached thermometer reading",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "-14.7",
            'maximum'           =>  "29.7",
            'item_list'         =>  array()
    ),

    'tmax'          =>  array(
            'index_position'    =>  "2",
            'description'       =>  "Maximum temperature, 1928-current date ",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-6.2",
            'maximum'           =>  "35.0",
            'item_list'         =>  array()
    ),

    'tmin'          =>  array(
            'index_position'    =>  "3",
            'description'       =>  "Minimum temperature, 1928-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-20.0",
            'maximum'           =>  "20.4",
            'item_list'         =>  array()
    ),

    'vap'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Vapour pressure (derived from DRYB and WETB), 1928-78; 1988-current date",
            'units'             =>  "mb",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "1.4",
            'maximum'           =>  "97.0",
            'item_list'         =>  array()
    ),

    'vis'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Visibility at 0900 GMT (code), 1928-99",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "0", "1", "2", "3", "4", "5", "6", "7", "8", "A", 
                                    "B", "C", "D", "E", "G", "X")
    ),

    'wdir'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind direction at 0900 GMT (0-360 degrees), 1928-current date",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NATURAL,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "0", "000", "010", "020", "027", "040", "045", "050", 
                                    "070", "072", "090", "1", "2", "3", "4", "5", "6", "7", "8", 
                                    "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", 
                                    "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", 
                                    "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", 
                                    "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", 
                                    "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", 
                                    "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", 
                                    "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", 
                                    "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", 
                                    "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", 
                                    "99", "100", "101", "102", "103", "104", "105", "106", "107", 
                                    "108", "109", "110", "111", "112", "113", "114", "115", "116", 
                                    "117", "118", "119", "120", "121", "122", "123", "124", "125", 
                                    "126", "127", "128", "129", "130", "131", "132", "133", "134", 
                                    "135", "136", "137", "138", "139", "140", "141", "142", "143", 
                                    "144", "145", "146", "147", "148", "149", "150", "151", "152", 
                                    "153", "154", "155", "156", "157", "158", "159", "160", "161", 
                                    "162", "163", "164", "165", "166", "167", "168", "169", "170", 
                                    "171", "172", "173", "174", "175", "176", "177", "178", "179", 
                                    "180", "181", "182", "183", "184", "185", "186", "187", "188", 
                                    "189", "190", "191", "192", "193", "194", "195", "196", "197", 
                                    "198", "199", "200", "201", "202", "203", "204", "205", "206", 
                                    "207", "208", "209", "210", "211", "212", "213", "214", "215", 
                                    "216", "217", "218", "219", "220", "221", "222", "223", "224", 
                                    "225", "226", "227", "228", "229", "230", "231", "232", "233", 
                                    "234", "235", "236", "237", "238", "239", "240", "241", "242", 
                                    "243", "244", "245", "246", "247", "248", "249", "250", "251", 
                                    "252", "253", "254", "255", "256", "257", "258", "259", "260", 
                                    "261", "262", "263", "264", "265", "266", "267", "268", "269", 
                                    "270", "271", "272", "273", "274", "275", "276", "277", "278", 
                                    "279", "280", "281", "282", "283", "284", "285", "286", "287", 
                                    "288", "289", "290", "291", "292", "293", "294", "295", "296", 
                                    "297", "298", "299", "300", "301", "302", "303", "304", "305", 
                                    "306", "307", "308", "309", "310", "311", "312", "313", "314", 
                                    "315", "316", "317", "318", "319", "320", "321", "322", "323", 
                                    "324", "325", "326", "327", "328", "329", "330", "331", "332", 
                                    "333", "334", "335", "336", "337", "338", "339", "340", "341", 
                                    "342", "343", "344", "345", "346", "347", "348", "349", "350", 
                                    "351", "352", "353", "354", "355", "356", "357", "358", "359", 
                                    "360", "sw", "w", "WNE", "WnW")
    ),

    'weather'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Present weather code at 0900 GMT, 1928-67",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5", "10", "11", "12", 
                                    "13", "20", "21", "25", "26", "28", "29", "40", "41", "42", 
                                    "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", 
                                    "53", "54", "55", "56", "58", "60", "61", "62", "63", "64", 
                                    "65", "66", "68", "69", "70", "71", "72", "73", "75", "76", 
                                    "77", "80", "81", "83", "84", "85", "86", "87", "91", "92", 
                                    "95", "97")
    ),

    'wetb'          =>  array(
            'index_position'    =>  "8",
            'description'       =>  "Wet bulb temperature, 1928-2009",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-16.7",
            'maximum'           =>  "25.9",
            'item_list'         =>  array()
    ),

    'wforce'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind force in Beaufort scale (0-12) at 0900 GMT, 1928-67",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                                    "87")
    ),

    'windrun'       =>  array(
            'index_position'    =>  "6",
            'description'       =>  "Run of wind 0900 to 0900 GMT (at 2m), 1968-current date",
            'units'             =>  "km",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0",
            'maximum'           =>  "1070",
            'item_list'         =>  array()
    ),

    'windrun_acc'   =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Accumulated Run of Wind",
            'units'             =>  "km",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "33",
            'maximum'           =>  "9993",
            'item_list'         =>  array()
    ),

    'windsp'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind speed at 0900 GMT (at 10m), 1968-current date",
            'units'             =>  "m/s",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "19.0",
            'item_list'         =>  array()
    )
);


?>


