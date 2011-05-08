module("Model: Jschat.Models.RosterItem")

test("findAll", function(){
	stop(2000);
	Jschat.Models.RosterItem.findAll({}, function(roster_items){
		start()
		ok(roster_items)
        ok(roster_items.length)
        ok(roster_items[0].name)
        ok(roster_items[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Jschat.Models.RosterItem({name: "dry cleaning", description: "take to street corner"}).save(function(roster_item){
		start();
		ok(roster_item);
        ok(roster_item.id);
        equals(roster_item.name,"dry cleaning")
        roster_item.destroy()
	})
})
test("update" , function(){
	stop();
	new Jschat.Models.RosterItem({name: "cook dinner", description: "chicken"}).
            save(function(roster_item){
            	equals(roster_item.description,"chicken");
        		roster_item.update({description: "steak"},function(roster_item){
        			start()
        			equals(roster_item.description,"steak");
        			roster_item.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Jschat.Models.RosterItem({name: "mow grass", description: "use riding mower"}).
            destroy(function(roster_item){
            	start();
            	ok( true ,"Destroy called" )
            })
})