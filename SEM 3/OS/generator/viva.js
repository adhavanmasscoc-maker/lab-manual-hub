// Comprehensive Viva Voce Questions & Answers covering all 15 OS Lab Experiments

module.exports = [
  {
    topic: "Unit 1: UNIX Environment, Linux & Shell Programming",
    qa: [
      {
        q: "What is an Operating System and what are its core functions?",
        a: "An Operating System (OS) is system software that acts as an intermediary between computer hardware and the computer user. Its core functions are Processor (CPU) Management, Memory Management, File System Management, Device (I/O) Management, Security/Protection, and providing a User Interface."
      },
      {
        q: "What is the difference between Kernel and Shell in UNIX?",
        a: "The Kernel is the core program that resides in memory, directly manages hardware resources (CPU, RAM, devices), and executes system calls. The Shell is a command language interpreter (CLI) that acts as an interface between the user and the kernel, parsing user commands and launching processes."
      },
      {
        q: "What is the difference between hard links and soft (symbolic) links?",
        a: "A hard link is an additional directory entry pointing directly to the existing file's inode number; it cannot cross filesystem boundaries or link directories. A soft (symbolic) link is a special file containing the path to another target file; it has its own inode and can span across different filesystems and point to directories."
      },
      {
        q: "What is the significance of the shebang line (#!) in shell scripts?",
        a: "The shebang (#!) followed by an absolute path (e.g., #!/bin/bash) instructs the operating system loader which interpreter binary must be spawned to execute the commands contained within the script file."
      }
    ]
  },
  {
    topic: "Unit 2: System Calls & Process Management",
    qa: [
      {
        q: "What is a System Call? How does it differ from a Library Call?",
        a: "A system call is a programmatic interface through which a user process requests privileged services directly from the operating system kernel, causing a context switch from User Mode to Kernel Mode via a software trap (interrupt). A library call (e.g., printf, strcpy) is a user-mode helper function, which may or may not invoke underlying system calls (e.g., printf invokes write())."
      },
      {
        q: "What does the fork() system call return in parent, child, and on failure?",
        a: "fork() returns -1 on failure (e.g. process limit exceeded), 0 to the newly spawned child process, and the child's positive Process ID (PID) to the parent process."
      },
      {
        q: "What is the difference between getpid() and getppid()?",
        a: "getpid() returns the unique process ID of the calling process, whereas getppid() returns the process ID of the calling process's parent process."
      },
      {
        q: "What is an Orphan Process and how does Linux handle it?",
        a: "An orphan process is a process whose parent has terminated before the child terminates. In Linux, orphan processes are automatically adopted by the init process (PID 1 or systemd), which regularly calls wait() to reap their exit status."
      },
      {
        q: "What is a Zombie Process and how is it prevented?",
        a: "A zombie (defunct) process is a process that has completed execution via exit(), but its entry remains in the process table because its parent has not yet read its exit status via wait(). Zombies are prevented by ensuring the parent process calls wait() / waitpid() or by handling the SIGCHLD signal."
      },
      {
        q: "What is the difference between wait() and waitpid()?",
        a: "wait(&status) blocks the parent until ANY child process terminates. waitpid(pid, &status, options) allows the caller to wait for a SPECIFIC child PID and supports non-blocking execution using the WNOHANG flag."
      }
    ]
  },
  {
    topic: "Unit 3: CPU Scheduling Algorithms",
    qa: [
      {
        q: "What is the difference between Preemptive and Non-Preemptive scheduling?",
        a: "In non-preemptive scheduling, once a process is allocated the CPU, it holds it until it terminates or blocks for I/O. In preemptive scheduling, the OS can interrupt an active process and allocate the CPU to a higher-priority or newly arrived process (e.g., Round Robin, SRTF)."
      },
      {
        q: "Define Turnaround Time and Waiting Time.",
        a: "Turnaround Time (TAT) is the total time elapsed from process arrival to process completion (TAT = Completion Time - Arrival Time). Waiting Time (WT) is the total time a process spends sitting in the ready queue waiting for CPU allocation (WT = Turnaround Time - Burst Time)."
      },
      {
        q: "What is the Convoy Effect?",
        a: "The Convoy Effect occurs in FCFS scheduling when a CPU-bound process with a huge burst time holds the CPU, forcing numerous short I/O-bound processes to wait behind it, drastically increasing average waiting time and reducing device utilization."
      },
      {
        q: "Why is Shortest Job First (SJF) considered optimal, and why can it cause Starvation?",
        a: "SJF is provably optimal because scheduling short jobs first mathematically minimizes the average waiting time. However, if a continuous stream of short jobs enters the ready queue, long jobs may never receive CPU time, causing Starvation (Indefinite Blocking). Starvation is cured using Aging."
      },
      {
        q: "How does Round Robin scheduling choose the Time Quantum?",
        a: "If the Time Quantum is extremely large, Round Robin degenerates into FCFS. If the Time Quantum is extremely small, excessive context switching overhead degrades system throughput. The optimal quantum is typically chosen such that 80% of CPU bursts are shorter than the quantum (commonly 10-50 ms)."
      }
    ]
  },
  {
    topic: "Unit 4: Inter-Process Communication & Synchronization",
    qa: [
      {
        q: "What is an Anonymous Pipe in UNIX and what are its limitations?",
        a: "An anonymous pipe is a unidirectional half-duplex communication channel managed in kernel buffer memory. Limitations: 1) Unidirectional (one read end, one write end), 2) Can only be shared between related processes (parent-child or sibling processes with a common ancestor)."
      },
      {
        q: "What is a Named Pipe (FIFO)?",
        a: "A Named Pipe (FIFO) is an extension of an anonymous pipe that appears as a special file node on the filesystem. It persists beyond process lifetimes and enables unrelated processes on the same machine to communicate bidirectionally."
      },
      {
        q: "What is a Critical Section and what are the three conditions for a valid solution?",
        a: "A Critical Section is a segment of code where shared resources (memory, files) are accessed and updated. A valid solution must satisfy: 1) Mutual Exclusion (at most one process in CS), 2) Progress (selection of next process cannot be stalled indefinitely), and 3) Bounded Waiting (finite limit on entries before a waiting process is admitted)."
      },
      {
        q: "What is a Race Condition?",
        a: "A race condition occurs when two or more concurrent threads or processes access shared mutable state without proper synchronization, and the final result depends unpredictably on the specific execution ordering and thread scheduling."
      },
      {
        q: "What is a Semaphore? Differentiate between Binary and Counting Semaphores.",
        a: "A Semaphore is an integer synchronization variable accessed only via atomic operations wait() (P) and post() (V). A Binary Semaphore has values 0 or 1 and behaves as a Mutual Exclusion Lock (Mutex). A Counting Semaphore has an unrestricted non-negative range and controls access to a finite pool of identical resource instances."
      }
    ]
  },
  {
    topic: "Unit 5: Deadlocks & Banker's Algorithm",
    qa: [
      {
        q: "What are the four necessary Coffman conditions for a Deadlock to occur?",
        a: "1) Mutual Exclusion (at least one non-shareable resource), 2) Hold and Wait (process holds resources while requesting more), 3) No Preemption (resources cannot be forcibly confiscated), 4) Circular Wait (closed chain of processes where each waits for a resource held by the next)."
      },
      {
        q: "Differentiate between Deadlock Prevention, Avoidance, and Detection.",
        a: "• Prevention: Enforces constraints on resource requests to invalidate at least one Coffman condition.\n• Avoidance: Dynamically evaluates resource allocation state at runtime (e.g., Banker's Algorithm) to guarantee the system never enters an Unsafe State.\n• Detection: Allows deadlocks to occur, periodically runs detection algorithms (Wait-For Graph or Matrix Reduction), and recovers by preemption or killing processes."
      },
      {
        q: "In Banker's Algorithm, what is the formula for the Need Matrix?",
        a: "Need[i][j] = Max[i][j] - Allocation[i][j], which represents the remaining resources process Pi may request to complete execution."
      },
      {
        q: "Is an Unsafe State always a Deadlocked State?",
        a: "No! A Deadlocked State is always Unsafe, but an Unsafe State is NOT necessarily deadlocked. An unsafe state merely indicates that the OS cannot guarantee all processes can complete without deadlock if every process simultaneously requests its maximum declared resources."
      }
    ]
  },
  {
    topic: "Unit 6: Multithreading & POSIX Threads",
    qa: [
      {
        q: "What is the difference between a Process and a Thread?",
        a: "A Process is an executing instance of a program with its own independent address space, page tables, file descriptors, and high context-switch overhead. A Thread is a lightweight unit of CPU utilization within a process that shares the text, data, and heap segments with peer threads, but possesses its own program counter, register set, and stack."
      },
      {
        q: "What is the purpose of pthread_join()?",
        a: "pthread_join() blocks the calling thread until the specified target thread terminates, similar to wait() for processes. It also reaps the thread's termination status and releases its allocated thread descriptor resources to prevent thread leaks."
      }
    ]
  },
  {
    topic: "Unit 7: Memory Management & Virtual Memory",
    qa: [
      {
        q: "What is Paging and why does it eliminate External Fragmentation?",
        a: "Paging is a memory management scheme that divides virtual memory into fixed-size pages and physical RAM into identically sized frames. Because any free frame can be allocated to any page of a process, memory allocation does not require contiguous physical blocks, completely eliminating external fragmentation."
      },
      {
        q: "What is a Translation Lookaside Buffer (TLB)?",
        a: "A TLB is a high-speed hardware associative cache located inside the CPU/MMU that stores recent virtual-to-physical page table translations. A TLB hit avoids an extra memory access to read the page table in RAM."
      },
      {
        q: "What is Internal Fragmentation vs External Fragmentation?",
        a: "Internal Fragmentation is wasted space inside an allocated memory partition (e.g., process requests 3 KB, gets a 4 KB frame, wasting 1 KB). External Fragmentation occurs when total free memory is sufficient to satisfy a request, but the space is fragmented into non-contiguous holes too small to fit the process."
      },
      {
        q: "What is Belady's Anomaly and which algorithm exhibits it?",
        a: "Belady's Anomaly is the counter-intuitive phenomenon where increasing the number of allocated page frames causes an INCREASE in the number of page faults. It occurs in FIFO page replacement, but never occurs in stack-based algorithms such as LRU or Optimal."
      },
      {
        q: "What is Thrashing and how is it resolved?",
        a: "Thrashing occurs when a computer's virtual memory subsystem is in a constant state of paging—spending more time swapping pages in and out of secondary storage than executing CPU instructions. It is resolved by reducing the degree of multiprogramming (swapping out processes) or allocating more physical memory using the Working Set Model."
      }
    ]
  },
  {
    topic: "Unit 8: File Systems & Disk Scheduling",
    qa: [
      {
        q: "Compare Sequential, Indexed, and Linked file allocation.",
        a: "• Sequential: Contiguous blocks on disk; fast sequential and direct access, but suffers from external fragmentation and dynamic file growth limitations.\n• Linked: Blocks are scattered and connected via pointers; no external fragmentation, but slow direct/random access and pointer overhead.\n• Indexed: Each file has an index block storing pointers to all its data blocks; supports fast direct access without external fragmentation, but index block overhead for small files."
      },
      {
        q: "What is Seek Time vs Rotational Latency in Disk Scheduling?",
        a: "Seek Time is the time required for the disk read/write head assembly to move to the cylinder containing the requested sector. Rotational Latency is the time waiting for the target sector on the spinning platter to rotate beneath the read/write head."
      },
      {
        q: "Compare SSTF, SCAN, and C-SCAN disk scheduling algorithms.",
        a: "• SSTF (Shortest Seek Time First): Selects request closest to current head position; minimizes seek time, but causes starvation for distant requests.\n• SCAN (Elevator Algorithm): Head sweeps continuously back and forth across disk cylinders servicing requests on the path; prevents starvation.\n• C-SCAN (Circular SCAN): Head sweeps in one direction servicing requests, then immediately jumps back to the beginning without servicing requests on the return trip; provides uniform waiting time."
      }
    ]
  }
];
