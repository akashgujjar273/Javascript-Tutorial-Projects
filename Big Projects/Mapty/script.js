'use strict';

//we used leaflet a library and used a hosted verson copy pasting link we will use npm i leasflet in future
class Workout {
  clicks = 0;
  //these are new in js so we should include them in constructor but not in this project
  date = new Date();
  //we should always use library for creating id not create on our own olny for this project create our own
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    // this.date=...
    // this.id=...
    this.coords = coords; //[lat,lng]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }

  _setdescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setdescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setdescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  //these private fields will be available on all objs that are created with this class
  #map;
  #mapevent;
  #mapZoomLevel = 13;
  #workouts = [];
  constructor() {
    //constructor is executed as soon as obj is created so we added these funcs call method here so they will be caleed as soon as page load and obj is created
    this._getPosition();

    this._getLocalStorage();
    //we used bind ,method bcz callback funcs are treated as regular func and regular func this keyword is undefined so we use bind it to use this keyword and this keyword points to the obj that is created
    //when working with eventlistner in classs always bind this keyword
    form.addEventListener('submit', this._newWorkout.bind(this));
    //adding event on changing type from cycle and running when we change type an event occurses we r listneing to that one
    //toggle event doesnt use this keyword thats why it doesnt need binding
    inputType.addEventListener('change', this._toggleEventListner);
    //event delegation is used if we had no workout so that itwill even work in that case remember
    containerWorkouts.addEventListener('click', this._movePopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
    //we used this._loadmap bcz we r in class thats why we used this keyword
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        //when failed to get location
        function () {
          alert("Couldn't Get Your Location");
        }
      );
  }

  _loadMap(position) {
    //when successfully got location
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(`https://www.google.com/maps/@${latitude}.${longitude}`);

    let coords = [latitude, longitude];
    //cordinates and zoomed in map
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //handeling marker events
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work =>{ 
      this._renderWorkoutMarker(work)
    });
  }

  _showForm(mapE) {
    this.#mapevent = mapE;
    //adding form when click
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleEventListner() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapevent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      //these r strings turining them into a number by adding +
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;

    form.insertAdjacentHTML('afterend', html);
  }
  _movePopup(e) {
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    //its like scrollto method but its provieded from leaf library
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    workout.click();
  }
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work =>{ 
      this._renderWorkout(work)
      //will not work bcz getloclastorage is in constructor and it will run as soon as page load
      //and rednderworkoutmarker hasnt been loaded yet
      // this._renderWorkoutMarker(work)
    });
  }
  reset(){
    localStorage.removeItem("workouts")
    location.reload()
  }
}

const app = new App();
