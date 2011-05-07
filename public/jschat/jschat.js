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
.resources('strophe')
.views(
	'//jschat/views/chat/init.ejs',
	'//jschat/views/chat/list.ejs',
	'//jschat/views/chat/show.ejs'
)
.then(function($){
		$('body').append('<div id="chat"/>');
		$('#chat').jschat_chat({list: new Jschat.Models.Message.List()});

//		new Jschat.Models.Message({mesage: 'New one'}).save();
});
