// Set 1: Questions 1 to 20 (Each containing Part A [50 Marks] and Part B [50 Marks])
// Total: 20 Questions (2000 Marks equivalent model question bank)

module.exports = [
  {
    num: 1,
    title: "Deadlock Detection Algorithm (Single vs Multiple Instances) & Shell vs C Matrix Simulation",
    partA: {
      marks: 50,
      q: "Explain how the Deadlock Detection Algorithm differs when resources have multiple instances versus a single instance.",
      aim: "To analyze and compare the theoretical and structural differences between Deadlock Detection algorithms for single-instance resource models versus multi-instance resource systems.",
      principle: `Deadlock detection differs fundamentally depending on resource instance counts:
1. <strong>Single Instance of Each Resource Type:</strong>
   • Uses a <strong>Wait-For Graph (WFG)</strong>, obtained by collapsing resource nodes from the Resource Allocation Graph (RAG).
   • A directed edge <code>Pi → Pj</code> means process <code>Pi</code> is waiting for process <code>Pj</code> to release a resource.
   • <strong>Condition:</strong> A cycle in the WFG is a <em>necessary and sufficient condition</em> for deadlock (Cycle ⇔ Deadlock).
   • <strong>Complexity:</strong> Cycle detection via Depth First Search (DFS) or Tarjan's algorithm takes <code>O(V²)</code> or <code>O(V + E)</code> time.

2. <strong>Multiple Instances of Resource Types:</strong>
   • Wait-for graphs cannot detect deadlocks because a cycle in a multi-instance graph does <em>not</em> imply deadlock (other instances may become available).
   • Requires full matrix-based tracking: <strong>Allocation Matrix [n×m]</strong>, <strong>Request Matrix [n×m]</strong>, and <strong>Available Vector [m]</strong>.
   • Uses a reduction algorithm (Banker's style):
     a) <code>Work = Available</code>; For all <code>i</code>, if <code>Allocation[i] != 0</code> then <code>Finish[i] = false</code>, else <code>true</code>.
     b) Find an index <code>i</code> such that <code>Finish[i] == false</code> and <code>Request[i] <= Work</code>.
     c) If found: <code>Work = Work + Allocation[i]</code>; <code>Finish[i] = true</code>; Repeat step b.
     d) If no such <code>i</code> exists and some <code>Finish[i] == false</code>, then process <code>Pi</code> is deadlocked.
   • <strong>Complexity:</strong> <code>O(m × n²)</code> operations.`,
      table: `
<table class="index-table">
  <thead>
    <tr><th>Feature</th><th>Single-Instance Detection</th><th>Multiple-Instance Detection</th></tr>
  </thead>
  <tbody>
    <tr><td>Data Structure</td><td>Wait-For Graph (WFG) / Adjacency Matrix</td><td>Available [m], Allocation [n×m], Request [n×m]</td></tr>
    <tr><td>Deadlock Criterion</td><td>Simple Cycle in Graph (Cycle ⇔ Deadlock)</td><td>Unmarked processes after Matrix Reduction</td></tr>
    <tr><td>Cycle Sufficiency</td><td>Cycle is necessary AND sufficient</td><td>Cycle is necessary but NOT sufficient</td></tr>
    <tr><td>Algorithm</td><td>DFS / Cycle Finding (Tarjan / Kosaraju)</td><td>Work-Finish Vector State Reduction</td></tr>
    <tr><td>Time Complexity</td><td>O(n²) where n is number of processes</td><td>O(m × n²) where m = resources, n = processes</td></tr>
    <tr><td>Implementation Overhead</td><td>Low space & runtime overhead</td><td>High overhead; periodic invocation needed</td></tr>
  </tbody>
</table>`,
      code: `/* C Concept Representation: Single-Instance (Cycle Finding) vs Multi-Instance */
#include <stdio.h>
#include <stdbool.h>

#define MAX_PROC 10
#define MAX_RES 10

// Multi-Instance Detection Engine
bool detectMultiInstanceDeadlock(int n, int m, int alloc[MAX_PROC][MAX_RES], 
                                 int req[MAX_PROC][MAX_RES], int avail[MAX_RES], int deadlocked[]) {
    int work[MAX_RES];
    bool finish[MAX_PROC];
    int deadCount = 0;

    for (int j = 0; j < m; j++) work[j] = avail[j];
    for (int i = 0; i < n; i++) {
        bool hasAlloc = false;
        for (int j = 0; j < m; j++) if (alloc[i][j] != 0) { hasAlloc = true; break; }
        finish[i] = !hasAlloc;
    }

    bool progress;
    do {
        progress = false;
        for (int i = 0; i < n; i++) {
            if (!finish[i]) {
                bool canSatisfy = true;
                for (int j = 0; j < m; j++) {
                    if (req[i][j] > work[j]) { canSatisfy = false; break; }
                }
                if (canSatisfy) {
                    for (int j = 0; j < m; j++) work[j] += alloc[i][j];
                    finish[i] = true;
                    progress = true;
                }
            }
        }
    } while (progress);

    for (int i = 0; i < n; i++) {
        if (!finish[i]) deadlocked[deadCount++] = i;
    }
    return deadCount > 0;
}`,
      output: `[Theoretical Output Analysis]
If Graph = P0 -> P1 -> P2 -> P0:
Single-Instance Detection: CYCLE DETECTED! System is immediately flagged DEADLOCKED.
Multi-Instance Detection: Even if P0 requests R1 held by P1, if P2 finishes and releases R1,
P0 can proceed. No deadlock occurs. Matrix reduction confirms Finish[P0]=true, Finish[P1]=true.`
    },
    partB: {
      marks: 50,
      q: "Compare how the shell script simulates deadlock detection output versus the actual matrix-based computation in C.",
      aim: "To demonstrate the architectural and computational contrast between high-level shell script process simulation and rigorous low-level matrix-based algorithmic computation in C.",
      principle: `1. <strong>C Implementation:</strong>
   • Performs dynamic numeric matrix algebra on 2D arrays <code>Allocation[n][m]</code> and <code>Request[n][m]</code>.
   • Strictly evaluates whether vector inequalities <code>Request[i] ≤ Work</code> hold across all resource types.
   • Handles real operating system resource states, memory addresses, and execution safety invariants with mathematical precision.

2. <strong>Shell Script Simulation:</strong>
   • High-level string manipulation, pipeline processing, and process status parsing (e.g., using <code>ps -eo state,pid</code> or associative arrays).
   • Simulates state transitions by reading user-supplied lists of blocked process IDs or matching processes waiting indefinitely on named resources.
   • Serves as an educational visualization and administrative monitoring tool rather than an in-kernel arbiter.`,
      code: `#!/bin/bash
# Shell Script simulating Deadlock Detection vs C Matrix Computation
echo "=================================================="
echo "    SIMULATED SHELL SCRIPT DEADLOCK DETECTOR      "
echo "=================================================="

# Processes and their requested locks
declare -A holds
declare -A requests

holds["P0"]="R1"
requests["P0"]="R2"

holds["P1"]="R2"
requests["P1"]="R3"

holds["P2"]="R3"
requests["P2"]="R1"

echo "Current Resource Allocation & Requests:"
for p in "\${!holds[@]}"; do
    echo "  $p holds \${holds[$p]} and requests \${requests[$p]}"
done

# Detecting circular dependency in shell
echo -e "\\nTracing Dependencies..."
visited=""
curr="P0"
deadlock=0

while [ -n "$curr" ]; do
    visited="$visited $curr"
    req_res=\${requests[$curr]}
    next_proc=""
    for p in "\${!holds[@]}"; do
        if [ "\${holds[$p]}" == "$req_res" ]; then
            next_proc=$p
            break
        fi
    done

    echo "  $curr waits for $req_res held by $next_proc"
    if [[ "$visited" =~ "$next_proc" ]]; then
        echo -e "\\n>>> [ALERT] Circular wait detected involving: $visited $next_proc"
        echo ">>> System is in DEADLOCK state!"
        deadlock=1
        break
    fi
    curr=$next_proc
done

if [ $deadlock -eq 0 ]; then
    echo "No deadlock detected."
fi`,
      output: `==================================================
    SIMULATED SHELL SCRIPT DEADLOCK DETECTOR      
==================================================
Current Resource Allocation & Requests:
  P0 holds R1 and requests R2
  P1 holds R2 and requests R3
  P2 holds R3 and requests R1

Tracing Dependencies...
  P0 waits for R2 held by P1
  P1 waits for R3 held by P2
  P2 waits for R1 held by P0

>>> [ALERT] Circular wait detected involving:  P0 P1 P2 P0
>>> System is in DEADLOCK state!`
    }
  },

  {
    num: 2,
    title: "FIFO Page Replacement (C Program with 4 Frames & Shell Script Array Logic)",
    partA: {
      marks: 50,
      q: "Write a C program to implement FIFO page replacement for the reference string 1 2 3 4 1 2 5 1 2 3 4 5 with 4 frames.",
      aim: "To implement the First-In-First-Out (FIFO) page replacement algorithm in C for the given 12-page reference string using 4 memory frames and compute total page faults and hits.",
      principle: `FIFO replaces the oldest page loaded in physical memory.
A circular pointer or FIFO queue maintains the index of the frame to replace:
• If page is present in any frame: <strong>PAGE HIT</strong> (no replacement).
• If page is absent and empty frame exists: Insert page into empty frame -> <strong>PAGE FAULT</strong>.
• If page is absent and all frames full: Replace page at <code>victim_index = (victim_index + 1) % num_frames</code> -> <strong>PAGE FAULT</strong>.`,
      code: `#include <stdio.h>

#define FRAMES 4
#define REF_LEN 12

int main() {
    int ref_str[REF_LEN] = {1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5};
    int frames[FRAMES];
    int victim = 0;
    int page_faults = 0, page_hits = 0;

    for (int i = 0; i < FRAMES; i++) frames[i] = -1;

    printf("FIFO Page Replacement Simulation (Frames = %d)\\n", FRAMES);
    printf("Reference String: 1 2 3 4 1 2 5 1 2 3 4 5\\n\\n");
    printf("%-5s | %-16s | %-10s\\n", "Page", "Frame State", "Status");
    printf("-----------------------------------------\\n");

    for (int i = 0; i < REF_LEN; i++) {
        int page = ref_str[i];
        int hit = 0;

        for (int j = 0; j < FRAMES; j++) {
            if (frames[j] == page) {
                hit = 1;
                page_hits++;
                break;
            }
        }

        if (!hit) {
            frames[victim] = page;
            victim = (victim + 1) % FRAMES;
            page_faults++;
            printf("%-5d | [", page);
            for (int j = 0; j < FRAMES; j++) {
                if (frames[j] != -1) printf(" %d", frames[j]);
                else printf(" -");
            }
            printf(" ] | FAULT (F%d)\\n", victim == 0 ? FRAMES : victim);
        } else {
            printf("%-5d | [", page);
            for (int j = 0; j < FRAMES; j++) {
                if (frames[j] != -1) printf(" %d", frames[j]);
                else printf(" -");
            }
            printf(" ] | HIT\\n");
        }
    }

    printf("-----------------------------------------\\n");
    printf("Total References : %d\\n", REF_LEN);
    printf("Total Page Faults: %d\\n", page_faults);
    printf("Total Page Hits  : %d\\n", page_hits);
    printf("Hit Ratio        : %.2f%%\\n", ((float)page_hits / REF_LEN) * 100);
    printf("Fault Ratio      : %.2f%%\\n", ((float)page_faults / REF_LEN) * 100);

    return 0;
}`,
      output: `FIFO Page Replacement Simulation (Frames = 4)
Reference String: 1 2 3 4 1 2 5 1 2 3 4 5

Page  | Frame State      | Status    
-----------------------------------------
1     | [ 1 - - - ]      | FAULT (F1)
2     | [ 1 2 - - ]      | FAULT (F2)
3     | [ 1 2 3 - ]      | FAULT (F3)
4     | [ 1 2 3 4 ]      | FAULT (F4)
1     | [ 1 2 3 4 ]      | HIT
2     | [ 1 2 3 4 ]      | HIT
5     | [ 5 2 3 4 ]      | FAULT (F1)
1     | [ 5 1 3 4 ]      | FAULT (F2)
2     | [ 5 1 2 4 ]      | FAULT (F3)
3     | [ 5 1 2 3 ]      | FAULT (F4)
4     | [ 4 1 2 3 ]      | FAULT (F1)
5     | [ 4 5 2 3 ]      | FAULT (F2)
-----------------------------------------
Total References : 12
Total Page Faults: 10
Total Page Hits  : 2
Hit Ratio        : 16.67%
Fault Ratio      : 83.33%`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to represent a reference string as an array and demonstrate FIFO frame replacement logic.",
      aim: "To construct a Bash shell script storing page references in an array and simulating FIFO buffer management across 4 frames.",
      principle: `A Bash script uses indexed arrays: <code>pages=(1 2 3 4 1 2 5 1 2 3 4 5)</code> and <code>frames=(-1 -1 -1 -1)</code>.
Using a modular pointer <code>victim=$(( (victim + 1) % 4 ))</code>, incoming pages overwrite the oldest occupied slot.`,
      code: `#!/bin/bash
# FIFO Page Replacement in Shell Script
pages=(1 2 3 4 1 2 5 1 2 3 4 5)
num_frames=4
frames=(-1 -1 -1 -1)
faults=0
hits=0
victim=0

echo "=== FIFO Page Replacement Simulation (Shell Script) ==="
echo "Reference Array: \${pages[*]}"
echo "Frame Slots    : $num_frames"
echo ""

for page in "\${pages[@]}"; do
    hit=0
    for ((j=0; j<num_frames; j++)); do
        if [ \${frames[$j]} -eq $page ]; then
            hit=1
            break
        fi
    done

    if [ $hit -eq 1 ]; then
        hits=$((hits + 1))
        echo "Page $page -> [\${frames[*]}] : HIT"
    else
        frames[$victim]=$page
        victim=$(( (victim + 1) % num_frames ))
        faults=$((faults + 1))
        echo "Page $page -> [\${frames[*]}] : FAULT"
    fi
done

echo ""
echo "Total Page Faults: $faults"
echo "Total Page Hits  : $hits"`,
      output: `=== FIFO Page Replacement Simulation (Shell Script) ===
Reference Array: 1 2 3 4 1 2 5 1 2 3 4 5
Frame Slots    : 4

Page 1 -> [1 -1 -1 -1] : FAULT
Page 2 -> [1 2 -1 -1] : FAULT
Page 3 -> [1 2 3 -1] : FAULT
Page 4 -> [1 2 3 4] : FAULT
Page 1 -> [1 2 3 4] : HIT
Page 2 -> [1 2 3 4] : HIT
Page 5 -> [5 2 3 4] : FAULT
Page 1 -> [5 1 3 4] : FAULT
Page 2 -> [5 1 2 4] : FAULT
Page 3 -> [5 1 2 3] : FAULT
Page 4 -> [4 1 2 3] : FAULT
Page 5 -> [4 5 2 3] : FAULT

Total Page Faults: 10
Total Page Hits  : 2`
    }
  },

  {
    num: 3,
    title: "Page Number Exceeding Page Table Bounds & Shell Invalid Address Handler",
    partA: {
      marks: 50,
      q: "Explain what happens when the page number exceeds the number of pages in the page table, with a C program check.",
      aim: "To demonstrate the MMU protection mechanism and write a C program that validates logical addresses against the Page Table Length Register (PTLR).",
      principle: `1. <strong>Hardware Address Translation Check:</strong>
   • Logical address is split into <strong>Page Number (p)</strong> and <strong>Offset (d)</strong>:
     <code>p = Logical_Address / Page_Size</code>, <code>d = Logical_Address % Page_Size</code>.
   • The Memory Management Unit (MMU) compares <code>p</code> against the <strong>Page Table Length Register (PTLR)</strong>.
   • If <code>p >= PTLR</code> (page table size), the address is outside the process's allocated virtual address space.
   • The CPU generates an <strong>Internal Hardware Trap (Addressing Exception / Segmentation Fault)</strong>.
   • The OS catches the trap and sends a <code>SIGSEGV</code> signal to terminate the offending process.`,
      code: `#include <stdio.h>
#include <stdlib.h>

#define PAGE_SIZE 1024       // 1 KB
#define TOTAL_PAGES 4        // Legal pages: 0, 1, 2, 3

int page_table[TOTAL_PAGES] = {5, 8, 2, 9}; // Frame mapping

void translateAddress(unsigned int logical_addr) {
    unsigned int page_no = logical_addr / PAGE_SIZE;
    unsigned int offset = logical_addr % PAGE_SIZE;

    printf("\\n[Translating Logical Address: %u]\\n", logical_addr);
    printf("Calculated Page Number: %u | Offset: %u\\n", page_no, offset);

    // Hardware MMU Bound Check
    if (page_no >= TOTAL_PAGES) {
        printf(">>> [HARDWARE TRAP]: Page %u exceeds Page Table Limit (%d)!\\n", page_no, TOTAL_PAGES);
        printf(">>> TRAP TYPE   : Addressing Exception / Segmentation Fault\\n");
        printf(">>> OS ACTION   : Signal SIGSEGV sent. Process Aborted.\\n");
    } else {
        unsigned int physical_addr = (page_table[page_no] * PAGE_SIZE) + offset;
        printf(">>> Status: VALID (Mapped to Frame %d)\\n", page_table[page_no]);
        printf(">>> Physical Address = (%d * %d) + %u = %u\\n", 
               page_table[page_no], PAGE_SIZE, offset, physical_addr);
    }
}

int main() {
    printf("=== Paging Bounds Checking Demonstration ===\\n");
    printf("Page Size = %d bytes | Valid Pages = 0 to %d\\n", PAGE_SIZE, TOTAL_PAGES - 1);

    translateAddress(2500);  // Page 2, Offset 452 -> VALID
    translateAddress(4095);  // Page 3, Offset 1023 -> VALID
    translateAddress(6500);  // Page 6 -> EXCEEDS TOTAL PAGES!

    return 0;
}`,
      output: `=== Paging Bounds Checking Demonstration ===
Page Size = 1024 bytes | Valid Pages = 0 to 3

[Translating Logical Address: 2500]
Calculated Page Number: 2 | Offset: 452
>>> Status: VALID (Mapped to Frame 2)
>>> Physical Address = (2 * 1024) + 452 = 2500

[Translating Logical Address: 4095]
Calculated Page Number: 3 | Offset: 1023
>>> Status: VALID (Mapped to Frame 9)
>>> Physical Address = (9 * 1024) + 1023 = 10239

[Translating Logical Address: 6500]
Calculated Page Number: 6 | Offset: 356
>>> [HARDWARE TRAP]: Page 6 exceeds Page Table Limit (4)!
>>> TRAP TYPE   : Addressing Exception / Segmentation Fault
>>> OS ACTION   : Signal SIGSEGV sent. Process Aborted.`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to display an 'Invalid Logical Address' message when the page number exceeds available pages.",
      aim: "To develop a Bash script calculating page number and offset from user input and throwing an explicit error on bounds violation.",
      principle: `The script computes <code>page=$(( logical_addr / page_size ))</code> and evaluates <code>[ $page -ge $max_pages ]</code>. If true, prints red-flagged invalid address alert.`,
      code: `#!/bin/bash
# Shell Script: Paging Address Boundary Validation
PAGE_SIZE=1024
MAX_PAGES=4

echo "-----------------------------------------------"
echo "      LOGICAL ADDRESS TRANSLATION CHECKER      "
echo "-----------------------------------------------"
echo "Page Size configured: $PAGE_SIZE bytes"
echo "Total Valid Pages   : $MAX_PAGES (0 to $((MAX_PAGES-1)))"
echo ""

read -p "Enter Logical Address to Translate: " logical_addr

if ! [[ "$logical_addr" =~ ^[0-9]+$ ]]; then
    echo "Error: Please enter a valid positive integer."
    exit 1
fi

page_num=$(( logical_addr / PAGE_SIZE ))
offset=$(( logical_addr % PAGE_SIZE ))

echo "Derived Page Number : $page_num"
echo "Derived Byte Offset : $offset"

if [ $page_num -ge $MAX_PAGES ]; then
    echo ""
    echo "================================================="
    echo " ERROR: Invalid Logical Address!"
    echo " Reason: Page number ($page_num) exceeds allocated range (0-$((MAX_PAGES-1)))."
    echo " Action: Segmentation Fault (SIGSEGV) Generated."
    echo "================================================="
    exit 1
else
    echo "Status: Address is VALID. Translating to physical frame..."
fi`,
      output: `-----------------------------------------------
      LOGICAL ADDRESS TRANSLATION CHECKER      
-----------------------------------------------
Page Size configured: 1024 bytes
Total Valid Pages   : 4 (0 to 3)

Enter Logical Address to Translate: 5120
Derived Page Number : 5
Derived Byte Offset : 0

=================================================
 ERROR: Invalid Logical Address!
 Reason: Page number (5) exceeds allocated range (0-3).
 Action: Segmentation Fault (SIGSEGV) Generated.
=================================================`
    }
  },

  {
    num: 4,
    title: "Directory & File UNIX Commands & Shell Script for Greatest of Three Numbers",
    partA: {
      marks: 50,
      q: "Explain any five directory-related and file-related UNIX commands with syntax and examples.",
      aim: "To document essential directory and file manipulation commands in UNIX/Linux systems with syntax, options, and sample runs.",
      principle: `UNIX manages all resources under a hierarchical inverted tree file system starting at root <code>/</code>.
Standard directory management commands create, navigate, and remove directories.
File management commands handle creation, viewing, duplicating, moving, and deleting file entities.`,
      code: `/* Directory-Related Commands:
1. pwd (Print Working Directory)
   Syntax: pwd [-L | -P]
   Example: $ pwd
            /home/student/oslab

2. mkdir (Make Directory)
   Syntax: mkdir [options] <dirname>
   Example: $ mkdir -p lab/ex4/code

3. cd (Change Directory)
   Syntax: cd [directory_path]
   Example: $ cd lab/ex4 && pwd

4. rmdir (Remove Empty Directory)
   Syntax: rmdir [options] <dirname>
   Example: $ rmdir temp_dir

5. ls (List Directory Contents)
   Syntax: ls [options] [path]
   Example: $ ls -la /var/log

File-Related Commands:
1. touch (Create Empty File / Update Timestamp)
   Syntax: touch <filename>
   Example: $ touch sample.txt

2. cat (Concatenate and Display Files)
   Syntax: cat [options] [files]
   Example: $ cat -n sample.txt

3. cp (Copy Files and Directories)
   Syntax: cp [options] <source> <destination>
   Example: $ cp -r src_folder/ dest_folder/

4. mv (Move or Rename Files)
   Syntax: mv [options] <source> <destination>
   Example: $ mv oldname.c newname.c

5. rm (Remove / Delete Files)
   Syntax: rm [options] <filename>
   Example: $ rm -f obsolete.log
*/`,
      output: `$ pwd
/home/kali/os_lab

$ mkdir -p test_dir/sub
$ touch test_dir/sub/demo.txt
$ ls -l test_dir/sub/
total 0
-rw-r--r-- 1 kali kali 0 Oct  4 10:00 demo.txt

$ mv test_dir/sub/demo.txt test_dir/sub/demo_renamed.txt
$ rm test_dir/sub/demo_renamed.txt
$ rmdir test_dir/sub`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to find the greatest among three given numbers.",
      aim: "To develop an interactive Bash shell script utilizing conditional branching to determine the largest among three numerical inputs.",
      principle: `Compares numbers using relational operators <code>-gt</code> (greater than) and <code>-ge</code> (greater than or equal to) or arithmetic compound evaluation <code>(( a >= b && a >= c ))</code>.`,
      code: `#!/bin/bash
# Shell script to find greatest among three numbers
echo "=== FIND GREATEST OF THREE NUMBERS ==="
read -p "Enter first number  (A): " a
read -p "Enter second number (B): " b
read -p "Enter third number  (C): " c

if [ $a -ge $b ] && [ $a -ge $c ]; then
    greatest=$a
elif [ $b -ge $a ] && [ $b -ge $c ]; then
    greatest=$b
else
    greatest=$c
fi

echo ""
echo "Result: The greatest number among ($a, $b, $c) is: $greatest"`,
      output: `=== FIND GREATEST OF THREE NUMBERS ===
Enter first number  (A): 48
Enter second number (B): 95
Enter third number  (C): 72

Result: The greatest number among (48, 95, 72) is: 95`
    }
  },

  {
    num: 5,
    title: "Page Fault Concepts, Frame Size Impact & Optimal Page Replacement Minimality",
    partA: {
      marks: 50,
      q: "Explain the concept of a page fault and how the frame size affects the number of page faults.",
      aim: "To elucidate the life cycle of a page fault, its performance impact (Effective Access Time), and how frame size and frame quantity influence page fault frequency.",
      principle: `1. <strong>Page Fault Concept:</strong>
   • Occurs when a process accesses a page whose valid-invalid bit in the page table is marked '0' (Invalid / Not present in RAM).
   • <strong>Service Sequence:</strong>
     1) CPU detects invalid bit -> generates MMU trap to OS.
     2) OS saves user registers and process state.
     3) OS checks internal table: if invalid address -> abort (SIGSEGV); if valid -> page fault.
     4) OS finds a free physical frame in RAM.
     5) Schedules disk I/O to swap in the page from secondary backing store.
     6) Once I/O completes, updates page table entry to Valid ('1') and records frame number.
     7) Restarts the instruction that caused the trap.

2. <strong>Impact of Frame Allocation & Frame Size:</strong>
   • <strong>Increasing Frame Count:</strong> More frames allow larger working sets to reside in memory, decreasing page fault frequency.
     <em>Anomaly:</em> In FIFO, Belady's Anomaly can occur where increasing frame count from 3 to 4 increases page faults.
   • <strong>Larger Page / Frame Size:</strong>
     - Pros: Smaller page table size; transfers more contiguous code into RAM (high spatial locality).
     - Cons: Higher internal fragmentation; larger swap-in transfer times.`,
      code: `/* Effective Access Time (EAT) Calculation Model */
// EAT = (1 - p) * Memory_Access_Time + p * Page_Fault_Service_Time
// If Memory Access = 100 ns, Page Fault Service = 10 ms (10,000,000 ns)
// If p = 0.001 (1 fault in 1000 references):
// EAT = 0.999 * 100 + 0.001 * 10,000,000 = 99.9 + 10,000 = 10,099.9 ns ≈ 10 microseconds!
// (100 times slower due to disk swap latency)`
    },
    partB: {
      marks: 50,
      q: "Explain why the Optimal page replacement algorithm produces the minimum number of page faults, with reference to the given reference string.",
      aim: "To demonstrate the mathematical optimality of Belady's Optimal algorithm (OPT/MIN) and compute page faults for string '1 2 3 4 1 2 5 1 2 3 4 5' with 4 frames.",
      principle: `<strong>Belady's Optimality Principle:</strong>
Replace the page that will not be used for the longest period of time in the future.
Because it looks ahead into future references, it maximizes the distance to the next page fault at each replacement decision, provably achieving the lowest possible fault count.`,
      table: `
<table class="index-table">
  <thead>
    <tr><th>Ref</th><th>F1</th><th>F2</th><th>F3</th><th>F4</th><th>Status</th><th>Replacement Decision</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>1</td><td>-</td><td>-</td><td>-</td><td>FAULT</td><td>Empty frame allocated</td></tr>
    <tr><td>2</td><td>1</td><td>2</td><td>-</td><td>-</td><td>FAULT</td><td>Empty frame allocated</td></tr>
    <tr><td>3</td><td>1</td><td>2</td><td>3</td><td>-</td><td>FAULT</td><td>Empty frame allocated</td></tr>
    <tr><td>4</td><td>1</td><td>2</td><td>3</td><td>4</td><td>FAULT</td><td>Empty frame allocated (Full)</td></tr>
    <tr><td>1</td><td>1</td><td>2</td><td>3</td><td>4</td><td>HIT</td><td>Page 1 already present</td></tr>
    <tr><td>2</td><td>1</td><td>2</td><td>3</td><td>4</td><td>HIT</td><td>Page 2 already present</td></tr>
    <tr><td>5</td><td>1</td><td>2</td><td>5</td><td>4</td><td>FAULT</td><td>Replace 3 (next use: index 9 vs 4: index 10 vs 1: idx 7 vs 2: idx 8) -> Page 4 used furthest!</td></tr>
    <tr><td>1</td><td>1</td><td>2</td><td>5</td><td>4</td><td>HIT</td><td>Page 1 present</td></tr>
    <tr><td>2</td><td>1</td><td>2</td><td>5</td><td>4</td><td>HIT</td><td>Page 2 present</td></tr>
    <tr><td>3</td><td>1</td><td>2</td><td>3</td><td>4</td><td>FAULT</td><td>Replace 5 (5 only used at very end index 11)</td></tr>
    <tr><td>4</td><td>1</td><td>2</td><td>3</td><td>4</td><td>HIT</td><td>Page 4 present</td></tr>
    <tr><td>5</td><td>1</td><td>2</td><td>3</td><td>5</td><td>FAULT</td><td>Replace 4 (no further use)</td></tr>
  </tbody>
</table>`,
      code: `Total References: 12
Total Faults in Optimal : 6 Page Faults
Total Hits in Optimal   : 6 Page Hits
Comparison: FIFO produced 10 faults, whereas Optimal produces only 6 faults!`,
      output: `OPTIMAL Page Replacement Results:
Total Page Faults: 6
Total Page Hits  : 6
Hit Ratio        : 50.00%
Fault Reduction vs FIFO: 40% fewer page faults!`
    }
  },

  {
    num: 6,
    title: "CAT Command and Options & Shell Script for Sum of Odd Numbers up to N",
    partA: {
      marks: 50,
      q: "Explain the CAT command and its various options with examples.",
      aim: "To detail the syntax, utility, and options of the UNIX concatenate (cat) command.",
      principle: `The <code>cat</code> command reads files sequentially and writes them to standard output.
Key options:
• <code>-n</code>: Number all output lines.
• <code>-b</code>: Number non-empty output lines.
• <code>-s</code>: Squeeze multiple adjacent blank lines into a single blank line.
• <code>-E</code>: Display <code>$</code> at end of each line.
• <code>-T</code>: Display TAB characters as <code>^I</code>.
• <code>-A</code>: Equivalent to <code>-vET</code> (shows all non-printing characters).`,
      code: `/* Common cat command applications:
1. Create new file with standard input:
   $ cat > notes.txt
   Line 1
   Line 2
   (Ctrl+D)

2. Display file with line numbers:
   $ cat -n notes.txt

3. Concatenate two files into a destination file:
   $ cat part1.txt part2.txt > full_report.txt

4. Append file content:
   $ cat appendix.txt >> full_report.txt

5. Suppress duplicate blank lines:
   $ cat -s report.txt
*/`,
      output: `$ cat -n /etc/issue
     1  Kali GNU/Linux Rolling \\n \\l
     2`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to find the sum of odd numbers up to N.",
      aim: "To develop a Bash script calculating the arithmetic sum of all odd integers in the interval [1, N].",
      principle: `A loop iterates from <code>i=1</code> to <code>N</code> with step 2 (or checking <code>i % 2 != 0</code>) and adds <code>i</code> to cumulative sum variable.`,
      code: `#!/bin/bash
# Shell script to calculate sum of odd numbers up to N
echo "=== SUM OF ODD NUMBERS (1 to N) ==="
read -p "Enter upper limit N: " n

if [ $n -lt 1 ]; then
    echo "Limit must be >= 1"
    exit 1
fi

sum=0
echo -n "Odd numbers: "
for ((i=1; i<=n; i+=2)); do
    echo -n "$i "
    sum=$((sum + i))
done

echo ""
echo "Sum of all odd numbers up to $n = $sum"`,
      output: `=== SUM OF ODD NUMBERS (1 to N) ===
Enter upper limit N: 15
Odd numbers: 1 3 5 7 9 11 13 15 
Sum of all odd numbers up to 15 = 64`
    }
  },

  {
    num: 7,
    title: "HEAD, TAIL, MORE, GREP UNIX Commands & Shell Script for Fibonacci Series",
    partA: {
      marks: 50,
      q: "Explain HEAD, TAIL, MORE and GREP commands with syntax and examples.",
      aim: "To explain text inspection and search filters in UNIX.",
      principle: `1. <strong>HEAD:</strong> Outputs the first part of files (default: 10 lines).
   Syntax: <code>head [-n lines] [file]</code>. Example: <code>head -n 5 /etc/passwd</code>.
2. <strong>TAIL:</strong> Outputs the last part of files (default: 10 lines).
   Syntax: <code>tail [-n lines] [-f] [file]</code>. <code>-f</code> follows live append stream (e.g., logs).
3. <strong>MORE:</strong> Terminal pager for viewing text screen by screen.
   Syntax: <code>more [options] [file]</code>. (Space: next page, Enter: next line, Q: quit).
4. <strong>GREP (Global Regular Expression Print):</strong> Searches for patterns matching regular expressions.
   Syntax: <code>grep [options] "pattern" [file]</code>.
   Options: <code>-i</code> (ignore case), <code>-v</code> (invert match), <code>-c</code> (count matches), <code>-n</code> (print line numbers).`,
      code: `/* Practical Examples: */
// View first 3 lines of system users
$ head -n 3 /etc/passwd

// Monitor real-time authentication logs
$ tail -f /var/log/auth.log

// Search case-insensitively with line numbers
$ grep -in "error" /var/log/syslog`,
      output: `$ head -n 2 /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin

$ tail -n 2 /etc/passwd
kali:x:1000:1000:Kali,,,:/home/kali:/bin/bash
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to generate the Fibonacci series up to a given limit.",
      aim: "To generate Fibonacci numbers F(n) = F(n-1) + F(n-2) starting from 0, 1 up to value limit N.",
      principle: `Uses two pointers <code>a=0</code> and <code>b=1</code>. In each iteration, prints <code>a</code>, computes <code>next = a + b</code>, shifts <code>a = b</code> and <code>b = next</code> while <code>a <= N</code>.`,
      code: `#!/bin/bash
# Fibonacci series generation up to limit N
echo "=== FIBONACCI SERIES GENERATOR ==="
read -p "Enter limit N: " limit

a=0
b=1

echo -n "Fibonacci Series up to $limit: "
while [ $a -le $limit ]; do
    echo -n "$a "
    fn=$((a + b))
    a=$b
    b=$fn
done
echo ""`,
      output: `=== FIBONACCI SERIES GENERATOR ===
Enter limit N: 50
Fibonacci Series up to 50: 0 1 1 2 3 5 8 13 21 34 `
    }
  },

  {
    num: 8,
    title: "Process Creation with fork(), getpid(), getppid() in C & Shell Background Process",
    partA: {
      marks: 50,
      q: "Write a C program to create a child process using fork() and display the process IDs of parent and child using getpid() and getppid().",
      aim: "To demonstrate process creation via fork() and inspect Process IDs (PID) and Parent Process IDs (PPID).",
      principle: `<code>fork()</code> duplicates the calling process.
• Return value <code>< 0</code>: Error creating child.
• Return value <code>== 0</code>: Child process context. <code>getpid()</code> returns child PID; <code>getppid()</code> returns parent PID.
• Return value <code>> 0</code>: Parent process context. Return value is child's PID. <code>getpid()</code> returns parent PID.`,
      code: `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main() {
    pid_t pid;

    printf("Parent Process before fork() [PID: %d]\\n\\n", getpid());
    pid = fork();

    if (pid < 0) {
        perror("Fork failed");
        return 1;
    } else if (pid == 0) {
        // Child execution path
        printf("[CHILD PROCESS]\\n");
        printf("  My PID           : %d\\n", getpid());
        printf("  My Parent's PPID : %d\\n", getppid());
    } else {
        // Parent execution path
        wait(NULL); // Wait for child completion
        printf("\\n[PARENT PROCESS]\\n");
        printf("  My PID           : %d\\n", getpid());
        printf("  Created Child PID: %d\\n", pid);
    }

    return 0;
}`,
      output: `Parent Process before fork() [PID: 2841]

[CHILD PROCESS]
  My PID           : 2842
  My Parent's PPID : 2841

[PARENT PROCESS]
  My PID           : 2841
  Created Child PID: 2842`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to create a background child process and display its process ID and parent process ID.",
      aim: "To launch an asynchronous subshell with & and inspect special shell parameters $! and $$.",
      principle: `<code>$$</code> gives the PID of the current shell (parent).
<code>$!</code> contains the PID of the most recently executed background command.`,
      code: `#!/bin/bash
# Shell Script: Background Child Process & PID Display
echo "Parent Shell Running [PID: $$]"

# Launch background subshell
(
    echo "  [Child Subshell] Started in Background"
    echo "  [Child Subshell] Child PID  : $BASHPID"
    echo "  [Child Subshell] Parent PPID: $PPID"
    sleep 2
    echo "  [Child Subshell] Finished Task."
) &

child_pid=$!
echo "Parent created Child with PID: $child_pid"
echo "Parent waiting for child..."
wait $child_pid
echo "Parent successfully synchronized with child."`,
      output: `Parent Shell Running [PID: 3410]
Parent created Child with PID: 3411
Parent waiting for child...
  [Child Subshell] Started in Background
  [Child Subshell] Child PID  : 3411
  [Child Subshell] Parent PPID: 3410
  [Child Subshell] Finished Task.
Parent successfully synchronized with child.`
    }
  },

  {
    num: 9,
    title: "Process Synchronization using wait() in C & Shell wait Command",
    partA: {
      marks: 50,
      q: "Write a C program to demonstrate process synchronization between parent and child using the wait() system call.",
      aim: "To prevent zombie processes and demonstrate deterministic execution ordering between parent and child via wait().",
      principle: `<code>pid_t wait(int *status)</code> suspends the calling parent process until one of its children terminates.
Inspect exit status with macros:
• <code>WIFEXITED(status)</code>: Evaluates to true if child terminated normally.
• <code>WEXITSTATUS(status)</code>: Returns child's 8-bit exit code passed to <code>exit()</code>.`,
      code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        perror("Fork failed");
        exit(1);
    } else if (pid == 0) {
        printf("Child (PID: %d) executing work...\\n", getpid());
        sleep(2); // Simulate task
        printf("Child task finished. Exiting with code 42.\\n");
        exit(42);
    } else {
        int status;
        printf("Parent (PID: %d) waiting for Child (PID: %d)...\\n", getpid(), pid);
        pid_t dead_child = wait(&status);

        if (WIFEXITED(status)) {
            printf("Parent: Child %d terminated normally with exit code %d.\\n", 
                   dead_child, WEXITSTATUS(status));
        }
        printf("Parent resuming and terminating.\\n");
    }
    return 0;
}`,
      output: `Parent (PID: 4120) waiting for Child (PID: 4121)...
Child (PID: 4121) executing work...
Child task finished. Exiting with code 42.
Parent: Child 4121 terminated normally with exit code 42.
Parent resuming and terminating.`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to demonstrate parent-child process synchronization using the wait command.",
      aim: "To demonstrate barrier synchronization in shell scripting using the built-in wait command.",
      principle: `Multiple tasks launched in background with <code>&</code> execute concurrently.
The <code>wait [pid]</code> command blocks the parent script until specified background processes finish.`,
      code: `#!/bin/bash
# Parent-Child Synchronization in Shell
echo "Parent process $$ starting worker tasks..."

# Spawn worker 1
( sleep 2; echo "  Worker 1 (PID: $BASHPID) finished data fetching." ) &
pid1=$!

# Spawn worker 2
( sleep 3; echo "  Worker 2 (PID: $BASHPID) finished index building." ) &
pid2=$!

echo "Parent waiting for Worker 1 ($pid1) and Worker 2 ($pid2) to complete..."
wait $pid1
echo "Parent: Worker 1 finished. Still awaiting Worker 2..."
wait $pid2
echo "Parent: All background child tasks synchronized. Generating final report."`,
      output: `Parent process 5200 starting worker tasks...
Parent waiting for Worker 1 (5201) and Worker 2 (5202) to complete...
  Worker 1 (PID: 5201) finished data fetching.
Parent: Worker 1 finished. Still awaiting Worker 2...
  Worker 2 (PID: 5202) finished index building.
Parent: All background child tasks synchronized. Generating final report.`
    }
  },

  {
    num: 10,
    title: "File Operations: open() and close() in C & Shell File Descriptor Redirection with exec",
    partA: {
      marks: 50,
      q: "Write a C program to open a file and close it using the close() system call.",
      aim: "To demonstrate low-level file I/O operations using open(), read(), write(), and close() system calls.",
      principle: `• <code>int open(const char *pathname, int flags, mode_t mode)</code> returns a non-negative integer file descriptor (FD).
• <code>int close(int fd)</code> frees the file descriptor entry from the process file table.`,
      code: `#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>

int main() {
    int fd;
    char buffer[64];
    ssize_t bytes_written, bytes_read;

    // Open file for read/write, create if not present
    fd = open("exam_test.txt", O_CREAT | O_RDWR | O_TRUNC, 0644);
    if (fd < 0) {
        perror("Failed to open file");
        exit(1);
    }
    printf("File opened successfully with File Descriptor: %d\\n", fd);

    // Write content
    bytes_written = write(fd, "OS Lab Exam 2026\\n", 17);
    printf("Written %zd bytes to file.\\n", bytes_written);

    // Reposition cursor to beginning
    lseek(fd, 0, SEEK_SET);

    // Read back
    bytes_read = read(fd, buffer, sizeof(buffer) - 1);
    buffer[bytes_read] = '\\0';
    printf("Read from file: %s", buffer);

    // Close file descriptor
    if (close(fd) == 0) {
        printf("File descriptor %d closed successfully.\\n", fd);
    } else {
        perror("Close failed");
    }

    return 0;
}`,
      output: `File opened successfully with File Descriptor: 3
Written 17 bytes to file.
Read from file: OS Lab Exam 2026
File descriptor 3 closed successfully.`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to open and close a file using exec and file descriptor redirection.",
      aim: "To manage custom file descriptors (FD 3) in Bash using the exec command for persistent stream reading and clean descriptor closure.",
      principle: `<code>exec 3< filename</code> binds FD 3 to the file for reading.
<code>read -u 3 variable</code> consumes lines from FD 3.
<code>exec 3<&-</code> closes custom file descriptor 3.`,
      code: `#!/bin/bash
# Shell Script: File Descriptor manipulation using exec
TEST_FILE="fd_sample.txt"
echo -e "Line 1: Operating Systems\\nLine 2: System Calls\\nLine 3: Process Sync" > $TEST_FILE

echo "Opening '$TEST_FILE' on custom File Descriptor 3..."
exec 3< $TEST_FILE

echo "Reading file line by line through FD 3:"
line_num=1
while read -u 3 line; do
    echo "  [FD 3 Line $line_num]: $line"
    line_num=$((line_num + 1))
done

echo "Closing File Descriptor 3..."
exec 3<&-

echo "Verification: Checking FD 3 closure..."
read -u 3 test_line 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Success: File Descriptor 3 is cleanly closed."
fi
rm -f $TEST_FILE`,
      output: `Opening 'fd_sample.txt' on custom File Descriptor 3...
Reading file line by line through FD 3:
  [FD 3 Line 1]: Line 1: Operating Systems
  [FD 3 Line 2]: Line 2: System Calls
  [FD 3 Line 3]: Line 3: Process Sync
Closing File Descriptor 3...
Verification: Checking FD 3 closure...
Success: File Descriptor 3 is cleanly closed.`
    }
  },

  {
    num: 11,
    title: "fork() System Call Architecture & Shell Process Simulation",
    partA: {
      marks: 50,
      q: "Explain the fork() system call with its syntax and write a C program to illustrate process creation.",
      aim: "To explain the mechanics of process address space duplication, Copy-On-Write (COW), and write an illustrative C program.",
      principle: `<code>pid_t fork(void);</code> creates a new process by duplicating the calling process:
• Exact duplicate of memory segments (Text, Data, Heap, Stack). Modern kernels use Copy-On-Write (COW).
• Child receives a unique Process ID (PID).
• Open file descriptors are shared between parent and child.
• Returns:
  - <code>-1</code>: Creation failure (Resource exhaustion).
  - <code>0</code>: Returned to newly created child process.
  - <code>PID > 0</code>: Child's PID returned to parent.`,
      code: `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int main() {
    int shared_var = 100;
    pid_t pid = fork();

    if (pid < 0) {
        fprintf(stderr, "Fork failed!\\n");
        return 1;
    } else if (pid == 0) {
        shared_var += 50;
        printf("[CHILD PROCESS] PID: %d, PPID: %d | Local shared_var = %d\\n", 
               getpid(), getppid(), shared_var);
    } else {
        printf("[PARENT PROCESS] PID: %d, Child PID: %d | Local shared_var = %d\\n", 
               getpid(), pid, shared_var);
    }
    return 0;
}`,
      output: `[PARENT PROCESS] PID: 7100, Child PID: 7101 | Local shared_var = 100
[CHILD PROCESS] PID: 7101, PPID: 7100 | Local shared_var = 150`
    },
    partB: {
      marks: 50,
      q: "Explain how process creation is simulated in shell scripting and write a shell script to demonstrate it.",
      aim: "To illustrate subshell spawning, variable isolation, and concurrent process simulation in Bash.",
      principle: `When a command is enclosed in parentheses <code>( command )</code> or executed in background with <code>&</code>, the shell invokes internal <code>fork()</code> and <code>exec()</code> system calls, creating a subshell environment with copied environment variables but isolated write state.`,
      code: `#!/bin/bash
# Process creation simulation in Shell
MAIN_VAR="Original Parent Value"

echo "Parent PID: $$ | MAIN_VAR = '$MAIN_VAR'"
echo "Spawning subshell (simulating fork)..."

(
    # Inside child subshell
    echo "  [Child Subshell] PID: $BASHPID, PPID: $PPID"
    MAIN_VAR="Modified by Child"
    echo "  [Child Subshell] MAIN_VAR inside child = '$MAIN_VAR'"
)

echo "Back in Parent PID: $$ | MAIN_VAR = '$MAIN_VAR'"
echo "Notice: Parent memory remained unaltered (Memory Isolation proven)."`,
      output: `Parent PID: 8050 | MAIN_VAR = 'Original Parent Value'
Spawning subshell (simulating fork)...
  [Child Subshell] PID: 8051, PPID: 8050
  [Child Subshell] MAIN_VAR inside child = 'Modified by Child'
Back in Parent PID: 8050 | MAIN_VAR = 'Original Parent Value'
Notice: Parent memory remained unaltered (Memory Isolation proven).`
    }
  },

  {
    num: 12,
    title: "FCFS CPU Scheduling Algorithm in C & Shell Script Implementation",
    partA: {
      marks: 50,
      q: "Write a C program to implement the FCFS CPU scheduling algorithm and calculate average waiting time and turnaround time.",
      aim: "To implement non-preemptive First-Come First-Served (FCFS) CPU scheduling and compute metrics for N processes.",
      principle: `Processes are dispatched in order of arrival.
• <code>Completion Time (CT) = CT_prev + Burst Time (BT)</code>
• <code>Turnaround Time (TAT) = Completion Time - Arrival Time</code>
• <code>Waiting Time (WT) = Turnaround Time - Burst Time</code>`,
      code: `#include <stdio.h>

int main() {
    int n = 4;
    int bt[] = {5, 3, 8, 6};
    int wt[4], tat[4];
    float total_wt = 0, total_tat = 0;

    wt[0] = 0; // First process waits 0 ms
    tat[0] = bt[0];

    for (int i = 1; i < n; i++) {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
    }

    printf("=== FCFS CPU SCHEDULING (C Program) ===\\n");
    printf("%-8s | %-10s | %-12s | %-15s\\n", "Process", "Burst Time", "Waiting Time", "Turnaround Time");
    printf("---------------------------------------------------\\n");

    for (int i = 0; i < n; i++) {
        total_wt += wt[i];
        total_tat += tat[i];
        printf("P%-7d | %-10d | %-12d | %-15d\\n", i + 1, bt[i], wt[i], tat[i]);
    }

    printf("---------------------------------------------------\\n");
    printf("Average Waiting Time    : %.2f ms\\n", total_wt / n);
    printf("Average Turnaround Time : %.2f ms\\n", total_tat / n);

    return 0;
}`,
      output: `=== FCFS CPU SCHEDULING (C Program) ===
Process  | Burst Time | Waiting Time | Turnaround Time
---------------------------------------------------
P1       | 5          | 0            | 5              
P2       | 3          | 5            | 8              
P3       | 8          | 8            | 16             
P4       | 6          | 16           | 22             
---------------------------------------------------
Average Waiting Time    : 7.25 ms
Average Turnaround Time : 12.75 ms`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to implement the FCFS CPU scheduling algorithm and display waiting time and turnaround time.",
      aim: "To implement FCFS CPU scheduling in Bash using arrays.",
      principle: `Iterates through process burst times in array, accumulating waiting times and turnaround times.`,
      code: `#!/bin/bash
# Shell Script: FCFS CPU Scheduling
bt=(5 3 8 6)
n=\${#bt[@]}
wt=(0)
tat=(\${bt[0]})
total_wt=0
total_tat=\${bt[0]}

for ((i=1; i<n; i++)); do
    wt[$i]=$(( wt[i-1] + bt[i-1] ))
    tat[$i]=$(( wt[i] + bt[i] ))
    total_wt=$(( total_wt + wt[i] ))
    total_tat=$(( total_tat + tat[i] ))
done

echo "=== FCFS CPU SCHEDULING (Shell Script) ==="
printf "%-8s %-10s %-12s %-15s\\n" "Process" "Burst Time" "Waiting Time" "Turnaround Time"
echo "---------------------------------------------------"
for ((i=0; i<n; i++)); do
    printf "P%-7d %-10d %-12d %-15d\\n" $((i+1)) \${bt[$i]} \${wt[$i]} \${tat[$i]}
done
echo "---------------------------------------------------"
avg_wt=$(echo "scale=2; $total_wt / $n" | bc -l 2>/dev/null || awk "BEGIN {printf \\"%.2f\\", $total_wt / $n}")
avg_tat=$(echo "scale=2; $total_tat / $n" | bc -l 2>/dev/null || awk "BEGIN {printf \\"%.2f\\", $total_tat / $n}")
echo "Average Waiting Time    : $avg_wt ms"
echo "Average Turnaround Time : $avg_tat ms"`,
      output: `=== FCFS CPU SCHEDULING (Shell Script) ===
Process  Burst Time Waiting Time Turnaround Time
---------------------------------------------------
P1       5          0            5              
P2       3          5            8              
P3       8          8            16             
P4       6          16           22             
---------------------------------------------------
Average Waiting Time    : 7.25 ms
Average Turnaround Time : 12.75 ms`
    }
  },

  {
    num: 13,
    title: "Non-Preemptive SJF CPU Scheduling in C & Shell Script Array Sorting",
    partA: {
      marks: 50,
      q: "Write a C program to implement Non-Preemptive Shortest Job First (SJF) scheduling algorithm.",
      aim: "To sort ready processes in ascending order of Burst Time to minimize average waiting time.",
      principle: `SJF is optimal: it gives minimum average waiting time for a given set of stationary processes.
Sorting burst times: <code>bt[j] > bt[j+1]</code> -> swap burst times and process IDs.`,
      code: `#include <stdio.h>

int main() {
    int n = 4;
    int p[] = {1, 2, 3, 4};
    int bt[] = {6, 8, 3, 4};
    int wt[4], tat[4];
    float total_wt = 0, total_tat = 0;

    // Sort by Burst Time (Bubble Sort)
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (bt[j] > bt[j + 1]) {
                int temp = bt[j]; bt[j] = bt[j + 1]; bt[j + 1] = temp;
                temp = p[j]; p[j] = p[j + 1]; p[j + 1] = temp;
            }
        }
    }

    wt[0] = 0;
    tat[0] = bt[0];
    for (int i = 1; i < n; i++) {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
    }

    printf("=== SJF NON-PREEMPTIVE CPU SCHEDULING ===\\n");
    printf("%-8s | %-10s | %-12s | %-15s\\n", "Process", "Burst Time", "Waiting Time", "Turnaround Time");
    printf("---------------------------------------------------\\n");

    for (int i = 0; i < n; i++) {
        total_wt += wt[i]; total_tat += tat[i];
        printf("P%-7d | %-10d | %-12d | %-15d\\n", p[i], bt[i], wt[i], tat[i]);
    }
    printf("---------------------------------------------------\\n");
    printf("Average Waiting Time    : %.2f ms\\n", total_wt / n);
    printf("Average Turnaround Time : %.2f ms\\n", total_tat / n);

    return 0;
}`,
      output: `=== SJF NON-PREEMPTIVE CPU SCHEDULING ===
Process  | Burst Time | Waiting Time | Turnaround Time
---------------------------------------------------
P3       | 3          | 0            | 3              
P4       | 4          | 3            | 7              
P1       | 6          | 7            | 13             
P2       | 8          | 13           | 21             
---------------------------------------------------
Average Waiting Time    : 5.75 ms
Average Turnaround Time : 11.00 ms`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to implement Non-Preemptive SJF scheduling algorithm using array sorting.",
      aim: "To demonstrate bubble sort in Bash to reorder processes by burst time and compute waiting time.",
      principle: `Sorts two parallel arrays <code>proc</code> and <code>bt</code> before applying cumulative FCFS wait calculation.`,
      code: `#!/bin/bash
# Shell Script: Non-Preemptive SJF via Array Sorting
proc=(1 2 3 4)
bt=(6 8 3 4)
n=\${#bt[@]}

# Bubble Sort on burst times
for ((i=0; i<n-1; i++)); do
    for ((j=0; j<n-i-1; j++)); do
        if [ \${bt[j]} -gt \${bt[j+1]} ]; then
            # Swap burst times
            tmp=\${bt[j]}; bt[j]=\${bt[j+1]}; bt[j+1]=$tmp
            # Swap process ids
            tmp_p=\${proc[j]}; proc[j]=\${proc[j+1]}; proc[j+1]=$tmp_p
        fi
    done
done

wt=(0)
tat=(\${bt[0]})
total_wt=0
total_tat=\${bt[0]}

for ((i=1; i<n; i++)); do
    wt[$i]=$(( wt[i-1] + bt[i-1] ))
    tat[$i]=$(( wt[i] + bt[i] ))
    total_wt=$(( total_wt + wt[i] ))
    total_tat=$(( total_tat + tat[i] ))
done

echo "=== SJF SCHEDULING (Shell Script) ==="
printf "%-8s %-10s %-12s %-15s\\n" "Process" "Burst Time" "Waiting Time" "Turnaround Time"
echo "---------------------------------------------------"
for ((i=0; i<n; i++)); do
    printf "P%-7d %-10d %-12d %-15d\\n" \${proc[$i]} \${bt[$i]} \${wt[$i]} \${tat[$i]}
done
echo "---------------------------------------------------"
echo "Average Waiting Time    : $(awk "BEGIN {printf \\"%.2f\\", $total_wt / $n}") ms"
echo "Average Turnaround Time : $(awk "BEGIN {printf \\"%.2f\\", $total_tat / $n}") ms"`,
      output: `=== SJF SCHEDULING (Shell Script) ===
Process  Burst Time Waiting Time Turnaround Time
---------------------------------------------------
P3       3          0            3              
P4       4          3            7              
P1       6          7            13             
P2       8          13           21             
---------------------------------------------------
Average Waiting Time    : 5.75 ms
Average Turnaround Time : 11.00 ms`
    }
  },

  {
    num: 14,
    title: "Priority CPU Scheduling Algorithm in C & Shell Script Implementation",
    partA: {
      marks: 50,
      q: "Write a C program to implement Priority Scheduling algorithm and calculate waiting time and turnaround time.",
      aim: "To implement non-preemptive Priority CPU scheduling where CPU is allocated to the highest priority process (lower integer = higher priority).",
      principle: `Processes are ordered by priority value. Bubble sort rearranges process ID, burst time, and priority arrays.`,
      code: `#include <stdio.h>

int main() {
    int n = 4;
    int p[] = {1, 2, 3, 4};
    int bt[] = {10, 1, 2, 1};
    int pr[] = {3, 1, 4, 2}; // 1 = Highest Priority
    int wt[4], tat[4];
    float total_wt = 0, total_tat = 0;

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (pr[j] > pr[j + 1]) {
                int t = pr[j]; pr[j] = pr[j + 1]; pr[j + 1] = t;
                t = bt[j]; bt[j] = bt[j + 1]; bt[j + 1] = t;
                t = p[j]; p[j] = p[j + 1]; p[j + 1] = t;
            }
        }
    }

    wt[0] = 0;
    tat[0] = bt[0];
    for (int i = 1; i < n; i++) {
        wt[i] = wt[i - 1] + bt[i - 1];
        tat[i] = wt[i] + bt[i];
    }

    printf("=== PRIORITY CPU SCHEDULING (C Program) ===\\n");
    printf("%-8s | %-8s | %-10s | %-12s | %-15s\\n", "Process", "Priority", "Burst Time", "Waiting Time", "Turnaround Time");
    printf("--------------------------------------------------------------\\n");

    for (int i = 0; i < n; i++) {
        total_wt += wt[i]; total_tat += tat[i];
        printf("P%-7d | %-8d | %-10d | %-12d | %-15d\\n", p[i], pr[i], bt[i], wt[i], tat[i]);
    }
    printf("--------------------------------------------------------------\\n");
    printf("Average Waiting Time    : %.2f ms\\n", total_wt / n);
    printf("Average Turnaround Time : %.2f ms\\n", total_tat / n);

    return 0;
}`,
      output: `=== PRIORITY CPU SCHEDULING (C Program) ===
Process  | Priority | Burst Time | Waiting Time | Turnaround Time
--------------------------------------------------------------
P2       | 1        | 1          | 0            | 1              
P4       | 2        | 1          | 1            | 2              
P1       | 3        | 10         | 2            | 12             
P3       | 4        | 2          | 12           | 14             
--------------------------------------------------------------
Average Waiting Time    : 3.75 ms
Average Turnaround Time : 7.25 ms`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to implement Priority Scheduling algorithm using arrays.",
      aim: "To demonstrate priority array sorting and schedule evaluation in Bash.",
      principle: `Sorts parallel arrays <code>proc</code>, <code>priority</code>, and <code>burst</code> based on priority integer values.`,
      code: `#!/bin/bash
# Priority Scheduling in Shell Script
p=(1 2 3 4)
bt=(10 1 2 1)
pr=(3 1 4 2)
n=\${#p[@]}

for ((i=0; i<n-1; i++)); do
    for ((j=0; j<n-i-1; j++)); do
        if [ \${pr[j]} -gt \${pr[j+1]} ]; then
            tmp=\${pr[j]}; pr[j]=\${pr[j+1]}; pr[j+1]=$tmp
            tmp=\${bt[j]}; bt[j]=\${bt[j+1]}; bt[j+1]=$tmp
            tmp=\${p[j]}; p[j]=\${p[j+1]}; p[j+1]=$tmp
        fi
    done
done

wt=(0)
tat=(\${bt[0]})
total_wt=0
total_tat=\${bt[0]}

for ((i=1; i<n; i++)); do
    wt[$i]=$(( wt[i-1] + bt[i-1] ))
    tat[$i]=$(( wt[i] + bt[i] ))
    total_wt=$(( total_wt + wt[i] ))
    total_tat=$(( total_tat + tat[i] ))
done

echo "=== PRIORITY SCHEDULING (Shell Script) ==="
printf "%-8s %-10s %-12s %-12s %-15s\\n" "Process" "Priority" "Burst Time" "Waiting Time" "Turnaround Time"
echo "------------------------------------------------------------"
for ((i=0; i<n; i++)); do
    printf "P%-7d %-10d %-12d %-12d %-15d\\n" \${p[$i]} \${pr[$i]} \${bt[$i]} \${wt[$i]} \${tat[$i]}
done
echo "------------------------------------------------------------"
echo "Average Waiting Time    : $(awk "BEGIN {printf \\"%.2f\\", $total_wt / $n}") ms"
echo "Average Turnaround Time : $(awk "BEGIN {printf \\"%.2f\\", $total_tat / $n}") ms"`,
      output: `=== PRIORITY SCHEDULING (Shell Script) ===
Process  Priority   Burst Time   Waiting Time Turnaround Time
------------------------------------------------------------
P2       1          1            0            1              
P4       2          1            1            2              
P1       3          10           2            12             
P3       4          2            12           14             
------------------------------------------------------------
Average Waiting Time    : 3.75 ms
Average Turnaround Time : 7.25 ms`
    }
  },

  {
    num: 15,
    title: "Round Robin CPU Scheduling Algorithm for Given Time Quantum in C & Shell",
    partA: {
      marks: 50,
      q: "Write a C program to implement Round Robin CPU scheduling algorithm for a given time quantum.",
      aim: "To implement preemptive Round Robin CPU scheduling using circular queue tracking with time quantum Q.",
      principle: `Each process receives a fixed time slice (Quantum). If remaining burst time > Quantum, process runs for Quantum and is pushed to back of queue.
If remaining burst time <= Quantum, process runs to completion.`,
      code: `#include <stdio.h>

int main() {
    int n = 3, quantum = 2;
    int bt[] = {5, 4, 3};
    int rem_bt[] = {5, 4, 3};
    int wt[3] = {0}, tat[3] = {0};
    int t = 0; // Current time

    while (1) {
        int done = 1;
        for (int i = 0; i < n; i++) {
            if (rem_bt[i] > 0) {
                done = 0;
                if (rem_bt[i] > quantum) {
                    t += quantum;
                    rem_bt[i] -= quantum;
                } else {
                    t += rem_bt[i];
                    wt[i] = t - bt[i];
                    rem_bt[i] = 0;
                }
            }
        }
        if (done == 1) break;
    }

    float total_wt = 0, total_tat = 0;
    for (int i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
        total_wt += wt[i];
        total_tat += tat[i];
    }

    printf("=== ROUND ROBIN SCHEDULING (Quantum = %d) ===\\n", quantum);
    printf("%-8s | %-10s | %-12s | %-15s\\n", "Process", "Burst Time", "Waiting Time", "Turnaround Time");
    printf("---------------------------------------------------\\n");
    for (int i = 0; i < n; i++) {
        printf("P%-7d | %-10d | %-12d | %-15d\\n", i + 1, bt[i], wt[i], tat[i]);
    }
    printf("---------------------------------------------------\\n");
    printf("Average Waiting Time    : %.2f ms\\n", total_wt / n);
    printf("Average Turnaround Time : %.2f ms\\n", total_tat / n);

    return 0;
}`,
      output: `=== ROUND ROBIN SCHEDULING (Quantum = 2) ===
Process  | Burst Time | Waiting Time | Turnaround Time
---------------------------------------------------
P1       | 5          | 7            | 12             
P2       | 4          | 6            | 10             
P3       | 3          | 6            | 9              
---------------------------------------------------
Average Waiting Time    : 6.33 ms
Average Turnaround Time : 10.33 ms`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to implement Round Robin CPU scheduling algorithm using a given time quantum.",
      aim: "To simulate round-robin preemptive time-slicing in Bash using remaining burst time arrays.",
      principle: `A while loop iterates through <code>rem_bt</code> array, deducting <code>min(rem_bt[i], quantum)</code> from active processes until all are zero.`,
      code: `#!/bin/bash
# Round Robin CPU Scheduling in Shell Script
quantum=2
bt=(5 4 3)
rem_bt=(5 4 3)
n=\${#bt[@]}
wt=(0 0 0)
tat=(0 0 0)
t=0

while true; do
    done_flag=1
    for ((i=0; i<n; i++)); do
        if [ \${rem_bt[$i]} -gt 0 ]; then
            done_flag=0
            if [ \${rem_bt[$i]} -gt $quantum ]; then
                t=$((t + quantum))
                rem_bt[$i]=$(( rem_bt[$i] - quantum ))
            else
                t=$((t + rem_bt[$i]))
                wt[$i]=$((t - bt[$i]))
                rem_bt[$i]=0
            fi
        fi
    done
    [ $done_flag -eq 1 ] && break
done

total_wt=0; total_tat=0
echo "=== ROUND ROBIN CPU SCHEDULING (Shell) ==="
printf "%-8s %-10s %-12s %-15s\\n" "Process" "Burst Time" "Waiting Time" "Turnaround Time"
echo "---------------------------------------------------"
for ((i=0; i<n; i++)); do
    tat[$i]=$(( bt[$i] + wt[$i] ))
    total_wt=$((total_wt + wt[$i]))
    total_tat=$((total_tat + tat[$i]))
    printf "P%-7d %-10d %-12d %-15d\\n" $((i+1)) \${bt[$i]} \${wt[$i]} \${tat[$i]}
done
echo "---------------------------------------------------"
echo "Average Waiting Time    : $(awk "BEGIN {printf \\"%.2f\\", $total_wt / $n}") ms"
echo "Average Turnaround Time : $(awk "BEGIN {printf \\"%.2f\\", $total_tat / $n}") ms"`,
      output: `=== ROUND ROBIN CPU SCHEDULING (Shell) ===
Process  Burst Time Waiting Time Turnaround Time
---------------------------------------------------
P1       5          7            12             
P2       4          6            10             
P3       3          6            9              
---------------------------------------------------
Average Waiting Time    : 6.33 ms
Average Turnaround Time : 10.33 ms`
    }
  },

  {
    num: 16,
    title: "FCFS Manual Trace (Burst Times 5, 3, 8, 6) & Shell Script for 5 Processes",
    partA: {
      marks: 50,
      q: "Trace the FCFS algorithm for burst times 5, 3, 8, 6 and calculate the average waiting time.",
      aim: "To demonstrate rigorous step-by-step Gantt chart manual tracing and compute WT, TAT, and AWT.",
      principle: `Given:
• P1: BT = 5
• P2: BT = 3
• P3: BT = 8
• P4: BT = 6
(Assuming Arrival Time AT = 0 for all processes in order P1, P2, P3, P4)`,
      table: `
<table class="index-table">
  <thead>
    <tr><th>Process</th><th>Burst Time (BT)</th><th>Start Time</th><th>Completion Time (CT)</th><th>Turnaround Time (TAT = CT - AT)</th><th>Waiting Time (WT = TAT - BT)</th></tr>
  </thead>
  <tbody>
    <tr><td>P1</td><td>5</td><td>0</td><td>5</td><td>5 - 0 = 5 ms</td><td>5 - 5 = 0 ms</td></tr>
    <tr><td>P2</td><td>3</td><td>5</td><td>8</td><td>8 - 0 = 8 ms</td><td>8 - 3 = 5 ms</td></tr>
    <tr><td>P3</td><td>8</td><td>8</td><td>16</td><td>16 - 0 = 16 ms</td><td>16 - 8 = 8 ms</td></tr>
    <tr><td>P4</td><td>6</td><td>16</td><td>22</td><td>22 - 0 = 22 ms</td><td>22 - 6 = 16 ms</td></tr>
  </tbody>
</table>`,
      code: `Gantt Chart Representation:
+-------+-------+---------------+-----------+
|  P1   |  P2   |      P3       |    P4     |
+-------+-------+---------------+-----------+
0       5       8              16          22

Calculations:
Total Waiting Time (TWT) = 0 + 5 + 8 + 16 = 29 ms
Average Waiting Time (AWT) = TWT / 4 = 29 / 4 = 7.25 ms

Total Turnaround Time (TTAT) = 5 + 8 + 16 + 22 = 51 ms
Average Turnaround Time (ATAT) = TTAT / 4 = 51 / 4 = 12.75 ms`,
      output: `Result:
Average Waiting Time    = 7.25 ms
Average Turnaround Time = 12.75 ms`
    },
    partB: {
      marks: 50,
      q: "Modify the FCFS shell script to read burst times of five processes and compute average waiting time.",
      aim: "To create an interactive script accepting 5 user inputs and calculating exact FCFS metrics.",
      principle: `Takes 5 user inputs into an array using <code>read</code>, validates inputs, and computes running sums.`,
      code: `#!/bin/bash
# Shell Script: FCFS for 5 Processes
echo "=== FCFS SCHEDULING FOR 5 PROCESSES ==="
declare -a bt
declare -a wt
declare -a tat

for ((i=1; i<=5; i++)); do
    read -p "Enter Burst Time for Process P$i: " b
    bt[$((i-1))]=$b
done

wt[0]=0
tat[0]=\${bt[0]}
tot_wt=0
tot_tat=\${bt[0]}

for ((i=1; i<5; i++)); do
    wt[$i]=$(( wt[i-1] + bt[i-1] ))
    tat[$i]=$(( wt[i] + bt[i] ))
    tot_wt=$(( tot_wt + wt[i] ))
    tot_tat=$(( tot_tat + tat[i] ))
done

echo ""
printf "%-8s %-12s %-14s %-16s\\n" "Process" "Burst Time" "Waiting Time" "Turnaround Time"
echo "--------------------------------------------------------"
for ((i=0; i<5; i++)); do
    printf "P%-7d %-12d %-14d %-16d\\n" $((i+1)) \${bt[$i]} \${wt[$i]} \${tat[$i]}
done
echo "--------------------------------------------------------"
echo "Total Waiting Time   : $tot_wt ms"
echo "Average Waiting Time : $(awk "BEGIN {printf \\"%.2f\\", $tot_wt / 5}") ms"
echo "Average Turnaround   : $(awk "BEGIN {printf \\"%.2f\\", $tot_tat / 5}") ms"`,
      output: `=== FCFS SCHEDULING FOR 5 PROCESSES ===
Enter Burst Time for Process P1: 4
Enter Burst Time for Process P2: 6
Enter Burst Time for Process P3: 2
Enter Burst Time for Process P4: 8
Enter Burst Time for Process P5: 5

Process  Burst Time   Waiting Time   Turnaround Time 
--------------------------------------------------------
P1       4            0              4               
P2       6            4              10              
P3       2            10             12              
P4       8            12             20              
P5       5            20             25              
--------------------------------------------------------
Total Waiting Time   : 46 ms
Average Waiting Time : 9.20 ms
Average Turnaround   : 14.20 ms`
    }
  },

  {
    num: 17,
    title: "Inter-Process Communication (IPC) via Pipes in C & UNIX Shell Pipes",
    partA: {
      marks: 50,
      q: "Write a C program to implement Inter Process Communication (IPC) between parent and child processes using pipes.",
      aim: "To demonstrate unidirectional IPC by creating a half-duplex pipe using pipe() and fork().",
      principle: `<code>pipe(int fd[2])</code> creates an anonymous pipe channel:
• <code>fd[0]</code> is open for reading.
• <code>fd[1]</code> is open for writing.
Child closes <code>fd[0]</code> and writes; parent closes <code>fd[1]</code> and reads.`,
      code: `#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main() {
    int fd[2];
    pid_t pid;
    char write_msg[] = "Hello from Child Process via Pipe!";
    char read_msg[100];

    if (pipe(fd) == -1) {
        perror("Pipe creation failed");
        return 1;
    }

    pid = fork();
    if (pid < 0) {
        perror("Fork failed");
        return 1;
    } else if (pid == 0) {
        // Child Process -> Writer
        close(fd[0]); // Close unused read end
        printf("[CHILD] Writing message to pipe...\\n");
        write(fd[1], write_msg, strlen(write_msg) + 1);
        close(fd[1]); // Close write end after sending
    } else {
        // Parent Process -> Reader
        close(fd[1]); // Close unused write end
        wait(NULL);   // Wait for child to write
        read(fd[0], read_msg, sizeof(read_msg));
        printf("[PARENT] Successfully received message from pipe: '%s'\\n", read_msg);
        close(fd[0]); // Close read end
    }

    return 0;
}`,
      output: `[CHILD] Writing message to pipe...
[PARENT] Successfully received message from pipe: 'Hello from Child Process via Pipe!'`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to demonstrate Inter Process Communication using UNIX pipes.",
      aim: "To demonstrate pipeline data streaming (|) and Named Pipes (FIFOs via mkfifo) in Bash.",
      principle: `Anonymous pipes redirect stdout of command 1 into stdin of command 2 (<code>cmd1 | cmd2</code>).
Named pipes create a filesystem node (FIFO) allowing unrelated processes to communicate.`,
      code: `#!/bin/bash
# Shell Script: Demonstrating IPC via Anonymous and Named Pipes
echo "=== IPC DEMONSTRATION IN SHELL ==="

echo "1. Anonymous Pipeline IPC:"
echo "Process A" | tr 'a-z' 'A-Z' | sed 's/^/[Received by Process B]: /'

echo ""
echo "2. Named Pipe (FIFO) Demonstration:"
FIFO_PATH="/tmp/test_fifo_$$"
mkfifo $FIFO_PATH

# Background writer process
(
    echo "Message from background sender (PID: $BASHPID)" > $FIFO_PATH
) &

# Foreground reader process
read msg < $FIFO_PATH
echo "[Foreground Receiver]: Successfully read from FIFO -> '$msg'"

rm -f $FIFO_PATH`,
      output: `=== IPC DEMONSTRATION IN SHELL ===
1. Anonymous Pipeline IPC:
[Received by Process B]: PROCESS A

2. Named Pipe (FIFO) Demonstration:
[Foreground Receiver]: Successfully read from FIFO -> 'Message from background sender (PID: 9102)'`
    }
  },

  {
    num: 18,
    title: "FIFO Page Replacement Manual Trace (String 7 0 1 2 0 3 0 4 2 3 0 3 2) & Shell Representation",
    partA: {
      marks: 50,
      q: "For the reference string 7 0 1 2 0 3 0 4 2 3 0 3 2 with 3 frames, calculate the number of page faults using FIFO.",
      aim: "To manually trace FIFO page replacement for 13 page references using 3 memory frames.",
      principle: `Oldest page in physical frame is replaced when all 3 frames are occupied and a page fault occurs.`,
      table: `
<table class="index-table">
  <thead>
    <tr><th>Step</th><th>Ref</th><th>F0</th><th>F1</th><th>F2</th><th>Status</th><th>Victim Replaced</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>7</td><td>7</td><td>-</td><td>-</td><td>FAULT</td><td>Frame 0 allocated</td></tr>
    <tr><td>2</td><td>0</td><td>7</td><td>0</td><td>-</td><td>FAULT</td><td>Frame 1 allocated</td></tr>
    <tr><td>3</td><td>1</td><td>7</td><td>0</td><td>1</td><td>FAULT</td><td>Frame 2 allocated</td></tr>
    <tr><td>4</td><td>2</td><td>2</td><td>0</td><td>1</td><td>FAULT</td><td>Replace 7 (F0)</td></tr>
    <tr><td>5</td><td>0</td><td>2</td><td>0</td><td>1</td><td>HIT</td><td>0 present</td></tr>
    <tr><td>6</td><td>3</td><td>2</td><td>3</td><td>1</td><td>FAULT</td><td>Replace 0 (F1)</td></tr>
    <tr><td>7</td><td>0</td><td>2</td><td>3</td><td>0</td><td>FAULT</td><td>Replace 1 (F2)</td></tr>
    <tr><td>8</td><td>4</td><td>4</td><td>3</td><td>0</td><td>FAULT</td><td>Replace 2 (F0)</td></tr>
    <tr><td>9</td><td>2</td><td>4</td><td>2</td><td>0</td><td>FAULT</td><td>Replace 3 (F1)</td></tr>
    <tr><td>10</td><td>3</td><td>4</td><td>2</td><td>3</td><td>FAULT</td><td>Replace 0 (F2)</td></tr>
    <tr><td>11</td><td>0</td><td>0</td><td>2</td><td>3</td><td>FAULT</td><td>Replace 4 (F0)</td></tr>
    <tr><td>12</td><td>3</td><td>0</td><td>2</td><td>3</td><td>HIT</td><td>3 present</td></tr>
    <tr><td>13</td><td>2</td><td>0</td><td>2</td><td>3</td><td>HIT</td><td>2 present</td></tr>
  </tbody>
</table>`,
      code: `Summary Statistics:
Total Memory References: 13
Total Page Faults (Misses): 10 Page Faults
Total Page Hits           : 3 Page Hits
Hit Ratio                 : (3 / 13) * 100 = 23.08%
Fault Ratio               : (10 / 13) * 100 = 76.92%`,
      output: `Result for Reference String: 7 0 1 2 0 3 0 4 2 3 0 3 2 with 3 Frames:
Page Faults = 10
Page Hits   = 3
Fault Ratio = 76.92%`
    },
    partB: {
      marks: 50,
      q: "Explain how a reference string and frame size are represented in a shell script for page replacement.",
      aim: "To demonstrate data structure mapping for page replacement simulations in Bash.",
      principle: `• <strong>Reference String:</strong> Bash standard array <code>ref=(7 0 1 2 0 3 0 4 2 3 0 3 2)</code>.
• <strong>Frames:</strong> Fixed-size array initialized to -1 <code>frames=(-1 -1 -1)</code>.
• <strong>Pointer:</strong> Circular index <code>victim_ptr=$(( (victim_ptr + 1) % frame_size ))</code>.`,
      code: `#!/bin/bash
# Shell Script Structure Representation
REF_STRING=(7 0 1 2 0 3 0 4 2 3 0 3 2)
FRAME_SIZE=3
FRAMES=()

# Initialize empty frames
for ((i=0; i<FRAME_SIZE; i++)); do
    FRAMES[i]=-1
done

echo "Configuration:"
echo "  Reference Array: \${REF_STRING[*]}"
echo "  Frame Array    : \${FRAMES[*]}"
echo "  Frame Capacity : $FRAME_SIZE"`,
      output: `Configuration:
  Reference Array: 7 0 1 2 0 3 0 4 2 3 0 3 2
  Frame Array    : -1 -1 -1
  Frame Capacity : 3`
    }
  },

  {
    num: 19,
    title: "Best Fit Memory Allocation (Blocks: 500, 200, 300, 600; Procs: 357, 129, 191) & Shell State Tracking",
    partA: {
      marks: 50,
      q: "Given memory blocks 500, 200, 300, 600 and processes 357, 129, 191, allocate using Best Fit and show the result.",
      aim: "To manually trace the Best Fit allocation strategy where each process is allocated to the smallest block that is large enough.",
      principle: `Best Fit Strategy: Search the entire list of free memory blocks and pick the block with <code>min(Block_Size - Process_Size) >= 0</code>.
Minimizes wasted internal fragmentation per block.`,
      table: `
<table class="index-table">
  <thead>
    <tr><th>Process</th><th>Process Size</th><th>Eligible Free Blocks</th><th>Selected Best Fit Block</th><th>Remaining Block Size (Internal Fragmentation)</th></tr>
  </thead>
  <tbody>
    <tr><td>P1</td><td>357</td><td>Block 1 (500), Block 4 (600)</td><td>Block 1 (500) [Waste = 500 - 357 = 143]</td><td>143 KB</td></tr>
    <tr><td>P2</td><td>129</td><td>Block 2 (200), Block 3 (300), Block 4 (600)</td><td>Block 2 (200) [Waste = 200 - 129 = 71]</td><td>71 KB</td></tr>
    <tr><td>P3</td><td>191</td><td>Block 3 (300), Block 4 (600)</td><td>Block 3 (300) [Waste = 300 - 191 = 109]</td><td>109 KB</td></tr>
  </tbody>
</table>`,
      code: `Final Allocation Status:
Process P1 (357 KB) -> Allocated to Block 1 (500 KB) | Remaining = 143 KB
Process P2 (129 KB) -> Allocated to Block 2 (200 KB) | Remaining = 71 KB
Process P3 (191 KB) -> Allocated to Block 3 (300 KB) | Remaining = 109 KB

Unallocated Free Block:
Block 4 (600 KB) -> Completely Unused / Free!
Total Memory Allocated = 357 + 129 + 191 = 677 KB
Total Internal Fragmentation = 143 + 71 + 109 = 323 KB`,
      output: `Result Summary Table:
Process No | Process Size | Block Allocated | Block Size | Fragmentation
------------------------------------------------------------------------
P1         | 357 KB       | Block 1         | 500 KB     | 143 KB
P2         | 129 KB       | Block 2         | 200 KB     | 71 KB
P3         | 191 KB       | Block 3         | 300 KB     | 109 KB
Block 4 (600 KB) remains available.`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to display memory blocks before and after a simulated allocation.",
      aim: "To demonstrate memory state logging and dynamic updates in a Bash script.",
      principle: `Initializes block array, allocates processes by finding minimum difference, and prints before/after comparison.`,
      code: `#!/bin/bash
# Shell Script: Best Fit Memory Allocation
blocks=(500 200 300 600)
processes=(357 129 191)

echo "=== MEMORY ALLOCATION SIMULATION (BEST FIT) ==="
echo "Initial Memory Blocks: [\${blocks[*]}]"
echo "Incoming Processes   : [\${processes[*]}]"
echo ""

for ((i=0; i<\${#processes[@]}; i++)); do
    p=\${processes[$i]}
    best_idx=-1
    for ((j=0; j<\${#blocks[@]}; j++)); do
        if [ \${blocks[$j]} -ge $p ]; then
            if [ $best_idx -eq -1 ] || [ \${blocks[$j]} -lt \${blocks[$best_idx]} ]; then
                best_idx=$j
            fi
        fi
    done

    if [ $best_idx -ne -1 ]; then
        echo "Allocating P$((i+1)) ($p KB) -> Block $((best_idx+1)) (Size: \${blocks[$best_idx]} KB)"
        blocks[$best_idx]=$(( blocks[$best_idx] - p ))
    else
        echo "P$((i+1)) ($p KB) -> NOT ALLOCATED (Insufficient space)"
    fi
done

echo ""
echo "Remaining Memory Blocks After Allocation: [\${blocks[*]}]"`,
      output: `=== MEMORY ALLOCATION SIMULATION (BEST FIT) ===
Initial Memory Blocks: [500 200 300 600]
Incoming Processes   : [357 129 191]

Allocating P1 (357 KB) -> Block 1 (Size: 500 KB)
Allocating P2 (129 KB) -> Block 2 (Size: 200 KB)
Allocating P3 (191 KB) -> Block 3 (Size: 300 KB)

Remaining Memory Blocks After Allocation: [143 71 109 600]`
    }
  },

  {
    num: 20,
    title: "Logical Address Translation (Page Number & Offset) in C & Shell Page Table Representation",
    partA: {
      marks: 50,
      q: "Write a C program to compute the page number and offset for a given logical address and page size.",
      aim: "To implement mathematical address translation for paging architecture in C.",
      principle: `Given Logical Address <code>LA</code> and Page Size <code>PS</code>:
• <code>Page Number (p) = LA / PS</code>
• <code>Offset (d) = LA % PS</code>
Using bitwise arithmetic when <code>PS = 2^k</code>:
• <code>p = LA >> k</code>
• <code>d = LA & ((1 << k) - 1)</code>`,
      code: `#include <stdio.h>

void calculatePaging(unsigned int logical_addr, unsigned int page_size) {
    unsigned int page_number = logical_addr / page_size;
    unsigned int offset = logical_addr % page_size;

    printf("Logical Address : %u bytes\\n", logical_addr);
    printf("Page Size       : %u bytes\\n", page_size);
    printf("-----------------------------------------\\n");
    printf("Derived Page No : %u\\n", page_number);
    printf("Derived Offset  : %u bytes\\n", offset);
    printf("Verification    : (%u * %u) + %u = %u\\n\\n", 
           page_number, page_size, offset, (page_number * page_size) + offset);
}

int main() {
    printf("=== LOGICAL ADDRESS TRANSLATOR (C) ===\\n");
    calculatePaging(7250, 1024); // 1 KB page size
    calculatePaging(18500, 4096); // 4 KB page size
    return 0;
}`,
      output: `=== LOGICAL ADDRESS TRANSLATOR (C) ===
Logical Address : 7250 bytes
Page Size       : 1024 bytes
-----------------------------------------
Derived Page No : 7
Derived Offset  : 82 bytes
Verification    : (7 * 1024) + 82 = 7250

Logical Address : 18500 bytes
Page Size       : 4096 bytes
-----------------------------------------
Derived Page No : 4
Derived Offset  : 2116 bytes
Verification    : (4 * 4096) + 2116 = 18500`
    },
    partB: {
      marks: 50,
      q: "Explain how arrays are used in shell scripting to represent a page table.",
      aim: "To demonstrate representation and address mapping of page tables in Bash.",
      principle: `A page table is an index-addressed array:
• Array index = <strong>Page Number</strong>
• Array element = <strong>Physical Frame Number</strong>
Address translation in shell: <code>physical_address = (page_table[page] * page_size) + offset</code>.`,
      code: `#!/bin/bash
# Shell Script: Page Table Array Translation
PAGE_SIZE=1024
# Page Table: Page 0->Frame 5, Page 1->Frame 2, Page 2->Frame 8, Page 3->Frame 1
page_table=(5 2 8 1)

echo "=== SHELL SCRIPT PAGE TABLE TRANSLATION ==="
echo "Page Size  : $PAGE_SIZE bytes"
echo "Page Table : Page 0->Frame 5 | Page 1->Frame 2 | Page 2->Frame 8 | Page 3->Frame 1"
echo ""

read -p "Enter Logical Address: " la

p=$(( la / PAGE_SIZE ))
d=$(( la % PAGE_SIZE ))

if [ $p -ge \${#page_table[@]} ]; then
    echo "ERROR: Page $p out of range! Segmentation Fault."
    exit 1
fi

frame=\${page_table[$p]}
pa=$(( (frame * PAGE_SIZE) + d ))

echo "Page Number     : $p"
echo "Offset          : $d bytes"
echo "Mapped Frame    : $frame"
echo "Physical Address: $pa bytes"`,
      output: `=== SHELL SCRIPT PAGE TABLE TRANSLATION ===
Page Size  : 1024 bytes
Page Table : Page 0->Frame 5 | Page 1->Frame 2 | Page 2->Frame 8 | Page 3->Frame 1

Enter Logical Address: 2500
Page Number     : 2
Offset          : 452 bytes
Mapped Frame    : 8
Physical Address: 8644 bytes`
    }
  }
];
