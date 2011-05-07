/**
 *  @class Jschat.Controllers.Chat Widget for chat
 *
 *  $('#chat').Jschat_chat({list: new Message.List()});
 *
 */
$.Controller('Jschat.Controllers.Chat',
/* @Static */
{
},
/* @Prototype */
{
	// set up the widget
	init : function(){
		
		// fills this list of items (creates add events on the list)
		this.options.list.findAll({}, this.callback('list'));
	},
	list: function(messages){
		this.element.html(this.view('init', this.options));
	},
	'message.created subscribe': function(called, message){
		console.log('On create!');
		console.log(message);
		this.options.list.push(message);
	},
	'{list} add': function(list, ev, new_messages){
		console.log('on list add', new_messages);
//		console.log('append: ', $.View('//jschat/views/chat/list', {messages: messages}));
		this.element.find('.history ul').append(this.view('list', {messages: new_messages}));
	}
	
});
