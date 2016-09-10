function setBase(){
  var spSheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = spSheet.getDataRange().getDisplayValues();
  var Sheet = spSheet.getSheetByName("工作表1");
  for(i=1 ; i<=data.length ;i++){
    var status = Sheet.getRange(i, 1).getDisplayValue();
    var url = data[i-1][1];
    var datePost = data[i-1][2];
    var dateBase = Sheet.getRange(i, 4);;
    if(status == "" || status == "WAITING..."){
      if(url=="" && datePost == ""){
        Sheet.getRange(i, 1).clearContent();
      }
      else if(url=="" || datePost == ""){
        Sheet.getRange(i, 1).setValue("WAITING...");
      }
      else{
        date = new Date(datePost);
        today = new Date();
        date.setDate(date.getDate()+1);
        dateBase.setValue(date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate());
        datePost = new Date(dateBase);
        getZeroTime(datePost);
        if((today-datePost).valueOf() < 24 * 60 * 60 * 1000)
          Sheet.getRange(i, 1).setValue("ONE_DAY");
        else if((today-datePost).valueOf() < 3 * 24 * 60 * 60 * 1000)
          Sheet.getRange(i, 1).setValue("THREE_DAYS");
        else{
          Sheet.getRange(i, 1).setValue("FINISHED");
          var url = UrlShortener.Url.get(data[i-1][1], {
            projection: 'FULL'
          });
          Sheet.getRange(i, 6).setValue(url.analytics.allTime.shortUrlClicks);
          getReferrers(url,Sheet,i);
        }
      }
    }
    else{
      if(url=="" && datePost==""){
        Sheet.getRange(i, 1,0,5).clearContent();
      }
      else if(url=="" || datePost==""){
        Sheet.getRange(i, 1).setValue("WAITING...");
      }
    }
  }
}

function detectClicker() {
  var spSheet = SpreadsheetApp.getActiveSpreadsheet();
  var Sheet = spSheet.getSheetByName("工作表1");
  var today = new Date();
  getZeroTime(today);
  var data = spSheet.getDataRange().getDisplayValues();
  for(var i = 2; i<= data.length;i++){
    var status = data[i-1][0];
    var datePost = new Date(data[i-1][3]);
    getZeroTime(datePost);
    if(status == ""){
      Sheet.getRange(i, 1).setValue("WAITING...");
    }
    else if(status == "ONE_DAY"){
      if((today-datePost).valueOf() == 24 * 60 * 60 * 1000){
        Sheet.getRange(i, 1).setValue("THREE_DAYS");
        var url = UrlShortener.Url.get(data[i-1][1], {projection: 'FULL'});
        Sheet.getRange(i, 5).setValue(url.analytics.allTime.shortUrlClicks);
        getReferrers(url,Sheet,i);
      }
    }
    else if(status == "THREE_DAYS"){
      if((today-datePost).valueOf() >= 3 * 24 * 60 * 60 * 1000){
        Sheet.getRange(i, 1).setValue("FINISHED");
        var url = UrlShortener.Url.get(data[i-1][1], {projection: 'FULL'});
        Sheet.getRange(i, 6).setValue(url.analytics.allTime.shortUrlClicks);
        getReferrers(url,Sheet,i);
      }
    }
    else if(status == "FINISHED" || status == "WAITING..."){}
    else{
      status="ERROR";
    }
  }
}

function getZeroTime(day){
  day.setHours(0);
  day.setMinutes(0);
  day.setSeconds(0);
  day.setMilliseconds(0);
}

function getReferrers(url, sheet,row){
  var fb = 0;
  var pl = 0;
  var tw = 0;
  var gplus = 0;
  var Else = 0;
  var all = parseInt(url.analytics.allTime.shortUrlClicks);
  var ref= url.analytics.allTime.referrers;
  for (var i = 0 ; i < url.analytics.allTime.referrers.length ; i++) {
    switch(url.analytics.allTime.referrers[i].id){
      case "www.facebook.com":
      case "lm.facebook.com":
      case "l.facebook.com":
      case "m.facebook.com":
        fb+=parseInt(url.analytics.allTime.referrers[i].count);
        break;
      case "www.plurk.com":
        pl+=parseInt(url.analytics.allTime.referrers[i].count);
        break;
      case "www.twitter.com":
      case "t.co":
        tw+=parseInt(url.analytics.allTime.referrers[i].count);
        break;
      case "plus.google.com":
      case "plus.url.google.com":
        gplus+=parseInt(url.analytics.allTime.referrers[i].count);
        break;
      default:
        Else+=parseInt(url.analytics.allTime.referrers[i].count);
    }
  };
  sheet.getRange(row, 7).setValue(fb/all*100+"%");
  sheet.getRange(row, 8).setValue(pl/all*100+"%");
  sheet.getRange(row, 9).setValue(tw/all*100+"%");
  sheet.getRange(row, 10).setValue(gplus/all*100+"%");
  sheet.getRange(row, 11).setValue(Else/all*100+"%");
}