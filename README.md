<h1>Russell's Facemash Clone</h1>
<strong>Note: This project contains updated/current code from two older reposities: <a href="https://github.com/netsider/ELO-Dopple">ELO-Dopple</a> (index_non_dopple.php, mainly), and <a href="https://github.com/netsider/ELO-Dopple-node">ELO-Dopple-node</a> (as the /non-dopple/ folder).  This project is also referred to as different names in those GitHub reposities (like "ELO-Node-Regular-Voting-App", and others).  See overview of files/folders below for more information.</strong><br>


<h2>Overview of Files/Folders in this Repository:</h2>
• <a href="https://github.com/netsider/facemash-clone/blob/master/index.js">/index.js</a> - The regular nodejs version of Facemash Clone.  This version is designed to be scalable, but may not always be 100% scalable since I'm still learning.<br>
• <a href="https://github.com/netsider/facemash-clone/blob/master/index-v1.js">/index-v1.js</a> - The regular nodejs version of Facemash Clone, but almost completely non-scalable.<br>
• <a href="https://github.com/netsider/facemash-clone/tree/master/other-versions/nodejs-api">/other-versions/nodejs-api/</a> - REST version of FaceMash Clone (previously <a href="https://github.com/netsider/ELO-Dopple-node">ELO-Dopple-node</a>, as the /non-dopple/ folder).<br>
• <a href="https://github.com/netsider/facemash-clone/tree/master/other-versions/php">/other-versions/php/</a> - PHP version of FaceMash Clone (previously <a href="https://github.com/netsider/ELO-Dopple">ELO-Dopple</a>, as index_non_dopple.php).<br>

<h2>FAQ:</strong></h2>
<strong>How did this project start?</strong><br>
This project originally began as an experiment into the algorith the original version of Facemash (the predecessor to Facebook) uses, the ELO formula.  After figuring out how the ELO formula worked, I wanted to recreate a simple version of Facemash, since I couldn't find one.  While recreating Facemash, I realized the formula could also be used to rate other things, which led me to create the "Doppeganger version" of Facemash, which is used to rank how alike celebrities look instead of how attractive the person is, like Facemash.<br>

<br><strong>Recent Changes (All Versions):</strong><br>
• Move/other-versions to own repos?<br>

<br><strong>Recent Changes (NodeJS API version):</strong><br>
• Host index.html somewhere.<br>
• Make scores update on submit.<br>
• Make picture show for each player.<br>
• Finish skeleton.<br>
• <strike>Make page get initial player information from server.</strike> DONE 8-16-2020<br>

<br><strong>Recent Changes (NodeJS version):</strong><br>
• Finish skeleton.<br>
• Make app perform shutdown.<br>
• Make score pop up as an on-screen overlay notification.<br>
• <strike>Incorporate stuff from old readme back into this one.</strike> DONE 8-16-2020<br>
• <strike>Incorporate this file back into readme.txt, since it'll have its own repo soon?</strike> DONE 8-16-2020<br>
• <strike>Make this folder have its own repo, for easier deployment.</strike> DONE 8-15-2020<br>
• <strike>Start NodeJS and API skeleton.</strike> DONE 8-6-2020/8-7-2020<br>
• <strike>Make sizeof() function only run at startup, like reading player scores.</strike> DONE 7-28-2020<br>
• <strike>Finish changing app to use memory instead of files while running.</strike> DONE 7-27-2020<br>
• <strike>Combine the last two of the three player generator functions together.</strike> DONE 7-27-2020<br>
• <strike>Make sure reset button works.</strike> DONE 7-27-2020<br>
• <strike>Fix error where ELO numbers don't add up to 1 (or 100, depending on the form).</strike> DONE<br>
• <strike>Combine both random player functions into one.</strike> DONE 7-26-2020<br>
• <strike>Redesign entire shit so it doesn't use any public variables.</strike> DONE! (7-26-2020) <br>
• <strike>Change lockplayer in EJS file to true/false rather than numerical.</strike><br>
• <strike>Take out winnerName and some other unneeded variables for this non-dopple version.</strike><br>
• <strike>Decide/learn how to make form logic non-global, so app could support many users (checkbox will be checked for all users if one checks it). See: https://stackoverflow.com/questions/39339640/access-current-req-object-everywhere-in-node-js-express </strike><br>
• <strike>Eliminate namePath and only have photoPath and scorePath, since there's no need for a name variable, or make it optional.</strike><br>
• <strike>Change name of app.post("/node-dopple-main", function() so that it doesn't have same name as EJS file.</strike> DONE 7-23-2020<br>
• <strike>User playersArray objects for pretty much everything.</strike> DONE 7-23-2020<br>
• <strike>Use playerArray[0].lockPlayer to set checkbox state instead of other stuff. // get rid of lockPlayerCheckBox = true; </strike> DONE 7-23-2020<br>
• <strike>Fix EJS files since variables fixed.</strike> DONE.<br>
• <strike>See if I can move form logic from other functions to main / (like if(Number(req.body.lockPlayer) === 1){ lockPlayerCheckBox = true;)</strike> DONE 7-23-2020 (You can't much).<br>
• <strike>remove toString() around line 110.</strike> DONE 7-23-2020<br>
• <strike>Eliminate duplicate form logic and logic in player selection.</strike> DONE 7-23-2020<br>
• <strike>Do I still need newPlayers[5]?</strike> DONE 7-23-2020<br>
• <strike>make reset work even if players not numerical. </strike> DONE 7-23-2020<br>
• <strike>make player selection work even if filenames not numerical.</strike> DONE 7-23-2020<br>
• <strike>See if it's possible to eliminate form logic altogether.</strike> DONE 7-23-2020<br>
• <strike>See if newPlayers[6][1] needed anymore.</strike> DONE 7-22-2020<br>
• <strike>newPlayers[7] cleanup & lockPlayerCheckBox.</strike> DONE 7-22-2020<br>
• <strike>clean up playerArray[0].winner.toString() === playerOne statements to see if players same.</strike> DONE 7-22-2020<br>
• <strike>get last player info from playerArray[0].winner/loser.</strike> DONE 7-22-2020<br>
• <strike>Make form retain locked player state.</strike><br>
• <strike>Make it so anything locking or getting the last round's players, gets the last players from same hidden form element.</strike><br>
• <strike>Change lines 151-170 so it doesn't use same variable checkbox is setting, and then change EJS file to reflect that (make form display checked checkbox if playerArray[0].lockPlayer = 1).</strike> DONE.<br>
• <strike>Change meaning of buttons and their labels, since they mean different things now</strike>. DONE.<br>
• <strike>Make hidden field for second player.</strike> DONE.<br>
• <strike>Make non-dopple version.</strike>DONE.<br>

<br><strong>Recent Changes (PHP version):</strong><br>
• None yet.<br>

