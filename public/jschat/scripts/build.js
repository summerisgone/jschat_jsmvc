//steal/js jschat/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('jschat/scripts/build.html',{to: 'jschat'});
});
