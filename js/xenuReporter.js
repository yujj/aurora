/* xenuReporter */

function brokenLink(url){
    this.url = url;
    this.code = 0;
    this.links = [];
    this.linksCount = 0;
}
    
var xenuReporter = {
    input: "",
    output_301: "",
    output_xxx: "",
    output_404: "",
    linksLimit: 10,
    init: function(input, output_301, output_xxx, output_404){
	this.input = input;
	this.output_301 = output_301;
	this.output_xxx = output_xxx;
	this.output_404 = output_404;
	input.keyup(function(){
	    xenuReporter.parseText();
	});
    },
    parseText: function(){
	var s = this.input.val();
	    //
	var ar = s.split(/Broken links, ordered by link:/g);
	s = ar[1];
	var ar = s.split(/\d+ broken link\(s\) reported/g);
	s = ar[0];
	var ar = s.split(/\n/g);
	var urls = [];
	var cur = new brokenLink("");
	for(var i in ar){
	    var str = ar[i];
	    if(!str){
		if(cur && cur.linksCount){
		    urls.push(cur);
		    cur = null;
		}
	    }else
	    if(/^http/.test(str)){
		cur = new brokenLink(str);
	    }else
	    if(/^\thttp/.test(str)){
		if(cur.linksCount < this.linksLimit){
		    cur.links.push(str);
		}
		cur.linksCount++;
	    }else
	    if(/^error code: (\d+) /.test(str)){
		var m = str.match(/^error code: (\d+) /);
		cur.code = m[1];
	    }
	}
	var o301 = '';
	var o404 = '';
	var oxxx = '';
	for(var i in urls){
	    var item = urls[i];
	    if(item.code == 503){
		continue;
	    }
	    var line = item.url + "\nКод ответа сервера: "+item.code+". найдено на "+ (item.linksCount==1?"странице:\n":item.linksCount +" страницах:\n");
	    for(var j in item.links){
		line += item.links[j] + "\n";
	    }
	    if(item.linksCount >= this.linksLimit){
		line += "\tИ другие...\n";
	    }
	    line += "\n";
	    if(item.code == 301 || item.code == 302 ){
		o301 += line;
	    }else
	    if(item.code == 404){
		o404 += line;
	    }else{
		oxxx += line;
	    }
	}
	this.output_301.val(o301);
	this.output_xxx.val(oxxx);
	this.output_404.val(o404);
    }
    

    
}
 

xenuReporter.init($('#xenu_in_text'), $('#xenu_out_text_301'), $('#xenu_out_text_xxx'), $('#xenu_out_text_404'));