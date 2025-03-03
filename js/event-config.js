let eventsList = [];

// const colorPresets = ['rgb(110, 203, 105)','rgb(107, 143, 219)','rgb(255, 200, 100)'];

document.getElementById('add-event-btn').addEventListener('click', function() {
    addNewDefaultEvent();
    stateHasChanged();
    // alert('Button clicked!');
});

function addNewDefaultEvent(id=null) {
    // const colorPresets = ['rgba(107, 143, 219, 1)','rgba(110, 203, 105, 1)'];
    let numbers = eventsList.map(e => parseInt(e.split("-")[1])).sort((a, b) => a - b);
    
    // Find the smallest missing number, if no id given
    let n = 1;
    if(id == null){
        for (let num of numbers) {
            if (num !== n) break;
            n++;
        }
    }
    else{
        n = id
    }

    // Add the new event
    const eventBase = `event-${n}`;
    eventsList.push(eventBase);

    const parent = document.getElementById("events-container");
    
    const addEventBtn = document.getElementById("add-event-btn");

    // Set event-specific color variable (use passed color or default)
    // if(eventsList.length<=colorPresets.length){
    //     rgba=colorPresets[eventsList.length-1];
    // }
    // else{
    //     rgba = getRandomColor();
    // }
    rgba = getRandomColor();

    document.documentElement.style.setProperty(`--${eventBase}-color`, rgba);

    // Set event-specific label (use passed label or default)
    const eventLabel = `Event ${n}`; // Use provided label or default to "Event n"

    // Create event container div
    const eventContainer = document.createElement("div");
    eventContainer.classList.add("sub-control-container");
    eventContainer.id = `${eventBase}-container`;

    // Create inner div for the label
    const labelContainer = document.createElement("div");

    // Create label (h2)
    const labelElement = document.createElement("h2");
    labelElement.id = `${eventBase}-label`;
    labelElement.textContent = eventLabel;

    // // Create probability display
    // const probabilityElement = document.createElement("p");
    // probabilityElement.id = `${eventBase}-probability-label`;
    // probabilityElement.style.marginTop = "9px";
    // probabilityElement.style.marginBottom = "9px";
    // probabilityElement.style.color = "#999";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";        // Enable Flexbox for button alignment
    buttonContainer.style.alignItems = "center";   // Align buttons vertically if needed
    buttonContainer.style.gap = "6px";            // Optional: Adds space between the buttons


    // Create Rename button
    const renameBtn = document.createElement("button");
    renameBtn.classList.add("control-btn");
    renameBtn.id = `rename-${eventBase}-btn`;
    renameBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Rename`;
    renameBtn.onclick = function() {renameLabel(`${eventBase}`);};


    // Create Select button
    const selectBtn = document.createElement("button");
    selectBtn.classList.add("control-btn");
    selectBtn.id = `make-selection-${eventBase}-btn`;
    selectBtn.innerHTML = `<i class="fa-solid fa-hand-pointer"></i> Select`;
    selectBtn.style.backgroundColor = `var(--${eventBase}-color)`;
    selectBtn.style.color = `var(--dark-grey-1)`;
    selectBtn.onclick = function() {enterSelectionMode(eventBase);};

    // Create Customise button
    const customiseBtn = document.createElement("button");
    customiseBtn.classList.add("control-btn");
    customiseBtn.id = `customise-${eventBase}-btn`;
    customiseBtn.innerHTML = `<i class="fa-solid fa-palette"></i> Customise`;
    customiseBtn.style.color = `var(--${eventBase}-color)`;
    customiseBtn.onclick = function() {customiseEvent(eventBase);};
    
    // Create Customise button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("control-btn");
    deleteBtn.id = `delete-${eventBase}-btn`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.style.backgroundColor = 'transparent';
    deleteBtn.style.color = `grey`;
    deleteBtn.style.fontSize = '16px';
    deleteBtn.style.marginLeft = "auto";  // This pushes the delete button to the right
    deleteBtn.onclick = function() {
        deleteEvent(eventBase);
        stateHasChanged();
    };

    // Create and append a style rule for the new event
    document.documentElement.style.setProperty(`--${eventBase}-object-color`, rgba);
    document.documentElement.style.setProperty(`--${eventBase}-object-radius`, '50%');
    // document.documentElement.style.setProperty(`--${eventBase}-object-image`, "url('images/water-drop-icon.svg')");
    document.documentElement.style.setProperty(`--${eventBase}-object-image`, "");
    document.documentElement.style.setProperty(`--${eventBase}-object-image-size`, '50%');

    const style = document.createElement("style");
    style.innerHTML = `
        .${eventBase}-object {
            background-color: var(--${eventBase}-object-color);
            border-radius: var(--${eventBase}-object-radius);
            background-image: var(--${eventBase}-object-image);
            background-size: var(--${eventBase}-object-image-size); 
            background-position: center;
            background-repeat: no-repeat;
        }
    `;

    document.head.appendChild(style);

    // Append elements together
    labelContainer.appendChild(labelElement);
    eventContainer.appendChild(labelContainer);
    // eventContainer.appendChild(probabilityElement);
    buttonContainer.appendChild(renameBtn);
    buttonContainer.appendChild(customiseBtn);
    buttonContainer.appendChild(selectBtn);
    // if(n>1){
    //     buttonContainer.appendChild(deleteBtn);
    // }
    buttonContainer.appendChild(deleteBtn);

    eventContainer.appendChild(buttonContainer);

    parent.insertBefore(eventContainer, addEventBtn);
    updateProbabilityLabels();


}

function deleteEvent(eventBase){
    console.log(`Delete event: ${eventBase}`);
    eventsList = eventsList.filter(str => str !== eventBase);
    console.log(`Remaining events: ${eventsList}`);

    // remove the event control widget
    document.getElementById(`${eventBase}-container`).remove();

    // set all objects of that event to a random event from remaining events
    document.querySelectorAll('.object').forEach(el => {
        const targetClass = `${eventBase}-object`;
        if (el.classList.contains(targetClass)) {
            el.classList.remove(targetClass);
            const randEvent = eventsList[Math.floor(Math.random() * eventsList.length)];
            el.classList.add(`${randEvent}-object`);
        }
    });
    updateProbabilityLabels();

    if(eventsList.length == 0){
        document.getElementById('input-num-objects').value = 0;
        document.getElementById('input-num-objects-2').value = 0;
        drawObjects();
    }
}

function deleteAllEvents(){
    while(eventsList.length > 0){
        deleteEvent(eventsList[0]);
    }

}

function getRandomColor(intensity = 175, opacity=1) {
    // Generate random values for r, g, and b such that their average is around 150
    let r, g, b;
    
    // We calculate each value based on the target intensity (around 150) with some randomness
    r = Math.floor(Math.random() * (intensity + 50));
    g = Math.floor(Math.random() * (intensity + 50));
    b = Math.floor(Math.random() * (intensity + 50));

    // Make sure that the average of r, g, b is around 150 by adjusting the values accordingly
    const average = (r + g + b) / 3;
    const correctionFactor = intensity / average;

    r = Math.floor(r * correctionFactor);
    g = Math.floor(g * correctionFactor);
    b = Math.floor(b * correctionFactor);

    // Ensure that no value exceeds 255
    r = Math.min(r, 255);
    g = Math.min(g, 255);
    b = Math.min(b, 255);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}


// window.onload = function() {
//     addNewDefaultEvent();
//     addNewDefaultEvent();
//     addNewDefaultEvidence();
//     addNewDefaultEvidence();
//     updateProbabilityLabels();
// };
