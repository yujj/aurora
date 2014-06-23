{	
	
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

	
}


/*
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
*/


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

/*
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
})(jQuery);*/