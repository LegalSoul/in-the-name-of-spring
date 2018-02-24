loadJsonFromFile(function(response){
	var questions = JSON.parse(response);
	console.log(questions);

	var bgm = new Audio('bgm.mp3');
	bgm.addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	bgm.play();



	// var stringified = JSON.stringify(questions);
	// localStorage.setItem('results', stringified);
	// var retrievedObject = localStorage.getItem('results');
	// console.log('retrievedObject: ', JSON.parse(retrievedObject));	

});

function loadJsonFromFile(callbackFunction){
	var request = new XMLHttpRequest();
	request.overrideMimeType("application/json");
	request.open("GET", "questions_bank.json", true);
	request.onreadystatechange = function () {	

          if (request.readyState == 4) {
          // if (request.readyState == 4 && request.status == "200") { // if http!!
            callbackFunction(request.responseText);
          }
    };
	request.send();	
}
