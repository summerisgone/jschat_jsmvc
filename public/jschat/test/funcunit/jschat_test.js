module("jschat test", { 
	setup: function(){
		S.open("//jschat/jschat.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});