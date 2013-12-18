jQuery.sap.require("geolocalization.resources.utils.utility");

/**
 * First Application View - this is the application's starting point. It builds the application window.   
 */
sap.ui.jsview("geolocalization.resources.home", {

      getControllerName : function() {
         return "geolocalization.resources.home";
    	 
      },
      
      createContent : function(oController) {
		var oShell = this.createShell();
		var panelPlace = new sap.ui.commons.Panel('PanelPlace'); 
		var mapPlace = new sap.ui.commons.Panel('mapPlace');
		mapPlace.addContent(new sap.ui.core.HTML( { content : "<div id='map_canvas' style='width: 100%; height: 400px;'></div>" }));  		
		panelPlace.addContent(this.createGeolocalizationTable(oController));
       	oShell.addContent(panelPlace);	
       	oShell.addContent(mapPlace);
       	return oShell;
       	
      },

      createShell:function(oController){
      
    	  var oShell = sap.ui.ux3.Shell("ID_GeoLocalizationShell",{
    	      appIcon: "images/SAPLogo.gif",
    		  appTitle: oBundle.getText("APP_TITLE"),
    		  showLogoutButton:false,
    		  showSearchTool: false,
    		  showInspectorTool: false,
    		  showFeederTool: false,
    		  worksetItems: [new sap.ui.ux3.NavigationItem("navItemList",{key: "GeoLocalizationList",text:oBundle.getText("WORKSET_TITLE")})]
    	  });
    	  return oShell;
      },
      
      /**
	 * Returns a table with the required columns, each column is bound for a specific odata service property   
	 * @returns {sap.ui.table.Table}
	 */
      createGeolocalizationTable:function(oController){
      
    	var oTable = new sap.ui.table.Table("ID_GeoLocalizationTable", {
    		visibleRowCount  : 10,
  			selectionMode: sap.ui.table.SelectionMode.Single,
  			extension: [new sap.ui.commons.Button({text: "New Place", press: function() {oController.onMyPlace();}})]			
  		});
    	
 
     	 oTable.addColumn(new sap.ui.table.Column({
    	 	label: new sap.ui.commons.Label({text:oBundle.getText("GEOLOCALIZATION_PLACENAME")}),
 			template: new sap.ui.commons.TextView().bindProperty("text", "PlaceName"),
			sortProperty: "PlaceName",
			filterProperty: "PlaceName"
 		}));

     	 oTable.addColumn(new sap.ui.table.Column({
    	 	label: new sap.ui.commons.Label({text:oBundle.getText("GEOLOCALIZATION_LATITUDE")}),
 			template: new sap.ui.commons.TextView().bindProperty("text", "Latitude"),
			sortProperty: "Latitude",
			filterProperty: "Latitude"
 		}));

     	 oTable.addColumn(new sap.ui.table.Column({
    	 	label: new sap.ui.commons.Label({text:oBundle.getText("GEOLOCALIZATION_LONGITUDE")}),
 			template: new sap.ui.commons.TextView().bindProperty("text", "Longitude"),
			sortProperty: "Longitude",
			filterProperty: "Longitude"
 		}));

     	 oTable.addColumn(new sap.ui.table.Column({
    	 	label: new sap.ui.commons.Label({text:oBundle.getText("GEOLOCALIZATION_ALTITUDE")}),
 			template: new sap.ui.commons.TextView().bindProperty("text", "Altitude"),
			sortProperty: "Altitude",
			filterProperty: "Altitude"
 		}));   	      	 
     	
     	 oTable.attachRowSelectionChange(function(oEvent){
     		   
     		var oModel = sap.ui.getCore().getModel();
     		var rowContext = oEvent.getParameter("rowContext");
     		var place = oModel.getProperty("PlaceName", rowContext);
     		var latitude = oModel.getProperty("Latitude", rowContext);
     		var longitude = oModel.getProperty("Longitude", rowContext);
     		var altitude = oModel.getProperty("Altitude", rowContext);     		
     	    google.maps.event.addDomListener(window, 'load', init_maps(place, latitude, longitude));
     	       
     	 });
     	 
 		return oTable;   		
      }
      
});
