'use strict';

//selecting elements
//current players
const player0elem = document.querySelector('.player--0');
const player1elem = document.querySelector('.player--1');
//total scores
const score0 = document.querySelector('#score--0');
const score1 = document.getElementById('score--1');
//current score
const currentp0 = document.getElementById('current--0');
const currentp1 = document.getElementById('current--1');

const diceelem = document.querySelector('.dice');
const rollBtn = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');

//starting conditions
//totals score should be zero and dice hidden
score0.textContent = 0;
score1.textContent = 0;
diceelem.classList.add('hidden');

//total scores in array we set player 1 0 and 2 =1 bcz the total scores will be stored in array
let scores = [0, 0];
//setting current score 0 and active players selector default is 0 (player1)
let currentscore = 0;
let activeplayer = 0;
let playing = true; //if game is true then game is playable if false then roll and dice would not work

const switchPlayer = function () {
  document.getElementById(`current--${activeplayer}`).textContent = 0;
  currentscore = 0;
  activeplayer = activeplayer === 0 ? 1 : 0;
  player0elem.classList.toggle('player--active');
  player1elem.classList.toggle('player--active');
};

//rolling dice
rollBtn.addEventListener('click', function () {
  if (playing) {
    //generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;
    //display dice
    diceelem.classList.remove('hidden');
    //showing dice image according to dice randome number
    diceelem.src = `dice-${dice}.png`;
    //check if rolled 1 then switch player
    if (dice !== 1) {
      //add the dice to the current score
      currentscore += dice;
      //changing score
      //with active player variable we can change it by 0 and 1
      document.getElementById(
        `current--${activeplayer}`
      ).textContent = currentscore;
    } else {
      document.getElementById(`current--${activeplayer}`).textContent = 0; //if player gets 1 then change player also make current score 0
      currentscore = 0; //if its not present then the score will show zero but will continue from were it was left
      //if activeplayer is 0 then turn it into 1 if not then 0
      activeplayer = activeplayer === 0 ? 1 : 0;
      //toggle works as add and remove
      //if class is present then remove it and if its not then add it
      //toggling both make sures that class is present in only one of these bcz it strarted with player 0
      player0elem.classList.toggle('player--active');
      player1elem.classList.toggle('player--active');
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    //add current score to active players total score
    scores[activeplayer] += currentscore;
    document.getElementById(`score--${activeplayer}`).textContent =
      scores[activeplayer];

    //if player total score exceed 100 win the game
    if (scores[activeplayer] >= 50) {
      playing = false;
      diceelem.classList.add('hidden');
      document
        .querySelector(`.player--${activeplayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activeplayer}`)
        .classList.remove('player--active');
    } else {
      //switch player
      //if game finishes we dont want to switch player only if games is going then switch
      switchPlayer();
    }
  }
});

const newgame=function(){
 scores = [0, 0];
 currentscore = 0;
 activeplayer = 0;
 playing = true;
 score0.textContent = 0;
 score1.textContent = 0;
 currentp0.textContent=0
 currentp1.textContent=0
 diceelem.classList.add('hidden');
 player0elem.classList.add('player--active');
 player1elem.classList.remove('player--active');
 player0elem.classList.remove('player--winner');
 player1elem.classList.remove('player--winner');
}

btnNew.addEventListener('click', newgame);
