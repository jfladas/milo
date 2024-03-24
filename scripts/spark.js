// Spark factory function
const createSpark = (elem) => {

    elem.hidden = true;

    const sparkAnim = elem.animate(null, { duration: 300, easing: 'steps(4)' });

    const animateSpark = (x, y, big = false) => {

        elem.hidden = false;
        let keyframes;
        if (big) {
            elem.style.left = x + 100 + "px";
            elem.style.top = y - 50 + "px";
            keyframes = [
                { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'scale(2) translate(0px, 0px)' },
                { clip: 'rect(0px, 192px, 96px, 96px)', transform: 'scale(2) translate(-96px, 0px)' },
                { clip: 'rect(0px, 288px, 96px, 192px)', transform: 'scale(2) translate(-192px, 0px)' },
                { clip: 'rect(0px, 384px, 96px, 288px)', transform: 'scale(2) translate(-288px, 0px)' },
                { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'scale(2) translate(0px, 0px)' }
            ];
        } else {
            elem.style.left = x - 50 + "px";
            elem.style.top = y - 50 + "px";
            keyframes = [
                { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'translate(0px, 0px)' },
                { clip: 'rect(0px, 192px, 96px, 96px)', transform: 'translate(-96px, 0px)' },
                { clip: 'rect(0px, 288px, 96px, 192px)', transform: 'translate(-192px, 0px)' },
                { clip: 'rect(0px, 384px, 96px, 288px)', transform: 'translate(-288px, 0px)' },
                { clip: 'rect(0px, 96px, 96px, 0px)', transform: 'translate(0px, 0px)' }
            ];
        }
        elem.style.zIndex = "5";
        sparkAnim.effect.setKeyframes(keyframes);
        sparkAnim.play();
    };

    sparkAnim.onfinish = () => {
        elem.hidden = true;
    };

    return { animateSpark };
};

const spark = createSpark(document.getElementById("spark"));