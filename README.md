# Enhanced Table

A replacement table component with facilies to handle row double click.


## Setup

- Grab the files from the /dist folder and import into your tenant.

- Add the files to your player code like this: -

        requires: ['core', 'bootstrap3'],
        customResources: [
                'https://s3.amazonaws.com/files-manywho-com/tenant-id/EnhancedTable.css',
                'https://s3.amazonaws.com/files-manywho-com/tenant-id/EnhancedTable.js'
                ],


- Add a table component to your page save it then change it's "componentType" to "EnhancedTable" in the metadata editor and save it.
e.g. 
            "componentType": "EnhancedTable",

- Set it up just like a normal table providing the data source and state etc.

- outcomes should be set to "Displayed With" the table.

- outcomes flagged as bulk actions ("This outcome should appear at the top of the component") will be placed in the top title bar, others will be put in the first column which is an array of icon buttons.

- one outcome from the row buttons can be flagged as being the click event, see attributes below.

- one outcome from the row buttons can be flagged as being the double click event, see attributes below.

If the component is set as multi-select then check boxes appear on each row, the double click event and all row buttons will move to top buttons


## Extra Configuration

You can add attributes to the component to control it's appearance: -

- "Row Key"     mandatory       Tells the table which column in the object data is the primary key for the row.  Use the column's DeveloperName


You can add attribites to the component's outcomes to change their function and appearance: -

- "icon"        optional        The name of a boostrap glyph icon to display for the button, just the name e.g. refresh, wrench etc.

- "action" = "CLICK"        optional        Flags the outcome to be attached to the tables row click event.

- "action" = "DOUBLE-CLICK"        optional        Flags the outcome to be attached to the tables row double click event.

You can add a componentType value to any column to make use of other react classes for that column like the ones defined in the ColumnControls library here: -
https://github.com/MarkWattsBoomi/ui-component-table-column-formatters
 
