sap.ui.controller("geolocalization.resources.home", {


	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers, and to do other one-time initializations.
	 */
	onInit: function() {
		
		jQuery.sap.require("geolocalization.resources.utils.connectivity");
		
		var oModel = new sap.ui.model.odata.ODataModel(serviceUrl,true,"BELLET","1sjus7m3");
		sap.ui.getCore().setModel(oModel);
		
//		oModel.attachRequestCompleted(function(oEvent){
			
//		});
		
		oModel.attachRequestFailed(function(oEvent){
			displayError({
				message: oEvent.getParameter("message"),
				responseText:oEvent.getParameter("responseText"), 
				statusCode:oEvent.getParameter("statusCode"), 
				statusText:oEvent.getParameter("statusText")
			});
		});


		oModel.attachParseError(function(oEvent){
			displayError({
				message: oEvent.getParameter("message"),
				responseText:oEvent.getParameter("responseText"), 
				statusCode:oEvent.getParameter("statusCode"), 
				statusText:oEvent.getParameter("statusText")
			});
		});

//		oModel.attachRequestSent(function(){

//		});	
				
		this.displayGeolocalization(oModel);
	
	},	
	
	getMyPlace: function(AltBar) {
		
		  if(navigator.geolocation) {
			  
		    navigator.geolocation.getCurrentPosition(
		    		
		      function(position) 		    		
		        { var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
		          var opt = { zoom: 18, center: pos, mapTypeId: google.maps.MapTypeId.ROADMAP };
				  var ButtAdd = new sap.ui.commons.Button("ID_BUT_CREATE",{text: "Add Place", style: sap.ui.commons.ButtonStyle.Accept, 
					            press: function() { 
					            	var placename  = sap.ui.getCore().getElementById('ID_TXT_PLC').getValue(); 
					            	var altitude = sap.ui.getCore().getElementById('ID_TXT_ALT').getValue();
					            	var oEntry = {PlaceName:placename,Latitude:pos.lat().toString(),Longitude:pos.lng().toString(),Altitude:altitude};					            
					            	var oModel = sap.ui.getCore().getModel();
					            	oModel.refreshSecurityToken(null, null, false);
					            	oModel.read("/GeoLocalizationCollection", null, null, true, function(oData, oResponse){ oModel.oHeaders["x-csrf-token"] = oResponse.headers['x-csrf-token']; },function(){alert("xcsrf Read failed");});		    
					            	oModel.create("/GeoLocalizationCollection", oEntry, null, function(){alert("Place Added");},function(){alert("Create failed");});
					            	sap.ui.getCore().getElementById('ID_MYPLACE').destroy(); }});				            						 
				  AltBar.addItem(ButtAdd); 			          
		          var map = new google.maps.Map(document.getElementById('my_place'), opt);	
				  var mar = new google.maps.Marker({ position: pos, map: map, title: "Estimated Place" }); }, 	        	      
			  function() 
		        { alert("Error: The Geolocation service failed."); });
		    
		  } else { alert("Error: Your browser doesn\'t support geolocation."); }		
	  
	},    
    
	onMyPlace: function() {		
				  		  		  		  
		  var AltBar = new sap.ui.commons.Toolbar("ID_TOOLBAR"); 
	      var MyPanel = new sap.ui.commons.Panel("MyPlace",{width:"100%"});		
	      MyPanel.addContent(new sap.ui.core.HTML( { content : "<div id='my_place' style='width: 100%; height: 300px;'></div>" }));
		  var oTF = new sap.ui.commons.TextField("ID_TXT_PLC", {tooltip: 'Place Name', editable: true, width: '200px'});	 
		  var oLabel = new sap.ui.commons.Label("ID_LBL_PLC", {text: 'Place Name',labelFor: oTF});	 
		  AltBar.addItem(oLabel);	
		  AltBar.addItem(oTF);
		  var oTF = new sap.ui.commons.TextField("ID_TXT_ALT", {tooltip: 'Altitude', editable: true, width: '200px'});	 
		  var oLabel = new sap.ui.commons.Label("ID_LBL_ALT", {text: 'Altitude',labelFor: oTF});	 
		  AltBar.addItem(oLabel);	
		  AltBar.addItem(oTF);  
		  var oDialog = new sap.ui.commons.Dialog("ID_MYPLACE", {modal: true, width: "70%", closed: function(oControlEvent){sap.ui.getCore().getElementById("ID_MYPLACE").destroy();}});	  
		  oDialog.addContent(AltBar);
		  oDialog.addContent(MyPanel);
		  oDialog.setTitle("New Place");	
		  oDialog.open();
		  this.getMyPlace(AltBar);
	},
	
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 */
//	onBeforeRendering: function() {

//	},


	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 */
//	onAfterRendering: function() {

//	},


	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 */
//	onExit: function() {

//	}	
	

	displayGeolocalization:function(oModel){
		
		var oTable = sap.ui.getCore().byId("ID_GeoLocalizationTable");
		oTable.setModel(oModel);
		oTable.bindRows("/GeoLocalizationCollection");
	},



});
