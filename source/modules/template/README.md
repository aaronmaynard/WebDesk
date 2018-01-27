# Create your own application

### :tired_face: What is all of this stuff, and what do I do with it? 

WebDesk is designed to be modular, allowing you to create your own application such as a calculator or browser.  Lets go over a brief explanation of what these files are for.

#### :pencil: template.js
This javascript file will contain all of the javascript you need to run your custom application, if you need any at all.  At the bottom of the document is a bit of code that we have inserted for you.  This code allows you the application frame to have a <i>drag-and-drop</i> functionality.  You will need to replace the word `application` in the document:
```
//Make the DIV element draggagle:
dragElement(document.getElementById(("application")));
```
with the name of your application; such as `calculator`.

#### :pencil: template.html
This document is the wrapper for your application.  You will direct the wrapper to your application from:
```
<div class="applicationcontent">
	<iframe height="100%" width="100%" src="modules/template/core.html"></iframe>
</div>
```
Make sure you replace all instances of application with the name of your application.  
`<div class="applicationcontainer" id="application">` will become `<div class="calculatorcontainer" id="calculator">` for example.  There is not much else that needs to be changed within this document.  Don't forget to set the default height and width of your application if it is not design to be scalable!


#### :pencil: core.html
Ahh, yes. The moment you have been waiting for!  The `core.html` document is the home of your application.  This is where everything that you want to show and do will reside.  Your application will be designed to take the entirety of the wrapper.  If you have a fixed design like the calculator, make sure to set the dimensions in `template.html`, if it's designed to be scaled... good on ya!  Take a look at the browser and calculator apps for examples on both.

### :astonished: How is my application added to the site? 
In the source `index.html` we will be using W3's include capabilities.  
`<div w3-include-html="modules/browser/browser.html"></div> <!-- WEB BROWSER -->`  
Remember to change the files and directories accordingly.  Good luck and have fun building applications!

Here's a picture of what it might look like:
![WebDesk](https://i.imgur.com/qc1aT77.jpg)
