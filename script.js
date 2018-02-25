
loadJsonFromFile(function(response){
	var questions = JSON.parse(response);
	console.log(questions);


	showIntro(questions);

	startQuiz();
	// var bgm = new Audio('bgm.mp3');
	// bgm.addEventListener('ended', function() {
	//     this.currentTime = 0;
	//     this.play();
	// }, false);
	// bgm.play();





	// var stringified = JSON.stringify(questions);
	// localStorage.setItem('results', stringified);
	// var retrievedObject = localStorage.getItem('results');
	// console.log('retrievedObject: ', JSON.parse(retrievedObject));	
});



function showIntro(questions){
	setTimeout(function(){ 
		var introDiv = createCustomElement(
			"div",
			questions.introText,
			".mainBack",
			["introText","animatedFadeIn"]
		);

		setTimeout(function(){ 
			var introDiv = createCustomElement(
				"div",
				"Start Quiz",
				".mainBack",
				["startQuiz","animatedFadeIn"]
			);

			setTimeout(function(){
				introDiv.style.animation = "scalePulse 3s cubic-bezier(0.5, 0.25, 0.25, 0.7) infinite";
			}, 1000);

		}, 1000);	

	}, 1000);	
	
};
function startQuiz(){
};

function createCustomElement(type, innerHTML, parentSelector, classesArray){
	var newElement = document.createElement(type);
	newElement.innerHTML = innerHTML;	
	document.querySelector(parentSelector).appendChild(newElement);
	for (var i = classesArray.length - 1; i >= 0; i--) {
		newElement.classList.add(classesArray[i]);
	};
	return newElement;
}

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
