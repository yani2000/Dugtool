// ==UserScript==
// @name            Dugtool
// @namespace       Dugtool
// @description     Dugtool v1.5.2 (original!)
// @include         http*dugout-online.com/players/details*playerID*
// @include         http*dugout-online.com/players/none*
// @include         http*dugout-online.com/clubinfo/bids/clubid*
// @version         2.0.0
// ==/UserScript==

// Current Original Version: v1.5.2
// Had to delete those asterixes or NetBeans won't recognize JavaScript code!
/*
* Extension GUID 4eb668c3-391d-4ec0-aa23-4693d61acd7a
*
* v1.0 - v1.1 Original code by Lighstoner & Chancentod
* v1.2 modified by boro
* v1.2 commented and all attribute names translated to english
* v1.2.1 skill weightings changed by boro and Chancentod
* v1.2.2 bug fix -> added condition to check if player is sold and adapt accordingly. #LRW CSS fixed. (boro)
* v1.3 streamlined code (skill assignment, styles, condition), added player position finder // to do: use position to only highlight acceptable areas  (boro)
* v1.4 added player counter on squad page, tweaked player ratings slightly. (boro)
* v1.4.1 bug fix on player counter (boro)
* v1.4.2 recompile for firefox version increase (boro)
* v1.5 improved player counting on club page (boro)
* v1.5.1 fix display bug on club page and player's page, and perfectly fit 1024*768 resolution now. (FireEmblem) 
* v1.5.1 corrected PageType and URL include to work on youth page and return to senior page (boro)
* v1.5.2 compatibility with FF4
* v1.5.3 Fixed compatibility with new Dugout 2015, fixed player count, added red color on too much players on Monday. (rokec)
* v1.5.4 Added Form. (rokec)
* v2.0.0 FIX: Fixed compatibility with new Dugout 2020 (rokec)
* vX.X.X adding bid page > transfer ad function << WIP
*/

var APPNAME = "Dugtool v2.0.0";
var FORUMLINK = "/forum/viewtopic/t/254714";

var PageType = 0;
PageType = checkPage(document.URL);

// Check the page types - if its the squad page then 1, if its players individual page then 0.

switch (PageType)
{
    case 0: doPlayerStuff(); break
    case 1: doSquadStuff(); break
    // case 2: doTrainingStuff(); break  //not implemented yet
    // case 3: doBidStuff(); break  //not implemented yet
    default: doNothing; 
}

function checkPage (string1)
{
    //default is player page
    var retval = 0;
    //check if on squad page (or youth squad)
    if (string1.indexOf("players/none")>0||string1.indexOf("players/none/view")>0/*||string1.indexOf("players&youth=1&club_id")>0*/)retval = 1;
    //check if on training page
    //nothing here yet

    //check if on bids page
    if (string1.indexOf("clubinfo/bids")>0)retval = 3;

    return retval;
}	

function doNothing()
{
	alert("doing nothing");
}

function doTrainingStuff()
{
	// not implemented yet
	alert("doing training");
}

function doBidStuff()
{
	// not implemented yet
	alert("doing training");
}



function doPlayerStuff()
{
	doPlayerStuff();
}

function doSquadStuff()
{
	PlayerCounter();
}

//player counter function for squad page

function PlayerCounter()
{
    var gGK = 0;
    var gDef = 0;
    var gMid = 0;
    var gFwd = 0;
    var age = 0;
    var countYouthGK = 0;
    var countYouthDEF = 0;
    var countYouthMID = 0;
    var countYouthFWD = 0;
    
    // Groups: GK, DF, MF, FW:
    var groups = document.getElementsByClassName("forumline");
    for (var i in groups) {
        var group = groups[i];
        if (group.innerHTML != undefined) {
            // Players:
            var trs = group.childNodes[1].children;
            for (var j in trs) {
                var tr = trs[j];
                // Skip header:
                if (j > 0 && j < trs.length) {
                    // Skip injured and loaned out players:
                    var injured = tr.getElementsByClassName("pl_injured").length;
                    var loaned = tr.getElementsByTagName("a")[0].style.color.length;
                    if (injured < 1 && loaned < 18) { // borrowed has 14 length!
                        var age = parseInt(tr.getElementsByClassName("tableText")[0].innerHTML); // First one [0] is age, second one [1] is rating!
                        if (i == 0) { // GK:
                            if (age < 19) countYouthGK++;
                            gGK++;
                        }
                        else if (i == 1) { // DF:
                            if (age < 19) countYouthDEF++;
                            gDef++;
                        }
                        else if (i == 2) { // MF:
                            if (age < 19) countYouthMID++;
                            gMid++;
                        }
                        else if (i == 3) { // FW:
                            if (age < 19) countYouthFWD++;
                            gFwd++;
                        }
                    }
                }
            }
        }
    }
    
    var totalplayers = gGK + gDef + gMid + gFwd;
    var countYouthTotal = countYouthGK + countYouthDEF + countYouthMID + countYouthFWD;
    
    var window1_header_text = document.getElementsByClassName("window1_header_text")[0];
    window1_header_text.innerHTML = totalplayers + ' ' + window1_header_text.innerHTML;
    
    var d = new Date();
    var day = d.getDay();
    var tooManyPlayersColor = "black";
    
    // Paint red if it's monday and there are more than 38 players in your main squad:
    if (day == 1 && totalplayers > 38 && location.href.indexOf("youth") < 0) {
        // alert('WARNING! More than 38 Players (and 2 loans)!');
        tooManyPlayersColor = "red";
    } 

    var logo = document.createElement("div");
    logo.style.position = "fixed";
    logo.style.top = "10px";
    logo.style.right = "10px";
    document.body.appendChild(logo);

    // begin display box

    logo.innerHTML =
    '<div id="wrapper"><p id="analyse"><p class="dugtooltitle"><a target="_blank" href="' + FORUMLINK + '">' + APPNAME + '</a></p><p class="dugtoolfooter"><p id="condition">Player Counter</p><table border="0" cellspacing="0" cellpadding="0">'
    + '<tr><td id="gk" class="background"><u>GK</u></td><td id="gk" class="background"><u>U18</u></td></tr><tr><td id="gkv"  class=""> ' + (gGK) + '</td><td id="gkv"  class="">' + countYouthGK + '</td></tr>'
    + '<tr><td id="dc" class="background"><u>DEF</u></td><td id="dc"  class="background"><u>U18</u></td></tr><tr><td id="dcv" >' + (gDef) + '</td><td id="dcv">' + (countYouthDEF) + '</td></tr>'
    + '<tr><td id="dl" class="background"><u>MID</u></td><td id="dl" class="background"><u>U18</u></td></tr><tr><td id="dlv"  class="">' + (gMid) +  '</td><td id="dlv" class="">' + (countYouthMID) + '</td></tr>'
    + '<tr><td id="dr" class="background" ><u>FWD</u></td><td id="dr" class="background"><u>U18</u></td></tr><tr><td id="drv"  class="">' + (gFwd) + '</td><td id="drv" class="">' + (countYouthFWD) + '</td></tr>'


    +    '</table></p><p class="dugtoolfooter"><p id="condition" style="color: ' + tooManyPlayersColor + ';">Total Players: ' + totalplayers + ' </p><p class="dugtoolfooter" id="captain">Total U-18: ' + countYouthTotal + '</p></div>';

    //end display box


    addGlobalStyle('#condition {font-weight: bold; text-align: center; border: 1px solid #53714d; margin-top: -10px; background: #ffffff;} .dugtoolfooter {font-weight: bold; text-align: center; background: #53714d; padding: 3px; color: #ffffff;} .background {background: #dde3db;}  #wrapper table tr td{font-size: 10px; font-weight:bold; width: 100px; padding: 2px; text-align: center;} .dugtooltitle {background: #53714d; text-align: center; padding: 3px; color: #ffffff; font-weight: bold; font-size: 12px;} #wrapper {position: absolute; top: 0px; right: 0px; width: 130px; padding-right: 4px; padding-left: 4px; border: 2px solid #53714d; background: #ffffff;}   #wrapper a {color:#ffffff; border-bottom: 1px solid #ffffff;}');

}



// function for getting the numerical value from the experience bar.

function getExp (string1)
{
    var retval = string1.substring(0, string1.indexOf(" XP\""));
    retval = retval.substring(retval.lastIndexOf("\"")+"\"".length);
    retval = parseInt(retval);
    return retval;
}

// experimental function to get the player positions
function getPos(/*string1*/)
{
    var posArray = new Array();
 
    // Prepopulate with zero values, because threre are no div elements with /positions-0.png:
    posArray[0] = "0"; // GK  (always 0 or 1 and never 2 or 3)
    posArray[1] = "0"; // DL
    posArray[2] = "0"; // DC
    posArray[3] = "0"; // DR
    posArray[4] = "0"; // ML
    posArray[5] = "0"; // MC
    posArray[6] = "0"; // MR
    posArray[7] = "0"; // FL
    posArray[8] = "0"; // FC
    posArray[9] = "0"; // FR
    
    // Find the correct main div element with all the positions:
    var imgs = document.getElementsByTagName("img");
    var mainDiv;
    for (var i in imgs) {
        var img = imgs[i];
        if (img != undefined && img.src.indexOf("positions-field") > 0) {
            mainDiv = img.parentNode;
            break;
        }
    }
    // Go thru all div elements (positions):
    var posDivs = mainDiv.getElementsByTagName("div");
    for (var i in posDivs) {
        var posDiv = posDivs[i];
        if (posDiv.style != undefined) {
            // Get position number:
            var img = posDiv.style.background;
            var num = img.substring(img.indexOf("positions-")+"positions-".length, img.indexOf(".png"));
            var t = posDiv.style.top;
            var l = posDiv.style.left;
            
            // Fill posArray with position numbers:
            if (t == "69px" && l == "10px") posArray[0] = num; // GK
            if (t == "69px" && l == "40px") posArray[2] = num; // DC
            if (t == "20px" && l == "40px") posArray[1] = num; // DL
            if (t == "117px" && l == "40px") posArray[3] = num; // DR
            if (t == "69px" && l == "108px") posArray[5] = num; // MC
            if (t == "20px" && l == "108px") posArray[4] = num; // ML
            if (t == "117px" && l == "108px") posArray[6] = num; // MR
            if (t == "69px" && l == "185px") posArray[8] = num; // FC
            if (t == "20px" && l == "185px") posArray[7] = num; // FL
            if (t == "117px" && l == "185px") posArray[9] = num; // FR
            
        }
    }
    
    // posArray now contains values from 0-3 (none, green, yellow, red)
    // posArray[0] = GK  (always 0 or 1 and never 2 or 3)
    // posArray[1] = DL
    // posArray[2] = DC
    // posArray[3] = DR
    // posArray[4] = ML
    // posArray[5] = MC
    // posArray[6] = MR
    // posArray[7] = FL
    // posArray[8] = FC
    // posArray[9] = FR
	
    return posArray;
}

function getCondition() {
    var tabbed_pane = document.getElementsByClassName("tabbed_pane")[0];
    var row = tabbed_pane.getElementsByClassName("row1")[0];
    var b = row.getElementsByTagName("b")[0];
    
    return b.innerHTML;
}

function getForm() {
    var tabbed_pane = document.getElementsByClassName("tabbed_pane")[0];
    var res = tabbed_pane.innerHTML.match(/form_history=(.*?)-?(\d+)"/m);
    var form = 100;
    if (res)
        form = res[2];
    
    return form;
}

function addGlobalStyle(css)
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// acquire all the table elements - modified to streamline v1.3

// There are 5 cases: normal, listed, bid, sold and free


function doPlayerStuff()
{
    var tabPane = document.getElementsByClassName("tabbed_pane");
    if (tabPane.length < 1) { // Player retired fix!
        return;
    }
  	
  	var tableA = 4;	
  	
  	var talentPanel = document.getElementById("talentPanel");
  	if (!!talentPanel && talentPanel.children.length > 1) {
        tableA++;
    }
    
    //if (document.getElementsByName("startoffer").length < 1 && document.getElementsByName("riseoffer").length < 1) tableA = 3;
    if (document.getElementsByClassName("info").length < 1) tableA--;

    var reflexes = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[2].innerHTML);
    var tackling = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[5].innerHTML);
    var creativity = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[8].innerHTML);
    var shooting = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[11].innerHTML);
    var teamwork = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[14].innerHTML);
    var oneonones = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[17].innerHTML);
    var marking = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[20].innerHTML);
    var passing = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[23].innerHTML);
    var dribbling = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[26].innerHTML);
    var speed = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[29].innerHTML);
    var handling = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[32].innerHTML);
    var heading = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[35].innerHTML);
    var longshots = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[38].innerHTML);
    var positioning = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[41].innerHTML);
    var strength = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[44].innerHTML);
    var communication = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[47].innerHTML);
    var crossing = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[50].innerHTML);
    var firsttouch = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[53].innerHTML);
    var aggression = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[56].innerHTML);
    var influence = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[59].innerHTML);
    var eccentricity = parseInt(document.getElementsByTagName("table")[tableA].getElementsByTagName("td")[62].innerHTML);
    var exp = getExp((new XMLSerializer()).serializeToString(document));
    var condition = getCondition();
    var form = getForm();
    
    var position = getPos();

    var conditionvalue = parseInt(condition.replace(/%/g, ""));
    var experience = ((exp/100)+1);


    var gkPos, dcPos, drPos, dlPos, mcPos, mrPos, mlPos, scPos, frPos, flPos; 

    // Goalkeeper 
    switch (position[0])
    {
        case (position[0] = "0"): gkPos = (positioning * .25); break
        case (position[0] = "1"): gkPos = positioning; break
    }

    // Defender Centre and Sweeper
    switch (position[2])
    {
        case (position[2] = "0"): dcPos = (positioning * .25); break
        case (position[2] = "1"): dcPos = positioning; break
        case (position[2] = "2"): dcPos = positioning * .8; break
        case (position[2] = "3"): dcPos = positioning * .5; break
    }

    // Defender Left
    switch (position[1])
    {
        case (position[1] = "0"): dlPos = (positioning * .25); break
        case (position[1] = "1"): dlPos = positioning; break
        case (position[1] = "2"): dlPos = positioning * .8; break
        case (position[1] = "3"): dlPos = positioning * .5; break
    }

    // Defender Right
    switch (position[3])
    {
        case (position[3] = "0"): drPos = (positioning * .25); break
        case (position[3] = "1"): drPos = positioning; break
        case (position[3] = "2"): drPos = positioning * .8; break
        case (position[3] = "3"): drPos = positioning * .5; break
    }

    // Midfielder Centre, Defensive Midfielder Centre, Attacking Midfielder Centre
    switch (position[5])
    {
        case (position[5] = "0"): mcPos = (positioning * .25); break
        case (position[5] = "1"): mcPos = positioning; break
        case (position[5] = "2"): mcPos = positioning * .8; break
        case (position[5] = "3"): mcPos = positioning * .5; break
    }

    // Midfielder Left
    switch (position[4])
    {
        case (position[4] = "0"): mlPos = (positioning * .25); break
        case (position[4] = "1"): mlPos = positioning; break
        case (position[4] = "2"): mlPos = positioning * .8; break
        case (position[4] = "3"): mlPos = positioning * .5; break
    }

    // Midfielder Right
    switch (position[6])
    {
        case (position[6] = "0"): mrPos = (positioning * .25); break
        case (position[6] = "1"): mrPos = positioning; break
        case (position[6] = "2"): mrPos = positioning * .8; break
        case (position[6] = "3"): mrPos = positioning * .5; break
    }

    // Striker, Forward Centre
    switch (position[8])
    {
        case (position[8] = "0"): scPos = (positioning * .25); break
        case (position[8] = "1"): scPos = positioning; break
        case (position[8] = "2"): scPos = positioning * .8; break
        case (position[8] = "3"): scPos = positioning * .5; break
    }

    // Forward Left
    switch (position[7])
    {
        case (position[7] = "0"): flPos = (positioning * .25); break
        case (position[7] = "1"): flPos = positioning; break
        case (position[7] = "2"): flPos = positioning * .8; break
        case (position[7] = "3"): flPos = positioning * .5; break
    }

    // Forward Right
    switch (position[9])
    {
        case (position[9] = "0"): frPos = (positioning * .25); break
        case (position[9] = "1"): frPos = positioning; break
        case (position[9] = "2"): frPos = positioning * .8; break
        case (position[9] = "3"): frPos = positioning * .5; break
    }

    // Determine player ratings. Ratings based on a scale from 0-5 with 5 the most important. Ratings by boro (16/1/09) so might need tweaking. Ratings based on new data from training system (eg MC needs first touch)

    var gk = ((reflexes * 5 + oneonones * 5 + handling * 5 + communication * 3 - eccentricity * 1 + tackling * 0 + passing * 1 + shooting * 0 + crossing * 0 + dribbling * 0 + firsttouch * 0 + longshots * 0 + heading * 0 + marking * 0 + creativity * 0 + gkPos * 5 + influence * 0 + aggression * 1 + teamwork * 1 + speed * 1 + strength * 1)/27);
    var dc = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 4 - eccentricity * 1 +tackling * 5 +passing * 1 +shooting * 0 +crossing * 0 +dribbling * 0 +firsttouch*1 +longshots * 0 +heading * 5 +marking * 5 +creativity * 1 +dcPos * 5 +influence * 0 +aggression * 1 +teamwork * 2 +speed * 1 +strength * 2)/33);
    var sw = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 5 - eccentricity * 1 + tackling * 4 +passing * 2 +shooting * 0 +crossing * 0 +dribbling * 1 +firsttouch * 1 +longshots * 0 +heading * 4 +marking * 5 +creativity * 1 +dcPos * 5 +influence * 0 +aggression * 1 +teamwork * 2 +speed * 2 +strength * 1 )/34);
    var dl = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 4 - eccentricity * 1 +tackling * 5 +passing * 2 +shooting * 0 +crossing * 4 +dribbling * 1 +firsttouch * 1 +longshots * 0 +heading * 3 +marking * 5 +creativity * 1 +dlPos * 5 +influence * 0 +aggression * 1 +teamwork * 1 +speed * 2 +strength * 1 )/35);
    var dr = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 4 - eccentricity * 1 +tackling * 5 +passing * 2 +shooting * 0 +crossing * 4 +dribbling * 1 +firsttouch * 1 +longshots * 0 +heading * 3 +marking * 5 +creativity * 1 +drPos * 5 +influence * 0 +aggression * 1 +teamwork * 1 +speed * 2 +strength * 1 )/35);
    var dmc = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 2 - eccentricity * 1 +tackling * 4 +passing * 5 +shooting * 1 +crossing * 1 +dribbling * 1 +firsttouch * 2 +longshots * 2 +heading * 1 +marking * 4 +creativity * 5 +mcPos * 5 +influence * 0 +aggression * 1 +teamwork * 2 +speed * 2 +strength * 2 )/39);
    var mc = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 1 +eccentricity * 1 +tackling * 1 +passing * 5 +shooting * 2 +crossing * 1 +dribbling * 1 +firsttouch * 4 + longshots * 5 +heading * 1 +marking * 1 +creativity * 5 +mcPos * 4 +influence * 0 +aggression * 1 +teamwork * 2 +speed * 2 +strength * 1 )/38);
    var am = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 1 +eccentricity * 2 +tackling * 0 +passing * 5 +shooting * 4 +crossing * 1 +dribbling * 4 +firsttouch * 3 + longshots * 5 +heading * 1 +marking * 0 +creativity * 5 +mcPos * 3 +influence * 0 +aggression * 1 +teamwork * 1 +speed * 2 +strength * 1 )/39);
    var ml = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 1 +eccentricity * 1 +tackling * 1 +passing * 5 +shooting * 2 +crossing * 5 +dribbling * 2 +firsttouch * 4 +longshots * 3 +heading * 1 +marking * 1 +creativity * 5 +mlPos * 4 +influence * 0 +aggression * 1 +teamwork * 2 +speed * 2 +strength * 1 )/41);
    var mr = ((reflexes * 0 +oneonones * 0 +handling * 0 +communication * 1 +eccentricity * 1 +tackling * 1 +passing * 5 +shooting * 2 +crossing * 5 +dribbling * 2 +firsttouch * 4 +longshots * 3 +heading * 1 +marking * 1 +creativity * 5 +mrPos * 4 +influence * 0 +aggression * 1 +teamwork * 2 +speed * 2 +strength * 1 )/41);
    var fc = ((reflexes * 0 + oneonones * 1 + handling * 0 + communication * 1 + eccentricity * 2 + tackling * 0 + passing * 3 + shooting * 5 + crossing * 0 + dribbling * 5 + firsttouch * 5 + longshots * 1 + heading * 5 + marking * 0 + creativity * 2 + scPos * 4 + influence * 0 + aggression * 1 + teamwork * 1 + speed * 2 + strength * 1 )/39);
    var sc = ((reflexes * 0 + oneonones * 1 + handling * 0 + communication * 1 + eccentricity * 2 + tackling * 0 + passing * 1 + shooting * 5 + crossing * 0 + dribbling * 4 + firsttouch * 5 + longshots * 1 + heading * 5 + marking * 0 + creativity * 1 + scPos * 5 + influence  * 0 + aggression * 1 + teamwork * 1 + speed * 1 + strength * 2  )/36);
    var lw = ((reflexes * 0 + oneonones * 1 + handling * 0 + communication * 1 + eccentricity * 2  + tackling * 0 + passing * 2 + shooting * 4 + crossing * 4 + dribbling * 5 + firsttouch * 4 + longshots * 1 + heading * 3 + marking * 0 + creativity * 2 + flPos * 4 + influence * 0 + aggression * 1 + teamwork * 1 + speed * 2 + strength * 1  )/38);
    var rw = ((reflexes * 0 + oneonones * 1 + handling * 0 + communication * 1 + eccentricity * 2  + tackling * 0 + passing * 2 + shooting * 4 + crossing * 4 + dribbling * 5 + firsttouch * 4 + longshots * 1 + heading * 3 + marking * 0 + creativity * 2 + frPos * 4 + influence * 0 + aggression * 1 + teamwork * 1 + speed * 2 + strength * 1  )/38);

    // Formula for captain determined by boro
    var captain = (((influence * 4 + teamwork * 2 + communication * 1) / 14) + exp / 40).toFixed(1);

    // Formula for determining OPS (Original Position Skills) for each position (based on skill weightings from new training system)

    var gkOPS = (reflexes *1 + oneonones*1 + handling*1 + communication*1 + positioning*1);
    var dcOPS = (tackling *1 + heading*1 + marking*1 + communication*1 + positioning*1);
    var fbOPS = (tackling *1 + marking *1 + communication *1 + positioning *1 + crossing *1);
    var mcOPS = (passing *1 + firsttouch*1 + longshots*1 + creativity*1 + positioning*1);
    var dmcOPS = (passing *1 + tackling*1 + marking*1 + creativity*1 + positioning*1);
    var amcOPS = (passing *1 + shooting*1 + longshots*1 + creativity*1 + dribbling*1);
    var mrlOPS = (firsttouch *1 + crossing*1 + passing*1 + creativity*1 + positioning*1);
    var scOPS = (shooting *1 + dribbling*1 + firsttouch*1 + heading*1 + positioning*1);
    var frlOPS = (shooting *1 + dribbling*1 + firsttouch*1 + crossing*1 + positioning*1);

    var gkk = (gk)* (conditionvalue / 100);
    var dck = (dc)* (conditionvalue / 100);
    var dlk = (dl)* (conditionvalue / 100);
    var drk = (dr)* (conditionvalue / 100);
    var swk = (sw)* (conditionvalue / 100);
    var dmck = (dmc)* (conditionvalue / 100);
    var mck = (mc)* (conditionvalue / 100);
    var amk = (am)* (conditionvalue / 100);
    var mlk = (ml)* (conditionvalue / 100);
    var mrk = (mr)* (conditionvalue / 100);
    var fck = (fc)* (conditionvalue / 100);
    var sck = (sc)* (conditionvalue / 100);
    var lwk = (lw)* (conditionvalue / 100);
    var rwk = (rw)* (conditionvalue / 100);

    var logo = document.createElement("div");
    logo.style.position = "fixed";
    logo.style.top = "10px";
    logo.style.right = "10px";
    document.body.appendChild(logo);
    
    // begin display box

    logo.innerHTML =
    '<div id="wrapper"><p id="analyse"><p class="dugtooltitle"><a target="_blank" href="' + FORUMLINK + '">' + APPNAME + '</a></p><table border="0" cellspacing="0" cellpadding="0">'
    + '<tr><td id="gk" class="background"><u>GK</u></td><td id="gk" class="background"><u>OPS</u></td></tr><tr><td id="gkv"  class=""> ' + (gkk.toFixed(1)) + ' (' + (gk.toFixed(1)) + ')</td><td id="gkv"  class="">' + gkOPS + '</td></tr>'
    + '<tr><td id="dc" class="background"><u>DC</u></td><td id="dc"  class="background"><u>OPS</u></td></tr><tr><td id="dcv" >' + (dck.toFixed(1)) + ' (' + (dc.toFixed(1)) + ')</td><td id="dcv">' + (dcOPS) + '</td></tr>'
    + '<tr><td id="dl" class="background"><u>DL</u></td><td id="dl" class="background"><u>OPS</u></td></tr><tr><td id="dlv"  class="">' + (dlk.toFixed(1)) + ' (' + (dl.toFixed(1)) + ')</td><td id="dlv" class="">' + (fbOPS) + '</td></tr>'
    + '<tr><td id="dr" class="background" ><u>DR</u></td><td id="dr" class="background"><u>OPS</u></td></tr><tr><td id="drv"  class="">' + (drk.toFixed(1)) + ' (' + (dr.toFixed(1)) + ')</td><td id="drv" class="">' + (fbOPS) + '</td></tr>'
    + '<tr><td id="sw" class="background"><u>SW</u></td><td  id="sw"  class="background"><u>OPS</u></td></tr><tr><td id="swv" >' + (swk.toFixed(1)) + ' (' + (sw.toFixed(1)) + ')</td><td id="swv">' + (dcOPS) + '</td></tr>'
    + '<tr><td id="dmc" class="background"><u>DMC</u></td><td id="dmc" class="background"><u>OPS</u></td></tr><tr><td id="dmcv"  class="">' + (dmck.toFixed(1)) + ' (' + (dmc.toFixed(1)) + ')</td><td id="dmcv" class="">' + (dmcOPS) + '</td></tr>'
    + '<tr><td id="mc" class="background"><u>MC</u></td><td id="mc" class="background"><u>OPS</u></td></tr><tr><td id="mcv" >' + (mck.toFixed(1)) + ' (' + (mc.toFixed(1)) + ')</td><td id="mcv">' + (mcOPS) + '</td></tr>'
    + '<tr><td id="am" class="background"><u>AM</u></td><td id="am" class="background"><u>OPS</u></td></tr><tr><td id="amv"  class="">' + (amk.toFixed(1)) + ' (' + (am.toFixed(1)) + ')</td><td id="amv" class="">' + (amcOPS) + '</td></tr>'
    + '<tr><td id="ml" class="background"><u>ML</u></td><td id="ml" class="background"><u>OPS</u></td></tr><tr><td id="mlv" >' + (mlk.toFixed(1)) + ' (' + (ml.toFixed(1)) + ')</td><td id="mlv">' + (mrlOPS) + '</td></tr>'
    + '<tr><td id="mr" class="background"><u>MR</u></td><td id="mr" class="background"><u>OPS</u></td></tr><tr><td id="mrv" >' + (mrk.toFixed(1)) + ' (' + (mr.toFixed(1)) + ')</td><td id="mrv">' + (mrlOPS) + '</td></tr>'
    + '<tr><td id="fc" class="background"><u>FC</u></td><td id="fc" class="background"><u>OPS</u></td></tr><tr><td id="fcv" class="">' + (fck.toFixed(1)) + ' (' + (fc.toFixed(1)) + ')</td><td id="fcv" class="">' + (scOPS) + '</td></tr>'
    + '<tr><td id="sc" class="background"><u>SC</u></td><td id="sc" class="background"><u>OPS</u></td><tr><td id="scv" >' + (sck.toFixed(1)) + ' (' + (sc.toFixed(1)) + ')</td><td id="scv">' + (scOPS) + '</td></tr>'
    + '<tr><td id="lw" class="background"><u>LW</u></td><td id="lw" class="background"><u>OPS</u></td></tr><tr><td id="lwv"  class="">' + (lwk.toFixed(1)) + ' (' + (lw.toFixed(1)) + ')</td><td id="lwv" class="">' + (frlOPS) + '</td></tr>'
    + '<tr><td id="rw" class="background"><u>RW</u></td><td id="rw" class="background"><u>OPS</u></td></tr><tr><td id="rwv"  class="">' + (rwk.toFixed(1)) + ' (' + (rw.toFixed(1)) + ')</td><td id="rwv" class="">' + (frlOPS) + '</td></tr>'
    +    '</table></p><p class="dugtoolfooter"><p id="condition">Fitness: ' + conditionvalue + '% </p><p id="condition">Form: ' + form + '% </p><p class="dugtoolfooter" id="captain">Captain: ' + captain + '</p><p class="dugtoolfooter" id="exp">Exp: ' + exp + '</p></div>';

    //end display box


    addGlobalStyle('#condition {font-weight: bold; text-align: center; border: 1px solid #53714d; margin-top: -10px; background: #ffffff;} .dugtoolfooter {font-weight: bold; text-align: center; background: #53714d; padding: 3px; color: #ffffff;} .background {background: #dde3db;} #wrapper p { line-height: 12px; }  #wrapper table tr td{font-size: 10px; font-weight:bold; width: 100px; padding: 2px; text-align: center; line-height: 12px;} .dugtooltitle {background: #53714d; text-align: center; padding: 3px; color: #ffffff; font-weight: bold; font-size: 12px;} #wrapper {position: absolute; top: 0px; right: 0px; width: 130px; padding-right: 4px; padding-left: 4px; border: 2px solid #53714d; background: #ffffff;}   #wrapper a {color:#ffffff; border-bottom: 1px solid #ffffff;}');

    // highlight position value

    // posArray now contains values from 0-3 (none, green, yellow, red)
    // posArray[0] = GK  (always 0 or 1 and never 2 or 3)
    // posArray[1] = DL
    // posArray[2] = DC
    // posArray[3] = DR
    // posArray[4] = ML
    // posArray[5] = MC
    // posArray[6] = MR
    // posArray[7] = FL
    // posArray[8] = FC
    // posArray[9] = FR

    // Goalkeeper
    if (position[0] > 0)
    {
            addGlobalStyle('#gk { background: #53714d; color: #ffffff;} #gkv { background: #53714d; color: #ffffff;} ');
    }

    // Defenders
    if ((position[1] > 0) || (position[2] > 0) || (position[3] > 0) )
    {
        //alert(position[1] + ' ' + position[2] + ' ' + position[3]);
        if (dc>dl & dc>dr & dc>sw)
        {
                addGlobalStyle('#dc { background: #53714d; color: #ffffff;} #dcv { background: #53714d; color: #ffffff;}');
        }

        if (dl>dc & dl>=dr & dl>sw)
        {
                addGlobalStyle('#dl { background: #53714d; color: #ffffff;} #dlv { background: #53714d; color: #ffffff;}');
        }

        if (dr>dc & dr>=dl & dr>sw)
        {
                addGlobalStyle('#dr { background: #53714d; color: #ffffff;} #drv { background: #53714d; color: #ffffff;}');
        }

        if (sw>dc & sw>dl & sw>dr)
        {
                addGlobalStyle('#sw { background: #53714d; color: #ffffff;} #swv { background: #53714d; color: #ffffff;}');
        }
    }

    // Midfielders
    if ((position[4] > 0) || (position[5] > 0) || (position[6] > 0) )
    {
        if (mc>dmc & mc>am & mc>ml & mc>mr)
        {
                addGlobalStyle('#mc { background: #53714d; color: #ffffff;} #mcv { background: #53714d; color: #ffffff;}');
        }

        if (dmc>mc & dmc>am & dmc>ml & dmc>mr)
        {
                addGlobalStyle('#dmc { background: #53714d; color: #ffffff;} #dmcv { background: #53714d; color: #ffffff;}');
        }

        if (am>dmc & am>mc & am>ml & am>mr)
        {
                addGlobalStyle('#am { background: #53714d; color: #ffffff;} #amv { background: #53714d; color: #ffffff;}');
        }

        if (ml>dmc & ml>mc & ml>am & ml>=mr)
        {
                addGlobalStyle('#ml { background: #53714d; color: #ffffff;} #mlv { background: #53714d; color: #ffffff;}');
        }

        if (mr>dmc & mr>mc & mr>am &mr>=ml)
        {
                addGlobalStyle('#mr { background: #53714d; color: #ffffff;} #mrv { background: #53714d; color: #ffffff;}');
        }
    }

    // Forwards 
    if ((position[7] > 0) || (position[8] > 0) || (position[9] > 0) )
    {
        if (fc>sc & fc>lw & fc>rw)
        {
                addGlobalStyle('#fc { background: #53714d; color: #ffffff;} #fcv { background: #53714d; color: #ffffff;}');
        }

        if (sc>fc & sc>lw & sc>rw)
        {
                addGlobalStyle('#sc { background: #53714d; color: #ffffff;} #scv { background: #53714d; color: #ffffff;}');
        }

        if (lw>fc & lw>sc & lw>=rw )
        {
                addGlobalStyle('#lw { background: #53714d; color: #ffffff;} #lwv { background: #53714d; color: #ffffff;}');
        }

        if (rw>fc & rw>sc & rw>=lw )
        {
                addGlobalStyle('#rw { background: #53714d; color: #ffffff;} #rwv { background: #53714d; color: #ffffff;}');
        }
    }

    // style for condition value

    switch (conditionvalue)
    {
        case (conditionvalue>90): addGlobalStyle('#condition {color: #53714d;}');break
        case (conditionvalue>80 & conditionvalue<91): addGlobalStyle('#condition {color: #5e6949;}');break
        case (conditionvalue>70 & conditionvalue<81): addGlobalStyle('#condition {color: #705d3f;}');break
        case (conditionvalue>60 & conditionvalue<71): addGlobalStyle('#condition {color: #855036;}');break
        case (conditionvalue>50 & conditionvalue<61): addGlobalStyle('#condition {color: #9c412c;}');break
        case (conditionvalue>40 & conditionvalue<51): addGlobalStyle('#condition {color: #b43121;}');break
        case (conditionvalue>30 & conditionvalue<41): addGlobalStyle('#condition {color: #cb2317;}');break
        case (conditionvalue>20 & conditionvalue<31): addGlobalStyle('#condition {color: #df140e;}');break
        case (conditionvalue>10 & conditionvalue<21): addGlobalStyle('#condition {color: #f10906;}');break
        case (conditionvalue>0 & conditionvalue<11): addGlobalStyle('#condition {color: #ff0000;}');break
    }

}

