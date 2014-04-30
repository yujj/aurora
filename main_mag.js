String.prototype.trim = function () {
	return this.replace(/^\s+/, "").replace(/\s+$/, "");
}

String.prototype.escapeHtml = function () {
	return this.replace(/&(?!amp;)/g, "&amp;").replace(/<(?!lt;)/g, "&lt;").replace(/>(?!gt;)/g, "&gt;").replace(/"(?!quot;)/g, "&quot;").replace(/'(?!#039;)/g, "&#039;").replace(/&amp;(\w+;)/g, "&$1");
}

String.prototype.extract_info_by_regexp = function (re) {
	var s = ((this.search(re) != -1) ? this.match(re)[1].trim() : "");
	s = s.escapeHtml().trim();
	if (!s || 0 === s.length) return "";
	return s;
}

String.prototype.replaceAll = function (search, replace) {
	return this.split(search).join(replace);
}

function extend(from, to) {
	if (from == null || typeof from != "object") return from;
	if (from.constructor != Object && from.constructor != Array) return from;
	if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || from.constructor == String || from.constructor == Number || from.constructor == Boolean) return new from.constructor(from);

	to = to || new from.constructor();

	for (var name in from) {
		to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
	}

	return to;
}



function _getDate() {
	var month_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	var d = new Date();
	var current_date = d.getDate();
	var current_month = d.getMonth();
	var current_year = d.getFullYear();
	return current_date + " " + month_names[current_month] + " " + current_year;
}

function _getTime() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	return hours + ":" + minutes;
}


function Page(url, text) {
	this.url = url.trim();
	this.url_short = url.replace(auroParser.url_short_patt, '$1').trim();
	this.origurl = "";
	this.updateText = function (text) {
		if (this.text != text) {
			this.text = text;
			this.cmsmagazine_early = text.trim();
			this.title = text.extract_info_by_regexp(auroParser.title_patt);
			this.keywords = text.extract_info_by_regexp(auroParser.keywords_patt);
			this.description = text.extract_info_by_regexp(auroParser.description_patt);
			this.h1 = text.extract_info_by_regexp(auroParser.h1_patt);
		}
	};
	this.updateText(text);
	this.status = 'pending';
	this.siteCode = '';
	this.tagreport = '';
	this.siteTitle = '';
	this.siteDescription = '';
	this.siteKeywords = '';
	this.siteH1 = '';
	this.site_seo_text1 = '';
	this.site_seo_text2 = '';
	
	this.toText = function () {
		var res = "";
/*		var date = "    // Добавлено " + _getDate() + " в  " + _getTime();
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

		res += "      break;\n\n";*/


		res += "" + this.url.replace('http://', '').replace('/cmsmagazine6e8a796f731743be14649414df09d8f0.txt', '') + "\t" 
			  + (this.acceptEarly?"да":"нет") + "\t"+ (this.cmsmagazineaccept?"да":"нет") + "\t"
			  + (this.cmsmagazineaccept?"":(this.cmsmagazine?this.cmsmagazine:"не обработано")) 
			  +"\n";

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
	};
}

var auroParser = { //main class
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

	dseo: "#dseo",
	obj_src_text: "",
	text: "",

	dseomergersrc: "#dseomergersrc",

	init: function (obj) {
		this.obj_src_text = $(obj);
		this.dseo = $(this.dseo);
		this.dseomergersrc = $(this.dseomergersrc);
		this.loadText();
		this.loadDseomergersrc();
		this.dseomergersrc.change(function () {
			auroParser.saveDseomergersrc();
		});
	},

	update: function (url) {
		if (url) {
			this.pages[url].status = 'pending';
			this.pages[url].siteCode = '';
			this.runAJAX();
		}
		else {
			this.setText(this.obj_src_text.val());
			this.saveDseomergersrc();
		}
	},

	setText: function (text) {
		if (this.text != text) {
			this.text = text;
			this.saveText();
			this.clearText();
			this.parsePages();
			this.printStatuses();
			
		}
	},

	clearText: function () {
		var text = this.text;
		if (text.indexOf('http://') == 0) {
			text = text.replaceAll('http://', '1 http://');
//			this.obj_src_text.val(text);
		}else{
			if (text.indexOf('1 http://') == 0) {

			}else{
				text = "\n" + text + "\n";
				text = text.replaceAll(/^/im, '1 http://');
				text = text.replaceAll(/\t/im, '/cmsmagazine6e8a796f731743be14649414df09d8f0.txt\t');
			}
		}

		
		this.text = text;
	},

	saveText: function () {
		var text = this.text;
		localStorage['d-seo-text'] = text;
	},
	
	loadText: function () {
		var text = localStorage['d-seo-text'];
		if(text){
			this.obj_src_text.val(text);
		}
	},

	dseomergersrctext: "",

	saveDseomergersrc: function () {
		var text = this.dseomergersrc.val();
		localStorage['dseomergersrc-text'] = text;
	},
	
	loadDseomergersrc: function () {
		var text = localStorage['dseomergersrc-text'];
		if(text){
			this.dseomergersrc.val(text);
		}
		
	},

	urls: {},

	parsePages: function () {
		var text = this.text;
		var texts = text.split(this.url_patt);
		this.urls = {};
		for (i = 1; i < texts.length; i += 2) {
			var url = texts[i].trim();
			var text = texts[i + 1].trim();
			this.urls[url] = text;
		}
		this.setPages();
		this.checkPages();
		//this.requestFTPAccess();
	},

	pages: {},
	surls: {},

	setPages: function () {
		this.surls = {};
		for (var i in this.urls) {
			var url = i;
			var text = this.urls[i];
			if (!this.pages[url]) {
				this.pages[url] = new Page(url, text);
			}
			else {
				this.pages[url].updateText(text);
			}
			this.surls[this.pages[url].url_short] = url;
		}
	},


	printStatuses: function () {
		var res = "<table class='table table-striped table-bordered table-condensed'><thead><th>#</th><th>URL</th><th>Результат</th><th>Доступы</th></thead><tbody>";
		var i = 1;
		for (var key in this.urls) {
			var page = this.pages[key];
			var badgeClass = 'badge-warning';
			switch (page.siteCode) {
			case '':
			case '000':
				badgeClass = '';
				break;
			case '200':
				badgeClass = 'badge-success';
				break;
			case '301':
				badgeClass = 'badge-info';
				break;
			case '302':
			case '404':
				badgeClass = 'badge-important';
				break;
			}
			var ans = '<span class="badge ' + badgeClass + '">' + page.siteCode + '</span>';
			res += '<tr><td>' + i + '.</td><td class="' + page.status + '">' + ans;
			i++;

			res += ' <a target="_blank" href="' + page.url + '">' + page.url + '</a>';
			res += '</td>';
			res += '<td>' + (page.cmsmagazineaccept?'<span class="badge badge-success">+</span>':'<span class="badge badge-important">&mdash;</span>')  + ((page.write_txt_file_ok&&!page.cmsmagazineaccept)?'<span class="badge badge-warning">ftp write ok</span>':'')   +   page.cmsmagazine + '</td>';
			res += '<td >'+ auroParser.ftpPrintReport(page) +'</td>';


			res += '</tr>';
		}
		res += '</tbody></table>';
		$("#urlchecks").html('<h4>Состояние страниц:</h4>' + res);
		$(".tooltip").remove();
		this.printDSEO();
		this.printPHPArrays();

		this.print404list();
		this.printSeoTagsList();
		this.optionsSave();
	},

	meta_report: function (rec, site) {
		res = "";
		if (rec.length == 0) {
			res = '<span class="label" rel="tooltip" title="не менялся">NC</span>';
		}
		else if (rec == site) {
			res = '<span class="label label-success"   rel="tooltip" title="' + rec + '">OK</span>';
		}
		else {
			res = '<span class="label label-important" rel="tooltip" title="' + rec + '<hr/>' + site + '" >DIFF</span>';
		}
		return "<td>" + res + "</td>";
	},

	checkPages: function () {
		this.runAJAX();
	},

	ajaxIsStarted: false,
	runAJAX: function () {
		if (!this.ajaxIsStarted) {
			var url = this.getNextPending();
			if (url) {
				this.ajaxIsStarted = true;
				this.runAJAXQuery(url);
			}
			else {
				this.ajaxIsStarted = false;
			}

		}
	},

	getNextPending: function () {
		for (var key in this.urls) {
			var page = this.pages[key];
			if (page.status == 'pending') {
				return key;
			}
		}

		for (var key in this.urls) {
			var page = this.pages[key];
			if (page.status == 'pending2') {
				return key;
			}
		}

		return false;
	},

	runAJAXQuery: function (url) {
		var page = this.pages[url];
		var t = 0;
		if (page.status == 'pending2') {
			t = 3000;
		}

		page.status = 'query';
		page.siteCode = '000';
		this.pages[url] = page;
		this.printStatuses();
		setTimeout(function () {
			$.ajax({
				url: 'mag.php',
				type: 'POST',
				data: 'url=' + encodeURIComponent($.toJSON(url)),
				success: function (res) {
					var page = $.evalJSON(res);
					auroParser.parseAJAXAnswer(page);
				}
			});
		}, t);

	},

	parseAJAXAnswer: function (newPage) {
		var url = newPage.url;
		var page = this.pages[url];
		page.status = 'parsing';
		this.pages[url] = page;

		page.siteCode = (newPage.siteCode?newPage.siteCode:'');
		page.siteTitle = (newPage.siteTitle?newPage.siteTitle:'');
		page.siteDescription = (newPage.siteDescription?newPage.siteDescription:'');
		page.siteKeywords = (newPage.siteKeywords?newPage.siteKeywords:'');
		page.siteH1 = (newPage.siteH1?newPage.siteH1:'');
		page.site_seo_text1 = (newPage.site_seo_text1?newPage.site_seo_text1:'');
		page.site_seo_text2 = (newPage.site_seo_text2?newPage.site_seo_text2:'');
		page.origurl = (newPage.origurl?newPage.origurl:'');
		page.tagreport = (newPage.tagreport?newPage.tagreport:'');
		page.custom = (newPage.badScripts?' '+newPage.badScripts:'');
		page.cmsmagazine = (newPage.cmsmagazine?newPage.cmsmagazine:'');
		page.cmsmagazineaccept = (newPage.cmsmagazineaccept?newPage.cmsmagazineaccept:'');
		page.acceptEarly = (newPage.acceptEarly?newPage.acceptEarly:'');

		this.ajaxIsStarted = false;
		this.runAJAX();
		if (page.siteCode == '200' || page.siteCode == '301' || page.siteCode == '302' || page.siteCode == '404' || page.siteCode == '403') {
			page.status = 'finished';
		}
		else {
			page.status = 'pending2';
			page.status = 'finished';
		}
		this.pages[url] = page;
		if(!(page.cmsmagazineaccept || page.acceptEarly)){
			this.requestFTPAccess(url);
		}
		this.printStatuses();
	},

	printDSEO: function () {
		var res = "|Проект|Результат|Комментарий|\n";
		for (var key in this.urls) {
			var page = this.pages[key];
			res += page.toText();
		}
		if (res == "") {
			res = "А где чё есть?";
		}
		this.dseo.val(res);
	},


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

	replaceOrAdd: function (text, pattern, newText) {
		if (newText) {
			if (text.match(pattern)) {
				return text.replace(pattern, newText);
			}
			else {
				return text + "\n" + newText;
			}
		}
		else {
			return text;
		}

	},

	requestFTPAccess: function (url) {
		var projectName = this.getProjectName(url);
		
		$.ajax({
			url: 'http://otp.demis.ru/smoke/GM/project-access.json.php',
			type: 'POST',
			data: {
				project: projectName /*,
				"check-access": 1*/
			},
			success: function (res) {
				eval(res);
				auroParser.pages[url].access = aAccessLink.access;
				auroParser.pages[url].access_link = aAccessLink;
				auroParser.ftpUploadFileMag(auroParser.pages[url]);
				//auroParser.ftpPrintReport();
				//auroParser.ftpConnect();
			}
		});
	},

	getProjectName: function (url) {
		return url.replace("http://", "").replace("www.", "").replace(/^([^\/]+)\/.*$/, "$1");
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
	refreshAll: function(){
		for (var url in auroParser.urls) {
			auroParser.update(url);
		}
	},
/*	ftpConnect: function(){
		if(!this.FTP){
			var access = 'http://tm.demis.ru/projects/access/wiki/Access' + auroParser.projectName.replaceAll('.','');
			var res = '<br/>access: <a target="_blank" href="'+access+'">'+access+'</a>';
			$('#ftp-status').html(res);
			return;
		}
		this.FTP.project = this.projectName;
		$.ajax({
			url: 'mag.php',
			type: 'POST',
			data: {
				ftp_action: 'connect',
				ftp_data: this.FTP
			},
			success: function (res) {
				auroParser.showAlert('info', 'FTP: ' + res);
				auroParser.ftpPrintReport();
			}
		});
	},*/
	ftpPrintReport: function(page){
		var access = 'http://tm.demis.ru/projects/access/wiki/Access' + auroParser.getProjectName(page.url).replace('.','');
		if(!page.access){
		    return 'доступ не получен <a target="_blank" href="'+access+'">'+access+'</a>';
		}
		access = 'http://tm.demis.ru/projects/access/wiki/' + page.access_link.title;

		
		var ftp = page.access.FTP;
		var keys = {host: 'localhost', port: 21, login: 'user', password: 'password', path: '/'};
		res ='';
		if(ftp){
			for(var i in keys){
				if(ftp[i]){

				}else{
					ftp[i] = keys[i];

				}
			}
			ftp.path = (ftp.path + '/').replace('//', '/');

			var fast = 'ftp://' + ftp.login + ':' + ftp.password + '@' + ftp.host + ':' + ftp.port + ftp.path;
			res += '<a target="_blank" class="badge badge-info" href="'+fast+'">ftp</a>';
		}
		
		var ssh = page.access.SSH;
		var keys = {host: 'localhost', port: 22, login: 'user', password: 'password', path: '/'};

		if(ssh){
			for(var i in keys){
				if(ssh[i]){
				}else{
					ssh[i] = keys[i];
				}
			}
			ssh.path = (ssh.path + '/').replace('//', '/');

			var fast = 'sftp://' + ssh.login + ':' + ssh.password + '@' + ssh.host + ':' + ssh.port + ssh.path;
			res += '<a target="_blank" class="badge badge-info" href="'+fast+'">ssh</a>';
		}
		
		
		return '<a class="badge badge-default" target="_blank" href="'+access+'">'+page.access_link.title+'</a>' + res;

	},
	ftpLoadFile: function(filename, encoding, obj){
		$.ajax({
			url: 'mag.php',
			type: 'POST',
			data: {
				ftp_action: 'load',
				ftp_data: this.FTP,
				ftp_filename: filename,
				ftp_encoding: encoding
			},
			success: function (res) {
				obj.ftpEditor('setText', res);
			}
		});
	},
	ftpUploadFile: function(filename, encoding, obj){
		$.ajax({
			url: 'mag.php',
			type: 'POST',
			data: {
				ftp_action: 'upload',
				ftp_data: this.FTP,
				ftp_filename: filename,
				ftp_encoding: encoding,
				ftp_stream: obj
			},
			success: function (res) {
				if(res == '{true}'){
					auroParser.showAlert('success', filename +' записан успешно');
				}else{
					auroParser.showAlert('danger', 'не могу записать ' + filename);
				}
				obj.find(".fwrite").removeClass('disabled').next().removeClass('disabled');
			}
		});
	},
	ftpUploadFileMag: function(page){
		if(page.cmsmagazineaccept){
		    return;
		}
		var filename = 'cmsmagazine6e8a796f731743be14649414df09d8f0.txt';
		var encoding = 'utf8';
		var obj = '6e8a796f731743be14649414df09d8f0';
	    
	    
		$.ajax({
			url: 'mag.php',
			type: 'POST',
			data: {
				ftp_action: 'upload_mag',
				ftp_data: page.access.FTP,
				ftp_filename: filename,
				ftp_encoding: encoding,
				ftp_stream: obj,
				project: auroParser.getProjectName(page.url)
			},
			success: function (res) {
				if(res == '{true}'){
				        page.write_txt_file_ok = true;
					auroParser.showAlert('success', page.url + ' записан успешно');
				}else{
					auroParser.showAlert('danger', 'не могу записать ' + page.url );
				}
			}
		});
	},
	showAlert : function(type, message){
		var alert = $('<div class="alert alert-'+type+' fade in"><a class="close" data-dismiss="alert" href="#">×</a>'+message+'</div>')
		$('#Alerts').append(alert);
		alert.delay(5000).fadeOut('slow', function(){$(this).remove()});
	},
	optionsDefault : false,
	optionsSave : function(){
		var options = {};
		$(".options input").each(function(){
			if($(this).is("input[type=checkbox]")){
				options[$(this).attr("id")] = $(this).attr('checked')?'checked':false;
			}else{
				options[$(this).attr("id")] = $(this).val();
			}
		});
		localStorage['options'] = JSON.stringify(options);
	},
	optionsLoad: function(){
		if(!this.optionsDefault){
			this.optionsDefault = {};
			$(".options input").each(function(){
				if($(this).is("input[type=checkbox]")){
					auroParser.optionsDefault[$(this).attr("id")] = $(this).attr('checked')?'checked':false;
				}else{
					auroParser.optionsDefault[$(this).attr("id")] = $(this).val();
				}
			});
		}
		if(localStorage['options']){
			var options = JSON.parse(localStorage['options']);
			for(var id in options){
				if($('#'+id).is("input[type=checkbox]")){
					$('#'+id).attr("checked", options[id]);
				}else{
					$('#'+id).val(options[id]);
				}
			}
		}
	},
	optionsReset: function(){
		localStorage['options'] = JSON.stringify(this.optionsDefault);
		this.optionsLoad();
	}
};

var cssTools = {
	url : '',
	pageContent : '',
	cssFiles : {},
	parse: function(){
		this.loadPage();
	},
	loadPage: function(){
		this.pageContent = '';
		$.ajax({
			url: 'mag.php',
			type: 'POST',
			data: {url: encodeURIComponent($.toJSON(url))},
		}).success(function (res) {
			cssTools.parsePage($.evalJSON(res));
		});
	},
	parsePage: function(page){
		this.cssFiles = {};
		// Парсер написать
		
		// /Парсер написать
		for(var i in this.cssFiles){
			this.loadCss(i);
			file.rules = this.parseCss(file.content);
			this.cssFiles[i] = file;
		}
		this.printResults();
	},
	loadCss: function(i){
		var file = this.cssFiles[i];
		
	}
	
};



var refreshF5 = function (e)
{
    if (!e)
        var e = window.event;

    var keycode = e.keyCode;
    if (e.which)
        keycode = e.which;

    var src = e.srcElement;
    if (e.target)
        src = e.target;    

    // 116 = F5
    if (116 == keycode)
    {
	 auroParser.refreshAll();
        // Firefox and other non IE browsers
        if (e.preventDefault)
        {
            e.preventDefault();
            e.stopPropagation();
        }
        // Internet Explorer
        else if (e.keyCode)
        {
            e.keyCode = 0;
            e.returnValue = false;
            e.cancelBubble = true;
        }

        return false;
    }
}



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
    
    

$(document).ready(function () {
	auroParser.init('#src');
	setInterval(function () {
		auroParser.update();
	}, 1000);
	$("#urlchecks tr").live("click", function () {
		var url = $(this).find("a").attr("href");
		auroParser.update(url);
	});
	auroParser.optionsLoad();
	$(".options input, #dseomergersrc").change(function () {
		auroParser.printStatuses();
	}).keyup(function () {
		auroParser.printStatuses();
	});
	$("#optionsReset").click(function(){ auroParser.optionsReset(); });
	//$("#ftpConnect").click(function(){ auroParser.requestFTPAccess(); });
	$('#myTab a').click(function (e) {
		if($(this).attr("target") != '_blank'){
			e.preventDefault();
			$(this).tab('show');
			localStorage['mainTabActiveId'] = $(this).attr("href");
		}
	});
	if(localStorage['mainTabActiveId']){
		var el = $('a[href='+localStorage['mainTabActiveId']+']');
		el.tab('show');
	}
	
	$('#urlchecks').tooltip({
		selector: "span[rel=tooltip]",
		placement: "left"
	});
	$(document).keydown(refreshF5);

	$(window).resize(function(){
		var h = $(window).height();
		//$(".tab-content").height(h-75);
		$("#accordionFtpEditor .tab-pane").height(h-315);
		$("#src").height(h-30);
		$("#dseomerger textarea").height(h-100);

	}).resize();
	
});