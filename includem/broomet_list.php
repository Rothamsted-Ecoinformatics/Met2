<?php


$display_metadata = array(
    NULL,

    // DEFAULT ordering.
    array(BT_PLAIN,
            array(  1,
                    "",
                    "",
                    "",
                    array("day", "dryb", "g30t", "g50t", "g100t", "ground", "grsmin", "netrad", "rad", 
                    "rain", "relh", "s10t", "s20t", "sun", "tmax", "tmin", "wetb", "wdir", "windrun", 
                    "windsp"),
                    array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 17, 19, 20)
            )
    ),

    // BLOCKED ordering.
    array(BT_TITLE,
            array(  1,
                    "Basic fields",
                    "",
                    "",
                    array("day", "tmax", "tmin", "rain", "sun", "windrun", "dryb", "wetb", "rad", 
                    "relh"),
                    array(1, 15, 16, 10, 14, 19, 2, 18, 9, 11)
            ),
            array(  2,
                    "Soil temperature under grass",
                    "",
                    "",
                    array("grsmin", "g30t", "g50t", "g100t"),
                    array(7, 3, 4, 5)
            ),
            array(  3,
                    "Soil temperature under bare soil",
                    "",
                    "",
                    array("s10t", "s20t"),
                    array(12, 13)
            ),
            array(  4,
                    "Radiation",
                    "",
                    "",
                    array("netrad"),
                    array(8)
            ),
            array(  5,
                    "Wind",
                    "",
                    "",
                    array("windsp", "wdir"),
                    array(20, 17)
            ),
            array(  6,
                    "Other",
                    "",
                    "",
                    array("ground"),
                    array(6)
            )
    )
);


?>


