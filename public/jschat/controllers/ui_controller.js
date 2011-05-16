/**
 *  @class Jschat.Controllers.Chat Widget for chat
 *
 *  $('#chat').Jschat_chat({list: new Message.List()});
 *
 */
Jschat.Controllers.Chat.extend('Jschat.Controllers.Chatui',
/* @Static */
{},
/* @Prototype */
{
	// set up the widget
	init : function(){
		this.options.messages.findAll({}, this.callback('list'));
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
	'list': function(messages){
		this.element.html(this.view('init', this.options));
	},
	'{messages} add': function(list, ev, new_messages){
		this.element.find('.history ul').append(this.view('list', {messages: new_messages}));
	}
});
