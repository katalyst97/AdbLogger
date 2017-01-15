document.querySelector("#button1").addEventListener("click", openFileEntry);
document.getElementById("text1").addEventListener("scroll", onTextScroll);
document.getElementById("button2").addEventListener("click", regxSearch);
document.getElementById("regexinp").addEventListener("select", function(){
  document.getElementById("regexinp").value = "";
});

var filePath;
var fileSize, loadPercent = 1;
var textBuffer;
var fileReader =  new FileReader();

function onClick() {
  document.querySelector("#elem2").innerHTML = "karthik Hello";
}

function onTextScroll() {
  if (loadPercent === 100) {
    return;
  }
  loadPercent+=0.01;
  console.log(loadPercent%30);
  if (loadPercent%20 === 0) {
    return;
  }
  filePath.file(function(file) {
    file.oneloadend = function(e) {
      textBuffer.concat(e.target.result);
      document.querySelector("#text1").value = textBuffer;
    };
    var loadSize = fileSize*loadPercent/100;
    var blob = file.slice(0, loadSize);
    fileReader.readAsBinaryString(blob);
    document.querySelector("#elem2").innerHTML = "Loaded Buffer Size = " + loadSize;
  });
}

function openFileEntry() {
  var options = {
  };
  fileReader =  new FileReader();
  var text;
  chrome.fileSystem.chooseEntry(options, function(entry) {
    if(!entry) {
      console.log("No file selected !!");
      return;
    }
    console.log(entry);
    filePath = entry;
    entry.file(function(file) {
      fileSize = file.size;
      fileReader.onloadend = function(e) {
        textBuffer = e.target.result;
        document.querySelector("#text1").value = textBuffer;
        console.log("Done Reading");
        console.log(fileSize);
      };
      var loadSize = fileSize*loadPercent/100;
      document.querySelector("#elem2").innerHTML = "Loaded Buffer Size = "+loadSize;
      var blob = file.slice(0, loadSize);
      fileReader.readAsBinaryString(blob);
    });
  });
}

function regxSearch() {
  var regex = /(camera)/g;
  let m;
  var regex_text = "";
  var inps = regexInput();
  if(inps === "") {
    return;
  }
  for(var i = 0; i<inps.length; i++) {
    regex_text  = regex_text + "|" +inps[i];
  }
  regex_text = regex_text.slice(1, regex_text.length);

  console.log("Searching for " + regex_text);
  //regex = new RegExp(regex_text,"g");
  console.log(regex);
  while ((m = regex.exec(textBuffer)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    for (i=0; i<m.length; i++) {
      document.querySelector("#text2").value = m[i];
      console.log(i);
    }
  }
}

function regexInput() {
  var reinp = document.querySelector("#regexinp");
  var inps = reinp.value.split(",");
  console.log(inps);
  return inps;
}
