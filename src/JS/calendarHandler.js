

// TODO

// Style calendar and display it on top of other stuff
// make calendar close when we press submit

const myCalender = new CalendarPicker('#myCalendarWrapper', {

    // options here
    // add onclick event to navigationWrapper

});

document.getElementById("previous-month").onclick = function(){

    colorCalendarDelayed();
}


document.getElementById("next-month").onclick = function(){

  colorCalendarDelayed();

}



function openCalendar(){

    //form to chose date when we save 
    // give error for saving when not logged in
    

    document.getElementById("myCalendarWrapper").style.display = "block";

    colorCalendarDelayed();
}


function closeCalendar(){

    document.getElementById("myCalendarWrapper").style.display = "none";

}


function colorCalendarDelayed(){

    setTimeout(colorDaysCalendar, 10);

}



function setToday(){

    var today = new Date();
    myCalender._setDate(today.getFullYear(), today.getMonth());
    colorCalendarDelayed();

}


function submit(){

    colorCalendarDelayed();

}





// converts passing this.value
function dateConverterObj(DateObj){

    let sDay;
    let sMonth;
    let sYear;

    let day = DateObj.getDate();
    let month= DateObj.getMonth();
    let year = DateObj.getFullYear();

    if(day < 10){
        sDay = "0" + day;
    }
    else{
        sDay = String(day);
    }
    if(month < 9 ){ // month  = 0-11 -> 0 = "01" then 9 -> "10" 
        sMonth = "0" + (month + 1)
    }
    else{
        sMonth =  String(month + 1);
    }
    sYear = String(year);

    return sYear +"-" + sMonth +"-" + sDay

}

/**
 * 
 * @param {Array} dateArrays an array of dates where a dashboard is saved 
 * 
 */
function colorDaysCalendar(){ // we do not use value of calendar as it is value of selected date

    clearDatesColor();

    if(availablePlannings !== null){

        // data format {"date":"2022-08-01"}
        availablePlannings.forEach(element =>{

            colorElementDay(element.date);
        
        })

    }

 

}


function colorElementDay(date){

    //date
    //{"date":"2022-08-01"}

    var dates = document.getElementById("calendar-grid").childNodes;// <list> childNodes

    for( const child of dates){

        let dateObj = child.value; // can be empty for certain month

        if(dateObj !== false){

            let dateString = dateConverterObj(dateObj);

            if(dateString === date){

                child.style.backgroundColor = "blue";
                return true;
            }
           
        }
    }
    return false;// false if no objects have been found in current loaded
                // page of calendar to have matching date
  
}



function clearDatesColor(){

    //date
    //{"date":"2022-08-01"}

    var dates = document.getElementById("calendar-grid").childNodes;// <list> childNodes

    for( const child of dates){

        child.style.backgroundColor = "white";
        
    }
  
}




// might be used later
// Takes a monthName and returns its number (January -> "01");
function monthToNumeral(monthName){

    const monthToNumerals = new Map([
        ["january" , "01"],
        ["february" , "02"],
        ["march" , "03"],
        ["august" , "04"],
        ["may" , "05"],
        ["june" , "06"],
        ["july" , "07"],
        ["august" , "08"],
        ["september" , "09"],
        ["october" , "10"],
        ["november" , "11"],
        ["december" , "12"],
    ])

    return monthToNumerals.get(monthName.toLowerCase()); 

}
