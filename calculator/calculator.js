let screen = document.getElementById('screen');
buttons = document.querySelectorAll('button');
//screenvalue input k ander ki value h
let screenValue = '';
//sbhi buutons ko target kia
for (item of buttons) {
    item.addEventListener('click', (e) => {
        //button k ander ki value leli
        buttonText = e.target.innerText;
        console.log('Button text is ', buttonText);
        if (buttonText == 'x') {
            buttonText = '*';
            //screen.value screen k ander ki value h
            //screen value ko button text k baraber kro
            screenValue += buttonText;
            //screen k ander ki value ko screen value k baraber krdo
            screen.value = screenValue;
        }
        else if (buttonText == 'C') {
            screenValue = "";
            screen.value = screenValue;
        }
        else if (buttonText == '=') {
            screen.value = eval(screenValue);
        }
        else {
            screenValue += buttonText;
            screen.value = screenValue;
        }

    })
}

