
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let zoomFactor = 1;
let rightClickStart = null;
let isRightClickMove = false;

// prevents right-click context menu from appearing when dragging
graphicsContainer.addEventListener('contextmenu', (e) => {
    if (isRightClickMove) {
        e.preventDefault();
    }
});

// right-click and drag to pan graphics
graphicsContainer.addEventListener('mousedown', (e) => {
    if (e.button === 0 && !selectionMode) {
        isDragging = true;
        offsetX = e.clientX - origin.getBoundingClientRect().left;
        offsetY = e.clientY - origin.getBoundingClientRect().top;
        graphicsContainer.style.cursor = 'grabbing';
        rightClickStart = { x: e.clientX, y: e.clientY };
        isRightClickMove = false; 
    }
});

graphicsContainer.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        origin.style.left = `${newX}px`;
        origin.style.top = `${newY}px`;

        objectsGrid.style.left = `${newX - objectsGrid.offsetWidth / 2}px`;
        objectsGrid.style.top = `${newY - objectsGrid.offsetHeight / 2}px`;

        if (Math.abs(e.clientX - rightClickStart.x) > 5 || Math.abs(e.clientY - rightClickStart.y) > 5) {
            isRightClickMove = true;
        }
    }
});

graphicsContainer.addEventListener('mouseup', () => {
    isDragging = false;
    if(!selectionMode){
        graphicsContainer.style.cursor = 'grab';
    }
    else{
        graphicsContainer.style.cursor = 'crosshair';

    }
    rightClickStart = null;
});

graphicsContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    graphicsContainer.style.cursor = 'grab';
    rightClickStart = null;
    isRightClickMove = false;
});

// scroll to zoom
graphicsContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.025;
    if (e.deltaY < 0) {
        zoomFactor += zoomSpeed;
    } else {
        zoomFactor = Math.max(zoomFactor - zoomSpeed, 0.1);
    }

    // Apply the zoom by adjusting the grid size and positioning
    objectsGrid.style.transform = `scale(${zoomFactor**2})`;
    // drawObjects();
});

function drawObjects(saved = []) {
    // saved = saveCurrentGridState();
    objectsGrid.innerHTML = '';
    numObjects = document.getElementById('input-num-objects').value

    let gridSize = Math.ceil(Math.sqrt(numObjects)); // This ensures a rough square shape
    var gap = objectsGrid.style.gap; // Space between objects adjusted for zoom
    gap = 0;
    const objectSize = 70; // Size of each object adjusted for zoom
    const gapSize = 15;
    const borderWidth = 7;
    // Adjust the grid layout
    objectsGrid.style.gridTemplateColumns = `repeat(${gridSize}, ${objectSize}px)`; // Adjust column width based on zoom
    objectsGrid.style.gridTemplateRows = `repeat(${gridSize}, ${objectSize}px)`; // Adjust row height based on zoom

    // Calculate the correct size of the grid
    const gridWidth = gridSize * (objectSize + 0) - 0; // Total width of grid
    const gridHeight = gridWidth; // Keep the grid square

    // Set grid size
    objectsGrid.style.width = `${gridWidth}px`;
    objectsGrid.style.height = `${gridHeight}px`;
    objectsGrid.style.gap = `${gapSize}px`;

    // Add objects to the grid
    for (let i = 0; i < numObjects; i++) {
        const newObject = document.createElement('div');
        if(saved[i]){
            for(let j = 0; j < saved[i].length; j++){
                newObject.classList.add(saved[i][j]);
            }
        }
        else{
            newObject.classList.add('object');
            const randEvent = eventsList[Math.floor(Math.random() * eventsList.length)];
            // console.log("rand event: " + randEvent)
            newObject.classList.add(`${randEvent}-object`);
            if(evidenceTabOpened){
                const randEvidence = evidenceList[Math.floor(Math.random() * evidenceList.length)];
                newObject.classList.add(`${randEvidence}-object`);
           
            }

        }

        newObject.addEventListener('click', (event) => {
            if(event.button == 0){
                selectIndividualObject(this);
            
            }
        });

        newObject.style.width = `${objectSize}px`;
        newObject.style.height = `${objectSize}px`;
        // newObject.style.borderWidth = `${borderWidth}px`;
        objectsGrid.appendChild(newObject);
    }

    if(gridHeight >= window.innerHeight){
        console.log("downscale grid...");
        zoomFactor =   0.65 * window.innerHeight / gridHeight;
        objectsGrid.style.transform = `scale(${zoomFactor})`;
    }

    // Get position of the origin element
    const originRect = origin.getBoundingClientRect();

    // Set position of the grid to match the origin's position
    objectsGrid.style.top = `${originRect.top + originRect.height / 2 - gridHeight / 2}px`;
    objectsGrid.style.left = `${originRect.left + originRect.width / 2 - gridWidth / 2}px`;

    updateProbabilityLabels();

}



function saveCurrentGridState(){
    const allObjects = Array.from(document.getElementsByClassName("object"));
    let gridState = [];

    allObjects.forEach((object) => {
        gridState.push(Array.from(object.classList));
    });

    return gridState;
}

const posteriorText = document.getElementById("bf-posterior");
const likelihoodText = document.getElementById("bf-likelihood");
const priorText = document.getElementById("bf-prior");
const marginalText = document.getElementById("bf-marginal");

let selectedElement = null; 

posteriorText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("posterior");
    
    objects.forEach(function(element) {
        if (!element.classList.contains(`${evidenceBase}-object`)) {
            element.classList.add('unfocus');
        }
        if(!element.classList.contains(`${eventBase}-object`)){
            // element.classList.add("hide-event");

        }
    }); 
});
likelihoodText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("likelihood");
    
    objects.forEach(function(element) {
        if (!element.classList.contains(`${eventBase}-object`)) {
            element.classList.add('unfocus');
        }
        if(!element.classList.contains(`${evidenceBase}-object`)){
            // element.classList.add("hide-evidence");

        }
    }); 
});
priorText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("prior");
    
    objects.forEach(function(element) {
        element.classList.add("hide-evidence");
        if(!element.classList.contains(`${eventBase}-object`)){
            // element.classList.add("hide-event");

        }
    }); 
});
marginalText.addEventListener("mouseenter", function(){
    const eventBase = `${hypothesisDropdown.value}`;
    const evidenceBase = `${observedDropdown.value}`;
    const objects = document.querySelectorAll('.object');
    updateHoverInfo("marginal");
    
    objects.forEach(function(element) {
        element.classList.add("hide-event")
        if(!element.classList.contains(`${evidenceBase}-object`)){
            // element.classList.add("hide-evidence");
        }
    }); 
});

document.querySelectorAll(".bf-element").forEach(element => {
    element.addEventListener("mouseleave", function() {
        if(selectedElement === element) return;
        resetGridEffects();
    });
});

function resetGridEffects(){
    selectedElement = null;
    resetHoverInfo();
    focusAllObjects();
}

let fromBayesSection = true;
document.querySelectorAll(".bf-element").forEach(element => {
    element.addEventListener("click", function() {
        selectedElement = element; 
        if(document.getElementById('bayes-controls-container').style.display != 'none'){
            fromBayesSection = true;
            document.getElementById('navbar-bayes').classList.remove('active');
            document.getElementById('bayes-controls-container').style.display = 'none';
        }
        else{
            resetGridEffects();
            selectedElement = element;
            element.dispatchEvent(new Event("mouseenter"));
            fromBayesSection = false;
        }
        document.getElementById('presentation-view-container').style.display = 'flex';
        updatePresentationView();
    });
});

function updatePresentationView(){
    const eventName = document.getElementById(`${hypothesisDropdown.value}-label`).innerText;
    const eventColor = `var(--${hypothesisDropdown.value}-color)`;
    const event = `<span style='color:${eventColor};font-weight:bold;'>${eventName}</span>`
    const evidenceName = document.getElementById(`${observedDropdown.value}-label`).innerText;
    const evidenceColor = `var(--${observedDropdown.value}-color)`;
    const evidence = `<span style='color:${evidenceColor};font-weight:bold;'>${evidenceName}</span>`
    
    const total = document.querySelectorAll('.object').length;
    const eventCount = document.querySelectorAll(`.object.${hypothesisDropdown.value}-object`).length;
    const evidenceCount =  document.querySelectorAll(`.object.${observedDropdown.value}-object`).length;
    const jointCount = document.querySelectorAll(`.object.${hypothesisDropdown.value}-object.${observedDropdown.value}-object`).length;

    const container = document.getElementById('presentation-view-container');
    container.innerHTML = '';
    const header = document.createElement('div');
    const title = document.createElement('h2');
    const description = document.createElement('p');
    description.className = 'presentation-info-text';

    const calculationContainer = document.createElement('div');
    calculationContainer.id = 'presentation-calculation-container';
    const calculationHead = document.createElement('p');
    const calculationInfo = document.createElement('div');
    calculationInfo.style = 'display:flex; flex-direction:row; align-items:center; column-gap:16px';
    const fraction = document.createElement('div');
    fraction.className = 'fraction-container';
    const infoNumerator = document.createElement('div');
    infoNumerator.style = 'display:flex; flex-direction:row; align-items:center; justify-content:center; column-gap: 0px;';
    const line = document.createElement('div');
    line.className = 'fraction-line';
    const infoDenominator = document.createElement('div');
    infoDenominator.style = 'display:flex; flex-direction:row; align-items:center; justify-content:center; column-gap: 0px;';
    const calculationResult = document.createElement('p');
    calculationResult.style.textAlign = 'center';

    const backBtn = document.createElement('button');
    backBtn.className = 'control-btn';
    backBtn.innerHTML = "<i class='fa-solid fa-arrow-left'></i> Back";
    backBtn.style.backgroundColor = 'var(--dark-grey-1)';
    backBtn.style.fontSize = '16px';
    backBtn.addEventListener('click', function(){
        // document.getElementById('navbar-bayes').click();
        if(fromBayesSection){
            document.getElementById('bayes-controls-container').style.display = 'flex';
            document.getElementById('navbar-bayes').classList.add('active');
            document.getElementById('presentation-view-container').style.display = 'none';
            resetGridEffects();
        }
        else{
            posteriorText.dispatchEvent(new Event("mouseenter"));
            posteriorText.click();
            fromBayesSection = true;
        }
    })

    if(selectedElement === priorText){
        title.innerText = "Prior Probability";
        description.innerHTML = `P(Hypothesis)<br><br>Represents the initial belief of the probability of ${event} before observing any evidence.`;
        calculationHead.innerHTML = `P(${event})`;
        infoNumerator.innerHTML = `<p>${eventCount}</p><div class='sample-object-smaller ${hypothesisDropdown.value}-object'></div>`;
        for(let i = 0; i < eventsList.length; i++){
            if(i>0){
                infoDenominator.innerHTML += `<p style='margin: 0 10px;'>+</p>`;
            }
            const eventId = eventsList[i];
            const count = document.querySelectorAll(`.object.${eventId}-object`).length;
            const html = `<p>${count}</p><div class='sample-object-smaller ${eventId}-object'></div>`;
            infoDenominator.innerHTML += html;
        }
        calculationResult.innerHTML = `= ${eventCount}/${total} ${formatAnswer(probability)}`;

    }
    else if(selectedElement === posteriorText){
        title.innerText = "Posterior Probability";
        description.innerHTML = `P(Hypothesis | Evidence)<br><br>This is what we want to calculate.</br>Represents the updated probability of ${event} given that ${evidence} has occured.`;
        calculationHead.innerHTML = `P(${event} | ${evidence})`;
        // function likelihood(){likelihoodText.click()};
        infoNumerator.innerHTML = `<p class="presentation-bayes-element" onclick="likelihoodText.click();">P(${evidence} | ${event})</p>`;
        infoNumerator.innerHTML += `<span style='margin: 0 10px; font-size:18px; opacity:0.5;'>&times</span>`;
        infoNumerator.innerHTML += `<p class="presentation-bayes-element" onclick="priorText.click()";>P(${event})</p>`;
        infoDenominator.innerHTML = `<p class="presentation-bayes-element" onclick="marginalText.click()";>P(${evidence})</p>`;
        calculationResult.innerHTML = `= (${jointCount}/${eventCount} &times ${eventCount}/${total}) / (${evidenceCount}/${total})<br><br> = ${jointCount}/${evidenceCount} <b>${formatAnswer(probability)}</b>`;

    }
    else if(selectedElement === likelihoodText){
        title.innerText = "Likelihood";
        description.innerHTML = `P(Evidence | Hypothesis)<br><br>Represents the probability of ${evidence} occuring given that ${event} is true.`;
        calculationHead.innerHTML = `P(${evidence} | ${event})`;
        infoNumerator.innerHTML = `<p>${jointCount}</p><div class='sample-object-smaller ${hypothesisDropdown.value}-object ${observedDropdown.value}-object'></div>`;
        infoDenominator.innerHTML = `<p>${eventCount}</p><div class='sample-object-smaller ${hypothesisDropdown.value}-object'></div>`;
        calculationResult.innerHTML = `= ${jointCount}/${eventCount} ${formatAnswer(probability)}`;

    }
    else if(selectedElement === marginalText){
        title.innerText = "Marginal Probability";
        description.innerHTML = `P(Evidence)<br><br>Represents the total probability of ${evidence} occuring under all possible scenarios.`;
        calculationHead.innerHTML = `P(${evidence})`;
        infoNumerator.innerHTML = `<p>${evidenceCount}</p><div class='sample-object-smaller ${observedDropdown.value}-object'></div>`;
        for(let i = 0; i < evidenceList.length; i++){
            if(i>0){
                infoDenominator.innerHTML += `<p style='margin: 0 10px;'>+</p>`;
            }
            const eventId = evidenceList[i];
            const count = document.querySelectorAll(`.object.${eventId}-object`).length;
            const html = `<p>${count}</p><div class='sample-object-smaller ${eventId}-object'></div>`;
            infoDenominator.innerHTML += html;
        }
        calculationResult.innerHTML = `= ${evidenceCount}/${total} ${formatAnswer(probability)}`;

    }
    else{
        console.log(`selected element: ${selectedElement.id}`);
    }
    const minimiseBtn = document.createElement('button');
    minimiseBtn.className = 'minimise-btn';
    minimiseBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    minimiseBtn.onclick = minimiseWindow;
    container.appendChild(minimiseBtn);
    header.appendChild(title);
    header.appendChild(description);
    container.appendChild(header);
    calculationContainer.appendChild(calculationHead);
    fraction.appendChild(infoNumerator);
    fraction.appendChild(line);
    fraction.appendChild(infoDenominator);
    calculationInfo.innerHTML = '<p>=</p>';
    calculationInfo.appendChild(fraction);
    calculationContainer.appendChild(calculationInfo);
    calculationContainer.appendChild(calculationResult);
    container.appendChild(calculationContainer);
    container.appendChild(backBtn);
}

function createFractionElement(numerators, denominators){

}

function focusAllObjects(){
    const allObjects = Array.from(document.getElementsByClassName("object"));

    allObjects.forEach((object) => {
        object.classList.remove("unfocus");
        object.classList.remove("hide-evidence");
        object.classList.remove("hide-event");

    });

}


// initialState = [["object","event-2-object"],
//                 ["object","event-2-object"],
//                 ["object","event-2-object"],
//                 ["object","event-2-object"],
//                 ["object","event-2-object"],
//                 ["object","event-2-object"],
//                 ["object","event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"],
//                 ["object", "event-1-object"]]
                
// drawObjects(initialState);