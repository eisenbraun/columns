## Columns
#### by Michael Eisenbraun

Columns is an easy way of creating JSON data into HTML tables that are sortable, searchable, and paginating. All you need is to provide the data, and Columns will do the rest.

### Installation

Include the jQuery Library 1.7 or later and Columns Plugin File: 

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="js/jquery.columns-2.0.min.js"></script>
```

Include a pre-built Columns theme or create your own

```
<link rel="stylesheet" href="css/classic.css">
```

Because Columns create all the necessary HTML dynamically, the only HTML needed is a empty HTML element, such as a `<div>` tag, with the corresponding id as using in the initialization.

```
<div id="columns"></div>
```

Finally, initialize Columns. 

```
<script>
  $(document).ready(function() {
    var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}]; 
    $('#columns').columns({data:json});
  });
</script>
```

<br>

### Options

The changing how Columns builds the table is created can be manipulated by passing a object as a parameter during invocation.

There is only one required object attribute, the data attribute, which must be an array of objects (see example above). All other attributes are optional.

**data** _(Object)_

REQUIRED. This is the data that columns uses to build the table.

```
 var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
 $('#columns').columns({ 
   data: json
 });
```
***

**evenRowClass** _(String)_

This class is added to all the even rows within the tbody.

Default: `'ui-table-rows-even'`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json, 
  evenRowClass: 'even-rows'
});
```

***

**oddRowClass** _(String)_

This class is added to all the odd rows within the tbody.

Default: `'ui-table-rows-even'`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json, 
  evenRowClass: 'odd-rows'
});
```

***

**liveSearch** _(Boolean)_

If true, results will be filter on keyup. If false, search will not initiate until the "enter" is pressed.

Default: `true`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#paginate').paginate({ 
  data: json,
  liveSearch: false
});
```

***

**page** _(Number)_

The page to be displayed

Default: `1`

***

**plugins** _(Array)_

Columns will attempt to call the list of plugins. See Plugins for more information.

Default: `null`

***

**query** _(String)_

If set, will filter data to only to those rows with values that match query.

Default: `null`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json,
  query:'row2'
});
```

***

**reverse** _(Boolean)_

If true, sort data in reverse order; sortBy must be set.

Default: `false`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json,
  sortBy: 'col2',
  reverse: true
});
```

***

**schema** _(Array of Objects)_

If set, formats the table to the schema's design. 
Each schema object requires two attributes: header (the title of column) and key (the corresponding data attribute key). For additional options, see Schema below.

Default: `null`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json,
  schema:[
      { "header":"Column 1","key":"col1"},
      { "header":"Column 2","key":"col2"}
  ]
});
```

***

**searchableFields** _(Array of JSON keys)_

If set, the listed keys and there associated values will be searched. If null, all data is searchable.

Default: `null`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#paginate').paginate({ 
  data: json,
  searchableFields: ['col1'],
  schema:[
    { "header":"Column 1","key":"col1"},
    { "header":"Column 2","key":"col2"}
  ]
});
```

***

**showRows** _(Array of Numbers)_

If set, displays a select box with each number as an option.

Default: `[5, 10, 25, 50]`

***

**size** _(Number)_

The number of rows to display per page.

Default: `10`

***

**sortableFields** _(Array of JSON keys)_

If set, the columns associated with the listed keys will be sortable. If null, all columns will be sortable.

Default: `null`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#paginate').paginate({ 
  data: json,
  sortableFields: ['col1'],
  schema:[
    { "header":"Column 1","key":"col1"},
    { "header":"Column 2","key":"col2"}
  ]
});
```

***

**sortBy** _(String)_

If set, sort data by at that attribute key

Default: `null`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json,
  sortBy: 'col2'
});
```

***

**templateFile** _(String)_

The path to an external Mustache Template. If null, default template will be used.

Default: `null`

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json,
  template: 'template/custom.mst'
});
```
<br>

### Schema

Schema is a blueprint for columns to build the table. With schema you can set column order and column header or even remove columns all together from the original data. Schema allows for templates to be create for row data, and conditional statements can be added to show only desired data.

Schema is an Array of Objects. Each object serves as a table column, and must contain a header and key attribute. The order in which the object are place in the array is the order that they will appear in the table. See below for additional information about the different options that can be applied to each schema object.

**condition** _(Function)_

This is a condition that each column data must meet to be displayed. The function must return a `Boolean`.

```
var json = [{"col1":"1", "col2":"one"}, {"col1":"2", "col2":"two"}, {"col1":"3", "col2":"three"}];`
$('#columns').columns({ 
  data: json,
  schema:[
      {"header":"Numbers","key":"col1", "condition":function(val) { return (val%2 != 0); /*only show odd numbers */ } },
      {"header":"Words","key":"col2"}
  ]
});
```

***

**header** _(String)_

REQUIRED. The title for the column header.

```
var json = [{"col1":"1", "col2":"one"}, {"col1":"2", "col2":"two"}, {"col1":"3", "col2":"three"}];
$('#columns').columns({ 
  data: json,
  schema:[
      {"header":"Numbers","key":"col1"},
      {"header":"Words","key":"col2"}
  ]
});
```

***

**key** _(String)_

REQUIRED. The corresponding data attribute key for this columns data.

```
var json = [{"col1":"1", "col2":"one"}, {"col1":"2", "col2":"two"}, {"col1":"3", "col2":"three"}];
$('#columns').columns({ 
  data: json,
  schema:[
      {"header":"Numbers","key":"col1"},
      {"header":"Words","key":"col2"}
  ]
});
```

***

**template** _(String)_

The template allow for a row data to be customized to include additional HTML and content. Data values be added to the template by including the data attribute key between double curly brackets `({{col1}})`.

```
var json = [{"col1":"1", "col2":"one"}, {"col1":"2", "col2":"two"}, {"col1":"3", "col2":"three"}];
$('#columns').columns({ 
  data: json,
  schema:[
      {"header":"Numbers","key":"col1", "template":"This is row <strong>{{col1}}</strong>." },
      {"header":"Words","key":"col2"}
  ]
});
```

<br>

### API

**getObject** 

This method returns Columns' object

External call:
```
var columns_object = $('#columns').columns('getObject');
```

To call internally from a plugin use `this`.

***

**getPage**

This method returns the table's current page.

External call:
```
var columns_object = $('#columns').columns('getPage');
```

To call internally from a plugin use `this.page`.

***

**getQuery**

This method returns the current search query.

External call:
```
var columns_object = $('#columns').columns('getQuery');
```

To call internally from a plugin use `this.query`.

***

**getRange**

This method returns the table's current page range. Range is returned as an object.

External call:
```
var columns_object = $('#columns').columns('getRange');
```

To call internally from a plugin use `this.range`.

***

**getRows**

This method returns the table's current page rows. Rows are returned as an array.

External call:
```
var columns_object = $('#columns').columns('getRows');
```
To call internally from a plugin use `this.rows`.

***

**getTemplate**

This method returns the Column's Mustache template.

External call:
```
var columns_object = $('#columns').columns('getTemplate');
```

To call internally from a plugin use `this.template`.

***

**getThead**

This method returns the table's thead. Thead is returned as an array.

External call:
```
var columns_object = $('#columns').columns('getThead');
```

To call internally from a plugin use `this.thead`.

***

**getTotal**
This method returns an interger of the table's current total. Note: This is total after filters and conditions have been applied.

External call:
```
var columns_object = $('#columns').columns('getTotal');
```

To call internally from a plugin use `this.total`.

***

**getView**

This method returns the view object that was used to render the Mustache template.

External call:
```
var columns_object = $('#columns').columns('getView');
```
To call internally from a plugin use `this.view`.

***

**gotoPage(int)**

This method takes an intiger and if the page exists, changes the table's current page. Note: false is returned if page doesn't exist.

External call:
```
var columns_object = $('#columns').columns('gotoPage', 3);
```
To call internally from a plugin use `this.gotoPage(3)`.

***

**pageExists(int)**

This method takes an intiger and checks if the page exists in the current table. Returns boolean. Note: Pages start with 1.

External call:
```
var columns_object = $('#columns').columns('pageExists', 3);
```
To call internally from a plugin use `this.pageExists(3)`.

***

**resetData**

This method resets data to it original state and returns the result.

External call:
```
var columns_object = $('#columns').columns('resetData');
```
To call internally from a plugin use `this.resetDate()`.

***

<br>

### Creating plugins
Columns is extensible through the use of plugins and Columns API.

The basic plugin structure should look like this. All plugins must include a init method
```
if (typeof ColumnsPlugins === 'undefined') var ColumnsPlugins = {};
  ColumnsPlugins.your_plugin = {
      init: function() {
 
      }
  }
```

Plugins can be added to Columns by using the plugins option

```
var json = [{"col1":"row1", "col2":"row1", "col3":"row1"}, {"col1":"row2", "col2":"row2", "col3":"row2"}];
$('#columns').columns({ 
  data: json,
  plugins: ['gotopage']
});
```

