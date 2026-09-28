import { revealNextAction, hideNextAction } from "../../../assets/navigation/gp-navigation.js?v=20260902-8&deploy=20260929-asset-fix-5";

const stops = [
  {
    pages:[2], subtitle:"Stop 1 · Count the bees in the garden.", icon:"🔎", title:"Count the bees",
    alt:"Physical book page 2: count the bees in the garden",
    html:`<p class="question">How many bees are in the garden?</p><div class="choice-grid">${[5,6,7,8].map(n=>`<button class="choice" data-answer="${n===6}">${n} bees</button>`).join("")}</div>`,
    success:"Yes! There are 6 bees in the garden."
  },
  {
    pages:[3], subtitle:"Stop 2 · Find the missing first letters.", icon:"🔤", title:"Complete the park words",
    alt:"Physical book page 3: missing first letters for park words",
    html:`<p class="question">Which set completes bench, trees, lamp, and people?</p><div class="choice-grid"><button class="choice" data-answer="true">b · t · l · p</button><button class="choice" data-answer="false">p · l · t · b</button><button class="choice" data-answer="false">d · f · r · m</button><button class="choice" data-answer="false">t · b · p · l</button></div>`,
    success:"Great spelling! bench, trees, lamp, people."
  },
  {
    pages:[4], subtitle:"Stop 3 · Spot the things that belong at the park.", icon:"🌳", title:"What is at the park?",
    alt:"Physical book page 4: identify things at the park",
    multi:true, required:["grass","lamp","flowers","bench","trees"],
    html:`<p class="question">Tap all five things you can find at the park.</p><div class="choice-grid multi">${["grass","lamp","flowers","bench","trees","classroom"].map(x=>`<button class="choice" data-value="${x}">${x}</button>`).join("")}</div><button class="check-btn choice" type="button">Check my park</button>`,
    success:"You found the grass, lamp, flowers, bench, and trees!"
  },
  {
    pages:[5], subtitle:"Stop 4 · Help her reach the park gate.", icon:"🧭", title:"Follow the park maze",
    alt:"Physical book page 5: maze to the park gate",
    html:`<p class="question">Look at the maze. Where is she trying to go?</p><div class="choice-grid"><button class="choice" data-answer="true">The park gate</button><button class="choice" data-answer="false">The classroom</button><button class="choice" data-answer="false">The pond</button><button class="choice" data-answer="false">The store</button></div><p>This web check supports the book maze. Trace the complete path on physical page 5.</p>`,
    success:"Yes! Trace the path to the park gate in your physical book."
  },
  {
    pages:[6,7], subtitle:"Stop 5 · Match the park words and read the sentences.", icon:"🪑", title:"Bench or lamp?",
    alt:"Physical book pages 6 and 7: bench and lamp comprehension and writing",
    html:`<p class="question">Complete the sentence: “There are bees near the ___.”</p><div class="choice-grid"><button class="choice" data-answer="true">bench</button><button class="choice" data-answer="false">fountain</button><button class="choice" data-answer="false">classroom</button><button class="choice" data-answer="false">pond</button></div>`,
    success:"Correct! There are bees near the bench."
  },
  {
    pages:[8,9], subtitle:"Stop 6 · Use the last park clues to finish the lesson.", icon:"🌿", title:"Read the final clue",
    alt:"Physical book pages 8 and 9: trees and people comprehension and writing",
    html:`<p class="question">Which sentence matches the picture with bees beside the trees?</p><div class="choice-grid"><button class="choice" data-answer="false">There are bees near the people.</button><button class="choice" data-answer="true">There are bees near the trees.</button><button class="choice" data-answer="false">There are bees in a classroom.</button><button class="choice" data-answer="false">There are bees under the pond.</button></div>`,
    success:"Excellent! There are bees near the trees."
  }
];

const els={subtitle:document.querySelector("#stop-subtitle"),progressLabel:document.querySelector("#progress-label"),progressFill:document.querySelector("#progress-fill"),pageLabel:document.querySelector("#page-label"),bookPage:document.querySelector("#book-page"),pairToggle:document.querySelector("#paired-page-toggle"),missionIcon:document.querySelector("#mission-icon"),missionTitle:document.querySelector("#mission-title"),stage:document.querySelector("#activity-stage"),feedback:document.querySelector("#feedback"),next:document.querySelector("#next-action"),bookToggle:document.querySelector("#book-toggle"),bookPanel:document.querySelector(".book-panel")};
const route=[...document.querySelectorAll(".route-stop")];
let current=0;let unlocked=0;let completed=new Set();let pairedPageIndex=0;
const assetBase="../../../assets/literacy/week-1/physical-page-";

function render(){
  const stop=stops[current];const pageText=stop.pages.length===1?`Physical book page ${stop.pages[0]}`:`Physical book pages ${stop.pages.join("–")}`;
  pairedPageIndex=0;els.subtitle.textContent=stop.subtitle;els.progressLabel.textContent=`${current+1} of ${stops.length}`;els.progressFill.style.width=`${((current+1)/stops.length)*100}%`;els.pageLabel.textContent=pageText;renderVisibleBookPage(stop);els.pairToggle.hidden=stop.pages.length<2;els.missionIcon.textContent=stop.icon;els.missionTitle.textContent=stop.title;els.stage.innerHTML=stop.html;els.feedback.textContent="";els.feedback.className="feedback";hideNextAction(els.next);
  route.forEach((button,index)=>{button.classList.toggle("is-current",index===current);button.classList.toggle("is-complete",completed.has(index));button.disabled=index>unlocked});
  bindChoices(stop);
}
function renderVisibleBookPage(stop){const page=stop.pages[pairedPageIndex];els.bookPage.src=`${assetBase}${String(page).padStart(2,"0")}.png`;els.bookPage.alt=stop.pages.length>1?`Physical book page ${page} of paired pages ${stop.pages.join(" and ")}`:stop.alt;els.pairToggle.textContent=pairedPageIndex===0?`View page ${stop.pages[1]}`:`View page ${stop.pages[0]}`;els.pairToggle.setAttribute("aria-pressed",String(pairedPageIndex===1));}

function bindChoices(stop){
  if(stop.multi){
    const selected=new Set();els.stage.querySelectorAll(".choice[data-value]").forEach(button=>button.addEventListener("click",()=>{const value=button.dataset.value;button.classList.toggle("is-selected");button.classList.contains("is-selected")?selected.add(value):selected.delete(value)}));
    els.stage.querySelector(".check-btn").addEventListener("click",()=>{const correct=selected.size===stop.required.length&&stop.required.every(x=>selected.has(x));if(correct)complete(stop);else retry("Look again. One choice does not belong at the park, or one park item is still missing.")});return;
  }
  els.stage.querySelectorAll(".choice[data-answer]").forEach(button=>button.addEventListener("click",()=>{if(button.dataset.answer==="true"){button.classList.add("is-correct");els.stage.querySelectorAll(".choice[data-answer]").forEach(x=>x.disabled=true);complete(stop)}else{button.classList.add("is-wrong");button.disabled=true;retry("Good try. Look at the book picture and choose again.")}}));
}

function complete(stop){completed.add(current);unlocked=Math.max(unlocked,Math.min(stops.length-1,current+1));els.feedback.textContent=`⭐ ${stop.success}`;els.feedback.className="feedback good";route[current].classList.add("is-complete");els.next.textContent=current===stops.length-1?"Finish Adventure ★":"Next Stop →";revealNextAction(els.next)}
function retry(message){els.feedback.textContent=message;els.feedback.className="feedback try"}
function finish(){document.querySelector(".adventure-card").innerHTML=`<section class="interaction-panel finish-card"><div class="award" aria-hidden="true">🏅🐝</div><h2>Park Bee Explorer!</h2><p>You finished physical book pages 2–9 in order.</p><div class="sentence-card"><strong>There are bees near the flowers, bench, lamp, trees, and grass.</strong></div><div class="finish-links"><a href="../">Literacy Home</a><a href="../../">Week 1 Home</a><a href="../../../">All Weeks</a></div></section>`;document.querySelector(".route-map").hidden=true;els.subtitle.textContent="Adventure complete!";els.progressLabel.textContent="6 of 6 complete";els.progressFill.style.width="100%";hideNextAction(els.next)}

els.next.addEventListener("click",()=>{if(current===stops.length-1){finish();return}current++;render();scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})});
route.forEach((button,index)=>button.addEventListener("click",()=>{if(index<=unlocked){current=index;render()}}));
els.bookToggle.addEventListener("click",()=>{const collapsed=els.bookPanel.classList.toggle("is-collapsed");els.bookToggle.textContent=collapsed?"Show book page":"Hide book page";els.bookToggle.setAttribute("aria-expanded",String(!collapsed))});
els.pairToggle.addEventListener("click",()=>{pairedPageIndex=pairedPageIndex===0?1:0;renderVisibleBookPage(stops[current])});
render();
