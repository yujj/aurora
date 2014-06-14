(function(){
    var app = angular.module('auroraApp', ['aurora-urls']);  
})();





String.prototype.trim = function () {
	return this.replace(/^\s+/, "").replace(/\s+$/, "");
}

String.prototype.escapeHtml = function () {
	return this.replace(/&(?!amp;)/g, "&amp;").replace(/<(?!lt;)/g, "&lt;").replace(/>(?!gt;)/g, "&gt;").replace(/"(?!quot;)/g, "&quot;").replace(/'(?!#039;)/g, "&#039;").replace(/&amp;(\w+;)/g, "&$1");
}

String.prototype.extract_info_by_regexp = function (re) {
	var s = ((this.search(re) != -1) ? this.match(re)[1].trim() : "");
// 	s = s.escapeHtml().trim();
	s = s.trim();
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
		/*if (this.text != text) {
			this.text = text;
// 			this.clearText();
			this.parsePages();
			this.printStatuses();
			this.saveText();
		}*/
	},
/* moved
	clearText: function () {
		var text = this.text;
		if (text.indexOf('http://') == 0) {
			text = text.replaceAll('http://', '1 http://');
			this.obj_src_text.val(text);
		}

		
		this.text = text;
	},
*/
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
		var res = "<table class='table table-striped table-bordered table-condensed'><thead><th>#</th><th>URL</th><th>Title</th><th>Keywords</th><th>Description</th><th>H1</th><th>SEO-Тэги</th></thead><tbody>";
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
			var ans = '<span class="badge ' + badgeClass + '">' + page.siteCode + page.custom + '</span>';
			res += '<tr><td>' + i + '.</td><td class="' + page.status + '">' + ans;
			i++;
			if (page.origurl != undefined && page.origurl != page.url_short && page.origurl.length > 0) {
				if (page.origurl == '--Can`t get original URI--') res += '<span class="label label-important" title="Не могу получить оригинальный урл" rel="tooltip" data-placement="right">SUX</span>';
				else res += '<span class="label label-success">' + page.origurl + '</span>';
			}
			res += ' <a target="_blank" href="' + page.url + '">' + page.url + '</a>';
			res += '</td>';
			res += this.meta_report(page.title, page.siteTitle);
			res += this.meta_report(page.keywords, page.siteKeywords);
			res += this.meta_report(page.description, page.siteDescription);
			res += this.meta_report(page.h1, page.siteH1);
			res += '<td class="tagreport">' + page.tagreport + '</td>';
			res += '</tr>';
		}
		res += '</tbody></table>';
		$("#urlchecks").html('<h4>Состояние страниц:</h4>' + res);
		$(".tooltip").remove();
		this.printDSEO();
		this.printPHPArrays();
		this.printDseoMerge();
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
				url: 'index.php',
				type: 'POST',
				data: {url: url},
				success: function (page) {
					auroParser.parseAJAXAnswer(page);
				},
				dataType: "json"
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
		page.custom = (newPage.badScripts?' '+newPage.badScripts:'') + (newPage.cmsmagazine?' CMSMAGAZINE: '+newPage.cmsmagazine:'')

		this.ajaxIsStarted = false;
		this.runAJAX();
		if (page.siteCode == '200' || page.siteCode == '301' || page.siteCode == '302' || page.siteCode == '404' || page.siteCode == '403') {
			page.status = 'finished';
		}
		else {
			page.status = 'pending2';
		}
		this.pages[url] = page;
		this.printStatuses();
	},

	printDSEO: function () {
		var res = "";
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

	printDseoMerge: function () {
		var text = this.dseomergersrc.val();
		var cases = text.split(this.case_patt);
		var res = "";
		var used = {};
		for (var i in cases) {
			var _case = cases[i].trim();
			var url = _case.match(this.case_url_patt);
			if (url) {
				url = url[1];
				url = this.surls[url];
				if (url && this.pages[url]) {
					used[url] = 1;
					var page = this.pages[url];
					_case = this.replaceOrAdd(_case, this.case_title_patt, page.getTitle());
					_case = this.replaceOrAdd(_case, this.case_descr_patt, page.getDescription());
					_case = this.replaceOrAdd(_case, this.case_keywr_patt, page.getKeywords());
					_case = this.replaceOrAdd(_case, this.case_h1_patt, page.getH1());
					_case = this.replaceOrAdd(_case, this.case_text_patt, page.getText());
					_case = this.replaceOrAdd(_case, this.case_text_alt_patt, page.getTextAlt());
				}
				res += "\n\n    " + _case + "\n    break;";
			}
		}
		res += "\n\n"
		for (var key in this.urls) {
			if (!used[key]) {
				var page = this.pages[key];
				res += page.toText();
			}
		}
		$('#dseomergerdst').val(res);
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

	requestFTPAccess: function () {
		var projectName = this.getProjectName();
		if(this.projectName == projectName){ 
			return;
		}
		this.projectName = projectName;
		$('.feditor').each(function(){
			$(this).ftpEditor("setText", "{clear}");
		});
		
		$.ajax({
			url: 'http://otp.demis.ru/smoke/GM/project-access.json.php',
			type: 'POST',
			data: {
				project: projectName /*,
				"check-access": 1*/
			},
			success: function (res) {
				eval(res);
				var FTP = aAccessLink.access.FTP;
				auroParser.FTP = FTP;
				var ftpStatus;
				if (FTP) {
					ftpStatus = FTP.check;
				}
				else {
					ftpStatus = 'доступы не найдены';
				}
				var ftpStatusClass = ((ftpStatus == 'ok') ? 'label-success' : 'label-important');
				$('#ftp-status').addClass(ftpStatusClass).text("FTP подключение: " + ftpStatus);
				auroParser.ftpPrintReport();
				if($('#authform').size()==0) auroParser.ftpConnect();
			}
		});
	},

	getProjectName: function () {
		for (var key in this.urls) {
			var page = this.pages[key];
			var url = page.url.replace("http://", "").replace("www.", "").replace(/^([^\/]+)\/.*$/, "$1");
			return url;
		}
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
	ftpConnect: function(){
		if(!this.FTP){
			var access = 'http://tm.demis.ru/projects/access/wiki/Access' + auroParser.projectName.replaceAll('.','');
			var res = '<br/>access: <a target="_blank" href="'+access+'">'+access+'</a>';
			$('#ftp-status').html(res);
			return;
		}
		this.FTP.project = this.projectName;
		$.ajax({
			url: 'index.php',
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
	},
	ftpPrintReport: function(){
		var ftp = auroParser.FTP;
		var keys = {host: 'localhost', port: 21, login: 'user', password: 'password', path: '/'};
		res ='';
		if(ftp){
			for(var i in keys){
				if(ftp[i]){
					res += '<br/>' + i + ': ' + ftp[i];
				}else{
					ftp[i] = keys[i];
					res += '<br/>' + i + ': ' + ftp[i] + ' <span style="color: red;">default</span>';
				}
			}
			ftp.path = (ftp.path + '/').replace('//', '/');
			auroParser.FTP = ftp;
			var fast = 'ftp://' + ftp.login + ':' + ftp.password + '@' + ftp.host + ':' + ftp.port + ftp.path;
			res += '<br/>fast: <a target="_blank" href="'+fast+'">'+fast+'</a>';
			var access = 'http://tm.demis.ru/projects/access/wiki/Access' + auroParser.projectName.replace('.','');
			res += '<br/>access: <a target="_blank" href="'+access+'">'+access+'</a>';
			var backups = document.location + 'backups/' + ftp.project + '/';
			res += '<br/>backups: <a target="_blank" href="'+backups+'">'+backups+'</a>';
		}
		$('#ftp-status').html(res);
	},
	ftpLoadFile: function(filename, encoding, obj){
		$.ajax({
			url: 'index.php',
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
			url: 'index.php',
			type: 'POST',
			data: {
				ftp_action: 'upload',
				ftp_data: this.FTP,
				ftp_filename: filename,
				ftp_encoding: encoding,
				ftp_stream: obj.ftpEditor('getText')
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
	showAlert : function(type, message){
		var alert = $('<div class="alert alert-'+type+' fade in"><a class="close" data-dismiss="alert" href="#">×</a>'+message+'</div>')
		$('#ftpEditorAlerts').append(alert);
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
			url: 'index.php',
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

var editors = {};

    function isFullScreen(cm) {
      return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
    }
    function winHeight() {
      return window.innerHeight || (document.documentElement || document.body).clientHeight;
    }
    function setFullScreen(cm, full) {
      var wrap = cm.getWrapperElement(), scroll = cm.getScrollerElement();
      if (full) {
        wrap.className += " CodeMirror-fullscreen";
        scroll.style.height = winHeight() + "px";
        document.documentElement.style.overflow = "hidden";
      } else {
        wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
        scroll.style.height = "";
        document.documentElement.style.overflow = "";
	$(window).resize();
      }
      cm.refresh();
    }
    CodeMirror.connect(window, "resize", function() {
      var showing = document.body.getElementsByClassName("CodeMirror-fullscreen")[0];
      if (!showing) return;
      showing.CodeMirror.getScrollerElement().style.height = winHeight() + "px";
    });


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
	$("#urlchecks").on("click", "tr", function () {
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
	$("#ftpConnect").click(function(){ auroParser.requestFTPAccess(); });
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
	var files = ['robots.txt','sitemap.xml','d-seo.php','d-url-rewriter.php','index.php','.htaccess'];
	var feditorTemplate = $('#feditorTemplate').html();
	var res = '';
	for(var i in files){
		var filename = files[i];
		var fileid = 'collapse'+i;
		var feditor = feditorTemplate;
		var encoding = 'none';
		feditor = feditor
			.replaceAll('{filename}',filename)
			.replaceAll('{fileid}',fileid)
			.replaceAll('{encoding}',encoding);
		res += feditor;
	}
	$('#accordionFtpEditor .tab-content').append(res).find('ul.lia li').appendTo($('#accordionFtpEditor .nav'));
	$('.lia').remove();
	$('#feditorTemplate').remove();
	$('#myTab2 a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	})
	$('.feditor').ftpEditor();
	$('#myTab2 a').on('show',function(){
		var obj = $($(this).attr('href'));
	//	var top = $($(this).attr('href')).find('.CodeMirror-scroll > div > div');//.offset().top;
		if(obj.find(".fwrite").is(".disabled")){
			obj.find(".fread").click();
		}
		
		//alert(top);
	});
	
	
	$('.ftext').each(function(){
		var id = $(this).attr('id');
		var editor = CodeMirror.fromTextArea(document.getElementById(id), {
			mode: "application/x-httpd-php",
			lineNumbers: true,
			matchBrackets: true,
			indentUnit: 4,
			indentWithTabs: true,
			enterMode: "keep",
			tabMode: "shift",
			lineWrapping: true,
			onCursorActivity: function() {
				editor.setLineClass(hlLine, null, null);
				hlLine = editor.setLineClass(editor.getCursor().line, null, "activeline");
			},      
			extraKeys: {
				"F11": function(cm) {
					setFullScreen(cm, !isFullScreen(cm));
				},
				"Esc": function(cm) {
					if (isFullScreen(cm)) setFullScreen(cm, false);
				},
				"Ctrl-S": function(cm) {
					$(cm.getWrapperElement()).parents(".feditor").find('.fwrite').click();
				}
			}
		});
		var hlLine = editor.setLineClass(0, "activeline");
		editors[id] = editor;
	});

	$(window).resize(function(){
		var h = $(window).height();
		//$(".tab-content").height(h-75);
		$("#accordionFtpEditor .tab-pane").height(h-315);
		$("#src").height(h-30);
		$("#dseomerger textarea").height(h-100);
		//$(".CodeMirror-scroll").height(h-315);
	}).resize();
	
	xenuReporter.init($('#xenu_in_text'), $('#xenu_out_text_301'), $('#xenu_out_text_xxx'), $('#xenu_out_text_404'));
	
});


(function($){
	jQuery.fn.ftpEditor = function( method ){
		var make = function(){
			var $this = $(this);
			$this.find('.fread').click(function(){
				rwFile(this, false, 'read');
			});
			$this.find('.freadutf8').click(function(){
				rwFile(this, "utf8", 'read');
			});
			$this.find('.freadcp1251').click(function(){
				rwFile(this, "windows-1251", 'read');
			});
			$this.find('.fwrite').click(function(){
				rwFile(this, false, 'write');
			});
			$this.find('.fwriteutf8').click(function(){
				rwFile(this, "utf8", 'write');
			});
			$this.find('.fwritecp1251').click(function(){
				rwFile(this, "windows-1251", 'write');
			});
			$this.find('.fcreate').click(function(){
				var p = $(this).parents(".feditor");
				p.ftpEditor('setText', '{create}');
			});
			$this.find('.fformatselected').click(function(){
				var editor = editors[$(this).parents(".feditor").find(".ftext").attr("id")];
				var range = { from: editor.getCursor(true), to: editor.getCursor(false) };
				editor.setOption("mode","htmlmixed");
				editor.autoFormatRange(range.from, range.to);
				editor.setOption("mode","application/x-httpd-php");
			});
			$this.find('.ffullscreen').click(function(){
				var editor = editors[$(this).parents(".feditor").find(".ftext").attr("id")];
				setFullScreen(editor, true);
			});
		};
		
		var rwFile = function(obj, encoding, func){
			if($(obj).hasClass('disabled')) return;
			var p = $(obj).parents(".feditor");
			var filename = p.data("filename");
			if(!encoding){
				encoding = p.data("encoding");
				if(encoding=='none'){
					encoding = 'utf8';
				}
			}else{
				p.data("encoding", encoding);
			}
			var dest = p.find('.ftext');
			p.find(".fwrite").addClass('disabled').next().addClass('disabled');
			if(func == 'write'){
				auroParser.ftpUploadFile(filename, encoding, p);
			}else{
				auroParser.ftpLoadFile(filename, encoding, p);
			}
		}
		
		var methods = {
			setText : function( text ) {
				if(text == '{create}'){
					//$(this).find(".ftext").val("Ещё не поздно это отменить... \n\nЗагрузить файл с фтп, или проверить параметр path в доступах");
					editors[$(this).find(".ftext").attr("id")].setValue("Ещё не поздно это отменить... \n\nЗагрузить файл с фтп, или проверить параметр path в доступах");
					$(this).find(".fwrite").removeClass('disabled').next().removeClass('disabled');
					var filename = $(this).data("filename");
					auroParser.showAlert('warning', 'Создан новый файл ' + filename);
				}else
				if(text == '{false}' || text == '{clear}'){
					//$(this).find(".ftext").val('');
					editors[$(this).find(".ftext").attr("id")].setValue("");
					$(this).find(".fwrite").addClass('disabled').next().addClass('disabled');
					var filename = $(this).data("filename");
					if(text == '{false}'){
						auroParser.showAlert('error', 'Не могу скачать файл ' + filename);
					}
				}else{
					//$(this).find(".ftext").removeClass('hidden').val(text);
					editors[$(this).find(".ftext").attr("id")].setValue(text);
					$(this).find(".fwrite").removeClass('disabled').next().removeClass('disabled');
					var filename = $(this).data("filename");
					auroParser.showAlert('success', 'Загружен файл ' + filename);
				}
			},
			getText : function(){
				//return $(this).find(".ftext").val();
				return editors[$(this).find(".ftext").attr("id")].getValue();
			}
		};
   
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			// return methods.init.apply( this, arguments );
		} else {
			$.error( 'Метод ' +  method + ' в jQuery.tooltip не существует' );
		}    
   
		
		
		
		return this.each(make); 
	};
})(jQuery);