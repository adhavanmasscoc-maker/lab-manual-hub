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

function getFormattedAlgorithm(qText, isShell) {
    const text = qText.toLowerCase();
    if (text.includes("fifo") && text.includes("page")) {
        return [
            "Step 1: Start the program and declare variables for reference string, memory frames, page faults, hits, and victim frame pointer.",
            "Step 2: Initialize all frame slots with -1 to indicate that physical memory frames are currently empty.",
            "Step 3: Read each page reference from the reference string one by one in sequential arrival order.",
            "Step 4: Check if the incoming page is already present in any allocated frame slot. If found, mark as PAGE HIT and proceed to next reference.",
            "Step 5: If the page is not found (PAGE FAULT), check if free frames exist. If available, allocate the empty frame directly.",
            "Step 6: If all frames are occupied, apply FIFO replacement: replace the frame at index 'victim_ptr' and advance the circular pointer: victim_ptr = (victim_ptr + 1) % total_frames.",
            "Step 7: Increment page fault counter and display the intermediate contents of all memory frames after replacement.",
            "Step 8: Compute final metrics: Hit Ratio = (Hits / Total) * 100 and Fault Ratio = (Faults / Total) * 100, then terminate."
        ];
    } else if (text.includes("deadlock") && (text.includes("detection") || text.includes("matrix"))) {
        return [
            "Step 1: Start the program and define Available resource vector, Allocation matrix, and Request matrix.",
            "Step 2: Initialize Work vector equal to Available vector: Work[j] = Available[j] for all resource types j.",
            "Step 3: Initialize Finish array: For all processes i, if Allocation[i][j] != 0 for any j, set Finish[i] = false; otherwise set Finish[i] = true.",
            "Step 4: Search for an index i such that Finish[i] == false and Request[i][j] <= Work[j] for all resource types j.",
            "Step 5: If such an index i is found, simulate resource reclamation: Work[j] = Work[j] + Allocation[i][j], set Finish[i] = true, and repeat Step 4.",
            "Step 6: If no such index i can be found and there exists any process with Finish[i] == false, declare that process i is in a DEADLOCKED state.",
            "Step 7: Print the identification numbers of all deadlocked processes and report system deadlock status, then terminate."
        ];
    } else if (text.includes("banker")) {
        return [
            "Step 1: Start the program and input the number of processes, resource types, Allocation matrix, and Max matrix.",
            "Step 2: Calculate the Need matrix: Need[i][j] = Max[i][j] - Allocation[i][j] for all processes and resources.",
            "Step 3: Initialize Work vector = Available vector and Finish[i] = false for all processes i.",
            "Step 4: Search for an index i such that Finish[i] == false and Need[i][j] <= Work[j] for all j.",
            "Step 5: If found, assume process i finishes: Work[j] = Work[j] + Allocation[i][j], Finish[i] = true, and append process i to the safe sequence list.",
            "Step 6: Repeat Steps 4 and 5 until all processes are marked Finish[i] == true (Safe State) or no eligible process exists (Unsafe State).",
            "Step 7: If all processes finish, display the valid Safe Execution Sequence; otherwise display 'Deadlock imminent / Unsafe state', then terminate."
        ];
    } else if (text.includes("fcfs")) {
        return [
            "Step 1: Start the program and input the number of processes and their corresponding CPU Burst Times (BT).",
            "Step 2: Set Waiting Time of the first arriving process to zero: WT[0] = 0, and Turnaround Time TAT[0] = BT[0].",
            "Step 3: For each subsequent process i from 1 to n-1, calculate Waiting Time: WT[i] = WT[i-1] + BT[i-1].",
            "Step 4: Compute Turnaround Time for each process: TAT[i] = WT[i] + BT[i].",
            "Step 5: Accumulate total Waiting Time and total Turnaround Time across all processes.",
            "Step 6: Calculate Average Waiting Time = Total_WT / n and Average Turnaround Time = Total_TAT / n.",
            "Step 7: Print formatted table showing Process ID, Burst Time, Waiting Time, and Turnaround Time, then terminate."
        ];
    } else if (text.includes("sjf")) {
        return [
            "Step 1: Start the program and input the number of processes along with their CPU Burst Times.",
            "Step 2: Sort the processes in ascending order of their Burst Times using standard bubble sort.",
            "Step 3: Assign Waiting Time of the shortest job to zero: WT[0] = 0.",
            "Step 4: Iteratively compute Waiting Time for remaining jobs: WT[i] = WT[i-1] + BT[i-1].",
            "Step 5: Compute Turnaround Time for each job: TAT[i] = WT[i] + BT[i].",
            "Step 6: Calculate Average Waiting Time and Average Turnaround Time.",
            "Step 7: Print the sorted execution sequence, process metrics, and averages, then terminate."
        ];
    } else if (text.includes("priority")) {
        return [
            "Step 1: Start the program and read the number of processes, Burst Times, and Priority integer values.",
            "Step 2: Sort the processes in ascending order of Priority values (lower number represents higher priority).",
            "Step 3: Set Waiting Time for the highest priority process to 0: WT[0] = 0.",
            "Step 4: Calculate Waiting Time for subsequent processes: WT[i] = WT[i-1] + BT[i-1].",
            "Step 5: Calculate Turnaround Time for each process: TAT[i] = WT[i] + BT[i].",
            "Step 6: Compute Average Waiting Time and Average Turnaround Time.",
            "Step 7: Display the priority-ordered schedule table and summary averages, then terminate."
        ];
    } else if (text.includes("round robin")) {
        return [
            "Step 1: Start the program and input the number of processes, Burst Times, and Time Quantum (Q).",
            "Step 2: Create a copy of Burst Times into remaining burst time array rem_bt[]. Initialize current time t = 0.",
            "Step 3: Traverse processes in circular ready queue order.",
            "Step 4: If rem_bt[i] > Q, increment current time t by Q, and decrement rem_bt[i] by Q.",
            "Step 5: If rem_bt[i] <= Q and rem_bt[i] > 0, increment time t by rem_bt[i], compute Waiting Time WT[i] = t - BT[i], and set rem_bt[i] = 0.",
            "Step 6: Repeat until all processes have rem_bt[i] == 0.",
            "Step 7: Compute TAT[i] = BT[i] + WT[i], calculate averages, and print formatted schedule output, then terminate."
        ];
    } else if (text.includes("pipe")) {
        return [
            "Step 1: Start the program and declare a two-element integer array for file descriptors: fd[2].",
            "Step 2: Call the system call pipe(fd) to create an anonymous unidirectional kernel buffer. Check for creation errors.",
            "Step 3: Invoke fork() system call to create a child process.",
            "Step 4: In the Writer process, close the unused reading file descriptor fd[0] using close(fd[0]).",
            "Step 5: Write the string message to fd[1] using write(fd[1], buffer, length) and close fd[1].",
            "Step 6: In the Reader process, close the unused writing file descriptor fd[1] using close(fd[1]).",
            "Step 7: Read the message from fd[0] using read(fd[0], buffer, size), display the content on console, and close fd[0].",
            "Step 8: Synchronize parent and child using wait() and terminate cleanly."
        ];
    } else if (text.includes("semaphore") || text.includes("mutex")) {
        return [
            "Step 1: Start the program, include <semaphore.h>, and declare a semaphore variable of type sem_t.",
            "Step 2: Initialize the semaphore using sem_init(&sem, 0, 1) to configure a binary mutual exclusion lock.",
            "Step 3: Spawn concurrent execution threads or processes that require access to the shared critical section.",
            "Step 4: In Entry Section, invoke sem_wait(&sem) (P-operation). The thread decrements the semaphore and acquires lock.",
            "Step 5: Execute the Critical Section: update the shared resource exclusively without race conditions.",
            "Step 6: In Exit Section, invoke sem_post(&sem) (V-operation). The thread increments the semaphore and awakens any waiting threads.",
            "Step 7: Join all threads with pthread_join() and destroy the semaphore using sem_destroy(&sem), then terminate."
        ];
    } else if (text.includes("best fit")) {
        return [
            "Step 1: Start the program and input available memory block sizes and incoming process memory requests.",
            "Step 2: Initialize the allocation array with -1 to indicate all processes are initially unallocated.",
            "Step 3: For each process request, search through all available memory blocks.",
            "Step 4: Among all blocks whose size is >= process size, find the block index that has the minimum remaining space: min(blockSize - processSize).",
            "Step 5: If an optimal block is found, allocate it to the process, record the block index, and subtract process size from block capacity.",
            "Step 6: If no block can satisfy the process, flag it as 'Not Allocated / Must Wait'.",
            "Step 7: Display the final allocation table showing Process ID, Process Size, Allocated Block, and Internal Fragmentation, then terminate."
        ];
    } else if (text.includes("first fit")) {
        return [
            "Step 1: Start the program and input initial memory block sizes and process request sizes.",
            "Step 2: Initialize allocation array with -1.",
            "Step 3: For each process request, scan the memory blocks sequentially starting from the first block (index 0).",
            "Step 4: Allocate the process to the first block encountered whose capacity is >= process request.",
            "Step 5: Deduct the process size from the allocated block, record allocation, and immediately break to the next process.",
            "Step 6: If the end of memory blocks is reached without finding a fit, flag the process as unallocated.",
            "Step 7: Print the allocation summary table and remaining block capacities, then terminate."
        ];
    } else if (text.includes("paging") || text.includes("page table") || text.includes("logical address") || text.includes("offset")) {
        return [
            "Step 1: Start the program and configure Page Size (PS) and total number of pages in the process Page Table.",
            "Step 2: Read the Logical Address (LA) requested by the CPU.",
            "Step 3: Compute Page Number: page_no = LA / PS.",
            "Step 4: Compute Byte Offset: offset = LA % PS.",
            "Step 5: Check MMU bounds: If page_no >= Total_Pages, trigger internal Hardware Trap (Addressing Exception / Segmentation Fault SIGSEGV).",
            "Step 6: If page_no is valid, retrieve physical Frame Number from page table: frame_no = Page_Table[page_no].",
            "Step 7: Calculate Physical Address = (frame_no * PS) + offset and display translated physical address, then terminate."
        ];
    } else if (text.includes("fork") || text.includes("process creation")) {
        return [
            "Step 1: Start the program and declare a process identifier variable of type pid_t.",
            "Step 2: Call the fork() system call to create a child process duplicating the calling process context.",
            "Step 3: Check return value: If pid < 0, print fork failure message and exit with status 1.",
            "Step 4: If pid == 0 (Child context): Execute child-specific instructions and display child's PID using getpid() and parent's PID using getppid().",
            "Step 5: If pid > 0 (Parent context): Display parent's PID using getpid() and spawned child PID. Invoke wait(NULL) to prevent zombie creation.",
            "Step 6: Cleanly terminate both parent and child execution paths."
        ];
    } else if (text.includes("thread") || text.includes("pthread")) {
        return [
            "Step 1: Start the program, include <pthread.h>, and define worker thread callback functions.",
            "Step 2: Declare thread descriptors of type pthread_t in the main program.",
            "Step 3: Call pthread_create(&thread_id, NULL, worker_function, arg) to launch concurrent threads of execution.",
            "Step 4: Allow worker threads to execute their concurrent task loops.",
            "Step 5: Call pthread_join(thread_id, NULL) in the main thread to suspend main execution until target threads complete.",
            "Step 6: Print thread termination confirmation and terminate main process."
        ];
    } else {
        return [
            "Step 1: Start the program and initialize operating system parameters.",
            "Step 2: Allocate required memory buffers and validate input parameters.",
            "Step 3: Execute the core algorithmic logic ensuring adherence to OS synchronization and scheduling standards.",
            "Step 4: Format and print console output tables and execution verification metrics.",
            "Step 5: Release system resources and terminate program execution cleanly."
        ];
    }
}

function getSampleInput(qText) {
    const text = qText.toLowerCase();
    if (text.includes("1 2 3 4 1 2 5")) {
        return "Reference String = 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 | Frame Capacity = 4 Frames";
    } else if (text.includes("7 0 1 2 0 3 0 4 2 3 0 3 2")) {
        return "Reference String = 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2 | Frame Capacity = 3 Frames";
    } else if (text.includes("5, 3, 8, 6") || text.includes("5 3 8 6")) {
        return "Processes = [P1, P2, P3, P4] | Burst Times = [5, 3, 8, 6] ms | Arrival Times = [0, 0, 0, 0] ms";
    } else if (text.includes("500, 200, 300, 600")) {
        return "Memory Blocks = [500, 200, 300, 600] KB | Process Requests = [357, 129, 191] KB";
    } else if (text.includes("100, 500, 200, 300, 600")) {
        return "Memory Blocks = [100, 500, 200, 300, 600] KB | Process Requests = [212, 417, 112, 426] KB";
    } else if (text.includes("logical address") || text.includes("offset")) {
        return "Logical Address = 2500 bytes (or 7250 bytes) | Page Size = 1024 bytes (1 KB)";
    } else if (text.includes("three given numbers") || text.includes("greatest")) {
        return "Number A = 48, Number B = 95, Number C = 72";
    } else if (text.includes("fibonacci")) {
        return "Upper Limit Limit N = 50";
    } else if (text.includes("odd numbers")) {
        return "Upper Limit N = 15";
    } else if (text.includes("banker")) {
        return "5 Processes (P0–P4), 3 Resources (A, B, C), Available = [3, 3, 2], Allocation Matrix & Max Matrix";
    } else if (text.includes("deadlock")) {
        return "Allocation Matrix [5x3], Request Matrix [5x3], Available Vector = [0, 0, 0]";
    } else if (text.includes("quantum")) {
        return "Processes = [P1, P2, P3] | Burst Times = [5, 4, 3] ms | Time Quantum Q = 2 ms";
    } else {
        return "Standard POSIX test parameters and terminal arguments.";
    }
}

function getVivaTakeaways(qText, topic) {
    const text = qText.toLowerCase();
    if (text.includes("deadlock")) {
        return [
            { q: "What is the computational complexity of Deadlock Detection with multiple resource instances?", a: "O(m × n²), where m is the number of resource types and n is the number of processes in the system." },
            { q: "Why is a cycle in a Resource Allocation Graph not a sufficient condition for deadlock in multi-instance systems?", a: "Because multiple resource instances allow other processes outside the cycle to release instances, which may satisfy a process inside the cycle and break the wait." }
        ];
    } else if (text.includes("fifo") || text.includes("page replacement") || text.includes("lru")) {
        return [
            { q: "What is Belady's Anomaly and which algorithms are immune to it?", a: "Belady's Anomaly is the counter-intuitive phenomenon where increasing the number of physical frames increases the number of page faults. FIFO is subject to it; stack algorithms like LRU and Optimal are strictly immune." },
            { q: "Why is the Optimal page replacement algorithm impossible to implement in production operating systems?", a: "Because it requires future knowledge of all upcoming memory page references, which cannot be known in advance in a general-purpose OS." }
        ];
    } else if (text.includes("fork") || text.includes("process")) {
        return [
            { q: "What does fork() return in the parent, child, and on failure?", a: "fork() returns -1 on error, 0 to the newly created child process, and the child's positive PID to the parent process." },
            { q: "What is an Orphan process versus a Zombie process?", a: "An Orphan process is a running child whose parent has terminated (adopted by init/systemd). A Zombie process is a terminated process whose exit status has not yet been read by its parent via wait()." }
        ];
    } else if (text.includes("scheduling") || text.includes("fcfs") || text.includes("sjf") || text.includes("round robin")) {
        return [
            { q: "What is the Convoy Effect in FCFS scheduling?", a: "The Convoy Effect occurs when numerous short I/O-bound processes are blocked waiting behind a single long CPU-bound process, causing high average waiting time." },
            { q: "What is the consequence of choosing a Time Quantum that is either too large or too small in Round Robin?", a: "Too large: RR degenerates into FCFS. Too small: CPU spends excessive time performing context switches instead of executing user code." }
        ];
    } else if (text.includes("pipe") || text.includes("ipc")) {
        return [
            { q: "What is the difference between an Anonymous Pipe and a Named Pipe (FIFO)?", a: "Anonymous pipes are half-duplex, kernel-buffered channels shared only between related processes (parent-child). Named pipes exist as filesystem nodes and allow unrelated processes to communicate." }
        ];
    } else if (text.includes("semaphore") || text.includes("mutex")) {
        return [
            { q: "What are the three criteria for a valid solution to the Critical Section problem?", a: "1) Mutual Exclusion (at most one process in CS), 2) Progress (selection of next process cannot be stalled indefinitely), and 3) Bounded Waiting (finite limit on entries before a waiting process is admitted)." }
        ];
    } else if (text.includes("best fit") || text.includes("first fit") || text.includes("fragmentation")) {
        return [
            { q: "What is the difference between Internal and External Fragmentation?", a: "Internal fragmentation is wasted space inside an allocated partition. External fragmentation occurs when total free memory is sufficient, but partitioned into non-contiguous holes too small to fit a process." }
        ];
    } else {
        return [
            { q: "What distinguishes User Mode from Kernel Mode in an OS?", a: "User Mode executes unprivileged user applications with limited hardware access. Kernel Mode executes privileged OS instructions with unrestricted access to memory and CPU registers." }
        ];
    }
}

function renderQuestionCard(q, setNum, mapping) {
    const qId = `set${setNum}_q${q.num}`;
    const nextQId = q.num < 20 ? `#set${setNum}_q${q.num + 1}` : (setNum === 1 ? '#set2_q1' : '#viva');
    const prevQId = q.num > 1 ? `#set${setNum}_q${q.num - 1}` : (setNum === 2 ? '#set1_q20' : '#master_map_table');

    const algoA = getFormattedAlgorithm(q.partA.q, false);
    const sampleInputA = getSampleInput(q.partA.q);
    const resultA = `Result: The practical exam requirements for Part (a) were successfully formulated, executed, and verified.`;
    const vivaA = getVivaTakeaways(q.partA.q, mapping.topic);

    const algoB = getFormattedAlgorithm(q.partB.q, true);
    const sampleInputB = getSampleInput(q.partB.q);
    const resultB = `Result: The shell script requirements for Part (b) were successfully implemented and verified with valid test cases.`;
    const vivaB = getVivaTakeaways(q.partB.q, mapping.topic);

    return `
    <div class="model-q-box" id="${qId}" data-topic="${mapping.topic.toLowerCase()}" style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px; padding: 24px; margin-bottom: 45px; box-shadow: 0 4px 16px rgba(15,23,42,0.06); scroll-margin-top: 85px;">
        
        <!-- OFFICIAL UNIVERSITY PRACTICAL EXAM QUESTION PAPER SLIP -->
        <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #94a3b8; border-radius: 10px; padding: 18px 22px; margin-bottom: 24px; position: relative;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="font-weight: 800; font-size: 13px; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em;">
                    🏛️ ANNA UNIVERSITY / AUTONOMOUS EXAMINATIONS – PRACTICAL QUESTION PAPER SLIP
                </div>
                <div style="font-size: 12px; font-weight: 700; color: #475569;">
                    Course: CS5302 (OS Lab) | Time: 3 Hours | Max Marks: 100
                </div>
            </div>

            <!-- QUESTION HEADER WITH MAPPING -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                <h3 style="margin:0; font-size:18px; font-weight:800; color:#0f172a;">
                    QUESTION NO: ${q.num} (MODEL SET ${setNum})
                </h3>
                <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                    <a href="#${mapping.expId}" style="text-decoration:none; font-size:11.5px; font-weight:700; background:#e0f2fe; color:#0369a1; padding:3px 10px; border-radius:6px; border:1px solid #bae6fd;">
                        🔗 Mapped to Syllabus: ${mapping.exp} →
                    </a>
                    <span style="background:#e0e7ff; color:#3730a3; font-weight:800; font-size:11.5px; padding:3px 10px; border-radius:6px; border:1px solid #c7d2fe;">
                        Total: 100 Marks (50 + 50)
                    </span>
                </div>
            </div>

            <!-- FULL QUESTION STATEMENT PROMINENTLY BEFORE ANY ANSWERS -->
            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:14px 18px; margin-bottom:12px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.03);">
                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                        <span style="font-weight:800; color:#2563eb; font-size:14px; min-width:40px;">Q.${q.num} (a)</span>
                        <div style="flex:1; font-weight:700; color:#0f172a; font-size:14px; line-height:1.5;">${q.partA.q}</div>
                        <span style="background:#dbeafe; color:#1e40af; font-weight:800; font-size:11.5px; padding:2px 8px; border-radius:4px; white-space:nowrap;">[50 Marks]</span>
                    </div>
                </div>
                <div style="border-top:1px dashed #e2e8f0; margin:10px 0;"></div>
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                        <span style="font-weight:800; color:#059669; font-size:14px; min-width:40px;">Q.${q.num} (b)</span>
                        <div style="flex:1; font-weight:700; color:#0f172a; font-size:14px; line-height:1.5;">${q.partB.q}</div>
                        <span style="background:#d1fae5; color:#065f46; font-weight:800; font-size:11.5px; padding:2px 8px; border-radius:4px; white-space:nowrap;">[50 Marks]</span>
                    </div>
                </div>
            </div>

            <!-- OFFICIAL EXAM EVALUATION SCHEME -->
            <div style="display:flex; gap:6px; flex-wrap:wrap; font-size:11.5px; font-weight:700; color:#475569; align-items:center;">
                <span style="color:#0f172a;">Evaluation Breakdown per sub-question:</span>
                <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; border:1px solid #e2e8f0;">Aim & Specs: 10M</span>
                <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; border:1px solid #e2e8f0;">Algorithm: 10M</span>
                <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; border:1px solid #e2e8f0;">Source Code: 15M</span>
                <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; border:1px solid #e2e8f0;">Output & Result: 15M</span>
            </div>
        </div>

        <!-- QUICK TAB / VIEW SELECTOR FOR THIS QUESTION -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; gap:6px;">
                <button type="button" onclick="showSubQ('${qId}', 'all', this)" class="topic-tag-btn active">View Complete Solutions (A + B)</button>
                <button type="button" onclick="showSubQ('${qId}', 'partA', this)" class="topic-tag-btn">Part (a) Only [50M]</button>
                <button type="button" onclick="showSubQ('${qId}', 'partB', this)" class="topic-tag-btn">Part (b) Only [50M]</button>
            </div>
            <div style="display:flex; gap:6px;">
                <a href="#index0" style="text-decoration:none; font-size:12px; font-weight:700; background:#f1f5f9; color:#475569; padding:5px 10px; border-radius:6px; border:1px solid #cbd5e1;">↑ Question Matrix</a>
                <a href="${prevQId}" style="text-decoration:none; font-size:12px; font-weight:700; background:#f1f5f9; color:#475569; padding:5px 10px; border-radius:6px; border:1px solid #cbd5e1;">← Prev</a>
                <a href="${nextQId}" style="text-decoration:none; font-size:12px; font-weight:700; background:#f1f5f9; color:#475569; padding:5px 10px; border-radius:6px; border:1px solid #cbd5e1;">Next →</a>
            </div>
        </div>

        <!-- ================= COMPLETE STEP-BY-STEP ANSWER: PART A [50 MARKS] ================= -->
        <div class="sub-q-container partA" style="background:#f8fafc; border:2px solid #cbd5e1; border-left:6px solid #2563eb; border-radius:10px; padding:20px; margin-bottom:26px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
                <h4 style="color:#1e40af; font-size:16px; font-weight:800; margin:0;">
                    SOLUTION FOR PART (a) [MAX MARKS: 50]
                </h4>
                <span style="background:#dbeafe; color:#1e40af; font-weight:800; font-size:12px; padding:3px 10px; border-radius:4px;">50 Marks</span>
            </div>
            
            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:12px 14px; margin-bottom:14px;">
                <strong style="color:#1e40af; font-size:13px;">Exam Question Statement:</strong>
                <p style="margin:4px 0 0 0; font-weight:700; color:#0f172a; font-size:14px;">${q.partA.q}</p>
            </div>

            <div class="sub-sec-title">1. Aim / Objective</div>
            <p class="exp-content">${q.partA.aim}</p>

            <div class="sub-sec-title">2. System Specifications & Tools</div>
            <p class="exp-content"><strong>OS Environment:</strong> Linux / Kali Linux 6.x (POSIX Compliant) | <strong>Compiler:</strong> GCC 12.2+ (Flags: <code>-Wall -pthread</code>) | <strong>Standard:</strong> ISO C11 / POSIX IEEE 1003.1.</p>

            <div class="sub-sec-title">3. Formal Algorithm (Step-by-Step)</div>
            <div class="exp-content">
                <ol style="margin-left: 20px; margin-bottom: 12px; line-height:1.7;">
                    ${algoA.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
                </ol>
            </div>

            <div class="sub-sec-title">4. Theoretical Principles & Invariant Formulation</div>
            <div class="exp-content" style="background:#f1f5f9; padding:12px 16px; border-radius:6px; font-size:13.5px; color:#334155; line-height:1.6; margin-bottom:14px;">
                ${q.partA.principle.replace(/\n/g, '<br>')}
            </div>

            ${q.partA.table ? `
            <div class="sub-sec-title">5. Comparative Formulation Table</div>
            <div style="overflow-x:auto; margin-bottom:14px;">${q.partA.table}</div>` : ''}

            <div class="sub-sec-title">${q.partA.table ? '6' : '5'}. Sample Input Dataset & Test Case</div>
            <p class="exp-content"><code style="background:#e2e8f0; padding:4px 10px; border-radius:4px; font-family:'Fira Code', monospace; color:#0f172a; font-size:13px;">${sampleInputA}</code></p>

            ${q.partA.code ? `
            <div class="sub-sec-title">${q.partA.table ? '7' : '6'}. Standard C Program Implementation</div>
            <div class="code-wrapper">
                <div class="code-header">
                    <span>C Implementation (Part A – 50 Marks)</span>
                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${escapeHtml(q.partA.code)}</code></pre>
            </div>` : ''}

            ${q.partA.output ? `
            <div class="sub-sec-title">${q.partA.table ? '8' : '7'}. Compilation Command & Terminal Output Verification</div>
            <div class="output-box">$ gcc -Wall exam_part_a.c -o exam_part_a\n$ ./exam_part_a\n\n${escapeHtml(q.partA.output)}</div>` : ''}

            <div class="box-result" style="margin-top:14px;">
                ${resultA}
            </div>

            <!-- EXAMINER VIVA VOCE TAKEAWAYS -->
            <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:8px; padding:14px; margin-top:16px;">
                <div style="font-weight:800; color:#92400e; font-size:13px; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                    <span>🎓 Examiner Viva Voce Cross-Questions for Part (a):</span>
                </div>
                ${vivaA.map((v, i) => `
                    <div style="font-size:12.5px; color:#78350f; margin-bottom:6px;">
                        <strong>Q${i+1}: ${v.q}</strong><br>
                        <span style="color:#451a03;">Ans: ${v.a}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- ================= COMPLETE STEP-BY-STEP ANSWER: PART B [50 MARKS] ================= -->
        <div class="sub-q-container partB" style="background:#f8fafc; border:2px solid #cbd5e1; border-left:6px solid #059669; border-radius:10px; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
                <h4 style="color:#065f46; font-size:16px; font-weight:800; margin:0;">
                    SOLUTION FOR PART (b) [MAX MARKS: 50]
                </h4>
                <span style="background:#d1fae5; color:#065f46; font-weight:800; font-size:12px; padding:3px 10px; border-radius:4px;">50 Marks</span>
            </div>
            
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:12px 14px; margin-bottom:14px;">
                <strong style="color:#065f46; font-size:13px;">Exam Question Statement:</strong>
                <p style="margin:4px 0 0 0; font-weight:700; color:#0f172a; font-size:14px;">${q.partB.q}</p>
            </div>

            <div class="sub-sec-title">1. Aim / Objective</div>
            <p class="exp-content">${q.partB.aim}</p>

            <div class="sub-sec-title">2. Execution Environment</div>
            <p class="exp-content"><strong>Shell:</strong> GNU Bash 5.2+ (Bourne-Again Shell) | <strong>Execution Command:</strong> <code>chmod +x script.sh && ./script.sh</code></p>

            <div class="sub-sec-title">3. Formal Algorithm for Shell Script</div>
            <div class="exp-content">
                <ol style="margin-left: 20px; margin-bottom: 12px; line-height:1.7;">
                    ${algoB.map(step => `<li style="margin-bottom: 5px;">${step}</li>`).join('')}
                </ol>
            </div>

            <div class="sub-sec-title">4. Script Architecture & Control Logic</div>
            <div class="exp-content" style="background:#f1f5f9; padding:12px 16px; border-radius:6px; font-size:13.5px; color:#334155; line-height:1.6; margin-bottom:14px;">
                ${q.partB.principle.replace(/\n/g, '<br>')}
            </div>

            ${q.partB.table ? `
            <div class="sub-sec-title">5. Comparative Analysis Table</div>
            <div style="overflow-x:auto; margin-bottom:14px;">${q.partB.table}</div>` : ''}

            <div class="sub-sec-title">${q.partB.table ? '6' : '5'}. Sample Input Parameters</div>
            <p class="exp-content"><code style="background:#e2e8f0; padding:4px 10px; border-radius:4px; font-family:'Fira Code', monospace; color:#0f172a; font-size:13px;">${sampleInputB}</code></p>

            ${q.partB.code ? `
            <div class="sub-sec-title">${q.partB.table ? '7' : '6'}. Complete Shell Script Implementation</div>
            <div class="code-wrapper">
                <div class="code-header">
                    <span>Bash Shell Script (Part B – 50 Marks)</span>
                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${escapeHtml(q.partB.code)}</code></pre>
            </div>` : ''}

            ${q.partB.output ? `
            <div class="sub-sec-title">${q.partB.table ? '8' : '7'}. Terminal Execution & Output Verification</div>
            <div class="output-box">$ chmod +x exam_part_b.sh\n$ ./exam_part_b.sh\n\n${escapeHtml(q.partB.output)}</div>` : ''}

            <div class="box-result" style="margin-top:14px;">
                ${resultB}
            </div>

            <!-- EXAMINER VIVA VOCE TAKEAWAYS -->
            <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:8px; padding:14px; margin-top:16px;">
                <div style="font-weight:800; color:#92400e; font-size:13px; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                    <span>🎓 Examiner Viva Voce Cross-Questions for Part (b):</span>
                </div>
                ${vivaB.map((v, i) => `
                    <div style="font-size:12.5px; color:#78350f; margin-bottom:6px;">
                        <strong>Q${i+1}: ${v.q}</strong><br>
                        <span style="color:#451a03;">Ans: ${v.a}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- FOOTER NAV FOR QUESTION -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:18px; border-top:1px solid #e2e8f0; padding-top:12px; flex-wrap:wrap; gap:8px;">
            <div style="font-size:12px; color:#64748b; font-weight:600;">
                Question ${q.num} Complete (Part A: 50M + Part B: 50M = 100 Marks)
            </div>
            <div style="display:flex; gap:10px;">
                <a href="#index0" style="text-decoration:none; font-size:12.5px; font-weight:700; color:#2563eb;">↑ Jump to Question Grid</a>
                <span style="color:#cbd5e1;">|</span>
                <a href="#master_map_table" style="text-decoration:none; font-size:12.5px; font-weight:700; color:#2563eb;">↑ Master Mapping Table</a>
            </div>
        </div>
    </div>`;
}

function generateMasterMappingTable() {
    let html = `
    <!-- ================= MASTER EXPERIMENT MAPPING TABLE ================= -->
    <div class="index-box" id="master_map_table" style="background:#ffffff; border: 2px solid #cbd5e1; border-top: 6px solid #2563eb; margin-top:25px; margin-bottom:30px; box-shadow:0 4px 14px rgba(15,23,42,0.05);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px; border-bottom:2px solid #e2e8f0; padding-bottom:10px;">
            <div>
                <span style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; background:#dbeafe; color:#1e40af; padding:3px 10px; border-radius:4px;">Official Curriculum Cross-Reference</span>
                <h2 style="font-size:19px; font-weight:800; color:#0f172a; margin:4px 0 0 0;">
                    🗺️ MASTER SYLLABUS MAPPING TABLE (15 Experiments ↔ Set 1 & Set 2 Exam Questions)
                </h2>
            </div>
            <span style="background:#e0e7ff; color:#3730a3; font-weight:800; font-size:12.5px; padding:6px 12px; border-radius:6px; border:1px solid #c7d2fe;">40 Practical Questions Mapped</span>
        </div>
        <p style="font-size:13.5px; color:#475569; margin-bottom:16px; line-height:1.5;">
            Every single question asked in the University Practical Examination Question Bank corresponds directly to core syllabus experiments. Click on any question badge below to immediately jump to its official question paper statement and full 50+50 marks solution.
        </p>

        <div style="overflow-x:auto;">
            <table class="index-table" style="font-size:13px;">
                <thead>
                    <tr style="background:#f1f5f9;">
                        <th style="width:70px; text-align:center;">Ex. No</th>
                        <th style="width:280px;">Syllabus Experiment Title</th>
                        <th>Model Paper Set 1 Mapped Questions (100M Each)</th>
                        <th>Model Paper Set 2 Mapped Questions (100M Each)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    expList.forEach(exp => {
        const s1Matches = set1Mappings.filter(m => m.expId === exp.id);
        const s2Matches = set2Mappings.filter(m => m.expId === exp.id);

        let s1Badges = s1Matches.map(m => `
            <a href="#set1_q${m.num}" style="text-decoration:none; display:inline-block; margin:3px; padding:5px 9px; background:#e0e7ff; color:#3730a3; font-weight:700; border-radius:6px; font-size:12px; border:1px solid #c7d2fe; transition:all 0.15s;" onmouseover="this.style.background='#4338ca'; this.style.color='#fff';" onmouseout="this.style.background='#e0e7ff'; this.style.color='#3730a3';">
                Set 1 Q${m.num} →
            </a>
        `).join('') || '<span style="color:#94a3b8; font-style:italic;">None</span>';

        let s2Badges = s2Matches.map(m => `
            <a href="#set2_q${m.num}" style="text-decoration:none; display:inline-block; margin:3px; padding:5px 9px; background:#d1fae5; color:#065f46; font-weight:700; border-radius:6px; font-size:12px; border:1px solid #a7f3d0; transition:all 0.15s;" onmouseover="this.style.background='#059669'; this.style.color='#fff';" onmouseout="this.style.background='#d1fae5'; this.style.color='#065f46';">
                Set 2 Q${m.num} →
            </a>
        `).join('') || '<span style="color:#94a3b8; font-style:italic;">None</span>';

        html += `
            <tr>
                <td style="font-weight:800; text-align:center;"><a href="#${exp.id}" style="color:#2563eb; text-decoration:none; padding:3px 8px; background:#f1f5f9; border-radius:4px;">Ex. ${exp.exNo}</a></td>
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
        <article class="exp-card" id="index0" style="border-left: 6px solid #4f46e5; margin-bottom: 45px; scroll-margin-top: 85px;">
            <div class="exp-header" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
                <span class="exp-badge" style="background:#4f46e5; font-size:12px; padding:6px 14px; text-transform:uppercase; letter-spacing:0.04em;">Index 0 – University Practical Examination Model Solutions</span>
                <h2 class="exp-title" style="font-size:24px; color:#1e1b4b; margin-top:8px;">Operating Systems Practical Examination Master Solutions (100 Marks Pattern)</h2>
                <p style="color:#475569; font-size:14px; margin-top:6px; line-height:1.6;">
                    Rigorous, exam-tested solutions for all 40 questions across Model Set 1 and Set 2. Every question displays the <strong>Official Question Paper Slip</strong> with both parts before providing the complete step-by-step solutions (Aim, System Specs, Numbered Algorithms, Math Models, C Programs, Shell Scripts, Tracing Tables, Output Verification, and Examiner Viva Voce Takeaways).
                </p>
            </div>

            <!-- LIVE SEARCH & TOPIC FILTERING BAR -->
            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:18px; margin-bottom:24px; box-shadow:0 2px 8px rgba(15,23,42,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                    <span style="font-weight:800; font-size:14px; color:#0f172a;">🔍 Instant Question Search & Filter:</span>
                    <span id="model-q-count" style="font-size:12.5px; font-weight:700; color:#2563eb; background:#eff6ff; padding:3px 10px; border-radius:20px; border:1px solid #bfdbfe;">40 Questions Available</span>
                </div>
                
                <input type="text" id="model-q-search" placeholder="Type keyword (e.g., FIFO, Banker, FCFS, SJF, Semaphore, Pthreads, Best Fit, Pipe, Fork)..." onkeyup="filterModelQuestions()" style="width:100%; padding:11px 16px; font-size:14px; border:2px solid #cbd5e1; border-radius:8px; outline:none; transition:border-color 0.2s; font-family:inherit; margin-bottom:14px;" onfocus="this.style.borderColor='#2563eb';" onblur="this.style.borderColor='#cbd5e1';">
                
                <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                    <span style="font-size:12px; font-weight:700; color:#64748b; margin-right:4px;">Filter by Topic:</span>
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
        html += `<a href="#set1_q${i}" class="q-grid-pill s1" title="Jump to Set 1 Q${i}">Q${i}</a>`;
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
        html += `<a href="#set2_q${i}" class="q-grid-pill s2" title="Jump to Set 2 Q${i}">Q${i}</a>`;
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

// Extra CSS styles for the enhanced user-friendly exam UI
const extraStyles = `
        /* ENHANCED EXAM PAPER UI & SPEED DIAL STYLES */
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

        /* FLOATING SPEED-DIAL BAR */
        .floating-speed-dial {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            align-items: center;
            background: rgba(15, 23, 42, 0.92);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 6px 12px;
            border-radius: 999px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15);
            gap: 8px;
            transition: transform 0.2s ease;
        }
        .floating-speed-dial:hover {
            transform: translateY(-2px);
        }
        .speed-dial-btn {
            color: #f8fafc;
            text-decoration: none;
            font-size: 12px;
            font-weight: 700;
            padding: 6px 10px;
            border-radius: 999px;
            transition: background 0.15s ease, color 0.15s ease;
            background: transparent;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .speed-dial-btn:hover {
            background: #2563eb;
            color: #ffffff;
        }
        .speed-dial-btn.top-btn {
            background: rgba(255, 255, 255, 0.12);
        }
        .speed-dial-btn.top-btn:hover {
            background: #10b981;
        }
        @media (max-width: 768px) {
            .floating-speed-dial {
                bottom: 12px;
                right: 12px;
                padding: 4px 8px;
                gap: 4px;
            }
            .speed-dial-btn {
                font-size: 11px;
                padding: 4px 6px;
            }
        }
`;

// Extra JS script for live filtering & tab views
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

        function showSubQ(cardId, view, btn) {
            const card = document.getElementById(cardId);
            if (!card) return;
            const containerA = card.querySelector('.sub-q-container.partA');
            const containerB = card.querySelector('.sub-q-container.partB');
            const buttons = btn.parentElement.querySelectorAll('.topic-tag-btn');
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (view === 'partA') {
                if (containerA) containerA.style.display = 'block';
                if (containerB) containerB.style.display = 'none';
            } else if (view === 'partB') {
                if (containerA) containerA.style.display = 'none';
                if (containerB) containerB.style.display = 'block';
            } else {
                if (containerA) containerA.style.display = 'block';
                if (containerB) containerB.style.display = 'block';
            }
        }
`;

// Floating Speed Dial HTML
const floatingSpeedDialHtml = `
    <!-- FLOATING USER-FRIENDLY NAVIGATION SPEED-DIAL -->
    <div class="floating-speed-dial">
        <button onclick="window.scrollTo({top:0, behavior:'smooth'})" class="speed-dial-btn top-btn" title="Back to Top">↑ Top</button>
        <a href="#master_map_table" class="speed-dial-btn" title="Master Mapping Table">🗺️ Map</a>
        <a href="#index0" class="speed-dial-btn" title="Questions Grid">⚡ Q-Grid</a>
        <a href="#set1_anchor" class="speed-dial-btn" title="Model Paper 1">Set 1</a>
        <a href="#set2_anchor" class="speed-dial-btn" title="Model Paper 2">Set 2</a>
        <a href="#viva" class="speed-dial-btn" title="Viva Voce Q&A">🎓 Viva</a>
    </div>
`;

function updateFile(filePath) {
    console.log(`Processing file: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Inject or update custom styles
    if (content.includes('/* ENHANCED FAST JUMP & FILTER STYLES */')) {
        content = content.replace(/\/\* ENHANCED FAST JUMP & FILTER STYLES \*\/[\s\S]*?\.topic-tag-btn\.active\s*\{[\s\S]*?\}/, extraStyles.trim());
    } else if (content.includes('/* ENHANCED EXAM PAPER UI & SPEED DIAL STYLES */')) {
        content = content.replace(/\/\* ENHANCED EXAM PAPER UI & SPEED DIAL STYLES \*\/[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\}\s*\}/, extraStyles.trim());
    } else {
        content = content.replace('</style>', extraStyles + '\n    </style>');
    }
    console.log(`  Updated styles.`);

    // 2. Inject or update custom scripts
    if (content.includes('filterModelQuestions()')) {
        const oldScriptRegex = /function filterModelQuestions\(\)[\s\S]*?filterModelQuestions\(\);\s*\}/;
        content = content.replace(oldScriptRegex, extraScripts.trim());
    } else {
        content = content.replace('</script>', extraScripts + '\n    </script>');
    }
    console.log(`  Updated client-side scripts.`);

    // 3. Update Index Table in HTML
    const tableRegex = /<table class="index-table">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/;
    const match = content.match(tableRegex);
    if (match) {
        let tbody = match[1];

        tbody = tbody.split('\n').filter(line => 
            !line.includes('#index0') && 
            !line.includes('#os1') && 
            !line.includes('#viva') && 
            !line.includes('#master_map_table') &&
            !line.includes('Index 0') &&
            !line.includes('Practical Examination')
        ).join('\n').trim();

        const row0 = `                        <tr style="background:#f5f3ff;"><td class="sno" style="font-weight:800; background:#e0e7ff; color:#3730a3;">0</td><td><a href="#index0" style="color:#4338ca; font-weight:700;">★ Index 0: Practical Examination Model Questions & Full Solutions (Set 1 & Set 2 – 50+50 Marks Pattern)</a></td></tr>\n`;
        const rowMap = `                        <tr style="background:#eff6ff;"><td class="sno" style="font-weight:800; background:#dbeafe; color:#1e40af;">MAP</td><td><a href="#master_map_table" style="color:#1d4ed8; font-weight:700;">🗺️ Master Syllabus Mapping Table (15 Experiments ↔ Set 1 & Set 2 Questions)</a></td></tr>\n`;
        const rowViva = `\n                        <tr style="background:#f0fdf4;"><td class="sno" style="font-weight:800; background:#d1fae5; color:#065f46;">VIVA</td><td><a href="#viva" style="color:#047857; font-weight:700;">★ Comprehensive OS Lab Viva Voce Master Question Bank (All 15 Experiments)</a></td></tr>`;

        const newTbody = row0 + rowMap + tbody + rowViva;
        const newTable = match[0].replace(match[1], '\n' + newTbody + '\n                    ');
        content = content.replace(match[0], newTable);
        console.log(`  Updated index table.`);
    }

    // 4. Inject Master Mapping Table
    const oldMapRegex = /<!-- ================= MASTER EXPERIMENT MAPPING TABLE[\s\S]*?<\/div>\s*<\/div>/;
    if (oldMapRegex.test(content)) {
        content = content.replace(oldMapRegex, '');
    }
    const mappingTableHtml = generateMasterMappingTable();
    if (content.includes('<!-- ================= INDEX 0')) {
        content = content.replace('<!-- ================= INDEX 0', mappingTableHtml + '\n\n        <!-- ================= INDEX 0');
    } else if (content.includes('<!-- ================= EX 1')) {
        content = content.replace('<!-- ================= EX 1', mappingTableHtml + '\n\n        <!-- ================= EX 1');
    }
    console.log(`  Updated Master Mapping Table.`);

    // 5. Update Header Jump Select
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
        console.log(`  Updated jump select dropdown.`);
    }

    // 6. Remove previous Index 0 article
    const oldIndex0Regex = /<!-- ================= INDEX 0: PRACTICAL EXAMINATION[\s\S]*?<\/article>/;
    if (oldIndex0Regex.test(content)) {
        content = content.replace(oldIndex0Regex, '');
    }

    // 7. Remove previous Viva article
    const oldVivaRegex = /<!-- ================= VIVA VOCE SECTION ================= -->[\s\S]*?<\/article>/;
    if (oldVivaRegex.test(content)) {
        content = content.replace(oldVivaRegex, '');
    }

    // 8. Generate and inject new Index 0 before Ex 1
    const index0Html = generateIndex0();
    const ex1Marker = '<article class="exp-card" id="ex1">';
    if (content.includes(ex1Marker)) {
        content = content.replace(ex1Marker, index0Html + '\n\n        ' + ex1Marker);
        console.log(`  Inserted upgraded Index 0.`);
    }

    // 9. Generate and inject new Viva section before footer
    const vivaHtml = generateViva();
    const footerMarker = '<footer class="bottom-footer">';
    if (content.includes(footerMarker)) {
        content = content.replace(footerMarker, vivaHtml + '\n\n        ' + footerMarker);
        console.log(`  Inserted upgraded Viva section.`);
    }

    // 10. Inject Floating Speed-Dial before </body>
    if (content.includes('floating-speed-dial')) {
        const oldDialRegex = /<!-- FLOATING USER-FRIENDLY NAVIGATION SPEED-DIAL -->[\s\S]*?<\/div>/;
        content = content.replace(oldDialRegex, floatingSpeedDialHtml.trim());
    } else {
        content = content.replace('</body>', floatingSpeedDialHtml + '\n</body>');
    }
    console.log(`  Injected Floating Speed-Dial.`);

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

console.log('ALL MANUALS UPGRADED TO RIGOROUS EXAM PATTERN & USER-FRIENDLY UI!');
