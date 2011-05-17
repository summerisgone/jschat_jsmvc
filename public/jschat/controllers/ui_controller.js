/**
 *  @class Jschat.Controllers.Chat Widget for chat
 *
 *  $('#chat').Jschat_chat({list: new Message.List()});
 *
 */
Jschat.Controllers.Chat.extend('Jschat.Controllers.Chatui',
/* @Static */
{
	defaults: {
		blank_message: 'Type message here',
		send_on_enter: true
	}
},
/* @Prototype */
{
	// set up the widget
	init : function(){
		var loading = this.loading;
		this.loading('Initializing');
		this._super(arguments);
	},
	'ui.connect': function(){
		this.loading('Set up connection');
	},
	'ui.roster': function(){
		this.loading('Fetching roster');
	},
	'ui.ready': function(){
		this.options.messages.findAll({}, this.callback('list'));
	},
	loading: function(text){
		this.element.html(this.view('loading', {text: text}));
	},
	'list': function(messages){
		this.element.html(this.view('main', this.options));
	},
	'textarea focusin': function(el) {
		if ($(el).text() === this.options.blank_message) {
			$(el).text('');
		};
		$(el).addClass('focus');
	},
	'textarea focusout': function(el) {
		if ($(el).text() === '') {
			$(el).text(this.options.blank_message);
		};
		$(el).text('Type message here').removeClass('focus');
	},
	'textarea keyup': function(el, ev) {
		if((ev.keyCode == 13) && (this.options.send_on_enter)){
			if(this.options.roster.manager) {
				el.parents('form').submit();
				el.val('');
			}
		}
	},
	'form submit': function(el, ev){
		ev.preventDefault();
		// TODO: get appripriate contact, not first one
		var to = this.options.roster.manager,
			msg = new Jschat.Models.Message({
				'to': to.jid.fullJid,
				'text': el.formParams().text
			});
		msg.send(this.connection).save();
	},
	'{messages} add': function(list, ev, new_messages){
		this.element.find('.history ul').append(this.view('list', {messages: new_messages}));
	},
	'{rosteritem} add': function(roster, ev, new_contacts){
		_.each(new_contacts, function(rosteritem){
			rosteritem.avatar = $.gravatar(roster_item.jid.bareJid, {size: 40});
		});
//		this._super(called, roster_item);
	}

});
