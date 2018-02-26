var MAIN_WIDTH = document.querySelector(".mainBack").clientWidth;
var QUESTIONS = "";
var USED_QUESTIONS_NUMBER = 10;
var CURRENT_QUESTION = 0;
console.log(MAIN_WIDTH);

loadJsonFromFile(function(response){
	QUESTIONS = JSON.parse(response);
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
				startQuizButton.style.animation = "scaleOutStart ease 0.4s forwards";
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
	shuffleArray(QUESTIONS["questions"]);
	QUESTIONS["questions"].length = USED_QUESTIONS_NUMBER;
	createQuestionsMap();
	console.log(QUESTIONS);



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
	(function setCurrentIcon(){
		var currentIcon = document.querySelector("#questionIcon" + currentQuestion);
		replaceClass(currentIcon, "scaleIn", "activeQuestion");
		currentIcon.style.transform = "scale(1)";
	})();
	(function prepareBackground(){
		var mainBack = document.querySelector(".mainBack");
		var mainBackOverlay = document.querySelector(".mainBackOverlayImage");
		mainBackOverlay.style.background = "url('imgs/img" + currentQuestion + ".jpg')";	
		mainBackOverlay.style.backgroundSize = "900px 550px";	
		mainBackOverlay.classList.add("animatedFadeIn");
	})();

	(function loadQuestion(){
		replaceClass(document.querySelector(".questionTextDiv"), "hidden", "animatedFadeIn");
		document.querySelector(".questionTitle").innerHTML = 
			"Question " + (currentQuestion + 1) + "/" + QUESTIONS["questions"].length;
		document.querySelector(".questionText").innerHTML = QUESTIONS["questions"][currentQuestion]["text"];
	})();
	
	var answers = QUESTIONS["questions"][currentQuestion]["answers"];
	var answersArea = document.querySelector(".answersArea");
	var answersElements = new Array(answers.length);

	(function createAnswers(){
		for (var i = answers.length - 1; i >= 0; i--) {
			var answerElement = createCustomElement(
				"div",	
				answers[i],
				answersArea,
				["optionText","optionIn"]
			);		
			answersElements[i] = answerElement;
			var animationDelayInSec = i/6;		
			answerElement.style.animationDelay = animationDelayInSec + "s";
			answerElement.style.opacity = "0";
			answerElement.id = "answer" + i;
			// set clickListener after items ready
			(function(answerElement, i) {
				setTimeout(function(){
					answerElement.style.opacity = "1";
					answerElement.style.animation = "none";
					answerElement.classList.add("optionTextHover");
					answerElement.addEventListener("click", function checkAnswer(){					
						this.removeEventListener("click", checkAnswer);	
						this.style.animation = "scaleOut 1s ease forwards";
						this.classList.add("selectedAnswer");
						this.classList.remove("optionTextHover");
						var allAnswers = document.querySelectorAll(".optionText");
						for (var i = allAnswers.length - 1; i >= 0; i--) {
							if (allAnswers[i] != this){
							allAnswers[i].style.animation = "scaleOutOthers 1s forwards";					
							}
							timeoutRemoveElement(allAnswers[i]);
						};
					});
				}, 2700);
			})(answerElement, i);					
		};		
	})();
	
	(function setAnimationToAnswers(){
		var maxY = selector(".mainBack").clientHeight 
			- selector(".questionsMap").clientHeight 
			- selector(".questionTextDiv").clientHeight;
		var maxX = answersArea.clientWidth;
		var halfY = maxY / 2;
		var halfX = maxX / 2;

		// initial position
		circleAnimationTimeout(answersElements, 0, halfX, halfY, true);	

		(function(answersElements, halfX, halfY){
			setTimeout(function(){			
				circleAnimationTimeout(answersElements, 0, halfX, halfY, false);	
			},2500);
		})(answersElements, halfX, halfY);
		
	})();



}

function timeoutRemoveElement(element){
	setTimeout(function(){
		element.remove();
	}, 1100);
}

function circleAnimationTimeout(answersElements, phaseShift, halfX, halfY, once){
	// console.log("circleDraw");
	if (document.querySelectorAll(".optionText").length == 0 ) return;

	setTimeout(function(){
		for (var i = answersElements.length - 1; i >= 0; i--) {
			var elementPosition = getPositionForAnimatingQuestions(i, answersElements, phaseShift, halfX, halfY);
			updateStylePosition(answersElements[i], elementPosition[0], elementPosition[1]);
		};
		if (once) return;
		circleAnimationTimeout(answersElements, phaseShift + 0.5 / 57, halfX, halfY, false);
	}, 50);
}

function getPositionForAnimatingQuestions(i, answersElements, phaseShift, halfX, halfY){

	var currentElement = answersElements[i];
	var amplitudeX = halfX / 1.7;
	var amplitudeY = halfY / 2;
	var phaseStep = 2*Math.PI / answersElements.length;
	var x = (halfX + amplitudeX * Math.sin(phaseShift + phaseStep*i) ) - currentElement.clientWidth/2;
	var y = (halfY + amplitudeY * Math.cos(phaseShift + phaseStep*i) ) - currentElement.clientHeight/2;	
	return [x,y];
}

function updateStylePosition(element, x, y){
	element.style.left = Math.round(x) + "px";
	element.style.top = Math.round(y) + "px";
	
}


function selector(selector){
	return document.querySelector(selector);
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

function shuffleArray(array) {
    var randomIndex, storage;
    for (var i = array.length - 1; i > 0; i--) {
        randomIndex = Math.floor(Math.random() * (i + 1));
        storage = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = storage;
    }
}