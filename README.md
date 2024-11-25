# Dynamic Finance Tracker Web App

This web application is designed to track financial data, with functionalities to dynamically add, update, and delete financial sections (e.g., Receivables, Payables, Cash). The data is saved to Firebase Firestore, ensuring that the information persists even after the page is refreshed.

## What Does the Website Do?

The website allows users to:
- **Add dynamic sections** with editable names (such as Receivable, Payable, Cash).
- **Add rows** under each section to record financial entries (description and amount).
- **Delete rows** and **delete entire sections** when they are no longer needed.
- **Automatically calculate** the total for each section based on the rows.
- **Global total** is displayed at the bottom, considering the "Payable" section as a negative value.
- **Save all sections' data** to Firebase Firestore for persistent storage and retrieval.

## Features:
- Add, edit, and delete financial sections.
- Add and delete financial entries (rows) inside each section.
- Real-time calculation of totals for each section and the global total.
- Data is saved in Firebase Firestore and is persistent across page reloads.
- Editable row content with automatic updates when descriptions or amounts are changed.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Setup and Installation](#setup-and-installation)
3. [Usage](#usage)
4. [Features](#features)
5. [License](#license)

---

## Technologies Used

- **HTML**: Structure and layout of the application.
- **CSS**: Styling the application with a simple layout and design.
- **JavaScript**: Handles the logic for adding, deleting sections and rows, and communicating with Firebase Firestore.
- **Firebase**: Used for storing and retrieving data using Firestore.

---

## Setup and Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker

## Usage

Once the app is running, you can interact with it as follows:

1. **Add a Section**: 
   - Click the "Add Section" button to create a new section. A section represents a category like "Receivables", "Payables", etc. The section name is editable and can be customized.

2. **Add Rows**: 
   - Inside each section, click "Add Row" to add a new row for a financial entry. Each row contains two editable fields: **Description** and **Amount**.

3. **Edit Rows**: 
   - Click on the **Description** or **Amount** cell of any row to modify its contents. Changes will automatically update the section total.

4. **Delete Rows**: 
   - Click the "Delete" button next to any row to remove it from the section. The section total will be recalculated upon removal.

5. **Delete Section**: 
   - Each section has a "Delete Section" button. Clicking this button will remove the entire section from the page and also delete it from Firebase Firestore.

6. **Save All Sections**: 
   - Click the "Save All Sections" button to save all the sections' data (including rows) to Firebase Firestore. This ensures that your data persists even after refreshing the page.

7. **Global Total**:
   - The **Global Total** will be updated automatically by adding up all section totals. If a "Payable" section exists, its total will be subtracted from the global total. 
   - The **Actual Total** is calculated by subtracting double the Payable total from the Global Total.

8. **Refreshing the Page**:
   - When the page is refreshed, all previously saved sections and their data will be reloaded from Firestore and displayed dynamically.

---

## Features

- **Dynamic Section Management**:
  - Users can create, edit, and delete sections dynamically. Sections can represent different categories like "Receivables", "Payables", "Cash", etc.
  - Each section has an editable name, and a user can add as many sections as needed.

- **Row Management**:
  - Within each section, users can add, edit, and delete rows. Each row consists of a **Description** and an **Amount** field.
  - Users can modify the content of these fields, and the section total will update automatically.

- **Automatic Calculation of Totals**:
  - The total for each section is automatically calculated based on the amounts entered in its rows.
  - The **Global Total** aggregates the totals of all sections, and the **Payable** section total is subtracted from it.
  - The **Actual Total** is also calculated by subtracting double the Payable section total from the Global Total.

- **Data Persistence**:
  - All sections and their rows are saved in **Firebase Firestore**, ensuring that the data persists even after the page is refreshed or the browser is closed.
  - The app will automatically load all sections and rows from Firestore when the page is loaded.

- **Responsive UI**:
  - The interface is designed to be intuitive, with all sections and rows easily editable, and totals being automatically updated as users interact with the data.

- **Error-Free Deletion**:
  - Users can safely delete rows and sections, and the app will ensure that calculations and data integrity are maintained after deletions.

- **Easy Integration with Firebase**:
  - The app uses Firebase Firestore for backend data storage, ensuring secure and reliable cloud-based data management.



---

This **README.md** explains the purpose of the project, how to set it up locally, and provides usage instructions. It also includes a section for setting up Firebase, which is a crucial part of the project.

