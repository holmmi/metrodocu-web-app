jQuery(document).ready(function($) {
  $(".document").click(function() {
    window.location = $(this).data("href");
  });
});
const url = 'https://localhost:8000';

const table = document.querySelector('.documents');

const addPhotos = (photos) => {

}

const addDocuments = (documents) => {
  table.innerHTML = `<tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Upload date</th>
                     </tr>`;

  documents.forEach((doc) => {
    //create table rows
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    tr.innerHTML += `<td>${doc.name}</td>
                     <td>${}</td>`
    td.textContent = doc.name;
  });


}

const getDocuments = async () => {
  const response = await fetch(url + '/document' + window.location.path);
}

getDocuments();