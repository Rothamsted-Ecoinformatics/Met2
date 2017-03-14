<?php

class Some_Class {

	var $text_preset = "default";
	var $num_preset = 900;

	// Constructor
	function Some_Class($textarg, $numarg = 0) {
		$this->text_preset = $textarg;
		$this->num_preset = $numarg;
	}

	function Some_Method($arg) {
		return ($arg + 2);
	}

}

?>

<!-- -+- -->


