/**
 *  @class Jschat.Controllers.Chat Widget for chat
 *
 *  $('#chat').Jschat_chat({list: new Message.List()});
 *
 */
$.Controller('Jschat.Controllers.Chat',
/* @Static */
{
	defaults: {
		list: new Jschat.Models.Message.List(),
		jid: 'jschat-demo@jabber.org',
		password: 'password',
		bosh_service: 'http://bosh.metajack.im:5280/xmpp-httpbind'
	}
},
/* @Prototype */
{
	// set up the widget
	init : function(){
		// fills this list of items (creates add events on the list)
		this.options.list.findAll({}, this.callback('list'));
		this.connection = new Strophe.Connection(this.options.bosh_service);
		
		console.log('Connecting with', this.options.jid, this.options.password);
		$.when(
			this.connection.connect(this.options.jid, this.options.pass, this.onConnect)
		).done(function(){
			console.log('Connection.connect worked!', this.connection);
		});
	},
	onConnect: function(status_code, error){
		console.log('on connect!', status_code, error);
		for (status in Strophe.Status) {
			if (status_code === Strophe.Status[status])
				console.log('status: ', status);
		}
		
	},
	list: function(messages){
		this.element.html(this.view('init', this.options));
	},
	'message.created subscribe': function(called, message){
		this.options.list.push(message);
	},
	'{list} add': function(list, ev, new_messages){
		this.element.find('.history ul').append(this.view('list', {messages: new_messages}));
	}
	
});
