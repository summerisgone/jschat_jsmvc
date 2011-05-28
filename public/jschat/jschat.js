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
	'jquery/dom/form_params',		// form data helper
	'steal/less'
)
.models(
	'message',
	'rosteritem'
)
.controllers(
	'xmpp',
	'ui'
)
.resources(
	'strophe',
	'strophe.flxhr',
	'base64',
	'md5',
	'xml2json',
	'underscore',
	'gravatar',
	'flXHR',
	'checkplayer',
	'swfobject',
	'flensed'
)
.views(
	'//jschat/views/userinfo.ejs',
	'//jschat/views/ui/main.ejs',
	'//jschat/views/ui/loading.ejs',
	'//jschat/views/ui/list.ejs',
	'//jschat/views/ui/show.ejs'
)
.then(function($){
	if (steal.options.env === 'development') {
		steal.less('css/style');
	}
});