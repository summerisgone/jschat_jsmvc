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
		messages: new Jschat.Models.Message.List(),
		roster: new Jschat.Models.Roster(),
		jid: 'jschat-demo@jabber.org',
		password: 'password',
		bosh_service: 'http://bosh.metajack.im:5280/xmpp-httpbind'
//		bosh_service: 'http://localhost:5280/http-bind'
	}
},
/* @Prototype */
{
	// set up the widget
	init : function(){
		// fills this list of items (creates add events on the list)
		this.options.messages.findAll({}, this.callback('list'));
		this.connection = new Strophe.Connection(this.options.bosh_service);
		this.connection.connect(this.options.jid, this.options.password, this.callback('onConnect'));
	},
	onConnect: function(status_code, error){
		for (status in Strophe.Status) {
			if (status_code === Strophe.Status[status])
				steal.dev.log('status: ' + status);
		}
		if (status_code === Strophe.Status.CONNECTED) {
			// request roster
			var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
			this.connection.sendIQ(iq, this.callback('onRoster'));
//			this.connection.disconnect();
		}
//		this.connection.addHandler(this.callback('onPresence'), null, 'presence');
		this.connection.addHandler(this.callback('OnMessage'), null, 'message');
	},
	onRoster: function(iq){
		var Rosteritem = Jschat.Models.Rosteritem;  // shortcut
		$(iq).find('item').each(function() {
			new Rosteritem(Rosteritem.fromIQ(this)).save(); // TODO: Listen roster item creation and add it to the list 
		});
		this.connection.send($pres());
	},
	onPresence: function(){
		// empty for now
		this.connection.disconnect();
	},
	OnMessage: function(message){
		var Message = Jschat.Models.Message, // shortcut
			message = new Message(Message.fromIQ(message));
		message.myjid = this.options.jid;
		message.save();
	},
	list: function(messages){
		this.element.html(this.view('init', this.options));
	},
	'message.created subscribe': function(called, message){
		this.options.messages.push(message);
	},
	'rosteritem.created subscribe': function(called, roster_item){
		this.options.roster.push(roster_item);
		steal.dev.log('new roster item added');
		steal.dev.log(roster_item);
	},
	'{messages} add': function(list, ev, new_messages){
		this.element.find('.history ul').append(this.view('list', {messages: new_messages}));
	}
	
});
