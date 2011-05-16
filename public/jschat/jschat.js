/*
 * @page jschat jschat
 * @tag home
 *
 *	XMPP chat application
 *
 *	Documentaion comes here
 *
 * 
 * */
steal.plugins(
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/controller/view',		// lookup views with the controller's name
	'jquery/model',					// Ajax wrappers
	'jquery/model/list',			// List helpers
	'jquery/dom/form_params')		// form data helper
.models(
	'message',
	'rosteritem'
)
.controllers(
	'chat',
	'ui'
)
.resources(
	'strophe',
	'base64',
	'md5',
	'xml2json',
	'underscore'
	// uncomment these files to build
//	'flXHR',
//	'checkplayer',
//	'swfobject',
//	'flensed'
)
.views(
	'//jschat/views/chatui/init.ejs',
	'//jschat/views/chatui/list.ejs',
	'//jschat/views/chatui/show.ejs'
)
.then(function($){
	var init = function($){
		$('body').append('<div id="chat"/>');
		$('#chat').jschat_chatui();
	};

	// wrap CORS browser support
	if ('withCredentials' in new XMLHttpRequest()){
		init($);
	} else {
		steal.resources('strophe.flxhr.js').then(function($){
			init($);	
		});
	}
	$(window).unload(function(ev) {
		  $('#chat').trigger('unload');
		  alert('Handler for .unload() called.');
	});
});
