$(function() {
  'use strict';

  /*
  function logObject(obj) {
    $("#response").append("<br> New Object: " + obj);
    Object.keys(obj).forEach(function (key) {
      $("#response").append("<br> " + key + ": " + obj[key]);
    });
  }
  */
  function logMsg(msg) {
	  
	// message display
    [
      'type', 'id', 'threadId', 'body', 'delivery', 'deliveryStatus', 'read'
    , 'receiver', 'sender', 'timestamp', 'messageClass'
    ].forEach(function (key) {
      $("#response").append("<br> " + key + ": " + msg[key]);
    });
  }

  $('form#sms-form').on("submit", function (ev) {
    $("#response").html("submit form");
    ev.preventDefault();
    ev.stopPropagation();
	
	// Encryption
	var message = $('[name=msg]').val();

	var pwUtf8 = new TextEncoder().encode(message);
	var pwHash = crypto.subtle.digest('SHA-256', pwUtf8); 

	var iv = crypto.getRandomValues(new Uint8Array(20));
	var alg = { name: 'AES-GCM', iv: iv };
	var key = crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']);

	var cryptedMessage = crypto.subtle.encrypt(alg, key, ptUtf8);
	
	
	// Decryption
	var decryptedMessage = crypto.subtle.decrypt(alg, key, cryptedMessage);

    var msg = decryptedMessage
      , phone = $('[name=phone]').val()
      , request;

    $("#response").html("got values");

    request = navigator.mozMobileMessage.send(phone, msg);
    $("#response").html("tried to send message");

    $("#response").html("iterate through requests");
    request.onsuccess = function () {
      window.thing = this;
      console.error(this.result);
      $("#response").html("Sent to <br>" + this.result);
      logMsg(this.result);
    };
    request.onerror = function () {
      window.thing = this;
      console.error(this.error.name);
      console.error(this.error.message);
      $("#response").html(this.error.name + ':' + this.error.message);
    };
    //});
  });

  function showMessages(id) {
    var filter = new MozSmsFilter() // https://developer.mozilla.org/en-US/docs/Web/API/MozSmsFilter
      , cursor
      ;

    filter.read = false;
    if ('undefined' !== typeof id) {
      filter.threadId = id;
    }

    // Get the messages from the latest to the first
    cursor = navigator.mozMobileMessage.getMessages(filter, true);

    cursor.onsuccess = function () {
      logMsg(this.result);
    };
  }

  // 'received' seems to only activate after a message is sent
  navigator.mozMobileMessage.addEventListener('received', function (msg) {
    
    $("#response").html("Got a message");
    $("#response").append("<br>" + msg);
    logMsg(msg);

    showMessages(msg.id);
  });

  navigator.mozSetMessageHandler("alarm", function (mozAlarm) { 
    // var directive = alorms[mozAlarm.data.id]; doStuff(directive);
    $("#alarms").append("<li>Alarm Fired: " + new Date().toString().replace(/GMT.*/, ''));
      //+ " : " + JSON.stringify(mozAlarm.data) + "</li>");
    showMessages();
    //setAlarm(7 * 1000);
    setAlarm(7 * 60 * 1000);
  });
  
  function setAlarm(offset) {
    var alarmId
      , date
      , request
      ;

    $("#response").append("<br><br> setting alarm for " + (offset / 1000) + "s in the future");
    date = new Date(Date.now() + offset);
    $("#response").append("<br> will fire at " + " for " + date.toString().replace(/GMT.*/, ''));

    // Set an alarm and store it's id
    //request = navigator.mozAlarms.add(date, "ignoreTimezone", { foo: "bar" });
    request = navigator.mozAlarms.add(date, "honorTimezone", { foo: "bar" });

    request.onsuccess = function () {
      // alarms[this.result] = { type: 'thingy', params: ['do', 'stuff'] };
      alarmId = this.result;
      if (this.result) {
        $("#response").append("<br> set alarm " + this.result + " for " + date.toString().replace(/GMT.*/, ''));
      } else {
        $("#response").append("<br><br> error setting alarm: " + this.error);
      }
    };

    // ...

    // Later on, removing the alarm if it exists
    if (alarmId) {
      navigator.mozAlarms.remove(alarmId);
    }
  }

  if (!navigator.mozHasPendingMessage("alarm")) {
    setAlarm(5 * 1000);
  }
});
