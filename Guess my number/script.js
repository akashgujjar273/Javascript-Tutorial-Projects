// //this is the secret number and its generating a random number between 1 to 20
// let number = Math.trunc(Math.random() * 20) + 1;

// //if we create a variable then score value will be stored
// //it is better to save bcz it will then not only limited to dom
// //it wilkl also be available to our code
// //it is also called state variable bcz it is part of application state which means all the data relevant to application
// let score=20;
// let highscore=0;
// document.querySelector('.check').addEventListener('click', function () {
//   const guess = Number(document.querySelector('.guess').value);

//   if (!guess) {
//     document.querySelector('.message').textContent = 'no number is input';

//   } else if (guess === number) {
//     document.querySelector('.message').textContent =
//       'Congratulations! You guessed it right';
//       document.querySelector("body").style.backgroundColor="#60b347"
//       document.querySelector(".number").style.width="30rem"
//       document.querySelector(".number").textContent=number

//       if(score>highscore){
//           highscore=score;
//           document.querySelector(".highscore").textContent=highscore;
//       }

//   } else if (guess > number) {
//       if(score>1){
//           document.querySelector('.message').textContent = 'Too High';
//           score--;
//           document.querySelector(".score").textContent=score;
//       }else{
//         document.querySelector('.message').textContent = 'You lose the game';
//         document.querySelector(".score").textContent=0;
//         document.querySelector(".number").textContent=number
//       }

//   } else if (guess < number) {
//     if(score>1){
//         document.querySelector('.message').textContent = 'Too Low';
//         score--;
//         document.querySelector(".score").textContent=score;
//     }else{
//       document.querySelector('.message').textContent = 'You lose the game';
//       document.querySelector(".score").textContent=0;
//       document.querySelector(".number").textContent=number
//     }
//   }
//   if (guess > 20) {
//     document.querySelector('.message').textContent = 'Guess between 1 to 20';
//   }
// //this code will reload the page and resets everything
// //   document.querySelector('.again').addEventListener('click', function (){
// //       location.reload()
// //   })

// });

//this code is dryed
let number = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};
document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);

  if (!guess) {
    displayMessage('⛔️ No number!');
  } else if (guess === number) {
    displayMessage('🎉 Correct Number! Congratulations You guessed it right');

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('.number').textContent = number;

    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } else if (guess !== number) {
    if (score > 1) {
      displayMessage(guess >number ? '📈 Too high!' : '📉 Too low!');
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      displayMessage('💥 You lost the game!');
      document.querySelector('.score').textContent = 0;
      document.querySelector('.number').textContent = number;
    }
  }
  if (guess > 20) {
    displayMessage('Guess between 1 to 20');
  }
});

//this will not reload the page and highscore will be preserved

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  number = Math.trunc(Math.random() * 20) + 1;
  displayMessage('Start guessing...');
  document.querySelector('.score').textContent = score;

  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});

///////////////////////////////////////
// Coding Challenge #1

/* 
Implement a game rest functionality, so that the player can make a new guess! Here is how:

1. Select the element with the 'again' class and attach a click event handler
2. In the handler function, restore initial values of the score and secretNumber variables
3. Restore the initial conditions of the message, number, score and guess input field
4. Also restore the original background color (#222) and number width (15rem)

GOOD LUCK 😀
*/
