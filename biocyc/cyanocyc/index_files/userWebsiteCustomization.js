YAHOO.namespace ("ptools");

YAHOO.ptools.popularDatabases = ["ECOLI", "META", "HUMAN", "MTBH37RV", "BSUB", "YEAST"];

function addSiteSpecificMenuItems () {
  adjustTextpressoMenuItem(orgID()); 
}

function userAdjustMenuItemsOrgID(orgid){
  adjustTextpressoMenuItem(orgid);
  adjustBioCycGuideMenuItem();
  adjustFunGCMenuItem(orgid);
  /* adjustBlastMenuItem(orgid); */
}

/* billington:Apr-27-2021
   no longer using YUI menus, so this finds the "Search" subset of the mega menu,
   and, if the orgid is ECOLI, it adds the textpresso functionality, and if not it either
   does nothing, or remove the textpresso functionality if its there.
*/
function adjustTextpressoMenuItem(orgid) {
    var menuItem = document.getElementById("textpressoMenuItem");
    if (orgid == 'ECOLI') {
	if (menuItem == null) {
	    var searchMenu = document.getElementById("MegaSearchList");
	    if (searchMenu!= null) {
		var text = document.createTextNode("Search Full-text Articles");
		var searchFullTextItem = document.createElement("a");
		searchFullTextItem.setAttribute("id", "textpressoMenuItem");
		searchFullTextItem.setAttribute("role", "menuitem");
		searchFullTextItem.setAttribute("href", "/ecocyc/textpresso.shtml");
		searchFullTextItem.appendChild(text);
		searchMenu.insertBefore(searchFullTextItem, searchMenu.childElements()[7]);
	    }
	} else {
	menuItem.setAttribute("disabled",false);
	}
    } else {
	// Deactivate the menu item since it is not E. coli
	if (menuItem != null) menuItem.setAttribute("disabled",true);
    }}

function adjustBioCycGuideMenuItem() {
    var menuItem = document.getElementById("UserGuide")
    if (menuItem) {
	var orgid = orgIDFromHostname();
	if (orgid == 'ECOLI') {
	    menuItem.innerHTML = "Guide&nbsp;to&nbsp;EcoCyc";
	    menuItem.href = "http://asmscience.org/content/journal/ecosalplus/10.1128/ecosalplus.ESP-0009-2013";
	}
	else if (orgid == 'META') {
	    menuItem.innerHTML = "Guide&nbsp;to&nbsp;MetaCyc";
	    menuItem.href = "/MetaCycUserGuide.shtml";
	}}
}

function adjustFunGCMenuItem(orgid) {
    var menuItem = document.getElementById("FuncGeneClusters");
    if (menuItem) {
	var fungcOrgs = ['BSUB', 'CGLU196627', 'ECOLI', 'LLAC272623', 'PAER208964', 'SENT99287', 'SYNEL', 'VCHO'];
	var disabled = true;
	for (var i=0; i<fungcOrgs.length;i++) {
	    if (orgid == fungcOrgs[i]) disabled = false;
	}
      if (menuItem) {
	if (disabled) menuItem.classList.add("removedLink");
	else menuItem.classList.remove("removedLink");
      }}}

/* Done in biocyc.org-htdocs/template-top-menu-bar with <!-- #if expr="(show-blast-search-menu-item-p)" --> 
function adjustBlastMenuItem(orgid) {
  var blast    = 
function adjustBlastMenuItem(orgid) {
  var blast    = YAHOO.widget.MenuManager.getMenuItem("blastMenuItem");                                                                                                                                                                               
  if ( orgid == 'META' ) {
    if (blast) blast.cfg.setProperty("disabled", false);
  }
  if ( orgid == 'HUMAN' ) {
    if (blast) blast.cfg.setProperty("disabled", true);
  }
}
*/

/*  
    Potentially make visible one of the TmpMsg div in the page which
    is typically in the banner. We do not show the message if it
    contains only spaces, newlines, and tabs. Note: the space for the
    message is small. See parameter width below.
    
    The page might contain one or several of the div IDs listed below:
    biocycTmpMessages, ecocycTmpMessages, metacycTmpMessages,
    humancycTmpMessages, or bsubcycTmpMessages.  

    Each division contains one or several DIVs
    that might contain a message.  One of these messages is randomly
    selected to be displayed as temporary message in the banner.

    This function does not assume that all or any of these
    temporary message DIVs exist.

    See also file temporary-message.shtml.

    Returns: nothing.
*/
function insertTemporaryMessage(){
    var orgID    = window.orgID(); // Not sure why this has to be fully qualified
                                   // But doesn't work if it's not.
    var bioTmp   = document.getElementById('biocycTmpMessages');
    var ecoTmp   = document.getElementById('ecocycTmpMessages');
    var metaTmp  = document.getElementById('metacycTmpMessages');
    var humanTmp = document.getElementById('humancycTmpMessages');
    var bsubTmp  = document.getElementById('bsubcycTmpMessages');
    var cyanoTmp = document.getElementById('cyanocycTmpMessages');
    var tmpDivs  = [{orgID: 'ECOLI', div: ecoTmp}, 
	{orgID: 'META',  div: metaTmp}, 
	{orgID: 'HUMAN', div: humanTmp},
		    {orgID: 'BSUB',  div: bsubTmp},
		    {orgID: 'SYNEL', div: cyanoTmp},
	{orgID: false,   div: bioTmp} // must be the last one and is the default.
    ];
    // In the following do not assume that any of the elements
    // above exist.

    // Make all of the temporary messages invisible.
    for (var j=0; j < tmpDivs.length; j++){
	if (tmpDivs[j].div  != null) {
	    var childs = tmpDivs[j].div.childNodes;
	    var n      = (childs == null) ? 0 : childs.length;
	    // Turn off the display of all the childs.
	    for (var i=0; i < n; i++) {
		var oneTmp = childs[i];
		if (oneTmp && oneTmp.style) {
		    oneTmp.style.width   = '0';
		    oneTmp.style.display = 'none';
		}}}}

    // Make one of the temporary message visible if such a message is not empty.
    for (var j=0; j < tmpDivs.length; j++) {
	var oneEntry = tmpDivs[j];
	var oneDiv   = oneEntry.div;
	if (oneDiv && (orgID == oneEntry.orgID || !oneEntry.orgID)) {
	    // The orgID says to use this oneDiv.
	    var childs = oneDiv.childNodes;
	    var n      = (childs == null) ? 0 : childs.length;
	    // Gather the childs that have indeed a message in it.
	    var nonEmptyChilds = new Array();
	    for (var i=0; i < n; i++) {
		var oneDivChild = childs[i]; 
		if (oneDivChild.innerHTML && oneDivChild.innerHTML.search('[^ \n\t]') >= 0) {
		    nonEmptyChilds.push(oneDivChild);
		}
	    }

	    var nb   = nonEmptyChilds.length;
	    // Select randomly one of the non-empty div child
	    if (nb > 0) {
		var seed = (new Date()).getSeconds();
		var r    = Math.floor(Math.random(seed)*nb);
		if (nonEmptyChilds[r].style) {
		    nonEmptyChilds[r].style.width   = '150px';
		    nonEmptyChilds[r].style.display = 'block'; 
		}
	    }
	    return;
	}
    }
}


// paley:Jul-24-2013 The behavior below has been eliminated now that the
// selected organism should always match the page content.  However, if the
// selected organism does not match the virtual host, redirect to biocyc.org.
// Old behavior:
// If we've been redirected to a biocyc.org url from a metacyc, ecocyc or 
// humancyc url, then set the current organism to the organism in the referer
// URL. 
// latendre:Nov-19-2009: but even if we are coming from metacyc, it does not
// mean that the selected organism was meta, it can be any organism.
// paley:Feb-16-2010 To solve the issue Mario mentions (the user deliberately
//  selects a different organism from, say, the metacyc home page, check for an
//  orgid in the URL first.
// paley:Sep-15-2010 If the referrer is a non-biocyc site, change the selected
//  organism to the one in the url, if any.
function userDefinedBeforePathwayToolsInit() {
  if (forceOrgID && forceOrgID != "DEFAULT")
    document.body.classList.add(forceOrgID);
  checkOrgVHostConsistency(orgIDFromURL());
  setLogoLink();
}

function orgIDFromHostname () {
  var elts = location.hostname.split(".");
  if (elts.length >= 2) {
    var virtualHost = elts[elts.length - 2].toUpperCase();
    if (virtualHost == "SRI") 
      virtualHost = elts[Math.max(elts.length - 4, 0)].toUpperCase();
    switch (virtualHost) {
    case "METACYC": return "META";
    case "ECOCYC": return "ECOLI";
    case "ALGAE": return "CHLAMY";
    case "BSUBCYC": return "BSUB";
    case "CDIFFICILE": return "PDIF272563";
    case "CLOSTRIDIUM": return "PDIF272563";
    case "CYANOCYC": return "SYNEL";
    case "HELICOBACTER": return "GCF_000008525";
    case "HUMANCYC": return "HUMAN";
    case "LISTERIA": return "10403S_RAST";
    case "MYCOBACTERIUM": return "MTBH37RV";
    case "PSEUDOMONAS": return "PAER208964";
    case "SALMONELLA": return "SENT99287";
    case "SHIGELLA": return "SHIGELLA";
    case "VIBRIO": return "GCF_900205735";
    case "YEAST": return "YEAST";
    }
  }
  return false;
}

function checkOrgVHostConsistency (orgid) {
    var hostnameOrg = orgIDFromHostname();
    if (hostnameOrg && orgid && (orgid != hostnameOrg)) {
	// If the hostname doesn't match the url org, redirect to biocyc.org
      let url = new URL(location.href);
      let sessionId = getSessionId();
      if (sessionId) {
	url.search += (url.search) ? "&" : "?";
	url.search += "sid="+sessionId;
      }
      var hostElts = url.hostname.split(".");
      if (hostElts.length >=2 
	  && hostElts[hostElts.length - 2].toUpperCase() == "SRI")
	url.hostname = "brg-preview.ai.sri.com"; // preview server
      else url.hostname = "biocyc.org";
      location.href = url;
   }
}

function setOrgAndCheckConsistency (orgid) {
  setOrganism(orgid);
  var hostnameOrg = orgIDFromHostname();
  if (hostnameOrg && orgid && (orgid != hostnameOrg)) 
    document.location.href = "/organism-summary?object="  + orgid;
}

/* Use this function to override the default link that the banner logo
   links to. It's overridden by organism.
*/
function setLogoLink () {
}

function userDefinedAfterPathwayToolsInit(){
  setLogoLink();
  addSessionToLinks();
  initToolbarMenuKeyboardOps($j("[role='banner'] [role='menubar']"));
}

// billingt:Jun-20-2016 
/*
function UnhideLogin(){
  var currentURL = window.location.href;
  var i = currentURL.search("/set-preferences.html");
  var end; if (i>0) {end = i} else end = currentURL.length;
  var redirectString = "https://demoui.arabidopsis.org/#/contentaccess/login?partnerId=biocyc&redirect="+"https"+currentURL.substring(currentURL.search(":"),end);
  window.location.assign(redirectString);
}
*/



function getSessionId () {
  return get_cookie('PTools-session')?.match(/^[\w-]*/)[0];
}

// paley:Nov-8-2022
// Solve the cross-domain session cookie problem by adding session id to urls
// of links to pages for other hosts, and then checking that against the cached
// session id for the current ip.
function addSessionToLinks () {
  let sessionId = getSessionId();
  if (sessionId) {
    $j('a[href*="cyc"]').each(function () {
      let url = new URL(this.href);
      if (url.hostname != location.hostname && url.hostname.match(/^(([\w\.]+cyc(-staging)?)|brg-preview)\.(org|ai\.sri\.com)$/)) {
	url.search += (url.search) ? "&" : "?";
	url.search += "sid="+sessionId;
	this.href = url;
      }
    });
  }
}

