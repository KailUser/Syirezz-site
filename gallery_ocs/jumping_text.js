var text = document.getElementById('title');
var type = "OCs Gallery!";
var charArray = type.split('');
var charArrayLength = charArray.length;
var charIndex = 0;

function jumpChar() {
    if (charIndex < charArrayLength) {
        text.textContent += charArray[charIndex];
        charIndex++;
        setTimeout(jumpChar, 50 + Math.floor(Math.random() * 100));
    }
}

jumpChar();

