window.onload = function(){
  (function(){
    var show = function(el){
      return function(msg){ el.innerHTML = msg + '<br />' + el.innerHTML; }
    }(document.getElementById('msgs'));

    var ws       = new WebSocket('ws://' + window.location.host + window.location.pathname);
    ws.onopen    = function()  { show('websocket opened'); };
    ws.onclose   = function()  { show('websocket closed'); }
    ws.onmessage = function(m) { show('websocket message: ' +  m.data); };

    var sender = function(f){
      var input     = document.getElementById('input');
      input.onclick = function(){ input.value = "" };
      f.onsubmit    = function(){
        ws.send(input.value);
        input.value = "send a message";
        return false;
      }
    }(document.getElementById('form'));
  })();
}

$(function(){

  window.session = new Session(false);
  window.config = new Config();

  setupEditor();

  loadDefaultIP();

  $("#getLogs").click(getLogs);

  $("#getConfig").click(window.config.getConfig);
  $("#pushConfig").click(window.config.pushConfig);

  $(document).ajaxSend(function(event, request, settings) {
    $('#loading-indicator').show();
  });

  $(document).ajaxComplete(function(event, request, settings) {
    $('#loading-indicator').hide();
  });
});

function setupEditor() {
  window.editor = ace.edit("editor");

  // Change the mode to ini
  var JavaScriptMode = ace.require("ace/mode/ini").Mode;
  editor.session.setMode(new JavaScriptMode());
  editor.$blockScrolling = Infinity
}

function getLogs() {
  console.log("Getting logs...");

  $.ajax({
    url: "/logs/"+getRobotIP(),
  }).done(function(result) {
    console.log(result);
  });
}

function getRobotIP() {
  var robotIP = $('input[name=robotIP]').filter(':checked' ).val();
  if (robotIP == 'other') {
    robotIP = $('#ip').val();
  }
  session.setItem("defaultIP", robotIP);

  return robotIP
}

function loadDefaultIP() {
  var defaultIP = session.getItem("defaultIP");
  if (defaultIP) {
    if (defaultIP.match(/roborio-\d{1,5}-frc\.local/)) {
      $("input.ip[value='" + defaultIP + "']").prop("checked", true)
    } else {
      $("#ip").val(defaultIP);
      $("input.ip[value='other']").prop("checked", true)
    }
  }
}
