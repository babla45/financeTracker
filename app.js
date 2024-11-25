// Firebase Firestore references
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

// Firebase config and initialization
const firebaseConfig = {
  apiKey: "AIzaSyC3ME-vuAxlSrt0T0aoM3nqUhUkH8YpTok",
  authDomain: "finance-tracker-web-app-4e0e9.firebaseapp.com",
  projectId: "finance-tracker-web-app-4e0e9",
  storageBucket: "finance-tracker-web-app-4e0e9.appspot.com",
  messagingSenderId: "312129644648",
  appId: "1:312129644648:web:889d71a9038c6d804a33dd",
  measurementId: "G-XQ9ND6QGH7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const sectionsContainer = document.getElementById('sections-container');
const addSectionButton = document.getElementById('add-section');

// Event listener for the "Add Section" button
addSectionButton.addEventListener('click', () => {
  addSection('New Section', []); // Adds a new section with default values
});

// Reference to sections collection and load sections
const sectionsRef = collection(db, 'sections');
getDocs(sectionsRef)
  .then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      addSection(doc.id, data.data || []); // Assumes your document has a "data" field
    });
    updateGlobalTotal();
  })
  .catch(error => console.error("Error fetching sections:", error));

// Function to add a new section dynamically
function addSection(sectionName = 'New Section', data = []) {
  const section = document.createElement('section');
  section.innerHTML = `
    <h2 contenteditable="true">${sectionName}</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td contenteditable="true">${row.description}</td>
            <td contenteditable="true">${row.amount}</td>
            <td>
              <button class="delete-row">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p class="section-total">Section Total: <span>0</span></p>
    <button class="add-row">Add Row</button>
    <button class="save-section">Save Section</button>
    <button class="delete-section">Delete Section</button>
  `;
  sectionsContainer.appendChild(section);

  // Add event listeners
  section.querySelector('.add-row').addEventListener('click', () => addRow(section));
  section.querySelector('.save-section').addEventListener('click', () => saveSection(section));
  section.querySelector('.delete-section').addEventListener('click', () => deleteSection(section));
  section.querySelectorAll('[contenteditable="true"]').forEach(cell =>
    cell.addEventListener('input', () => updateSectionTotal(section))
  );

  updateSectionTotal(section); // Update total on load
}

// Other functions (addRow, updateSectionTotal, etc.) remain unchanged
// Ensure those functions are included in the script.


// Function to add a new row to a section
function addRow(section) {
  const tbody = section.querySelector('tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td>
      <button class="delete-row">Delete</button>
    </td>
  `;
  tbody.appendChild(row);

  // Add event listener for delete button
  row.querySelector('.delete-row').addEventListener('click', () => {
    row.remove();
    updateSectionTotal(section);
  });

  row.querySelectorAll('[contenteditable="true"]').forEach(cell =>
    cell.addEventListener('input', () => updateSectionTotal(section))
  );
}

// Function to update the total for a section
function updateSectionTotal(section) {
  const rows = Array.from(section.querySelectorAll('tbody tr'));
  const sectionTotal = rows.reduce((sum, row) => {
    const amount = parseFloat(row.cells[1]?.innerText.trim()) || 0;
    return sum + amount;
  }, 0);

  section.querySelector('.section-total span').innerText = sectionTotal.toFixed(2);
  updateGlobalTotal(); // Update global totals whenever a section total changes
}

// Function to update global total and actual total
function updateGlobalTotal() {
  const sectionTotals = Array.from(document.querySelectorAll('.section-total span')).map(span =>
    parseFloat(span.innerText) || 0
  );

  const globalTotal = sectionTotals.reduce((sum, total) => sum + total, 0);
  const payableSection = Array.from(document.querySelectorAll('section')).find(
    section => section.querySelector('h2').innerText.toLowerCase() === 'payable'
  );

  const payableTotal = payableSection
    ? parseFloat(payableSection.querySelector('.section-total span').innerText) || 0
    : 0;

  document.getElementById('global-total').innerText = globalTotal.toFixed(2);
  document.getElementById('actual-total').innerText = (globalTotal - payableTotal).toFixed(2);
}

// Add global total and actual total display
document.body.insertAdjacentHTML(
  'beforeend',
  `
    <p>Total Amount: <span id="global-total">0.00</span></p>
    <p>Actual Total Amount: <span id="actual-total">0.00</span></p>
  `
);
