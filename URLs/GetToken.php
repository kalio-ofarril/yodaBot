<?php

    $secret = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoieW9kYV9jaGF0Ym90X2VuIn0.anf_eerFhoNq6J8b36_qbD4VqngX79-yyBKWih_eA1-HyaMe2skiJXkRNpyWxpjmpySYWzPGncwvlwz5ZRE7eg';
    $bodyData = array('secret'=>$secret);

    $ch = curl_init('https://api.inbenta.io/v1/auth');
    curl_setopt_array($ch, array(
      CURLOPT_POST => TRUE,
      CURLOPT_RETURNTRANSFER => TRUE,
      CURLOPT_HTTPHEADER => array(
        'x-inbenta-key : nyUl7wzXoKtgoHnd2fB0uRrAv0dDyLC+b4Y6xngpJDY=',
        'Content-Type : application/json'
      ),
      CURLOPT_POSTFIELDS => json_encode($bodyData)
    ));

    $response = curl_exec($ch);

    if($response === FALSE){
      die(curl_error($ch));
    }

    $responseData = json_decode($response, TRUE);
    $accessToken = $responseData["accessToken"];
    $expiration = $responseData["expiration"];

    /*

    $ch = curl_init('https://api-gce3.inbenta.io/prod/chatbot/v1/conversation');
    curl_setopt_array($ch, array(
      CURLOPT_POST => TRUE,
      CURLOPT_RETURNTRANSFER => TRUE,
      CURLOPT_HTTPHEADER => array(
        'x-inbenta-key : nyUl7wzXoKtgoHnd2fB0uRrAv0dDyLC+b4Y6xngpJDY=',
        'Content-Type : application/json',
        "Authorization : Bearer ".$accessToken
      )
    ));

    $response = curl_exec($ch);
  //  $response["expiration"] = $expiration;
  //  $response["accessToken"] = $accessToken;

    if($response === FALSE){
      die(curl_error($ch));
    }
*/
    ECHO $response;
?>
