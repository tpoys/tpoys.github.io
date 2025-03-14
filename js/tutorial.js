var tutorialState = 0;

function startTutorial(){
    blank = JSON.parse(localStorage.getItem('saved_state_Empty'));
    loadState(blank); 

    const overlay = document.createElement('div');
    overlay.style.backgroundColor = 'rgba(15,15,15,0.85)';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.height = '100%';
    overlay.style.width = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'row';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    
    const nameTag = document.createElement('div');
    nameTag.id = 'name-tag';
    nameTag.innerHTML = `<p style='font-size:20px'>Thomas Bayes</p><p style='opacity:0.5;font-weight:lighter'>Statistician & Philosopher</p>`;
    overlay.appendChild(nameTag);

    const img = document.createElement('img');
    img.src = 'images/thomas_bayes.png';
    img.id = 'thomas-bayes-big';
    overlay.appendChild(img);

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.padding = '16px';
    container.style.backgroundColor = '#eee';
    container.style.maxWidth = '25%';
    container.style.rowGap = '20px';
    container.style.marginLeft = '-8px';

    const txt = document.createElement('p');
    txt.innerHTML = `<b style='font-size:24px;'>Welcome to Visualising Bayes' Theorem.</b>`;
    txt.innerHTML += `<br><br>This project is designed as an interactive tool to help you learn, understand, and teach Bayes' Theorem and conditional probability.`;
    txt.innerHTML += `<br><br>With this tool, you can simulate custom real-world scenarios, experiment with different probabilities, and see the results dynamically.`;
    txt.style.color = 'var(--dark-grey-1)';
    txt.style.fontFamily = `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
    txt.style.fontSize = '18px';
    txt.style.fontWeight = '400';
    container.appendChild(txt);

    const start = document.createElement('button');
    start.className = 'control-btn';
    start.style.backgroundColor = 'var(--control-green)';
    start.style.color = 'white';
    start.style.fontSize = '16px';
    start.innerHTML = 'Start Tutorial';
    container.appendChild(start);

    start.addEventListener('click', function(){
        overlay.remove();
        tutorialState = 1;
        updateTutorialState();
    })

    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

function updateTutorialState(n = null){
    if(n != null){
        tutorialState = n;
    }
    switch(tutorialState){
        case 0:
            break;
        case 1:
            var x = document.getElementById('events-controls-container').getBoundingClientRect().right;
            var y = document.getElementById('input-num-objects').getBoundingClientRect().bottom;
            tutorialDialogue(x-50, y - 100, 'Start by setting the size of your population/sample here.', true, 20, 'right');
            forceFocusElement('input-num-objects');
            break;
        case 2:
            var x = document.getElementById('events-controls-container').getBoundingClientRect().right;
            tutorialDialogue(x+100, 50, `Each of the objects in this grid represents an individual sample or member of a population. Each object can be assigned an event.<br><br><b style='color:var(--control-blue)'>Left-click + drag</b> to pan<br><b style='color:var(--control-blue)'>Scroll</b> to zoom.`, false);
            undoForceFocusElement();
            break;
        case 3:
            var x = document.getElementById('events-controls-container').getBoundingClientRect().right;
            var y = document.getElementById('events-container').getBoundingClientRect().top;
            tutorialDialogue(x-10, y,
                `Here, you can create and customise a set of mutually exclusive events.<br><br> For example, these might be:<br> • <b>Has Disease</b> and <b>Doesn't Have Disease</b><br> •  or <b>Raining</b> and <b>Not Raining</b>.`,
                true, 10, 'right')
            forceFocusElement('events-container', true);
            break;
        case 4:
            var x = document.getElementById('events-controls-container').getBoundingClientRect().right;
            var y = document.getElementById('events-controls-container').getBoundingClientRect().bottom;
            tutorialDialogue(x-10, y-200,
                `For each event, you can click the <b>Select</b> button to assign a prior probability to that event (i.e. the proportion of objects assigned to that event).<br><br>Check <b>Show Probabilities</b> to see these probabilities numerically.`,
                true, 50, 'right');
            document.querySelectorAll("[id^='make-selection-'][id$='-btn']").forEach(btn => {
                btn.style.display = 'block';
            });
            break;
        case 5:
            var x = document.getElementById('navbar').getBoundingClientRect().right;
            var y = document.getElementById('navbar').getBoundingClientRect().top;
            tutorialDialogue(x+30, y,
                `Now open the Evidence tab.`,
                true, 30, 'right');
            forceFocusElement('navbar-customise');
            break;
        case 6:
            var x = document.getElementById('evidence-controls-container').getBoundingClientRect().right;
            var y = document.getElementById('evidence-controls-container').getBoundingClientRect().bottom;
            tutorialDialogue(x-10, y-200,
                `Similar to before, create and customise another set of events. These act as evidence for the priors.<br><br> For example, these might be observing a <b>positive</b> or <b> negative test result</b>.`,
                true, 50, 'right')
            forceFocusElement('evidence-container', true);
            break;
        case 7:
            var x = document.getElementById('toggle-key-btn').getBoundingClientRect().left;
            var y = document.getElementById('toggle-key-btn').getBoundingClientRect().top;
            tutorialDialogue(x, y-50,
                `Click <b><i class='fa-solid fa-key'></i></b> to show the key.<br><br>You can also hover over each object to reveal the event and evidence labels for that object.`,
                true, 20, 'left');
            undoForceFocusElement();
            document.getElementById('thomas-bayes-hand').style.marginBottom = '30px';
            document.getElementById('thomas-bayes-hand').style.transformOrigin = 'left';
            break;
        case 8:
            var x = document.getElementById('toggle-key-btn').getBoundingClientRect().left;
            var y = document.getElementById('toggle-key-btn').getBoundingClientRect().top;
            tutorialDialogue(x-30, y-75,
                `Click here to switch between<br><b>Grid View <i class='fa-solid fa-grip'></i></b> and <b>Tree View <i class='fa-solid fa-share-nodes'></i></b>.`,
                true, 35, 'left');
            document.getElementById('thomas-bayes-hand').style.marginBottom = '30px';
            document.getElementById('thomas-bayes-hand').style.transform += ' translateY(-30px)';
            break;
        case 9:
            var x = document.getElementById('toggle-key-btn').getBoundingClientRect().left;
            var y = document.getElementById('toggle-key-btn').getBoundingClientRect().top;
            hideTreeView();
            document.getElementById('toggle-view-switch').checked = false;
            tutorialDialogue(x, y,
                `Click <b><i class='fa-solid fa-floppy-disk'></i></b> to save and load different presets for the visualisation.<br><br>You can also export the visualisation and key as images.`,
                true, 20, 'left');
            document.getElementById('thomas-bayes-hand').style.marginBottom = '30px';
            break;
        case 10:
            var x = document.getElementById('navbar').getBoundingClientRect().right;
            var y = document.getElementById('navbar').getBoundingClientRect().top;
            tutorialDialogue(x, y,
                `Open the Bayes' Theorem tab.`,
                true, 40, 'right');
            forceFocusElement('navbar-bayes');
            break;
        case 11:
            var x = document.getElementById('bayes-controls').getBoundingClientRect().right;
            var y = document.getElementById('bayes-controls').getBoundingClientRect().top;
            tutorialDialogue(x, y,
                `<b>1.</b> Choose your hypothesis, <b>H</b>.<br><b>2.</b> Select the observed evidence, <b>E</b>.<br><br>Bayes' Theorem calculates the probability of the hypothesis after observing some evidence, <b>P(H|E)</b>.`,
                true, 40, 'right');
            forceFocusElement('bayes-controls');
            break;
        case 12:
            var x = document.getElementById('bf-container').getBoundingClientRect().right;
            var y = document.getElementById('bf-container').getBoundingClientRect().top;
            tutorialDialogue(x, y-30,
                `<b>Hover</b> over elements of the formula to visualise the probabilities and view the calculations.<br><br><b>Click</b> on the elements for more info in presentation view.`,
                true, 20, 'right');
            forceFocusElement('bf-container', true);
            break;
        default:
            break;
    }
}

function forceFocusElement(id, space=false){
    undoForceFocusElement();
    const el = document.getElementById(id);
    el.classList.add('force-focus');
    
    if(space){
    el.classList.add('force-focus-space');

    }
}

function undoForceFocusElement(){
    const el = document.querySelector(".force-focus");
    if(el){
        el.classList.remove('force-focus');
        if(el.classList.contains('force-focus-space')){
            el.classList.remove('force-focus-space');

        }
    }
}

function tutorialDialogue(x, y, text='', showHand=true, handOrientation=10,textPosition='right') {
    const maxStep = 12;
    let container = document.getElementById('tutorial-dialogue-container');
    let img = document.getElementById('thomas-bayes-img');
    let hand = document.getElementById('thomas-bayes-hand');
    let main = document.getElementById('tutorial-dialogue-main');
    let txt = document.getElementById('tutorial-dialogue-text');
    let step = document.getElementById('tutorial-step-num');
    let previous = document.getElementById('tutorial-previous-btn');
    let next = document.getElementById('tutorial-next-btn');
    let exit = document.getElementById('exit-tutorial-btn');

    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'tutorial-dialogue-container';

        const newHand = document.createElement('img');
        newHand.id = 'thomas-bayes-hand';
        newHand.src = 'images/thomas_bayes_hand.png';
        newContainer.appendChild(newHand);

        const newImg = document.createElement('img');
        newImg.id = 'thomas-bayes-img';
        newImg.src = 'images/thomas_bayes.png';
        newContainer.appendChild(newImg);

        const newMain = document.createElement('div');
        newMain.id = 'tutorial-dialogue-main';
        newContainer.appendChild(newMain);

        const newStep = document.createElement('div');
        newStep.id = 'tutorial-dialogue-step-container';

        const previousStep = document.createElement('button');
        previousStep.classList.add('progress-btn');
        previousStep.id = 'tutorial-previous-btn';
        previousStep.innerHTML = `<i class="fa-solid fa-circle-chevron-left"></i>`;
        newStep.appendChild(previousStep);
        previousStep.addEventListener('click', function(){
            tutorialState = Math.max(1, tutorialState-1);
            updateTutorialState();
        })

        const stepTxt = document.createElement('p');
        stepTxt.id = 'tutorial-step-num';
        newStep.appendChild(stepTxt);

        const nextStep = document.createElement('button');
        nextStep.classList.add('progress-btn');
        nextStep.id = 'tutorial-next-btn';
        nextStep.innerHTML = `<i class="fa-solid fa-circle-chevron-right"></i>`;
        newStep.appendChild(nextStep);
        nextStep.addEventListener('click', function(){
            tutorialState = Math.min(maxStep, tutorialState+1);
            updateTutorialState();
        })

        newMain.appendChild(newStep);

        const newTxt = document.createElement('p');
        newTxt.id = 'tutorial-dialogue-text';
        newMain.appendChild(newTxt);

        const newExit = document.createElement('button');
        newExit.id = 'exit-tutorial-btn';
        newExit.innerHTML = `Exit Tutorial`;
        newExit.onclick = exitTutorial;
        newMain.appendChild(newExit);

        document.body.appendChild(newContainer);

        container = newContainer;
        img = newImg;
        hand = newHand;
        main = newMain;
        txt = newTxt;
        step = stepTxt;
        previous = previousStep;
        next = nextStep;
        exit = newExit;
    }

    if(tutorialState == 1){
        previous.style.opacity = 0.25;
    }
    else{
        previous.style.opacity = 1;
    }

    if(tutorialState == maxStep){
        next.style.opacity = 0.25;
        exit.innerHTML = 'End Tutorial';
    }
    else{
        next.style.opacity = 1;
        exit.innerHTML = 'Exit Tutorial';
    }

    txt.innerHTML = text;
    step.innerHTML = `<b style='color:black'>${tutorialState}</b> / ${maxStep}`

    if(textPosition == 'right'){
        container.insertBefore(img, main);
        container.insertBefore(hand, img);
        container.style.transform = 'translateX(0)';
        img.style.transform = 'scaleX(1)';
        hand.style.transformOrigin = 'center';
        hand.style.transform = 'scaleX(1) translateX(0)';
        hand.style.marginLeft = 0;
        hand.style.marginRight = '-5px';
        hand.style.marginBottom = 0;


    }
    else{
        container.insertBefore(img, hand);
        container.insertBefore(main, img);
        container.style.transform = 'translateX(-100%)';
        img.style.transform = 'scaleX(-1)';
        hand.style.transformOrigin = 'center';
        hand.style.transform = 'scaleX(-1) translateX(-100%)';
        hand.style.marginLeft = '-5px';
        hand.style.marginRight = 0;


    }
    container.style.left = `${x}px`;
    
    container.style.top = `${y}px`;

    if(showHand){
        hand.style.transformOrigin = textPosition;
        hand.style.opacity = 1;
        hand.style.transform += ` rotate(${handOrientation}deg)`;
    }
    else{
        hand.style.opacity = 0;

    }
}

function exitTutorial(){
    tutorialState = 0;
    window.location.href = 'index.html';
}