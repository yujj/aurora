String.prototype.trim = function () {
	return this.replace(/^\s+/, "").replace(/\s+$/, "");
}

String.prototype.extract_info_by_regexp = function (re) {
	return  s = ((this.search(re) != -1) ? this.match(re)[1].trim() : "").trim();
}

String.prototype.replaceAll = function (search, replace) {
	return this.split(search).join(replace);
}



(function(){
    var app = angular.module('auroraApp', ['aurora-urls', 'optionsStore']);  
})();







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


$(document).ready(function () {

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

	$(window).resize(function(){
		var h = $(window).height();
		$("#src").height(h-30);
	}).resize();
	
});

