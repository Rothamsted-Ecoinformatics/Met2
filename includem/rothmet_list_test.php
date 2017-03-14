<?php


$display_metadata = array(
    NULL,

    // DEFAULT ordering.
    array(BT_PLAIN,
            array(  1,
                    "",
                    "",
                    "",
                    array("day", "bar", "bar_msl", "cloud", "dewp", "dr20", "dr40", "dr60", "dryb", 
                    "dyhail", "dysnow", "dythun", "e30t", "e50t", "e100t", "fog", "fsnowd", "g10t", 
                    "g20t", "g30t", "grsmin", "rad", "rain", "rain5", "rainl", "rdur", "relh", "s10t", 
                    "s20t", "s30t", "snowd", "snowl", "sun", "tmax", "tmin", "vap", "vis", "wdir", 
                    "wetb", "wforce", "windrun", "windsp"),
                    array(5, 2, 3, 4, 8, 15, 17, 19, 21, 23, 24, 25, 28, 29, 30, 36, 37, 38, 39, 40, 
                    42, 44, 45, 46, 54, 67, 68, 71, 72, 73, 74, 75, 78, 81, 83, 84, 85, 86, 90, 91, 
                    92, 94)
            )
    ),

    // BLOCKED ordering.
    array(BT_TITLE,
            array(  1,
                    "Index fields",
                    "",
                    "",
                    array("day"),
                    array(5)
            ),
            array(  2,
                    "Air temperature",
                    "",
                    "",
                    array("tmax", "tmin", "wetb", "dryb", "dewp", "grsmin"),
                    array(81, 83, 90, 21, 8, 42)
            ),
            array(  3,
                    "Soil temperature under grass",
                    "",
                    "",
                    array("g10t", "g20t", "g30t", "e30t", "e50t", "e100t"),
                    array(38, 39, 40, 28, 29, 30)
            ),
            array(  4,
                    "Soil temperature under bare soil",
                    "",
                    "",
                    array("s10t", "s20t", "s30t"),
                    array(71, 72, 73)
            ),
            array(  5,
                    "Rainfall",
                    "",
                    "",
                    array("rain", "rain5", "rainl", "rdur"),
                    array(45, 46, 54, 67)
            ),
            array(  6,
                    "Drainage data",
                    "",
                    "",
                    array("dr20", "dr40", "dr60"),
                    array(15, 17, 19)
            ),
            array(  7,
                    "Sunshine",
                    "",
                    "",
                    array("sun"),
                    array(78)
            ),
            array(  8,
                    "Radiation",
                    "",
                    "",
                    array("rad"),
                    array(44)
            ),
            array(  9,
                    "Cloud",
                    "",
                    "",
                    array("cloud"),
                    array(4)
            ),
            array(  10,
                    "Wind",
                    "",
                    "",
                    array("wdir", "wforce", "windsp", "windrun"),
                    array(86, 91, 94, 92)
            ),
            array(  11,
                    "Diary",
                    "",
                    "",
                    array("dyhail", "dysnow", "dythun", "fog", "snowl", "snowd", "fsnowd"),
                    array(23, 24, 25, 36, 75, 74, 37)
            ),
            array(  12,
                    "Other selected fields",
                    "",
                    "",
                    array("relh", "bar", "bar_msl", "vap", "vis"),
                    array(68, 2, 3, 84, 85)
            )
    )
);


?>


