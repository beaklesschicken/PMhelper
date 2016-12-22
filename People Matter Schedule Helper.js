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
    gs('li.head-need-help span { margin-right:5px; cursor:pointer;}');
    gs('li.head-need-help span:hover { font-decoration: underline;}');
    gs('.cocktailer { border-radius: 3px; color:white; background-color: hsla(122, 100%, 23%, 0.5); }');
    gs('.cocktaileram {border-radius: 3px; color:black; font-weight: bold; background: repeating-linear-gradient(45deg, hsla(122, 100%, 23%, 0.5), hsla(122, 100%, 23%, 0.5) 10px, hsla(122, 100%, 23%, .25) 10px,hsla(122, 100%, 23%, .25) 20px); }');
    gs('.serveam {border-radius: 3px; color:white; font-weight: bold; background: repeating-linear-gradient(45deg, hsla(195, 61.6%, 42.9%, 1), hsla(195, 61.6%, 42.9%, 1) 10px, hsla(195, 61.6%, 42.9%, 0.5) 10px,hsla(195, 61.6%, 42.9%, 0.5) 20px); }');
    gs('.requestOff {border-radius: 3px; color:white; font-weight: bold; background: repeating-linear-gradient(45deg, hsla(0, 100%, 50%, 1), hsla(195, 61.6%, 42.9%, 1) 10px, hsla(0, 100%, 50%, 0.5) 10px,hsla(195, 61.6%, 42.9%, 0.5) 20px); };');
    gs('.person-table.overtime {border: 1px solid red !important;}');
    gs('.summaryBox {font-size:.8em;}');
    

jQuery(function($) {
    var servers = [];
    function shifts(svam, svpm, ctam, ctpm,svopen,ctopen,svclose,ctclose) {
        this.svam = svam;
        this.svpm = svpm;
        this.ctam = ctam;
        this.ctpm = ctpm;
        this.svopen = svopen;
        this.ctopen = ctopen;
        this.svclose = svclose;
        this.ctclose = ctclose;
        this.close= close;
    }
    var allShifts = [];
    var shiftMins = [];
    var monMin = new shifts(3,6,1,1,2,1,1,1);
    var tueMin = new shifts(0,0,0,0,0,0,0,0);
    var wedMin = new shifts(0,0,0,0,0,0,0,0);
    var thuMin = new shifts(0,0,0,0,0,0,0,0);
    var friMin = new shifts(0,0,0,0,0,0,0,0);
    var satMin = new shifts(0,0,0,0,0,0,0,0);
    var sunMin = new shifts(0,0,0,0,0,0,0,0);  
    shiftMins.push(monMin,tueMin,wedMin,thuMin,friMin,satMin,sunMin);

    
    function clearShifts() {
        var mon = new shifts(0,0,0,0,0,0,0,0);
        var tue = new shifts(0,0,0,0,0,0,0,0);
        var wed = new shifts(0,0,0,0,0,0,0,0);
        var thu = new shifts(0,0,0,0,0,0,0,0);
        var fri = new shifts(0,0,0,0,0,0,0,0);
        var sat = new shifts(0,0,0,0,0,0,0,0);
        var sun = new shifts(0,0,0,0,0,0,0,0);

        allShifts.length = 0;
        allShifts.push(mon,tue,wed,thu,fri,sat,sun);
        console.log(allShifts);
        $('.summaryBox').remove();
    }


    function removeBR() {
        clearShifts();
       $('div.shift').each(function() {
           var a = $(this).text().indexOf("11a");
           var b = $(this).text().indexOf("10a");
           var c = $(this).text().indexOf("10:30a");
           var d = $(this).closest('td').data('day-index'); //get the day number of the shift
           var e = $(this).text().indexOf("Close");
           if(!$(this).hasClass('shift-alt')) {
              if($(this).text().indexOf("CT") > -1) {
                 if( (a > -1) || (b > -1) || (c > -1) ) {
                     // This is an ctam shift
                     $(this).addClass('cocktaileram');
                     allShifts[d].ctam++;
                     checkClose(d,e,"ct");
                     checkOpen(d,b,"ct");
                     checkOpen(d,c,"ct");
                 } else {
                     // This is a ctpm shift
                     $(this).addClass('cocktailer');
                     allShifts[d].ctpm++;
                     checkClose(d,e,"ct");            
                 }
              } else if($(this).text().indexOf("Req Off") > -1) {
                    $(this).addClass('requestOff');
              } else {
                 if( (a > -1) || (b > -1) || (c > -1) ) {
                     $(this).addClass('serveam');
                     allShifts[d].svam++;
                     checkClose(d,e,"sv");
                     checkOpen(d,b,"sv");
                     checkOpen(d,b,"sv");
                 } else {
                     $(this).addClass('serverpm');
                     allShifts[d].svpm++;
                     checkClose(d,e,"sv");
                     checkOpen(d,b,"sv");
                 }
              }
           } else {
               $(this).css('opacity','0.5');
           }
       });
        $('div.timeline ul.intervals li').each(function() {
           var i = parseInt($(this).data('day'));
           $(this).append(injectIntoHead(i));
        });
    }
    


    function removeServers() {
      $('div.shift').each(function() {
          if($(this).text().indexOf("CT") === -1) {
              console.log($(this).closest('div.person-container').attr('id'));
              $(this).toggle();
              serversHidden = 1;
          }
      });
    }
    function checkClose(dayIndex,input,loc) {
         if(input > -1) {
             if(loc === "ct") {
               allShifts[dayIndex].ctclose++;  
             } else {
                allShifts[dayIndex].svclose++; 
             }
             
         }        
    }
    function checkOpen(dayIndex,input,loc) {
        if(input > -1) {
            if(loc === "ct") {
               allShifts[dayIndex].ctopen++; 
            } else {
                allShifts[dayIndex].svopen++;
            }
            
        }
    }
    function injectIntoHead(dayIndex) {
        if(!dayIndex < 1) {
            dayIndex = dayIndex - 1;
        } else {
            dayIndex = 6;
        }
        var tableInsert =  '<div class="summaryBox">';
            tableInsert += '  <table width="99%" cellspacing="0" cellpadding="0" class="summaryTable" id="sumTbl_' + dayIndex + '">';
            tableInsert += '    <tbody>';
            tableInsert += '        <tr>';
            tableInsert += '             <td>SV</td>';
            tableInsert += '            <td>&nbsp;</td>';
            tableInsert += '            <td>CT</td>';
            tableInsert += '        </tr>';
            tableInsert += '        <tr>';
            tableInsert += '            <td id="day_'+ dayIndex +'_svam">'+ checkMins(dayIndex,'svam') +'</td>';
            tableInsert += '            <td>AM</td>';
            tableInsert += '            <td id="day_'+ dayIndex +'_ctam">'+ checkMins(dayIndex,'ctam') +'</td>';
            tableInsert += '        </tr>';
            tableInsert += '        <tr>';
            tableInsert += '            <td id="day_'+ dayIndex +'_svpm">'+ allShifts[dayIndex].svpm +'</td>';
            tableInsert += '            <td>PM</td>';
            tableInsert += '            <td id="day_'+ dayIndex +'_ctpm">'+ allShifts[dayIndex].ctpm +'</td>';
            tableInsert += '        </tr>';
            tableInsert += '        <tr>';
            tableInsert += '            <td id="day_'+ dayIndex +'_svop">'+ allShifts[dayIndex].svopen +'</td>';
            tableInsert += '            <td>OPEN</td>';
            tableInsert += '            <td id="day_'+ dayIndex +'_cdop">'+ allShifts[dayIndex].ctopen +'</td>';
            tableInsert += '        </tr>';
            tableInsert += '                <tr>';
            tableInsert += '                    <td id="day_'+ dayIndex +'_svcl">'+ allShifts[dayIndex].svclose +'</td>';
            tableInsert += '                    <td>CLOSE</td>';
            tableInsert += '            <td id="day_'+ dayIndex +'_ctcl">'+ allShifts[dayIndex].ctclose +'</td>';
            tableInsert += '            </tr>';
            tableInsert += '   </tbody>';
            tableInsert += '  </table>';
            tableInsert += '</div>';
            return tableInsert;
    }
    
    function checkMins(dayIndex,param) {
        var curShift = allShifts[dayIndex][param];
        var minShift = shiftMins[dayIndex][param];
        if( curShift >= minShift ) {
            return '<span style="color:green;font-weight:bold" title="Minimum: '+ minShift + '">' + curShift + '</span>';
        } else {
            return '<span style="color:red; title="Minimum: '+ minShift + '">' + curShift + '</span>';
        }
    }
    

    $('li.head-need-help').html('<span id="addedBtn">Colorize</span>');
    $('#addedBtn').click(function() { removeBR(); });
    $('#ctOnly').click(function() { removeServers(); });
    
    setTimeout(function() {
        $('.manage-templates-bar').hide();
    },2000);

});
