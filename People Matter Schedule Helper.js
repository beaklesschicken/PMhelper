// ==UserScript==
// @name         People Matter Schedule Helper
// @namespace    https://githubusercontent.com/beaklesschicken/PMhelper/
// @version      0.2
// @description  Helps with people matter SCHEDULE module
// @author       Eric
// @match        https://my.peoplematter.com/haciendafiesta/Schedule/ManageSchedule/*
// @download	 https://raw.githubusercontent.com/beaklesschicken/PMhelper/master/People%20Matter%20Schedule%20Helper.js
// @update		 https://raw.githubusercontent.com/beaklesschicken/PMhelper/master/People%20Matter%20Schedule%20Helper.js
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
    //gs('.serveram {border-radius: 3px; color:black; font-weight: bold; background: repeating-linear-gradient(45deg, hsla(195, 62%, 43%, 0.5), hsla(195, 62%, 43%, 0.5) 10px, hsla(195, 62%, 43%, .25) 10px,hsla(195, 62%, 43%, .25) 20px); }');
    gs('.serveam {border-radius: 3px; color:black; font-weight: bold; background: repeating-linear-gradient(45deg, hsla(195, 61.6%, 42.9%, .5), hsla(195, 61.6%, 42.9%, .5) 10px, hsla(195, 61.6%, 42.9%, 0.25) 10px,hsla(195, 61.6%, 42.9%, 0.25) 20px); }');
    gs('.closer {border:2px solid black !important;}');
    // format the tables we're going to add
    gs('.tg  {border-collapse:collapse;border-spacing:0; width: 98%;}');
    gs('.tg td{font-family:Arial, sans-serif;font-size:10px;padding:0px 0px;border-style:solid;border-width:1px;border-color:#cccccc;overflow:hidden;word-break:normal;}');
    gs('.tg th{font-family:Arial, sans-serif;font-size:10px;font-weight:bold;padding:0px 0px;border-style:solid;border-width:1px;border-color:#cccccc;overflow:hidden;word-break:normal;background-color:#e6f4f9;}');
    gs('.tg .tg-nrw1{font-size:10px;text-align:center;}');
    gs('.tg .tg-3j8g{font-weight:bold;font-size:10px;text-align:center;padding:0px 0px;}');
    gs('.timeline .intervals li button, .timeline .intervals li span {padding:0px 0px !important;}');
    
    jQuery(function($) {
        var mTimes = ["8a","9a","10a","10:30a","11a","11:30a","12a"];
        var nTimes = ["3p","4P","4:30p","5p","5:30p","6p"];
        var oTimes = ["8a","10a","10:30a"];
        var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        var days = [];
        var shiftIds = {
            "Service":"",
            "Kitchen":"",
            "Host":""
        }

        // Construct the objects
        function day(dayNum,dayName,servers,kitchen,hosts,totalEmps) {
            this.dayNum = dayNum;
            this.dayName = dayName;
            this.servers = servers;
            this.kitchen = kitchen;
            this.hosts = hosts;
            this.totalEmps = totalEmps;
        }
        function serverShifts(amdr, pmdr, amct, pmct, opendr, openct, closeamdr, closepmdr,closeamct, closepmct) {
            this.amdr = amdr; //0
            this.pmdr = pmdr; //1
            this.amct = amct; //2
            this.pmct = pmct; //3
            this.opendr = opendr; //4
            this.openct = openct; //5
            this.closeamdr = closeamdr; //6
            this.closepmdr = closepmdr; //7
            this.closeamct = closeamct; //8
            this.closepmct = closepmct; //9
        }
        function kitchenShifts(open1, open2, closeam, closepm, steam1, steam2, cold1, cold2, grill1, grill2, pull1, pull2, fry) {
            this.open1 = open1;
            this.open2 = open2;
            this.closeam = closeam;
            this.closepm = closepm;
            this.steam1 = steam1;
            this.steam2 = steam2;
            this.cold1 = cold1;
            this.cold2 = cold2;
            this.grill1 = grill1;
            this.grill2 = grill2;
            this.pull1 = pull1;
            this.pull2 = pull2;
            this.fry = fry;
        }
        function hostShifts(open,closeam,closepm,seater,greeter,controller,ftg1,ftg2) {
            this.open = open;
            this.closeam = closeam;
            this.closepm = closepm;
            this.seater = seater;
            this.greeter = greeter;
            this.controller = controller;
            this.ftg1 = ftg1;
            this.ftg2 = ftg2;
        }
        // Construct the objects
        function createDays() {
            for(i=0;i<dayNames.length;i++) {
                a = new serverShifts(0,0,0,0,0,0,0,0,0,0);
                b = new kitchenShifts(0,0,0,0,0,0,0,0,0,0,0,0,0);
                c = new hostShifts(0,0,0,0,0,0,0,0);
                z = new day(i, dayNames[i],a,b,c,0);
               days[i] = z;
            }
            console.log(days);
        }
        createDays();

        function resetAll() {
            for(i=0;i<dayNames.length;i++) {
                days[i].servers = new serverShifts(0,0,0,0,0,0,0,0,0,0);
                days[i].kitchen = new kitchenShifts(0,0,0,0,0,0,0,0,0,0,0,0,0);
                days[i].hosts = new hostShifts(0,0,0,0,0,0,0,0);                  
            }
 
        }            
        function shiftInfo(input) {
            var output;
            if(mTimes.indexOf(input) > -1) { output = 0; } // Means morning shift
            if(nTimes.indexOf(input) > -1) { output = 1; } // Means evening shift
            return parseInt(output);
        }
        function BuildServers() {
            // Build the server numbers
            //resetAll();
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
                            days[dayNum].servers.amct += 1;
                            if(isClose === true) { days[dayNum].servers.closeamct += 1; } // IS a closing shift
                            if(isOpen === true) { days[dayNum].servers.openct += 1; } // add to openct
                        } else { // IS a server shift
                            $(this).addClass('serveam');
                            days[dayNum].servers.amdr += 1;
                            if(isOpen === true) { days[dayNum].servers.opendr += 1; } // add to opendr
                            if(isClose === true) { days[dayNum].servers.closeamdr += 1;}
                        }
                    } else {
                        // it's a PM shift
                        if(isCT === true) {  // IS a cocktail shift
                            $(this).addClass('cocktailer');
                            days[dayNum].servers.pmct += 1;
                            if(isClose === true) { days[dayNum].servers.closepmct += 1; } // IS a closing shift
                        } else { // IS a server shift
                            days[dayNum].servers.pmdr += 1;
                            if(isClose === true) { days[dayNum].servers.closepmdr += 1; } // IS a closing shift
                        }
                    }
                } else {
                    $(this).css('opacity','0.5');
                }
            });
            console.log(days);
            addTables("servers");
        } // End Build Servers
        function BuildKitchen() {
            $('div.shift').each(function() {
                var dayNum = parseInt($(this).closest('td').data('day-index')); //get the day number of the shift
                if(!$(this).hasClass('shift-alt')) {
                    var isOpen,isClose = false;
                    var shifter = $(this).text().replace(/(\r\n|\n|\r)/gm,"").trim().replace(/\s+/g," "); // Clean the shift infomration
                    var sTime = shifter.substring(0,shifter.indexOf(" - "));
                    var whichOpen = $.inArray(sTime,oTimes);

                    if(shifter.indexOf("Close") > -1) { isClose = true; $(this).addClass('closer');} // Is a closing shift
                    if(whichOpen > -1) {  isOpen = true; $(this).addClass('opener');} //IS an opening shift
    
                    if(shiftInfo(sTime) === 0) {
                        // this IS an AM shift
                        $(this).addClass('serveam');
                            days[dayNum].kitchen.am += 1;
                        if(isOpen === true) {
                            if(whichOpen === 0 ) { days[dayNum].kitchen.open1 += 1;}
                            if(whichOpen === 1 ) { days[dayNum].kitchen.open2 += 1;}
                        }
                        if(isClose === true) { days[dayNum].kitchen.closeam += 1; }
                        days[dayNum].kitchen.steam1 += 1; // USING THIS IS A PLACE HOLDER FOR TOTAL SHIFTS
                    } else {
                        // it's a PM shift
                        if(isClose === true) { days[dayNum].kitchen.closepm += 1; } // IS a closing shift
                        days[dayNum].kitchen.steam2 += 1; // USING THIS IS A PLACE HOLDER FOR TOTAL SHIFTS   
                    }
                } else {
                    $(this).css('opacity','0.5');
                }
            });            
            addTables("kitchen");
        }
        function addTables(dep) {
            var tbl = [];
            // Remove any existing table from the DOM
            $('table.tg').remove();
            console.log(dep);
            if(dep === "servers") {
                for(i = 0; i <= 6; i++) {
                    tbl[i] = '<table class="tg">';
                    tbl[i] += '  <tr>';
                    tbl[i] += '    <th class="tg-3j8g" colspan=5>SERVERS</th>';
                    tbl[i] += '  <tr>';
                    tbl[i] += '    <td class="tg-3j8g"></td>';
                    tbl[i] += '    <td class="tg-3j8g">AM</td>';
                    tbl[i] += '    <td class="tg-3j8g">PM</td>';
                    tbl[i] += '    <td class="tg-3j8g">OP</td>';
                    tbl[i] += '    <td class="tg-3j8g" title="(Close AM / Close PM)">CL<sup class="srvrClose">?</sup></td>';
                    tbl[i] += '  </tr>';
                    tbl[i] += '  <tr>';
                    tbl[i] += '    <td class="tg-3j8g">DR</td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="amdr_' + i + '">' + days[i].servers.amdr + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="pmdr_' + i + '">' + days[i].servers.pmdr + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="drop_' + i + '">' + days[i].servers.opendr + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="drcl_' + i + '">' + days[i].servers.closeamdr + "/" + days[i].servers.closepmdr + '</span></td>';
                    tbl[i] += '  </tr>';
                    tbl[i] += '  <tr>';
                    tbl[i] += '    <td class="tg-3j8g">CT</td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="amct_' + i + '">' + days[i].servers.amct + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="pmct_' + i + '">' + days[i].servers.pmct + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="ctop_' + i + '">' + days[i].servers.openct + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span id="ctcl_' + i + '">' + days[i].servers.closeamct + "/" + days[i].servers.closepmct + '</span></td>';
                    tbl[i] += '  </tr>';
                    tbl[i] += '  <tr>';
                    tbl[i] += '</table>';
                }
            } // if dep === servers

            if(dep === "kitchen") {
                for(i = 0; i <= 6; i++) {
                    tbl[i] = '<table class="tg">';
                    tbl[i] += '  <tr>';
                    tbl[i] += '    <th class="tg-3j8g" colspan=5>KITCHEN</th>';         
                    tbl[i] += '  </tr>';
                    tbl[i] += '  <tr>';
                    tbl[i] += '    <td class="tg-3j8g"></td>';
                    tbl[i] += '    <td class="tg-3j8g">AM</td>';  
                    tbl[i] += '    <td class="tg-3j8g">PM</td>';  
                    tbl[i] += '    <td class="tg-3j8g" title="Open @ 8 / Open @ 10">OP</td>';  
                    tbl[i] += '    <td class="tg-3j8g" title="Close AM / Close PM">CL</td>';           
                    tbl[i] += '  </tr>';
                    tbl[i] += '  <tr>';
                    tbl[i] += '    <td class="tg-3j8g"></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span>' + days[i].kitchen.steam1 + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span>' + days[i].kitchen.steam2 + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span>' + days[i].kitchen.open1 + "/" + days[i].kitchen.open2 + '</span></td>';
                    tbl[i] += '    <td class="tg-nrw1"><span>' + days[i].kitchen.closeam + "/" + days[i].kitchen.closepm +'</span></td>';
                    tbl[i] += '  </tr>';
                    // tbl[i] += '  <tr>';
                    // tbl[i] += '    <td class="tg-3j8g">Steam</td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">'+ i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i +'</span></td>';
                    // tbl[i] += '  </tr>';
                    // tbl[i] += '  <tr>';
                    // tbl[i] += '    <td class="tg-3j8g">Cold</td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">'+ i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i +'</span></td>';
                    // tbl[i] += '  </tr>';
                    // tbl[i] += '  <tr>';
                    // tbl[i] += '    <td class="tg-3j8g">Grill1</td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">'+ i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i +'</span></td>';
                    // tbl[i] += '  </tr>';
                    // tbl[i] += '  <tr>';
                    // tbl[i] += '    <td class="tg-3j8g">Grill2</td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">'+ i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i +'</span></td>';
                    // tbl[i] += '  </tr>';
                    // tbl[i] += '  <tr>';
                    // tbl[i] += '    <td class="tg-3j8g">Pull</td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">'+ i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i +'</span></td>';
                    // tbl[i] += '  </tr>';
                    // tbl[i] += '  <tr>';
                    // tbl[i] += '    <td class="tg-3j8g">Fry</td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">'+ i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i + '</span></td>';
                    // tbl[i] += '    <td class="tg-nrw1"><span id="' + i + '">' + i +'</span></td>';
                    // tbl[i] += '  </tr>';
                    tbl[i] +=' </table>';
                }
            } // if dep === kitchen

            // add the table to each day
            $('div.timeline ul.week-view li').each(function() {
                // get the day label so it's consistent
                var day = parseInt( $(this).data('day') );
                if(day === 0) {
                    $(this).append( tbl[6] );
                } else {
                    $(this).append( tbl[day - 1] );
                }
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
        var addBtn = '';
        addBtn += '<li class="dropdown">';
        addBtn += '  <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="PM Helper" id="pmHelperDropdown">PM Helper<b class="caret"></b>';
        addBtn += '            <ul class="dropdown-menu">';
        addBtn += '                <li>';
        addBtn += '                    <a href="#" title="Servers" id="showServers">Servers</a>';
        addBtn += '                    <a href="#" title="CT Only" id="ctOnly">CT Only</a>';
        addBtn += '                </li>';
        addBtn += '                <li>';
        addBtn += '                    <a href="#" title="Kitchen" id="showKitchen">Kitchen</a>';
        addBtn += '                </li>';
        addBtn += '                <li>';
        addBtn += '                    <a href="#" title="Hosts"id="showHosts">Hosts</a>';
        addBtn += '                </li>';
        addBtn += '            </ul>';
        addBtn += '</li>';
                
        $('ul.nav').append(addBtn);
        $('#showServers').click(function() { BuildServers(); });
        $('#ctOnly').click(function() { removeServers(); });
        $('#showKitchen').click(function() { BuildKitchen();});
    
        setTimeout(function() {
            $('.manage-templates-bar').hide();
            $('#pmHelperDropdown').click();
        },2000);

    });
    
    
