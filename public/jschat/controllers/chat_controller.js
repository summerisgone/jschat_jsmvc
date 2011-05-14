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
		this.connection.connect(this.options.jid, this.options.password, this.callback('onConnectChange'));
		this.connection.rawInput = function(data){console.log('IN:', $(data));}
		this.connection.rawOutput = function(data){console.log('OUT:', $(data));}
		this.bind('connected', 'onConnect');
	},
	onConnectChange: function(status_code, error){
		for (status in Strophe.Status) {
			if (status_code === Strophe.Status[status])
				steal.dev.log('status: ' + status);
		}
		if (status_code === Strophe.Status.CONNECTED) {
			this.element.trigger('connected');
		}
	},
	onConnect: function(){
		steal.dev.log('on connect');
		// 'connected' event listener
		// request roster
		var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
		this.connection.sendIQ(iq, this.callback('onRoster'));
		// add handlers
		this.connection.addHandler(this.callback('onContactPresence'), 'jabber:client', 'presence');
		this.connection.addHandler(this.callback('OnMessage'), null, 'message', 'chat');
	},
	onRoster: function(roster){
		var Rosteritem = Jschat.Models.Rosteritem;  // shortcut
		$(roster).find('item').each(function() {
			new Rosteritem(Rosteritem.fromIQ(this)).save();
		});
		this.connection.send($pres());
	},
	/**
	 * Listen only 'jabber:client' namespace
	 */
	onContactPresence: function(presence){
        var contact = this.options.roster.getByJid($(presence).attr('from'));
        if (contact){
        	contact.updatePrecense(presence);
        }
        return true;
    },
	OnMessage: function(message){
		steal.dev.log('On message');
		var Message = Jschat.Models.Message, // shortcut
			message = new Message(Message.fromIQ(message));
		message.myjid = this.options.jid;
		message.save();
		return true;
	},
	'form submit': function(el, ev){
		ev.preventDefault();
		// TODO: get appripriate contact, not first one
		var to = this.options.roster[0],
			msg = new Jschat.Models.Message({
				'to': to.jid,
				'text': el.formParams().text
			});
		msg.send(this.connection).save();
	},
	'list': function(messages){
		this.element.html(this.view('init', this.options));
	},
	'message.created subscribe': function(called, message){
		this.options.messages.push(message);
	},
	'rosteritem.created subscribe': function(called, roster_item){
		this.options.roster.push(roster_item);
	},
	'{messages} add': function(list, ev, new_messages){
		this.element.find('.history ul').append(this.view('list', {messages: new_messages}));
	}
	
});
