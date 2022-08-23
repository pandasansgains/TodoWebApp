



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


function colorCalendarDelayed(){

    setTimeout(colorDaysCalendar, 10);

}







function setToday(){

    var today = new Date();
    myCalender._setDate(today.getFullYear(), today.getMonth());

}


function submit(){

    colorCalendarDelayed();

}


// converts 
function dateConverter(day, month, year){

    let sDay;
    let sMonth;
    let sYear;

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
function colorDaysCalendar(dateArray){ // we do not use value of calendar as it is value of selected date

    console.log("called");
    // could organise data in maps for mor scalability but for now we'll just use a for loop as we will in the future ignore/delete dashboards that are before today's date or a week ago

    var sampleData = [{"date":"2022-08-01"},{"date":"2022-08-04"},{"date":"2022-08-06"},{"date":"2022-08-17"},{"date":"2022-09-02"}]

    // data format {"date":"2022-08-01"}
    sampleData.forEach(element =>{

        colorElementDay(element.date);
    
    })

}


function colorElementDay(date){

    //date
    //{"date":"2022-08-01"}

    var dates = document.getElementById("calendar-grid").childNodes;// <list> childNodes

    for( const child of dates){

        let dateObj = child.value; // can be empty for certain month

        if(dateObj !== false){

            let dateString = dateConverter(dateObj.getDate(), dateObj.getMonth(), dateObj.getFullYear());

            console.log(dateString);
            if(dateString === date){

                child.style.backgroundColor = "blue";
            }
        }
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


// make function that converts it back

//SELECT all days in id="calendar-grid"

// all real days have a value

// Select current month and year in the header

// add onclick event to navigation wrapper to Style the days

// add onclick event when also displaying the calendar ( setting visibility to none or block)

// add a today button