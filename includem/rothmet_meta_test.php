<?php


$field_metadata = array(

    'atmometer'     =>  array(
            'index_position'    =>  "0",
            'description'       =>  " ",
            'units'             =>  "g",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.0",
            'maximum'           =>  "584.0",
            'item_list'         =>  array()
    ),

    'bar'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Barometric pressure, 1915-59; 1977-2003",
            'units'             =>  "mb",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "1115.7",
            'item_list'         =>  array()
    ),

    'bar_msl'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Air pressure at Mean Sea Level, 1950-77",
            'units'             =>  "mb",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "956.652",
            'maximum'           =>  "1332.201",
            'item_list'         =>  array()
    ),

    'cloud'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Cloud cover (in Oktas with 9=Fog) at 0900 GMT, 1915-2007",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                                    "10", "11")
    ),

    'day'           =>  array(
            'index_position'    =>  "1",
            'description'       =>  "Date (specify day, month and year) *",
            'units'             =>  "",
            'field_type'        =>  FT_DATE,
            'data_type'         =>  DT_DATE,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "05/02/1853",
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
            'maximum'           =>  "2",
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
            'maximum'           =>  "-2",
            'item_list'         =>  array()
    ),

    'dewp'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Dew point 1915-current date (derived from DRYB & WETB until 2013, derived from DRYB & RELH since 2014) *",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-14.0",
            'maximum'           =>  "23.0",
            'item_list'         =>  array()
    ),

    'diary'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary midnight to midnight",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "abR",
            'maximum'           =>  "zs",
            'item_list'         =>  array()
    ),

    'diary1'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary midnight to 0900 GMT coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "aRo",
            'maximum'           =>  "zo",
            'item_list'         =>  array()
    ),

    'diary1_'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary midnight to 0900 GMT coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "b",
            'maximum'           =>  "xwmc",
            'item_list'         =>  array()
    ),

    'diary2'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary 0900 GMT to midnight coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "aod",
            'maximum'           =>  "zocb",
            'item_list'         =>  array()
    ),

    'diary2_'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary 0900 GMT to midnight coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0315-0930 c, cpr 1720-1745 c.",
            'maximum'           =>  "xss - mid afternoon, xb rest of day and night.",
            'item_list'         =>  array()
    ),

    'diary_'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary 0900 to 0900 GMT coded in Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "b at first becoming c late morning and rest of day, crr late afternoon and night.",
            'maximum'           =>  "xw early, bright periods morning, c afternoon, cpr late afternoon, c at night.",
            'item_list'         =>  array()
    ),

    'dr20'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Drainage from drain gauge at 20 inch (51cm) depth, 1870-current date",
            'units'             =>  "inches",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.00",
            'maximum'           =>  "66.50",
            'item_list'         =>  array()
    ),

    'dr20_info'     =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace in 20 inch drain gauge  (X = less than 0.05mm rain or snow, XX = less than 0.05mm mist/dew/fog)",
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

    'dr40'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Drainage from drain gauge at 40 inch (102cm) depth, 1870-current date",
            'units'             =>  "inches",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.00",
            'maximum'           =>  "66.95",
            'item_list'         =>  array()
    ),

    'dr40_info'     =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace in 40 inch drain gauge (X = less than 0.05mm rain or snow, XX = less than 0.05mm mist/dew/fog)",
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

    'dr60'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Drainage from drain gauge at 60 inch (152cm) depth, 1870-current date",
            'units'             =>  "inches",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.00",
            'maximum'           =>  "69.01",
            'item_list'         =>  array()
    ),

    'dr60_info'     =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace in 60 inch drain gauge (X = less than 0.05mm rain or snow, XX = less than 0.05mm mist/dew/fog)",
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

    'dryb'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Dry bulb temperature, 1915-current date *",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-13.1",
            'maximum'           =>  "28.9",
            'item_list'         =>  array()
    ),

    'dygale'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating day with gales, 1968-2007",
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
            'description'       =>  "Code indicating type of hail, 1060-88; 1998-2007",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5", "6")
    ),

    'dysnow'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating day with snow or sleet, 1960-88; 1998-2007",
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
            'description'       =>  "Code indicating day with thunder, 1960-88; 1998-2007",
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
            'description'       =>  "Soil temperature under grass at 30cm, 1915-57; 1997-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-0.7",
            'maximum'           =>  "21.9",
            'item_list'         =>  array()
    ),

    'e50t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 50cm, 1948-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-15.4",
            'maximum'           =>  "20.1",
            'item_list'         =>  array()
    ),

    'e100t'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 100cm, 1945-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "2.4",
            'maximum'           =>  "17.6",
            'item_list'         =>  array()
    ),

    'evap'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Evaporation",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "-26.17",
            'maximum'           =>  "65.48",
            'item_list'         =>  array()
    ),

    'evap1'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Evaporation (1st reading)",
            'units'             =>  "in",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.00",
            'maximum'           =>  "3.71",
            'item_list'         =>  array()
    ),

    'evap2'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Evaporation (2nd reading)",
            'units'             =>  "in",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.00",
            'maximum'           =>  "3.67",
            'item_list'         =>  array()
    ),

    'evapg'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Evaporation over grass",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.00",
            'maximum'           =>  "5.80",
            'item_list'         =>  array()
    ),

    'evapw'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Evaporation over water",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.00",
            'maximum'           =>  "8.10",
            'item_list'         =>  array()
    ),

    'fog'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating day with fog at 0900 GMT, 1960-78",
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
            'description'       =>  "Depth of freshly-fallen snow at 0900 GMT, 1960-78",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0",
            'maximum'           =>  "254",
            'item_list'         =>  array()
    ),

    'g10t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 10cm, 1931-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-2.6",
            'maximum'           =>  "22.1",
            'item_list'         =>  array()
    ),

    'g20t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 20cm, 1931-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-0.7",
            'maximum'           =>  "20.8",
            'item_list'         =>  array()
    ),

    'g30t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 30cm, 1931-97",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "24.3",
            'item_list'         =>  array()
    ),

    'ground'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating state of ground, 1931-2009",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NATURAL,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "0", "0A", "0B", "0C", "1", "1A", "1B", "2", "2A", 
                                    "3", "4", "4A", "4B", "5", "6", "7", "8", "9", "10", "11", 
                                    "12", "20", "30", "31", "32", "40", "50", "60", "70", "71", 
                                    "72", "73", "90", "93", "?A")
    ),

    'grsmin'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Grass minimum temperature, 1909-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-18.8",
            'maximum'           =>  "25.6",
            'item_list'         =>  array()
    ),

    'present'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather summary at time of reading, code using Beaufort letters",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "ano",
            'maximum'           =>  "zwc",
            'item_list'         =>  array()
    ),

    'rad'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Total radiation, 1931-current date *",
            'units'             =>  "J/cm2",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "3808.0",
            'item_list'         =>  array()
    ),

    'rain'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall from original 5 inch gauge, 1853-1879; 1914-current date *",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "85.0",
            'item_list'         =>  array()
    ),

    'rain5'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall from second 5 inch gauge, 1873-1987",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.00",
            'maximum'           =>  "82.25",
            'item_list'         =>  array()
    ),

    'rain5b'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from 5 inch (banked) gauge",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.0",
            'maximum'           =>  "24.9",
            'item_list'         =>  array()
    ),

    'rain5b_info'   =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace rainfall in 8 inch gauge",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "X",
            'maximum'           =>  "X",
            'item_list'         =>  array()
    ),

    'rain5t'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from 5 inch (Turfed Wall) gauge",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.0",
            'maximum'           =>  "59.4",
            'item_list'         =>  array()
    ),

    'rain5t_info'   =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace rainfall in 5 inch (Turfed Wall) gauge",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "X",
            'maximum'           =>  "X",
            'item_list'         =>  array()
    ),

    'rain5_info'    =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace rainfall in 5 inch gauge (X = less than 0.05mm rain or snow, XX = less than 0.05mm mist/dew/fog)",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "X",
            'maximum'           =>  "X",
            'item_list'         =>  array()
    ),

    'rain8'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from 8 inch gauge",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.00",
            'maximum'           =>  "82.25",
            'item_list'         =>  array()
    ),

    'rain8_info'    =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace rainfall in 8 inch gauge",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "X",
            'maximum'           =>  "X",
            'item_list'         =>  array()
    ),

    'rainl'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall in the 1/1000th acre rain gauge, 1853-current date",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.00",
            'maximum'           =>  "82.25",
            'item_list'         =>  array()
    ),

    'rainl_info'    =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace rainfall in the 1/1000th acre rain gauge (X = less than 0.05mm rain or snow, XX = less than 0.05mm mist/dew/fog)",
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

    'rainl_old'     =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from \'old large\' 1/1000 acre rain gauge",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.00",
            'maximum'           =>  "41.09",
            'item_list'         =>  array()
    ),

    'rainl_totin'   =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from \'old\' large rain gauge",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.0003",
            'maximum'           =>  "1.3775",
            'item_list'         =>  array()
    ),

    'rains'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from old small rain gauge all day - in inches",
            'units'             =>  "in",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.0",
            'maximum'           =>  "47.2",
            'item_list'         =>  array()
    ),

    'rains_am'      =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from old small rain gauge at 9am",
            'units'             =>  "in",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.0000",
            'maximum'           =>  "1.8600",
            'item_list'         =>  array()
    ),

    'rains_pm'      =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from old small rain gauge at 4:30pm - in inches",
            'units'             =>  "in",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.00200",
            'maximum'           =>  "1.21000",
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
            'description'       =>  "Trace rainfall in original gauge (X = less than 0.05mm rain or snow, XX = less than 0.05mm mist/dew/fog)",
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

    'rain_s'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from \'Mr Stowes small gauge S\'",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.13",
            'maximum'           =>  "17.91",
            'item_list'         =>  array()
    ),

    'rain_sd'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall measurement from \'Mr Stowes small gauge SD\'",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.13",
            'maximum'           =>  "17.91",
            'item_list'         =>  array()
    ),

    'rdur'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Rainfall duration, 1931-current date ",
            'units'             =>  "hr",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.00",
            'maximum'           =>  "24.00",
            'item_list'         =>  array()
    ),

    'relh'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Relative humidity at 0900 GMT 1925-current date (derived from DRYB & WETB until 2013) *",
            'units'             =>  "%",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "18",
            'maximum'           =>  "100",
            'item_list'         =>  array()
    ),

    'remarks'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Weather diary (in English!)",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "\"Old Large\" not thawed until 29th when it was entered for the previous day.",
            'maximum'           =>  "z, warm, tl, 3pm, (1/4 hour)",
            'item_list'         =>  array()
    ),

    'remarks_pm'    =>  array(
            'index_position'    =>  "0",
            'description'       =>  "General weather diary notes at 1630GMT",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "A little rain.",
            'maximum'           =>  "Windy.",
            'item_list'         =>  array()
    ),

    's10t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Bare soil temperature at 10cm, 1931-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-5.9",
            'maximum'           =>  "24.3",
            'item_list'         =>  array()
    ),

    's20t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Bare soil temperature at 20cm, 1931-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-3.2",
            'maximum'           =>  "24.0",
            'item_list'         =>  array()
    ),

    's30t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Bare soil temperature at 30cm, 1931-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-3.2",
            'maximum'           =>  "25.2",
            'item_list'         =>  array()
    ),

    'snowd'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Total depth of snow, 1960-2007",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "381.0",
            'item_list'         =>  array()
    ),

    'snowl'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Code indicating whether snow lying, 1960-78",
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

    'snow_info'     =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Trace of snow 0900 to 0900 GMT",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_SINGLE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "X",
            'maximum'           =>  "X",
            'item_list'         =>  array()
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
            'index_position'    =>  "0",
            'description'       =>  "Hours of sunshine, 1890-current date *",
            'units'             =>  "hr",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "15.9",
            'item_list'         =>  array()
    ),

    'sunmax'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Maximum temperature in sun (black bulb in vacuo)",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0.0",
            'maximum'           =>  "86.0",
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
            'minimum'           =>  "3.3",
            'maximum'           =>  "28.9",
            'item_list'         =>  array()
    ),

    'tmax'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Maximum temperature, 1878-current date *",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-8.1",
            'maximum'           =>  "35.6",
            'item_list'         =>  array()
    ),

    'tmax2'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Secondary max temp reading (Rivers Lodge)",
            'units'             =>  "degC",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "-3.3",
            'maximum'           =>  "32.2",
            'item_list'         =>  array()
    ),

    'tmin'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Minimum temperature, 1878-current date *",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-17.0",
            'maximum'           =>  "20.1",
            'item_list'         =>  array()
    ),

    'vap'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Vapour pressure 1946-current date (derived from DRYB & WETB until 2013, derived from DRYB & RELH since 2014) *",
            'units'             =>  "mb",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "2.0",
            'maximum'           =>  "85.3",
            'item_list'         =>  array()
    ),

    'vis'           =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Visibility at 0900 GMT (code), 1923-2007",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                                    "A", "B", "C", "D", "E", "G", "H", "I", "L", "X")
    ),

    'wdir'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind direction at 0900 GMT (0-360 degrees), 1853-current date",
            'units'             =>  "degrees",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NATURAL,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "0", "000", "027", "045", "072", "090", "10", "20", 
                                    "30", "40", "50", "60", "70", "80", "90", "100", "110", "117", 
                                    "120", "130", "135", "140", "150", "160", "162", "170", "180", 
                                    "190", "200", "207", "210", "220", "225", "230", "240", "250", 
                                    "252", "260", "270", "280", "290", "297", "300", "310", "315", 
                                    "320", "330", "340", "342", "350", "360") 
                              
    ),

    'wdir1'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind direction at 0900 GMT",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_VALUE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "0",
            'maximum'           =>  "99",
            'item_list'         =>  array()
    ),

    'wdir_pm'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind direction at 1630 GMT",
            'units'             =>  "degrees",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_TEXT,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("", "000", "027", "045", "090", "135", "180", "225", 
                                    "270", "297", "315")
    ),

    'weather'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Present weather code at 0900 GMT",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_EXPERT,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "1", "2", "3", "4", "5", "10", "11", "12", "17", 
                                    "20", "21", "22", "23", "25", "26", "27", "28", "29", "35", 
                                    "36", "41", "42", "43", "44", "45", "46", "47", "49", "50", 
                                    "51", "52", "53", "54", "55", "58", "59", "60", "61", "62", 
                                    "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", 
                                    "73", "75", "77", "79", "80", "81", "83", "84", "85", "86", 
                                    "87", "88", "91", "92", "95", "97")
    ),

    'wetb'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wet bulb temperature, 1915-January 2014 *",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-13.1",
            'maximum'           =>  "36.8",
            'item_list'         =>  array()
    ),

    'wforce'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind force in Beaufort scale (0-12) at 0900 GMT, 1915-59",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9")
    ),

    'windrun'       =>  array(
            'index_position'    =>  "0", 
            'description'       =>  "Run of Wind 0900 to 0900 GMT (at 2m, see notes), 1946-current date *",
            'units'             =>  "km",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0",
            'maximum'           =>  "1046",
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
            'minimum'           =>  "2",
            'maximum'           =>  "16093",
            'item_list'         =>  array()
    ),

    'windsp'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind speed at 0900 GMT (at 10m), 1960-current date",
            'units'             =>  "m/s",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "30.9",
            'item_list'         =>  array()
    )
);


?>


