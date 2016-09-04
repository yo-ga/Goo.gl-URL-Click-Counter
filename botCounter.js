function setBase(){
  var spSheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = spSheet.getDataRange().getDisplayValues();
  var Sheet = spSheet.getSheetByName("工作表1");
  for(i=1 ; i<=data.length ;i++){
    Logger.log("F"+data.length+" "+data[data.length-1].length);
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
        if((today-date).valueOf() < 24 * 60 * 60 * 1000)
          Sheet.getRange(i, 1).setValue("ONE_DAY");
        else
          Sheet.getRange(i, 1).setValue("THREE_DAYS");
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
  Logger.log(1);
  for(var i = 2; i<= data.length;i++){
    var status = data[i-1][0];
    var datePost = new Date(data[i-1][3]);
    getZeroTime(datePost);
    if(status == ""){
      Sheet.getRange(i, 1).setValue("WAITING...");
      Logger.log("2-1");
    }
    else if(status == "ONE_DAY"){
      Logger.log("2-2");
      if((today-datePost).valueOf() == 24 * 60 * 60 * 1000){
        Logger.log("2-2-1");
        Sheet.getRange(i, 1).setValue("THREE_DAYS");
        var url = UrlShortener.Url.get(data[i-1][1], {projection: 'ANALYTICS_CLICKS'});
        Sheet.getRange(i, 5).setValue(url.analytics.allTime.shortUrlClicks);
        Logger.log(url.analytics.week.shortUrlClicks);
      }
    }
    else if(status == "THREE_DAYS"){
      if((today-datePost).valueOf() == 3 * 24 * 60 * 60 * 1000){
        Sheet.getRange(i, 1).setValue("FINISHED");
        var url = UrlShortener.Url.get(data[i-1][1], {
          projection: 'ANALYTICS_CLICKS'
        });
        Sheet.getRange(i, 6).setValue(url.analytics.allTime.shortUrlClicks);
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