'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-05-03T17:01:17.194Z',
    '2021-05-04T23:36:17.929Z',
    '2021-05-05T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formattime = function (date, local) {
  const dayscalc = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daypassed = dayscalc(new Date(), date);

  if (daypassed === 0) return 'Today';
  if (daypassed === 1) return 'Yesterday';
  if (daypassed <= 7) return `${daypassed} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0); //we used template literal to make it string then used pad to mak 08 eg
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0); //same if month is 5 then make it 05 and also plus 1 bcz month is zero based
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(local).format(date);
};

//note we used to Fixed to add .00 this adds it automatically
const currencyFormat = function (value, local, currency) {
  return new Intl.NumberFormat(local, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayflow = function (acc, sort = false) {
  //emptying the older elements
  //textcontent only gives text and inner html gives everything including html;
  containerMovements.innerHTML = '';

  //sorting array
  //we used slice to copy the array then used asending order
  //bcz we showed it from bottom to top
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (elem, i) {
    const type = elem > 0 ? 'deposit' : 'withdrawal';
    //we r looping movments of acc then used the index i to get movements dates
    //we didnt create a new loop we used the ones that is here (i )

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formattime(date, acc.locale);
    const curr = currencyFormat(elem, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${curr}</div>
      </div>
    `;
    //is container m after begins kaha dalna h position h aur kya dalna h html jo humne bnai h
    //mdn pr aur bhi details h
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsername = function (accounts) {
  accounts.forEach(function (account) {
    //acount k ander username naam ki property bngyi
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};
createUsername(accounts);

const printBalance = function (acc) {
  acc.balance = acc.movements.reduce((accum, elem) => accum + elem, 0);
  labelBalance.textContent = currencyFormat(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const displaybalancesummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = currencyFormat(
    incomes,
    account.locale,
    account.currency
  );
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = currencyFormat(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = currencyFormat(
    interest,
    account.locale,
    account.currency
  );
};

const updateUI = function (acc) {
  //display movments
  displayflow(acc);

  //display balance
  printBalance(acc);

  //display summaery
  displaybalancesummary(acc);
};
const settimer = function () {
  let time = 120;
  const tick=function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}: ${sec}`;
    
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `login to get started`;
      containerApp.style.opacity = 0;
    }
    time--;

  }
  tick()
  const timer = setInterval(tick, 1000);
  return timer
};
// //event handler
let currentAccount ,timer;
// //faked always login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//cuurentaccount m jo value ayegi agr vo account onwer k baraber h aur pin k uski to lgin krdo
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //optinal chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0); //we used template literal to make it string then used pad to mak 08 eg
    // const month = `${now.getMonth() + 1}`.padStart(2, 0); //same if month is 5 then make it 05 and also plus 1 bcz month is zero based
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;

    //clearinput field
    //this will workj bcz assign operator works from right to left
    inputLoginUsername.value = inputLoginPin.value = '';
    //use this to loose focus on typing | basically removing this after entering
    inputLoginPin.blur();
    if(timer)clearInterval(timer)

    timer=settimer()
    //update ui
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  //looking for account that has input same value
  const reciveraccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciveraccount &&
    currentAccount.balance >= amount &&
    reciveraccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciveraccount.movements.push(amount);
    //adding date to transeferer
    currentAccount.movementsDates.push(new Date().toISOString());
    reciveraccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    clearInterval(timer)
    timer=settimer()
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //using index to remove account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//only grant loan to account if the requested ammounts 10% is present in 1 deposit
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    //or amount*0.1
    //add amount
    setTimeout(function () {
      currentAccount.movements.push(amount);

      //adding loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      //update ui
      updateUI(currentAccount);

      clearInterval(timer)
      timer=settimer()
    }, 2500);
  }
  inputLoanAmount.value = '';
});

//sorting method
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayflow(currentAccount.movements, !sorted);
  sorted = !sorted;
});
