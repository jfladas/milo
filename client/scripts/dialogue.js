// Dialogue factory function
const createDialogue = (script, name) => {
    let progress = 0;
    let nxttxt = null;

    function nextDialogue() {
        if (progress >= script.length) {
            nxttxt = null; // End of dialogue
        } else {
            nxttxt = script[progress];
        }
        progress++;
        if (nxttxt != null) {
            document.getElementById("uitxt").innerText = nxttxt.text;
            if (this == aboutMilo || this == aboutShrums || this == aboutBerries || this == aboutBirds || this == aboutFlies) {
                let nowtxt = nxttxt.text;
                setTimeout(() => {
                    if (document.getElementById("uitxt").innerText == nowtxt) {
                        document.getElementById("uitxt").innerText = "";
                    }
                }, 10000);
                if (this == aboutShrums || this == aboutBerries || this == aboutBirds) {
                    secrets.day.found++;
                }
                if (this == aboutFlies) {
                    secrets.night.found++;
                }

                if (secrets.day.found == secrets.day.count && !secrets.day.uncovered.all) {
                    addSpark();
                    secrets.day.uncovered.all = true;
                }
                if (secrets.night.found == secrets.night.count && !secrets.night.uncovered.all) {
                    addSpark();
                    secrets.night.uncovered.all = true;
                }
            }
            if (nxttxt.answers) {
                questionSound.play();
                if (this == introDia && progress == 3) {
                    let input = document.createElement("input");
                    input.type = "text";
                    input.id = "input";
                    input.placeholder = "Stranger";
                    input.setAttribute("spellcheck", "false");
                    input.style.transform = "translateX(500%)";
                    input.style.transition = "transform 1s ease-in-out";
                    input.addEventListener('input', resizeInput);
                    input.addEventListener('keydown', (event) => {
                        if (event.key === "Enter") {
                            handleInput();
                            setTimeout(() => {
                                introDia.nextDialogue();
                            }, 100);
                        }
                    });
                    resizeInput.call(input); // immediately call the function
                    function resizeInput() {
                        this.style.width = this.value.length + "ch";
                    }
                    document.getElementById("inputcon").appendChild(input);
                    setTimeout(() => {
                        input.style.transform = "translateX(0)";
                    }, 100);
                    setTimeout(() => {
                        input.focus();
                    }, 1100);
                }
                for (let i = 0; i < nxttxt.answers.length; i++) {
                    let btn = document.createElement("button");
                    btn.innerText = nxttxt.answers[i];
                    btn.id = name + "_btn_" + progress + "_" + i;
                    btn.onclick = () => {
                        handleClick(btn.id);
                    }
                    btn.style.transform = "translateX(500%)";
                    btn.style.transition = "transform 1s ease-in-out";
                    document.getElementById("inputcon").appendChild(btn);
                    setTimeout(() => {
                        btn.style.transform = "translateX(0)";
                    }, 100);
                }
            } else {
                statementSound.play();
            }
        } else {
            document.getElementById("uitxt").innerText = "";
            if (this == introDia || this == riverDia) {
                start();
            } else if (this == endDia) {
                //TODO: end game
            }
        }

        function handleClick(id) {
            switch (id) {
                case "intro_btn_3_0": // Name input
                    handleInput();
                    break;
                case "intro_btn_5_0": // Yes
                    addSpark();
                    break;
                case "intro_btn_5_1": // No
                    changeNext("...");
                    setTimeout(() => {
                        window.location.href = "gameover.html";
                    }, 500);
                    //TODO: gameover
                    break;
                case "river_btn_4_0": // Yes
                    addSpark();
                    break;
                case "river_btn_4_1": // No
                    changeNext("That's okay! Let's just continue our journey then,  it's getting pretty dark already anyways...");
                    break;
                case "river_btn_5_0": // Enjoy the present (bad)
                case "river_btn_6_1": // Don't worry (bad)
                    break;
                case "river_btn_5_1": // Small gesture (good)
                case "river_btn_6_0": // Support and listen (good)
                    player.sympathy++;
                    break;
                case "river_btn_7_1": // Be there for them (good)
                    player.sympathy++;
                case "river_btn_7_0": // Focus on yourself (bad)
                    changeNext("Thanks for sharing your thoughts, " + player.name + "! Let's keep exploring, shall we? It's getting pretty dark already...");
                    setTimeout(() => {
                        if(player.sympathy >= 3) {
                            addSpark();
                        }
                    }, 500);
                    break;
                default:
                    break;
            }
            if (document.getElementById(name + "_btn_" + progress + "_0")) {
                document.getElementById(name + "_btn_" + progress + "_0").hidden = true;
            }
            if (document.getElementById(name + "_btn_" + progress + "_1")) {
                document.getElementById(name + "_btn_" + progress + "_1").hidden = true;
            }
            nextDialogue();
            if (id == "river_btn_4_1") {
                changeNext(null);
            }
        }

        function handleInput() {
            document.getElementById("input").hidden = true;
            if (document.getElementById("intro_btn_" + progress + "_0")) {
                document.getElementById("intro_btn_" + progress + "_0").hidden = true;
            }
            player.name = document.getElementById("input").value;
            let text = "Nice to meet you, " + player.name + "! That's a lovely name!";
            switch (player.name.toLowerCase().replace(/\s/g, '')) {
                case "":
                case "stranger":
                    player.name = "Stranger";
                    text = "You don't wanna tell me? Thats okay...";
                    break;
                case "milo":
                    text = "Hey, that's my name! Don't steal it! Just kidding, I'm happy to share it with you!";
                    break;
                case "jfladas":
                    text = "That's a weird name... Sounds like an acronym... I wonder what it stands for...";
                    break;
                case "lukas":
                    text = "That name sounds familiar... It's like I've heard it before... Oh well! Nice to meet you!";
                    break;
                case "marin":
                    text = "Marin, du bisch toll <3";
                    break;
                case "cathy":
                case "caterina":
                case "maude":
                    text = "Hi " + player.name + "! I like your tattoos!";
                    break;
                case "angelika":
                case "angel":
                case "angi":
                case "elias":
                case "lisa":
                    text = "Konnichiwa " + player.name + "-san! Ogenki desu ka?";
                    break;
                case "marc":
                    text = "Hey " + player.name + "! I heard you are a great teacher!";
                    break;
                case "remo":
                    text = "Remoooo! (^_^)/";
                    break;
                case "tim":
                    text = "Tim! Let's *smash* this adventure together!";
                    break;
                case "api":
                case "apisana":
                    text = "What an honor to meet the Tekken Master " + player.name + " herself! I'm a big fan!";
                    break;
                case "silvan":
                    text = "What does the fox say, " + player.name + "?";
                    break;
                case "tamara":
                case "moon":
                case "cherry":
                case "dorjee":
                case "blossom":
                    text = "What a beautiful name, " + player.name + "! The *universe* is telling me that we are going to have a great time together!";
                    break;
                case "nick":
                case "annina":
                case "ardit":
                case "arwen":
                case "baramee":
                case "chiara":
                case "dario":
                case "jan":
                case "jennifer":
                case "jules":
                case "julian":
                case "laura":
                case "marco":
                case "michelle":
                case "mike":
                case "nika":
                case "rico":
                case "riggo":
                case "sawmi":
                case "sawmiya":
                case "sebi":
                case "sebastian":
                case "stefan":
                case "yanis":
                case "yannick":
                    text = "Oh, hello " + player.name + "! Have we met before? Anyway, ready to ideate our way to greatness together?";
                    break;
                case "pia":
                case "peter":
                case "andrea":
                case "monika":
                    text = "Hey there " + player.name + "! You seem very *familiar*...";
                    break;
                case "kuromi":
                    text = "hi bitch. ikusou(?) bitch.";
                    break;
            }
            changeNext(text);
            if (player.name != "Stranger") {
                addSpark();
            }

            //TODO: player data with post (or get)

            /*
            let url = "http://127.0.0.1:3000/player/?name=" + player.name;
            fetch(url)
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.log(error));
            */
            
            /*
            fetch("http://127.0.0.1:3000/post", {
                method: "POST",
                mode: 'no-cors',
                body: JSON.stringify({
                    userId: 1,
                    title: "Fix my bugs",
                    completed: false
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(response => response.text()) // Parse response as text
                .then(text => console.log(text)) // Log the text response
                .catch(error => console.log("Error: " + error));
                */
        }
    }

    function changeNext(txt) {
        if (txt == null) {
            script[progress] = null;
        } else {
            if (script[progress].answers) {
                script[progress].answers = null;
            }
            script[progress].text = txt;
        }
    }

    return {
        nextDialogue,
        getType: function() {
            if (script[progress-1].answers) {
                return "question";
            } else {
                return "statement";
            }
        },
        changeNext,
        getName: () => name
    };
};

function getCurrentDialogue() {
    let dialogue;
    switch (scene) {
        case 0:
        case 1:
            dialogue = introDia;
            break;
        case 2:
            dialogue = riverDia;
            break;
        case 3:
            dialogue = endDia;
            break;
        default:
            break;
    }
    return dialogue;
}

const introDia = createDialogue([
    { text: "Hey there! I'm Milo, your cheerful explorer buddy!" },
    { text: "I love spending time with kind folks like you, and I'm thrilled to embark on this adventure together!" },
    { text: "Oh, and what's your name, friend? I'd love to know!", answers: ["...is my Name"] },
    { text: "You don't wanna tell me? Thats okay..." },
    { text: "Do you want to help me uncover the wonders of this forest?", answers: ["Yes", "No"] },
    { text: "Yay! Thank you! This is going to be so fun!" },
    { text: "Click on interesting things to hear me share little tales about them. Exploring the woods together with you would make me very happy!" },
    { text: "And don't forget, scrolling moves us forward or backward. Let's make today unforgettable!" },
], "intro");
const aboutMilo = createDialogue([
    { text: "Oh, me? Well, I'm Milo, the friendly fox. I've roamed these woods for as long as I can remember, always on the lookout for new adventures and hidden secrets." },
], "milo");
const aboutShrums = createDialogue([
    { text: "Ah, mushrooms! Each one holds a mystery, from the delicious to the poisonous, even those that glow. They're like hidden treasures in the forest." },
    { text: "These fungi, small yet significant, emerge from the shadows, reminding us of beauty in darkness." },
    { text: "Like time's guardians, the shrooms silently witness nature's rhythm. Every little instance may shape our journey." }
], "shrum");
const aboutBerries = createDialogue([
    { text: "Berries, nature's sweet jewels, each one a tiny burst of flavor. They are like the little joys life offers, waiting to be savored." }
], "berries");
const aboutBirds = createDialogue([
    { text: "Look at those birds, dancing across the sky! Each one is like a fleeting moment of freedom and grace. This reminds me to be grateful for these experiences." }
], "birds");
const aboutFlies = createDialogue([
    { text: "Wow, fireflies! They're like little stars dancing in the night, lighting up the darkness with their enchanting glow. It's like the forest has its own constellation." }
], "flies");
//TODO: add more dialogues (...)
const riverDia = createDialogue([
    { text: "Oh, look at this! We've stumbled upon my favorite spot, the enchanting river Rami." },
    { text: "It's such a beautiful evening, isn't it? Look how the fading sunlight casts a tranquil glow over the water." },
    { text: "Rami has this way of making you stop and think, you know? It's like a gentle nudge to ponder life's mysteries." },
    { text: "So, what do you think? Do you wanna share your thoughts on some things before we continue exploring?", answers: ["Yes", "No"] },
    { text: "How can we spread kindness every day?", answers: ["Just enjoy the present!", "Even a small gesture can brighten someone's day"] },
    { text: "What can we do to make the world a better place?", answers: ["Support each other and listen without judgement", "Don't worry too much about that yet"] },
    { text: "How can we help friends see the bright side of life, even if we might not always see it ourselves?", answers: ["Focus on your own well-being before trying to help others", "Just being there for them is a great start"] },
    { text: "Thanks for sharing your thoughts! Let's keep exploring, shall we? It's getting pretty dark already..." },
], "river");
const endDia = createDialogue([
    { text: "Thank you for joining me on this adventure! I hope you enjoyed our time together." },
    { text: "Remember, the forest is always here, waiting for you to explore its wonders. Until next time, my friend!" },
], "end");