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
		userinfo: jQuery.browser,
//		bosh_service: 'http://bosh.metajack.im:5280/xmpp-httpbind'
		bosh_service: 'http://localhost:5280/bosh'
	}
},
/* @Prototype */
{
	// set up connection
	init : function(){
		// fills this list of items (creates add events on the list)
//		this.options.messages.findAll({}, this.callback('list'));
		this.connection = new Strophe.Connection(this.options.bosh_service);
		this.connection.connect(this.options.jid, this.options.password, this.callback('onConnectChange'));
//		this.connection.rawInput = function(data){console.log('IN:', $(data));};
//		this.connection.rawOutput = function(data){console.log('OUT:', $(data));};
		this.bind('connected', 'onConnect');
		this.element.trigger('ui.connect');
	},
	unload: function(){
		this.connection.send($pres({type: 'unavailable'}));
		this.connection.disconnect();
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
		this.element.trigger('ui.roster');
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
		this.element.trigger('ui.ready');
	},
	/**
	 * Listen only 'jabber:client' namespace
	 */
	onContactPresence: function(presence){
        var contact = this.options.roster.getByJid($(presence).attr('from'));
        if (contact){
        	contact.updatePrecense(presence);
        }
        if (this.options.messages.length == 0){
        	this.options.roster.updateManager();
        	_.delay(function(self){
        		self.sendWelcome();
        	}, '2000', this);
        }
        this.options.roster;
        return true;
    },
    /**
     * Send welcome message to current manager
     * 
     */
    sendWelcome: function(){
    	if (!this.welcomeSent) {
    		var userinfo = $.View('//jschat/views/userinfo', {info: this.options.userinfo}),
    		msg = new Jschat.Models.Message({
    			text: userinfo,
    			from: this.options.jid,
    			to: this.options.roster.manager.jid.fullJid,
    			hidden: true,
    			dt: new Date()
    		});
    		msg.send(this.connection).save();
    	}
    	this.welcomeSent = true;
    },
	OnMessage: function(message){
		var Message = Jschat.Models.Message, // shortcut
			message = new Message(Message.fromIQ(message));
		message.myjid = this.options.jid;
		message.save();
		return true;
	},
	'message.created subscribe': function(called, message){
		this.options.messages.push(message);
	},
	'rosteritem.created subscribe': function(called, roster_item){
		this.options.roster.push(roster_item);
	}
});
