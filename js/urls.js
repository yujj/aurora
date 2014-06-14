(function(){
    var app = angular.module('aurora-urls', []);

    var regExps = {
	url_patt: /^\d+.*\n?\s*(https?:\/\/[^\s\/]*\/[^\s]*.?)/im,
	url_short_patt: /https?:\/\/[^\s\/]*(\/[^\s]*.?)/i,
	title_patt: /^[\:\-\–\s]*title[\:\-\–\s]*(.*)$/im,
	keywords_patt: /^[\:\-\–\s]*keywords[\:\-\–\s]*(.*)$/im,
	description_patt: /^[\:\-\–\s]*description[\:\-\–\s]*(.*)$/im,
	h1_patt: /<h1[^>]*>([^<^>]*)<\/h1>/im,
	case_patt: /break;/im,
	case_url_patt: /case\s*'([^:]+)':/im,
	case_title_patt: /^\s*\$aSEOData\['title'\].*$/im,
	case_descr_patt: /^\s*\$aSEOData\['descr'\].*$/im,
	case_keywr_patt: /^\s*\$aSEOData\['keywr'\].*$/im,
	case_h1_patt: /^\s*\$aSEOData\['h1'\].*$/im,
	case_text_patt: /^\s*\$aSEOData\['text'\].*$/im,
	case_text_alt_patt: /^\s*\$aSEOData\['text_alt'\].*$/im,
    };

    
    
    app.controller('UrlsCtrl', function(){
      
	this.inputText = "\n\nВставляем сюда правки по авроре.\n\n1 http://ya.ru/\n2 http://bertal.ru/\n\n";
	
	this.resetOptions = function(){
	    this.options = [
		{show:true,  value: "$aSEOData['title'] = ", label:'Title',       name:"title"},
		{show:true,  value: "$aSEOData['descr'] = ", label:'Description', name:"description"},
		{show:true,  value: "$aSEOData['keywr'] = ", label:'Keywords',    name:"keywords"},
		{show:false, value: "$aSEOData['h1']    = ", label:'<h1>',        name:"h1"},
		{show:false, value: "$aSEOData['text']  = ", label:'Text',        name:"text"},
		{show:false, value: "$aSEOData['text2'] = ", label:'Text2',       name:"text2"}
	    ];
	};
      
	this.resetOptions();

	
	
	this.pages = {};

	
	this.parseInputText = function(){
		var inputText = this.inputText;
		if (inputText.indexOf('http://') == 0) {
			inputText = inputText.replaceAll('http://', '1 http://');
		}
		this.inputText = inputText;

		var texts = inputText.split(regExps.url_patt);
		var newPages = {};
		
		for (i = 1; i < texts.length; i += 2) {
			var url = texts[i];
			var text = texts[i + 1];
			page = this.pages[url] || new Page(url);
			page.updateText(text);
			newPages[url] = page;
		}
		this.pages = newPages;
	};
	this.parseInputText();
	
	this.outputDseoCode = function(){
	  var result = 't1';
	  var date = "\t\t// Добавлено " + _getDate() + " в  " + _getTime();
	  angular.forEach(this.pages, function(page){
/*
	    if (this.siteData && this.siteData.cms_request_uri && this.siteData.cms_request_uri != this.parsedData.request_uri) {
//  		result += "\tcase '" + this.siteData.cms_request_uri + "': " + date + "\n" + "\tcase '" + this.parsedData.request_uri + "':\t\t// это ЧПУ\n";
	    }else{
// 		result += "\tcase '" + this.parsedData.request_uri + "': " + date + "\n";
	    }
*//*	    
	    angular.forEach(this.options, function(option){
		if(option.show){
		    result += "\t\t" + option.value + "'" + ( page.parsedData[option.name] || page.siteData[option.name] || '' ).replaceAll("'", "\\'")   + "';\n";
		}
	    });
*/	    
	    result += "\t\tbreak;\n\n";
	  });
	  
	  return result;
	}
	
	
    });

    
    

    function Page(url) {
	    
	this.status = 'pending';
	this.parsedData = {
	    url: url,
	    request_uri: url.replace(regExps.url_short_patt, '$1'),
	    text: ''
	}
	this.httpData = {};

	this.updateText = function (text) {
	    var data = this.parsedData;
	    if (data.text != text) {
		this.parsedData = {
		    url: data.url,
		    request_uri: data.request_uri,
		    text: text,
		    title: text.extract_info_by_regexp(regExps.title_patt),
		    keywords: text.extract_info_by_regexp(regExps.keywords_patt),
		    description: text.extract_info_by_regexp(regExps.description_patt),
		    h1: text.extract_info_by_regexp(regExps.h1_patt),
		    seo_text: '',
		    seo_text2: ''
		};
	    }
	}
    }
    
    
    /*	
	    this.toText = function () {
		    var res = "";
		    var date = "    // Добавлено " + _getDate() + " в  " + _getTime();
		    if (this.origurl != "" && this.origurl != this.url_short) {
			    res += "    case '" + this.origurl + "': " + date + "\n" + "    case '" + this.url_short + "': // это ЧПУ\n";
		    }
		    else {
			    res += "    case '" + this.url_short + "': " + date + "\n";
		    }
		    var t;
		    if (t = this.getTitle()) res += t + "\n";
		    if (t = this.getDescription()) res += t + "\n";
		    if (t = this.getKeywords()) res += t + "\n";
		    if (t = this.getH1()) res += t + "\n";
		    if (t = this.getText()) res += t + "\n";
		    if (t = this.getTextAlt()) res += t + "\n";

		    res += "      break;\n\n";
		    return res;
	    };
	    this.getTitle = function () {
		    if ($('#cbTitle').attr('checked')) {
			    return "        " + $('#txtTitle').val() + " = '" + (this.title ? this.title : this.siteTitle).replaceAll("'", "\\'") + "';";
		    }
		    else {
			    return false;
		    }
	    };
	    this.getDescription = function () {
		    if ($('#cbDescription').attr('checked')) {
			    return "        " + $('#txtDescription').val() + " = '" + (this.description ? this.description : this.siteDescription).replaceAll("'", "\\'") + "';";
		    }
		    else {
			    return false;
		    }
	    };
	    this.getKeywords = function () {
		    if ($('#cbKeywords').attr('checked')) {
			    return "        " + $('#txtKeywords').val() + " = '" + (this.keywords ? this.keywords : this.siteKeywords).replaceAll("'", "\\'") + "';";
		    }
		    else {
			    return false;
		    }
	    };
	    this.getH1 = function () {
		    if ($('#cbH1').attr('checked')) {
			    return "        " + $('#txtH1').val() + " = '" + (this.h1 ? this.h1 : this.siteH1).replaceAll("'", "\\'") + "';";
		    }
		    else {
			    return false;
		    }
	    };
	    this.getText = function () {
		    if ($('#cbSeoText').attr('checked')) {
			    return "        " + $('#txtSeoText').val() + " = '" + (this.seo_text1? this.seo_text1 : this.site_seo_text1).replaceAll("'", "\\'") + "';";
		    }
		    else {
			    return false;
		    }
	    };
	    this.getTextAlt = function () {
		    if ($('#cbSeoTextAlt').attr('checked')) {
			    return "        " + $('#txtSeoTextAlt').val() + " = '" + (this.seo_text2? this.seo_text2 : this.site_seo_text2).replaceAll("'", "\\'") + "';";
		    }
		    else {
			    return false;
		    }
	    };*/
    

    
    
})();
 


