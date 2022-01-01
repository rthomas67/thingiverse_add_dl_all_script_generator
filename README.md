# Summary
Yet another feature of Thingiverse seems to be broken.  The **"Download All Files"** button 
used to link to a zip file bundle of the entire "thing" but at the moment it just autoscrolls/autonavigates
to the list of individual files that must be downloaded one at a time.  That SUCKS!!!

# Userscripts
One of the options for "fixing" stuff on broken web sites is to use a browser plugin
like Greasemonkey or Tampermonkey to enable "user scripts."  That's what I did to make
the broken "Download All Files" feature on Thingiverse a little less painful.

* My favorite browser plugin for userscripts is Tampermonkey: https://www.tampermonkey.net
  * Note: Tampermonkey might support older browser versions than some other plugins.

# Approach
The quickest way I could think of to streamline the process of downloading all the files
of a "thing" and ending up with a zip archive of all of it, was to generate a shell
script that will run in most any Unix/Linux type shell/terminal.  So, that's what this is.

* Grab the user script file (save it somewhere)
* Look it over to be sure you understand what it does.
* Install TamperMonkey or GreaseMonkey in your browser if you need to.
* Install the user script
* Navigate to the "/files" page on a Thingiverse "thing" 
  * One way, at least right now, is to click the "Download All Files" button.
* Click the **"D/L-All Script"** button that the Userscript adds to the page, just above the list of individual files.
* Click the **"Copy to Clipboard"** button in the dialog that pops up.
* Paste the script text into an editor and save as a .sh file
* Set the file to executable (chmod +x)
* Run the script

# The Generated Script Does the Following
* creates a subdirectory named after the "thing" being downloaded
* runs curl commands to retrieve all of the files related to the "thing" into that subdirectory
* creates a readme file with a link back to the page on the thingiverse site
* moves the downloaded files into a .zip archive (just like you used to be able to do directly from the thingiverse site).

# Future
This still isn't ideal.  I had hoped to be able to figure out how to create the zip file "on the fly" right in
the browser, but gave up on that for now.  It still might be possible, so I'll keep tinkering with it
and would welcome any ideas about how to get that working.  For now, this at least takes a little of
the hassle out of downloading things that have a bunch of individual files.

# Known Issues
* Thingiverse page needs to be reloaded, after switching to the /files view, to make the button show up.
* The relative reference to jquery-ui icons gets messed up by the userscript context, so the "X" in the dialog close button is missing.
