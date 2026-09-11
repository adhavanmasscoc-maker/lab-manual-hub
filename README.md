# 📚 Lab Manual Hub

A curated, clean, and centralized engineering laboratory repository hosting verified lab manuals, source programs, algorithm implementations, and documentation for university engineering courses.

---

## 🌟 Overview

The **Lab Manual Hub** provides students and educators with instant access to complete lab records, verified codes, and viva voce preparations across multiple semesters.

### Key Highlights:
- **Zero External Dependencies**: Pure client-side HTML5, modern CSS design, and Vanilla JavaScript. Runs completely offline or on any static hosting platform.
- **Semester Organization**: Clean separation into `SEM 2` and `SEM 3` curricula.
- **Interactive Portal (`index.html`)**:
  - 🔍 **Real-Time Instant Search**: Live filter by subject name, course code, or department.
  - 🏷️ **Multi-Semester Filtering**: Switch seamlessly between **All Semesters**, **Semester 3**, and **Semester 2**.
  - ⭐ **Interactive Feedback & Requests**: Clean in-page rating and manual request submission.

---

## 🗂️ Directory Structure

```text
lab-manual-hub/
├── index.html                  # Main interactive lab portal & subject browser
├── README.md                   # Repository documentation & guide
├── .gitignore                  # Git ignore rules
│
├── SEM 2/                      # Semester 2 Laboratory Manuals
│   ├── AI/                     # Artificial Intelligence Laboratory (CSE / AIDS)
│   ├── AIML_EEE/               # AI & Machine Learning Laboratory (EEE)
│   ├── AI_CIVIL/               # AI Applications in Civil Engineering
│   ├── APT/                    # EES-2 Aptitude & Engineering Formula Sheet
│   ├── C++_CSE/                # Object-Oriented Programming with C++ (CSE)
│   ├── C++_ECE/                # C++ Programming Laboratory (ECE)
│   │   ├── index.html          # Set Selector Portal
│   │   ├── MAIN/               # Main Comprehensive Manual
│   │   ├── SETA/               # Set A Lab Exercises
│   │   ├── SETB/               # Set B Lab Exercises
│   │   └── SETC/               # Set C Lab Exercises
│   ├── C++_EEE/                # C++ Programming Laboratory (EEE)
│   ├── C_BME/                  # C Programming Laboratory (Biomedical)
│   ├── DBMS/                   # Database Management Systems Laboratory (CSE / IT)
│   ├── DE_ECE/                 # Digital Electronics Laboratory (ECE)
│   ├── DLC_EEE/                # Digital Logic Circuits Laboratory (EEE)
│   ├── EC_ECE/                 # Electronic Circuits Laboratory (ECE)
│   ├── OS_ECE/                 # Operating Systems Laboratory (ECE)
│   ├── TAMIL & TECHNOLOGY/     # Tamil & Technology Record
│   └── WEB_FW/                 # Web Frameworks Laboratory Manual (PDF)
│
└── SEM 3/                      # Semester 3 Laboratory Manuals
    ├── DAA/                    # CS5303: Design & Analysis of Algorithms Lab
    │   └── index.html          # Binary Search, KMP, MST, Dijkstra, N-Queens, TSP
    ├── OS 1/                   # CS5302: Operating Systems Laboratory 1
    │   └── index.html          # Shell scripts, CPU scheduling, Banker's, Paging
    └── OS/                     # Operating Systems Alternate Reference Manual
        └── index.html
```

---

## 📖 Curriculum & Subject Breakdown

### 🔹 Semester 3
| Code | Subject | Department | Highlights & Exercises |
| :--- | :--- | :--- | :--- |
| **CS5302** | **OS 1: Operating Systems Laboratory** | CSE / IT | Unix/Linux commands, Shell scripting, CPU Scheduling (FCFS, SJF, RR, Priority), Deadlock Avoidance (Banker's Algorithm), Memory Management & Paging. |
| **CS5303** | **DAA: Design & Analysis of Algorithms** | CSE / IT | Divide & Conquer (Min/Max), Greedy (Prim's, Kruskal's, Dijkstra), Dynamic Programming (Matrix Chain, 0/1 Knapsack), Backtracking (N-Queens), Branch & Bound (TSP), String Matching (KMP, Rabin-Karp). |

### 🔹 Semester 2
| Subject | Department | Description & Coverage |
| :--- | :--- | :--- |
| **TAMIL & TECHNOLOGY** | All Departments | Complete 16-mark notes, cultural & technological heritage documentation. |
| **AI Lab** | CSE / AIDS | Search algorithms, logic programming, heuristics, Python implementations. |
| **DBMS Lab** | CSE / IT | SQL DDL/DML, Joins, Triggers, Views, Procedures, Normalization exercises. |
| **WEB_FW Lab** | CSE | Full-stack web framework concepts, MVC models, and client-server exercises. |
| **C++ CSE Lab** | CSE | OOP paradigms: Classes, Inheritance, Polymorphism, Templates, Exception handling. |
| **C++ ECE Lab** | ECE | Multi-set laboratory manual with modular sets (Set A, Set B, Set C, Main). |
| **C++ EEE Lab** | EEE | Object-Oriented problem solving customized for electrical circuit applications. |
| **AI_CIVIL** | CIVIL | Applied artificial intelligence in structural and civil engineering analysis. |
| **DLC_EEE** | EEE | Digital logic circuit design, truth tables, flip-flops, counter implementations. |
| **AIML_EEE** | EEE | Machine learning algorithms applied to power systems and electrical signals. |
| **C_BME** | BME | C programming fundamentals tailored for biomedical data processing. |
| **EC_ECE** | ECE | Electronic circuit design, amplifier frequency responses, diode characteristics. |
| **DE_ECE** | ECE | Combinational and sequential digital circuits, logic minimization, decoders. |
| **OS_ECE** | ECE | Core operating systems principles and system call exercises for electronics. |
| **EES-2 (APTITUDE)** | Aptitude / Placement | Fast arithmetic shortcuts, quantitative aptitude formulas, placement preparation. |

---

## 🚀 How to Run Locally

### Option 1: Direct File Launch
Simply double-click [`index.html`](index.html) or open it in any modern web browser.

### Option 2: Static Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

Navigate to `http://localhost:8000` to browse the portal.

---

## 🤝 Contributing

1. Fork this repository.
2. Create a feature branch for your semester or subject:
   ```bash
   git checkout -b add-sem4-manuals
   ```
3. Add the lab manual HTML/PDF files following the directory structure (`SEM <number>/<SUBJECT_NAME>/`).
4. Update the subject registry in `index.html` if adding a new entry.
5. Commit your changes and open a Pull Request.

---

## 📄 License

This repository is maintained for educational and academic reference purposes. All rights belong to their respective contributors and institutions.
