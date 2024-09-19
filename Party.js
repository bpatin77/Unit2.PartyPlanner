const COHORT = "2408-BLAKE";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;

//State
let parties=[];

async function getParties() {
  try {
    // GET the data from the internet at API_URL
    const response = await fetch(API_URL);

    // Wait for the response to be transformed into JSON
    //JSON turns fetched data into an object
    const responseObj = await response.json();
    

    // debugger;
    // always debug here to inspect the shape of the response object
    // received from the API, because every API returns a different thing
    parties = responseObj.data;
  } catch (error) {
    console.error(error);
  }
}

/** Requests API to create a new party based on the given `recipe` */
async function addParty(party) { //===MY ADDPARTY FUNCTION DOESN'T SEEM TO WORK!===
  try {
    const response = await fetch(API_URL, {
      method: "POST", //POST is used to add and return a new object in this case a new party
      // This is just boilerplate to indicate that
      // I am sending JSON over in my request
      headers: { "Content-Type": "application/json" },//parameters within headers are copied and pasted from a referece DONT NEED TO MEMORIZE!

      // The body = data I'm sending turned into a JSON string
      body: JSON.stringify(party),
    });
    // The network request might succeed, but there might be an error
    // with the request that we sent. In that case, `fetch` won't throw
    // an error, but the `response` will be not OK, and we still want
    // to throw an error.
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

/** Requests the API to update the party */
async function updateParty(party) { //1. is the the update async function(ex: updateReceipt) updating the list after a deletion/addition?
  try {
    const response = await fetch(API_URL + party.id, {
      method: "PUT",
      // This is just boilerplate to indicate that
      // I am sending JSON over in my request
      headers: { "Content-Type": "application/json" },

      // The body = data I'm sending turned into a JSON string
      body: JSON.stringify(party),
    });

    if (!response.ok) { //2. Can you explain the if (!response.ok) and is it needed if you already have the catch error?
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

/** Requests the API to delete the party with the given `id` */
async function deleteParty(id) { //3. What is the difference between party.id and id?
  try {
    const response = await fetch(API_URL + id, {
      method: "DELETE",
    });
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}
//===Render===
//4. The assignment asks for time as well, however it doesn't seem that the API has a time resource to pull from
function renderParties() {
  const $parties = parties.map((party) => {
    const $li = document.createElement("li");
    $li.innerHTML = `
      <h2>${party.name}</h2>
      <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.location}</p>
      <button>Delete</button>
    `;

    // Select the button _within_ the $li
    // This allows each button to know which party to delete
    const $button = $li.querySelector("button");
    $button.addEventListener("click", async () => {
      await deleteParty(party.id);
      await getParties(); //:After deleting a party on line 104, you need to get/return the party list updated 
      renderParties(); //since your changing the start function you need to render again
    });

    return $li;
  });

  const $ul = document.querySelector("ul");
  $ul.replaceChildren(...$parties);
}

//===Script===
async function init() {
await getParties();
renderParties();
}

init();



// Add recipe with form data when form is submitted
const $form = document.querySelector("form");
$form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // We can use `form.inputName` to reference input elements within the form
  const date = new Date($form.date.value).toISOString(); //<-has to be directly above const party
  const party = { 
    name: $form.title.value,
    description: $form.instructions.value,
    date, 
    location: $form.location.value,

  };

  // Wait for the API to add the party, then fetch the updated data & rerender
  await addParty(party);
  await getParties();
  renderParties();
});