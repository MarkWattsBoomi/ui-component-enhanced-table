
declare var manywho: any;

import * as React from 'react';
import './EnhancedTable.css';

class EnhancedTable extends React.Component<any, any> 
{   
    componentId: string = "";
    flowKey: string ="";    
    attributes : any = {};
    selectedItem: any = null;
    sortItem : any = null;
    sortDirection : any = null;

    text : string = "";

    constructor(props : any)
	{
        super(props);
        
        this.componentId = props.id;
        this.flowKey = props.flowKey;

        //push attributes into keyed map 
		var flowModel = manywho.model.getComponent(this.props.id,   this.props.flowKey);
		if(flowModel.attributes)
		{
			for(var key in flowModel.attributes)
			{
				this.attributes[key] = flowModel.attributes[key];
			}
        }
    }

    
    componentDidMount() 
    {
        this.forceUpdate();
    }

    componentDidUpdate()
    {

    }

	getAttribute(attributeName : string)
	{
		if(this.attributes[attributeName])
		{
			return this.attributes[attributeName];
		}
		else
		{
			return null;
		}
	}

       
    render()
    {
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        const flowState = manywho.state.getComponent(this.componentId,   this.flowKey);
       
        //get all outcomes - there's 2 types - per row and bulk, bulk go as buttons on top
        var outcomes = manywho.model.getOutcomes(this.componentId,  this.flowKey);
        var topbuttons = [];
        var rowButtons = [];

        var dblClick : any;
        
        //loop over outcomes
        for(var oPos = 0 ; oPos < outcomes.length ; oPos++)
        {
            var outcome = outcomes[oPos];
            if(outcome.isBulkAction)
            {
                //top button
                var icon = outcome.attributes["icon"] || "wrench";
                var className = "glyphicon glyphicon-" + icon + " et-button-bar-button";
                topbuttons.push(<span className={className} onClick={this.triggerOutcome.bind(this)} title={outcome.label}></span>)
            }
            else
            {
                //must be a row button, it's action attribute will tell if it should be the DOUBLE-CLICK event
                switch(outcome.attributes["action"])
                {
                    case "DOUBLE-CLICK":
                        dblClick = outcome.id;

                        break;

                    default:
                        var icon = outcome.attributes["icon"] || "wrench";
                        var className = "glyphicon glyphicon-" + icon + " et-button-bar-button";
                        var button = <span className={className} onClick={this.triggerOutcome.bind(this, outcome.id)} title={outcome.label}></span>
                        rowButtons.push(button);

                        break;
                }
            }

        }

        var label : any;
        var lbl : any = null;
        
        //if the component has a label then put it in the title bar
        if(flowModel.label && flowModel.label.length>0)
        {
            lbl = <span>{flowModel.label}</span>;
        }

        //create the title bar object
        label = <div className="et-caption-div">
                    <div className="et-caption">
                        {lbl}
                    </div>
                    <div className="et-button-bar">
                        {topbuttons}
                    </div>
                    
                </div>
        


        var headers = [];
        var rows = [];
        var cols : any = [];
        var colDef : any;
        var pos = 0;
        var row : any;
        var rowId : any;
        var vals = [];

        //header row
        // add button spacer if there are any row buttons
        //if there are buttons then add blank header
        if(rowButtons && rowButtons.length > 0)
        {
            headers.push(<td className="et-table-header"></td>);
        }

        //add each column
        for (pos = 0; pos < flowModel.columns.length ; pos++)
        {

            
            var colName = flowModel.columns[pos].developerName;
            var sortIcon : any;

            //is this the sorted column - if so then we need to show the sort direction icon
            if(this.sortItem && this.sortItem==colName)
            {
                if(this.sortDirection == "DESC")
                {
                    sortIcon = <span className="glyphicon glyphicon-arrow-down"></span>
                }
                else
                {
                    sortIcon = <span className="glyphicon glyphicon-arrow-up"></span>
                }
            }
            else
            {
                sortIcon = null;
            }
            cols[flowModel.columns[pos].developerName] = flowModel.columns[pos];

            //each header has a caption and a sort direction indicator
            var header = <th className="et-table-header" data-column-name={colName} onClick={this.sort.bind(this)}>
                            <div>
                                <div style={{'float': 'left'}}>
                                    <span>{flowModel.columns[pos].label}</span>
                                </div>
                                <div style={{'float': 'right'}}>
                                    {sortIcon}
                                </div>

                            </div>
                        </th>;

            
            headers.push(header);
        }

        //body
        for (pos = 0; pos < flowModel.objectData.length ; pos++)
        {
            row=flowModel.objectData[pos];

            rowId = manywho.utils.getObjectDataProperty(row.properties, this.getAttribute("Row Key")).contentValue;
            vals = [];
            vals.push(<td className="et-table-cell">{rowButtons}</td>);
            
            for(var iPos = 0 ; iPos < row.properties.length ; iPos++)
            {
                colDef = cols[row.properties[iPos].developerName];
                if( colDef && colDef.isDisplayValue)
                {
                    vals.push(<td className="et-table-cell">{row.properties[iPos].contentValue}</td>);
                }
            }

            var className = "et-table-row";
            if(this.selectedItem && this.selectedItem==rowId)
            {
                className += " et-table-row-selected";
            }

            //create row object, note we are binding select to its click and the dblclick value (an outcome id) to double click.  It may be null but thats fine
            var r = <tr className={className} data-rowId={rowId} data-objectData={row} 
                        onClick={this.selectRow.bind(this)} onDoubleClick={this.triggerOutcome.bind(this,dblClick)}>{vals}</tr>;

            rows.push(r);
        }


        //construct the table
        var table : any =   <div className="et-table-div">
                                <table className="et-table">
                                    <thead className="et-table-head">
                                        <tr className="et-table-header-row">{headers}</tr>
                                    </thead>
                                    <tbody className="et-table-body">
                                        {rows}
                                    </tbody>
                                </table>
                            </div>


        return <div className="et">
                    {label}
                    {table}
               </div>
    }

    //a row was selected, store it's id at component level and redraw
    selectRow(event : any)
    {
        this.selectedItem=event.currentTarget.getAttribute('data-rowId');
        this.forceUpdate();
    }

    //generic handler to trigger an outcome
    triggerOutcome(outcomeId : any, event : any)
    {
        var rowId=event.currentTarget.getAttribute('data-rowId') || event.currentTarget.parentElement.parentElement.getAttribute('data-rowId');
        const flowModel = manywho.model.getComponent(this.componentId,   this.flowKey);
        var rowKeyField = this.getAttribute("Row Key");

        var objectData=this.getObjectDataByKey(flowModel.objectData, rowKeyField, rowId);

        //clone data
		objectData = JSON.parse(JSON.stringify(objectData));
		objectData.isSelected = true;
		var newState = {
			objectData: [objectData]
		};
		
		manywho.state.setComponent(this.componentId, newState, this.flowKey, true);

        if(objectData)
        {
            if(outcomeId)
            {
                var outcome = manywho.model.getOutcome(outcomeId, this.flowKey);

                if(outcome)
                {
                    manywho.component.onOutcome(outcome, null , this.flowKey);
                }
            }
        }
        this.forceUpdate();
    }

    sort(event : any)
    {
        this.sortItem = event.currentTarget.getAttribute('data-column-name');
        if(this.sortDirection && this.sortDirection == "ASC")
        {
            this.sortDirection="DESC";
        }
        else
        {
            this.sortDirection="ASC";
        }
        this.forceUpdate();
    }

    //helper to get a specific object data item given a field=value criteria 
    getObjectDataByKey(objectData : any, fieldName : string, value : string)
    {
        var od : any;
        var val : any;
        //loop over data items
        for(var pos = 0 ; pos < objectData.length; pos++)
        {
            od = objectData[pos];
            val = manywho.utils.getObjectDataProperty(od.properties, fieldName).contentValue;
            if(val==value)
            {
                return od;
            }
        }
        return null;
    }
    
}

manywho.component.register('EnhancedTable', EnhancedTable);

export default EnhancedTable;