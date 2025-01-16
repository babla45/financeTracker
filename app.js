// Firebase Firestore references
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

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

// Add a "Save All Sections" button at the end of the page
document.body.insertAdjacentHTML(
  'beforeend',
  `<button id="save-all-sections">Save All Sections</button>`
);
const saveAllButton = document.getElementById('save-all-sections');

// Update the total displays HTML structure
document.body.insertAdjacentHTML(
  'beforeend',
  `
    <div class="fixed bottom-0 left-0 w-full bg-gray-800 dark:bg-gray-900 p-4 shadow-lg text-center">
      <div class="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8">
        <p class="text-2xl font-bold text-white">Total Amount: <span id="global-total" class="text-green-400">0.00</span> tk</p>
        <p class="text-2xl font-bold text-white">Actual Total Amount: <span id="actual-total" class="text-blue-400">0.00</span> tk</p>
      </div>
    </div>
  `
);

// Event listener for the "Add Section" button
addSectionButton.addEventListener('click', () => {
  const uniqueSectionName = `New Section - ${Date.now()}`; // Unique name for new sections
  addSection(uniqueSectionName, []); // Adds a new section with default values
});

// Event listener for the "Save All Sections" button
saveAllButton.addEventListener('click', saveAllSections);

// Reference to sections collection and load sections
const sectionsRef = collection(db, 'sections');
getDocs(sectionsRef)
  .then(snapshot => {
    sectionsContainer.innerHTML = ''; // Clear existing sections
    snapshot.forEach(doc => {
      const data = doc.data();
      addSection(doc.id, data.data || []); // Recreate sections dynamically
    });
    updateGlobalTotal();
  })
  .catch(error => console.error('Error fetching sections:', error));

// Function to add a new section
function addSection(sectionName = 'New Section', data = []) {
  const section = document.createElement('section');
  section.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 transition-colors text-center';
  section.innerHTML = `
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center" contenteditable="true">${sectionName}</h2>
    <div class="overflow-x-auto rounded-lg shadow-lg">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-opacity-75 backdrop-blur-sm">Description</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-opacity-75 backdrop-blur-sm">Amount</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-opacity-75 backdrop-blur-sm">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          ${data.map(row => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 text-center" contenteditable="true">${row.description}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 text-center" contenteditable="true">${row.amount}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button class="delete-row bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition-all hover:shadow-md">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <p class="section-total mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">Section Total: <span>0</span></p>
    <div class="mt-4 space-x-2">
      <button class="add-row bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">Add Row</button>
      <button class="delete-section bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">Delete Section</button>
    </div>
  `;
  sectionsContainer.appendChild(section);

  // Event listeners for section actions
  section.querySelector('.add-row').addEventListener('click', () => addRow(section));
  section.querySelector('.delete-section').addEventListener('click', () => deleteSection(section));

  section.querySelectorAll('.delete-row').forEach(deleteButton => {
    deleteButton.addEventListener('click', event => {
      const row = event.target.closest('tr');
      row.remove();
      updateSectionTotal(section);
    });
  });

  section.querySelectorAll('[contenteditable="true"]').forEach(cell =>
    cell.addEventListener('input', () => updateSectionTotal(section))
  );

  updateSectionTotal(section); // Update total on load
}

// Function to delete a section
function deleteSection(section) {
  const sectionName = section.querySelector('h2').innerText.trim();
  const confirmDelete = confirm(`Are you sure you want to delete the section "${sectionName}"?`);

  if (confirmDelete) {
    const sectionDocRef = doc(db, 'sections', sectionName);
    deleteDoc(sectionDocRef)
      .then(() => {
        section.remove();
        updateGlobalTotal();
        console.log(`Section "${sectionName}" deleted successfully.`);
      })
      .catch(error => console.error(`Error deleting section "${sectionName}":`, error));
  }
}

// Function to add a new row to a section
function addRow(section) {
  const tbody = section.querySelector('tbody');
  const row = document.createElement('tr');
  row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
  row.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 text-center" contenteditable="true"></td>
    <td class="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 text-center" contenteditable="true"></td>
    <td class="px-6 py-4 whitespace-nowrap text-center">
      <button class="delete-row bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition-all hover:shadow-md">Delete</button>
    </td>
  `;
  tbody.appendChild(row);

  row.querySelector('.delete-row').addEventListener('click', () => {
    row.remove();
    updateSectionTotal(section);
  });

  row.querySelectorAll('[contenteditable="true"]').forEach(cell =>
    cell.addEventListener('input', () => updateSectionTotal(section))
  );
}

// Function to save all sections to Firebase
function saveAllSections() {
  const sections = Array.from(sectionsContainer.children);
  const sectionNames = sections.map(section => section.querySelector('h2').innerText.trim());
  const hasDuplicates = new Set(sectionNames).size !== sectionNames.length;

  if (hasDuplicates) {
    alert('Duplicate section names found! Please ensure all section names are unique.');
    return;
  }

  const savePromises = sections.map(section => {
    const sectionName = section.querySelector('h2').innerText.trim();
    const rows = Array.from(section.querySelectorAll('tbody tr')).map(row => ({
      description: row.cells[0]?.innerText.trim() || '',
      amount: parseFloat(row.cells[1]?.innerText.trim()) || 0,
    }));

    return setDoc(doc(db, 'sections', sectionName), { data: rows });
  });

  Promise.all(savePromises)
    .then(() => alert('All sections saved successfully!'))
    .catch(error => console.error('Error saving sections:', error));
}

// Function to update the total for a section
function updateSectionTotal(section) {
  const rows = Array.from(section.querySelectorAll('tbody tr'));
  const sectionTotal = rows.reduce((sum, row) => {
    const amount = parseFloat(row.cells[1]?.innerText.trim()) || 0;
    return sum + amount;
  }, 0);

  section.querySelector('.section-total span').innerText = sectionTotal.toFixed(2);
  updateGlobalTotal();
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
