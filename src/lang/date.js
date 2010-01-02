/**
 * == Language ==
 * Extensions to built-in JavaScript objects.
**/

/** section: Language
* class Date
*
* Extensions to the built-in `Date` object.
**/

/**
 * Date.DAYS -> Array
 *  
 * Full day names starting with Sunday
**/
Date.DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Date.ABBR_DAYS -> Array
 *  
 * Abbreviated day names names, three letters, starting with Sun
**/
Date.ABBR_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Date.MONTHS -> Array
 *  
 * Full month names names starting with January
**/
Date.MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 

/**
 * Date.ABBR_MONTHS -> Array
 *  
 * Abbreviated month names names, three letters, starting with Jan
**/
Date.ABBR_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; 

Date.Factory = Class.create({    
    createDate: function() {
        if(this.params['year'] != null) {
            this.params['month'] = this.params['month'] || 0;
            this.params['day'] = this.params['day'] || 1;
            this.params['hours'] = this.params['hours'] || 0;
            this.params['minutes'] = this.params['minutes'] || 0;
            this.params['seconds'] = this.params['seconds'] || 0;

            return new Date(
                this.params['year'], 
                this.params['month'], 
                this.params['day'], 
                this.params['hours'], 
                this.params['minutes'], 
                this.params['seconds']
            );
        }
        
        return null;
    },
    
    initialize: function() {
        this.params = {
            hourMode: 0
        };
    },
    
    setParam: function(key, value) {
        if(key == 'hourMode') {
            value = value.toLowerCase();
        }
        this.params[key] = value;
        
        //convert hours from 12 hours mode to 24 hours mode if required
        if((key == 'hourMode' && this.params['hours'] != null) || (key == 'hours' && this.params['hourMode'] == 1)) {
            if(this.params['hourMode'] == 'am') {
                this.params['hours'] = (this.params['hours'] == 12) ? 0 : this.params['hours'];
            } else {
                this.params['hours'] = 12 + this.params['hours'];
            }
        }
    }
});

/** section: Language
 *  Date.strptime(string, format) -> Date | null
 *  - string (string): Date string to be parsed
 *  - format (string): Format of the given date
 *  
 *  <p>Parses a date given as String according to the specified format.
 *  Returns a date object if the parsing succeeded, null otherwise. The
 *  pasring succeeds when a year definition is found. All the other parameters have
 *  default options.</p>
 *  
 *  <ul>
 *      <li>Month: 0</li>
 *      <li>Day: 1</li>
 *      <li>Hours: 0</li>
 *      <li>Minutes: 0</li>
 *      <li>Seconds: 0</li>
 *  </ul>
 *  
 *  <p>The following formatting options are supported.</p>
 *  
 *  <strong>Days</strong>
 *  <ul>
 *      <li>%d: Day of the month, 2 digits with leading zeros</li>
 *      <li>%j: Day of the month without leading zeros</li>
 *  </ul>
 *  
 *  <strong>Month</strong>
 *  <ul>
 *      <li>%F: A full textual representation of a month, such as January or March</li>
 *      <li>%m: Numeric representation of a month, with leading zeros</li>
 *      <li>%M: A short textual representation of a month, three letters</li>
 *      <li>%n: Numeric representation of a month, without leading zeros</li>
 *  </ul>
 *  
 *  <strong>Year</strong>
 *  <ul>
 *      <li>%Y: A full numeric representation of a year, 4 digits</li>
 *  </ul>
 *  
 *  <strong>Time</strong>
 *  <ul>
 *      <li>%a: Lowercase Ante meridiem and Post meridiem</li>
 *      <li>%A: Uppercase Ante meridiem and Post meridiem</li>
 *      <li>%g: 12-hour format of an hour without leading zeros</li>
 *      <li>%G: 24-hour format of an hour without leading zeros</li>
 *      <li>%h: 12-hour format of an hour with leading zeros</li>
 *      <li>%H: 24-hour format of an hour with leading zeros</li>
 *      <li>%i: Minutes with leading zeros</li>
 *      <li>%s: Seconds, with leading zeros</li>
 *  </ul>
 *  
 *  <p>Unsupported formatting options will not be parsed.</p>
 *  
 *  <h5>Example</h5>
 *  
 *      var date = Date.strptime('05 / 05 / 2009', '%m / %d / %Y');
**/
Date.strptime = function(string, format) {
    var factory = new Date.Factory(), regExp, result;
    
    format.scan(/(%([djFmMnYaAgGhHis]{1}))/, function(match) {
        switch(match[2]) {
            //day
            case 'd':
            case 'j':
                regExp = /(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])/
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    factory.setParam('day', parseInt(result));
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            //month
            case 'F':
                regExp = new RegExp('(' + Date.MONTHS.join('|') + ')');
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    var month = Date.MONTHS.indexOf(result);
                    factory.setParam('month', month); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            case 'm':
            case 'n':
                regExp = /(0[1-9]|1[1-2]|[1-9])/
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    factory.setParam('month', parseInt(result)-1); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            case 'M':
                regExp = new RegExp('(' + Date.ABBR_MONTHS.join('|') + ')');
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    var month = Date.ABBR_MONTHS.indexOf(result);
                    factory.setParam('month', month); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            //year                
            case 'Y':
                regExp = /([0-9]{4})/
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    factory.setParam('year', parseInt(result)); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            //Time
            case 'a':
            case 'A':
                regExp = /(am|AM|pm|PM)/
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    factory.setParam('hourMode', result); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            case 'g':
            case 'G':
            case 'h':
            case 'H':
                regExp = /(2[0-4]|[0-1][0-9]|[1-9])/
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    factory.setParam('hours', parseInt(result)); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            case 'i':
                regExp = /([0-5][0-9])/
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    factory.setParam('minutes', parseInt(result)); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
            
            case 's':
                regExp = /([0-5][0-9])/
                if(regExp.test(string)) {
                    result = regExp.exec(string)[1];
                    factory.setParam('seconds', parseInt(result)); 
                    string = string.replace(new RegExp(result), '');
                }
                return;
        }
    });
    
    return factory.createDate();
}

Object.extend(Date.prototype, {
    secondInMilliseconds: 1e3,
    minuteInMilliseconds: 6e4,
    hourInMilliseconds: 36e5,
    dayInMilliseconds: 864e5,
    weekInMilliseconds: 6048e5, 

    /**
     *  Date#clone() -> Date
     *
     *  Returns a copy of the given date
    **/
    clone: function() {
        return new Date(this.valueOf());
    },
    
    /**
     * Date#equalsTo(date[, depth = 5]) -> Boolean
     * - date (Date): The date object to cmpare with
     * - depth (Integer): To which depth to compare
     *  
     *  Compares the date object with the given date object.
     *  The optional parameter depth specifies how the comparison should be done, the default value is 5.
     *  * 1: compares only the year
     *  * 2: compares year and month
     *  * 3: compares year, month and day
     *  * 4: compares year, month, day and hours
     *  * 5: compares year, month, day, hours and minutes
     *  * 6: compares year, month, day, hours, minutes and seconds
     *  * 7: compares the time stamps
     *  
     *  <h5>Example</h5>
     *  
     *      var date1 = new Date(2009, 0, 1, 11, 0);
     *      var date2 = new Date(2009, 0, 1, 12, 0);
     *  
     *      //returns true
     *      date1.equalsTo(date2, 3);
     *  
     *      //returns false
     *      date1.equalsTo(date2, 5);
    **/
    equalsTo: function(date) {
        var depth = arguments[1] || 5;
        
        if(depth > 6) {
            return (this.valueOf() == date.valueOf());
        }
        
        var levels = [
            (this.getFullYear() == date.getFullYear()),
            (this.getMonth() == date.getMonth()),
            (this.getDate() == date.getDate()),
            (this.getHours() == date.getHours()),
            (this.getMinutes() == date.getMinutes()),
            (this.getSeconds() == date.getSeconds())
        ];

        var equals = true;
        for(var i = 0; i < depth; i++) {
            equals = (equals && levels[i]);
        }
        
        return equals;
    },
    
    /**
     * Date#getDayOfYear() -> Integer
     *  
     *  Returns the day of the given year
    **/
    getDayOfYear: function() {        
        return Math.ceil(this.getMillisecondsOfYear() / this.dayInMilliseconds) + 1;
    },
    
    /**
     * Date#getDaysInMonth() -> Integer
     *  
     *  Returns the number of days in the given month
    **/
    getDaysInMonth: function() {
        var days = [31,28,31,30,31,30,31,31,30,31,30,31];
        var index = this.getMonth();
        
        if(index == 1) {
            if(this.isLeapYear()) {
                return days[index] + 1;
            }
        }
        
        return days[index];
    },
    
    getFormat: function(format) {
        switch(format) {
            //day
            case 'd':
                return this._preceedWithZero(this.getDate());
            
            case 'D':
                return Date.ABBR_DAYS[this.getDay()];
            
            case 'j':
                return this.getDate();
            
            case 'l':
                return Date.DAYS[this.getDay()];
            
            case 'N':
                return (this.getDay() > 0) ? this.getDay() : 7;
                
            case 'S':
                switch(this.getDate() % 10) {
                    case 1:
                        return 'st';
                    case 2:
                        return 'nd';
                    case 3:
                        return 'rd';
                    default:
                        return 'th';
                }
            
            case 'w':
                return this.getDay();
            
            case 'z':
                return this.getDayOfYear();
            
            //week
            case 'W':
                return this.getWeekOfYear();
            
            //month
            case 'F':
                return Date.MONTHS[this.getMonth()];
            
            case 'm':
                return this._preceedWithZero(this.getMonth() + 1);
            
            case 'M':
                return Date.ABBR_MONTHS[this.getMonth()];
            
            case 'n':
                return this.getMonth() + 1;
            
            case 't':
                return this.getDaysInMonth();
            
            //year
            case 'L':
                return (this.isLeapYear()) ? 1 : 0;
            
            case 'y':
                return this._preceedWithZero(this.getFullYear() % 100);
                
            case 'Y':
                return this.getFullYear();
            
            //Time
            case 'a':
                return (this.getHours() < 12) ? 'am' : 'pm';
            
            case 'A':
                return (this.getHours() < 12) ? 'AM' : 'PM';
            
            case 'g':
                var hours = this.getHours();
                if(hours > 12) {
                    hours -= 12;
                } else if(hours == 0) {
                    hours = 12;
                }
                return hours;
            
            case 'G':
                return this.getHours();
            
            case 'h':
                return this._preceedWithZero(this.getFormat('g'));
            
            case 'H':
                return this._preceedWithZero(this.getHours());
            
            case 'i':
                return this._preceedWithZero(this.getMinutes());
            
            case 's':
                return this._preceedWithZero(this.getSeconds());
            
            case 'U':
                return Math.ceil(this.valueOf() / this.secondInMilliseconds);
        }
    },
    
    /**
     * Date#getMillisecondsOfYear() -> Integer
     *  
     *  Returns the milliseconds since January 1st of the given year
    **/
    getMillisecondsOfYear: function() {
        var firstDayOfYear = new Date(this.getFullYear(), 0, 1);
        
        return this.valueOf() - firstDayOfYear.valueOf();
    },
    
    /**
     *  Date#getSecondsOfYear() -> Integer
     *  
     *  Returns the seconds since January 1st of the given year
    **/
    getSecondsOfYear: function() {
        return Math.ceil(this.getMillisecondsOfYear() / this.secondInMilliseconds);
    },
    
    /**
     * Date#getWeekOfYear() -> Integer
     *  
     *  Returns the ISO-8601 week number of the given year
    **/
    getWeekOfYear: function() {    
        var date = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
        var dayOfWeek = date.getDay();
        var dayOfMonth = date.getDate();
        
        date.setDate(dayOfMonth - (dayOfWeek + 6) % 7 + 3);    //the nearest thursday
        var nearestInMilliseconds = date.valueOf();
        
        date.setMonth(0);
        date.setDate(4); //first thursday of the year
        var firstInMilliseconds = date.valueOf();
        
        return Math.round((nearestInMilliseconds - firstInMilliseconds) / this.weekInMilliseconds) + 1;
    },
    
    /**
     * Date#isLeapYear() -> Boolean
     *  
     *  Returns true if the year is a leap year, false otherwise.
    **/
    isLeapYear: function() {
        var year = this.getFullYear();
        
        return (
            (year % 4 == 0 && year % 100 != 0) ||
            (year % 4 == 0 && year % 100 == 0 && year % 400 == 0)
        );
    },
    
    _preceedWithSpace: function(num) {
        num = num.toString();
        return (num.length == 2) ? num : ' '+num;
    },
    
    _preceedWithZero: function(num) {
        num = num.toString();
        return (num.length == 2) ? num : '0'+num;
    },
    
    /**
     * Date#strftime(format) -> String
     * - format (string): Specifies how the date should be formatted
     *  
     *  <p>Converts the date to a string according to the given format. 
     *  The following formatting options are supported.</p>
     *  
     *  <strong>Days</strong>
     *  <ul>
     *      <li>%d: Day of the month, 2 digits with leading zeros</li>
     *      <li>%D: A textual representation of a day, three letters</li>
     *      <li>%j: Day of the month without leading zeros</li>
     *      <li>%l: A full textual representation of the day of the week</li>
     *      <li>%N: ISO-8601 numeric representation of the day of the week</li>
     *      <li>%S: English ordinal suffix for the day of the month, 2 characters (st, nd, rd or th)</li>
     *      <li>%w: Numeric representation of the day of the week</li>
     *      <li>%z: The day of the year</li>
     *  </ul>
     *  
     *  <strong>Week</strong>
     *  <ul>
     *      <li>%W: ISO-8601 week number of year, weeks starting on Monday</li>
     *  </ul>
     *  
     *  <strong>Month</strong>
     *  <ul>
     *      <li>%F: A full textual representation of a month, such as January or March</li>
     *      <li>%m: Numeric representation of a month, with leading zeros</li>
     *      <li>%M: A short textual representation of a month, three letters</li>
     *      <li>%n: Numeric representation of a month, without leading zeros</li>
     *      <li>%t: Number of days in the given month</li>
     *  </ul>
     *  
     *  <strong>Year</strong>
     *  <ul>
     *      <li>%L: Whether it's a leap year, 1 if it is a leap year, 0 otherwise</li>
     *      <li>%y: A two digit representation of a year</li>
     *      <li>%Y: A full numeric representation of a year, 4 digits</li>
     *  </ul>
     *  
     *  <strong>Time</strong>
     *  <ul>
     *      <li>%a: Lowercase Ante meridiem and Post meridiem</li>
     *      <li>%A: Uppercase Ante meridiem and Post meridiem</li>
     *      <li>%g: 12-hour format of an hour without leading zeros</li>
     *      <li>%G: 24-hour format of an hour without leading zeros</li>
     *      <li>%h: 12-hour format of an hour with leading zeros</li>
     *      <li>%H: 24-hour format of an hour with leading zeros</li>
     *      <li>%i: Minutes with leading zeros</li>
     *      <li>%s: Seconds, with leading zeros</li>
     *  </ul>
     *  
     *  <strong>Full Date/Time</strong>
     *  <ul>
     *      <li>%U: Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)</li>
     *  </ul>
     *  
     *  <p>Unsupported formatting options will not be parsed and left as they are.</p>
     *  
     *  <h5>Example</h5>
     *      var date = new Date(2009, 5, 5, 9, 25, 22);
     *  
     *      //returns "Friday June 5th 09:25 am"
     *      date.strftime('%l %F %j%S %h:%i %a');
    **/
    strftime: function(format) {
        var params = [];
        format.scan(/(%([dDjlNwzSWFmMntLyYaAgGhHisU]{1}))/, function(match) {
            match[1] = this.getFormat(match[2]);
            params.push(match);
        }.bind(this));
        
        params.each(function(param) {
            format = format.replace(new RegExp(param[0]), param[1]);
        });
        
        return format;
    }
});