# 📚 Lab Manual Hub

A curated, comprehensive, and centralized repository of verified engineering laboratory manuals, source code implementations, algorithm solutions, and viva questions across multiple academic semesters.

---

## 🌟 Features

- **Multi-Semester Categorization**: Organized into dedicated semester modules (`SEM 2` & `SEM 3`).
- **Department-Wide Coverage**: Manuals for Computer Science (CSE), Artificial Intelligence & Data Science (AIDS), Electronics & Communication (ECE), Electrical & Electronics (EEE), Biomedical Engineering (BME), and Civil Engineering.
- **Interactive Web Hub (`index.html`)**:
  - 🔍 **Real-Time Instant Search**: Filter manuals by subject name, course code (e.g., `CS5302`, `CS5303`), or department.
  - 🏷️ **Semester Filtering**: Switch seamlessly between **All Semesters**, **Semester 3**, and **Semester 2**.
  - ⭐ **Interactive Feedback & Requests**: Submit requests for missing lab experiments or record questions directly.
- **Zero External Dependencies**: Pure client-side HTML5, modern CSS styling, and Vanilla JavaScript. Runs offline and on any standard web server.

---

## 🗂️ Directory Structure

```text
lab-manual-hub/
├── index.html                  # Main interactive portal & subject browser
├── README.md                   # Repository documentation
├── .gitignore                  # Git ignore rules for clean repository state
│
├── SEM 2/                      # Semester 2 Laboratory Manuals
│   ├── AI/                     # Artificial Intelligence Lab (CSE / AIDS)
│   ├── AIML_EEE/               # AI & Machine Learning Lab (EEE)
│   ├── AI_CIVIL/               # AI Applications in Civil Engineering
│   ├── APT/                    # EES-2 Aptitude & Engineering Formula Sheet
│   ├── C++_CSE/                # Object-Oriented Programming in C++ (CSE)
│   ├── C++_ECE/                # C++ Programming Lab (ECE)
│   │   ├── index.html          # Set Selector Portal
│   │   ├── MAIN/               # Main Comprehensive Manual
│   │   ├── SETA/               # Set A Lab Exercises
│   │   ├── SETB/               # Set B Lab Exercises
│   │   └── SETC/               # Set C Lab Exercises
│   ├── C++_EEE/                # C++ Programming Lab (EEE)
│   ├── C_BME/                  # C Programming Lab (Biomedical)
│   ├── DBMS/                   # Database Management Systems Lab (CSE / IT)
│   ├── DE_ECE/                 # Digital Electronics Lab (ECE)
│   ├── DLC_EEE/                # Digital Logic Circuits Lab (EEE)
│   ├── EC_ECE/                 # Electronic Circuits Lab (ECE)
│   ├── OS_ECE/                 # Operating Systems Lab (ECE)
│   ├── TAMIL & TECHNOLOGY/     # Tamil & Technology Record
│   └── WEB_FW/                 # Web Frameworks Lab Manual (PDF)
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

## 📖 Subject Breakdown

### 🔹 Semester 3
| Code | Subject | Department | Highlights & Topics |
| :--- | :--- | :--- | :--- |
| **CS5302** | **OS 1: Operating Systems Laboratory** | CSE / IT | Unix/Linux commands, Shell scripting, CPU Scheduling (FCFS, SJF, RR, Priority), Deadlock Avoidance (Banker's Algorithm), Memory Management & Paging. |
| **CS5303** | **DAA: Design & Analysis of Algorithms** | CSE / IT | Divide & Conquer (Min/Max), Greedy (Prim's, Kruskal's, Dijkstra), Dynamic Programming (Matrix Chain, 0/1 Knapsack), Backtracking (N-Queens), Branch & Bound (TSP), String Matching (KMP, Rabin-Karp). |

### 🔹 Semester 2
| Subject | Department | Content Summary |
| :--- | :--- | :--- |
| **TAMIL & TECHNOLOGY** | All Departments | Complete 16-mark notes, cultural & technological evolution documents. |
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

## 🚀 How to Run & Use

### Option 1: Direct File Launch
Simply double-click [`index.html`](index.html) or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Web Server
You can serve the directory using Python or Node.js:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js npx
npx serve .
```

Open `http://localhost:8000` in your web browser.

---

## 🤝 Contributing

1. Fork this repository.
2. Create a feature branch for your semester or subject:
   ```bash
   git checkout -b add-sem4-manuals
   ```
3. Add the lab manual HTML/PDF files following the folder structure (`SEM <number>/<SUBJECT_NAME>/`).
4. Update the subject registry in `index.html` if adding a new entry.
5. Commit and open a Pull Request.

---

## 📄 License

This repository is maintained for educational and academic reference purposes. All rights belong to their respective contributors and institutions.
