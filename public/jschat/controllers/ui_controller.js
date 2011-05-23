/**
 *
 */
$.Controller.extend('Demochat',
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
		this.loading('Initializing');
		this.xmpp = new Jschat.Controllers.Chat(this.element);
	},
	'ui.connect': function(){
		this.loading('Set up connection');
	},
	'ui.roster': function(){
		this.loading('Fetching roster');
	},
	'ui.ready': function(){
		this.element.html(this.view('//jschat/views/ui/main', this.options));
	},
	'xmpp.message': function(ev, message){
		this.element.find('.history ul').append(this.view('//jschat/views/ui/show', {message: message}));
	},
	loading: function(text){
		this.element.html(this.view('//jschat/views/ui/loading', {text: text}));
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
	}
});
