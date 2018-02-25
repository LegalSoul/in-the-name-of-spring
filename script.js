var MAIN_WIDTH = document.querySelector(".mainBack").clientWidth;
var QUESTIONS = "";
var CURRENT_QUESTION = 0;
console.log(MAIN_WIDTH);

loadJsonFromFile(function(response){
	QUESTIONS = JSON.parse(response);
	console.log(QUESTIONS);
	showIntro();
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

function showIntro(){
	setTimeout(function(){ 
		var introDiv = createCustomElement(
			"div",
			QUESTIONS.introText,
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
					startQuiz();
				}, 1000);
			});

		}, 1000);	

	}, 1000);	
	
};
function startQuiz(){
	// startSnow();!!!!!!!!!!!!!!!!!

	createQuestionsMap();

	setTimeout(function(){
		loadQuestion(CURRENT_QUESTION);
	}, 2000);

};

function createQuestionsMap(){	
	var questionsMap = createCustomElement(
		"div",	
		"",	
		document.querySelector(".mainBack"),
		["questionsMap","animatedFadeIn"]
	);

	var mainCenter = MAIN_WIDTH / 2;
	var questionsCount = QUESTIONS["questions"].length;
	var fullWidth = 30 * questionsCount;	

	for (var i = questionsCount - 1; i >= 0; i--) {
		var questionIcon = createCustomElement(
			"div",	
			(i+1).toString(),	
			questionsMap,
			["questionIcon","scaleIn"]
		);
		questionIcon.style.left = (mainCenter + i * 30 - fullWidth/2) + "px";
		questionIcon.style.transform = "scale(0)";
		questionIcon.style.animationDelay = (i / 10)  + "s";
		questionIcon.id = "questionIcon" + i;
	};

}

function loadQuestion(currentQuestion){
	var currentIcon = document.querySelector("#questionIcon" + currentQuestion);
	replaceClass(currentIcon, "scaleIn", "activeQuestion");
	currentIcon.style.transform = "scale(1)";

	var mainBack = document.querySelector(".mainBack");
	var mainBackOverlay = document.querySelector(".mainBackOverlayImage");

	mainBackOverlay.style.background = "url('imgs/img" + currentQuestion + ".jpg')";	
	mainBackOverlay.style.backgroundSize = "900px 550px";	
	// mainBackOverlay.style.opacity = 0;
	mainBackOverlay.classList.add("animatedFadeIn");

	
	replaceClass(document.querySelector(".questionTextDiv"), "hidden", "animatedFadeIn");

	document.querySelector(".questionTitle").innerHTML = 
		"Question " + (currentQuestion + 1) + "/" + QUESTIONS["questions"].length;
	document.querySelector(".questionText").innerHTML = QUESTIONS["questions"][currentQuestion]["text"];
	
	var answers = QUESTIONS["questions"][currentQuestion]["answers"];
	var answersArea = document.querySelector(".answersArea");
	var answersElements = new Array(answers.length);
	for (var i = answers.length - 1; i >= 0; i--) {
		var answerElement = createCustomElement(
			"div",	
			answers[i],
			answersArea,
			["optionText","optionIn"]
		);		
		answersElements[i] = answerElement;

		var animationDelayInSec = i/2;		
		enableDisplayAfterTimeout(animationDelayInSec, answerElement);
		answerElement.style.animationDelay = animationDelayInSec + "s";
		answerElement.style.top = ( i * 50 ) + "px";
		answerElement.id = "questionIcon" + i;
	};

	// setTimeout(function(){
	// 	mainBackOverlay.style.animation = "none";
	// 	setTimeout(function(){
	// 		mainBackOverlay.style.animation = "";			

	// 	},100);
	// },2000);

}

function enableDisplayAfterTimeout(delay, object){
	setTimeout(function(){
		object.style.display = "block";			
	}, delay * 1000);
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
