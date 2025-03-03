window.onload = function(){
    const savedState = localStorage.getItem('current-state');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            loadState(parsedState);
        } catch (error) {
            console.error('Error parsing saved state:', error);
        }
    }
    // drawTree();
    // toggleKey();

    setTimeout(() => infoPopup('<b>Left-click + Drag</b> to Pan<br><b>Scroll</b> to Zoom',5), 1000);
};