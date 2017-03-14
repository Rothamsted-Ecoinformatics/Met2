<?php


$field_metadata = array(

    'month'         =>  array(
            'index_position'    =>  "2",
            'description'       =>  "Month",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_LIST,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "",
            'maximum'           =>  "",
            'item_list'         =>  array("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", 
                                    "12")
    ),

    'rain'          =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Total monthly rainfall",
            'units'             =>  "mm",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "0.9",
            'maximum'           =>  "198.7",
            'item_list'         =>  array()
    ),

    'sunhours'      =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Total monthly hours of sun",
            'units'             =>  "hours",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "12.3",
            'maximum'           =>  "314.9",
            'item_list'         =>  array()
    ),

    't_max'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Mean maximum monthly air temperature",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-0.90",
            'maximum'           =>  "26.15",
            'item_list'         =>  array()
    ),

    't_min'         =>  array(
            'index_position'    =>  "0",
            'description'       =>  "Mean mimimum monthly air temperature",
            'units'             =>  "degrees C",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_DECIMAL,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "-6.34",
            'maximum'           =>  "14.54",
            'item_list'         =>  array()
    ),

    'year'          =>  array(
            'index_position'    =>  "1",
            'description'       =>  "Year",
            'units'             =>  "",
            'field_type'        =>  FT_READING,
            'data_type'         =>  DT_INTEGER,
            'qb_type'           =>  QT_RANGE,
            'ss_type'           =>  ST_NONE,
            'access_code'       =>  AT_NORMAL,
            'minimum'           =>  "1878",
            'maximum'           =>  "2013",
            'item_list'         =>  array()
    )
);


?>


