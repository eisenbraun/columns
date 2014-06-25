if (typeof ColumnsPlugins === 'undefined') var ColumnsPlugins = {};

ColumnsPlugins.gotopage = {
    init: function() {
        var $this = this;
        
        $this.$el.one('keyup', '.gotopage', function() {
            $this.gotoPage(parseInt($(this).val()));
        });
    },

    create: function() {
        this.view.currentPage = this.page;
        this.view.totalPages = this.pages;
    }
}