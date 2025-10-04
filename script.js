const boxes = document.querySelectorAll(".playing_box");
//picking up all the .playing box 
const Max_tries = 6;
//defining max tries 
const Word_length = 5;//length of the user input word
const Words = [
    "APPLE","BRAVE","CLOUD","DREAM","SPIKE","LIGHT","GHOST","CRANE","FLAME",
    "BLAST","TREND","BRICK","SHADE","BRINK","PRIDE","GRAPE","SHINE","STORM",
    "SWEET","TRACK","FROST","BRUSH","PLANT","GLORY","SWIFT"
];//random word library 
let answer = Words[Math.floor(Math.random() * Words.length)];//selecting a random word for the game

let currentRow = 0;
let currentCol = 0;
// this mobile addition was done by ai as i havent explored that much and since most of the 
//user are on phone , i used this so that this site still remain functionable on the mobile

// detect mobile
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const hiddenInput = document.getElementById("hidden_input");

if (isMobile && hiddenInput) {
    // mobile function
    hiddenInput.focus();
    document.addEventListener("click", () => hiddenInput.focus());

    hiddenInput.addEventListener("input", (e) => {
        const value = e.target.value.toUpperCase();
        // if mobile user typed more letters than current column, fill the next box
        if (value.length > currentCol) fillBox(value[currentCol]);
        setTimeout(() => { hiddenInput.value = ""; }, 10); // reset input so next letter works
    });

    hiddenInput.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") removeBox(); // backspace works on mobile
        if (e.key === "Enter" && currentCol === Word_length) checkWord(); // enter works on mobile
    });
}


document.addEventListener("keydown", (e) => {
    if (!isMobile) handleKey(e.key); // only process desktop keys here
});

function handleKey(key) {
    key = key.toUpperCase();
    if (/^[A-Z]$/.test(key) && currentCol < Word_length) {
        //key >= "A" && key <= "Z" this was little bug for memory leak and to resolve it i need little help as im still a rookie
        ///^[A-Z]$/.test(key) this thing ensures only letter btw A-Z are there and no enter , shift or backspace
        //setting up this fillBox function
        fillBox(key);
    } else if (key === "BACKSPACE" && currentCol > 0) {
        //setting up this delete previous letter input 
        removeBox();
    } else if (key === "ENTER" && currentCol === Word_length) {
        checkWord();
        //checkWord function to give final output like you won or lost 
    }
}

function fillBox(letter) {
    const index = currentRow * Word_length + currentCol;
    //like row=0 and column=0 so current index=0 row =1 col=4 then (1*5+4)=9
    boxes[index].textContent = letter;
    currentCol++;
}

function removeBox() {
    if (currentCol === 0) return; 
    currentCol--;//taking one step back 
    const index = currentRow * Word_length + currentCol;
    //making that filled box empty for backspace use
    boxes[index].textContent = "";
}

function checkWord() {
    let guess = "";//begin with empty string
    for (let i = 0; i < Word_length; i++) {
        const index = currentRow * Word_length + i;//thru this mechanism we are triggering the loop to access each box and 
        guess += boxes[index].textContent;//adding letters in it 
    }

    if (guess.length < Word_length) return;//if length is short , umm probably do nothing

    for (let i = 0; i < Word_length; i++) {
        const index = currentRow * Word_length + i;
        const letter = guess[i];
        //after the input , we are moving for the color part like green for correct and yellow for partial and grey for wrong
        if (letter === answer[i]) {//the guessed letter is spot on
            boxes[index].style.backgroundColor = 'green';
            boxes[index].style.color = 'white';
        } else if (answer.includes(letter)) {// like word is there but not at correct position
            boxes[index].style.backgroundColor = 'yellow';
            boxes[index].style.color = 'black';
        } else {//incorrect condition
            boxes[index].style.backgroundColor = 'darkgrey';
            boxes[index].style.color = 'white';
        }
    }

    if (guess === answer) {//correct answer pop out
        setTimeout(() => alert("🎉, bingo you got it right"), 600);
    } else {
        currentRow++;//pop up for lost player
        currentCol = 0;
        if (currentRow === Max_tries) {
            setTimeout(() => alert(`sorry you ran out of tries!!the word was ${answer}`), 200);
        }
    }
}
