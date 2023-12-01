document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('myForm').addEventListener('submit', submitForm);
});

async function submitForm() {
  // LOADING
  document.getElementById('result').textContent = "Loading...";
  // console.log(getRandomGif());
  const signGifContainer = document.getElementById('signGif')
  let tempGifURL = `/pusheenGif/${getRandomGif()}`
  document.getElementById('signGif').src = tempGifURL;
  // signGifContainer.textContent = ' Oh it will take some time to get your personal result! Enjoy a cut random sign gif!'

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const dob = document.getElementById('dob').value;

  const response = await fetch('/submit', {
    method: 'POST',
    // we are doing a post request
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ firstName, lastName, dob })
  });

  const resultContainer = document.getElementById('result')
  resultContainer.textContent = ''

  if (response.ok) {
    const jsonData = await response.json();
    console.log(jsonData);

    const message = jsonData.message
    const additionalInfo = jsonData.horoscope;
    const gptResponse = jsonData.gpt;

    let chosenSign = jsonData.sign;

    let gifURL = `/signGif/${chosenSign}.gif`
    // console.log(chosenSign);

    document.getElementById('result').textContent = message;
    document.getElementById('scope').textContent = additionalInfo;
    document.getElementById('gpt').textContent = gptResponse;
    document.getElementById('signGif').src = gifURL;
    console.log("--HTML updated");
  } else {
    resultContainer.textContent = "Error in submitting data."
  }
}

function getRandomGif() {
  const Gifs = [
    'pusheen_board.gif',
    'pusheen_harry.gif',
    'pusheen_leaf.gif',
    'pusheen_pudding.gif',
    'pusheen_zzz.gif',
    'pusheen_walk.gif'
  ];

  const randomIndex = Math.floor(Math.random() * Gifs.length);
  return Gifs[randomIndex];
}


