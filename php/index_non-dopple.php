<!DOCTYPE html>
<html lang="en">
<head>
	<title>Russell's ELO Experiment</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
<center>
<h2>Russell's ELO Matching Example/Experiment</h2><br/>
<?php
ob_implicit_flush(true);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once('functions.php');

//Configurable Variables
$DEBUG = 0;
$Player_LOCKED = FALSE;
$Players_Chosen = FALSE;
$Root_DIR = 'Actresses';
$Score_DIR = $Root_DIR . '/Actress_Score/';
$TextName_DIR = $Root_DIR . '/Actress_Name/';
$Picture_DIR = $Root_DIR . '/Actress_Picture/';
$Counter_DIR = $Root_DIR . '/Counters/';
$Sentence_Hint_DIR = $Root_DIR . '/Sentence_Hints/';
$Picture_Width_Percentage = '20%';
$Picture_Height_Percentage = '20%';
$BaseScore = 1500;

// Notes:
// If anything wierd happens, change back strict assignment checking to loose.

if(isset($_POST) AND $_SERVER['REQUEST_METHOD'] === 'POST' AND filter_array($_POST)){
	if(isset($_POST['LockToPlayer']) AND isset($_POST['LockPlayerCheckBox'])){ // Lock Players
		$Player_LOCKED = TRUE;
	};
	if(isset($_POST['ToggleScoreBoard'])){ // Display Scores
		echo '<div id="Player_Scores" style="border: 0;border-style: dashed;width: 20%;min-height: 10%;left: 7.5%;">';
		$number_of_scores_to_display = count_files_in_DIR($Score_DIR);
		
		echo '<table border="1" width="100%"><tr><td colspan="2" align="center"><strong>Current Player Scores</strong></td></tr>';
		echo '<tr><td align="center"><strong>Player:</strong></td><td align="center"><strong>Score:</strong></td></tr>';
		for($x = 1; $x <= $number_of_scores_to_display; $x++){
			$current_score_filename = $Score_DIR . $x . '.txt';
			$current_textname_filename = $TextName_DIR . $x . '.txt';
			
			if(file_exists($current_score_filename)){
				$current_score = read($current_score_filename);
				if(file_exists($current_textname_filename)){
					$current_playerName = read($current_textname_filename);
					echo '<tr><td align="center">' . $current_playerName . ' (Pair: ' . $x . ')</td><td align="center">' . Round($current_score, 2) . '</td></tr>';
				};
			};
		};
		echo '</table></div><br/>';
	};
	if(isset($_POST['Reset'])){
		if($_POST['Reset'] === "1"){
			$number_of_scores_to_reset = count_files_in_DIR($Score_DIR); //TODO: Remove doppleganger stuff from here
			if($DEBUG){ 
				echo 'Reset Pressed!<br/>';
				echo 'Number of scores to reset = ' . $number_of_scores_to_reset . '<br/>';
			};
			
			for($x = 1; $x <= $number_of_scores_to_reset; $x++){
				$current_filename = $Score_DIR . $x . '.txt';

				if(file_exists($current_filename)){
					if($DEBUG){ echo 'Overwriting ' . $current_filename . ' ...<br/>'; };
					write($current_filename, $BaseScore);
				};
			};
			echo 'Scores Reset.<br/>';
		};
	};
	if(isset($_POST['Left_button']) OR isset($_POST['Right_button'])){
		if(isset($_POST['Left_button'])){
			$winners_array = base64_decode($_POST['Left_button']);
			$new = array();
			$new = json_decode($winners_array);
			$winner = $new[0];
			$Loser = $new[1];
		};
		if(isset($_POST['Right_button'])){
			$winners_array = base64_decode($_POST['Right_button']);
			$new = array();
			$new = json_decode($winners_array);
			$winner = $new[1];
			$Loser = $new[0];
		};
		
		if($DEBUG){
			echo '<pre><br/>POST:<br/>';
			print_r($winners_array);
			echo '<br/><br/>';
			print_r($new);
			echo '</pre>';
		};
		
		if(!isset($winner)){
			die('No Winner! Exiting...');
		};
		
		$WinnerScoreFilename = $Score_DIR . $winner . '.txt';
		$Winner_Old_Score = read($WinnerScoreFilename);
		$LoserScoreFilename = $Score_DIR . $Loser . '.txt';
		$Loser_Old_Score = read($LoserScoreFilename);
		
		$WinnerCounterFilename = $Counter_DIR . $winner . '.txt';
		if(file_exists($WinnerCounterFilename)){
			$counter = read($WinnerCounterFilename);
			$counter = $counter + 1;
			write($WinnerCounterFilename, $counter);
			if ($DEBUG){ echo 'Winner Counter Updated!<br/>'; };
		};
		
		//FIDE's Implementation of ELO score distribution:
		$k = 32; // ELO K value
		$Winner_Previous_ELO_Expected_Score = ELO($Winner_Old_Score, $Loser_Old_Score);
		$Loser_Previous_ELO_Expected_Score = ELO($Loser_Old_Score, $Winner_Old_Score);
		
		$WinnerTotalPoints = $Winner_Old_Score + $k * (1 - $Winner_Previous_ELO_Expected_Score); 
		$LoserTotalPoints = $Loser_Old_Score + $k * (0 - $Loser_Previous_ELO_Expected_Score);
		
		//Update scores for both players
		if(write($WinnerScoreFilename, $WinnerTotalPoints)){
			if(!isset($_POST['ToggleScoreUpdates'])){
				echo '<font color="green"><strong>Winner score updated! (Old Score: ' . $Winner_Old_Score . ') (New Score: ' . $WinnerTotalPoints . ') (Change: ' . ($WinnerTotalPoints - $Winner_Old_Score) . ')</font></strong><br/>';
			};
			
			if(write($LoserScoreFilename, $LoserTotalPoints)){
				if(!isset($_POST['ToggleScoreUpdates'])){
					echo '<font color="green"><strong>Loser score updated! (Old Score: ' . $Loser_Old_Score . ') (New Score: ' . $LoserTotalPoints . ') (Change: ' . ($LoserTotalPoints - $Loser_Old_Score) . ')</font></strong><br/>';
				}
			};
		};
		if($DEBUG){
			echo '<br/><strong>Last Round:</strong><br/>';
			echo 'Winner: ' . $winner . ' (' . read($TextName_DIR . $winner . '.txt') . ') ' . ' (Score: ' . read($Score_DIR . $winner . '.txt') . ')';
			echo ' (Old Score: ' . $Winner_Old_Score . ')<br/>';
			echo 'Loser: ' . $Loser . ' (' . read($TextName_DIR . $Loser . '.txt') . ') ' . ' (Score: ' . read($Score_DIR . $Loser . '.txt') . ')';
			echo ' (Old Score: ' . $Loser_Old_Score . ')<br/>';
		};
	};
	if($DEBUG){
		echo '<pre>$_POST DATA: ';
		print_r($_POST);
		echo '</pre>';
	};
};// ------------ End $_POST

	//New Game - Choose Players
	$NUM_Files_in_DIR = count_files_in_DIR($TextName_DIR);
	
	//Randomize Players, when locked or not
	if($Player_LOCKED != TRUE){
			$Player1 = RAND(1,$NUM_Files_in_DIR);
			$Player2 = RAND(1,$NUM_Files_in_DIR);
			$Designated_Player = $Player1;
			
			while($Player2 === $Player1){
				$Player2 = RAND(1,$NUM_Files_in_DIR);
			};
			
	}else{ 
		if(isset($_POST['LockToPlayer'])){ 
			if(RAND(1,2) === 1){
				$Player1 = $_POST['LockToPlayer'];
				$Designated_Player = $Player1; // Still needed?  Maybe not.
				$Player2 = RAND(1,$NUM_Files_in_DIR);
				
				while($Player2 == $Player1){
					if($DEBUG){ echo 'Random players chosen are the same!  Rechoosing...<br/>'; };
					$Player2 = RAND(1,$NUM_Files_in_DIR);
				};
				
			}else{
				$Player2 = $_POST['LockToPlayer'];
				$Designated_Player = $Player2;  // Still needed?  Maybe not.
				$Player1 = RAND(1,$NUM_Files_in_DIR);
				
				while($Player2 == $Player1){
					if($DEBUG){ echo 'Random players chosen are the same!  Rechoosing...<br/>'; };
					$Player1 = RAND(1,$NUM_Files_in_DIR);
				};
			};
		};
	}; // End Choosing Players
	
	if($DEBUG){ echo 'Players Chosen!<br/>Player 1: ' . $Player1 . '<br/>Player 2: ' . $Player2 . '<br/>'; };
	
	$Player1_filename = $Score_DIR . $Player1 . '.txt';
	$Player2_filename = $Score_DIR . $Player2 . '.txt';

	$Player1_picture_filename = $Picture_DIR . $Player1 . '.jpg';
	$Player2_picture_filename = $Picture_DIR . $Player2 . '.jpg';

	$Player1_name_filename = $TextName_DIR . $Player1 . '.txt';
	$Player2_name_filename = $TextName_DIR . $Player2 . '.txt';
	
	$Player1_counter_filename = $Counter_DIR . $Player1 . '.txt';
	$Player2_counter_filename = $Counter_DIR . $Player1 . '.txt';
	
	if(isset($Designated_Player)){
		$Designated_Player_Text = read($TextName_DIR . $Designated_Player . '.txt');
		$Player_sentence_hint_filename = $Sentence_Hint_DIR . $Designated_Player . '.txt'; // For designated player only
	
		// Check and/or create "Sentence Hint" file for Designated Player -- optional, but useful
		if(!file_exists($Player_sentence_hint_filename)){
			if(write($Player_sentence_hint_filename, 'DEFAULT')){
				if($DEBUG){ echo '<font color="green">Player 1 Sentence Hint File Written!</font><br/>'; };
			}else{
				if($DEBUG){ echo '<font color="red">Player 1 Sentence Hint File NOT Written!</font><br/>'; };	
			};
		}else{
			$Designated_Player_Sentence_Hint_Text = read($Player_sentence_hint_filename);
		};
	};

	// Check and/or create counter file for Player 1/2
	if(!file_exists($Player1_counter_filename)){
		if(write($Player1_counter_filename, 0)){
			if($DEBUG){ echo '<font color="green">Player 1 Counter File Written!</font><br/>'; };
		};
	};
	if(!file_exists($Player2_counter_filename)){
		if(write($Player2_counter_filename, 0)){
			if($DEBUG){ echo '<font color="green">Player 2 Counter File Written!</font><br/>'; };
		};
	};
	
	//Check and/or create score file for Player 1/2
	if(!file_exists($Player1_filename)){
		if($DEBUG){ echo '<br/><font color="red">Player 1 Score File Not Found.</font><br/>'; };
		
		if(write($Player1_filename, $BaseScore)){
			if($DEBUG){ echo '<font color="green">Player 1 Score File Written!</font><br/>'; };
		}else{
			if($DEBUG){ echo '<br/><font color="red">Player 1 Score File <strong>creation</b> also failed.</strong><br/>'; };
		}
	}else{
		if($DEBUG){ echo 'Player 1 Score File Exists!<br/>'; };
	};
	
	if(!file_exists($Player2_filename)){
		if($DEBUG){ echo '<br/><font color="red">Player 2 Score File Not Found.</font><br/>'; };
		
		if(write($Player2_filename, $BaseScore)){
			if($DEBUG){ echo '<font color="green">Player 2 Score File Written!</font><br/>'; };
		}else{
			if($DEBUG){ echo '<br/><font color="red">Player 2 Score File <strong>creation</b> also failed.</strong><br/>'; };
		}
	}else{
		if($DEBUG){ echo 'Player 2 Score File Exists!<br/>'; };
	};
	
	//Debugging output
	if($DEBUG){
		echo '-----------------------------------------<br/>';
		echo 'Main DIR = /' . $Root_DIR . '<br/>';
		echo '$Score_DIR (Subdirectory) = ' . $Score_DIR . ' (Files in Dir: ' . count_files_in_DIR($Score_DIR) . ')<br/>';
		echo '$TextName_DIR (Subdirectory) = ' . $TextName_DIR . ' (Files in Dir: ' . count_files_in_DIR($TextName_DIR) . ')<br/>';
		echo '$Picture_DIR (Subdirectory) = ' . $Picture_DIR . ' (Files in Dir: ' . count_files_in_DIR($Picture_DIR) . ')<br/>';
		echo 'Player 1 Score File: ' . $Player1_filename . '<br/>';
		echo 'Player 2 Score File: ' . $Player2_filename . '<br/>';
		echo 'Player 1 Picure Path: ' . $Player1_picture_filename . '<br/>';
		echo 'Player 2 Picure Path: ' . $Player2_picture_filename . '<br/>';
		echo 'Player 1 Text/Name Path: ' . $Player1_name_filename . '<br/>';
		echo 'Player 2 Text/Name Path: ' . $Player2_name_filename . '<br/>';
		if(isset($Designated_Player)){ echo 'Designated Player: ' . $Designated_Player . '<br/>'; };
		echo '-----------------------------------------<br/>';
	};

	//Read current scores, calculate ELO, etc.
	$Player1_currentScore = read($Player1_filename);
	$Player1_name = read($Player1_name_filename);

	$Player2_currentScore = read($Player2_filename);
	$Player2_name = read($Player2_name_filename);

	$Player1_ELO = ELO($Player1_currentScore, $Player2_currentScore);
	$Player2_ELO = ELO($Player2_currentScore, $Player1_currentScore);

	//Make Prediction
	$ELO_Link = '<a href="https://en.wikipedia.org/wiki/Elo_rating_system">ELO Rating</a>';
	if($Player1_ELO > $Player2_ELO){
			$Prediction = 'Based on previous user input, <font color="green"><strong>Person 1</font></strong> is most likely <strong>' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="green"><strong>' . Round(100 * $Player1_ELO, 3) . '%.' . '</strong></font>';
			$Prediction_2 = 'Based on previous user input, <font color="red"><strong>Person 2</font></strong> is most likely <strong>NOT ' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="red"><strong>' . Round(100 * $Player2_ELO, 3) . '%.' . '</strong></font>';
	}else{
		if($Player1_ELO === $Player2_ELO){
			$Prediction = '<font color="red"><strong>Both people have an <strong>equal chance</strong> to win</strong></font>, with both having an ' . $ELO_Link . ' of <strong><font color="red">' . $Player1_ELO . ' (' . Round(100 * $Player2_ELO, 3) . '%)' . '</strong></font>';
		};	
		if($Player1_ELO < $Player2_ELO){
			$Prediction = 'Based on previous user input, <font color="green"><strong>Person 2</font></strong> is most likely <strong>' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="green"><strong>' . Round(100 * $Player2_ELO, 3) . '%.' . '</strong></font>';
			$Prediction_2 = 'Based on previous user input, <font color="red"><strong>Person 1</font></strong> is most likely <strong>NOT ' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="red"><strong>' . Round(100 * $Player1_ELO, 3) . '%.' . '</strong></font>';
		};
	};
	
	//Display Score/Info for both players for debug
	if($DEBUG){
		echo '<br/>Person 1 (Left): ' . $Player1_name . ' (<strong>Score: ' . $Player1_currentScore . '</strong>) ' . '(<strong>ELO: ' . $Player1_ELO . ' ---<font color="red"> ' . (100 * $Player1_ELO) . '%</font></strong>)';
		echo '<br/>Person 2 (Right): ' . $Player2_name . ' (<strong>Score: ' . $Player2_currentScore . '</strong>) ' . '(<strong>ELO: ' . $Player2_ELO . ' ---<font color="red"> ' . (100 * $Player2_ELO) . '%</font></strong>)<br/>';
	};
	
	//Display Prediction
	if(!isset($_POST['HidePrediction']) AND isset($Prediction)){
		echo '<br/><div id="prediction_box">' . $Prediction;
		if(isset($Prediction_2)){ 
			echo '<br/>' . $Prediction_2;
		};
		echo '</div><br/>';
	};
	
	//Display Sentence Hint
	if(isset($Designated_Player_Sentence_Hint_Text) AND $Designated_Player_Sentence_Hint_Text != 'DEFAULT'){
		echo '<div id="sentence_hint_text_box">' . $Designated_Player_Sentence_Hint_Text . '</div><br/>';
	};
	
	//Reveal Players (if toggled)
	if(isset($_POST['RevealPlayers'])){
		echo '<div style="border: 0;border-style: solid;left: 13.5%;top: 50%;position: fixed;"><strong>This is actually ' . $Player1_name . '! ----></strong></div>';
		echo '<div style="border: 0;border-style: solid;right: 13.5%;top: 50%;position: fixed;"><strong><---- This is actually ' . $Player2_name . '!</strong></div>';
	};

	//Display Player Pictures
	echo '<img src="' . $Player1_picture_filename . '" width="' . $Picture_Width_Percentage . '" height="' . $Picture_Height_Percentage . '" />';
	echo '<img src="' . $Player2_picture_filename . '" width="' . $Picture_Width_Percentage . '" height="' . $Picture_Height_Percentage . '" /><br/>';
	
	// Make Array
	$Players_Array = [(string)$Player1,(string)$Player2];
	
	//Display Buttons
	echo '<strong>Choose below:</strong>';
	echo '<form action="' . $_SERVER['PHP_SELF'] . '" method="POST">';
	echo '<button name="Left_button" type="submit" value="' . base64_encode(json_encode($Players_Array)) . '"><strong>This is ';
	if(isset($Designated_Player_Text)){
		echo $Designated_Player_Text . ' (Left)</button> ';
	}else{
		echo 'Person 1</button> '; // If not using randomized version
	};
	echo '</strong><button name="Right_button" type="submit" value="' . base64_encode(json_encode($Players_Array)) . '"><strong>No, this is ';
	if(isset($Designated_Player_Text)){
		echo $Designated_Player_Text . ' (Right)</button>';
	}else{
		echo 'Person 2</button>';
	};
	echo '</strong><br/><br/>';
	
	//Display Options
	echo '<div id="options" style="border: .5px; border-style: solid;width:30%;padding: 4px;"><strong>Options:</strong><br/>';
	echo '<input type="checkbox" name="RevealPlayers" value="1"';
	if(isset($_POST['RevealPlayers'])){
		echo 'checked = checked';
	};
	echo '> Show true names* (cheating)<br/>';
	echo '<input type="checkbox" name="ToggleScoreBoard" value="1" ';
	if(isset($_POST['ToggleScoreBoard'])){
		echo 'checked = checked';
	};
	echo '> Show/Toggle Scoreboard*<br/>';
	echo '<input type="checkbox" name="ToggleScoreUpdates" value="1" ';
	if(isset($_POST['ToggleScoreUpdates'])){
		echo 'checked = checked';
	};
	echo '> Hide Score Updates*<br/>';
	echo '<input type="checkbox" name="HidePrediction" value="1" ';
	if(isset($_POST['HidePrediction'])){
		echo 'checked = checked';
	};
	echo '> Hide ELO Prediction* (not recommended)<br/>';
	echo '<select name="LockToPlayer" onchange="CheckTheBox()">';
	for($x = 1; $x <= $NUM_Files_in_DIR; $x++){
		$current = $TextName_DIR . $x . '.txt';
		if(file_exists($current)){ 
			$current_textname = read($current);
		}
		if(isset($_POST['LockPlayerCheckBox'])){
			if($_POST['LockToPlayer'] == $x){
				echo '<option value="' . $x . '" selected>' . $x;
				if(isset($current_textname)){
					echo ' - ' . $current_textname;
				};
				echo '</option>';
			}else{
				echo '<option value="' . $x . '">' . $x;
				if(isset($current_textname)){
					echo ' - ' . $current_textname;
				};
				echo '</option>';
			};
		}else{
			echo '<option value="' . $x . '">' . $x;
			if(isset($current_textname)){
				echo ' - ' . $current_textname;
			};
			echo '</option>';
		};
	};
	echo '</select> Lock to Player/Set #*';
	echo '<input type="checkbox" name="LockPlayerCheckBox" value="1" id="LockPlayerCheckBox" onclick="UncheckTheBox()" ';
	if(isset($_POST['LockPlayerCheckBox'])){
		echo 'checked = checked';
	};
	echo '>';
	if($Player_LOCKED){
		echo '<div id="lockedLabel" style="visibility: visible;"><font color="red">Players Locked!</font></div>';
	}else{
		echo '<div id="lockedLabel" style="visibility: hidden;"><font color="red">Players Locked!</font></div>';
	};
	echo '<br/><button name="Reset" type="submit" value="1">Reset All Scores</button></form><br/>* = Will take effect after choosing winner, until unchecked.</div>';
?>
<script>
function CheckTheBox(){
	document.getElementById("LockPlayerCheckBox").checked = true;
	document.getElementById("lockedLabel").style.visibility = "visible";
}
function UncheckTheBox(){
	if(document.getElementById("LockPlayerCheckBox").checked === true){
		document.getElementById("lockedLabel").style.visibility = "visible";
	}else{
		if(document.getElementById("lockedLabel").style.visibility === "visible"){
			document.getElementById("lockedLabel").style.visibility = "hidden";
		}
	}
}
</script></center><br/></body></html>