steal.plugins(
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/controller/view',		// lookup views with the controller's name
	'jquery/model',					// Ajax wrappers
	'jquery/model/list',			// List helpers
	'jquery/dom/form_params')		// form data helper
.models('message')
.controllers('chat')
.resources(
	'strophe',
	'base64',
	'md5'
//	'flXHR.js',
//	'strophe.flxhr.js'
)
.views(
	'//jschat/views/chat/init.ejs',
	'//jschat/views/chat/list.ejs',
	'//jschat/views/chat/show.ejs'
)
.then(function($){
		$('body').append('<div id="chat"/>');
		$('#chat').jschat_chat();

//		new Jschat.Models.Message({mesage: 'New one'}).save();
});
