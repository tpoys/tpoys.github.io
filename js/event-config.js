let eventsList = [];

document.getElementById('add-event-btn').addEventListener('click', function() {
    addNewDefaultEvent();
    stateHasChanged();
});

function addNewDefaultEvent(id=null) {
    let numbers = eventsList.map(e => parseInt(e.split("-")[1])).sort((a, b) => a - b);
    
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

    const eventBase = `event-${n}`;
    eventsList.push(eventBase);

    const parent = document.getElementById("events-container");
    
    const addEventBtn = document.getElementById("add-event-btn");

    rgba = getRandomColor();

    document.documentElement.style.setProperty(`--${eventBase}-color`, rgba);

    const eventLabel = `Event ${n}`;

    const eventContainer = document.createElement("div");
    eventContainer.classList.add("sub-control-container");
    eventContainer.id = `${eventBase}-container`;

    const labelContainer = document.createElement("div");

    const labelElement = document.createElement("h2");
    labelElement.id = `${eventBase}-label`;
    labelElement.textContent = eventLabel;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";  
    buttonContainer.style.alignItems = "center"; 
    buttonContainer.style.gap = "6px";        


    const renameBtn = document.createElement("button");
    renameBtn.classList.add("control-btn");
    renameBtn.id = `rename-${eventBase}-btn`;
    renameBtn.innerHTML = `<i class="fa-solid fa-pen"></i> Rename`;
    renameBtn.onclick = function() {renameLabel(`${eventBase}`);};

    const selectBtn = document.createElement("button");
    selectBtn.classList.add("control-btn");
    selectBtn.id = `make-selection-${eventBase}-btn`;
    selectBtn.innerHTML = `<i class="fa-solid fa-hand-pointer"></i> Select`;
    selectBtn.style.backgroundColor = `var(--${eventBase}-color)`;
    selectBtn.style.color = `var(--dark-grey-1)`;
    selectBtn.onclick = function() {enterSelectionMode(eventBase);};

    const customiseBtn = document.createElement("button");
    customiseBtn.classList.add("control-btn");
    customiseBtn.id = `customise-${eventBase}-btn`;
    customiseBtn.innerHTML = `<i class="fa-solid fa-palette"></i> Customise`;
    customiseBtn.style.color = `var(--${eventBase}-color)`;
    customiseBtn.onclick = function() {customiseEvent(eventBase);};
    
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("control-btn");
    deleteBtn.id = `delete-${eventBase}-btn`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.style.backgroundColor = 'transparent';
    deleteBtn.style.color = `grey`;
    deleteBtn.style.fontSize = '16px';
    deleteBtn.style.marginLeft = "auto";
    deleteBtn.onclick = function() {
        deleteEvent(eventBase);
        stateHasChanged();
    };

    document.documentElement.style.setProperty(`--${eventBase}-object-color`, rgba);
    document.documentElement.style.setProperty(`--${eventBase}-object-radius`, '50%');
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

    labelContainer.appendChild(labelElement);
    eventContainer.appendChild(labelContainer);
    buttonContainer.appendChild(renameBtn);
    buttonContainer.appendChild(customiseBtn);
    buttonContainer.appendChild(selectBtn);
    buttonContainer.appendChild(deleteBtn);
    eventContainer.appendChild(buttonContainer);

    parent.insertBefore(eventContainer, addEventBtn);
    updateProbabilityLabels();

    if(tutorialState <= 3 && tutorialState > 0){
        selectBtn.style.display = 'none';
    }
}

function deleteEvent(eventBase){
    eventsList = eventsList.filter(str => str !== eventBase);

    document.getElementById(`${eventBase}-container`).remove();

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
    let r, g, b;
    
    r = Math.floor(Math.random() * (intensity + 50));
    g = Math.floor(Math.random() * (intensity + 50));
    b = Math.floor(Math.random() * (intensity + 50));

    // make sure that the average of r, g, b is around 150 by adjusting the values accordingly
    const average = (r + g + b) / 3;
    const correctionFactor = intensity / average;

    r = Math.floor(r * correctionFactor);
    g = Math.floor(g * correctionFactor);
    b = Math.floor(b * correctionFactor);

    r = Math.min(r, 255);
    g = Math.min(g, 255);
    b = Math.min(b, 255);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}