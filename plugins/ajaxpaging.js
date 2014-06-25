if (typeof ColumnsPlugins === 'undefined') var ColumnsPlugins = {};

ColumnsPlugins.ajaxpaging = {
    init: function() {
        var $this = this;
        
        /** turning off default functionality */
        $this.conditioning = false;
        $this.paginating = false;
        $this.searching = false;
        $this.sorting = false;

        /** creating default handler */ 
        var handler = function() {
            $.ajax({
                url:"data.php",
                async: false,
                dataType: 'json',
                data: {
                    "page": $this.page,
                    "size": $this.size,
                    "sortBy": $this.sortBy,
                    "reverse": $this.reverse,
                    "query": $this.query
                },
                success: function(json) {
                    $this.total = json.total;
                    $this.pages = json.pages;
                    $this.setMaster(json.data);
                    $this.create();
                }
            });
        }

        /** override handlers */ 
        $this.pageHandler = handler;
        $this.sizeHandler = handler;

        /** search handler, sets page to 1 first */ 
        $this.searchHandler = function() {
            $this.page = 1;
            handler();
        }

        /** sort handler, sets page to 1 first */ 
        $this.sortHandler = function() {
            $this.page = 1;
            handler();
        }
    },

    create: function() {
        var $this = this;
        
        /** setting current result range */
        $this.setRange();

        /** setting view variables */
        $this.view.tableTotal = $this.total;
        $this.view.prevPageExists = $this.pageExists($this.page-1);
        $this.view.nextPageExists = $this.pageExists($this.page+1); 
        $this.view.resultRange = $this.range;
    }
}