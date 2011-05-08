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
			text: $(message).find('body').text(),
			from: $(message).attr('from'),
			to: $(message).attr('to'),
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
	}
});

$.Model.List('Jschat.Models.Message.List', 
/* @Static */
{
    
}, 
/* @Prototype */
{
    
});
