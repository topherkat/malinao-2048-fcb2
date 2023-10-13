let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// Declaring variable used for touch input
let startX = 0;
let startY = 0;



// This will listen to when we touch as screen and assigns the x coordinates of that touch // input to the startX variable and the y coordinates to startY variable 
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});





// Create function to set the gameboard
function setGame(){
    // Initialize the 4x4 game board with all tiles set to 0
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];


    // Create the game board on the HTML document
    // The first loop is to create rows, the second loop is to create columns
    for(let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){

             // creates a tile using div tag 
            let tile = document.createElement("div");
            
            // each tile will be assigned with unique ids using row and column values
            tile.id = r.toString() + "-" + c.toString(); 
            
            // Gets the number value from the board tile
            let num = board[r][c];
            
            // Update the tile's content and styling based on the value
            // This will be a function to adjust the content and appearance of the tile based on its number.
            updateTile(tile, num); 
            
            // Append the tile to the game board container
            // This means placing the tile inside the grid, in the right row and column
            // document.getElementById("board") - is targeting the div from the HTML file
            document.getElementById("board").append(tile); 

        }
    }

    // For Random Tile
    setTwo();
   
}



// this code function is to assigns a class to the tile based on the submitted  value of the tile through num parameter
function updateTile(tile, num){
    // clear the tile
    tile.innerText = ""; 
    
    // clear the classList to avoid multiple classes
    tile.classList.value = ""; 
   
    // CSS class named "tile" is added to the classList of the tile, this will be for styling the tiles
    tile.classList.add("tile");

    // If num is positive, the number is converted to a string and placed inside the tile as text. 
    if(num > 0) {
        tile.innerText = num.toString();
        // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
        // example: if num is 128, the class "x128" is added to the tile.
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // if num is greater than 4096, a special  class "x8192" is added.
            tile.classList.add("x8192");
        }
    }
}

// event that triggers when the web page finishes loading. It's like saying "wait until everything on the page is ready."
window.onload = function() {
    // `setGame()` is called to be executed
    setGame();
}

// UNKNOWN FEATURE
document.addEventListener('touchmove', (e) => {

    if(!e.target.className.includes("tile")){
        return
    }

    e.preventDefault(); // This line disables scrolling
}, { passive: false }); // Use passive: false to make preventDefault() work

document.addEventListener('touchend', (e) => {
    
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            slideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            setTwo(); // Call a function named "setTwo"
        } else {
            slideDown(); // Call a function for sliding down
            setTwo(); // Call a function named "setTwo"
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
});

// SLIDE FEATURE 

// Function that handles the user's keyboard input when they press certain arrow keys.
function handleSlide(e) {
    // Checks if the pressed key's code is one of arrow keys on the keyboard.
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        
        // Prevent default behavior (scrolling) on keydown
        e.preventDefault(); 
        
        // Depending on which arrow key was pressed, a corresponding function is called.
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }

        // frequently updates score in every slide
        document.getElementById("score").innerText = score;     // Update score

        checkWin();

        // Call hasLost() to check for game over conditions
        if (hasLost()) {
            // Use setTimeout to delay the alert
            setTimeout(() => {
                alert("Game Over! You have lost the game. Game will restart");
                restartGame();
                alert("Click any arrow key to restart");
                // You may want to reset the game or perform other actions when the user loses.
            }, 100); // Adjust the delay time (in milliseconds) as needed

        }
    }
}
// When any key is pressed, the handleSlide function is called to handle the key press.
document.addEventListener("keydown", handleSlide);


/*
	Initial version to prove the function is callable and working
	function slideLeft(){
	    console.log("You pressed left")
	}

	function slideRight() {
	    console.log("You pressed right")
	}

	function slideUp() {
	    console.log("You pressed up")
	}

	function slideDown() {
	    console.log("You pressed down")
	}
*/

// Responsible for sliding the tiles to the left on the game board.
function slideLeft(){
    // iterate through each row
    for(let r = 0; r < rows; r++){
        let row = board[r] // sample: 0, 2, 2, 2

        // This line for animation
        let originalRow = row.slice(); // store the array in a new variable 

        row = slide(row); // call slide function 
        board[r] = row;  // update the value in the array

        // Update the id of the tile
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num)
            // Line for animation 
            if (originalRow[c] !== num && num !== 0) {  // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-right 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }      
        } 
    }
}

function slideRight() {
    // iterate through each row
    for(let r = 0; r < rows; r++){
        let row = board[r]

        let originalRow = row.slice();

        
        row.reverse(); // reverse the array(since it is sliding to the right) before removing the zeroes  row = [0, 2, 2, 2] -> row = [2, 2, 2, 0]
        row = slide(row); // modify the array -> [4, 2, 0, 0]
        row.reverse(); // reverse the array -> [0, 0, 2, 4]
        board[r] = row;

        // Update the id of the tile
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);

            if (originalRow[c] !== num && num !== 0) {   // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-left 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}

function slideUp(){
    for(let c = 0; c < columns; c++) {

        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board(downwards) =  [2, 0, 2, 0]
        let originalRow = row.slice();

        row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]
        let changedIndices = [];

        for (let r = 0; r < columns; r++) { 
            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }

        // Update the id of the tile
        for(let r = 0; r < columns; r++){
            board[r][c] = row[r]

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num)

            
            // Animation - Add sliding effect by animating the movement of the tile
            if (changedIndices.includes(r) && num !== 0) {
                /* changeIndices [0, 2]
                1st iteration: 0 is in changeIndices, board[0][0] !==0 (True)(Apply slide-from-bottom Animation to the current tile)
                2nd iteration: 1 is not changeIndices, board[1][0]  (False)
                3rd iteration: 2 is in changeIndices, but board[2][0] !== 0 (False)
                4th iteration: 3 is not changeIndices, board[3][0] (False)
                */
                tile.style.animation = "slide-from-bottom 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
        }
    }
}



function slideDown(){
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board(downwards) =  [2, 0, 2, 0]
        
        // Animation
        let originalRow = row.slice();

        row.reverse();      // we will reverse the row value since it is downwards. --> [0, 2, 0, 2]
        row = slide(row);   // [2,2] -> [4, 0] -> [4, 0, 0, 0]
        row.reverse();      // reverse again the newest value of row -> [0, 0, 0, 4] 
        
        // Check which tiles have changed in this column
        let changedIndices = [];
        for (let r = 0; r < columns; r++) {
                   

	        if (originalRow[r] !== row[r]) {
	            changedIndices.push(r);
	        }
	    }   // [0, 2, 3]


        // Update the id of the tile
        for(let r = 0; r < columns; r++){
            board[r][c] = row[r]
            
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num)

            // Animation - Add sliding effect by animating the movement of the tile
            if (changedIndices.includes(r) && num !== 0) {
               

                tile.style.animation = "slide-from-top 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

        }
    }
}




function filterZero(row){
    // create new array removing the zeroes
    return row.filter(num => num != 0) ;
}


// Merge feature
// Core function for sliding and merging tiles in a row.
function slide(row){
    // row = [0, 2, 2, 2]
    row = filterZero(row); // get rid of zeroes -> [2, 2, 2]

    //row = [2, 2, 2]
    for(let i = 0; i < row.length - 1; i++){
        /* 1st iteration:
        If index 0 == index 1 (2 == 2)
        (true) index 0 = 2 * 2 (4)
        Index 1 = 0 (4,0,2)

        2nd iteration:
        If index 1 == index 2 (0 == 2)
        (false) index 1 = 0
        Index 2 = 2 (4,0,2)
        */



        if(row[i] == row[i+1]){  
            row[i] *= 2;       
            row[i+1] = 0;  
            score += row[i];       // updates score upon merging
        } // [2, 2, 2] -> [4, 0, 2]



    }

    row = filterZero(row); //[4, 2]

    // Add zeroes back
    while(row.length < columns){
        row.push(0);
    } // [4, 2, 0, 0]

    return row; // [4,2,0,0]
}


// EMPTY TILE CHECKER FEATURE


// Returns a boolean
function hasEmptyTile(){
    // Iterate through the board
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // Check if current tile == 0, if yes return true
            if(board[r][c] == 0){
                return true
            }
        }
    }
    // Return false if no tile == 0
    return false;
}


// CREATOR OF NEW 2 VALUES

function setTwo(){
    // Check the hasEmptyTile boolean result, if hasEmptyTile == false, the setTwo will not proceed
    if(!hasEmptyTile()){
        return;
    }

    // Declare a value found(tile)
    let found = false;
    
    while(!found){
        // Math.random() - generates a number between 0 and 1, then multiplied by no. of columns or rows
        // Math.floor() - rounds down to the nearest integer 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        // Check if the position (r, c) on the game board is empty (i.e., has a value of 0).
        if(board[r][c] == 0){
            // If the position value is 0, set the value to 2, representing the new "2" tile. 
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            // Set the found variable to true to break the loop
            found = true;
        }
    }
}


// WIN FEATURE
function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

// LOST FEATURE
function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right)
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

// function to restart game after losing

// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }
    setTwo()    // new tile   
}

document.addEventListener("click", (event) => {

    // Checks if the target of the click is the change-button
    if(event.target.id != "change-button"){
        return
    }

    tile02 = document.getElementById("02")
    tile04 = document.getElementById("04")
    tile08 = document.getElementById("08")
    tile16 = document.getElementById("16")
    tile32 = document.getElementById("32")
    tile64 = document.getElementById("64")
    tile128 = document.getElementById("128")
    tile256 = document.getElementById("256")
    tile512 = document.getElementById("512")
    tile1024 = document.getElementById("1024")
    tile2048 = document.getElementById("2048")
    tile4096 = document.getElementById("4096")
    tile8192 = document.getElementById("8192")

    if(tile02.value != ''){
        document.documentElement.style.setProperty("--background-image-url-02", "url('" + tile02.value + "')");
    }
    if(tile04.value != ''){
        document.documentElement.style.setProperty("--background-image-url-04", "url('" + tile04.value + "')");
    }
    if(tile08.value != ''){
        document.documentElement.style.setProperty("--background-image-url-08", "url('" + tile08.value + "')");
    }
    if(tile16.value != ''){
        document.documentElement.style.setProperty("--background-image-url-16", "url('" + tile16.value + "')");
    }
    if(tile32.value != ''){
        document.documentElement.style.setProperty("--background-image-url-32", "url('" + tile32.value + "')");
    }
    if(tile64.value != ''){
        document.documentElement.style.setProperty("--background-image-url-64", "url('" + tile64.value + "')");
    }
    if(tile128.value != ''){
        document.documentElement.style.setProperty("--background-image-url-128", "url('" + tile128.value + "')");
    }
    if(tile256.value != ''){
        document.documentElement.style.setProperty("--background-image-url-256", "url('" + tile256.value + "')");
    }
    if(tile512.value != ''){
        document.documentElement.style.setProperty("--background-image-url-512", "url('" + tile512.value + "')");
    }
    if(tile1024.value != ''){
        document.documentElement.style.setProperty("--background-image-url-1024", "url('" + tile1024.value + "')");
    }
    if(tile2048.value != ''){
        document.documentElement.style.setProperty("--background-image-url-2048", "url('" + tile2048.value + "')");
    }
    if(tile4096.value != ''){
        document.documentElement.style.setProperty("--background-image-url-4096", "url('" + tile4096.value + "')");
    }
    if(tile8192.value != ''){
        document.documentElement.style.setProperty("--background-image-url-8192", "url('" + tile8192.value + "')");
    }
})