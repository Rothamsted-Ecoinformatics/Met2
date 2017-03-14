<?php


$display_metadata = array(
    NULL,

    // DEFAULT ordering.
    array(BT_PLAIN,
            array(  1,
                    "",
                    "",
                    "",
                    array("day", "bar", "cloud", "dryb", "dyhail", "dysnow", "dythun", "e30t", "e50t", 
                    "e60t", "e100t", "e122t", "fog", "fsnowd", "g30t", "grsmin", "rad", "rain", 
                    "rdur", "relh", "s10t", "s20t", "snowd", "snowl", "sun", "tmax", "tmin", "vis", 
                    "wdir", "wetb", "wforce", "windrun", "windsp"),
                    array(4, 1, 3, 13, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 29, 31, 32, 37, 
                    38, 40, 41, 42, 43, 45, 47, 48, 50, 51, 53, 54, 55, 57)
            )
    ),

    // BLOCKED ordering.
    array(BT_TITLE,
            array(  1,
                    "Index fields",
                    "",
                    "",
                    array("day", "tmax", "tmin", "rain", "sun", "windrun", "dryb", "wetb", "rad", 
                    "relh"),
                    array(4, 47, 48, 32, 45, 55, 13, 53, 31, 38)
            ),
            array(  2,
                    "Air temperature",
                    "",
                    "",
                    array("grsmin"),
                    array(29)
            ),
            array(  3,
                    "Soil temperature under grass",
                    "",
                    "",
                    array("g30t", "e30t", "e50t", "e60t", "e100t", "e122t"),
                    array(27, 20, 21, 22, 23, 24)
            ),
            array(  4,
                    "Soil temperature under bare soil",
                    "",
                    "",
                    array("s10t", "s20t"),
                    array(40, 41)
            ),
            array(  5,
                    "Rainfall",
                    "",
                    "",
                    array("rdur"),
                    array(37)
            ),
            array(  6,
                    "Cloud",
                    "",
                    "",
                    array("cloud"),
                    array(3)
            ),
            array(  7,
                    "Wind",
                    "",
                    "",
                    array("wdir", "wforce", "windsp"),
                    array(51, 54, 57)
            ),
            array(  8,
                    "Diary",
                    "",
                    "",
                    array("dyhail", "dysnow", "dythun", "fog", "snowl", "snowd", "fsnowd"),
                    array(15, 16, 17, 25, 43, 42, 26)
            ),
            array(  9,
                    "Other selected fields",
                    "",
                    "",
                    array("bar", "vis"),
                    array(1, 50)
            )
    )
);


?>


