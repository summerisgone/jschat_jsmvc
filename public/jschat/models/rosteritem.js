/**
 * @parent jschat
 * @class Jschat.Jid
 *  
 * Abstraction for XMPP JID.
 * 
 * ### Instabnce public attributes
 * * fullJid
 * * bareJid - generated with Strophe.getBareJidFromJid
 * * name - nickname in roster
 * 
 */
$.Class.extend('Jschat.Jid',
/* @Static */{

},
/* @Prototype */
{
	/**
	 * @class Jid
	 * @constructor
	 * @params iq
	 * 
	 * Creates JID abstract from ``item`` IQ stanza 
	 *   <query xmlns='jabber:iq:roster'>
	 *       <item
	 *        	jid='contact@example.org'
	 *          subscription='none'
	 *          name='MyContact'>
     *          <group>MyBuddies</group>
     *       </item>
     *  </query>
	 */
	init: function(item){
        this.fullJid = $(item).attr('jid');
        this.name = $(item).attr('name');
        this.bareJid = Strophe.getBareJidFromJid(this.fullJid);
	},
	/**
	 * @return resource from JID
	 */
	getResource: function(){
		return Strophe.getResourceFromJid(this.fullJid);
	},
	/**
	 * @returns true if JID is bare
	 */
	isBare: function(){
		return this.bareJid === this.fullJid;
	}
});
		

/**
 * @parent Jschat.Models
 * @class Jschat.Models.Rosteritem
 * 
 * Model for contact in the roster. Handle multiple resources from single bare JID. 
 * 
 * ### Instabnce public attributes
 * 
 * * jid - {Jscht.Jid} jid instance
 * * subscription - {String} XMPP subscription
 * * resources - {Array} list of connected resources 
 * 
 * Resource is Javascript object: {fullJid: 'jack@example.com/home', }
 * 
 */
$.Model('Jschat.Models.Rosteritem',
/* @Static */
{
	status: null,
	online: false,
	/**
	 * An empty method used to send OpenAjax signal 'create'
	 */
	create: function(attrs, success){
		success(attrs);
	},
	/**
	 * Create object to initialize constructor
	 * Resourse object is initialized here
	 * 
	 * @params iq - IQ <item/> stanza from namespace 'jabber:iq:roster'
	 */
	fromIQ: function(iq){
		var jid = new Jschat.Jid(iq),
			resources = [];
		// Do not create resources without resource 
		if (Strophe.getResourceFromJid(jid.fullJid)) {
			resources.push({
				fullJid: jid.fullJid,
				resource: jid.getResource()
			});
		}
		return {
			jid: jid,
			subscription: $(iq).attr('subscription'),
			resources: resources
		};
	}
},
/* @Prototype */
{
	/**
	 * @param presence - a <presence> stanza
	 */
	updatePrecense: function(presence) {
		var jsonPresence = $.xml2json(presence);
		var status;
		if (jsonPresence.type) {
			status = jsonPresence.type;
		} else {
			if (jsonPresence.show) {
				status = jsonPresence.show;
			} else {
				status = 'available';
			}
		}
		// try to find existing resource
		var existingResource = _.select(this.resources, function(resource){
			return resource.fullJid === jsonPresence.from; 
		});
		if(existingResource.length > 0){
			_.each(existingResource, function(resource){
				resource.status = status;
			});
		} else {
			this.resources.push({
				fullJid: jsonPresence.from,
				status: status
			});
		}
		this.setBestResource();
	},
	/**
	 * Set most actual status and fullJid
	 */
	setBestResource: function(){
		var roster = this,
			PRESENCE_PRIORITIES = ['chat', 'available', 'away', 'dnd', 'xa', 'unavailable', ''];
		// Run over all statuses and over all resources
		// select resource with status most close to 'chat'
		var best = _.reduceRight(PRESENCE_PRIORITIES, function(previous, status){
			var resources_with_status = _.select(roster.resources, function(resource){
				return resource.status === status;
			});
			if (resources_with_status.length){
				return resources_with_status[0];
			} else {
				return previous;
			}
		});
		this.status = best.status;
		this.jid.fullJid = best.fullJid;
		if (this.status !== 'unavailable'){
			this.online = true;
		} else {
			this.online = false;
		}
	}
});


/**
 * @parent Jschat
 * @class Jschat.Models.Roster
 * 
 * Roster is [jquery.model.list Model.List] subclass.
 * 
 */
$.Model.List('Jschat.Models.Roster', 
/* @Static */
{}, 
/* @Prototype */
{
	manager: null,
	online: function(){
		return _.select(this, function(rosterItem){
			return rosterItem.online;
		});
	},
	/**
	 * @param jid {String} - A JID to search in roster
	 * @return last found element with same bare jid, otherwise false
	 * 
	 * Run over elements in roster and return last found with 
	 * same bare jid. If nothing found, returns false.
	 * 
	 */
	getByJid: function(jid){
		return _.reduce(this, function(initial, rosterItem){
			if(rosterItem.jid.bareJid === Strophe.getBareJidFromJid(jid)){
				return rosterItem;
			} else {
				return initial;
			}
		}, false);
	},
	/**
	 * Set this.manager to most available manager in roster
	 */
	updateManager: function(){
		var online_contacts = this.online(),
			PRESENCE_PRIORITIES = ['chat', 'available', 'away', 'dnd', 'xa', 'unavailable', ''];
		
		this.manager = _.reduce(online_contacts, function(previous, contact){
			if (previous === null) {
				// at least, anybody
				return contact;
			} else {
				// if there is a manager with status higher than previous, set him as primary
				var prevIndex = _.indexOf(PRESENCE_PRIORITIES, previous.status)
					nextIndex = _.indexOf(PRESENCE_PRIORITIES, contact.status);
				if (nextIndex < prevIndex) {
					return contact;
				} else {
					return previous;
				}
			}
		}, this.manager);
	}
});
