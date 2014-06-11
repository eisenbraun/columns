/*** 
 * Copyright (c) 2014 Michael Eisenbraun (http://jquery.michaeleisenbraun.com)
 * Licensed under the MIT License.
 *
 * Version: 2.0.0
 *
 * Requires: jQuery 1.7.2+
 */

if(!window.console) { var console = { log: function() { } } };   

(function($) {
    $.fn.columns = function(options) {
        var val = []; 
		var args = Array.prototype.slice.call(arguments, 1);
	
		if(typeof options === 'string') { 
			this.each(function() {
			
				var instance = $.data(this, 'columns');
				if (typeof instance !== 'undefined' && $.isFunction(instance[options])) {
					var methodVal = instance[options].apply(instance, args);
					if (methodVal !== undefined && methodVal !== instance) val.push(methodVal);
				} else {
					return $.error('No such method "' + options + '" for Columns');	
				} 
			}); 
				
		} else {
			this.each(function() { 
				if(!$.data(this, 'columns')) { 
					$.data(this, 'columns', new Columns(this, options)); 
				}	
			}); 
		}
	
		if (val.length === 0) { 
			return this.data('columns');
		} else if (val.length === 1) {
			return val[0];
		} else {
			return val;		
		} 	
	};

	var Columns = function(element, options) { 
		this.$el = $(element); 
				
		if(options) { $.extend( this, options ); }
		
		//constants
		this.VERSION = '2.0.0'; 
		
		
		//methods
		this.sort = function() {
			var $this = this; 
			var date = /^(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December|(0?\d{1})|(10|11|12))(-|\s|\/|\.)(0?[1-9]|(1|2)[0-9]|3(0|1))(-|\s|\/|\.|,\s)(19|20)?\d\d$/i;
			
			function objectSort(field, reverse, primer){
				reverse = (reverse) ? -1 : 1;
				
				return function(a,b){
				
					a = a[field];
					b = b[field];
			
					if (date.test(a) && date.test(b)) {
						a = new Date(a); 
						a = Date.parse(a);
						
						b = new Date(b); 
						b = Date.parse(b); 
					} else if (typeof(primer) != 'undefined'){
						a = primer(a);
						b = primer(b);
					}
			
					if (a<b) return reverse * -1;
					if (a>b) return reverse * 1;
					return 0;
				}
			}
			
			if($this.sortBy && typeof $this.data[0][$this.sortBy] != 'undefined') { 
				$this.data.sort(objectSort($this.sortBy, $this.reverse));
			}
		};
		
		this.filter = function() {
			var $this = this; 			
			
			if($this.query) { 
				$this.data = $.grep($this.data, function(obj, key) {
					for(val in obj) {
						if($.inArray(val, $this.searchableFields) != -1) { 
							if(typeof obj[val] === 'string') { 
								var re = new RegExp($this.query, "gi");
								if(obj[val].match(re)) {
									return true;
									break;
								}
							} else if(typeof obj[val] === 'number') { 
								if(obj[val] == $this.query) {
									return true;
									break;
								}
							} 
						}
					}
					
					return false;
				});
			}
			
			$this.total = $this.data.length; 				
		}; 
		
		this.paginate = function() { 
			var $this = this; 
			
			//calculate the number of pages
			$this.pages = Math.ceil($this.data.length/$this.size);
			
			//retrieve page number 
			$this.page = ($this.page <= $this.pages ? $this.page : 1); 
			
			
			var start = (($this.page -1) * ($this.size)) ; 
			var end = (start + $this.size < $this.total) ? start + $this.size : $this.total; 
			
			$this.range = {"start":start+1, "end":end};
			
			$this.data = $this.data.slice(start,end);
		}; 
		
		this.condition = function() {
			var $this = this,
			schema = [], 
			temp = {};
			if($this.schema) { 
				$.each($this.data, function(key, data) {
					temp = {}; 
					
					$.each($this.schema, function(key, val) {
						if(val.condition) { 
							if(!val.condition(data[val.key])) { 
								temp = null;
								return false;					
							} 
						} 						
						
						temp[val.key] = data[val.key];
					});
					
					if(temp) {schema.push(temp);}
				});
			
				$this.data = schema;	

			}
		}; 
		
		this.chevron = function(template, data) {
			$.each(data, function(key, val){
				var re = new RegExp('{{'+key+'}}', 'g');
				template = template.replace(re, val)
			});
			
			return template;
		}; 
		
		this.create = function() { 
			var $this = this; 
			
			//Building Data
			$this.resetData(); 
			
			$this.condition();
			
			$this.sort();
			
			$this.filter();
			
			$this.paginate(); 
			
			
					
					
			//Building Column Elements					
			function buildThead() {
				$this.thead = []; 
				
				$.each($this.schema, function(key, col) {
					if (!col.hide) {
						var th = {}; 
						
						if ($.inArray(col.key,$this.sortableFields) == -1) { 
							console.log(col.key);
							th.notSortable = true; 
						} else if ($this.sortBy == col.key) { 
							if ($this.reverse) { 
								th.sortedDown = true; 
							} else { 
								th.sortedUp = true; 
							}	
						} else { 
							th.sortable = true; 
						}
						
						th.key = col.key; 
						th.header = col.header; 
						
						$this.thead.push(th);
					}
				}); 
			}
			
			function buildRows(key, row) { 
				var tr = []; 
				
				if (key%2 == 0) {
					tr.push( '<tr class="'+$this.evenRowClass+'">' ); 
				} else {
					tr.push('<tr class="'+$this.oddRowClass+'">');
				}
				 
				$.each($this.schema, function(key, col) {  
					if (!col.hide) {
						if (col.template) { 
							tr.push('<td>'+$this.chevron(col.template, row)+'</td>'); 
						} else { 
							tr.push('<td>'+row[col.key]+'</td>'); 
						}
					}					
				});
				
				tr.push('</tr>');
				
				return tr;  
			}
			
			function buildShowRowsMenu() {
				menu = [];
				
				menu.push('<select>'); 
				
				$.each($this.showRows, function(key, val) {
					var option = '<option value="'+val+'"'; 
					
					if(val == $this.size) { option += 'selected="selected"' }
					
					option += '>'+val+'</option>'; 
					
					menu.push(option); 	
				});
				
				menu.push('</select>');
				
				$this.showRowsMenu = menu.join('');
			}
			
			function buildTable() { 
				$this.rows = []; 
			
				$.each($this.data, function(key, row) {
					if (key == 0) { buildThead(); } 	
					$this.rows.push(buildRows(key, row).join(''));	
				}); 
			}
			
			buildTable(); 			
			buildShowRowsMenu(); 
			
			//Creating Table from Mustache Template			
			var view = { 
				prevPage: $this.page-1,
				nextPage: $this.page+1,
				prevPageExists: $this.pageExists($this.page-1),
				nextPageExists: $this.pageExists($this.page+1), 
				resultRange: $this.range, 
				tableTotal: $this.total, 
				showRowsMenu: $this.showRowsMenu,
				rows: $this.rows,
				headers: $this.thead,
				query: $this.query,
				search: $this.search,
				table: $this.table
			}; 
			$.extend($this.view, view);
			
			//Calling plugins, if any 
			if($this.plugins) { 
				$.each($this.plugins, function(key, val) {
					if(typeof ColumnsPlugins !== 'undefined') { 
						if(typeof ColumnsPlugins[val] !== 'undefined') { 
							ColumnsPlugins[val].init.call($this); 
						}
					}
				}); 
			}
			
			
			if ($this.search) { 
				$this.$el.html(Mustache.render($this.template, $this.view));
				$this.search = false;
			} else { 
				$('[data-columns-table]', $this.$el).remove(); 
				$this.$el.append(Mustache.render($this.template, $this.view));
			}
			

		}; 
		
		this.init = function() {	
			var $this = this; 
			
			function buildSchema() {
				$this.schema = [];  
				$.each($this.data[0], function(key, val) {
					$this.schema.push({"header":key, "key":key});
				}); 
			}
			
			function buildSearchableFields() {
				$this.searchableFields = [];  
				$.each($this.data[0], function(key, val) {
					$this.searchableFields.push(key);
				}); 
			}
			
			function buildSortableFields() {
				$this.sortableFields = [];  
				$.each($this.data[0], function(key, val) {
					$this.sortableFields.push(key);
				}); 
			}
			
			function getTemplateFile() { 
				$.ajax({
					url: $this.templateFile, 
					async: false, 
					success: function(template) { 
						$this.template = template; 
					}, 
					error: function() { 
						$.error('Template could not be found.');
					}
				}); 
			}
			
			if ($.isArray($this.data)) { 
				$this.master = []; 
				$this.view = {};
				//making a master copy of data 
				$.extend($this.master, $this.data); 
				
				//updating defaults
				if (!$this.schema) { buildSchema(); }
				if (!$this.searchableFields) { buildSearchableFields(); }
				if (!$this.sortableFields) { buildSortableFields(); }				
				if ($this.templateFile) { getTemplateFile(); } 
							
				//setting up DOM
				$this.$el.addClass('columns');
								
				//creating listeners
				$this.$el.on('click', 'th', function() {
					var sortBy = $(this).data('columns-sortby');
					
					if ($.inArray(sortBy, $this.sortableFields) != -1) {
						if ($this.sortBy == sortBy) {
							$this.reverse = ($this.reverse) ? false : true; 
						}
						
						$this.sortBy = sortBy;
						$this.page = 1; 
						$this.create();
					}
				}); 
				
				$this.$el.on('click', '[data-columns-page]', function() {
					$this.page = $(this).data('columns-page'); 
					$this.create();
				});
				
				$this.$el.on('keyup', '[data-columns-search]', function(e) { 
					if($this.liveSearch) { 
						$this.query = $(this).val(); 
						$this.create();
					} else { 
						if(e.keyCode == '13') { 
							$this.query = $(this).val(); 
							$this.create();
						}
					}
				});
				
				$this.$el.on('change', '.ui-table-show-rows select', function() { 
					$this.size = parseInt($(this).val());
					$this.create();
				});
								
				$this.create(); 

			} else { 
				$.error('The "data" parameter must be an array.');
			}
		
		};
		
		this.init();
	};

	Columns.prototype = {
		
		//defaults
		evenRowClass: "ui-table-rows-even", 
		oddRowClass: "ui-table-rows-odd",
		liveSearch: true,
		page: 1, 
		pages: 1,
		plugins: null,
		query: null,
		reverse: false,
		schema: null,
		search: true,
		searchableFields: null,
		showRows: [5, 10, 25, 50],
		size: 5,
		sortableFields: null, 
		sortBy: null, 
		table: true,
		templateFile: null,
		template: '{{#search}}<div class="ui-columns-search"><input class="ui-table-search" placeholder="Search" type="text" name="query" data-columns-search="true" value="{{query}}" /></div>{{/search}}{{#table}}<div class="ui-columns-table" data-columns-table="true"><table class="ui-table"><thead>{{#headers}}{{#sortable}}<th class="" data-columns-sortby="{{key}}">{{header}}</th>{{/sortable}}{{#notSortable}}<th class="" data-columns-sortby="{{key}}">{{header}}</th>{{/notSortable}}{{#sortedUp}}<th class="ui-table-sort-up" data-columns-sortby="{{key}}">{{header}} <span class="ui-arrow">&#x25B2;</th>{{/sortedUp}}{{#sortedDown}}<th class="ui-table-sort-down" data-columns-sortby="{{key}}">{{header}} <span class="ui-arrow">&#x25BC;</th>{{/sortedDown}}{{/headers}}</thead><tbody>{{#rows}}{{{.}}}{{/rows}}</tbody></table><div class="ui-table-footer"><span class="ui-table-show-rows">Show rows: {{{showRowsMenu}}}</span><span class="ui-table-results">Results: <strong>{{resultRange.start}} &ndash; {{resultRange.end}}</strong> of <strong>{{tableTotal}}</strong></span><span class="ui-table-controls">{{#prevPageExists}}<span class="ui-table-control-prev" data-columns-page="{{prevPage}}"><img src="images/arrow-left.png"></span>{{/prevPageExists}}{{^prevPageExists}}<span class="ui-table-control-disabled"><img src="images/arrow-left.png"></span>{{/prevPageExists}}{{#nextPageExists}}<span class="ui-table-control-next" data-columns-page="{{nextPage}}"><img src="images/arrow-right.png"></span>{{/nextPageExists}}{{^nextPageExists}}<span class="ui-table-control-disabled"><img src="images/arrow-right.png"></span>{{/nextPageExists}}</span></div></div>{{/table}}', 
		
		
		//API 
		getObject: function() { 
			return this; 
		},
		getPage: function() { 
			return this.page; 
		}, 
		getQuery: function() { 
			return this.query;	
		},
		getRange: function() {
			return this.range;	
		},
		getRows: function() { 
			return this.rows;
		},
		getShowRowsMenu: function() { 
			return this.showRowsMenu;	
		},
		getTemplate: function() { 
			return this.template; 
		},
		getThead: function() {
			return this.thead;
		},
		getTotal: function() { 
			return this.total;
		},
		getVersion: function() { 
			return this.VERSION; 
		}, 
		getView: function() { 
			return this.view; 
		},
		gotoPage: function(p) { 
			if(this.pageExists(p)) { 
				this.page = p; 
				this.create(); 
				return true; 
			}
			
			return false;
		},
		pageExists: function(p) {
			return (p > 0 && p <= this.pages) ? true : false; 	
		}, 
		resetData: function() { 
			return this.data = this.master.slice(0);
		}
	};
	
})(jQuery);
