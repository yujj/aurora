(function(){
    var app = angular.module('aurora-urls', ['ngStorage']);

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

    
    
    app.controller('UrlsCtrl', ['$http', '$localStorage', function($http, $localStorage){
      
	this.inputText = "\n\nВставляем сюда правки по авроре.\n\n1 http://ya.ru/\n2 http://bertal.ru/\n\n";
	
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
			var page = { 
			    status: 'pending',
			    parsedData: {
				url: url,
				request_uri: url.replace(regExps.url_short_patt, '$1'),
				text: ''
			    },
			    siteData: (this.pages[url] && this.pages[url].siteData) || {}
			};
			this.updatePageText(page, text);
			newPages[url] = page;
		}
		this.pages = newPages;
	};
	
	this.updatePageText = function(page, text){

	    if (page.parsedData.text != text) {
		angular.extend(page.parsedData, {
		    text: text,
		    title: text.extract_info_by_regexp(regExps.title_patt),
		    keywords: text.extract_info_by_regexp(regExps.keywords_patt),
		    description: text.extract_info_by_regexp(regExps.description_patt),
		    h1: text.extract_info_by_regexp(regExps.h1_patt),
		    seo_text: '',
		    seo_text2: ''
		});
	    }	    
	}
	
	
	this.outputDseoCode = function(){
	    var result = '';
	    var date = "\t\t// Добавлено " + _getDate() + " в  " + _getTime();
	    angular.forEach(this.pages, function(page){

		if (page.siteData && page.siteData.cms_request_uri && page.siteData.cms_request_uri != page.parsedData.request_uri) {
		    result += "\tcase '" + page.siteData.cms_request_uri + "': " + date + "\n" + "\tcase '" + page.parsedData.request_uri + "':\t\t// это ЧПУ\n";
		}else{
		    result += "\tcase '" + page.parsedData.request_uri + "': " + date + "\n";
		}
		
		angular.forEach($localStorage.options, function(option){
		    if(option.show){
			result += 
			    "\t\t" + 
			    option.value + "'" + 
			    ( page.parsedData[option.name] || 
			    (page.siteData && page.siteData[option.name]) || '' ).replaceAll("'", "\\'") + 
			    "';\n";
		    }
		});
		
		result += "\t\tbreak;\n\n";
	    });
	  
	    return result;
	}
	
	this.updateSiteData = function(page){
	    if(page.status != 'loading'){
		page.status = 'loading';
		$http.post('', {url: page.parsedData.url}).
		    success(function(data, status, headers, config) {
			page.status = 'complete';
		}).
		    error(function(data, status, headers, config) {
			page.status = 'error';
		});
	    }
	}
	
	
	this.parseInputText();
	
    }]);
    
})();
 


