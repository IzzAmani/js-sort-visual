const algorithm = document.getElementById("algorithm");
const countInp  = document.getElementById("count");
const delayInp  = document.getElementById("delay");
var arr;
var delay = delayInp.value;

function initBars(len, randomize=1) {
    arr = [];

    // init the array
    for(var i=0; i < len; i++) {
        arr[i] = i;
    }
    
    if (randomize) {
        // shuffle the array
        for (i=len-1; i > 0; i--) {
            var target = Math.floor(Math.random() * (i+1));

            [ arr[i], arr[target] ]  = [ arr[target], arr[i] ];
        }
    }

    display();
}


function display(highlights = [], col="red") {
    // display the bars
    var len = arr.length;
    var txt = "";
    var width = 100/len; // fixed equal width 
    var height, color;


    for (var i=0; i < len; i++) {
        height = ((arr[i]+1) / len) * 95;

        if (highlights.find((e) => e == i)) {
            color = col;
        } else {
            color = "rebeccapurple";
        }
        txt += `
            <div class="bars" style="width: ${width}%; height: ${height}%; background-color: ${color};"> </div>
        `;
    }

    document.getElementById("main").innerHTML = txt;
}

// get bar count from user
countInp.addEventListener("change", () => {
    initBars(countInp.value);
});
// get delay
delayInp.addEventListener("change", () => {
    delay = delayInp.value;
});


// execute the sorting algorithm
function execute() {
    initBars(countInp.value);

    switch (algorithm.value) {
        case "bubble":
            var promise = bubble();
            break;

        case "selection":
            var promise = selection();
            break;

        case "insertion":
            var promise = insertion();
            break;

        case "merge":
            var promise = merge();
            break;

        case "bogo":
            var promise = bogo();
            break;
    }

    promise.then(() => {console.log("gay"); finish()});
}


// sleep func using Promise
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function bubble() {
    for (var i=0; i < arr.length - 1; i++) {
        for (var j=0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }

            await sleep(delay);
            display([j, j+1]);
        }
    }
}

async function selection() {
    for (var i=0; i < arr.length - 1; i++) {
        min = i;

        for (var j=i; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }

            await sleep(delay);
            display([j, min]);
        }

        [arr[i], arr[min]] = [arr[min], arr[i]];
 
        await sleep(delay);
        display([i, min]);
    }

}


async function insertion() {
    for (var i=1; i < arr.length; i++ ) {
        var skip = false;

        for (var j=i; j > 0; j-- ) {
            if (arr[j] < arr[j-1]) {
                [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
            } else {
                skip = true;
            }

            await sleep(delay);
            display([j, j-1]);

            if (skip) {
                break;
            }
        }
    }
}


async function merge(start=0, end=arr.length-1) {
    if (start >= end) {
        return;
    }
    var mid = Math.floor((start+end)/ 2);
 
    await merge(start, mid);
    await merge(mid+1, end);

    var left  = arr.slice(start, mid+1);
    var right = arr.slice(mid+1, end+1);
 
    var i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            arr[start + i + j] = left[i];
            i++;
        } else {
            arr[start + i + j] = right[j];
            j++;
        }

        await sleep(delay);
        display([start + i + j, start + j]);
    }

    while (i < left.length) {
        arr[start + i + j] = left[i];
        i++;
    }
    while (j < right.length) {
        arr[start + i + j] = right[j];
        j++;
    }

    display([start + i + j, start + j]);
    await sleep(delay);

    // just to show how to check for the end of recursion
    if (i + j == arr.length) {
        console.log("finished!");
    }
}


async function bogo() {
    var sorted = false;

    while (!sorted) {
        // randomize the array
        for (var i=arr.length-1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i+1) );

            [arr[i], arr[rand]] = [arr[rand], arr[i]];
        }

        sorted = true;

        // check if arr is sorted
        for (var i=0; i < arr.length-1; i++) {
            if (arr[i] > arr[i+1]) {
                sorted = false;
                break;
            }
        }
        
        var highlights = [];
        var limit = Math.random() * arr.length/10;

        for (var i=0; i < limit; i++) {
            highlights.push( Math.floor(Math.random() * arr.length-1) );
        }

        display(highlights);
        await sleep(delay);
    }
}


async function finish() {
    for (var i in arr) {
        display([i, i+1], "lime");
        await sleep(delay);
    }
}


initBars(countInp.value, 0);
