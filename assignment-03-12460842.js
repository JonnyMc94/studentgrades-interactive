let table = document.querySelector('.table');
let rows = document.getElementsByTagName('tr');
let cells = document.getElementsByTagName('td');
let avg = document.querySelectorAll('.average-result');
let studentName = document.querySelector('.studentName');
let studentID = document.querySelector('.studentid');
let addRow = document.querySelector('.addRow');
let addCol = document.querySelector('.addCol');
let numAssign = document.getElementById('assign');
let gradeCol = document.querySelector('.avg');
let columnCount = 5;
let averages = [];
let studentNameValue;
let studentIDValue;
let nameValidated = false;
let idValidated = false;
let rowPosition;


/** This assignment was tested in Chrome version 89.0.4389.90 on MacOS
 * 
 * I have attempted all requirements and also some of the extra credit. Unfortunately there are still a few bugs which I can't work out - I'll list them here:
 * 
 * - Adding a new column makes the average column small - once it's clicked on it returns to normal size but the    background is red
 * 
 * - If you add a new row and then attempt to add a new column after, it will add a new heading cell but will not increase the cells in the rows below. If you then try to add a new row again, the new row will have the correct amount of rows
 * 
 * - Clicking to highlight a row/column only highlights 2 cells in that direction
*/


document.addEventListener('DOMContentLoaded', () => {

  fillTable();
  updateAvg();

});

const getRandomStudentNumber = () => {

  // https://stackoverflow.com/questions/3437133/javascript-generate-a-random-number-that-is-9-numbers-in-length
  // https://www.w3schools.com/jsref/jsref_slice_string.asp

  return (Math.random()*(9-2)+1).toString().slice(2, 10);
}
const getRandomGrade = () => {
  return Math.round(Math.random() * 99) + 1
};

const fillTable = () => {
    const arr = [...rows]; // Spread operator to turn HTML Collection into array
  arr.shift(); // Gets rid of top row
  //console.log(arr);
    arr.forEach((ele) => {

      const childArr = [...ele.children];

      childArr.forEach((child) => {
        if (child.className == 'studentID') {
          child.innerHTML = getRandomStudentNumber(); //Randomly generates a studentID and fills the cells when the page loads
        }
        
      })
    }
  )
}
  

/* This function uses a nested forEach loop to traverse each row and store the total value in a variable
  It also keeps track of the amount of the amount of assignments. These two variables are then used to calculate the average which is then stored in the final column
*/
const updateAvg  = () => {
  let notSubmitted = 0;
  const rowArray = [...rows];
    rowArray.shift(); 
  rowArray.forEach((ele, i) => {

    let numAssignments = 0;
    let accumulatedScore = 0;
    let averageGrade = 0;
    

    const childArr = [...ele.children]; // creates array of row children i.e. row cells

    childArr.forEach((child) => {
      //console.log('hit');
      if (child.className == 'results') {
        numAssignments++;
        
        
        if (isNaN(child.innerHTML)) { // Deals with the input no being a number
          child.innerHTML = '-';
          child.style.backgroundColor = 'yellow';
          child.style.textAlign = 'center';
          accumulatedScore += 0;
          notSubmitted++;
        } else {
          if (i % 2 == 0) { // Assigns style to even rows
            accumulatedScore += parseInt(child.innerHTML);
            childArr[childArr.length - 1].style.backgroundColor = "rgb(141, 161, 165)";
            child.style.textAlign = 'right';
          } else { // Assigns style to odd rows
            accumulatedScore += parseInt(child.innerHTML);
            childArr[childArr.length - 1].style.backgroundColor = "rgb(206, 201, 201);";
            child.style.textAlign = 'right';
          }
        } 
        
      }

      
    })

    numAssign.innerHTML = notSubmitted;
    averageGrade = Math.round(accumulatedScore / numAssignments); 
    childArr[childArr.length - 1].innerHTML = averageGrade;
    if (averageGrade < 60) { // Assigns style to average cell if average is below 60
      childArr[childArr.length - 1].style.color = "white";
      childArr[childArr.length - 1].style.backgroundColor = "crimson";
    } else {
      if (i % 2 == 0) {
        childArr[childArr.length - 1].style.color = "black";
        childArr[childArr.length - 1].style.backgroundColor = "rgb(161, 161, 161)";
      } else {
        childArr[childArr.length - 1].style.color = "black";
        childArr[childArr.length - 1].style.backgroundColor = "rgb(235, 235, 235)";
      }

    }
    
    

  }
    
    
)}


const anotherRowArray = [...rows];
anotherRowArray.shift();

// How to add event listener to contenteditable elements --> https://stackoverflow.com/questions/1391278/contenteditable-change-events

anotherRowArray.forEach((row, i) => { // Listens for input on contenteditable cells
  row.addEventListener(
    'input',
    function () {
      console.log('input event');
      updateAvg();
      const childArr = [...row.children];
      childArr.forEach(child => {
        
      
        if (child.innerHTML > 0 && child.innerHTML <= 100 && child != childArr[childArr.length-1]) {
          i % 2 == 0 ? child.style.backgroundColor = "rgb(161, 161, 161)" :
            child.style.backgroundColor = "rgb(206, 201, 201)";
        } else if ((child != childArr[0] && child !=childArr[childArr.length-1] && isNaN(child.innerHTML)) || ((child != childArr[1] && child.innerHTML>100) || (child != childArr[1] && child.innerHTML < 0))) {
          child.innerHTML = '-';
          child.style.backgroundColor = 'yellow';
          child.style.textAlign = 'center';
        } else if (child == childArr[childArr.length-1] && isNaN(child.innerHTML)) {
            child.innerHTML = '';
            childArr[childArr.length - 1].style.color = "white";
            childArr[childArr.length - 1].style.backgroundColor = "crimson";
          
        }
      })
      
      
    },
    false
  );
});


// For grabbing content from input element --> https://stackoverflow.com/questions/41209260/javascript-innerhtml-is-not-working

// Adds blur event listener to student name entry field
  studentName.addEventListener('blur', () => {
  
    studentNameValue = studentName.value;
    validateName(studentNameValue); // calls validation method

  });

// Adds blur event listener to student id entry field
  studentID.addEventListener('blur', () => {
    
    studentIDValue = studentID.value;
    validateID(studentIDValue); // calls validation method
    
  });

 // how to insert row in HTML table --> https://www.w3schools.com/jsref/met_table_insertrow.asp
 // https://stackoverflow.com/questions/52370957/dynamically-adding-a-row-to-bottom-of-table

addNewRow = () => {

  let newRow;
  // How to target implicit tbody tag --> https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement/tBodies
  let tbody = table.tBodies

  let res = `<td class="results" contenteditable='true'>-</td>`;

  // If no new column has been added, this is the template literal for the row that will be added
  if (columnCount == 5) {

    newRow =
    `<tr class="rows">
        <td id="name" class="name">${studentNameValue}</td>
        <td id="id" class="studentID">${studentIDValue}</td>
        <td class="results" contenteditable='true'>-</td>
        <td class="results" contenteditable='true'>-</td>
        <td class="results" contenteditable='true'>-</td>
        <td class="results" contenteditable='true'>-</td>
        <td class="results" contenteditable='true'>-</td>
        <td class="average-result">-</td>
      </tr>
    `
    tbody[0].innerHTML += newRow; // adds new row to bottom of the table body

  } else { // Otherwise the following template literal will be used for a new row

    // Add new row with the same amount of columns after a new one has been added --> 
    // https://gist.github.com/wiledal/3c5b63887cc8a010a330b89aacff2f2e
    newRow =
    `<tr class="rows">
        <td id="name" class="name">${studentNameValue}</td>
        <td id="id" class="studentID">${studentIDValue}</td>
        ${Array(columnCount).fill().map((item, i) => res).join('')}
        <td class="average-result">-</td>
      </tr>
    `
    tbody[0].innerHTML += newRow; // adds new row to bottom of the table body

  }
    
  
  
  //rowArray.push(newRow);
  updateAvg();   
  }

  // Adds new row if name and id input have been validated 
addRow.addEventListener('click', () => {

  if (nameValidated && idValidated) {
    addNewRow();
  } else {
    alert("You must enter the required information to add a new row"); // Alerts the user if they try to enter an empty or invalid row
  }
});

let newRowArray = [...rows];
//newRowArray.shift();
addCol.addEventListener('click', () => { 
  
  newRowArray.forEach((row) => {
    
      const childArr = [...row.children];
      childArr.forEach((child) => {

        

       // Creating nodes for insertion --> https://www.redips.net/javascript/adding-table-rows-and-columns/
        
        let headingCell = document.createElement('th');
        let text1 = document.createTextNode(` New Assignment`);
        headingCell.appendChild(text1);
        //headingCell.setAttribute("class", "avg")
        let rowCell = document.createElement('td');
        let text2 = document.createTextNode('-');
        rowCell.appendChild(text2);
        rowCell.setAttribute("class", "results");
        rowCell.setAttribute("contenteditable", "true");
        rowCell.style.backgroundColor = "yellow";

        
        
        let refEle = childArr[childArr.length - 1];
        //console.log(refEle);
        let parentNode = refEle.parentNode;
        
        //Insert before --> https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
      if (child.className == 'avg' ) {
        parentNode.insertBefore(headingCell, refEle); // inserts cell created above before the final cell in the row
      } else if (child.className == 'average-result') {
          parentNode.insertBefore(rowCell, refEle);
     }
        
        if (child == childArr[childArr.length-1] && isNaN(child.innerHTML)) { // This sets the style if the average result is NaN due to a bad input or the value is in the process of being inputted
            child.innerHTML = '';
            childArr[childArr.length - 1].style.color = "white";
            childArr[childArr.length - 1].style.backgroundColor = "crimson";
          
        }
   
    })

    
  })
  
  columnCount++; // Increases the column count for the new rows that will be added
  //console.log(columnCount);
  
});


const clearInputText = (box) =>{
  box.value = "";
}

const validateName = (name) => {

  const re = /^[A-Za-z]{2,10}\s[A-Za-z]{2,10}$/i; // Sets regex for full name validation 
  
  if (!re.test(name)) { // Uses the test method to test to see the input matches the regex
    alert("You must enter your full name");
    clearInputText(studentName); // Clears input text box if not valid
    nameValidated = false;
  } else {
    nameValidated = true;
  }
  
}

const validateID = (id) => {

  const re = /^[0-9]{8}$/ // Assigns regex for 8 digit id number

  if (!re.test(id)) { // Uses the test method to test to see the input matches the regex
    alert("You must enter an 8 digit student number");
    clearInputText(studentID); // Clears input text box if not valid
    idValidated = false;
  } else {
    idValidated = true;
  }

}




/**I attempted to use the nested forEach loops as in previous methods but ran into a lot of bugs so instead chose to use nested for loops. This method converts the value of last cell in each row from % to a letter grade in accordance with the charts provided in the spec */

const gradeAverageLetter = () => {

  // https://stackoverflow.com/questions/3065342/how-do-i-iterate-through-table-rows-and-cells-in-javascript

  for (var i = 0, row; row = table.rows[i]; i++) {
    for (var j = 0; col = row.cells[j]; j++) {
      if (j == row.cells.length - 1) {
        if (row.cells[j].innerHTML >= 93 && row.cells[j].innerHTML <= 100) { // Check the value of the cell of the current iteration
          row.cells[j].innerHTML = 'A';
        } else if (row.cells[j].innerHTML >= 90 && row.cells[j].innerHTML <= 92) {
          row.cells[j].innerHTML = 'A-';
        } else if (row.cells[j].innerHTML >= 87 && row.cells[j].innerHTML <= 89) {
          row.cells[j].innerHTML = 'B+';
        } else if (row.cells[j].innerHTML >= 83 && row.cells[j].innerHTML <= 86) {
          row.cells[j].innerHTML = 'B';
        } else if (row.cells[j].innerHTML >= 80 && row.cells[j].innerHTML <= 82) {
          row.cells[j].innerHTML = 'B-';
        } else if (row.cells[j].innerHTML >= 77 && row.cells[j].innerHTML <= 79) {
          row.cells[j].innerHTML = 'C+';
        } else if (row.cells[j].innerHTML >= 73 && row.cells[j].innerHTML <= 76) {
          row.cells[j].innerHTML = 'C';
        } else if (row.cells[j].innerHTML >= 70 && row.cells[j].innerHTML <= 72) {
          row.cells[j].innerHTML = 'C-';
        } else if (row.cells[j].innerHTML >= 67 && row.cells[j].innerHTML <= 69) {
          row.cells[j].innerHTML = 'D+';
        } else if (row.cells[j].innerHTML >= 63 && row.cells[j].innerHTML <= 66) {
          row.cells[j].innerHTML = 'D';
        } else if (row.cells[j].innerHTML >= 60 && row.cells[j].innerHTML <= 62) {
          row.cells[j].innerHTML = 'D-';
        } else if (row.cells[j].innerHTML < 60) {
          row.cells[j].innerHTML = 'F';
        }
      }
     
    }
  }
}
    
  // This method converts the value of last cell in each row from a letter grade to a 4.0 average in accordance with the charts provided in the spec 

const gradeAverage4 = () => {
  
  for (var i = 0, row; row = table.rows[i]; i++) {
    for (var j = 0; col = row.cells[j]; j++) {
      if (j == row.cells.length - 1) {
        
        if (row.cells[j].innerHTML == 'A') { // Check the value of the cell of the current iteration
          row.cells[j].innerHTML = '4.0';
        } else if (row.cells[j].innerHTML == 'A-') {
          row.cells[j].innerHTML = '3.7';
        } else if (row.cells[j].innerHTML == 'B+') {
          row.cells[j].innerHTML = '3.3';
        } else if (row.cells[j].innerHTML == 'B') {
          row.cells[j].innerHTML = '3.0';
        } else if (row.cells[j].innerHTML == 'B-') {
          row.cells[j].innerHTML = '2.7';
        } else if (row.cells[j].innerHTML == 'C+') {
          row.cells[j].innerHTML = '2.3';
        } else if (row.cells[j].innerHTML == 'C') {
          row.cells[j].innerHTML = '2.0';
        } else if (row.cells[j].innerHTML == 'C-') {
         row.cells[j].innerHTML = '1.7';
        } else if (row.cells[j].innerHTML == 'D+') {
          row.cells[j].innerHTML = '1.3';
        } else if (row.cells[j].innerHTML == 'D') {
          row.cells[j].innerHTML = '1.0';
        } else if (row.cells[j].innerHTML == 'D-') {
          row.cells[j].innerHTML = '0.7';
        } else if (row.cells[j].innerHTML === 'F'){
          row.cells[j].innerHTML = '0.0';
        }
      }
    }
  }
    

}

// Changes the content of the heading depending on what the current content is
// Also calls the corresponding grade conversion method

gradeCol.addEventListener('click', () => { // Listens for click event on the Average column heading 

  if (gradeCol.innerHTML == 'Average [%]') {
    gradeCol.innerHTML = 'Average [Letter]';
    gradeAverageLetter();
  } else if ( gradeCol.innerHTML == 'Average [Letter]') {
    gradeCol.innerHTML = 'Average [4.0]';
    gradeAverage4();
  } else {
    gradeCol.innerHTML = 'Average [%]';
    updateAvg();
  }
});

// Method which adds the 'greenHighlight' class to the specified column onclick of the heading
// and removes it when clicked again

const highlightRow = (row) => {
  if (row.parentNode.className === 'greenHighlight') {
    row.parentNode.className = '';
  } else {
    row.parentNode.className = 'greenHighlight';
  }
};


// Method which iterates through the table and checks if the current value of i is equal to the cellIndex value of of the column passed to the method ('this'). Adds the 'greenHighlight' class to the specified column onclick of the heading and removes it when clicked again

const highlightCol = (col) => {
  
  
  for (var i = 0; i <= cells.length; i++) {

      if (i == col.cellIndex) {
        if (cells[i].className === 'greenHighlight') {
          cells[i].classList.remove('greenHighlight');
        } else {
          cells[i].className = 'greenHighlight';
        }
      }
  }
  if (col.className === 'greenHighlight') {
    col.classList.remove('greenHighlight');
  } else {
    col.className = 'greenHighlight';
  }
  //update();
};


