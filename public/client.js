document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('myForm').addEventListener('submit', submitForm);
});

async function submitForm() {

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

  function myRepeatedFunction() {
    console.log("GIF START");
  }
  let intervalId = setInterval(myRepeatedFunction, 100);
  setTimeout(function () {
    clearInterval(intervalId);
    console.log("GIF STOPPED");
  }, 5000);


  const resultContainer = document.getElementById('result')
  resultContainer.textContent = ''

  if (response.ok) {
    const jsonData = await response.json();
    console.log(jsonData);

    const message = jsonData.message
    const additionalInfo = jsonData.horoscope;
    const gptResponse = jsonData.gpt;

    let chosenSign = jsonData.sign;

    document.getElementById('result').textContent = message;
    document.getElementById('scope').textContent = additionalInfo;
    document.getElementById('gpt').textContent = gptResponse;
    console.log("--HTML updated");

    displayRandomTaroCard(chosenSign);

  } else {
    resultContainer.textContent = "Error in submitting data."
  }
}

const signApiKey = process.env.SIGNAPIKEY

async function getRandomTarotCard(chosenSign) {
  try {
    const apiURL = 'https:api.pexels.com/v1/search'
    const query = `?query=${chosenSign}&per_page=1&page=1`
    const url = new URL(apiURL + query)

    const response = await fetch(url, {
      headers: {
        Authorization: signApiKey
      }
    })

    const data = await response.json();
    if (response.ok) {
      if (data.photos.length === 0) {
        throw new Error('No photos found')
      }
      return data.photos[0].src.large
    }
  } catch (error) {
    console.log(error.message);
    return '';
  }
}

async function displayRandomTaroCard(chosenSign) {
  const imageURL = await getRandomTarotCard(chosenSign);
  document.getElementById('tarotImage').src = imageURL;
}

