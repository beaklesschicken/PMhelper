// ==UserScript==
// @name         People Matter Schedule Helper
// @namespace    http://beaklesschicken.com/scripts
// @version      0.1
// @description  Helps with people matter SCHEDULE module
// @author       Eric
// @match        https://my.peoplematter.com/haciendafiesta/Schedule/ManageSchedule/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
function gs(css) {
var head, style;
head = document.getElementsByTagName('head')[0];
if (!head) { return; }
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);
}

//gs('.schedule-statistics-panel { display:none !important; }');
gs('.shift { font-weight: normal !important; font-size: .8em !important; border-radius: 3px; padding-left: .125em !important; padding-right: .125em !important; padding-top: 0em !important; padding-bottom: 0em !important; margin-left:9px !important;}');
gs('.tasks { display: inline !important; font-size:.8em !important;}');
gs('.person-table { font-size:1em !important;}');
gs('.sprite {zoom:.75 !important;};');
gs('body { line-height:normal !important;}');
//gs('.hours-cost-info {margin:0px !important; font-size:1rem !important;}');
gs('.day-shifts-cell {height:auto !important;}');
gs('.day-shifts {height:auto !important;}');
//gs('.btn-detailed-info {background-color:transparent !important; height:auto !important;}');
gs('.day-shift { font-weight: normal !important; font-size: .8em !important; padding-left: .125em !important; padding-right: .125em !important; padding-top: 0em !important; padding-bottom: 0em !important; margin-right:9px !important;}');
gs('span#addedBtn {cursor:pointer;}');
gs('.cocktailer { border-radius: 3px; color:white; background-color: hsla(122, 100%, 23%, 0.5); }');
gs('.cocktaileram {border-radius: 3px; color:black; font-weight: bold; background: repeating-linear-gradient(45deg, hsla(122, 100%, 23%, 0.5), hsla(122, 100%, 23%, 0.5) 10px, hsla(122, 100%, 23%, .25) 10px,hsla(122, 100%, 23%, .25) 20px); }');
gs('.serveam {border-radius: 3px; color:white; font-weight: bold; background: repeating-linear-gradient(45deg, hsla(195, 61.6%, 42.9%, 1), hsla(195, 61.6%, 42.9%, 1) 10px, hsla(195, 61.6%, 42.9%, 0.5) 10px,hsla(195, 61.6%, 42.9%, 0.5) 20px); }');
gs('.closer {border:2px solid black !important;}');
// format the tables we're going to add
gs('.tg  {border-collapse:collapse;border-spacing:0; width: 98%;}');
gs('.tg td{font-family:Arial, sans-serif;font-size:10px;padding:0px 0px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}');
gs('.tg th{font-family:Arial, sans-serif;font-size:10px;font-weight:bold;padding:0px 0px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}');
gs('.tg .tg-nrw1{font-size:10px;text-align:center;}');
gs('.tg .tg-3j8g{font-weight:bold;font-size:10px;text-align:center;padding:0px 0px;line-height:10px;}');
gs('.timeline .intervals li button, .timeline .intervals li span {padding:0px 0px !important;}');

jQuery(function($) {
    var mTimes = ["8a","9a","10a","10:30a","11a","11:30a","12a"];
    var nTimes = ["3p","4P","4:30p","5p","5:30p","6p"];
    var oTimes = ["10a","10:30a"];
    var days = [];
    function shifts(svam, svpm, ctam, ctpm, opendr, openct, closeamdr, closepmdr,closeamct, closepmct, dayName) {
        this.svam = svam; //0
        this.svpm = svpm; //1
        this.ctam = ctam; //2
        this.ctpm = ctpm; //3
        this.opendr = opendr; //4
        this.openct = openct; //5
        this.closeamdr = closeamdr; //6
        this.closepmdr = closepmdr; //7
        this.closeamct = closeamct; //8
        this.closepmct = closepmct; //9
        this.dayName = dayName;
    }
    function resetAll() {
        days[0] = new shifts(0,0,0,0,0,0,0,0,0,0,"Monday");
        days[1] = new shifts(0,0,0,0,0,0,0,0,0,0,"Tuesday");
        days[2] = new shifts(0,0,0,0,0,0,0,0,0,0,"Wednesday");
        days[3] = new shifts(0,0,0,0,0,0,0,0,0,0,"Thursday");
        days[4] = new shifts(0,0,0,0,0,0,0,0,0,0,"Friday");
        days[5] = new shifts(0,0,0,0,0,0,0,0,0,0,"Saturday");
        days[6] = new shifts(0,0,0,0,0,0,0,0,0,0,"Sunday");
    }
    resetAll();

    function shiftInfo(input) {
        var output;
        if(mTimes.indexOf(input) > -1) { output = 0; } // Means morning shift
        if(nTimes.indexOf(input) > -1) { output = 1; } // Means evening shift
        return parseInt(output);
    }
    function removeBR() {
		resetAll();
        $('div.shift').each(function() {
            var dayNum = parseInt($(this).closest('td').data('day-index')); //get the day number of the shift
            if(!$(this).hasClass('shift-alt')) {
                var isCT,isOpen,isClose = false;
                var shifter = $(this).text().replace(/(\r\n|\n|\r)/gm,"").trim().replace(/\s+/g," "); // Clean the shift infomration
                var sTime = shifter.substring(0,shifter.indexOf(" - "));

                if( $(this).text().indexOf("CT") > -1) { isCT = true; $(this).addClass('cocktailer');} // Is a CT shift
                if(shifter.indexOf("Close") > -1) { isClose = true; $(this).addClass('closer');} // Is a closing shift
                if($.inArray(sTime,oTimes) > -1) { isOpen = true; $(this).addClass('opener');} //IS an opening shift

                if(shiftInfo(sTime) === 0) {
                    // this IS an AM shift
                    if(isCT === true) {  // IS a cocktail shift
                        $(this).addClass('cocktaileram');
                        days[dayNum].ctam += 1;
                        if(isClose === true) { days[dayNum].closeamct += 1; } // IS a closing shift
                        if(isOpen === true) { days[dayNum].openct += 1; } // add to openct
                    } else { // IS a server shift
                        days[dayNum].svam += 1;
                        if(isOpen === true) { days[dayNum].opendr += 1; } // add to opendr
                        if(isClose === true) { days[dayNum].closeamdr += 1;}
                    }
                } else {
                    // it's a PM shift
                    if(isCT === true) {  // IS a cocktail shift
                        $(this).addClass('cocktailer');
                        days[dayNum].ctpm += 1;
                        if(isClose === true) { days[dayNum].closepmct += 1; } // IS a closing shift
                    } else { // IS a server shift
                        days[dayNum].svpm += 1;
                        if(isClose === true) { days[dayNum].closepmdr += 1; } // IS a closing shift
                    }
                }
            } else {
                $(this).css('opacity','0.5');
            }
        });
        console.log(days);
        addTables();
    }
    function addTables() {
        var tbl = [];
        for(i = 0; i <= 6; i++) {
            tbl[i] = '<table class="tg">';
            tbl[i] += '  <tr>';
            tbl[i] += '    <th class="tg-nrw1"></th>';
            tbl[i] += '    <th class="tg-3j8g">AM</th>';
            tbl[i] += '    <th class="tg-3j8g">PM</th>';
            tbl[i] += '    <th class="tg-3j8g">OP</th>';
            tbl[i] += '   <th class="tg-3j8g">CL</th>';
            tbl[i] += '  </tr>';
            tbl[i] += '  <tr>';
            tbl[i] += '    <td class="tg-3j8g">DR</td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="amdr_' + i + '">' + days[i].svam + '</span></td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="pmdr_' + i + '">' + days[i].svpm + '</span></td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="drop_' + i + '">' + days[i].opendr + '</span></td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="drcl_' + i + '">' + days[i].closeamdr + "/" + days[i].closepmdr + '</span></td>';
            tbl[i] += '  </tr>';
            tbl[i] += '  <tr>';
            tbl[i] += '    <td class="tg-3j8g">CT</td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="amct_' + i + '">' + days[i].ctam + '</span></td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="pmct_' + i + '">' + days[i].ctpm + '</span></td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="ctop_' + i + '">' + days[i].openct + '</span></td>';
            tbl[i] += '    <td class="tg-nrw1"><span id="ctcl_' + i + '">' + days[i].closeamct + "/" + days[i].closepmct + '</span></td>';
            tbl[i] += '  </tr>';
            tbl[i] += '</table>';
        }
        // add the table to each day
        $('div.timeline ul.week-view li').each(function() {
            // get the day label so it's consistent
            var day = parseInt($(this).data('day'));
            $(this).append( tbl[day] );

        });
    }
    function removeServers() {
        $('div.shift').each(function() {
            if($(this).text().indexOf("CT") === -1) {
                $(this).toggle();
                serversHidden = 1;
            }
        });
    }
    $('li.head-need-help').html('<span id="addedBtn">Colorize </span><span id="ctOnly">CT Only</span>');
    $('#addedBtn').click(function() { removeBR(); });
    $('#ctOnly').click(function() { removeServers(); });

    setTimeout(function() {
        $('.manage-templates-bar').hide();
    },2000);

});

