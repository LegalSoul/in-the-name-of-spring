var MAIN_WIDTH = document.querySelector(".mainBack").clientWidth;
var QUESTIONS = "";
var USED_QUESTIONS_NUMBER = 10;
var CURRENT_QUESTION = 0;
var TIME_ALLOWED = 99;
var MUSIC_PLAYER_SNOW = "";
var MUSIC_PLAYER_BGM = "";
var MUSIC_PLAYER_SFX = "";
var IMAGES_INDEXES = [0,1,2,3,4,5,6,7,8,9];
shuffleArray(IMAGES_INDEXES);

var retrievedObject = localStorage.getItem('result');
console.log('retrievedObject: ', JSON.parse(retrievedObject));

loadJsonFromFile(function(response){
	QUESTIONS = JSON.parse(response);
	showIntro();
	MUSIC_PLAYER_SNOW = initPlayer("snow.mp3", 0.4);
	
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
				MUSIC_PLAYER_SFX = initSound("click.mp3");			
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

			startQuizButton.onmouseover = function(){				
				MUSIC_PLAYER_SFX = initSound("hover.mp3");
			};
			

		}, 1000);	

	}, 1000);	
	
};
function startQuiz(){
	setTimeout(function(){
		MUSIC_PLAYER_BGM = initPlayer("bgm.mp3", 1);
	}, 1500);
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
		
		var pathMask = "url('imgs/img_number_.jpg";
		if (currentQuestion == 0){
			mainBack.style.background = pathMask.replace("_number_","-1");	
		}else{
			mainBack.style.background = pathMask.replace("_number_",IMAGES_INDEXES[currentQuestion-1]);
		}
		mainBackOverlay.style.background = pathMask.replace("_number_",IMAGES_INDEXES[currentQuestion]);					

		mainBackOverlay.style.opacity = "0";
		mainBackOverlay.classList.remove("animatedFadeIn");	
		setTimeout(function(){
			mainBackOverlay.classList.add("animatedFadeIn");	
		},200);		

	})();

	(function loadQuestion(){
		replaceClass(selector(".questionTextDiv"), "hidden", "animatedFadeIn");
		selector(".questionTextDiv").style.animation = "";
		selector(".questionTitle").style.color = "rgb(206, 255, 255)";
		selector(".questionTitle").innerHTML = 
			"Question " + (currentQuestion + 1) + "/" + QUESTIONS["questions"].length +
				 " : " + TIME_ALLOWED + "s";
		setTimeout(function(){
			setTimerDown(selector(".questionTitle"), 0, TIME_ALLOWED);
		},3000);

		selector(".questionText").innerHTML = QUESTIONS["questions"][currentQuestion]["text"];
	})();
	
	var answers = QUESTIONS["questions"][currentQuestion]["answers"];
	var rightAnswer = answers[0];
	shuffleArray(answers);
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
						MUSIC_PLAYER_SFX = initSound("click.mp3");
						this.removeEventListener("click", checkAnswer);	
						if (this.classList.contains("fadingAway")){
							return;
						}
						this.style.animation = "scaleOut 1s ease forwards";
						this.classList.add("selectedAnswer");					
						this.classList.remove("optionTextHover");
						if (this.classList.contains("timeout")){
							setRemoveOtherAnswersActions(null, "timeout");
							setQuestionResults(false);
						}else{							
							setRemoveOtherAnswersActions(this, "");
							setQuestionResults(this.innerHTML == rightAnswer);
						}
					});
					answerElement.onmouseover = function(){				
						MUSIC_PLAYER_SFX = initSound("hover.mp3");
					};
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

function setQuestionResults(correctAnswer){
	setTimeout(function(){
		var currentIcon = selector("#questionIcon" + CURRENT_QUESTION);
		currentIcon.style.animation = "none";
		replaceClass(currentIcon, "activeQuestion", correctAnswer ? "correctAnswer" : "wrongAnswer");
		var currentTimeStamp = parseInt(extractTimeFromTimer());	
		var timeStampRoundingStep = TIME_ALLOWED / 10;	
		var currentTimeStampPercent = Math.ceil(currentTimeStamp / timeStampRoundingStep) * timeStampRoundingStep;
		currentTimeStampPercent = Math.floor( (currentTimeStampPercent / TIME_ALLOWED ) * 100);
		if (correctAnswer){
			currentIcon.style.background = ("linear-gradient(to top, #00984b, #00984b " 
				+ currentTimeStampPercent + "%, #981500 " 
				+ currentTimeStampPercent + "%, #981500)");			
		}
		currentIcon.setAttribute("time_stamp", currentTimeStampPercent );
	},300);
	var questionTextDiv = selector(".questionTextDiv");
	questionTextDiv.classList.remove("animatedFadeIn");
	questionTextDiv.style.animation = "fadeOut 0.5s forwards";
	setTimeout(function(){
		questionTextDiv.style.opacity = "0";
		questionTextDiv.style.animation = "none";		
	}, 600);
	setTimeout(function(){		
		if (CURRENT_QUESTION >= USED_QUESTIONS_NUMBER-1){
			endQuiz();		
		}else{
		loadQuestion(++CURRENT_QUESTION);			
		}
	},1000);
}

function endQuiz(){
	var mainBack = document.querySelector(".mainBack");
	var pathMask = "url('imgs/img_number_.jpg";
	mainBack.style.background = pathMask.replace("_number_",IMAGES_INDEXES[CURRENT_QUESTION]);	

	console.log(selectorAll(".wrongAnswer").length);
	console.log(selectorAll(".correctAnswer").length);

	var allCorrectAnswers = selectorAll(".correctAnswer");

	var totalScore = 0;
	for (var i = allCorrectAnswers.length - 1; i >= 0; i--) {		
		var answerScore = parseInt(allCorrectAnswers[i].getAttribute("time_stamp"));
		totalScore += answerScore;		
	};

	var totalPercentage = Math.round( (totalScore / USED_QUESTIONS_NUMBER));
	console.log("PERFECNT : " + totalPercentage);

	writeToStorage(totalPercentage);

	runPercentageResult(totalPercentage, 0);
	// create percentageDiv
	selector(".questionTextDiv").remove();
	var startQuizButton = createCustomElement(
		"div",
		"Life energy: 0%",
		document.querySelector(".mainBack"),
		["percentageDiv","animatedFadeIn"]
	);
	
}

function runPercentageResult(totalPercentage, i){
	(function (totalPercentage, i){

		setTimeout(function(){	
			selector(".percentageDiv").innerHTML = "Life energy: " + i + "%";

			if ( i % 5 === 0 ){
				// console.log(i);
				var mainBack = selector(".mainBack");
				var mainBackOverlay = selector(".mainBackOverlayImage");
				
				var pathMask = "url('imgs/img-result_number_.jpg";
				if (i != 0){
					mainBack.style.background = pathMask.replace("_number_", Math.round(i/5) - 1);							
				}

				mainBackOverlay.style.background = pathMask.replace("_number_", Math.round(i/5));					

				mainBackOverlay.style.opacity = "0";
				mainBackOverlay.classList.remove("animatedFadeIn");	
				setTimeout(function(){
					mainBackOverlay.classList.add("animatedFadeIn");	
				},100);		

			}
			if (i < totalPercentage){
				runPercentageResult(totalPercentage, i + 1);			
			}else{
				var backgroundFadingImage = selector(".backgroundOverlay");
				var outroText = selector(".outroText");				
				//fade out ... KINDA
				MUSIC_PLAYER_SNOW.volume /= 1.4;
				MUSIC_PLAYER_BGM.volume /= 1.4;
				setTimeout(function(){
					MUSIC_PLAYER_SNOW.volume /= 2;
					MUSIC_PLAYER_BGM.volume /= 1.8;
				},1000);
				setTimeout(function(){					
					MUSIC_PLAYER_BGM.volume /= 2.5;
				},1500);
				setTimeout(function(){
					MUSIC_PLAYER_SNOW.pause();
					MUSIC_PLAYER_BGM.pause();
				},2000);
				var initFinalMusicName = "spring";
				if (totalPercentage >= 80){
					backgroundFadingImage.style.background = "url('imgs/backgroundGood.jpg')";
					backgroundFadingImage.style.backgroundSize = "cover";
					outroText.innerHTML = "The Spring is saved! Bravo!";					
				}else{
					backgroundFadingImage.style.background = "url('imgs/backgroundBad.jpg')";
					outroText.innerHTML = "The energy was not enough to save the Spring...";
					initFinalMusicName = "lacry";
				}
				setTimeout(function(){
					initPlayer(initFinalMusicName+".mp3", 0.25);
				},3000);
				backgroundFadingImage.style.animation = "fadeIn 5s forwards";
				outroText.style.animation = "fadeIn 5s forwards";
			}

		},200);	

	})(totalPercentage, i);		
}

function setTimerDown(element, iteration, seconds){
	(function(element, iteration){
		var theTimer = setTimeout(function(){		
			if ((selector(".optionText").classList.item(3)) == "othersRemoving") {
				window.clearTimeout(theTimer);
				return;
			}
				var timeSymbolsStart = element.innerHTML.lastIndexOf(" ");
				var titleText = element.innerHTML;
				var timeLeft = titleText.substr(timeSymbolsStart+1); //60s
				timeLeft = timeLeft.substr(0, timeLeft.length - 1); //60
				if (timeLeft / seconds <= 0.5) {
					var randomNoiseScale = Math.random() * (1 - timeLeft*2/seconds) * 0.05;
					element.style.transform = "scale(" + (1+randomNoiseScale) + ")";								
				}
				var reddeningColor =  Math.round(255*(timeLeft/seconds)) + "," 
												+ Math.round(255*(timeLeft/seconds)) + ")";
				element.style.color = "rgb(206," +reddeningColor;
			if ((iteration % 20) === 0){
				if (parseInt(timeLeft) <= 0 ) {
					var allOptions = selectorAll(".optionText");			
					for (var i = allOptions.length - 1; i >= 1; i--) {
						allOptions[i].classList.add("fadingAway");	
					};
					allOptions[0].classList.add("timeout");
					allOptions[0].click();			
					return;
				}					
				element.innerHTML = titleText.substr(0, timeSymbolsStart+1) + (parseInt(timeLeft)-1) + "s";		
			}

			
			setTimerDown(element, iteration + 1, seconds);

		}, 50);
	})(element, iteration);	
}

function setRemoveOtherAnswersActions(selectedAnswer, timeout){
	var allAnswers = document.querySelectorAll(".optionText");
	for (var i = allAnswers.length - 1; i >= 0; i--) {
		if (allAnswers[i] != selectedAnswer){
			allAnswers[i].style.animation = "scaleOutOthers 1s forwards";					
		}
		timeoutRemoveElement(allAnswers[i]);
		if (timeout == ""){			
			allAnswers[i].classList.add("othersRemoving");			
		}
	};	
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

function selectorAll(selector){
	return document.querySelectorAll(selector);
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

function extractTimeFromTimer(){
	var timeSymbolsStart = selector(".questionTitle").innerHTML.lastIndexOf(" ");
	var titleText = selector(".questionTitle").innerHTML;
	var timeLeft = titleText.substr(timeSymbolsStart+1); //60s
	timeLeft = timeLeft.substr(0, timeLeft.length - 1); //60
	return timeLeft;
}
function initPlayer(track, volume){
	player = new Audio(track);
	player.addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	player.volume = volume;
	player.play();
	return player;
}

function initSound(track){
	player = new Audio(track);
	player.play();
	return player;
}

function writeToStorage(totalPercentage){
	var JSONdata = {"total_score" : totalPercentage};
	var stringified = JSON.stringify(JSONdata);
	localStorage.setItem('result', stringified);
}