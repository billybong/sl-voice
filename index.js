//Lets require/import the HTTP module
let http = require('http');
const PORT=8080;

const url = 'http://api.sl.se/api2/TravelplannerV2/trip.json?key=d7fc5882ad224eea81f8e6d53e92784f&originId=Eriks%C3%B6v%C3%A4gen&destId=DESTINATION&lineInc=670';
const toCity = url.replace("DESTINATION", "Tekniska%20h%C3%B6gskolan&lineInc=670");
const toVaxholm = url.replace("DESTINATION", "Vaxholm");
const voice = 'voice_cmu_us_clb_arctic_clunits';

var agent = require('superagent-promise')(require('superagent'), Promise);
var say = require('say');

//remove this to talk
//say.speak = console.log;

function nextTrips(url, destinationName){
    return agent.get(url)
      .then(function onResult(res) {
          const starts = res.body.TripList.Trip.map((trip)=> trip.LegList.Leg.Origin.time);
          say.speak("Next bus to " + destinationName + " leaves " + starts[0] + " and then " + starts[1], voice, 1.0, (err)=>{if(err)console.log(err)});
      }).catch((err)=>console.log(err));
}

//Create a server
var server = http.createServer((request, response)=>{
  if(request.url === "/vaxholm"){
    nextTrips(toVaxholm, "Vaxholm");
    response.end("ok");
  }else if(request.url ==="/tekniska"){
    nextTrips(toCity, "stockholm");
    response.end("ok");
  }else{
    response.statusCode = 404;
    response.end("not found");
  }
});

//Lets start our server
server.listen(PORT, function(){
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s", PORT);
});
