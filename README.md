## Columns
#### by Michael Eisenbraun

Columns is an easy way of creating JSON data into HTML tables that are sortable, searchable, and paginating. All you need is to provide the data, and Columns will do the rest.

### Installation

Include the jQuery Library 1.7 or later and Columns Plugin File: 

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="js/jquery.columns.min.js"></script>
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

For more information, see the full [documentation](http://eisenbraun.github.io/columns)
