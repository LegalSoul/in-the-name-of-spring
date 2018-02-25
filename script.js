var MAIN_WIDTH = document.querySelector(".mainBack").clientWidth;
console.log(MAIN_WIDTH);

loadJsonFromFile(function(response){
	var questions = JSON.parse(response);
	console.log(questions);
	showIntro(questions);
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
			document.querySelector(".mainBack"),
			["introText","animatedFadeIn"]
		);

		setTimeout(function(){ 
			var startQuizButton = createCustomElement(
				"div",
				"Start Quiz",
				document.querySelector(".mainBack"),
				["startQuiz","animatedFadeIn", "startQuizHoverClass"]
			);

			setTimeout(function(){
				if (startQuizButton.classList.contains("startQuizHoverClass")){
					startQuizButton.style.animation = "scalePulse 3s cubic-bezier(0.5, 0.25, 0.25, 0.7) infinite";										
				}
			}, 1000);

			startQuizButton.addEventListener("click", function startQuizClick(){			
				startQuizButton.classList.remove("startQuizHoverClass");
				startQuizButton.removeEventListener("click", startQuizClick);				
				startQuizButton.style.animation = "fadeOut 0.4s forwards";
				startQuizButton.style.cursor = "default";
				introDiv.style.animation = "fadeOut 0.8s forwards";
				setTimeout(function(){					
					startQuizButton.remove();
					introDiv.remove();
					document.querySelector(".mainBack").style.background = "none";
					startQuiz(questions);
				}, 1000);
			});

		}, 1000);	

	}, 1000);	
	
};
function startQuiz(questions){
	// startSnow();!!!!!!!!!!!!!!!!!

	createQuestionsMap(questions);

};

function createQuestionsMap(questions){	
	var questionsMap = createCustomElement(
		"div",	
		"",	
		document.querySelector(".mainBack"),
		["questionsMap","animatedFadeIn"]
	);

	var mainCenter = MAIN_WIDTH / 2;
	var questionsCount = questions["questions"].length;
	var fullWidth = 30 * questionsCount;	

	for (var i = questionsCount - 1; i >= 0; i--) {
		var questionIcon = createCustomElement(
			"div",	
			i.toString(),	
			questionsMap,
			["questionIcon","scaleIn"]
		);
		questionIcon.style.left = (mainCenter + i * 30 - fullWidth/2) + "px";
		questionIcon.style.transform = "scale(0)";
		questionIcon.style.animationDelay = (i / 10)  + "s";
	};

}



function replaceClass(element, from, to){
	element.classList.remove(from);
	element.classList.add(to);
}

function createCustomElement(type, innerHTML, parent, classesArray){
	var newElement = document.createElement(type);
	newElement.innerHTML = innerHTML;	
	parent.appendChild(newElement);
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
