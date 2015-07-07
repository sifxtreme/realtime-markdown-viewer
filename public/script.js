/* public/script.js */

var SEED_TEXT = '# Realtime Markdown Editor \n' +
'\n' +
'### What is this?\n' +
'\n' +
'Type your markdown into the box on the left and immediately see if on the box on the right. If you send a friend a' + 'link to a pad URL (other than the home page) you both can edit the document at the same time!\n' +
'\n' +
'### How to use this?\n' +
'\n' +
'Type anything after the slash in "https://realtimemarkdown.herokuapp.com/" and just start creating markdown.\n' +
'\n' +
'### How was this built?\n' +
'\n' +
'This website uses the following to work:\n' +
'\n' +
' - [Markdown](https://github.com/showdownjs/showdown) - Converts markdown text to beautiful HTML\n' +
' - [ShareJS](http://sharejs.org/) - allows for realtime editing of this textbox\n' +
' - [Node.js](https://nodejs.org/) - backend framework\n' +
' - [Redis](http://redis.io/) - where we store our markdown documents\n' +
' - [Twitter Bootstrap](http://getbootstrap.com/) - makes everything a little prettier\n' +
'\n' +
'\n';

window.onload = function() {
    var converter = new showdown.Converter();
    var pad = document.getElementById('pad');
    var markdownArea = document.getElementById('markdown');

    // make the tab act like a tab
    pad.addEventListener('keydown',function(e) {
        if(e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = e.target;
            var value = target.value;

            // set textarea value to: text before caret + tab + text after caret
            target.value = value.substring(0, start)
                            + "\t"
                            + value.substring(end);

            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            e.preventDefault();
        }
    });

    var previousMarkdownValue;

    // convert text area to markdown html
    var convertTextAreaToMarkdown = function(){
        var markdownText = pad.value;
        previousMarkdownValue = markdownText;
        html = converter.makeHtml(markdownText);
        markdownArea.innerHTML = html;
    };

    var loadPage = function(pageName){
      // implement share js
      sharejs.open(pageName, 'text', function(error, doc) {
          if (doc.getText().length === 0 ) {
            doc.insert(0, SEED_TEXT);
          }
          doc.attach_textarea(pad);
          convertTextAreaToMarkdown();
      });
    }

    var didChangeOccur = function(){
        if(previousMarkdownValue != pad.value){
            return true;
        }
        return false;
    };

    // check every second if the text area has changed
    setInterval(function(){
        if(didChangeOccur()){
            convertTextAreaToMarkdown();
        }
    }, 100);

    // convert textarea on input change
    pad.addEventListener('input', convertTextAreaToMarkdown);

    // ignore if on home page
    if(document.location.pathname.length > 1){
        var documentName = document.location.pathname.substring(1);
        loadPage(documentName);
    } else {
      loadPage('home');
    }

    convertTextAreaToMarkdown();
};
