const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let students = [];
let idCounter = 1;

// Helper input
function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

// Menu
async function menu() {
    console.log("\n=== Student Information ===");
    console.log("1. View All Students");
    console.log("2. Add Student");
    console.log("3. Update Student");
    console.log("4. Delete Student");
    console.log("5. Exit");

    const choice = await ask("Choose menu: ");

    switch (choice) {
        case "1":
            viewStudents();
            break;
        case "2":
            await addStudent();
            break;
        case "3":
            await updateStudent();
            break;
        case "4":
            await deleteStudent();
            break;
        case "5":
            console.log("Goodbye!");
            rl.close();
            return;
        default:
            console.log("Invalid choice!");
    }

    menu();
}

// READ
function viewStudents() {
    console.log("\n=== List Students ===");
    if (students.length === 0) {
        console.log("No data.");
        return;
    }

    students.forEach((s) => {
        console.log(`ID: ${s.id} | Name: ${s.name} | Major: ${s.major}`);
    });
}

// CREATE
async function addStudent() {
    const name = await ask("Enter name: ");
    const major = await ask("Enter major: ");

    students.push({
        id: idCounter++,
        name,
        major,
    });

    console.log("Student added!");
}

// UPDATE
async function updateStudent() {
    const id = parseInt(await ask("Enter student ID to update: "));
    const student = students.find((s) => s.id === id);

    if (!student) {
        console.log("Student not found!");
        return;
    }

    const name = await ask("Enter new name: ");
    const major = await ask("Enter new major: ");

    student.name = name;
    student.major = major;

    console.log("Student updated!");
}

// DELETE
async function deleteStudent() {
    const id = parseInt(await ask("Enter student ID to delete: "));
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
        console.log("Student not found!");
        return;
    }

    students.splice(index, 1);
    console.log("Student deleted!");
}

// Start app
menu();