let scrl = false;

const player = {
    elem: document.getElementById("player"),
    skinElem: document.getElementById("playerSkin"),
    skinAnim: document.getElementById("playerSkin").animate(null, { duration: 500, easing: 'steps(4)' }),
    animate(scrl) {
        let keyframes = [
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
            { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' }
        ];
        if (scrl) {
            keyframes = [
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' },
                { clip: 'rect(0px, 512px, 256px, 256px)', transform: 'translate(-256px, 0px)' },
                { clip: 'rect(0px, 768px, 256px, 512px)', transform: 'translate(-512px, 0px)' },
                { clip: 'rect(0px, 1024px, 256px, 768px)', transform: 'translate(-768px, 0px)' },
                { clip: 'rect(0px, 256px, 256px, 0px)', transform: 'translate(0px, 0px)' }
            ];
        }

        this.skinAnim.effect.setKeyframes(keyframes);
        this.skinAnim.play();
    }
};

player.skinAnim.onfinish = () => {
    player.animate(scrl);
};

const scrollContainer = document.querySelector("main");
let wheelEventEndTimeout = null;
window.addEventListener('wheel', (evt) => {
    scrl = true;
    player.animate(scrl);
    scrollContainer.scrollLeft += evt.deltaY * 0.1;
    clearTimeout(wheelEventEndTimeout);
    wheelEventEndTimeout = setTimeout(() => {
        scrl = false;
        player.animate(scrl);
    }, 100);
});
