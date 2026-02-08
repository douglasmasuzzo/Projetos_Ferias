const inputs = [...document.querySelectorAll('input')];
const button = document.querySelector('button');
const errorMessage = document.querySelector('.error-message');
const correctPassword = "1234";

inputs.forEach((element, index) => {
    element.addEventListener('input', () => {
        if(element.value.lenght === 1 && index + 1 < inputs.lenght){
           inputs[index + 1].focus(); 
        }
    });

    element.addEventListener('focus', () => {
        element.value = "";
    });

    element.addEventListener('keydown', (event) => {
        if(event.key === "Backspace" && element.value === ""){
          if (index > 0){
            inputs[index - 1].focus();
                inputs[index - 1].value = "";
          }  
        }
    });
});

button.addEventListener('click', () => {
    const userPassword = inputs.map(input => input.value).join('');

    if (userPassword === correctPassword) {
        alert("Acesso Liberado ✅");
            inputs.forEach(input => (input.value = ""));
                inputs[0].focus();
        errorMessage.style.display = 'none';
    } else {
        errorMessage.style.display = 'block';
    }
});