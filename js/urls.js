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
      
	this.storage = $localStorage.$default({
	    inputText: "\n\nВставляем сюда правки по авроре.\n\n1 http://ya.ru/\n2 http://bertal.ru/\n\n"
	});
		
	this.pages = [];
	this.pageToUrlMap = {};
	
	this.parseInputText = function(){
		var inputText = this.storage.inputText;
		if (inputText.indexOf('http://') == 0) {
			inputText = inputText.replaceAll('http://', '1 http://');
		}
		this.storage.inputText = inputText;

		var texts = inputText.split(regExps.url_patt);
		
		
		// Clear parsedData for all pages;
		for (var i in this.pages) {
		    var page = this.pages[i];
		    var data = page.parsedData;
		    page.parsedData = {
			url: data.url,
			request_uri: data.request_uri
		    };
		}
		
		// Parse text
		var newPages = [];
		for (i = 1; i < texts.length; i += 2) {
			var url = texts[i];
			var text = texts[i + 1];
			var page = this.pageToUrlMap[url] || { 
			    status: 'pending',
			    parsedData: {
				url: url,
				request_uri: url.replace(regExps.url_short_patt, '$1')
			    },
			    siteData: {}
			}

			this.updateParsedData(page.parsedData, text);
			
			this.pageToUrlMap[url] = page;
			newPages.push(page);
		}
		this.pages = newPages;
	};
	
	this.updateParsedData = function(data, text){

	    angular.extend(data, {
		title: text.extract_info_by_regexp(regExps.title_patt) || data.title,
		keywords: text.extract_info_by_regexp(regExps.keywords_patt) || data.keywords,
		description: text.extract_info_by_regexp(regExps.description_patt) || data.description,
		h1: text.extract_info_by_regexp(regExps.h1_patt) || data.h1,
		seo_text: '', // TODO
		seo_text2: ''
	    });
	}
	
	
	this.outputDseoCode = function(){
	    var result = '';
	    var date = "\t\t// Добавлено " + _getDate() + " в  " + _getTime();
	    
	    angular.forEach(this.pages, function(page){
		page.printoutputDseoCode = true;
	    });
	    
	    angular.forEach(this.pages, function(page){
		
		if(page.printoutputDseoCode){
		    page.printoutputDseoCode = false;

		    result += "\t// " + page.parsedData.url + "\n";
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
		}
	    });
	  
	    return result;
	}
	
	this.updateSiteData = function(page){
	    if(page.status != 'loading'){
		page.status = 'loading';
		var urls = this;
		$http.post('', {url: page.parsedData.url}).
		    success(function(data, status, headers, config) {
			page.status = 'complete';
			page.siteData = data;
			urls.parseSiteData(page);
		}).
		    error(function(data, status, headers, config) {
			page.status = 'error';
		});
	    }
	}
	
	this.parseSiteData = function(page){
	    data = page.siteData;
	    console.log(data.body);
	}
	
	
	
	this.parseInputText();
	
    }]);
    
})();
 


/* TODO: print reports:
 * 

	printPHPArrays: function () {
		var res1 = "";
		var res2 = "";
		var res3 = "";
		for (var key in this.urls) {
			var page = this.pages[key];
			res1 += "'" + page.origurl + "',\n";
			res2 += "'" + page.origurl + "' => '',\n";
			res3 += "'" + page.url_short + "' => '',\n";
		}

		$('#phparrays1').val(res1);
		$('#phparrays2').val(res2);
		$('#phparrays3').val(res3);
	},


	print404list: function () {
		var res = "Битые ссылки и ссылки через редирект:\n\n|Страница|Отклик сервера|\n";
		for (var key in this.urls) {
			var page = this.pages[key];
			if (page.status == 'finished' && page.siteCode != '200' ) {
				res += "|"+page.url+"|"+page.siteCode+"|\n";
			}
		}
		$("#report404text").val(res);
	},

	printSeoTagsList: function () {
		var res = "Количество SEO-тэгов на страницах:\n\n|Страница|Тэг:кол-во|\n";
		for (var key in this.urls) {
			var page = this.pages[key];
			if (page.status == 'finished' && (page.siteCode == '200' || page.siteCode == '301')) {
				res += "|"+page.url+"|"+page.tagreport.replaceAll(/<[^>]+>/,'').replaceAll('&nbsp;', ' ')+"|\n";
			}
		}
		$("#reportTagsText").val(res);
	},
*/