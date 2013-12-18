
//Root URL for the service
function getUrl(sUrl) {
	if (sUrl == "") return sUrl;
	if (window.location.hostname == "localhost")	
	 { return "proxy" + sUrl; }
	else
	  { return sUrl; }
	}

var serviceUrl = getUrl("/sap/opu/odata/sap/ZSRVGEOLOC/");
