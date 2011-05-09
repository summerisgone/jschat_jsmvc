$.Model('Jschat.Models.Message',
/* @Static */
{
	myjid: '',
	findAll: "fixtures/messages.json.get",
	create: function(attrs, success){
		// TODO: publish message to XMPP server?
		success(attrs);
	},
	/* Message stanza exmaple:
	* <message
	*     to='romeo@example.net'
	*     from='juliet@example.com/balcony'
	*     type='chat'
	*     xml:lang='en'>
	*   <body>Wherefore art thou, Romeo?</body>
	* </message>
	* 
	* @param messages - a message stanza
	* 
	* Returns object ready to pass in constructor 
	 */
	fromIQ: function(message){
		return {
			text: $(message).text(),
			from: Strophe.getBareJidFromJid($(message).attr('from')),
			to: Strophe.getBareJidFromJid($(message).attr('to')),
			dt: new Date()
		}
	}
},
/* @Prototype */
{
	direction: function(){
		var to = Strophe.getBareJidFromJid(this.to),
			myjid = Strophe.getBareJidFromJid(this.myjid);
		if (myjid === to) {
			return 'outgoing';
		} else {
			return 'incoming';
		}
	},
	send: function(connection, to){
		connection.send($msg({
			to: this.to,
			"type": 'chat'
		}).c('body').t(this.text));
		return this
	}
});

$.Model.List('Jschat.Models.Message.List', 
/* @Static */
{
    
}, 
/* @Prototype */
{
    
});
