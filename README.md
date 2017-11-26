## SILENCE PROJECT


# Description

Silence is an application that allows two users to connect and send each other encrypted SMS / MMS.
When an SMS is sent, the operator knows who sent the message, to whom it was sent and the time of sending.
Silence does not allow a confidential discussion with a person so that one can never know that these two users have been in contact. 
However, the messages do not use internet so no other actor is involved in the exchange. Only the operator can provide the SMS sent. 
Silence is currently the only way to send encrypted messages without an internet connection.

# Project download

The project is available to the following URL : https://github.com/jenourthika/Silence

# Installation

First, you need to download Silence project using the previous part.

Once it is done, you have two choices : 
1 - Get a smartphone running Mozilla Firefox OS.
2 - If you don't have one in your possession, you can download mozilla firefox with the following link : https://www.mozilla.org/fr/firefox/
	Then you will be able to download the add-on named 'Firefox OS simulator' : https://addons.mozilla.org/fr/firefox/addon/firefox-os-simulator/

# Usage

You will have to enter your recipient's telephon number in the appropriate text field.
Then write your message below, click the button "Send SMS" and it will send an encrypted SMS to the number composed previously.

# Database

We created a database named 'silence' with a dataset in postgreSQL, but we doesn't use it yet.

# Encryption method

We're using SHA-256 to crypt messages, with a key generated from random characters.