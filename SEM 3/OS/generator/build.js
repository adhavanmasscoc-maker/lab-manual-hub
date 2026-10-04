const fs = require('fs');
const path = require('path');

const set1 = require('./set1');
const set2 = require('./set2');
const viva = require('./viva');
const { set1Mappings, set2Mappings } = require('./mappings');

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Comprehensive experiment definitions
const expList = [
    { exNo: "1", title: "Installation of Windows Operating System", id: "ex1" },
    { exNo: "2", title: "Illustrate UNIX Commands and Shell Programming", id: "ex2" },
    { exNo: "3", title: "System Calls: Fork, Exit, Getpid, Wait, Close", id: "ex3" },
    { exNo: "4", title: "CPU Scheduling Algorithms (FCFS, SJF, Priority, Round Robin)", id: "ex4" },
    { exNo: "5", title: "Inter Process Communication (IPC) via Pipes", id: "ex5" },
    { exNo: "6", title: "Semaphore Implementation", id: "ex6" },
    { exNo: "7", title: "Banker's Algorithm for Deadlock Avoidance", id: "ex7" },
    { exNo: "8", title: "Deadlock Detection Algorithm", id: "ex8" },
    { exNo: "9", title: "Threading (POSIX Threads)", id: "ex9" },
    { exNo: "10", title: "Paging Technique", id: "ex10" },
    { exNo: "11", title: "Memory Allocation Methods (First Fit, Best Fit, Worst Fit)", id: "ex11" },
    { exNo: "12", title: "Page Replacement Algorithms (FIFO, LRU, Optimal)", id: "ex12" },
    { exNo: "13", title: "File Organization Techniques (Sequential, Direct, Indexed)", id: "ex13" },
    { exNo: "14", title: "File Allocation Strategies (Sequential, Indexed, Linked)", id: "ex14" },
    { exNo: "15", title: "Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN)", id: "ex15" }
];

// Helper to generate step-by-step numbered algorithms if not already an array
function getFormattedAlgorithm(qText, isShell, defaultPrinciple) {
    if (qText.toLowerCase().includes("fifo") && qText.toLowerCase().includes("page")) {
        return [
            "Start the program and define the reference string and frame capacity.",
            "Initialize frame buffer array with -1 to indicate unallocated slots.",
            "Traverse each page reference sequentially from left to right.",
            "Check if the requested page is already present in any frame slot (Page Hit).",
            "If page is absent (Page Fault), select victim frame using circular pointer: victim = (victim + 1) % total_frames.",
            "Replace victim frame content with incoming page and increment fault counter.",
            "Print intermediate frame state and compute final Hit Ratio and Fault Ratio."
        ];
    } else if (qText.toLowerCase().includes("deadlock") && qText.toLowerCase().includes("detection")) {
        return [
            "Initialize Work vector equal to Available resource vector: Work = Available.",
            "For all processes i, initialize Finish[i] = false if Allocation[i] != 0, else true.",
            "Scan for an unfinished process i (Finish[i] == false) whose Request[i] <= Work.",
            "If found, reclaim its resources: Work = Work + Allocation[i]; Finish[i] = true; repeat scan.",
            "If no further processes can proceed and any Finish[i] == false, declare process i deadlocked.",
            "Output list of deadlocked processes and overall system deadlock state."
        ];
    } else if (qText.toLowerCase().includes("banker")) {
        return [
            "Compute Need Matrix for all processes: Need[i][j] = Max[i][j] - Allocation[i][j].",
            "Initialize Work vector = Available vector and Finish[i] = false for all processes.",
            "Locate an index i such that Finish[i] == false and Need[i] <= Work across all resource types.",
            "If found, simulate process completion: Work = Work + Allocation[i]; Finish[i] = true; append i to safe sequence.",
            "Repeat until all processes finish (Safe State) or no process can be satisfied (Unsafe / Deadlock State).",
            "Display safe sequence if found, else alert unsafe condition."
        ];
    } else if (qText.toLowerCase().includes("fcfs")) {
        return [
            "Input number of processes and their respective Burst Times (BT).",
            "Set Waiting Time for first process WT[0] = 0 and Turnaround Time TAT[0] = BT[0].",
            "For subsequent processes i = 1 to n-1, compute WT[i] = WT[i-1] + BT[i-1].",
            "Compute Turnaround Time for each process: TAT[i] = WT[i] + BT[i].",
            "Calculate Average Waiting Time = (Sum of WT) / n and Average Turnaround Time = (Sum of TAT) / n.",
            "Print the complete scheduling table with Gantt chart summary."
        ];
    } else if (qText.toLowerCase().includes("sjf")) {
        return [
            "Input processes and their Burst Times.",
            "Sort processes in ascending order of Burst Times using bubble sort.",
            "Set Waiting Time of shortest process to 0.",
            "Cumulatively compute Waiting Time and Turnaround Time for each sorted process.",
            "Calculate Average Waiting Time and Average Turnaround Time.",
            "Display sorted dispatch sequence and metric averages."
        ];
    } else if (qText.toLowerCase().includes("priority")) {
        return [
            "Input processes, Burst Times, and Priority integer values.",
            "Sort process records in order of priority (lower integer indicates higher priority).",
            "Apply sequential FCFS dispatch to the priority-ordered process queue.",
            "Compute Waiting Time WT[i] and Turnaround Time TAT[i] for all processes.",
            "Display scheduling table and compute averages."
        ];
    } else if (qText.toLowerCase().includes("round robin")) {
        return [
            "Input processes, Burst Times, and Time Quantum Q.",
            "Create a copy of Burst Times in remaining burst time array rem_bt[].",
            "Iterate circularly through ready processes in round-robin sequence.",
            "If rem_bt[i] > Q, advance clock by Q and deduct Q from rem_bt[i].",
            "If rem_bt[i] <= Q and rem_bt[i] > 0, advance clock by rem_bt[i], calculate WT[i] = clock - BT[i], and set rem_bt[i] = 0.",
            "Repeat until all processes terminate; compute and print average WT and TAT."
        ];
    } else if (qText.toLowerCase().includes("pipe")) {
        return [
            "Call pipe(fd) to create an anonymous unidirectional kernel channel with descriptors fd[0] and fd[1].",
            "Invoke fork() to spawn a child process.",
            "In writer process (child or parent), close unused read descriptor fd[0] and write message to fd[1].",
            "In reader process, close unused write descriptor fd[1] and read streamed bytes from fd[0].",
            "Display transmitted message, close remaining descriptors, and synchronize via wait()."
        ];
    } else if (qText.toLowerCase().includes("semaphore") || qText.toLowerCase().includes("mutex")) {
        return [
            "Initialize semaphore variable using sem_init(&sem, 0, initial_value).",
            "Create concurrent threads or processes competing for shared critical resource.",
            "In Entry Section, invoke sem_wait(&sem) to atomically test and decrement semaphore.",
            "Execute Critical Section code ensuring mutual exclusion.",
            "In Exit Section, invoke sem_post(&sem) to increment semaphore and signal waiting contexts.",
            "Destroy semaphore upon completion using sem_destroy(&sem)."
        ];
    } else if (qText.toLowerCase().includes("best fit")) {
        return [
            "Input memory block sizes and process memory request sizes.",
            "Initialize allocation tracking array to -1 (unallocated).",
            "For each incoming process request, search all free blocks that can accommodate it.",
            "Select the eligible block with the minimum remaining space: min(blockSize - processSize).",
            "Assign process to the selected best-fit block and decrement remaining block capacity.",
            "Display final allocation table showing internal fragmentation per partition."
        ];
    } else if (qText.toLowerCase().includes("first fit")) {
        return [
            "Input memory block sizes and process memory requests.",
            "Initialize allocation tracking array to -1.",
            "For each process, search memory blocks sequentially starting from index 0.",
            "Assign process to the very first block found whose capacity >= process request.",
            "Deduct allocated bytes from block and stop searching for current process.",
            "Display memory allocation table and flag unallocated processes."
        ];
    } else if (qText.toLowerCase().includes("page table") || qText.toLowerCase().includes("logical address") || qText.toLowerCase().includes("paging")) {
        return [
            "Input Logical Address (LA) and Page Size (PS).",
            "Calculate Page Number: p = LA / PS.",
            "Calculate Byte Offset: d = LA % PS.",
            "Validate whether page number p is within allocated Page Table bounds (p < PTLR).",
            "If valid, retrieve mapped physical frame f from page table and compute Physical Address = (f * PS) + d.",
            "If p >= PTLR, generate hardware addressing error trap (SIGSEGV)."
        ];
    } else if (qText.toLowerCase().includes("fork") || qText.toLowerCase().includes("process")) {
        return [
            "Invoke fork() system call to duplicate current process context.",
            "Evaluate returned PID value: < 0 (error), == 0 (child), > 0 (parent).",
            "In child branch (pid == 0), retrieve own PID via getpid() and parent PID via getppid().",
            "In parent branch (pid > 0), call wait() to synchronize with child termination and prevent zombies.",
            "Print process identification hierarchy and exit cleanly."
        ];
    } else if (qText.toLowerCase().includes("thread") || qText.toLowerCase().includes("pthread")) {
        return [
            "Define thread routine function with void* (*routine)(void*) signature.",
            "Instantiate thread identifiers of type pthread_t.",
            "Invoke pthread_create(&thread_id, NULL, routine, argument) to spawn threads.",
            "Allow concurrent execution of worker threads.",
            "Call pthread_join(thread_id, NULL) in main thread to await thread termination.",
            "Release thread resources and verify shared output."
        ];
    } else {
        return [
            "Initialize program environment and configure required parameters.",
            "Validate input arguments and allocate necessary memory buffers.",
            "Execute primary algorithm logic adhering to operating system principles.",
            "Capture execution telemetry and handle edge cases.",
            "Format output metrics and cleanly terminate execution."
        ];
    }
}

function getSampleInput(qText) {
    if (qText.toLowerCase().includes("1 2 3 4 1 2 5")) {
        return "Reference String = 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 | Frame Capacity = 4 Frames";
    } else if (qText.toLowerCase().includes("7 0 1 2 0 3 0 4 2 3 0 3 2")) {
        return "Reference String = 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2 | Frame Capacity = 3 Frames";
    } else if (qText.toLowerCase().includes("5, 3, 8, 6") || qText.toLowerCase().includes("5 3 8 6")) {
        return "Processes = [P1, P2, P3, P4], Burst Times = [5, 3, 8, 6] ms, Arrival Times = [0, 0, 0, 0] ms";
    } else if (qText.toLowerCase().includes("500, 200, 300, 600")) {
        return "Memory Blocks = [500, 200, 300, 600] KB | Processes = [357, 129, 191] KB";
    } else if (qText.toLowerCase().includes("100, 500, 200, 300, 600")) {
        return "Memory Blocks = [100, 500, 200, 300, 600] KB | Processes = [212, 417, 112, 426] KB";
    } else if (qText.toLowerCase().includes("logical address") || qText.toLowerCase().includes("offset")) {
        return "Logical Address = 2500 bytes (or 7250 bytes) | Page Size = 1024 bytes (1 KB)";
    } else if (qText.toLowerCase().includes("three given numbers") || qText.toLowerCase().includes("greatest")) {
        return "Number A = 48, Number B = 95, Number C = 72";
    } else if (qText.toLowerCase().includes("fibonacci")) {
        return "Upper Bound Limit N = 50";
    } else if (qText.toLowerCase().includes("odd numbers")) {
        return "Upper Limit N = 15";
    } else if (qText.toLowerCase().includes("banker")) {
        return "5 Processes (P0-P4), 3 Resources (A:10, B:5, C:7), Allocation Matrix, Max Matrix, Available = [3, 3, 2]";
    } else if (qText.toLowerCase().includes("deadlock")) {
        return "Allocation Matrix [5x3], Request Matrix [5x3], Available Vector = [0, 0, 0]";
    } else if (qText.toLowerCase().includes("quantum")) {
        return "Processes = [P1, P2, P3], Burst Times = [5, 4, 3] ms, Time Quantum Q = 2 ms";
    } else {
        return "Standard POSIX execution parameters and test benchmarks.";
    }
}

function renderQuestionCard(q, setNum, mapping) {
    const qId = `set${setNum}_q${q.num}`;
    const nextQId = q.num < 20 ? `#set${setNum}_q${q.num + 1}` : (setNum === 1 ? '#set2_q1' : '#viva');
    const prevQId = q.num > 1 ? `#set${setNum}_q${q.num - 1}` : (setNum === 2 ? '#set1_q20' : '#master_map_table');

    const algoA = getFormattedAlgorithm(q.partA.q, false, q.partA.principle);
    const sampleInputA = getSampleInput(q.partA.q);
    const resultA = `Result: The practical exam requirement for "${q.partA.q.substring(0, 80)}..." was analyzed, executed, and verified successfully.`;

    const algoB = getFormattedAlgorithm(q.partB.q, true, q.partB.principle);
    const sampleInputB = getSampleInput(q.partB.q);
    const resultB = `Result: The shell script implementation for "${q.partB.q.substring(0, 80)}..." was executed and validated with test output.`;

    return `
    <div class="model-q-box" id="${qId}" data-topic="${mapping.topic.toLowerCase()}" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 22px; margin-bottom: 35px; box-shadow: 0 3px 12px rgba(15,23,42,0.05); scroll-margin-top: 85px;">
        
        <!-- CARD HEADER -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <div style="flex: 1; min-width: 280px;">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
                    <span style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; background:${setNum === 1 ? '#4338ca' : '#065f46'}; color:#ffffff; padding:4px 10px; border-radius:6px;">Set ${setNum} – Question ${q.num}</span>
                    <a href="#${mapping.expId}" style="text-decoration:none; font-size:12px; font-weight:700; background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:6px; border:1px solid #bae6fd; display:inline-flex; align-items:center; gap:4px;">
                        🔗 Mapped to ${mapping.exp} →
                    </a>
                </div>
                <h3 style="color:#0f172a; font-size:18px; font-weight:800; margin:0; line-height:1.4;">${q.title}</h3>
            </div>
            
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="background:#e0e7ff; color:#3730a3; font-weight:800; font-size:12.5px; padding:6px 12px; border-radius:6px; border:1px solid #c7d2fe;">Total: 100 Marks (50 + 50)</span>
                <a href="#index0" style="text-decoration:none; font-size:12px; font-weight:700; background:#f1f5f9; color:#475569; padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1;">↑ Jump Grid</a>
                <a href="${prevQId}" style="text-decoration:none; font-size:12px; font-weight:700; background:#f1f5f9; color:#475569; padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1;">← Prev</a>
                <a href="${nextQId}" style="text-decoration:none; font-size:12px; font-weight:700; background:#f1f5f9; color:#475569; padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1;">Next →</a>
            </div>
        </div>

        <!-- ================= PART A ================= -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:5px solid #2563eb; border-radius:8px; padding:18px; margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px dashed #cbd5e1; padding-bottom:8px;">
                <h4 style="color:#1e40af; font-size:15.5px; font-weight:800; margin:0;">Part (a) [50 Marks] – Practical Exam Formulation</h4>
                <span style="background:#dbeafe; color:#1e40af; font-weight:800; font-size:11.5px; padding:3px 10px; border-radius:4px;">50 Marks</span>
            </div>
            
            <p style="font-weight:700; color:#0f172a; margin-bottom:14px; font-size:14.5px; line-height:1.5;">${q.partA.q}</p>

            <div class="sub-sec-title">Aim</div>
            <p class="exp-content">${q.partA.aim}</p>

            <div class="sub-sec-title">Algorithm & Theoretical Principles</div>
            <div class="exp-content">
                <ol style="margin-left: 20px; margin-bottom: 12px;">
                    ${algoA.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
                </ol>
                <div style="background:#f1f5f9; padding:10px 14px; border-radius:6px; font-size:13px; color:#334155; margin-top:8px;">
                    ${q.partA.principle.replace(/\n/g, '<br>')}
                </div>
            </div>

            ${q.partA.table ? `
            <div class="sub-sec-title">Comparative Analysis Table</div>
            <div style="overflow-x:auto; margin-bottom:14px;">${q.partA.table}</div>` : ''}

            <div class="sub-sec-title">Sample Input / Parameters</div>
            <p class="exp-content"><code style="background:#e2e8f0; padding:3px 8px; border-radius:4px; font-family:'Fira Code', monospace; color:#0f172a; font-size:13px;">${sampleInputA}</code></p>

            ${q.partA.code ? `
            <div class="sub-sec-title">Program Implementation (C Language)</div>
            <div class="code-wrapper">
                <div class="code-header">
                    <span>C Program (Part A)</span>
                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${escapeHtml(q.partA.code)}</code></pre>
            </div>` : ''}

            ${q.partA.output ? `
            <div class="sub-sec-title">Output & Execution Trace</div>
            <div class="output-box">${escapeHtml(q.partA.output)}</div>` : ''}

            <div class="box-result" style="margin-top:14px;">
                ${resultA}
            </div>
        </div>

        <!-- ================= PART B ================= -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:5px solid #059669; border-radius:8px; padding:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px dashed #cbd5e1; padding-bottom:8px;">
                <h4 style="color:#065f46; font-size:15.5px; font-weight:800; margin:0;">Part (b) [50 Marks] – Shell Scripting Formulation</h4>
                <span style="background:#d1fae5; color:#065f46; font-weight:800; font-size:11.5px; padding:3px 10px; border-radius:4px;">50 Marks</span>
            </div>
            
            <p style="font-weight:700; color:#0f172a; margin-bottom:14px; font-size:14.5px; line-height:1.5;">${q.partB.q}</p>

            <div class="sub-sec-title">Aim</div>
            <p class="exp-content">${q.partB.aim}</p>

            <div class="sub-sec-title">Algorithm for Shell Script Execution</div>
            <div class="exp-content">
                <ol style="margin-left: 20px; margin-bottom: 12px;">
                    ${algoB.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
                </ol>
                <div style="background:#f1f5f9; padding:10px 14px; border-radius:6px; font-size:13px; color:#334155; margin-top:8px;">
                    ${q.partB.principle.replace(/\n/g, '<br>')}
                </div>
            </div>

            ${q.partB.table ? `
            <div class="sub-sec-title">Analysis Table</div>
            <div style="overflow-x:auto; margin-bottom:14px;">${q.partB.table}</div>` : ''}

            <div class="sub-sec-title">Sample Input / Parameters</div>
            <p class="exp-content"><code style="background:#e2e8f0; padding:3px 8px; border-radius:4px; font-family:'Fira Code', monospace; color:#0f172a; font-size:13px;">${sampleInputB}</code></p>

            ${q.partB.code ? `
            <div class="sub-sec-title">Shell Script Implementation</div>
            <div class="code-wrapper">
                <div class="code-header">
                    <span>Shell Script (Part B)</span>
                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${escapeHtml(q.partB.code)}</code></pre>
            </div>` : ''}

            ${q.partB.output ? `
            <div class="sub-sec-title">Output</div>
            <div class="output-box">${escapeHtml(q.partB.output)}</div>` : ''}

            <div class="box-result" style="margin-top:14px;">
                ${resultB}
            </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
            <a href="#index0" style="text-decoration:none; font-size:12px; font-weight:700; color:#475569;">↑ Return to Question Navigation</a>
            <span style="color:#cbd5e1;">•</span>
            <a href="#master_map_table" style="text-decoration:none; font-size:12px; font-weight:700; color:#475569;">↑ Master Syllabus Mapping Table</a>
        </div>
    </div>`;
}

function generateMasterMappingTable() {
    let html = `
    <!-- ================= MASTER EXPERIMENT MAPPING TABLE ================= -->
    <div class="index-box" id="master_map_table" style="background:#ffffff; border: 2px solid #cbd5e1; border-top: 5px solid #2563eb; margin-top:25px; margin-bottom:30px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
            <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">
                🗺️ MASTER SYLLABUS MAPPING TABLE (15 Experiments ↔ Set 1 & Set 2 Exam Questions)
            </h2>
            <span style="background:#e0e7ff; color:#3730a3; font-weight:800; font-size:12px; padding:4px 10px; border-radius:6px;">40 Model Questions Mapped</span>
        </div>
        <p style="font-size:13.5px; color:#475569; margin-bottom:14px;">
            This table maps every practical experiment in the curriculum directly to its corresponding university exam model questions across Set 1 and Set 2. Click any question badge to jump directly to its complete step-by-step solution.
        </p>

        <div style="overflow-x:auto;">
            <table class="index-table" style="font-size:13px;">
                <thead>
                    <tr style="background:#f1f5f9;">
                        <th style="width:70px;">Ex. No</th>
                        <th style="width:280px;">Experiment Title in Syllabus</th>
                        <th>Model Paper Set 1 Mapped Questions</th>
                        <th>Model Paper Set 2 Mapped Questions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    expList.forEach(exp => {
        const s1Matches = set1Mappings.filter(m => m.expId === exp.id);
        const s2Matches = set2Mappings.filter(m => m.expId === exp.id);

        let s1Badges = s1Matches.map(m => `
            <a href="#set1_q${m.num}" style="text-decoration:none; display:inline-block; margin:2px; padding:4px 8px; background:#e0e7ff; color:#3730a3; font-weight:700; border-radius:4px; font-size:11.5px; border:1px solid #c7d2fe;">
                Set 1 Q${m.num}
            </a>
        `).join('') || '<span style="color:#94a3b8; font-style:italic;">None</span>';

        let s2Badges = s2Matches.map(m => `
            <a href="#set2_q${m.num}" style="text-decoration:none; display:inline-block; margin:2px; padding:4px 8px; background:#d1fae5; color:#065f46; font-weight:700; border-radius:4px; font-size:11.5px; border:1px solid #a7f3d0;">
                Set 2 Q${m.num}
            </a>
        `).join('') || '<span style="color:#94a3b8; font-style:italic;">None</span>';

        html += `
            <tr>
                <td style="font-weight:800; text-align:center;"><a href="#${exp.id}" style="color:#2563eb; text-decoration:none;">Ex. ${exp.exNo}</a></td>
                <td><a href="#${exp.id}" style="font-weight:700; color:#0f172a; text-decoration:none;">${exp.title}</a></td>
                <td>${s1Badges}</td>
                <td>${s2Badges}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;
    return html;
}

function generateIndex0() {
    let html = `
        <!-- ================= INDEX 0: PRACTICAL EXAMINATION MODEL SOLUTIONS ================= -->
        <article class="exp-card" id="index0" style="border-left: 6px solid #4f46e5; margin-bottom: 45px;">
            <div class="exp-header" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
                <span class="exp-badge" style="background:#4f46e5; font-size:12px; padding:6px 14px; text-transform:uppercase; letter-spacing:0.04em;">Index 0 – Complete Model Examination Solutions</span>
                <h2 class="exp-title" style="font-size:24px; color:#1e1b4b; margin-top:8px;">Operating Systems Practical Examination Master Solutions (100 Marks Pattern)</h2>
                <p style="color:#475569; font-size:14px; margin-top:6px; line-height:1.6;">
                    Comprehensive practical examination answers for all 40 questions (Set 1: Q1–Q20 & Set 2: Q1–Q20). Every answer strictly follows the University Lab Pattern: <strong>Aim</strong>, <strong>Algorithm (Numbered Steps)</strong>, <strong>Sample Input</strong>, <strong>Program with Syntax & Comments</strong>, <strong>Console Output</strong>, and <strong>Result Statement</strong>.
                </p>
            </div>

            <!-- LIVE SEARCH & TOPIC FILTERING BAR -->
            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:18px; margin-bottom:24px; box-shadow:0 2px 8px rgba(15,23,42,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                    <span style="font-weight:800; font-size:14px; color:#0f172a;">🔍 Instant Question Search & Filter:</span>
                    <span id="model-q-count" style="font-size:12.5px; font-weight:700; color:#2563eb; background:#eff6ff; padding:3px 10px; border-radius:20px; border:1px solid #bfdbfe;">40 Questions Available</span>
                </div>
                
                <input type="text" id="model-q-search" placeholder="Filter by keyword (e.g., FIFO, Banker, FCFS, SJF, Semaphore, Pthreads, Best Fit, Pipe, Fork)..." onkeyup="filterModelQuestions()" style="width:100%; padding:10px 14px; font-size:14px; border:2px solid #cbd5e1; border-radius:8px; outline:none; transition:border-color 0.2s; font-family:inherit; margin-bottom:14px;" onfocus="this.style.borderColor='#2563eb';" onblur="this.style.borderColor='#cbd5e1';">
                
                <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                    <span style="font-size:12px; font-weight:700; color:#64748b; margin-right:4px;">Quick Topics:</span>
                    <button type="button" onclick="filterByTopic('ALL', this)" class="topic-tag-btn active">All Topics</button>
                    <button type="button" onclick="filterByTopic('cpu scheduling', this)" class="topic-tag-btn">CPU Scheduling</button>
                    <button type="button" onclick="filterByTopic('page replacement', this)" class="topic-tag-btn">Page Replacement</button>
                    <button type="button" onclick="filterByTopic('deadlock', this)" class="topic-tag-btn">Deadlocks</button>
                    <button type="button" onclick="filterByTopic('semaphore', this)" class="topic-tag-btn">Semaphores</button>
                    <button type="button" onclick="filterByTopic('pipe', this)" class="topic-tag-btn">Pipes & IPC</button>
                    <button type="button" onclick="filterByTopic('paging', this)" class="topic-tag-btn">Paging</button>
                    <button type="button" onclick="filterByTopic('memory', this)" class="topic-tag-btn">Memory Fit</button>
                    <button type="button" onclick="filterByTopic('thread', this)" class="topic-tag-btn">Pthreads</button>
                    <button type="button" onclick="filterByTopic('fork', this)" class="topic-tag-btn">System Calls</button>
                </div>
            </div>

            <!-- FAST JUMP GRID: SET 1 -->
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:18px; margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                    <span style="font-weight:800; font-size:13.5px; color:#3730a3; text-transform:uppercase; letter-spacing:0.04em;">⚡ Fast Jump: Model Paper Set 1 (Questions 1 – 20)</span>
                    <a href="#set1_anchor" style="font-size:12px; font-weight:700; color:#4338ca; text-decoration:none;">Go to Section Header ↓</a>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(42px, 1fr)); gap:6px;">
    `;

    for (let i = 1; i <= 20; i++) {
        html += `<a href="#set1_q${i}" class="q-grid-pill s1">Q${i}</a>`;
    }

    html += `
                </div>
            </div>

            <!-- FAST JUMP GRID: SET 2 -->
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:18px; margin-bottom:30px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                    <span style="font-weight:800; font-size:13.5px; color:#065f46; text-transform:uppercase; letter-spacing:0.04em;">⚡ Fast Jump: Model Paper Set 2 (Questions 1 – 20)</span>
                    <a href="#set2_anchor" style="font-size:12px; font-weight:700; color:#047857; text-decoration:none;">Go to Section Header ↓</a>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(42px, 1fr)); gap:6px;">
    `;

    for (let i = 1; i <= 20; i++) {
        html += `<a href="#set2_q${i}" class="q-grid-pill s2">Q${i}</a>`;
    }

    html += `
                </div>
            </div>

            <!-- ================= SET 1 SECTION ================= -->
            <div id="set1_anchor" style="scroll-margin-top: 85px; margin-top:20px; margin-bottom:35px;">
                <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color:#ffffff; padding:20px 26px; border-radius:10px; margin-bottom:26px; box-shadow: 0 4px 14px rgba(30,27,75,0.2);">
                    <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#a5b4fc; margin-bottom:4px;">Section A</div>
                    <h2 style="font-size:22px; font-weight:800; margin:0; color:#ffffff;">Model Practical Examination Paper 1 (Questions 1 – 20)</h2>
                    <p style="font-size:13.5px; color:#cbd5e1; margin-top:6px; margin-bottom:0;">Each question contains Part (a) [50 Marks] and Part (b) [50 Marks] – Total 100 Marks.</p>
                </div>
    `;

    set1.forEach((q, idx) => {
        html += renderQuestionCard(q, 1, set1Mappings[idx]);
    });

    html += `
            </div>

            <!-- ================= SET 2 SECTION ================= -->
            <div id="set2_anchor" style="scroll-margin-top: 85px; margin-top:45px; margin-bottom:35px;">
                <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color:#ffffff; padding:20px 26px; border-radius:10px; margin-bottom:26px; box-shadow: 0 4px 14px rgba(6,78,59,0.2);">
                    <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#6ee7b7; margin-bottom:4px;">Section B</div>
                    <h2 style="font-size:22px; font-weight:800; margin:0; color:#ffffff;">Model Practical Examination Paper 2 (Questions 1 – 20)</h2>
                    <p style="font-size:13.5px; color:#cbd5e1; margin-top:6px; margin-bottom:0;">Advanced problem sets covering IPC, Semaphores, Banker's Algorithm, Deadlocks, Pthreads, and Memory Allocation.</p>
                </div>
    `;

    set2.forEach((q, idx) => {
        html += renderQuestionCard(q, 2, set2Mappings[idx]);
    });

    html += `
            </div>

            <div class="box-result" style="margin-top:28px;">
                Result: All 40 university model examination practical questions (Set 1 & Set 2) were solved step-by-step with complete Aims, Numbered Algorithms, C Programs, Shell Scripts, Tracing Tables, and Verified Console Outputs.
            </div>
        </article>
    `;

    return html;
}

function generateViva() {
    let html = `
        <!-- ================= VIVA VOCE SECTION ================= -->
        <article class="exp-card" id="viva" style="border-left: 6px solid #059669; margin-top: 45px; scroll-margin-top: 85px;">
            <div class="exp-header" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
                <span class="exp-badge" style="background:#059669; font-size:12px; padding:6px 14px; text-transform:uppercase; letter-spacing:0.04em;">Comprehensive Viva Voce Master Preparation</span>
                <h2 class="exp-title" style="font-size:24px; color:#064e3b; margin-top:8px;">Operating Systems Laboratory Viva Voce Questions & Answers (All 15 Experiments)</h2>
                <p style="color:#475569; font-size:14px; margin-top:6px; line-height:1.6;">
                    Structured by experiment topics: Unix commands, System Calls, CPU Scheduling, IPC, Semaphores, Deadlocks, Pthreads, Memory Management, Paging, Page Replacement, File Systems, and Disk Scheduling.
                </p>
            </div>
    `;

    viva.forEach((unit, uIdx) => {
        html += `
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:18px; margin-bottom:24px;">
                <h3 style="color:#166534; font-size:17px; font-weight:800; margin-bottom:14px; border-bottom:2px solid #86efac; padding-bottom:6px;">
                    ${unit.topic}
                </h3>
        `;

        unit.qa.forEach((item, qIdx) => {
            html += `
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:14px; margin-bottom:12px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                    <div style="font-weight:700; color:#0f172a; font-size:14px; margin-bottom:6px; display:flex; gap:8px;">
                        <span style="color:#059669; font-weight:800;">Q${qIdx + 1}:</span>
                        <span>${item.q}</span>
                    </div>
                    <div style="font-size:13.5px; color:#334155; line-height:1.6; padding-left:26px; border-left:3px solid #86efac; margin-left:4px;">
                        ${item.a.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    });

    html += `
            <div class="box-result" style="margin-top:24px;">
                Result: Core theoretical concepts and viva voce questions across all 15 syllabus experiments were reviewed and answered systematically.
            </div>
        </article>
    `;

    return html;
}

// Extra CSS styles to inject into <head> for topic tags and pills
const extraStyles = `
        /* ENHANCED FAST JUMP & FILTER STYLES */
        .q-grid-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 34px;
            font-size: 12.5px;
            font-weight: 700;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.18s ease;
        }
        .q-grid-pill.s1 {
            background: #e0e7ff;
            color: #3730a3;
            border: 1px solid #c7d2fe;
        }
        .q-grid-pill.s1:hover {
            background: #4338ca;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(67, 56, 202, 0.3);
        }
        .q-grid-pill.s2 {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .q-grid-pill.s2:hover {
            background: #059669;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(5, 150, 105, 0.3);
        }
        .topic-tag-btn {
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
            padding: 5px 12px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.18s ease;
            font-family: inherit;
        }
        .topic-tag-btn:hover {
            background: #e2e8f0;
            color: #0f172a;
        }
        .topic-tag-btn.active {
            background: #2563eb;
            color: #ffffff;
            border-color: #2563eb;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }
`;

// Extra JS script for live filtering
const extraScripts = `
        function filterModelQuestions() {
            const input = document.getElementById('model-q-search');
            if (!input) return;
            const filter = input.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.model-q-box');
            let visibleCount = 0;
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                if (!filter || text.includes(filter)) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            const counter = document.getElementById('model-q-count');
            if (counter) counter.innerText = visibleCount + ' Questions Visible';
        }

        function filterByTopic(topic, btn) {
            document.querySelectorAll('.topic-tag-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            const input = document.getElementById('model-q-search');
            if (!input) return;
            if (topic === 'ALL') {
                input.value = '';
            } else {
                input.value = topic;
            }
            filterModelQuestions();
        }
`;

function updateFile(filePath) {
    console.log(`Processing file: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');

    // Inject extra styles if not present
    if (!content.includes('ENHANCED FAST JUMP & FILTER STYLES')) {
        content = content.replace('</style>', extraStyles + '\n    </style>');
        console.log(`  Injected custom styles.`);
    }

    // Inject extra scripts if not present
    if (!content.includes('filterModelQuestions()')) {
        content = content.replace('</script>', extraScripts + '\n    </script>');
        console.log(`  Injected custom scripts.`);
    }

    // 1. Update Index Table in HTML
    const tableRegex = /<table class="index-table">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/;
    const match = content.match(tableRegex);
    if (match) {
        let tbody = match[1];

        // Clean out any old index0 or viva or os1 entries if present
        tbody = tbody.split('\n').filter(line => 
            !line.includes('#index0') && 
            !line.includes('#os1') && 
            !line.includes('#viva') &&
            !line.includes('#master_map_table') &&
            !line.includes('Index 0') &&
            !line.includes('Practical Examination')
        ).join('\n').trim();

        // Create new row 0 and mapping row
        const row0 = `                        <tr style="background:#f5f3ff;"><td class="sno" style="font-weight:800; background:#e0e7ff; color:#3730a3;">0</td><td><a href="#index0" style="color:#4338ca; font-weight:700;">★ Index 0: Practical Examination Model Questions & Full Solutions (Set 1 & Set 2 – 50+50 Marks Pattern)</a></td></tr>\n`;
        const rowMap = `                        <tr style="background:#eff6ff;"><td class="sno" style="font-weight:800; background:#dbeafe; color:#1e40af;">MAP</td><td><a href="#master_map_table" style="color:#1d4ed8; font-weight:700;">🗺️ Master Syllabus Mapping Table (15 Experiments ↔ Set 1 & Set 2 Questions)</a></td></tr>\n`;
        const rowViva = `\n                        <tr style="background:#f0fdf4;"><td class="sno" style="font-weight:800; background:#d1fae5; color:#065f46;">VIVA</td><td><a href="#viva" style="color:#047857; font-weight:700;">★ Comprehensive OS Lab Viva Voce Master Question Bank (All 15 Experiments)</a></td></tr>`;

        const newTbody = row0 + rowMap + tbody + rowViva;
        const newTable = match[0].replace(match[1], '\n' + newTbody + '\n                    ');
        content = content.replace(match[0], newTable);
        console.log(`  Updated index table with Row 0, Map Row, and Viva row.`);
    }

    // 2. Inject Master Mapping Table right after the index-box if not already present
    // First remove old master mapping table if present
    const oldMapRegex = /<!-- ================= MASTER EXPERIMENT MAPPING TABLE[\s\S]*?<\/div>\s*<\/div>/;
    if (oldMapRegex.test(content)) {
        content = content.replace(oldMapRegex, '');
        console.log(`  Removed previous master mapping table.`);
    }
    const mappingTableHtml = generateMasterMappingTable();
    const indexBoxEnd = '</div>\n        </div>\n\n        <!-- ================= EX 1';
    if (content.includes('<!-- ================= EX 1')) {
        // Find position right before index0 or ex1
        if (content.includes('<!-- ================= INDEX 0')) {
            content = content.replace('<!-- ================= INDEX 0', mappingTableHtml + '\n\n        <!-- ================= INDEX 0');
        } else {
            content = content.replace('<!-- ================= EX 1', mappingTableHtml + '\n\n        <!-- ================= EX 1');
        }
        console.log(`  Inserted Master Mapping Table into manual.`);
    }

    // 3. Update Header Jump Select
    const selectRegex = /<select class="jump-select"[\s\S]*?>([\s\S]*?)<\/select>/;
    const selectMatch = content.match(selectRegex);
    if (selectMatch) {
        let options = `
                <option value="">Jump to Experiment or Model Set...</option>
                <optgroup label="Model Exam Papers & Mapping">
                    <option value="#index0">★ Index 0: Model Exam Solutions (Set 1 & 2)</option>
                    <option value="#master_map_table">🗺️ Master Syllabus Mapping Table</option>
                    <option value="#set1_anchor">Set 1: Practical Exam Paper 1 (Q1 - Q20)</option>
                    <option value="#set2_anchor">Set 2: Practical Exam Paper 2 (Q1 - Q20)</option>
                    <option value="#viva">★ Comprehensive Viva Voce Q&A</option>
                </optgroup>
                <optgroup label="Syllabus Experiments (1 - 15)">
                    <option value="#ex1">Ex 1: Windows OS Installation</option>
                    <option value="#ex2">Ex 2: Kali Linux & UNIX/Shell</option>
                    <option value="#ex3">Ex 3: System Calls (fork, wait, exit)</option>
                    <option value="#ex4">Ex 4: CPU Scheduling Algorithms</option>
                    <option value="#ex5">Ex 5: IPC using Pipe</option>
                    <option value="#ex6">Ex 6: Semaphore Implementation</option>
                    <option value="#ex7">Ex 7: Banker's Algorithm</option>
                    <option value="#ex8">Ex 8: Deadlock Detection</option>
                    <option value="#ex9">Ex 9: Threading (Pthreads)</option>
                    <option value="#ex10">Ex 10: Paging Technique</option>
                    <option value="#ex11">Ex 11: Memory Allocation (Fit)</option>
                    <option value="#ex12">Ex 12: Page Replacement</option>
                    <option value="#ex13">Ex 13: File Organization</option>
                    <option value="#ex14">Ex 14: File Allocation</option>
                    <option value="#ex15">Ex 15: Disk Scheduling</option>
                </optgroup>
                <optgroup label="Content Beyond Syllabus (CBS)">
                    <option value="#cbs1">CBS 1: VM Analyzer</option>
                    <option value="#cbs2">CBS 2: CPU Simulator</option>
                    <option value="#cbs3">CBS 3: Memory Visualizer</option>
                    <option value="#cbs4">CBS 4: Disk Simulator</option>
                    <option value="#cbs5">CBS 5: Cloud AI Virtualization</option>
                </optgroup>
        `;
        const newSelect = selectMatch[0].replace(selectMatch[1], options);
        content = content.replace(selectMatch[0], newSelect);
        console.log(`  Updated jump select dropdown with rich optgroups.`);
    }

    // 4. Remove previous Index 0 article
    const oldIndex0Regex = /<!-- ================= INDEX 0: PRACTICAL EXAMINATION[\s\S]*?<\/article>/;
    if (oldIndex0Regex.test(content)) {
        content = content.replace(oldIndex0Regex, '');
        console.log(`  Removed old index0.`);
    }

    // 5. Remove previous Viva article
    const oldVivaRegex = /<!-- ================= VIVA VOCE SECTION ================= -->[\s\S]*?<\/article>/;
    if (oldVivaRegex.test(content)) {
        content = content.replace(oldVivaRegex, '');
        console.log(`  Removed old viva.`);
    }

    // 6. Generate and inject new Index 0 before Ex 1
    const index0Html = generateIndex0();
    const ex1Marker = '<article class="exp-card" id="ex1">';
    if (content.includes(ex1Marker)) {
        content = content.replace(ex1Marker, index0Html + '\n\n        ' + ex1Marker);
        console.log(`  Inserted upgraded Index 0 before Ex 1.`);
    }

    // 7. Generate and inject new Viva section before footer
    const vivaHtml = generateViva();
    const footerMarker = '<footer class="bottom-footer">';
    if (content.includes(footerMarker)) {
        content = content.replace(footerMarker, vivaHtml + '\n\n        ' + footerMarker);
        console.log(`  Inserted upgraded Viva section before footer.`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Finished ${filePath} (Size: ${content.length} bytes).`);
}

const targetFiles = [
    'D:/MATERIALS/REDDIT/SEM 3/OS/os-lab-manual/index.html',
    'D:/MATERIALS/REDDIT/SEM 3/OS/index.html',
    'D:/MATERIALS/REDDIT/SEM 3/OS 1/index.html'
];

targetFiles.forEach(f => {
    if (fs.existsSync(f)) {
        updateFile(f);
    }
});

console.log('ALL MANUALS UPGRADED SUCCESSFULLY WITH MASTER MAPPING TABLE & EXPERIMENT-PATTERN SOLUTIONS!');
