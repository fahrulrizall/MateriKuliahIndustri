using System;
using System.Collections.Generic;
using System.Linq;

namespace CRUD_Console
{
    class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Major { get; set; }
    }

    class Program
    {
        static List<Student> students = new List<Student>();
        static int nextId = 1;

        static void Main(string[] args)
        {
            bool running = true;
            while (running)
            {
                Console.Clear();
                Console.WriteLine("=== Student Management (CRUD) ===");
                Console.WriteLine("1. View All Students (Read)");
                Console.WriteLine("2. Add Student (Create)");
                Console.WriteLine("3. Update Student (Update)");
                Console.WriteLine("4. Delete Student (Delete)");
                Console.WriteLine("5. Exit");
                Console.Write("Select an option (1-5): ");
                
                string choice = Console.ReadLine();
                switch (choice)
                {
                    case "1":
                        ViewStudents();
                        break;
                    case "2":
                        AddStudents();
                        break;
                    case "3":
                        UpdateStudents();
                        break;
                    case "4":
                        DeleteStudents();
                        break;
                    case "5":
                        running = false;
                        break;
                    default:
                        Console.WriteLine("Invalid option. Press any key to continue...");
                        Console.ReadKey();
                        break;
                }
            }
        }

        static void ViewStudents()
        {
            Console.Clear();
            Console.WriteLine("--- Students List ---");
            if (students.Count == 0)
            {
                Console.WriteLine("No Studentss found.");
            }
            else
            {
                foreach (var emp in students)
                {
                    Console.WriteLine($"ID: {emp.Id} | Name: {emp.Name} | Position: {emp.Major}");
                }
            }
            Console.WriteLine("\nPress any key to return to menu...");
            Console.ReadKey();
        }

        static void AddStudents()
        {
            Console.Clear();
            Console.WriteLine("--- Add Students ---");
            Console.Write("Enter Name: ");
            string name = Console.ReadLine();
            Console.Write("Enter Major: ");
            string major = Console.ReadLine();

            students.Add(new Student { Id = nextId++, Name = name, Major = major });
            Console.WriteLine("Students added successfully! Press any key to continue...");
            Console.ReadKey();
        }

        static void UpdateStudents()
        {
            Console.Clear();
            Console.WriteLine("--- Update Students ---");
            Console.Write("Enter Students ID to update: ");
            if (int.TryParse(Console.ReadLine(), out int id))
            {
                var Students = students.FirstOrDefault(e => e.Id == id);
                if (Students != null)
                {
                    Console.Write($"Enter new Name (current: {Students.Name}): ");
                    string newName = Console.ReadLine();
                    if (!string.IsNullOrWhiteSpace(newName)) Students.Name = newName;

                    Console.Write($"Enter new Position (current: {Students.Major}): ");
                    string newPosition = Console.ReadLine();
                    if (!string.IsNullOrWhiteSpace(newPosition)) Students.Major = newPosition;

                    Console.WriteLine("Students updated successfully! Press any key to continue...");
                }
                else
                {
                    Console.WriteLine("Students not found! Press any key to continue...");
                }
            }
            else
            {
                Console.WriteLine("Invalid ID format! Press any key to continue...");
            }
            Console.ReadKey();
        }

        static void DeleteStudents()
        {
            Console.Clear();
            Console.WriteLine("--- Delete Student ---");
            Console.Write("Enter Student ID to delete: ");
            if (int.TryParse(Console.ReadLine(), out int id))
            {
                var student = students.FirstOrDefault(e => e.Id == id);
                if (student != null)
                {
                    students.Remove(student);
                    Console.WriteLine("Student deleted successfully! Press any key to continue...");
                }
                else
                {
                    Console.WriteLine("Student not found! Press any key to continue...");
                }
            }
            else
            {
                Console.WriteLine("Invalid ID format! Press any key to continue...");
            }
            Console.ReadKey();
        }
    }
}
