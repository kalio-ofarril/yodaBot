<!DOCTYPE html>
<html style="height:97%;">
  <head>
    <meta charset="utf-8">
    <title>Yoda Bot</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>
    <script src="yodaBot.js"></script>

    <link rel="stylesheet" type="text/css" href="yodaBot.css">
  </head>

  <body style='height:100%;'>
    <div id="fullChat" style='overflow-y:auto;height:100%;'>
      <div id="messageLog">
        <ul id="messageList">
        </ul>
      </div>

      <div id="writingTxt"><p>Writing...</p></div>
      <div id="messageInput">
        <input type="text" id="messageText" style="width:90%;">
        <input type="button" id="sendBtn" value="Send" style='width:8%;'>
      </div>
    </div>

  </body>
</html>
