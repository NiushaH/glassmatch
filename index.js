const endPoint = "http://localhost:3000";
const frames_url = endPoint+`/api/v1/frames`;
const ratings_url = endPoint+`/api/v1/ratings`;

const addNewFrameDiv = document.querySelector("#create-frame")
const addNewFrameForm = document.querySelector("#add-frame")

const framesContainer = document.querySelector("#frames-container")

const editFrameBtn = document.querySelectorAll("#edit-frame-btn")
const updateFrameDiv = document.querySelector("#update-a-frame")
const updateFrameForm = document.querySelector("#update-entries")
const updateFrameBtn = document.querySelector("#update-frame-details")

const seeThisFramesRatingsBtn = document.querySelector("#see-ratings-btn")
const frameRatingsContainer = document.querySelector("#frame-ratings-container")
const frameRatingsInsideCardView = document.querySelector("#all-ratings")

const rateThisFrameBtn = document.querySelector("#rate-this-frame-btn")
const displayRatingForm = document.querySelector("#add-a-rating")
const newRatingsForm = document.querySelector("#ratings-form")
const ratingsShareButton = document.querySelector("#ratings-btn")

const deleteContainer = document.querySelector("#delete-a-frame")
const deleteFrameBtn = document.querySelector("#delete-frame-btn")
const deleteFrame = document.querySelector("#delete-frame")


function renderListItem(frame) {
    return `
        <div data-id="${frame.id}" id="card" class="card">
          <h2>${frame.attributes.name}</h2>
          <img class="frames" src=${frame.attributes.image_url} />
          <p><strong>Style:</strong> ${frame.attributes.style}</p>
          <p><strong>Condition:</strong> ${frame.attributes.condition}</p>
          <div class="view-all-ratings"></div>
          <button data-id="${frame.id}" class="edit-frame-btn">EDIT FRAME DETAILS</button>
          <button data-id="${frame.id}" class="see-ratings-btn">See Frame Ratings</button>
          <button data-id="${frame.id}" class="rate-this-frame-btn">RATE THIS FRAME</button>
          <button data-id="${frame.id}" class="delete-frame-btn" >DELETE</button>
          <div id="all-ratings"></div> 
        </div>
    `;
};

function renderUpdateForm(frame) {
    return `
    <form data-id=${frame.id} class="update-entries" method="PATCH">
      <h2>Update ${frame.attributes.name} Details</h2>
        <input name="name" id="name" type="text" value="" placeholder="${frame.attributes.name}">
        <input id="style" type="text" name="style" value="" placeholder="${frame.attributes.style}">
        <input id="condition" type="text" name="condition" value="" placeholder="${frame.attributes.condition}">
        <input id="image_url" type="text" name="image_url" value="" placeholder="${frame.attributes.image_url}">
      <button data-id=${frame.id} id="update-frame-details" type="submit" name="button">Update Changes to Frame</button>
    </form>
  `;
};


function renderDeleteForm(frame) {
    return `
    <p>Are you sure you want to delete this frame?</p>
    <form data-id=${frame.id} class="delete-frame" method="DELETE">
    <button id="delete-frame" type="submit" name="button">Yes, Delete This Frame</button>
    </form>
  `;
};


function renderRatings(rating) {
    return `
    <div data-id="${rating.id}" class="ratings-container">
    <p>Rating Score: ${rating.attributes.score}</p>
    <p>New Owner's Comments: ${rating.attributes.comments}</p>
    <br></br>
    `;
};


function renderRatingForm(frame) {
    return `
    <div data-id="${frame.id}" class="rating-form">
    <h2>Rate Your GlassMatch Glasses</h2>
        <form id="ratings-form" name="addRatingForm" style="text-align:center" method="POST">
            <p>Rating: <input id="score" type="integer" name="score" value="" placeholder="Rate on Scale of 1-5: 1 is best, 5 is worst"></p>
            <p>Comments: <input id="comments" type="text" name="comments" value="" placeholder="Please share your comments"></p>
            <button data-id="${frame.id}" id="ratings-btn" type="submit" name="button">SHARE MY REVIEW</button>
        </form>
    `;
};


function getFrames() {
    fetch(frames_url)
    .then((res) => res.json())
    .then((json) => {
        donatedFrames = json.data
        donatedFrames.forEach(frame => {
            framesContainer.insertAdjacentHTML("beforeend", renderListItem(frame) + "<br />")
        })
    })
    .catch(console.error);
};

getFrames();


// CREATE A NEW FRAME
addNewFrameForm.addEventListener('submit', function (e) {

    const name = e.target.querySelector('#name').value;
    const style = e.target.querySelector('#style').value;
    const condition = e.target.querySelector('#condition').value;
    const image_url = e.target.querySelector('#image_url').value;
    const donatedFrameBody = { id, name, style, condition, image_url };

    fetch(frames_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(donatedFrameBody)
    })
    .catch(console.error);
    }
)


// INTERACT WITH USER VIA FRAME CARDS
//    UPDATE A FRAME
//    DELETE A FRAME
//    SEE ALL FRAME RATINGS
//    ADD A FRAME RATING
framesContainer.addEventListener('click', e => {

    if (e.target.closest(".edit-frame-btn")) {
        const id = parseInt(e.target.dataset.id);
        const frame = donatedFrames.find(f => parseInt(f.id) === id);   
        updateFrameDiv.insertAdjacentHTML("afterbegin", renderUpdateForm(frame));
        
        updateFrameDiv.addEventListener("submit", e => {
            e.preventDefault();
            const id = parseInt(e.target.dataset.id);
            const frame = donatedFrames.find(f => parseInt(f.id) === id);   
            
            const name = e.target.querySelector('#name').value;
            const style = e.target.querySelector('#style').value;
            const condition = e.target.querySelector('#condition').value;
            const image_url = e.target.querySelector('#image_url').value;
            const bodyJSON = { name, style, condition, image_url };

            fetch(frames_url+`/${frame.id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                },
                body: JSON.stringify(bodyJSON),
                })
            .then((res) => res.json())
            .then(() => { 
                window.location.reload();
            });
        });
    }

    if (e.target.closest(".see-ratings-btn")) {
        const frame_id = parseInt(e.target.dataset.id);
        frameRatingsContainer.replaceChildren();

        // RATINGS DISPLAY ON FRAME CARD
        fetch (ratings_url)
        .then((res) => res.json())
        .then((json) => {
            allRatings = json.data
            const allRatingsForThisFrame = allRatings.filter(allRatings => parseInt(allRatings.attributes.frame.id)===frame_id)
           
            allRatingsForThisFrame.forEach((rating) => {
                framesContainer.insertAdjacentHTML("afterbegin", renderRatings(rating) + "<br />")
            });
        })
        .catch(console.error);
    }


    if (e.target.closest(".rate-this-frame-btn")) {
        const id = parseInt(e.target.dataset.id);
        const frame = donatedFrames.find(f => parseInt(f.id) === id);   
        displayRatingForm.insertAdjacentHTML("afterbegin", renderRatingForm(frame));

        // ADD A RATING TO A FRAME
        displayRatingForm.addEventListener("submit", function(e) {
        e.preventDefault()
        const frame_id = parseInt(e.target.parentElement.dataset.id);

        const scoreValue = document.getElementById('score').value;
        const commentValue = document.getElementById('comments').value;
        
        fetch(ratings_url, {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
               Accept: "application/json"
            },
            body: JSON.stringify({
            score: scoreValue,
            comments: commentValue,
            frame_id: frame_id
            })
        })
        .then((res) => {res.json()})
        .then((rating) => {
            console.log('Success!', rating)
            document.addRatingForm.reset();
        })
        .catch(console.error)
        })        
    }

    if (e.target.closest(".delete-frame-btn")) {
        e.preventDefault();
        const id = parseInt(e.target.dataset.id);
        const frame = donatedFrames.find(f => parseInt(f.id) === id);   
        deleteContainer.insertAdjacentHTML("afterbegin", renderDeleteForm(frame));
    }

    deleteContainer.addEventListener("submit", e => {
        e.preventDefault();
        const id = parseInt(e.target.getAttribute('data-id'));
        const frame = donatedFrames.find(f => parseInt(f.id) === id);   

        fetch(frames_url + "/" + frame.id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
               Accept: 'application/json',
            }})
        .then(() => { 
            window.location.reload();
        });
    })
  });