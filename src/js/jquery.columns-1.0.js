/* Copyright (c) 2014 Michael Eisenbraun (http://jquery.michaeleisenbraun.com)
 * Licensed under the MIT License.
 *
 * Version: 1.0.0
 *
 * Requires: jQuery 1.7.2+
 */

 
if(!window.console) { var console = { log: function() { } } };   

(function($) {
	$.fn.columns = function(option) {
		return this.each(function() { 
			var $el = $(this); 
						
			var data = $el.data('columns'); 
			
			if(!data) { 
				$el.data('columns', (data = new Columns(this, option))); 
			}
		}).data('columns');		
	};

	var Columns = function(element, options) { 
		this.$el = $(element); 
				
		if(options) { $.extend( this, options ); }
		
		this.init();
	};

	Columns.prototype = {
		table: null, 
		search: null, 
		schema: null,
		sortBy: null,
		showRows: [5, 10, 25, 50],
		reverse: false,
		size: 5,
		page: 1, 
		pages: 1,
		query: null,
		range: null,
		total: null,
		master: null,
		templates: {
			table: '<div class="{{columns_table_class}}"></div>', 
			search: '<div class="{{columns_search_class}}"><input class="ui-table-search" placeholder="Search" type="text" name="query" /></div>',
			open: '<table class="{{table_class}}"><thead></tr>',
			th: '<th class="{{sort}}" data-columns-sortby="{{key}}">{{header}} <span class="ui-arrow">{{arrow}}</th>',
			tbody: '</tr></thead><tbody>',
			controls: '<div class="{{table_footer_class}}"><span class="{{show_rows_class}}">Show rows: <select>{{show_rows}}</select></span> <span class="{{table_results_class}}">Results: <strong>{{table_range_start}} &ndash; {{table_range_end}}</strong> of <strong>{{table_total}}</strong></span> <span class="{{table_controls_class}}"><span class="{{prev_class}}" data-columns-page="{{prev_page}}">{{prev_text}}</span> <span class="{{next_class}}" data-columns-page="{{next_page}}">{{next_text}}</span></span></div>'
		},
		sort: function() {
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
		},
		filter: function() {
			var $this = this; 
			
			if($this.query) { 
				$this.data = $.grep($this.data, function(obj, key) {
					for(val in obj) { 
						if(typeof obj[val] === 'string') { 
							var re = new RegExp($this.query,"gi"); 
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
					
					return false;
				});
			}
			
			$this.total = $this.data.length; 			
		},
		paginate: function() { 
			var $this = this; 
			
			//calculate the number of pages
			$this.pages = Math.ceil($this.data.length/$this.size);
			
			//retrieve page number 
			$this.page = ($this.page <= $this.pages ? $this.page : 1); 
			
			
			var start = (($this.page -1) * ($this.size)) ; 
			var end = (start + $this.size < $this.total) ? start + $this.size : $this.total; 
			
			$this.range = {"start":start+1, "end":end};
			
			$this.data = $this.data.slice(start,end);
		},
		condition: function() {
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
		},
		create: function() { 
			var $this = this; 
			
			//reset data to master 
			$this.data = []; 
			$.extend($this.data, $this.master); 
			
			//check conditions
			$this.condition();
			
			//sort data
			$this.sort();
			
			//filter data
			$this.filter();
			
			//pagineate data
			$this.paginate(); 
			
			//setting prev and next
			var prev = $this.page - 1; 
			var next = ($this.page + 1 <= $this.pages) ? $this.page + 1 : 0; 
			
			//create table
			var table = $this.chevron($this.templates.open, {"table_class": "ui-table"}); 
			
			if($this.schema) { 
				
				$.each($this.data, function(key, row) {
					
					//creating thead
					if(key == 0) { 
						$.each($this.schema, function(key, col) {
							if($this.sortBy == col.key) { 
								if($this.reverse) { 
									table += $this.chevron($this.templates.th, {"sort":"ui-table-sort-down","key":col.key,"header":col.header, "arrow":" &#x25BC;"});
								} else { 
									table += $this.chevron($this.templates.th, {"sort":"ui-table-sort-up","key":col.key,"header":col.header, "arrow": "&#x25B2;"});
								}
							} else{
								table += $this.chevron($this.templates.th, {"sort":"","key":col.key,"header":col.header, "arrow":""});
							}

						}); 
						
						table += $this.chevron($this.templates.tbody,{}); 
					}
					
					//creating tbody
					table += (key%2 == 0) ? '<tr class="ui-table-rows-even">' : '<tr class="ui-table-rows-odd">'; 
					
					$.each($this.schema, function(key, col) { 
						if(col.template) { 
							table += '<td>'+$this.chevron(col.template, row)+'</td>'; 
						} else { 
							table += '<td>'+row[col.key]+'</td>'; 
						}
											
					});
					
					table += '</tr>'; 	
					
				}); 
				
			} else {
				$.each($this.data, function(key, row) { 
				
					//creating thead
					if(key == 0) {  
						$.each(row, function(col, val) { 
							if($this.sortBy == col) { 
								if($this.reverse) { 
									table += $this.chevron($this.templates.th, {"sort":"ui-table-sort-down","key":col,"header":col, "arrow":" &#x25BC;"});
								} else { 
									table += $this.chevron($this.templates.th, {"sort":"ui-table-sort-up","key":col,"header":col, "arrow": "&#x25B2;"});
								}
							} else{
								table += $this.chevron($this.templates.th, {"sort":"","key":col,"header":col, "arrow":""});
							}
								 					
						});
						
						table += $this.chevron($this.templates.tbody,{}); 
					} 
						
					//creating tbody
					table += (key%2 == 0) ? '<tr class="ui-table-rows-even">' : '<tr class="ui-table-rows-odd">'; 
					
					$.each(row, function(col, val) { 
						table += '<td>'+val+'</td>'; 					
					});
					
					table += '</tr>'; 	
					
				}); 
			}	
			
			table += '</tbody></table>'; 
			
			//create controls
			var controls = {
				"table_footer_class": "ui-table-footer",
				"table_controls_class": "ui-table-controls", 
				"prev_page":prev, 
				"prev_text": '<img src="images/arrow-left.png">', 
				"next_page":next, 
				"next_text":'<img src="images/arrow-right.png">', 
				"table_results_class":"ui-table-results",
				"table_range_start": $this.range.start,
				"table_range_end": $this.range.end,
				"table_total": $this.total, 
				"show_rows_class":"ui-table-show-rows",
				"show_rows":""
			};
			
			$.each($this.showRows, function(key, val) {
				if(val == $this.size) { 
					controls["show_rows"] += '<option value="'+val+'" selected="selected">'+val+'</option>';
				} else {
					controls["show_rows"] += '<option value="'+val+'">'+val+'</option>';
				}	
			}); 
					
			if(prev) { 
				controls["prev_class"] = "ui-table-control-prev";
			} else { 
				controls["prev_class"] = "ui-table-control-disabled";
			}			
			if(next) {
				controls["next_class"] = "ui-table-control-next"; 
			} else { 
				controls["next_class"] = "ui-table-control-disabled";
			}
			
			table += $this.chevron($this.templates.controls, controls)
						
			$this.table.html(table);
		}, 
		chevron: function(template, data) {
			$.each(data, function(key, val){
				var re = new RegExp('{{'+key+'}}', 'g');
				template = template.replace(re, val)
			});
			
			return template;
		},
		init: function() {	
			var $this = this; 
			
			if($.isArray($this.data)) { 
				$this.master = []; 
				
				//making a master copy of data 
				$.extend($this.master, $this.data); 
				
				//setting up DOM
				$this.$el.addClass('columns');
				$this.$el.append($this.chevron($this.templates.search, {"columns_search_class": "ui-columns-search"}));
				$this.$el.append($this.chevron($this.templates.table, {"columns_table_class": "ui-columns-table"}));
				
				//setting search and table objects
				$this.search = $('.ui-columns-search', $this.$el); 
				$this.table = $('.ui-columns-table', $this.$el);
				
				
				//creating listeners
				$this.$el.on('click', 'th', function() {
					if($this.sortBy == $(this).data('columns-sortby')) {
						$this.reverse = ($this.reverse) ? false : true; 
					}
					
					$this.sortBy = $(this).data('columns-sortby');
					$this.page = 1; 
					$this.create();
				}); 
				
				$this.$el.on('click', '.ui-table-control-prev, .ui-table-control-next', function() {
					$this.page = $(this).data('columns-page'); 
					$this.create();
				});
				
				$this.$el.on('keyup', '.ui-table-search', function() { 
					$this.query = $(this).val(); 
					$this.create();
				});
				
				$this.$el.on('change', '.ui-table-show-rows select', function() { 
					console.log($(this).val());
					$this.size = parseInt($(this).val());
					$this.create();
				});
				
				//creating table
				$this.create(); 

			} else { 
				$.error('The "data" parameter must be an array.');
			}
		
		}
	};
	
})(jQuery);
