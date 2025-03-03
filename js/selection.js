let selectionMode = null;
let selectionBox = null;
let startX = 0;
let startY = 0;
let currentlySelectedObjects = new Set(); // Track selected objects

let selectionModePopup = document.getElementById('selection-mode-popup');
let navbar = document.getElementById('navbar');
let eventsControlContainer = document.getElementById('events-controls-container');
let evidenceControlContainer = document.getElementById('evidence-controls-container');
let selectionModeLabel = document.getElementById('selection-mode-label');

// Function to enter selection mode and update selection box color
function enterSelectionMode(mode) {
    selectionMode = mode;
    graphicsContainer.style.cursor = 'crosshair';
    // document.querySelectorAll('.object').forEach(el => {
    //     if (!el.classList.contains(`${mode}-object`)) {
    //         el.style.cursor = 'pointer';
    //     }
    // });
    
    selectionModePopup.style.display = 'flex';

    const icon = selectionModePopup.querySelector('i');
    icon.style.color = getModeColour(mode);
    selectionModeLabel.innerHTML = getModeLabel(mode);
    selectionModeLabel.style.color = getModeColour(mode);

    const opac = '0.2';

    // Set opacity of the container div
    eventsControlContainer.style.opacity = opac;
    eventsControlContainer.style.pointerEvents = 'none';
    evidenceControlContainer.style.opacity = opac;
    evidenceControlContainer.style.pointerEvents = 'none';
    navbar.style.opacity = opac;
    navbar.style.pointerEvents = 'none';
    const key = document.getElementById('key');
    if(key){
        key.style.opacity = opac;
        key.style.pointerEvents = 'none';
    }
    document.getElementById('options-container').style.opacity = opac;
    document.getElementById('options-container').style.pointerEvents = 'none';
    document.getElementById('presets-menu').style.opacity = opac;
    document.getElementById('presets-menu').style.pointerEvents = 'none';


    
}

function exitSelectionMode(){
    graphicsContainer.style.cursor = 'grab';
    selectionMode = null;
    selectionModePopup.style.display = 'none';

    eventsControlContainer.style.opacity = .975;
    eventsControlContainer.style.pointerEvents = 'all';
    evidenceControlContainer.style.opacity = .975;
    evidenceControlContainer.style.pointerEvents = 'all';
    navbar.style.opacity = 1;
    navbar.style.pointerEvents = 'all';
    const key = document.getElementById('key');
    if(key){
        key.style.opacity = '0.975';
        key.style.pointerEvents = 'all';
    }
    document.getElementById('options-container').style.opacity = 1;
    document.getElementById('options-container').style.pointerEvents = 'all';
    document.getElementById('presets-menu').style.opacity = 1;
    document.getElementById('presets-menu').style.pointerEvents = 'all';

}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if(selectionMode){
            exitSelectionMode();
        }
    }
});


// Mouse down event to start drawing the selection box
graphicsContainer.addEventListener('mousedown', (e) => {
    document.getElementById('selection-mode-popup').style.pointerEvents = 'none';
    if (selectionMode && e.button === 0) { // Only trigger on left-click
        startX = e.clientX;
        startY = e.clientY;

        // Create the selection box
        selectionBox = document.createElement('div');
        selectionBox.style.position = 'absolute';
        selectionBox.style.border = `2px dashed ${getModeColour(selectionMode)}`;
        selectionBox.style.backgroundColor = getModeColour(selectionMode, 0.2);
        selectionBox.style.zIndex = '100';
        graphicsContainer.appendChild(selectionBox);

        updateSelectionBox(e);
    }
});

// Mouse move event to update the size of the selection box and dynamically select objects
graphicsContainer.addEventListener('mousemove', (e) => {
    if (selectionBox) {
        updateSelectionBox(e);
    }
});

// Mouse up event to finalize selection
graphicsContainer.addEventListener('mouseup', () => {
    if (selectionBox) {
        updateDynamicSelection();

        graphicsContainer.removeChild(selectionBox);
        selectionBox = null;
        graphicsContainer.style.cursor = 'crosshair';
        // selectionMode = null;
        currentlySelectedObjects.clear(); // Reset tracking
    }
    document.getElementById('selection-mode-popup').style.pointerEvents = 'all';

});

// Function to update the selection box size and position
function updateSelectionBox(e) {
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const width = Math.abs(e.clientX - startX);
    const height = Math.abs(e.clientY - startY);

    selectionBox.style.left = `${x}px`;
    selectionBox.style.top = `${y}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
}

// Function to update selection dynamically as the mouse moves
function updateDynamicSelection() {
    const selectionRect = selectionBox.getBoundingClientRect();
    const allObjects = document.querySelectorAll('.object');

    // Track objects that need to be updated
    const newlySelectedObjects = new Set();

    allObjects.forEach((object) => {
        const objectRect = object.getBoundingClientRect();
        
        // Check if the object intersects with the selection box
        const isIntersecting =
            selectionRect.left < objectRect.right &&
            selectionRect.right > objectRect.left &&
            selectionRect.top < objectRect.bottom &&
            selectionRect.bottom > objectRect.top;

        if (isIntersecting) {
            newlySelectedObjects.add(object);
            // Apply selection if not already selected
            if (!currentlySelectedObjects.has(object)) {
                applySelectionMode(object);
                currentlySelectedObjects.add(object);
            }
        } else {
            // Remove selection if object was previously selected but is no longer intersecting
            if (currentlySelectedObjects.has(object)) {
                undoSelectionMode(object);
                currentlySelectedObjects.delete(object);
            }
        }
    });
}

// Function to determine the color of the selection box border
function getModeColour(mode, opacity = null) {
    const rgba = document.documentElement.style.getPropertyValue(`--${mode}-color`).trim();

    if(opacity == null){
        return rgba;
    } else {
        const rgbaMatch = rgba.match(/^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/);

        if (rgbaMatch) {
            return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
        } else {
            return rgba;
        }
    }
}


function getModeLabel(mode){
    return document.getElementById(`${mode}-label`).innerHTML;
    // let label;
    // switch (mode) {
    //     case 'A1':
    //         label = eventLabels[0];
    //         break;
    //     case 'A2':
    //         label = eventLabels[1];
    //         break;
    //     case 'B1':
    //         label = evidenceLabels[0];
    //         break;
    //     case 'B2':
    //         label = evidenceLabels[1];
    //         break;
    //     default:
    //         label = "?";
    //         break;
    // }
    // return label;
}

// Function to apply the selection mode action on the objects
function applySelectionMode(object) {
    // switch (selectionMode) {
    //     case 'A1':
    //         object.classList.add('event');
    //         // numEvent += 1;
    //         break;
    //     case 'A2':
    //         object.classList.remove('event');
    //         // numEvent -= 1;
    //         break;
    //     case 'B1':
    //         object.classList.add('positive');
    //         if(object.classList.contains("event")){
    //             // numTruePos += 1;
    //         }
    //         else{
    //             // numFalseNeg += 1;
    //         }
    //         break;
    //     case 'B2':
    //         object.classList.remove('positive');
    //         if(object.classList.contains("event")){
    //             // numTruePos -= 1;
    //         }
    //         else{
    //             // numFalseNeg -= 1;
    //         }
    //         break;
    //     default:
    //         break;
    // }
    const [type, number] = selectionMode.split('-');
    if (!type || isNaN(number)) return;
    
    // Remove any existing class of the same type (event-[n]-object or evidence-[n]-object)
    const classPattern = new RegExp(`^${type}-\\d+-object$`);
    object.classList.forEach(cls => {
        if (classPattern.test(cls)) {
            object.classList.remove(cls);
        }
    });
    
    // Add the new class
    object.classList.add(`${selectionMode}-object`);
    updateProbabilityLabels();
    stateHasChanged();
}

// Function to undo the selection mode action
function undoSelectionMode(object) {
    // switch (selectionMode) {
    //     case 'A1':
    //         object.classList.remove('event');
    //         break;
    //     case 'A2':
    //         object.classList.add('event');
    //         break;
    //     case 'B1':
    //         object.classList.remove('positive');
    //         break;
    //     case 'B2':
    //         object.classList.add('positive');
    //         break;
    //     default:
    //         break;
    // }
}

function selectIndividualObject(object){
    switch (selectionMode) {
        case 'A1':
            object.classList.add('event');
            break;
        case 'A2':
            object.classList.remove('event');
            break;
        case 'B1':
            object.classList.add('positive');
            break;
        case 'B2':
            object.classList.remove('positive');
            break;
        default:
            break;
    }
}
