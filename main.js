const socket = io();

const chat = document.getElementById("chat-logs-wrapper")

const spin_images = [ ];
for(let i = 1; i < 9 ; i++){
    spin_images.push(document.getElementById(`img${i}`))
}

const rand_images = ['Ace of Cups.png', 'Ace of Pentacles.png', 'Ace of Swords.png', 'Ace of Wands.png', 'Death.png', 'Eight of Cups.png', 
    'Eight of Pentacles.png', 'Eight of Swords.png', 'Eight Of Wands.png', 'Five of Cups.png', 'Five of Pentacles.png', 'Five of Swords.png',
     'Five of Wands.png', 'Fortitude.png', 'Four of Cups.png', 'Four of Pentacles.png', 'Four of Swords.png', 'Four of Wands.png', 'Justice.png', 
     'King of Cups.png', 'King of Pentacles.png', 'King of Swords.png', 'King of Wands.png', 'Knight of Cups.png', 'Knight of Pentacles.png', 
     'Knight of Swords.png', 'Knight of Wands.png', 'Nine of Cups.png', 'Nine of Pentacles.png', 'Nine of Swords.png', 'Nine of Wands.png', 
     'Page of Cups.png', 'Page of Pentacles.png', 'Page of Swords.png', 'Page of Wands.png', 'Queen of Cups.png', 'Queen of Pentacles.png',
      'Queen of Swords.png', 'Queen of Wands.png', 'Seven of Cups.png', 'Seven of Pentacles.png', 'Seven of Swords.png', 'Seven of Wands.png',
       'Six of Cups.png', 'Six of Pentacles.png', 'Six of Swords.png', 'Six of Wands.png', 'Temperance.png', 'Ten of Cups.png', 'Ten of Pentacles.png',
        'Ten of Swords.png', 'Ten of Wands.png', 'The Chariot.png', 'The Devil.png', 'The Emperor.png', 'The Empress.png', 'The Fool.png', 'The Hanged Man.png',
         'The Hermit.png', 'The Hierophant.png', 'The High Priestess.png', 'The Last Judgement.png', 'The Lovers.png', 'The Magician.png', 'The Moon.png', 
         'The Star.png', 'The Sun.png', 'The Tower.png', 'The World.png', 'Three of Cups.png', 'Three of Pentacles.png', 'Three of Swords.png', 
         'Three of Wands.png', 'Two of Cups.png', 'Two of Pentacles.png', 'Two of Swords.png', 'Two of Wands.png', 'Wheel of Fortune.png']

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

const images_spin = shuffle(rand_images)
for(let i = 1; i < 9 ; i++){
    spin_images[i-1].src = `IMGS/tarot_cards/${images_spin[i-1]}`
}

const form = document.getElementById("main_form")
const sign_select = document.getElementById("signs-select")
const sign_image = document.getElementById("sign_image")
const user_name = document.getElementById("name")
const date_bday = document.getElementById("B-day")

sign_select.addEventListener('change',() => {
    const source = sign_select.options[sign_select.selectedIndex].text;
    sign_image.src = "IMGS/signs/" + source + ".png"

})

const card_img = document.getElementById("card-img")
const card_title = document.getElementById("card_title")
const card_meaning_rev = document.getElementById("card-meaning-rev")
const card_meaning_up = document.getElementById("card-meaning-up")
const card_description = document.getElementById("card-description")

form.addEventListener("submit",async  (event) => {
    event.preventDefault(); 
    await generateRandomCard();
    triggerFireEffect();
});

let done_once = false;

async function generateRandomCard(){
    
    await axios.get('https://tarotapi.dev/api/v1/cards/random?n=1')
    .then(function (response) {
        let {name,meaning_up,meaning_rev,desc} = response.data.cards[0];
        // console.log(name,meaning_up,meaning_rev,desc);
        if(name === "The Last Judgment") name = "The Last Judgement";
        if( !done_once ){
            done_once = true 
        }
        else{
            socket.emit('new-added',{user_name: user_name.value ,card_name:name})
            sign_select.selectedIndex = 0;
            user_name.value = "";
            date_bday.value = '2003-04-17';
            sign_image.src = 'IMGS/signs/aries.png';
        }
        
        card_img.src = `IMGS/tarot_cards/${name}.png`
        card_title.innerText = name;
        card_meaning_rev.innerText = meaning_rev;
        card_meaning_up.innerText = meaning_up;
        card_description.innerText = desc;
    })
    .catch(function (error) {
        console.log(`Err :${error}`)
    });

}

generateRandomCard()

const obtained_card = document.getElementById("obtained_card");

socket.on('connect', () => { });

socket.on('add-to-chat', ({user_name,card_name}) => {
    const chat = document.getElementById("chat-logs-wrapper")
    const new_log = document.createElement('div')
    new_log.classList.add('chat-log');

    const new_paragraph = document.createElement('p')
    new_paragraph.textContent = `${user_name} OBTAINED : ${card_name}`;
    const new_img = document.createElement('img')
    new_img.src = `IMGS/tarot_cards/${card_name}.png`

    new_img.addEventListener('click', () => {
        obtained_card.src = new_img.src
    })

    new_log.appendChild(new_paragraph);
    new_log.appendChild(new_img);
    
    chat.appendChild(new_log)
    
});

socket.on('disconnect', () => { });


const fireContainer = document.getElementById('fire-container');
const particlesContainer = document.getElementById('particles')
// Generate dynamic flames
for (let i = 0; i < 150; i++) {
    const flame = document.createElement('div');
    flame.classList.add('dynamic-flame');
    flame.style.left = `${i * 1.5}%`;
    flame.style.width = `${2 + Math.random()}%`;
    flame.style.height = `${40 + Math.random() * 100}%`;
    flame.style.setProperty('--i', i);
    fireContainer.appendChild(flame);
}

// Generate sparks dynamically
function createSpark() {
    const spark = document.createElement('div');
    spark.classList.add('spark');
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.animationDuration = `${0.5 + Math.random()}s`;
    spark.style.transform = `translateY(0) scale(${Math.random() * 1.2 + 0.4})`;
    particlesContainer.appendChild(spark)
    setTimeout(() => {
        spark.remove();
    }, 1000);
}

setInterval(createSpark, 30);
// Trigger fire effect
function triggerFireEffect() {
    fireContainer.style.opacity = 1
    setTimeout(() => {
        fireContainer.style.opacity = 0;
    }, 1500); 
}
