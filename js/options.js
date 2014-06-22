(function(){

    angular.module('optionsStore', ['ngStorage']).

    controller('optionsCtrl', function( $localStorage ){
	
	var defaultStorage = { 
	    options: [
		{show:true,  value: "$aSEOData['title'] = ", label:'Title',       name:"title"},
		{show:true,  value: "$aSEOData['descr'] = ", label:'Description', name:"description"},
		{show:true,  value: "$aSEOData['keywr'] = ", label:'Keywords',    name:"keywords"},
		{show:false, value: "$aSEOData['h1']    = ", label:'<h1>',        name:"h1"},
		{show:false, value: "$aSEOData['text']  = ", label:'Text',        name:"text"},
		{show:false, value: "$aSEOData['text2'] = ", label:'Text2',       name:"text2"}
	    ] 
	};
	
	this.storage = $localStorage.$default(angular.copy(defaultStorage));
	
	this.resetOptions = function(){
	    this.storage.options = angular.copy(defaultStorage.options);
	};
	
    });
})();