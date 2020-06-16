var allMsgs;

$(document).ready(function(){
  $("#writingTxt").hide();

  //Getting cookies to see if token hasn't expired, cookies will expire few minutes before token
  var accessTokenCookie = Cookies.get('accessToken');
  var sessionTokenCookie = Cookies.get('sessionToken');

  //If token isnt expired refresh them, if it is expired acquire new one
  if(accessTokenCookie == null || sessionTokenCookie == null || accessTokenCookie == 'undefined' || sessionTokenCookie == "undefined"){
    userDataCookie = getToken();
    Cookies.remove('msgs');
    Cookies.set('noAnswer', 0);
    allMsgs = "";
  }else{
    userDataCookie = refreshToken(accessTokenCookie);
    allMsgs = Cookies.get('msgs');
  }
  Cookies.set('accessToken',userDataCookie['accessToken'], {expires:0.035});
  Cookies.set('sessionToken',userDataCookie['sessionToken'], {expires:0.035});
  $("#messageList").append(allMsgs);
  var messageBody = document.querySelector('#fullChat');
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

  //Refesh token every 5 mins
  setInterval(function(){
    userDataCookie = refreshToken(Cookies.get('accessToken'));
    Cookies.set('accessToken',userDataCookie['accessToken'], {expires:0.035});
    Cookies.set('sessionToken',userDataCookie['sessionToken'], {expires:0.035});
  }, 300000);

  //Listeners for message sending
  $('#sendBtn').on("click", function(){messageAction();});
  $('#messageText').on('keypress', function(e){
    if(e.which === 13){
      $(this).attr("disabled", "disabled");
      messageAction();
      $(this).removeAttr("disabled");
    }
  });

});


function getToken(){
    console.log("generating token");
    var userData = {};

    //Generate token using secret key in server side
    $.ajax({
      url: 'URLs/GetToken.php',
      type: 'POST',
      async: false,
      success: function(re){
        res = JSON.parse(re);
        userData["accessToken"]=res["accessToken"];
        userData["expiration"]=res["expiration"];
      }
    })
    $.ajax({
      url: 'https://api-gce3.inbenta.io/prod/chatbot/v1/conversation',
      type: 'POST',
      contentType: 'application/json',
      async: false,
      headers: {"x-inbenta-key" : "nyUl7wzXoKtgoHnd2fB0uRrAv0dDyLC+b4Y6xngpJDY=", "Authorization" : "Bearer " + userData["accessToken"]},
      success:function(res){
        userData["sessionToken"]=res["sessionToken"];
        userData["sessionId"]=res["sessionId"];
      }
    })
    return userData;
}


function refreshToken(accessToken){
  var userData = {};
  userData['sessionToken'] = Cookies.get('sessionToken');
  console.log("Refreshing token");
  $.ajax({
    url: 'https://api.inbenta.io/v1/refreshToken',
    type: 'POST',
    contentType: 'application/json',
    async: false,
    headers: {'x-inbenta-key' : 'nyUl7wzXoKtgoHnd2fB0uRrAv0dDyLC+b4Y6xngpJDY=',  "Authorization" : "Bearer " + accessToken},
    success: function(res){
      userData["accessToken"]=res["accessToken"];
    }
  })
  return userData;
}


function sendMessage(){
  var currMsg = $("#messageText").val();
  var noAnswer;
  var continueConv = true;

  $('#messageList').append('<li class="userSender">'+currMsg+'</li>');
  allMsgs = allMsgs + '<li class="userSender">'+currMsg+'</li>';

  //Check if force is in current msg
  var currMsgWords = currMsg.split(" ");
  currMsgWords.forEach(function(value, index){
    if(value.toLowerCase()=="force"){
      var locationList = getPokemonPlaces();
      $('#messageList').append('<li class="yodaSender">'+locationList+'</li>');
      allMsgs = allMsgs + '<li class="yodaSender">'+locationList+'</li>';
      Cookies.set('noAnswer', 0)
      continueConv = false;
    }
  })

  //If force not in current msg, proceed to answer
  if(continueConv){
    $.ajax({
      url: 'https://api-gce3.inbenta.io/prod/chatbot/v1/conversation/message',
      type: 'POST',
      async: false,
      headers: {'x-inbenta-key' : "nyUl7wzXoKtgoHnd2fB0uRrAv0dDyLC+b4Y6xngpJDY=", "Authorization" : 'Bearer '+Cookies.get('accessToken'), 'x-inbenta-session' : 'Bearer '+Cookies.get('sessionToken')},
      data: {"message" : currMsg},
      success: function(res){
        if(res['answers'][0]['flags'] == "no-results"){
          noAnswer = Cookies.get('noAnswer');
          noAnswer ++;
          Cookies.set('noAnswer', noAnswer);
          if(noAnswer > 1){
            var pokemonList = getPokemonList();
            $('#messageList').append('<li class="yodaSender">'+pokemonList+'</li>');
            allMsgs = allMsgs + '<li class="yodaSender">'+pokemonList+"</li>";
            Cookies.set('noAnswer', 0)
          }else{
            $('#messageList').append('<li class="yodaSender">'+res['answers'][0]['message']+'</li>');
            allMsgs = allMsgs + '<li class="yodaSender">'+res['answers'][0]['message']+"</li>";
          }
        }else{
          $('#messageList').append('<li class="yodaSender">'+res['answers'][0]['message']+'</li>');
          allMsgs = allMsgs + '<li class="yodaSender">'+res['answers'][0]['message']+"</li>";
          Cookies.set('noAnswer', 0)
        }
      }
    })
  }

  //Save and set current msg with response
  Cookies.set('msgs', allMsgs, {expires:0.035});
  $("#messageText").val("");

}


function getPokemonList(){
  var pokemonList = "<ul>";
  var pokedexNumber = Math.floor(Math.random()*20)+2;
  while(pokedexNumber==10){
    pokedexNumber = Math.floor(Math.random()*20)+2;
  }
  var pokemonUrl = 'https://pokeapi.co/api/v2/pokedex/'+pokedexNumber;

  $.ajax({
    url: pokemonUrl,
    method: 'GET',
    async:false,
    success: function(res){
      for(i=0;i<10;i++){
        pokemonList = pokemonList + '<li class="yodaSenderList">'+res['pokemon_entries'][Math.floor(Math.random()*res['pokemon_entries'].length)]['pokemon_species']['name']+'</li>';
      }
      pokemonList = pokemonList + '</ul>';
    }
  })
  return pokemonList;

  
}


function getPokemonPlaces(){
  var locationList = '<ul>'
  var location = Math.floor(Math.random()*20)+1;
  var url = 'https://pokeapi.co/api/v2/location/'+location;

  $.ajax({
    url: url,
    method: 'GET',
    async: false,
    success: function(res){
      for(i=0;i<res['names'].length;i++){
        locationList = locationList + '<li class="yodaSenderList">' + res['names'][i]['name'] + '</li>';
      }
      locationList = locationList + '</ul>';
    }
  })
  return locationList;
}


function messageAction(){
  if($("#messageText").val()!=""){
    $("#writingTxt").show();
    setTimeout(function(){
      sendMessage();
      $("#writingTxt").hide();
    },1000);
    var messageBody = document.querySelector('#fullChat');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }
}
