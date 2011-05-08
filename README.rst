Javascript web chat application
================================

Yep, yet another...

Quick start
-----------

I will write this readme documentation as completing application.

Application based on `JavascirptMVC framework`_. Is is full of features, 
but I use only basics - the Model, the View and the Controller :)

Supposed that applcaition wil be designed as jQuery plugin:
you wil nedd to write::

	$('#chat-div-id').jshat(options)

And this would all that will be requied to quick start.
In ``options`` you provide connection credentials, and some tuned parameters.

Current state
--------------

`I'm not sure that I will be able keep documentation in actual state, but I promise I'll try.`

For now application can do following things:

1. It has ``fixtures``, which contains test messages set. Fixtures are in JSON format.
2. It can create JMVC controller this way: ::

	 $('#chat').jschat_chat({list: new Jschat.Models.Message.List()});

The controller will create html widget with all messages loaded from fixture.

3. It can automatically draw new messages in widget when new Message instance created: ::

	var msg = new Jschat.Models.Message({mesage: 'New one'});
	msg.save();
	
This code will add ``<li>`` element to the widget.

4. XMPP connection stored in controller object. It can be retrieved from DOM element
with ``.controller()`` method: ::

	$('#chat').controller().connection

5. Application use `CORS`_ cross-domain technology to access jabber http-bind server.
If CORS not supported, connection established via `flXHR`_ Flash tool.

Libraries and technologies
---------------------------

As said, user interface and application design made with `JavascirptMVC framework`_.

XMPP connection based on `Strophe.js`_ library.

Cross-domain requests in old browsers made via `flXHR`_.   


.. _JavascirptMVC framework: http://javascriptmvc.com/
.. _CORS: http://www.w3.org/TR/cors/
.. _flXHR: http://flxhr.flensed.com/
.. _Strophe.js: http://strophe.im/