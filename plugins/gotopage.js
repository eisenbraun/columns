if (typeof ColumnsPlugins === 'undefined') var ColumnsPlugins = {};

var called = false; 

ColumnsPlugins.gotopage = {
    init: function() {
    	var $this = this; 
    	
    	//prevent this from being called more than once
    	if(!called) {
	    	$this.$el.on('keyup', '.gotopage', function() { 
		    	$this.gotoPage(parseInt($(this).val())); 	
	    	}); 
	    	
	    	called = true; 
    	}
    	
    
		$this.view.currentPage = $this.page; 
		$this.view.totalPages = $this.pages; 
	}
}