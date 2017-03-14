<?php


$field_metadata = array(

    'day'           =>  array(
            'index_position'    =>  "1",
            'description'       =>  "Date",
            'units'             =>  "",
            'field_type'        =>  FT_DATE,
            'data_type'         =>  DT_DATE,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "01/01/1990",
            'maximum'           =>  "Current Date",
            'item_list'         =>  array()
    ),

    'rain'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Daily total rainfall",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "64.4",
            'item_list'         =>  array()
    ),

    'sunhours'      =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Daily hours of sun",
            'units'             =>  "hours",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.0",
            'maximum'           =>  "15.6",
            'item_list'         =>  array()
    ),

    't_max'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Daily maximum air temperature",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-4.6",
            'maximum'           =>  "35.6",
            'item_list'         =>  array()
    ),

    't_min'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Daily mimimum air temperature",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-12.2",
            'maximum'           =>  "19.9",
            'item_list'         =>  array()
    ),

    'wdir'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Wind direction at 09:00 GMT (0-360 degrees)",
            'units'             =>  "degrees",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0",
            'maximum'           =>  "360",
            'item_list'         =>  array()
    ),

    'windrun'       =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Daily amount of wind",
            'units'             =>  "km",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0",
            'maximum'           =>  "767",
            'item_list'         =>  array()
    )
);


?>


