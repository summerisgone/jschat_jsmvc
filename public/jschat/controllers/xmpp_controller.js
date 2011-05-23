/**
 *  @class Jschat.Controllers.Chat Widget for chat
 *
 *  $('#chat').Jschat_chat(options);
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
		autoChat: false,
		autoConnect: true,
//		bosh_service: 'http://bosh.metajack.im:5280/xmpp-httpbind'
		bosh_service: 'http://localhost:5280/bosh'
	}
},
/* @Prototype */
{
	// set up connection
	init : function(){
		this.connection = new Strophe.Connection(this.options.bosh_service);
//		this.connection.rawInput = function(data){console.log('IN:', $(data));};
//		this.connection.rawOutput = function(data){console.log('OUT:', $(data));};
		this.bind('connected', 'onConnect');
		if (this.options.autoConnect){
			this.connect();
		}
	},
	connect: function(){
		this.connection.connect(this.options.jid, this.options.password, this.callback('onConnectChange'));
		this.element.trigger('ui.connect');
	},
	/**
	 * Send message to current manager
	 * @param text - message text or object to initialize
	 */
	sendMessage: function(text){
		if (this.options.roster.manager.jid.fullJid) {
			this.options.roster.managerSet = true;
			if (typeof(text) === 'string'){
				var msg = new Jschat.Models.Message({
					text: text,
					from: this.options.jid,
					to: this.options.roster.manager.jid.fullJid,
					dt: new Date()
				});
			} else {
				var msg = new Jschat.Models.Message(text);
			}
			msg.send(this.connection).save();
		}
	},
    /**
     * Send welcome message to current manager
     * @attr userinfo - Object to render in initial message
     */
    sendWelcome: function(userinfo){
    	if (!this._welcomeSent) {
    		$.extend(this.options.userinfo, userinfo);
    		var userinfo = $.View('//jschat/views/userinfo', {info: this.options.userinfo});
    		this.sendMessage({
    			text: userinfo,
    			from: this.options.jid,
    			to: this.options.roster.manager.jid.fullJid,
    			hidden: true,
    			dt: new Date()
    		});
    		this.element.trigger('xmpp.start_conversation');
    		this._welcomeSent = true;
    	}
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
		// 'connected' event listener
		// request roster
		var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
		this.connection.sendIQ(iq, this.callback('onRoster'));
		this.element.trigger('ui.roster');
		// add handlers
		this.connection.addHandler(this.callback('onContactPresence'), 'jabber:client', 'presence');
		this.connection.addHandler(this.callback('onMessage'), 'jabber:client', 'message', 'chat');
	},
	onRoster: function(roster){
		var Rosteritem = Jschat.Models.Rosteritem;  // shortcut
		$(roster).find('item').each(function() {
			new Rosteritem(Rosteritem.fromIQ(this)).save();
		});
		this.connection.send($pres());
		this.options.roster.updateManager();
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
        if(!this._welcomeSent){
        	this.options.roster.updateManager();
        }
        if(this.options.autoChat){
        	_.delay(function(self){
        		self.sendWelcome();
        	}, '2000', this);
        }
        return true;
    },
	onMessage: function(message){
		var Message = Jschat.Models.Message, // shortcut
			message = new Message(Message.fromIQ(message));
		message.myjid = this.options.jid;
		message.contact = this.options.roster.getByJid(message.from);
		message.save();
		return true;
	},
	'message.created subscribe': function(called, message){
		this.options.messages.push(message);
		this.element.trigger('xmpp.message', message);
	},
	'rosteritem.created subscribe': function(called, roster_item){
		this.options.roster.push(roster_item);
	}
});
