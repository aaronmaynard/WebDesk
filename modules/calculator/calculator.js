/*
WEBDESK TEMPLATE.JS
This template is to be used with the calculator you build. Be sure to change "calculator"
with the name of your calculator in both template.js and in the styling of template.html
*/

// Menu
function toggleSlide(target, x) { // eslint-disable-line no-unused-vars
    var el = document.getElementById(x);
    el.classList.toggle('hide');
    if (target.getAttribute('aria-expanded') === true)
        target.setAttribute('aria-expanded', false);
    else
        target.setAttribute('aria-expanded', true);
}

// Calculator

// Keys and Operators
var keys = document.querySelectorAll('.keyCalculator');
// Following code is not the most elegant, but allows future expansion of keys
var operatorsCalculator = [].slice.call(document.querySelectorAll('.operatorsCalculator'))
    .map(tagValues);
var maxLength = 17;

// Helper function for mapping of dom elements values
function tagValues(element) {
    return element.innerHTML;
}

// Variables used for calculation
var screen = document.querySelector('#screen');
var result = document.querySelector('#result');
var decimal = false; // Only on point per number allowed
var expression = ''; // Evaluated on 'operatorsCalculator' or 'equals'
var ready = true; // Identify when calculator is ready for the next expression
var equated = false; // Detect that equals is pressed
screen.innerHTML = '0';

// Mouse events

// Assigning onlick for each keys
for (var i = 0; i < keys.length; i++)
    keys[i].onclick = clicker;

// Handling any mouse click
function clicker(e) {
    calculations(this.innerHTML);
}

// Key identifiers
var wkDic = {
    65: 'AC',
    8: '&lt;',
    190: '.',
    189: '-',
    187: '=',
    13: '=',
    32: '=',
    191: '\u00F7',
    78: '√'
};

var mozDic = {
    65: 'AC',
    8: '&lt;',
    190: '.',
    173: '-',
    61: '=',
    13: '=',
    32: '=',
    191: '\u00F7',
    78: '√'
};
// Key identifiers in combination with SHIFT
var wkCombos = {
    53: '%',
    56: '\u00D7',
    187: '+'
};
var mozCombos = {
    53: '%',
    56: '\u00D7',
    61: '+'
};

// Detecting browser an assgning correct keyCalculator codes
var firefox = typeof InstallTrigger !== 'undefined';
var dictionary = firefox ? mozDic : wkDic;
var combos = firefox ? mozCombos : wkCombos;

// Key events
document.addEventListener('keydown', function(event) {
    if (event.defaultPrevented) {
        // Avoid event duplication
        return;
    }

    if (event.shiftKey && combos.hasOwnProperty(event.which)) {
        calculations(combos[event.which]);
        hover(combos[event.which]);
    } else {
        if (dictionary.hasOwnProperty(event.which)) {
            calculations(dictionary[event.which]);
            hover(dictionary[event.which]);
        } else if (!event.shiftKey && event.which > 47 && event.which < 58) {
            calculations(String(parseInt(event.which) - 48));
            hover(String(parseInt(event.which) - 48));
        }
    }
}, true);

function hover(keyCalculator) {
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].innerHTML === keyCalculator) {
            keys[i].classList.toggle('hover');
            unhover(i);
        }
    }
}

function unhover(i) {
    window.setTimeout(function() {
        keys[i].classList.toggle('hover');
    }, 500);
}
// Calculations

function calculations(pressed) {
    if (!pressed)
        return false;

    if (expression === 'Infinity')
        insert('', 0, false);

    var last = expression.slice(-1);

    // Check if clearsCalculator are pressed
    if (pressed === 'AC') {
        insert('', '0', false);
        ready = true;
    } else if (pressed === '&lt;') {
        // Check if deleted symbol is decimal point
        if (screen.innerHTML.slice(-1) === '.')
            decimal = false;
        var s = screen.innerHTML.length > 1 ? screen.innerHTML.slice(0, -1) : '0';
        insert(expression.slice(0, -1), s, decimal);
    } else if (operatorsCalculator.indexOf(pressed) > -1) {
        operations(pressed, last);
    } else if (pressed === '.') {
        // Decimal point
        if (!decimal && !equated) {
            if (expression === '' || expression === '0') {
                insert('0.', '0.', true);
            } else if (operatorsCalculator.indexOf(last) > -1 && expression.indexOf('.') < 0) {
                var shortened = expression.replace(last, '.');
                insert(shortened, shortened, true);
            } else if (ready) {
                add('0.', true, true);
            } else {
                add(pressed, true, true);
            }
            ready = false;
        }
    } else if (!(pressed === '0' && expression === '0')) {
        if (equated) {
            insert(pressed, pressed, decimal);
            equated = false;
        } else if ((screen.innerHTML === '0' && expression === '0') ||
            (screen.innerHTML === '0' && expression === '')) {
            insert(pressed, pressed, decimal);
        } else if (screen.innerHTML.length < maxLength) { // Maximum length
            add(pressed, true, decimal);
        }
        ready = false;
    }
}

// Operators helper function
function operations(pressed, last) {
    // Directly return result of the last expression
    var reg = /^(-?\d+(?:\.\d+)?)([^.0-9])(\d+(?:\.\d+)?)$/;
    var equation;
    if (expression.match(reg)) {
        var groups = reg.exec(expression);
        var num1 = parseFloat(groups[1]);
        var num2 = parseFloat(groups[3]);
        var res;

        if (groups[2] === '√') {
            equation = Math.pow(num1, 1 / num2);
        } else {
            equation = expression.replace('÷', '/')
                .replace('\u00F7', '/').replace('\u00D7', '*');
        }
        if (pressed === '%') {
            var calculated = percentage(num2, num1);
            equation.replace(new RegExp(num2 + '$'), calculated);
            pressed = '';
        }
        var finalResult = eval(equation).toString(); // eslint-disable-line no-eval
        if (!isNaN(finalResult))
            insert(finalResult, finalResult, false);
    } else if (pressed === '%') {
        // absolute percentage
        res = percentage(parseFloat(expression, 2), false).toString();
        insert(res, res, false);
        pressed = '';
    }
    // Replace last operator if necessary
    if (operatorsCalculator.indexOf(last) > -1 || last === '.')
        expression = expression.slice(0, -1);

    if (screen.innerHTML === '0' && expression === '' && pressed === '-') {
        insert(pressed, pressed, false);
    } else if (screen.innerHTML === 'Infinity') {
        insert('', '0', false);
    } else if (pressed !== '=' && !ready) {
        console.log('mehere');
        insert(expression + pressed, '0', false);
        equated = false;
    } else if (pressed === '=') {
        if (last === '×' || last === '\u00D7') {
            var num = parseFloat(expression, 5);
            res = (num * num).toString();
            insert(res, res, false);
        }
        equated = true;
    } else if (ready && expression !== '') {
        console.log('me');
        add(pressed, false, decimal);
        equated = false;
    }
    ready = true;
}

// Helpers
function percentage(num1, num2) {
    return num2 ? (num1 * num2 / 100) : (num1 / 100);
}

// Insert or add to screen
function add(keyCalculator, current, decValue) {
    // Allow calculations with result of previous calculations
    if (current)
        screen.innerHTML = ready ? keyCalculator : (screen.innerHTML + keyCalculator);

    expression += keyCalculator;
    result.innerHTML = expression;
    decimal = decValue;
}

function insert(forExpr, forScreen, decValue) {
    screen.innerHTML = forScreen.length <= maxLength ? forScreen : '0';
    expression = forExpr;

    result.innerHTML = expression;
    decimal = decValue;
}
/* ============================== INSERT CODE ABOVE THIS LINE ==============================*/

function toggleCalculator() {
    var div = document.getElementById("calculator");
    if (div.style.display == "none") {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
}

//Make the DIV element draggagle:
dragElement(document.getElementById(("calculator")));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
