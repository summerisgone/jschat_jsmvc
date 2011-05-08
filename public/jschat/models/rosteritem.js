$.Model('Jschat.Models.Rosteritem',
/* @Static */
{
	create: function(attrs, success){
		success(attrs);
	},
	/**
	* Client receives roster from server:
	* 
	* <iq to='juliet@example.com/balcony' type='result' id='roster_1'>
	*   <query xmlns='jabber:iq:roster'>
	*     <item jid='romeo@example.net'
	*           name='Romeo'
	*           subscription='both'>
	*       <group>Friends</group>
	*     </item>
	*     <item jid='mercutio@example.org'
	*           name='Mercutio'
	*           subscription='from'>
	*       <group>Friends</group>
	*     </item>
	*     <item jid='benvolio@example.org'
	*           name='Benvolio'
	*           subscription='both'>
	*       <group>Friends</group>
	*     </item>
	*   </query>
	* </iq>
	* @param iq - roster response
	* Returns object ready to pass in constructor
	*/
	fromIQ: function(iq){
		console.log('Create roster item:', {
			jid: $(iq).attr('jid'),
			name: $(iq).attr('name'),
			subscription: $(iq).attr('subscription')
		});
		return {
			jid: $(iq).attr('jid'),
			name: $(iq).attr('name'),
			subscription: $(iq).attr('subscription')
		}
	}
},
/* @Prototype */
{

});

$.Model.List('Jschat.Models.Roster', 
/* @Static */
{
    
}, 
/* @Prototype */
{
	online: function(){
		return this.match({status: 'available'});
	} 
    
});
