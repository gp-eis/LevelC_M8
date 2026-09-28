import { hideNextAction, revealNextAction } from "../../../assets/navigation/gp-navigation.js?v=20260917-c&deploy=20260929-asset-fix-4";

const stops = [
  { id:"park", icon:"🌳", title:"Park Patrol", pages:"2–3", image:"physical-page-02.png", alt:"Book page 2 showing five numbered animals in a park", reading:"The children are walking in the park. They see many animals. Look at what each animal is doing.", questions:[
    ["There is a ___ on the grass.",["dog sitting","swan hunting"],0],["There is a ___ on the path.",["rabbit jumping","cat yawning"],1],["There is a ___ by the tree.",["squirrel playing","bat hunting"],0],["There is a ___ on the grass.",["deer walking","dog sleeping"],0],["There is an ___ in the sky.",["cat swimming","eagle hunting"],1]] },
  { id:"garden", icon:"🌷", title:"Garden Search", pages:"4–5", image:"physical-page-04.png", alt:"Book page 4 showing five numbered things in a garden", reading:"The children are planting flowers. Compare the colors and sizes of the things they see.", questions:[
    ["They see a ___ on the flower.",["red ladybug","green snail"],0],["They see a ___ on the rain boots.",["pink cactus","brown ant"],1],["They see a ___ in the garden.",["tall fence","short ladybug"],0],["They see a ___ by the fence.",["green cactus","blue ant"],0],["They see a ___ on the fence.",["big snail","small snail"],1]] },
  { id:"yard", icon:"🌙", title:"Night Yard", pages:"6–7", image:"physical-page-06.png", alt:"Book page 6 showing four numbered things in a yard at night", reading:"A dog barks in the yard at night. Dogs become more alert at night. What is the dog barking at?", questions:[
    ["The dog is barking at the ___ car.",["white","blue"],1],["The dog is barking at the ___ scooter.",["purple","brown"],0],["The dog is barking at the ___ owl.",["brown","blue"],0],["The dog is barking at the ___ moon.",["purple","white"],1]] },
  { id:"cave", icon:"🦇", title:"Cave Count", pages:"8–9", image:"physical-page-08.png", alt:"Book page 8 showing four numbered groups of cave creatures", reading:"In the cave, the children and teacher see and hear many scary things. Count each group carefully.", questions:[
    ["The ___ are scary.",["two spiders","four ghosts"],0],["The ___ is scary.",["three bats","one monster"],1],["The ___ are scary.",["one spider","three ghosts"],1],["The ___ are scary.",["four bats","two spiders"],0]] }
];

const elements={map:document.querySelector("#trail-map"),image:document.querySelector("#book-page"),pageToggle:document.querySelector("#page-view-toggle"),page:document.querySelector("#page-label"),progress:document.querySelector("#progress"),progressFill:document.querySelector("#progress-fill"),title:document.querySelector("#place-title"),reading:document.querySelector("#reading"),question:document.querySelector("#question"),choices:document.querySelector("#choices"),feedback:document.querySelector("#feedback"),next:document.querySelector("#next-action"),card:document.querySelector("#lesson-card"),completion:document.querySelector("#completion")};
let stopIndex=0, questionIndex=0, showingQuestionPage=false;

const totalQuestions=stops.reduce((total,stop)=>total+stop.questions.length,0);
function completedQuestions(){return stops.slice(0,stopIndex).reduce((total,stop)=>total+stop.questions.length,0)+questionIndex;}

function renderMap(){elements.map.innerHTML=stops.map((stop,index)=>`<div class="trail-stop ${index<stopIndex?"is-done":""} ${index===stopIndex?"is-current":""}">${stop.icon} ${stop.title}</div>`).join("");}
function renderQuestion(){
  const stop=stops[stopIndex], [prompt,options,correct]=stop.questions[questionIndex];
  document.body.dataset.place=stop.id; showingQuestionPage=false; renderBookPage(stop);
  elements.page.textContent=`Physical book pages ${stop.pages}`; elements.progress.textContent=`Stop ${stopIndex+1} of ${stops.length} · Question ${questionIndex+1} of ${stop.questions.length}`;
  elements.progressFill.style.width=`${((completedQuestions()+1)/totalQuestions)*100}%`;
  elements.title.textContent=`${stop.icon} ${stop.title}`; elements.reading.textContent=stop.reading; elements.question.textContent=prompt;
  elements.feedback.className=""; elements.feedback.textContent="Find the evidence in the picture, then choose your answer."; elements.choices.innerHTML="";
  options.forEach((option,index)=>{const button=document.createElement("button"); button.className="word-choice"; button.type="button"; button.textContent=option; button.addEventListener("click",()=>answer(button,index===correct)); elements.choices.append(button);});
  elements.next.textContent=questionIndex+1<stop.questions.length?"Next question →":stopIndex+1<stops.length?"Next stop →":"Finish trail →"; hideNextAction(elements.next); renderMap();
}
function renderBookPage(stop){
  const [scenePage,questionPage]=stop.pages.split("–"),visiblePage=showingQuestionPage?questionPage:scenePage;
  elements.image.src=`../../../assets/literacy/week-1/physical-page-${visiblePage.padStart(2,"0")}.png`;
  elements.image.alt=showingQuestionPage?`Physical book page ${questionPage}, the required reading and sentence questions for this stop`:stop.alt;
  elements.pageToggle.textContent=showingQuestionPage?`← View scene on page ${scenePage}`:`Read questions on page ${questionPage} →`;
  elements.pageToggle.setAttribute("aria-pressed",String(showingQuestionPage));
}
elements.pageToggle.addEventListener("click",()=>{showingQuestionPage=!showingQuestionPage;renderBookPage(stops[stopIndex]);});
function answer(selected,isCorrect){
  [...elements.choices.children].forEach(button=>{button.classList.remove("is-wrong");button.setAttribute("aria-pressed","false");});
  selected.setAttribute("aria-pressed","true");
  if(!isCorrect){selected.classList.add("is-wrong");elements.feedback.className="is-wrong";elements.feedback.textContent="Good try! Look at the numbered picture and try again.";return;}
  selected.classList.add("is-correct");
  [...elements.choices.children].forEach(button=>button.disabled=true); elements.feedback.className="is-correct"; elements.feedback.textContent="Great job! You found the evidence."; revealNextAction(elements.next);
}
elements.next.addEventListener("click",()=>{
  if(questionIndex+1<stops[stopIndex].questions.length) questionIndex+=1;
  else if(stopIndex+1<stops.length){stopIndex+=1; questionIndex=0;}
  else{elements.card.hidden=true; elements.completion.hidden=false; elements.map.innerHTML=stops.map(stop=>`<div class="trail-stop is-done">${stop.icon} ${stop.title}</div>`).join(""); hideNextAction(elements.next); return;}
  renderQuestion(); window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
});
renderQuestion();
