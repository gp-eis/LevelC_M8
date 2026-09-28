const activities={
  2:{title:"Which sport are they playing?",prompt:"Look at the court and racket. Choose the sport.",choices:["soccer","basketball","golf","tennis"],answer:"tennis",good:"Goal! The racket and net show tennis."},
  3:{title:"Find one missing first letter",prompt:"Which letter completes _occer?",choices:["b","v","s","p"],answer:"s",good:"Super! S makes soccer."},
  4:{title:"Read the scoreboard",prompt:"The home team has 2. The away team has 1. Who lost?",choices:["Home team","Away team"],answer:"Away team",good:"That’s right. The away team lost."},
  5:{title:"Count the teams",prompt:"How many sports teams are in the pictures?",choices:["2","3","4"],answer:"3",good:"Great counting! There are 3 sports teams."},
  6:{title:"Match one sports word",prompt:"Which picture matches soccer?",choices:["Left picture","Right picture"],answer:"Left picture",good:"Correct! The left picture shows soccer."},
  7:{title:"Practice one sentence",prompt:"Choose the sentence that matches the soccer player.",choices:["I like soccer.","I like volleyball."],answer:"I like soccer.",good:"Nice reading!"},
  8:{title:"Match one sports word",prompt:"Which picture matches basketball?",choices:["Left picture","Right picture"],answer:"Right picture",good:"Correct! The right picture shows basketball."},
  9:{title:"Practice one sentence",prompt:"Choose the sentence that matches the baseball player.",choices:["I like basketball.","I like baseball."],answer:"I like baseball.",good:"Home run!"}
};
const page=Number(document.body.dataset.bookPage),activity=activities[page],choices=document.querySelector("#page-choices"),feedback=document.querySelector("#page-feedback");
document.querySelector("#activity-title").textContent=activity.title;document.querySelector("#activity-prompt").textContent=activity.prompt;
activity.choices.forEach(value=>{const button=document.createElement("button");button.className="choice";button.type="button";button.textContent=value;button.addEventListener("click",()=>{if(value===activity.answer){[...choices.children].forEach(item=>item.disabled=true);button.classList.add("correct");feedback.textContent=`⭐ ${activity.good}`;feedback.className="feedback good"}else{button.classList.add("wrong");feedback.textContent="Try again. Look closely and choose again.";feedback.className="feedback try";setTimeout(()=>button.classList.remove("wrong"),350)}});choices.append(button)});
