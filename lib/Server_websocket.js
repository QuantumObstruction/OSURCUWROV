url = "ws://localhost:4000/echo"; //http://localhost:4000/html5_websocket


w = new WebSocket(url);


w.onopen = function() {
  log("WebSocket is open");
}

w.message = function(v) {
  log(var.data.toString());
}

w.onclose =function(v){
  log("close");
}
w.onerror = function(v){
  log("error");
}

//window.onload = function(){
  //function to do stuff on page load
//}

function log(s) {
  var output = document.getElementById("output");
  car el = $("#output").after('<p>' + s + '</p>');


}
