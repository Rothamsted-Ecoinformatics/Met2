<?php


$display_metadata = array(
    NULL,

    // DEFAULT ordering.
    array(BT_PLAIN,
            array(  1,
                    "",
                    "",
                    "",
                    array("day", "bar", "bar_msl", "cloud", "dr20", "dr40", "dr60", "dryb", 
                    "dyhail", "dysnow", "dythun", "e30t", "e50t", "e100t", "fog", "fsnowd", "g10t", 
                    "g20t", "g30t", "grsmin", "rad", "rain", "rain5", "rainl", "rdur", "relh", "s10t", 
                    "s20t", "s30t", "snowd", "snowl", "sun", "tmax", "tmin", "vis", "wdir", 
                    "wetb", "wforce", "windrun", "windsp"),
                    array()
            )
    ),

    // BLOCKED ordering.
    array(BT_TITLE,
            array(  1,
                    "Basic fields",
                    "",
                    "",
                    array("day", "dryb", "rad","rain","relh", "sun", "tmax", "tmin", "wetb","windrun"),
                    array()
            ),
            array(  2,
                    "Air temperature",
                    "",
                    "",
                    array ("grsmin"),
                    array()
            ),
            array(  3,
                    "Soil temperature under grass",
                    "",
                    "",
                    array("g10t", "g20t", "g30t", "e30t", "e50t", "e100t"),
                    array()
            ),
            array(  4,
                    "Soil temperature under bare soil",
                    "",
                    "",
                    array("s10t", "s20t", "s30t"),
                    array()
            ),
            array(  5,
                    "Rainfall",
                    "",
                    "",
                    array( "rain5", "rainl", "rdur"),
                    array()
            ),
            array(  6,
                    "Drainage data",
                    "",
                    "",
                    array("dr20", "dr40", "dr60"),
                    array()
            ),
            
            array( 7,
                    "Cloud",
                    "",
                    "",
                    array("cloud"),
                    array()
            ),
            array(  8,
                    "Wind",
                    "",
                    "",
                    array("wdir", "wforce", "windsp"),
                    array()
            ),
            array(  9,
                    "Diary",
                    "",
                    "",
                    array("dyhail", "dysnow", "dythun", "fog", "snowl", "snowd", "fsnowd"),
                    array()
            ),
            array(  10,
                    "Other selected fields",
                    "",
                    "",
                    array( "bar", "bar_msl", "vis"),
                    array()
            )
    )
);


?>


