/*jQuery(document).ready(function($) {
  $(".document").click(function() {
    window.location = $(this).data("href");
  });
});*/
const id = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)

const table = document.querySelector('.uploads');
const photos = document.querySelector('.photos');

const addPhoto = (photo) => {
  const a = document.createElement('a');
  a.href = photo.document_location;
  a.setAttribute('data-lightbox', 'photo');
  a.setAttribute('data-tile', photo.document_name);
  const img = document.createElement('img');
  img.src = photo.document_location;
  a.appendChild(img);

  photos.appendChild(a);


};

const addDocuments = (documents) => {
  table.innerHTML = `<tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Upload date</th>
                     </tr>`;
  //TODO: add map for mime types and corrent download href
  documents.forEach((doc) => {
    if (doc.document_mime.startsWith('image/')) {
      addPhoto(doc);
    } else {
      //create table rows
      const tr = document.createElement('tr');
      tr.className = 'document';
      tr.innerHTML += `<td>${doc.document_name}</td>
                     <td>${doc.document_mime}</td>
                     <td>${doc.start_timestamp}</td>`

      tr.addEventListener('click', () => {
        window.location.href = doc.document_location;
      });
      table.appendChild(tr);
    }
  });


};

const getDocuments = async () => {
  const response = await fetch('/document/' + id);
  const docs = await response.json();

  addDocuments(docs);
};

const commentForm = document.querySelector('#addCommentForm');
commentForm.addEventListener('submit', async event => {
  event.preventDefault();
  const json = {};
  const formData = new FormData(event.target);
  formData.forEach((value, key) => {
    json[key] = value;
  });
  json['storyId'] = id;
  try {
    const response = await fetch("/comment", {
      method: "POST",
      body: JSON.stringify(json),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      location.reload();
    }
    if (response.status === 401) {
      //loginError.style.display = "block";
    }
  } catch (error) {
    console.error(error);
    //loginError.style.display = "block";
    //loginError.innerText = "Service is down. Please try again later."
  }
});

getDocuments();