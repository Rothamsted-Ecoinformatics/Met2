<?php


$field_metadata = array(

    'day'           =>  array(
            'index_position'    =>  "1",
            'description'       =>  "Date (specify day, month and year)",
            'units'             =>  "",
            'field_type'        =>  FT_DATE,
            'data_type'         =>  DT_DATE,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "01/09/1982",
            'maximum'           =>  "Current Date",
            'item_list'         =>  array()
    ),

    'dryb'          =>  array(
            'index_position'    =>  "4",
            'description'       =>  "Dry bulb Temperature, 1982-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-8.9",
            'maximum'           =>  "30.0",
            'item_list'         =>  array()
    ),

    'g30t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 30cm, 2012-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "10.2",
            'maximum'           =>  "16.6",
            'item_list'         =>  array()
    ),

    'g50t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 50cm, 2012-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "10.1",
            'maximum'           =>  "16.5",
            'item_list'         =>  array()
    ),

    'g100t'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Soil temperature under grass at 100cm, 2012-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "10.0",
            'maximum'           =>  "14.4",
            'item_list'         =>  array()
    ),

    'ground'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "State of ground (code), 1982-96",
            'units'             =>  "",
            'field_type'        =>  FT_CODE,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                                    "10", "20", "30", "40", "50", "60", "90", "100", "110", "120", 
                                    "130", "150", "160", "170")
    ),

    'grsmin'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Grass minimum temperature, 1982-current date ",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-16.4",
            'maximum'           =>  "19.1",
            'item_list'         =>  array()
    ),

    'netrad'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Net radiation, 1997-current date",
            'units'             =>  "MJ/m2",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-4.40",
            'maximum'           =>  "16.59",
            'item_list'         =>  array()
    ),

    'rad'           =>  array(
            'index_position'    =>  "5",
            'description'       =>  "Total radiation, 1982-current date",
            'units'             =>  "MJ/m2",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "31.6",
            'item_list'         =>  array()
    ),

    'rain'          =>  array(
            'index_position'    =>  "6",
            'description'       =>  "Rainfall, 1982-current date",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "64.9",
            'item_list'         =>  array()
    ),

    'relh'          =>  array(
            'index_position'    =>  "9",
            'description'       =>  "Relative humidity at 0900 GMT, 2009-current date",
            'units'             =>  "%",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "42",
            'maximum'           =>  "100",
            'item_list'         =>  array()
    ),

    's10t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Bare soil temperature at 10cm, 2012-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "10.3",
            'maximum'           =>  "18.1",
            'item_list'         =>  array()
    ),

    's20t'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Bare soil temperature at 20cm, 1982-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-2.0",
            'maximum'           =>  "23.4",
            'item_list'         =>  array()
    ),

    'sun'           =>  array(
            'index_position'    =>  "7",
            'description'       =>  "Hours of sunshine, 1982-current date",
            'units'             =>  "hr",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "15.2",
            'item_list'         =>  array()
    ),

    'tmax'          =>  array(
            'index_position'    =>  "2",
            'description'       =>  "Maximum temperature, 1982-current date ",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-5.9",
            'maximum'           =>  "35.0",
            'item_list'         =>  array()
    ),

    'tmin'          =>  array(
            'index_position'    =>  "3",
            'description'       =>  "Minimum temperature, 1982-current date",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-11.3",
            'maximum'           =>  "20.1",
            'item_list'         =>  array()
    ),



    'wdir'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind direction at 9.00 GMT (0-360 degrees), 2012-current date",
            'units'             =>  "degrees",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array(NULL, "69", "72", "88", "90", "201", "260", "281", "283", 
                                    "298")
    ),

    'wetb'          =>  array(
            'index_position'    =>  "10",
            'description'       =>  "Wet bulb temperature, 1982 - 2009",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-9.0",
            'maximum'           =>  "22.2",
            'item_list'         =>  array()
    ),

    'windrun'       =>  array(
            'index_position'    =>  "8",
            'description'       =>  "Run of Wind 0900 to 0900 GMT, 1982-current date",
            'units'             =>  "km",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0",
            'maximum'           =>  "785",
            'item_list'         =>  array()
    ),

    'windsp'        =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind speed at 0900 GMT (at 10m), 2012-current date",
            'units'             =>  "m/s",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.7",
            'maximum'           =>  "12.9",
            'item_list'         =>  array()
    )
);


?>


