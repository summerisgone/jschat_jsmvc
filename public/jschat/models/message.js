$.Model('Jschat.Models.Message',
/* @Static */
{
	findAll: "fixtures/messages.json.get",
	create: function(attrs, success){
		success(attrs);
	}
},
/* @Prototype */
{});

$.Model.List('Jschat.Models.Message.List', 
/* @Static */
{
    
}, 
/* @Prototype */
{
    
});
