var password = document.getElementById("password");
function genPassword(){
    var chars = "013456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passLenght = 10;
    var password = "";
    for (var i = 0; i < passLenght; i++){
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}

function copyPassword(){
    var copyText = document.getElementById("password");
    copyText.select();
    document.execCommand("copy");
}