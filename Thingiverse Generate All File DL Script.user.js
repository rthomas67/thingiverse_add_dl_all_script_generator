// ==UserScript==
// @name         Thingiverse Generate All File DL Script
// @namespace    http://fixthingiverse.com/
// @version      0.1
// @description  Add a popup with a generated shell script to download all files for a thing, because Makerbot decided to disable/remove the zip downloads.
// @author       Annoyed Thingiverse User
// @require      http://cdn.thingiverse.com/site/js/jquery-3.2.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://code.jquery.com/ui/1.13.0/jquery-ui.js
// @resource     jqueryUiCss https://code.jquery.com/ui/1.13.0/themes/base/jquery-ui.css
// @match        https://www.thingiverse.com/thing:*/files
// @icon         https://www.google.com/s2/favicons?domain=thingiverse.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

GM_addStyle(GM_getResourceText ("jqueryUiCss"));

var generateAlreadyCalled = false;
const dialogStyle = "{ autoOpen: false, show: { effect: \"blind\", duration: 500 }, hide: { effect: \"explode\", duration: 500 } }";



(function() {
    'use strict';
    waitForKeyElements ("a[class^='ThingFile__download']", generateDownloadScript);
    console.log("Thingiverse Download Script Generator Complete.");
})();

function generateDownloadScript() {
    'use strict';
    if (generateAlreadyCalled) {
        return;
    } else {
        generateAlreadyCalled = true;
    }
    var scriptText = "#!/bin/sh\n";
    var filenameHeader = document.querySelector("div[class^='ThingFilesListHeader__fileName']");
    var subdirectoryName = filenameHeader.innerHTML.replace(' ', '_').toLowerCase();
    scriptText += ("mkdir " + subdirectoryName + "\n");
    // Get all the download links
    var downloadLinks = document.querySelectorAll("a[class^='ThingFile__download']");
    var linkCount = 0;
    downloadLinks.forEach(function (downloadLink) {
        scriptText += ("curl -Lv '" + downloadLink.getAttribute("href") + "' --output '" + subdirectoryName + "/" + downloadLink.getAttribute("download") + "'\n");
        linkCount++;
    });
    var ogUrlTag = document.querySelector("meta[property='og:url']");
    var ogUrl = ogUrlTag.getAttribute("content");
    var thingiverseItemId = ogUrl.substring(ogUrl.lastIndexOf(":")+1);
    console.log("ITEMID: " + thingiverseItemId);
    // add script command to create readme file with link back to the Thingiverse item page.
    scriptText += ("echo -e '# About\\nDownloaded from: " + ogUrl + "\\n' > " + subdirectoryName + "/download_readme.md\n");
    scriptText += ("zip -rm thingiverse_" + thingiverseItemId + "_" + subdirectoryName + ".zip " + subdirectoryName);

    // console.log("LINK COUNT: " + linkCount);

    addDownloadButtonToHeaderDivTag(scriptText);
}

function addDownloadButtonToHeaderDivTag(scriptText) {
    var headerElement = document.querySelectorAll('div[class^="ThingFilesListHeader__header"]')[0];
    var scriptPopupLinkDiv = document.createElement("div");
    var scriptPopupButton = document.createElement("button");
    scriptPopupButton.setAttribute("id", "scriptPopupButton");
    scriptPopupButton.innerHTML = "D/L-All Script";
    scriptPopupLinkDiv.appendChild(scriptPopupButton);
    var scriptPopupDialog = document.createElement('div');
    scriptPopupDialog.setAttribute("id", "scriptpopup");
    scriptPopupDialog.innerHTML = "<form style='width: 100%; height: 95%;'>" +
        "<button id='copyDLScriptToClipboard' style='float: right;'>Copy " +
        "To Clipboard</button>" +
        "<br><br><textarea id='scriptTextArea' style='width: 100%; height: 95%; font-size: 10px;'>" + scriptText + "</textarea></form>"
    headerElement.appendChild(scriptPopupLinkDiv);
    scriptPopupLinkDiv.appendChild(scriptPopupDialog);
    $( "#scriptpopup" ).dialog({
        title: "D/L All Script",
        autoOpen: false,
        width: 700,
        height: 600,
        modal: true,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
    });

    $( "#scriptPopupButton" ).on( "click", function() {
      $( "#scriptpopup" ).dialog( "open" );
    });

    $( "#copyDLScriptToClipboard" ).on( "click", function() {
        var scriptTextArea = document.getElementById("scriptTextArea");
        scriptTextArea.select();
        scriptTextArea.setSelectionRange(0,99999);
        navigator.clipboard.writeText(scriptTextArea.value)
            .then(res => {
                console.log("Script text copied to clipboard.");
//                alert("Script text copied to clipboard.");
//                return false;
            })
        return false;
    });
}


