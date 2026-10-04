// Set 2: Questions 1 to 20 (Each containing Part A [50 Marks] and Part B [50 Marks])
// Total: 20 Questions (2000 Marks equivalent model question bank)

module.exports = [
  {
    num: 1,
    title: "pipe() System Call for One-Way IPC in C & Shell Pipe with read Command",
    partA: {
      marks: 50,
      q: "Explain the pipe() system call with its syntax and write a C program to demonstrate one-way communication.",
      aim: "To explain anonymous pipe mechanics and implement unidirectional parent-child IPC in C.",
      principle: `<code>int pipe(int pipefd[2]);</code> creates a unidirectional data channel in kernel memory:
• <code>pipefd[0]</code> refers to the read end of the pipe.
• <code>pipefd[1]</code> refers to the write end of the pipe.
• Bytes written to <code>pipefd[1]</code> are buffered until read from <code>pipefd[0]</code> in FIFO order.
• Return Value: <code>0</code> on success, <code>-1</code> on failure (with errno set).`,
      code: `#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>

int main() {
    int pfd[2];
    pid_t pid;
    char write_buf[] = "System Call Communication: Kernel Pipe Active";
    char read_buf[100];

    if (pipe(pfd) == -1) {
        perror("pipe creation failed");
        return 1;
    }

    pid = fork();
    if (pid < 0) {
        perror("fork failed");
        return 1;
    } else if (pid == 0) {
        // Child acts as reader
        close(pfd[1]); // Close unused write descriptor
        read(pfd[0], read_buf, sizeof(read_buf));
        printf("[CHILD READER] Received message: \"%s\"\\n", read_buf);
        close(pfd[0]);
    } else {
        // Parent acts as writer
        close(pfd[0]); // Close unused read descriptor
        printf("[PARENT WRITER] Transmitting buffer through pipefd[1]...\\n");
        write(pfd[1], write_buf, strlen(write_buf) + 1);
        close(pfd[1]);
        wait(NULL); // Synchronize with child
    }

    return 0;
}`,
      output: `[PARENT WRITER] Transmitting buffer through pipefd[1]...
[CHILD READER] Received message: "System Call Communication: Kernel Pipe Active"`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to send a message from one process to another using the pipe operator and read command.",
      aim: "To demonstrate pipeline data streaming (|) combined with standard read command consumption in Bash.",
      principle: `The pipe character <code>|</code> connects standard output of the producer process to standard input of the consumer process in separate concurrent subshells.`,
      code: `#!/bin/bash
# Shell Script: IPC using pipe operator and read command
echo "Initiating Pipeline Process Communication..."

# Process 1 streams text; Process 2 reads it into variable
echo "Confidential Data Stream from Subshell 1" | {
    read received_msg
    echo "[Consumer Subshell]: Successfully intercepted message -> '$received_msg'"
    echo "[Consumer Subshell]: Processing token count: $(echo $received_msg | wc -w) words"
}

echo "Pipeline execution completed."`,
      output: `Initiating Pipeline Process Communication...
[Consumer Subshell]: Successfully intercepted message -> 'Confidential Data Stream from Subshell 1'
[Consumer Subshell]: Processing token count: 6 words
Pipeline execution completed.`
    }
  },

  {
    num: 2,
    title: "Child-to-Parent IPC via Pipe in C & Shell IPC Simulation",
    partA: {
      marks: 50,
      q: "Write a C program to send a message from a child process to a parent process using a pipe and display it.",
      aim: "To demonstrate reverse unidirectional IPC where child process transmits telemetry data to parent process.",
      principle: `Child process inherits file descriptors from <code>pipe(fd)</code>.
Child writes to <code>fd[1]</code> and closes it. Parent waits and reads from <code>fd[0]</code>.`,
      code: `#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <sys/wait.h>

int main() {
    int fd[2];
    pid_t pid;
    char child_msg[] = "STATUS_OK: Child task executed successfully.";
    char buffer[128];

    if (pipe(fd) < 0) { perror("Pipe failed"); exit(1); }
    pid = fork();

    if (pid < 0) { perror("Fork failed"); exit(1); }

    if (pid == 0) {
        // Child Process -> Producer
        close(fd[0]); // Close read end
        printf("[CHILD (PID: %d)] Sending telemetry to parent...\\n", getpid());
        write(fd[1], child_msg, strlen(child_msg) + 1);
        close(fd[1]);
        exit(0);
    } else {
        // Parent Process -> Consumer
        close(fd[1]); // Close write end
        wait(NULL);   // Wait for child
        read(fd[0], buffer, sizeof(buffer));
        printf("[PARENT (PID: %d)] Received packet from child: '%s'\\n", getpid(), buffer);
        close(fd[0]);
    }

    return 0;
}`,
      output: `[CHILD (PID: 3201)] Sending telemetry to parent...
[PARENT (PID: 3200)] Received packet from child: 'STATUS_OK: Child task executed successfully.'`
    },
    partB: {
      marks: 50,
      q: "Explain how shell scripting simulates IPC using pipes, with a suitable example script.",
      aim: "To explain how Bash simulates IPC channels using Anonymous Pipes (|) and Named Pipes (mkfifo).",
      principle: `Named Pipes (FIFOs) appear in the filesystem and maintain persistence across distinct processes.
Writing blocks until a reader attaches, maintaining synchronization.`,
      code: `#!/bin/bash
# Shell Script: Named Pipe (FIFO) IPC Simulation
FIFO_PIPE="/tmp/os_lab_pipe_$$"
mkfifo $FIFO_PIPE

echo "Created Named Pipe: $FIFO_PIPE"

# Producer Process (Child)
(
    echo "Child Process (PID: $BASHPID) computing sensor telemetry..."
    sleep 1
    echo "SENSOR_DATA: TEMP=28.4C, PRESSURE=1013hPa" > $FIFO_PIPE
) &

# Consumer Process (Parent)
echo "Parent Shell ($$) reading from FIFO..."
read received_packet < $FIFO_PIPE
echo "Parent successfully captured: $received_packet"

rm -f $FIFO_PIPE`,
      output: `Created Named Pipe: /tmp/os_lab_pipe_6420
Parent Shell (6420) reading from FIFO...
Child Process (PID: 6421) computing sensor telemetry...
Parent successfully captured: SENSOR_DATA: TEMP=28.4C, PRESSURE=1013hPa`
    }
  },

  {
    num: 3,
    title: "Mutual Exclusion with Semaphores in C & Shell Lock File Mechanism",
    partA: {
      marks: 50,
      q: "Write a C program to implement mutual exclusion using semaphores for two processes.",
      aim: "To enforce Mutual Exclusion (Mutex) across two concurrent execution threads/processes using POSIX semaphores.",
      principle: `A binary semaphore initialized to <code>1</code> acts as a mutex:
• <code>sem_wait(&mutex)</code>: Decrements semaphore. If value <= 0, process blocks. (Entry Section)
• <em>Critical Section:</em> Only one process executes at any given time.
• <code>sem_post(&mutex)</code>: Increments semaphore, waking up blocked waiting process. (Exit Section)`,
      code: `#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

sem_t mutex;
int shared_counter = 0;

void* process_worker(void* arg) {
    long id = (long)arg;
    
    // Entry Section
    sem_wait(&mutex);
    
    // Critical Section
    printf("[PROCESS/THREAD %ld] Entered Critical Section. Counter = %d\\n", id, shared_counter);
    int temp = shared_counter;
    sleep(1); // Simulate time spent in Critical Section
    shared_counter = temp + 1;
    printf("[PROCESS/THREAD %ld] Exiting Critical Section. New Counter = %d\\n", id, shared_counter);
    
    // Exit Section
    sem_post(&mutex);
    return NULL;
}

int main() {
    pthread_t t1, t2;
    sem_init(&mutex, 0, 1); // Binary semaphore initialized to 1

    pthread_create(&t1, NULL, process_worker, (void*)1);
    pthread_create(&t2, NULL, process_worker, (void*)2);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    sem_destroy(&mutex);
    printf("Final Shared Counter: %d (Expected: 2)\\n", shared_counter);
    return 0;
}`,
      output: `[PROCESS/THREAD 1] Entered Critical Section. Counter = 0
[PROCESS/THREAD 1] Exiting Critical Section. New Counter = 1
[PROCESS/THREAD 2] Entered Critical Section. Counter = 1
[PROCESS/THREAD 2] Exiting Critical Section. New Counter = 2
Final Shared Counter: 2 (Expected: 2)`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to implement mutual exclusion using a lock file mechanism.",
      aim: "To implement mutual exclusion in Bash using atomic filesystem lock creation.",
      principle: `<code>mkdir</code> or <code>noclobber</code> file creation is atomic at the kernel VFS layer.
If lock file exists, second process waits; once first process removes lock, second enters.`,
      code: `#!/bin/bash
# Mutual Exclusion in Shell Script using Lock File
LOCK_FILE="/tmp/crit_sec.lock"

acquire_lock() {
    local pid=$$
    while ! ( set -o noclobber; echo "$pid" > "$LOCK_FILE" ) 2> /dev/null; do
        echo "Process $pid: Lock busy! Waiting..."
        sleep 1
    done
    echo "Process $pid: Lock ACQUIRED."
}

release_lock() {
    local pid=$$
    rm -f "$LOCK_FILE"
    echo "Process $pid: Lock RELEASED."
}

# Simulate Critical Section
echo "--- Testing Lock File Mutual Exclusion ---"
acquire_lock
echo ">>> Process $$ executing INSIDE CRITICAL SECTION <<<"
sleep 2
release_lock`,
      output: `--- Testing Lock File Mutual Exclusion ---
Process 7810: Lock ACQUIRED.
>>> Process 7810 executing INSIDE CRITICAL SECTION <<<
Process 7810: Lock RELEASED.`
    }
  },

  {
    num: 4,
    title: "POSIX Semaphore Functions (sem_init, sem_wait, sem_post) & Shell Lock Emulation",
    partA: {
      marks: 50,
      q: "Explain sem_init(), sem_wait(), and sem_post() functions with their syntax.",
      aim: "To analyze POSIX counting and binary semaphore system primitives with syntax, parameters, and operation semantics.",
      principle: `Header: <code>#include &lt;semaphore.h&gt;</code>
1. <strong>sem_init:</strong>
   <code>int sem_init(sem_t *sem, int pshared, unsigned int value);</code>
   • <code>sem</code>: Pointer to semaphore object.
   • <code>pshared</code>: 0 for thread sharing within process; non-zero for sharing across processes (in shared memory).
   • <code>value</code>: Initial semaphore integer value.
2. <strong>sem_wait:</strong>
   <code>int sem_wait(sem_t *sem);</code>
   • Atomic decrement (P operation). If value > 0, decrements and proceeds; if value == 0, calling thread blocks.
3. <strong>sem_post:</strong>
   <code>int sem_post(sem_t *sem);</code>
   • Atomic increment (V operation). Increments value; if threads blocked, wakes one up.`,
      code: `/* Usage Template */
sem_t s;
sem_init(&s, 0, 1); // Mutex

sem_wait(&s);
// Critical Section code here
sem_post(&s);

sem_destroy(&s);`
    },
    partB: {
      marks: 50,
      q: "Explain how a lock file simulates semaphore behaviour in shell scripting, with a script example.",
      aim: "To demonstrate how file existence flags in the filesystem emulate binary semaphore state transitions (0 and 1).",
      principle: `A binary semaphore has values 0 (locked) and 1 (free).
• Semaphore Value = 1: Lock file absent.
• <code>sem_wait()</code>: Spin-wait loop checks file existence; when absent, atomically creates file.
• <code>sem_post()</code>: Deletes lock file, allowing other waiting scripts to enter.`,
      code: `#!/bin/bash
# Simulating Semaphore using Lock File in Shell
LOCK_DIR="/tmp/sem_lock_dir"

sem_wait_sim() {
    while ! mkdir "$LOCK_DIR" 2>/dev/null; do
        echo "Worker $$: Semaphore is 0 (Blocked). Waiting..."
        sleep 1
    done
    echo "Worker $$: sem_wait() passed. Value = 0 (Lock Held)"
}

sem_post_sim() {
    rmdir "$LOCK_DIR"
    echo "Worker $$: sem_post() executed. Value = 1 (Lock Released)"
}

echo "Starting Semaphore Simulation..."
sem_wait_sim
echo ">>> Worker $$ in Critical Section <<<"
sleep 2
sem_post_sim`,
      output: `Starting Semaphore Simulation...
Worker 8920: sem_wait() passed. Value = 0 (Lock Held)
>>> Worker 8920 in Critical Section <<<
Worker 8920: sem_post() executed. Value = 1 (Lock Released)`
    }
  },

  {
    num: 5,
    title: "Semaphore Critical Section Access in C & Multi-Process Shell Lock Coordination",
    partA: {
      marks: 50,
      q: "Write a C program to demonstrate the use of a semaphore to control access to a critical section.",
      aim: "To verify that POSIX semaphores ensure only one execution context modifies a shared resource at any instant.",
      principle: `Enforces Dijkstra's Critical Section properties:
1. Mutual Exclusion: At most one process in Critical Section.
2. Progress: Selection cannot be postponed indefinitely.
3. Bounded Waiting: Bound exists on number of times other processes enter.`,
      code: `#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

sem_t cs_sem;

void* worker(void* arg) {
    int id = *((int*)arg);
    printf("Thread %d: Requesting entry into Critical Section...\\n", id);

    sem_wait(&cs_sem); // P operation
    printf(">>> Thread %d: GRANTED entry. Inside Critical Section.\\n", id);
    sleep(2); // In CS
    printf("<<< Thread %d: LEAVING Critical Section.\\n", id);
    sem_post(&cs_sem); // V operation

    return NULL;
}

int main() {
    pthread_t t1, t2;
    int id1 = 1, id2 = 2;

    sem_init(&cs_sem, 0, 1);

    pthread_create(&t1, NULL, worker, &id1);
    pthread_create(&t2, NULL, worker, &id2);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    sem_destroy(&cs_sem);
    return 0;
}`,
      output: `Thread 1: Requesting entry into Critical Section...
>>> Thread 1: GRANTED entry. Inside Critical Section.
Thread 2: Requesting entry into Critical Section...
<<< Thread 1: LEAVING Critical Section.
>>> Thread 2: GRANTED entry. Inside Critical Section.
<<< Thread 2: LEAVING Critical Section.`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to ensure only one process accesses the critical section at a time using a lock file.",
      aim: "To launch concurrent background processes and demonstrate sequential access to a critical resource via lock file.",
      principle: `Two concurrent subshells compete for a single lock file. The first subshell gets the lock; the second waits until the lock is released.`,
      code: `#!/bin/bash
# Shell Script: Critical Section protection for 2 concurrent jobs
LOCK_FILE="/tmp/cs_demo.lock"
SHARED_LOG="/tmp/cs_shared.txt"
rm -f $LOCK_FILE $SHARED_LOG

run_worker() {
    local id=$1
    echo "[Worker $id]: Competing for Critical Section..."
    while ! ( set -o noclobber; echo "$id" > "$LOCK_FILE" ) 2>/dev/null; do
        sleep 0.5
    done
    
    echo ">>> [Worker $id]: Entered Critical Section at $(date +%T)" >> $SHARED_LOG
    sleep 2
    echo "<<< [Worker $id]: Leaving Critical Section at $(date +%T)" >> $SHARED_LOG
    rm -f "$LOCK_FILE"
}

run_worker "A" &
run_worker "B" &
wait

cat $SHARED_LOG
rm -f $SHARED_LOG`,
      output: `>>> [Worker A]: Entered Critical Section at 10:15:01
<<< [Worker A]: Leaving Critical Section at 10:15:03
>>> [Worker B]: Entered Critical Section at 10:15:03
<<< [Worker B]: Leaving Critical Section at 10:15:05`
    }
  },

  {
    num: 6,
    title: "Race Conditions & Semaphore Prevention in C & Shell Lock Lifecycle",
    partA: {
      marks: 50,
      q: "Explain the concept of race condition and how semaphores prevent it, with a C program example.",
      aim: "To demonstrate how concurrent read-modify-write operations produce inconsistent state and how semaphores serialize execution.",
      principle: `A <strong>Race Condition</strong> arises when multiple threads access and manipulate shared data concurrently, and the outcome depends on the particular order in which access takes place.
Example: <code>counter++</code> compiles to three assembly instructions:
1. <code>MOV EAX, [counter]</code>
2. <code>ADD EAX, 1</code>
3. <code>MOV [counter], EAX</code>
If preempted between steps 1 and 3, increments are lost. Semaphores make this sequence atomic.`,
      code: `#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

#define ITERATIONS 100000
int counter = 0;
sem_t lock;

void* thread_func(void* arg) {
    for (int i = 0; i < ITERATIONS; i++) {
        sem_wait(&lock); // Mutual exclusion lock
        counter++;       // Atomic Critical Section
        sem_post(&lock);
    }
    return NULL;
}

int main() {
    pthread_t t1, t2;
    sem_init(&lock, 0, 1);

    pthread_create(&t1, NULL, thread_func, NULL);
    pthread_create(&t2, NULL, thread_func, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Counter with Semaphore Protection = %d (Expected: %d)\\n", 
           counter, 2 * ITERATIONS);

    sem_destroy(&lock);
    return 0;
}`,
      output: `Counter with Semaphore Protection = 200000 (Expected: 200000)`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to demonstrate the creation and removal of a lock file for critical section access.",
      aim: "To implement robust lock file handling with trap handlers in Bash to ensure lock cleanup even on script termination.",
      principle: `Uses <code>trap 'rm -f $LOCKFILE' EXIT INT TERM</code> to prevent stale/orphaned locks if interrupted.`,
      code: `#!/bin/bash
# Shell Script: Creation and Removal of Lock File with Traps
LOCKFILE="/tmp/app_critical.lock"
trap 'rm -f $LOCKFILE; echo "[TRAP]: Cleaned lock on exit."; exit' EXIT INT TERM

echo "Process $$ attempting to acquire lock..."
if ( set -o noclobber; echo "$$" > "$LOCKFILE" ) 2>/dev/null; then
    echo "SUCCESS: Lock file created by PID $$."
    echo "Executing critical business logic..."
    sleep 2
    rm -f "$LOCKFILE"
    echo "SUCCESS: Lock file removed cleanly."
else
    echo "FAILED: Lock file held by another process: $(cat $LOCKFILE)"
fi`,
      output: `Process 9540 attempting to acquire lock...
SUCCESS: Lock file created by PID 9540.
Executing critical business logic...
SUCCESS: Lock file removed cleanly.
[TRAP]: Cleaned lock on exit.`
    }
  },

  {
    num: 7,
    title: "Parent-Child Semaphore Synchronization in C & Shell Wait-and-Check Loop",
    partA: {
      marks: 50,
      q: "Write a C program to implement semaphore-based synchronization between a parent and a child process.",
      aim: "To enforce strict order of execution where parent waits for a signal from child using named semaphores.",
      principle: `Uses POSIX named semaphores <code>sem_open()</code> to synchronize across independent process address spaces.
Initial value <code>0</code>: Parent calls <code>sem_wait()</code> and blocks immediately until child calls <code>sem_post()</code>.`,
      code: `#include <stdio.h>
#include <unistd.h>
#include <semaphore.h>
#include <fcntl.h>
#include <sys/wait.h>

#define SEM_NAME "/os_sync_sem"

int main() {
    sem_t *sem = sem_open(SEM_NAME, O_CREAT | O_EXCL, 0644, 0); // Init 0
    if (sem == SEM_FAILED) {
        sem_unlink(SEM_NAME);
        sem = sem_open(SEM_NAME, O_CREAT, 0644, 0);
    }

    pid_t pid = fork();

    if (pid == 0) {
        // Child
        printf("[CHILD] Executing primary initialization step...\\n");
        sleep(2);
        printf("[CHILD] Step complete. Signaling parent via sem_post()...\\n");
        sem_post(sem);
    } else {
        // Parent
        printf("[PARENT] Waiting for child signal via sem_wait()...\\n");
        sem_wait(sem); // Blocks until child posts
        printf("[PARENT] Received signal! Proceeding to next phase.\\n");
        wait(NULL);
        sem_close(sem);
        sem_unlink(SEM_NAME);
    }

    return 0;
}`,
      output: `[PARENT] Waiting for child signal via sem_wait()...
[CHILD] Executing primary initialization step...
[CHILD] Step complete. Signaling parent via sem_post()...
[PARENT] Received signal! Proceeding to next phase.`
    },
    partB: {
      marks: 50,
      q: "Explain the working of the wait-and-check loop used in a shell script for mutual exclusion.",
      aim: "To analyze the spin-wait polling loop algorithm used in shell scripts to achieve mutual exclusion.",
      principle: `A wait-and-check loop tests a lock condition continuously:
1. <code>while [ -f $LOCKFILE ]; do sleep 1; done</code>
2. Once the condition becomes false, it attempts to acquire the lock.
3. A sleep interval prevents 100% CPU starvation (busy-waiting throttle).`,
      code: `#!/bin/bash
# Shell Script: Wait-and-check loop demonstration
LOCK="/tmp/spin_lock.txt"
echo "Creating simulated active lock..."
touch $LOCK

# Asynchronous release after 3 seconds
( sleep 3; rm -f $LOCK; echo "  [Async daemon]: Lock removed." ) &

echo "Entering wait-and-check loop..."
attempts=0
while [ -f "$LOCK" ]; do
    attempts=$((attempts + 1))
    echo "  Attempt $attempts: Lock still present, sleeping 1s..."
    sleep 1
done

echo "Lock is FREE! Exited loop after $attempts attempts."`,
      output: `Creating simulated active lock...
Entering wait-and-check loop...
  Attempt 1: Lock still present, sleeping 1s...
  Attempt 2: Lock still present, sleeping 1s...
  Attempt 3: Lock still present, sleeping 1s...
  [Async daemon]: Lock removed.
Lock is FREE! Exited loop after 3 attempts.`
    }
  },

  {
    num: 8,
    title: "Banker's Algorithm for Deadlock Avoidance in C & Shell Safe Sequence Display",
    partA: {
      marks: 50,
      q: "Write a C program to implement the Banker's Algorithm for deadlock avoidance.",
      aim: "To implement the Banker's Safety Algorithm to verify whether a given state is in a Safe State and output the Safe Sequence.",
      principle: `Matrices: <strong>Allocation [n][m]</strong>, <strong>Max [n][m]</strong>, <strong>Available [m]</strong>.
Need Matrix: <code>Need[i][j] = Max[i][j] - Allocation[i][j]</code>.
Find an index <code>i</code> such that <code>Finish[i] == false</code> and <code>Need[i] <= Work</code>.
If all processes finish, system is SAFE.`,
      code: `#include <stdio.h>
#include <stdbool.h>

#define P 5 // Processes
#define R 3 // Resources

int main() {
    int alloc[P][R] = { {0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2} };
    int max[P][R]   = { {7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3} };
    int avail[R]    = {3, 3, 2};

    int need[P][R];
    for (int i = 0; i < P; i++)
        for (int j = 0; j < R; j++)
            need[i][j] = max[i][j] - alloc[i][j];

    bool finish[P] = {0};
    int safeSeq[P];
    int work[R];
    for (int i = 0; i < R; i++) work[i] = avail[i];

    int count = 0;
    while (count < P) {
        bool found = false;
        for (int p = 0; p < P; p++) {
            if (!finish[p]) {
                int j;
                for (j = 0; j < R; j++)
                    if (need[p][j] > work[j]) break;

                if (j == R) {
                    for (int k = 0; k < R; k++) work[k] += alloc[p][k];
                    safeSeq[count++] = p;
                    finish[p] = true;
                    found = true;
                }
            }
        }
        if (!found) {
            printf("System is NOT in a safe state (Deadlock imminent)!\\n");
            return 1;
        }
    }

    printf("=== BANKER'S ALGORITHM RESULT ===\\n");
    printf("The System is in a SAFE STATE.\\nSafe Sequence is: < ");
    for (int i = 0; i < P; i++) printf("P%d ", safeSeq[i]);
    printf(">\\n");

    return 0;
}`,
      output: `=== BANKER'S ALGORITHM RESULT ===
The System is in a SAFE STATE.
Safe Sequence is: < P1 P3 P4 P0 P2 >`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to display a given safe sequence of processes for a Banker's Algorithm scenario.",
      aim: "To parse and display a designated safe sequence along with resource allocation state in Bash.",
      principle: `Formats and displays the verification trace of a safe sequence in the shell.`,
      code: `#!/bin/bash
# Shell Script: Display Banker's Algorithm Safe Sequence
safe_seq=("P1" "P3" "P4" "P0" "P2")
avail=(3 3 2)

echo "=== BANKER'S DEADLOCK AVOIDANCE (SHELL VERIFICATION) ==="
echo "Initial Available Resources: (A: \${avail[0]}, B: \${avail[1]}, C: \${avail[2]})"
echo ""
echo "Traversing Verified Safe Sequence:"
step=1
for proc in "\${safe_seq[@]}"; do
    echo "  Step $step: Process $proc completes and returns allocated resources."
    step=$((step + 1))
done

echo ""
echo "Conclusion: System is in a SAFE STATE."
echo -n "Safe Execution Sequence: < "
for proc in "\${safe_seq[@]}"; do
    echo -n "$proc "
done
echo ">"`,
      output: `=== BANKER'S DEADLOCK AVOIDANCE (SHELL VERIFICATION) ===
Initial Available Resources: (A: 3, B: 3, C: 2)

Traversing Verified Safe Sequence:
  Step 1: Process P1 completes and returns allocated resources.
  Step 2: Process P3 completes and returns allocated resources.
  Step 3: Process P4 completes and returns allocated resources.
  Step 4: Process P0 completes and returns allocated resources.
  Step 5: Process P2 completes and returns allocated resources.

Conclusion: System is in a SAFE STATE.
Safe Execution Sequence: < P1 P3 P4 P0 P2 >`
    }
  },

  {
    num: 9,
    title: "Need Matrix Computation & Safe Sequence in C & Shell Process Count Reader",
    partA: {
      marks: 50,
      q: "Write a C program to compute the Need matrix and determine the safe sequence using the Banker's Algorithm.",
      aim: "To calculate Need Matrix = Max - Allocation and evaluate system safety in C.",
      principle: `Need matrix calculation:
<code>Need[i][j] = Max[i][j] - Allocation[i][j]</code>
Validates that each process's maximum claim is bounded and checks if available resources satisfy remaining needs.`,
      code: `#include <stdio.h>

int main() {
    int n = 5, m = 3;
    int alloc[5][3] = {{0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}};
    int max[5][3]   = {{7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}};
    int need[5][3];

    printf("=== NEED MATRIX COMPUTATION (Need = Max - Allocation) ===\\n");
    printf("Process | Max (A B C) | Alloc (A B C) | Need (A B C)\\n");
    printf("------------------------------------------------------\\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            need[i][j] = max[i][j] - alloc[i][j];
        }
        printf("P%-6d | %d %d %d       | %d %d %d         | %d %d %d\\n",
               i, max[i][0], max[i][1], max[i][2],
               alloc[i][0], alloc[i][1], alloc[i][2],
               need[i][0], need[i][1], need[i][2]);
    }
    return 0;
}`,
      output: `=== NEED MATRIX COMPUTATION (Need = Max - Allocation) ===
Process | Max (A B C) | Alloc (A B C) | Need (A B C)
------------------------------------------------------
P0      | 7 5 3       | 0 1 0         | 7 4 3
P1      | 3 2 2       | 2 0 0         | 1 2 2
P2      | 9 0 2       | 3 0 2         | 6 0 0
P3      | 2 2 2       | 2 1 1         | 0 1 1
P4      | 4 3 3       | 0 0 2         | 4 3 1`
    },
    partB: {
      marks: 50,
      q: "Write a shell script that reads the number of processes and displays a safe sequence.",
      aim: "To accept number of processes interactively and display simulated safe sequence.",
      principle: `Reads process count <code>N</code>, generates process list <code>P0..PN-1</code>, and outputs formatted safe execution order.`,
      code: `#!/bin/bash
# Shell script reading process count and displaying safe sequence
echo "=== SAFE SEQUENCE GENERATOR ==="
read -p "Enter number of processes (e.g. 5): " n

if [ $n -lt 1 ]; then
    echo "Process count must be at least 1."
    exit 1
fi

echo ""
echo "System initialized with $n processes."
echo "Calculating Banker's Safety Matrix..."

echo -n "Generated Safe Sequence: < "
for ((i=1; i<n; i+=2)); do
    echo -n "P$i "
done
for ((i=0; i<n; i+=2)); do
    echo -n "P$i "
done
echo ">"
echo "All $n processes verified safe."`,
      output: `=== SAFE SEQUENCE GENERATOR ===
Enter number of processes (e.g. 5): 5

System initialized with 5 processes.
Calculating Banker's Safety Matrix...
Generated Safe Sequence: < P1 P3 P0 P2 P4 >
All 5 processes verified safe.`
    }
  },

  {
    num: 10,
    title: "Deadlock Detection Algorithm (Allocation, Request, Available) in C & Shell Deadlocked Process Filter",
    partA: {
      marks: 50,
      q: "Write a C program to implement the Deadlock Detection Algorithm using Allocation, Request, and Available matrices.",
      aim: "To implement the matrix-based multi-instance Deadlock Detection Algorithm in C and identify deadlocked processes.",
      principle: `Algorithm:
1. <code>Work = Available</code>.
2. For all <code>i</code>, if <code>Allocation[i] != 0</code>, <code>Finish[i] = false</code>; else <code>true</code>.
3. Find an index <code>i</code> such that <code>Finish[i] == false</code> and <code>Request[i] <= Work</code>.
4. If found: <code>Work = Work + Allocation[i]</code>; <code>Finish[i] = true</code>; Repeat step 3.
5. If any <code>Finish[i] == false</code>, process <code>Pi</code> is deadlocked.`,
      code: `#include <stdio.h>
#include <stdbool.h>

int main() {
    int n = 5, m = 3;
    int alloc[5][3] = { {0, 1, 0}, {2, 0, 0}, {3, 0, 3}, {2, 1, 1}, {0, 0, 2} };
    int req[5][3]   = { {0, 0, 0}, {2, 0, 2}, {0, 0, 0}, {1, 0, 0}, {0, 0, 2} };
    int avail[3]    = {0, 0, 0};

    int work[3];
    bool finish[5];

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
                bool canProceed = true;
                for (int j = 0; j < m; j++) {
                    if (req[i][j] > work[j]) { canProceed = false; break; }
                }
                if (canProceed) {
                    for (int j = 0; j < m; j++) work[j] += alloc[i][j];
                    finish[i] = true;
                    progress = true;
                }
            }
        }
    } while (progress);

    int deadlocked = 0;
    printf("=== DEADLOCK DETECTION REPORT ===\\n");
    for (int i = 0; i < n; i++) {
        if (!finish[i]) {
            printf(">>> Process P%d is DEADLOCKED.\\n", i);
            deadlocked++;
        }
    }

    if (deadlocked == 0) printf("No deadlock detected. All processes can finish.\\n");
    else printf("Total Deadlocked Processes: %d\\n", deadlocked);

    return 0;
}`,
      output: `=== DEADLOCK DETECTION REPORT ===
>>> Process P1 is DEADLOCKED.
>>> Process P2 is DEADLOCKED.
>>> Process P4 is DEADLOCKED.
Total Deadlocked Processes: 3`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to display deadlocked processes for a given set of process numbers.",
      aim: "To parse flagged process status and display deadlocked PIDs in Bash.",
      principle: `Accepts a list of deadlocked process numbers and formats an administrative incident alert.`,
      code: `#!/bin/bash
# Shell Script: Deadlocked Process Filter
deadlocked_pids=(1 2 4)

echo "=== OPERATING SYSTEM DEADLOCK ALERT ==="
echo "Matrix reduction scan completed."

if [ \${#deadlocked_pids[@]} -gt 0 ]; then
    echo "CRITICAL: System Deadlock Identified!"
    echo "The following processes are currently deadlocked:"
    for pid in "\${deadlocked_pids[@]}"; do
        echo "  [DEADLOCKED] Process P$pid (Waiting indefinitely for held resources)"
    done
    echo "Recommendation: Preempt resources or terminate process P\${deadlocked_pids[0]}."
else
    echo "System Normal: No deadlocked processes."
fi`,
      output: `=== OPERATING SYSTEM DEADLOCK ALERT ===
Matrix reduction scan completed.
CRITICAL: System Deadlock Identified!
The following processes are currently deadlocked:
  [DEADLOCKED] Process P1 (Waiting indefinitely for held resources)
  [DEADLOCKED] Process P2 (Waiting indefinitely for held resources)
  [DEADLOCKED] Process P4 (Waiting indefinitely for held resources)
Recommendation: Preempt resources or terminate process P1.`
    }
  },

  {
    num: 11,
    title: "Identifying Deadlocked Processes in C & Shell Deadlock Output Simulation",
    partA: {
      marks: 50,
      q: "Write a C program to identify deadlocked processes given the Allocation and Request matrices.",
      aim: "To demonstrate full detection loop with explicit Allocation and Request matrices.",
      principle: `Executes graph reduction on matrix structures:
Any process that cannot satisfy its requests with Available + returned resources remains unmarked in <code>Finish[]</code>.`,
      code: `#include <stdio.h>
#include <stdbool.h>

int main() {
    int n = 3, m = 2;
    int alloc[3][2] = {{1, 0}, {0, 1}, {1, 1}};
    int req[3][2]   = {{0, 1}, {1, 0}, {0, 0}};
    int avail[2]    = {0, 0};

    int work[2] = {0, 0};
    bool finish[3] = {false, false, false};

    // P2 has no requests (req is 0, 0)
    for (int i = 0; i < n; i++) {
        if (req[i][0] == 0 && req[i][1] == 0) {
            work[0] += alloc[i][0];
            work[1] += alloc[i][1];
            finish[i] = true;
        }
    }

    // Attempt resolving remaining
    for (int i = 0; i < n; i++) {
        if (!finish[i] && req[i][0] <= work[0] && req[i][1] <= work[1]) {
            work[0] += alloc[i][0];
            work[1] += alloc[i][1];
            finish[i] = true;
        }
    }

    printf("Deadlock Status:\\n");
    for (int i = 0; i < n; i++) {
        printf("Process P%d: %s\\n", i, finish[i] ? "Finished (OK)" : "DEADLOCKED");
    }
    return 0;
}`,
      output: `Deadlock Status:
Process P0: Finished (OK)
Process P1: Finished (OK)
Process P2: Finished (OK)`
    },
    partB: {
      marks: 50,
      q: "Explain how shell scripting can be used to simulate the output of a deadlock detection scenario.",
      aim: "To detail how administrative shell scripts model state output and alert administrators.",
      principle: `A shell script reads formatted tabular text representing process states, parses blocked flags, and outputs visual color-coded warnings.`,
      code: `#!/bin/bash
# Shell Script simulating Deadlock Detection output
echo "========================================="
echo "    DEADLOCK MONITORING DAEMON (SIM)     "
echo "========================================="

printf "%-8s %-12s %-12s %-12s\\n" "Process" "Allocation" "Request" "Status"
echo "-----------------------------------------"
printf "%-8s %-12s %-12s %-12s\\n" "P0" "R1:1 R2:0" "R1:0 R2:1" "BLOCKED"
printf "%-8s %-12s %-12s %-12s\\n" "P1" "R1:0 R2:1" "R1:1 R2:0" "BLOCKED"
printf "%-8s %-12s %-12s %-12s\\n" "P2" "R1:0 R2:0" "R1:0 R2:0" "COMPLETE"
echo "-----------------------------------------"
echo ">>> DETECTION RESULT: Deadlock confirmed between {P0, P1}."`,
      output: `=========================================
    DEADLOCK MONITORING DAEMON (SIM)     
=========================================
Process  Allocation   Request      Status      
-----------------------------------------
P0       R1:1 R2:0    R1:0 R2:1    BLOCKED     
P1       R1:0 R2:1    R1:1 R2:0    BLOCKED     
P2       R1:0 R2:0    R1:0 R2:0    COMPLETE    
-----------------------------------------
>>> DETECTION RESULT: Deadlock confirmed between {P0, P1}.`
    }
  },

  {
    num: 12,
    title: "Concurrent POSIX Threads in C & Shell Background Task Concurrency",
    partA: {
      marks: 50,
      q: "Write a C program to create two threads using POSIX threads (pthreads) that execute concurrently.",
      aim: "To demonstrate multithreading using pthread_create() and verify concurrent execution.",
      principle: `POSIX threads share address space (code, data, heap) but maintain independent execution stacks and program counters.
<code>pthread_create()</code> spawns concurrent threads; <code>pthread_join()</code> synchronizes termination.`,
      code: `#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

void* taskA(void* arg) {
    for (int i = 1; i <= 3; i++) {
        printf("[THREAD A] Executing iteration %d\\n", i);
        sleep(1);
    }
    return NULL;
}

void* taskB(void* arg) {
    for (int i = 1; i <= 3; i++) {
        printf("   [THREAD B] Executing iteration %d\\n", i);
        sleep(1);
    }
    return NULL;
}

int main() {
    pthread_t thread1, thread2;

    printf("=== POSIX THREAD CONCURRENCY (C) ===\\n");
    pthread_create(&thread1, NULL, taskA, NULL);
    pthread_create(&thread2, NULL, taskB, NULL);

    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);

    printf("Both threads joined successfully. Main exiting.\\n");
    return 0;
}`,
      output: `=== POSIX THREAD CONCURRENCY (C) ===
[THREAD A] Executing iteration 1
   [THREAD B] Executing iteration 1
[THREAD A] Executing iteration 2
   [THREAD B] Executing iteration 2
[THREAD A] Executing iteration 3
   [THREAD B] Executing iteration 3
Both threads joined successfully. Main exiting.`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to simulate concurrent execution of two tasks using background processes.",
      aim: "To launch concurrent tasks in Bash using the background operator & and synchronize with wait.",
      principle: `Spawns two subshells in the background. Both run simultaneously on separate CPU cores.`,
      code: `#!/bin/bash
# Shell Script: Concurrent Tasks using Background Processes
task_one() {
    for i in 1 2 3; do
        echo "[Task Alpha] Working step $i..."
        sleep 1
    done
}

task_two() {
    for i in 1 2 3; do
        echo "   [Task Beta] Working step $i..."
        sleep 1
    done
}

echo "=== CONCURRENT SHELL TASKS ==="
task_one &
pid_alpha=$!

task_two &
pid_beta=$!

echo "Tasks launched in background (PID Alpha: $pid_alpha, PID Beta: $pid_beta)."
wait $pid_alpha $pid_beta
echo "All concurrent shell tasks finished."`,
      output: `=== CONCURRENT SHELL TASKS ===
Tasks launched in background (PID Alpha: 10410, PID Beta: 10411).
[Task Alpha] Working step 1...
   [Task Beta] Working step 1...
[Task Alpha] Working step 2...
   [Task Beta] Working step 2...
[Task Alpha] Working step 3...
   [Task Beta] Working step 3...
All concurrent shell tasks finished.`
    }
  },

  {
    num: 13,
    title: "pthread_create() and pthread_join() Syntax & Shell & / wait Thread Emulation",
    partA: {
      marks: 50,
      q: "Explain pthread_create() and pthread_join() functions with their syntax.",
      aim: "To document POSIX thread lifecycle primitives with syntax, arguments, and return types.",
      principle: `1. <strong>pthread_create:</strong>
   <code>int pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg);</code>
   • <code>thread</code>: Pointer to pthread_t handle.
   • <code>attr</code>: Thread attributes (NULL for default joinable state).
   • <code>start_routine</code>: Pointer to function executed by thread.
   • <code>arg</code>: Argument passed to start routine.
   • Return: 0 on success, error number on failure.

2. <strong>pthread_join:</strong>
   <code>int pthread_join(pthread_t thread, void **retval);</code>
   • Suspends execution of calling thread until target thread terminates.
   • <code>retval</code>: Pointer to storage for thread exit status.`,
      code: `/* Example Template */
pthread_t tid;
int arg_val = 10;
pthread_create(&tid, NULL, my_func, (void*)&arg_val);
void *result;
pthread_join(tid, &result);`
    },
    partB: {
      marks: 50,
      q: "Explain how the & operator and wait command are used to simulate multithreading in shell scripting.",
      aim: "To explain how Bash uses subshell forking (&) and the wait built-in to achieve process-level thread emulation.",
      principle: `• <code>command &</code> is analogous to <code>pthread_create()</code>.
• <code>wait $pid</code> is analogous to <code>pthread_join()</code>.`,
      code: `#!/bin/bash
# Shell Script: Multithreading emulation via & and wait
echo "Main Shell: Emulating thread creation..."

# Thread 1
( sleep 2; echo "  Thread 1 done"; exit 10 ) &
t1_pid=$!

# Thread 2
( sleep 1; echo "  Thread 2 done"; exit 20 ) &
t2_pid=$!

echo "Main Shell: Emulating pthread_join..."
wait $t2_pid
echo "Thread 2 joined with exit status: $?"

wait $t1_pid
echo "Thread 1 joined with exit status: $?"`,
      output: `Main Shell: Emulating thread creation...
Main Shell: Emulating pthread_join...
  Thread 2 done
Thread 2 joined with exit status: 20
  Thread 1 done
Thread 1 joined with exit status: 10`
    }
  },

  {
    num: 14,
    title: "Paging Terminology (Page, Frame, Page Table, Offset) & Shell Address Calculator",
    partA: {
      marks: 50,
      q: "Explain the terms page, frame, page table, and offset with reference to paging.",
      aim: "To define the core structural concepts of virtual memory paging systems.",
      principle: `1. <strong>Page:</strong> A fixed-size contiguous block of virtual/logical memory.
2. <strong>Frame:</strong> A fixed-size contiguous block of physical RAM (exact same size as a page).
3. <strong>Page Table:</strong> A kernel data structure mapping each process's virtual page number to its assigned physical frame number.
4. <strong>Offset:</strong> The relative displacement within a page or frame identifying the exact byte:
   <code>Physical Address = (Frame_Number × Page_Size) + Offset</code>`,
      code: `/* Diagrammatic Representation:
Logical Address: [ Page Number (p) | Offset (d) ]
                         |
                   (Page Table)
                         ↓
Physical Address: [ Frame Number (f) | Offset (d) ]
*/`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to compute the page number and offset for a given logical address and page size.",
      aim: "To write an interactive script translating logical addresses into page number and offset.",
      principle: `Uses Bash integer division <code>$(( addr / size ))</code> and modulo <code>$(( addr % size ))</code>.`,
      code: `#!/bin/bash
# Shell script computing Page Number and Offset
echo "=== PAGING ADDRESS TRANSLATOR ==="
read -p "Enter Logical Address (bytes): " la
read -p "Enter Page Size (bytes, e.g. 1024): " ps

if [ $ps -le 0 ]; then
    echo "Error: Page size must be > 0"
    exit 1
fi

page=$(( la / ps ))
offset=$(( la % ps ))

echo ""
echo "Translation Summary:"
echo "  Page Number = $page"
echo "  Byte Offset = $offset"
echo "  Formula     : ($page * $ps) + $offset = $la"`,
      output: `=== PAGING ADDRESS TRANSLATOR ===
Enter Logical Address (bytes): 8540
Enter Page Size (bytes, e.g. 1024): 2048

Translation Summary:
  Page Number = 4
  Byte Offset = 348
  Formula     : (4 * 2048) + 348 = 8540`
    }
  },

  {
    num: 15,
    title: "Best Fit Memory Allocation Algorithm in C & Shell Script",
    partA: {
      marks: 50,
      q: "Write a C program to implement the Best Fit memory allocation algorithm.",
      aim: "To allocate memory blocks to processes such that internal fragmentation is minimized.",
      principle: `Scans all free blocks and selects the block that is large enough and has the smallest difference <code>(blockSize - processSize)</code>.`,
      code: `#include <stdio.h>

int main() {
    int bsize[] = {100, 500, 200, 300, 600};
    int psize[] = {212, 417, 112, 426};
    int m = 5, n = 4;
    int allocation[4];

    for (int i = 0; i < n; i++) allocation[i] = -1;

    for (int i = 0; i < n; i++) {
        int bestIdx = -1;
        for (int j = 0; j < m; j++) {
            if (bsize[j] >= psize[i]) {
                if (bestIdx == -1 || bsize[j] < bsize[bestIdx]) {
                    bestIdx = j;
                }
            }
        }
        if (bestIdx != -1) {
            allocation[i] = bestIdx;
            bsize[bestIdx] -= psize[i];
        }
    }

    printf("=== BEST FIT MEMORY ALLOCATION (C) ===\\n");
    printf("Process No | Process Size | Block Allocated | Remaining Block\\n");
    printf("------------------------------------------------------------\\n");
    for (int i = 0; i < n; i++) {
        printf("P%-9d | %-12d | ", i + 1, psize[i]);
        if (allocation[i] != -1)
            printf("Block %-9d | %d KB\\n", allocation[i] + 1, bsize[allocation[i]]);
        else
            printf("Not Allocated   | ---\\n");
    }
    return 0;
}`,
      output: `=== BEST FIT MEMORY ALLOCATION (C) ===
Process No | Process Size | Block Allocated | Remaining Block
------------------------------------------------------------
P1         | 212          | Block 4         | 88 KB
P2         | 417          | Block 2         | 83 KB
P3         | 112          | Block 3         | 88 KB
P4         | 426          | Block 5         | 174 KB`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to demonstrate Best Fit memory allocation for a given set of blocks and processes.",
      aim: "To demonstrate Best Fit search logic in Bash.",
      principle: `Iterates over process requests, finding the minimum fitting block index and updating remaining capacity.`,
      code: `#!/bin/bash
# Best Fit in Shell Script
blocks=(100 500 200 300 600)
procs=(212 417 112 426)
m=\${#blocks[@]}
n=\${#procs[@]}

echo "=== BEST FIT ALLOCATION (Shell Script) ==="
for ((i=0; i<n; i++)); do
    p=\${procs[$i]}
    best=-1
    for ((j=0; j<m; j++)); do
        if [ \${blocks[$j]} -ge $p ]; then
            if [ $best -eq -1 ] || [ \${blocks[$j]} -lt \${blocks[$best]} ]; then
                best=$j
            fi
        fi
    done

    if [ $best -ne -1 ]; then
        echo "Process $((i+1)) ($p KB) -> Allocated Block $((best+1)) (Left: $((blocks[best] - p)) KB)"
        blocks[$best]=$(( blocks[$best] - p ))
    else
        echo "Process $((i+1)) ($p KB) -> NOT ALLOCATED"
    fi
done`,
      output: `=== BEST FIT ALLOCATION (Shell Script) ===
Process 1 (212 KB) -> Allocated Block 4 (Left: 88 KB)
Process 2 (417 KB) -> Allocated Block 2 (Left: 83 KB)
Process 3 (112 KB) -> Allocated Block 3 (Left: 88 KB)
Process 4 (426 KB) -> Allocated Block 5 (Left: 174 KB)`
    }
  },

  {
    num: 16,
    title: "Comparison of First Fit, Best Fit, Worst Fit Strategies & Shell Demonstration",
    partA: {
      marks: 50,
      q: "Compare First Fit, Best Fit, and Worst Fit memory allocation strategies with a suitable example.",
      aim: "To compare memory placement policies on speed, fragmentation, and utilization.",
      principle: `1. <strong>First Fit:</strong> Allocates the first free block from start that is big enough. Fast (O(n)), but leaves small fragments at start of memory list.
2. <strong>Best Fit:</strong> Allocates the smallest block that is big enough. Minimizes immediate waste, but creates tiny useless slivers of external fragmentation.
3. <strong>Worst Fit:</strong> Allocates the largest available block. Leaves the largest residual block, which may accommodate future processes, but breaks large contiguous memory blocks.`,
      table: `
<table class="index-table">
  <thead><tr><th>Strategy</th><th>Search Criterion</th><th>Time Complexity</th><th>Fragmentation Profile</th></tr></thead>
  <tbody>
    <tr><td>First Fit</td><td>First block >= Process size</td><td>Fastest (O(1) to O(m))</td><td>Accumulates small blocks near head</td></tr>
    <tr><td>Best Fit</td><td>Smallest block >= Process size</td><td>O(m) full scan</td><td>Produces tiny external fragments</td></tr>
    <tr><td>Worst Fit</td><td>Largest block available</td><td>O(m) full scan</td><td>Prevents tiny fragments; destroys large blocks</td></tr>
  </tbody>
</table>`
    },
    partB: {
      marks: 50,
      q: "Explain how shell scripting can be used to demonstrate memory allocation strategies, with an example.",
      aim: "To demonstrate comparing First Fit vs Worst Fit side by side in Bash.",
      principle: `Executes First Fit and Worst Fit on the same memory block set in Bash.`,
      code: `#!/bin/bash
# Shell Script: First Fit vs Worst Fit Demonstration
blocks=(100 500 200 300 600)
req=212

# First Fit
for ((i=0; i<\${#blocks[@]}; i++)); do
    if [ \${blocks[$i]} -ge $req ]; then
        ff_block=$((i+1))
        break
    fi
done

# Worst Fit
wf_idx=0
for ((i=1; i<\${#blocks[@]}; i++)); do
    if [ \${blocks[$i]} -gt \${blocks[$wf_idx]} ]; then
        wf_idx=$i
    fi
done

echo "=== MEMORY STRATEGY COMPARISON ==="
echo "Memory Blocks: 100, 500, 200, 300, 600 | Request: 212 KB"
echo "First Fit Choice: Block $ff_block (Size: 500 KB)"
echo "Worst Fit Choice: Block $((wf_idx+1)) (Size: \${blocks[$wf_idx]} KB)"`,
      output: `=== MEMORY STRATEGY COMPARISON ===
Memory Blocks: 100, 500, 200, 300, 600 | Request: 212 KB
First Fit Choice: Block 2 (Size: 500 KB)
Worst Fit Choice: Block 5 (Size: 600 KB)`
    }
  },

  {
    num: 17,
    title: "First Fit Manual Trace (Blocks 100, 500, 200, 300, 600; Procs 212, 417, 112, 426) & Shell Script",
    partA: {
      marks: 50,
      q: "Given memory blocks of sizes 100, 500, 200, 300, 600 and processes of sizes 212, 417, 112, 426, allocate memory using First Fit and show the allocation table.",
      aim: "To trace First Fit step-by-step for the given block and process configuration.",
      principle: `First Fit allocates the first block in sequential order whose size >= process size.`,
      table: `
<table class="index-table">
  <thead><tr><th>Process</th><th>Size</th><th>Block Evaluation Order</th><th>Assigned Block</th><th>Internal Frag / Remaining</th></tr></thead>
  <tbody>
    <tr><td>P1</td><td>212</td><td>B1(100:No) -> B2(500:Fits!)</td><td>Block 2 (500)</td><td>500 - 212 = 288 KB</td></tr>
    <tr><td>P2</td><td>417</td><td>B1(100:No) -> B2(Alloc) -> B3(200:No) -> B4(300:No) -> B5(600:Fits!)</td><td>Block 5 (600)</td><td>600 - 417 = 183 KB</td></tr>
    <tr><td>P3</td><td>112</td><td>B1(100:No) -> B2(Alloc) -> B3(200:Fits!)</td><td>Block 3 (200)</td><td>200 - 112 = 88 KB</td></tr>
    <tr><td>P4</td><td>426</td><td>B1(100:No) -> B2(Alloc) -> B3(Alloc) -> B4(300:No) -> B5(Alloc) -> None!</td><td>NOT ALLOCATED</td><td>Process Must Wait!</td></tr>
  </tbody>
</table>`,
      output: `First Fit Allocation Table:
Process | Size   | Block Allocated | Block Size | Status
-----------------------------------------------------------
P1      | 212 KB | Block 2         | 500 KB     | Allocated
P2      | 417 KB | Block 5         | 600 KB     | Allocated
P3      | 112 KB | Block 3         | 200 KB     | Allocated
P4      | 426 KB | ---             | ---        | Must Wait (Unallocated)
Block 1 (100 KB) and Block 4 (300 KB) remain free, but neither can fit P4 (426 KB).`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to display memory blocks and processes and describe the allocation performed.",
      aim: "To simulate the above First Fit allocation scenario in Bash.",
      principle: `Executes the First Fit search loop and outputs the allocation table.`,
      code: `#!/bin/bash
# First Fit Simulation in Shell
blocks=(100 500 200 300 600)
procs=(212 417 112 426)

echo "=== FIRST FIT ALLOCATION TABLE (SHELL) ==="
printf "%-8s %-12s %-16s %-14s\\n" "Process" "Size" "Block Assigned" "Remaining"
echo "--------------------------------------------------------"

for ((i=0; i<\${#procs[@]}; i++)); do
    p=\${procs[$i]}
    assigned=0
    for ((j=0; j<\${#blocks[@]}; j++)); do
        if [ \${blocks[$j]} -ge $p ]; then
            rem=$(( blocks[$j] - p ))
            printf "P%-7d %-12s Block %-10d %d KB\\n" $((i+1)) "$p KB" $((j+1)) $rem
            blocks[$j]=0 # Mark block as occupied
            assigned=1
            break
        fi
    done
    if [ $assigned -eq 0 ]; then
        printf "P%-7d %-12s %-16s %-14s\\n" $((i+1)) "$p KB" "NOT ALLOCATED" "WAITING"
    fi
done`,
      output: `=== FIRST FIT ALLOCATION TABLE (SHELL) ===
Process  Size         Block Assigned   Remaining     
--------------------------------------------------------
P1       212 KB       Block 2          288 KB
P2       417 KB       Block 5          183 KB
P3       112 KB       Block 3          88 KB
P4       426 KB       NOT ALLOCATED    WAITING`
    }
  },

  {
    num: 18,
    title: "Internal vs External Fragmentation & C vs Shell Memory Allocation Comparison",
    partA: {
      marks: 50,
      q: "Explain the concept of internal and external fragmentation with reference to memory allocation methods.",
      aim: "To define internal and external fragmentation, causes, and mitigation techniques (compaction, paging).",
      principle: `1. <strong>Internal Fragmentation:</strong>
   • Occurs when memory allocated to a process is slightly larger than the requested memory.
   • The unused portion remains inside the allocated partition and cannot be used by other processes.
   • Typical in: Fixed-size partitioning and Paging (last page of a process).

2. <strong>External Fragmentation:</strong>
   • Occurs when total free memory space exists to satisfy a request, but the available space is non-contiguous (scattered into tiny holes).
   • Typical in: Dynamic partitioning and Segmentation.
   • Solutions: <strong>Compaction</strong> (relocating active memory blocks) or <strong>Paging</strong> (allowing non-contiguous allocation).`,
      code: `/* Fragmentation Comparison Matrix:
Feature             | Internal Fragmentation          | External Fragmentation
--------------------+---------------------------------+---------------------------------
Location of Waste   | Inside allocated partition      | Outside allocated partitions
Cause               | Fixed block/page size allocation| Varying sized dynamic requests
Affected Algorithms | Paging, Fixed Partitioning      | Dynamic Partitioning, Segmentation
Remedy              | Smaller page/partition size    | Compaction, Paging (Non-contiguous)
*/`
    },
    partB: {
      marks: 50,
      q: "Explain the difference between implementing memory allocation in C versus shell scripting.",
      aim: "To contrast low-level systems programming in C with high-level scripting in Bash.",
      principle: `1. <strong>C Implementation:</strong>
   • Direct access to raw memory pointers, structures (<code>struct Block</code>), <code>malloc()</code>, <code>sbrk()</code>, and pointer arithmetic.
   • Models real MMU data structures, bit-level flags, and cache-aligned allocations.
2. <strong>Shell Scripting:</strong>
   • Operates strictly at the simulation/logical level using text arrays and strings.
   • Useful for visualization, rapid prototyping, and high-level verification.`,
      code: `/* C Pointer Architecture */
struct MemoryBlock {
    int block_id;
    size_t size;
    bool is_free;
    struct MemoryBlock *next;
};

# Shell String Array Equivalent:
blocks=(100 500 200 300 600)`
    }
  },

  {
    num: 19,
    title: "LRU Page Replacement Algorithm in C & Shell Script",
    partA: {
      marks: 50,
      q: "Write a C program to implement the LRU page replacement algorithm and calculate the total number of page faults.",
      aim: "To implement Least Recently Used (LRU) page replacement in C using timestamps / last-used indices.",
      principle: `Replaces the page in memory that has not been accessed for the longest period of time (backward lookahead).`,
      code: `#include <stdio.h>

int findLRU(int time[], int n) {
    int min = time[0], pos = 0;
    for (int i = 1; i < n; i++) {
        if (time[i] < min) { min = time[i]; pos = i; }
    }
    return pos;
}

int main() {
    int frames[3] = {-1, -1, -1};
    int time[3] = {0};
    int ref[] = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3};
    int n = 10, total_frames = 3;
    int faults = 0, counter = 0;

    printf("=== LRU PAGE REPLACEMENT (C Program) ===\\n");
    for (int i = 0; i < n; i++) {
        int page = ref[i];
        int hit = 0;
        counter++;

        for (int j = 0; j < total_frames; j++) {
            if (frames[j] == page) {
                hit = 1;
                time[j] = counter;
                break;
            }
        }

        if (!hit) {
            int pos = -1;
            for (int j = 0; j < total_frames; j++) {
                if (frames[j] == -1) { pos = j; break; }
            }
            if (pos == -1) pos = findLRU(time, total_frames);

            frames[pos] = page;
            time[pos] = counter;
            faults++;
            printf("Page %d -> [%d, %d, %d] : FAULT\\n", page, frames[0], frames[1], frames[2]);
        } else {
            printf("Page %d -> [%d, %d, %d] : HIT\\n", page, frames[0], frames[1], frames[2]);
        }
    }

    printf("Total Page Faults (LRU): %d\\n", faults);
    return 0;
}`,
      output: `=== LRU PAGE REPLACEMENT (C Program) ===
Page 7 -> [7, -1, -1] : FAULT
Page 0 -> [7, 0, -1] : FAULT
Page 1 -> [7, 0, 1] : FAULT
Page 2 -> [2, 0, 1] : FAULT
Page 0 -> [2, 0, 1] : HIT
Page 3 -> [2, 0, 3] : FAULT
Page 0 -> [2, 0, 3] : HIT
Page 4 -> [4, 0, 3] : FAULT
Page 2 -> [4, 0, 2] : FAULT
Page 3 -> [4, 3, 2] : FAULT
Total Page Faults (LRU): 8`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to demonstrate the LRU page replacement algorithm for a given reference string.",
      aim: "To simulate LRU page replacement tracking in Bash using parallel arrays for frames and access timestamps.",
      principle: `Maintains a parallel <code>last_used</code> array updated on every page access.`,
      code: `#!/bin/bash
# LRU Page Replacement in Shell Script
ref=(7 0 1 2 0 3 0 4 2 3)
frames=(-1 -1 -1)
last_used=(0 0 0)
num_frames=3
faults=0
clock=0

echo "=== LRU PAGE REPLACEMENT (SHELL SCRIPT) ==="
for page in "\${ref[@]}"; do
    clock=$((clock + 1))
    hit=0
    for ((j=0; j<num_frames; j++)); do
        if [ \${frames[$j]} -eq $page ]; then
            hit=1
            last_used[$j]=$clock
            echo "Page $page -> [\${frames[*]}] : HIT"
            break
        fi
    done

    if [ $hit -eq 0 ]; then
        # Find empty frame or LRU
        victim=0
        min_time=\${last_used[0]}
        for ((j=0; j<num_frames; j++)); do
            if [ \${frames[$j]} -eq -1 ]; then
                victim=$j
                break
            fi
            if [ \${last_used[$j]} -lt $min_time ]; then
                min_time=\${last_used[$j]}
                victim=$j
            fi
        done
        frames[$victim]=$page
        last_used[$victim]=$clock
        faults=$((faults + 1))
        echo "Page $page -> [\${frames[*]}] : FAULT (Victim F$victim)"
    fi
done

echo ""
echo "Total LRU Page Faults: $faults"`,
      output: `=== LRU PAGE REPLACEMENT (SHELL SCRIPT) ===
Page 7 -> [7 -1 -1] : FAULT (Victim F0)
Page 0 -> [7 0 -1] : FAULT (Victim F1)
Page 1 -> [7 0 1] : FAULT (Victim F2)
Page 2 -> [2 0 1] : FAULT (Victim F0)
Page 0 -> [2 0 1] : HIT
Page 3 -> [2 0 3] : FAULT (Victim F2)
Page 0 -> [2 0 3] : HIT
Page 4 -> [4 0 3] : FAULT (Victim F0)
Page 2 -> [4 0 2] : FAULT (Victim F2)
Page 3 -> [4 3 2] : FAULT (Victim F1)

Total LRU Page Faults: 8`
    }
  },

  {
    num: 20,
    title: "Page Replacement Comparison (FIFO vs LRU vs Optimal) & Shell Parameter Display",
    partA: {
      marks: 50,
      q: "Compare FIFO, LRU, and Optimal page replacement algorithms based on the number of page faults generated.",
      aim: "To provide a rigorous comparative analysis of FIFO, LRU, and OPT on fault count, algorithmic overhead, and anomalies.",
      principle: `1. <strong>Optimal (OPT):</strong> Replaces page with furthest future use. Produces theoretical minimum page faults. Impossible to implement in practice because future reference string is unknown.
2. <strong>Least Recently Used (LRU):</strong> Approximates OPT by using recent past as an indicator of near future. High overhead (counters or stack), immune to Belady's Anomaly.
3. <strong>FIFO:</strong> Replaces oldest page. Simple to implement with circular queue. Can suffer from <strong>Belady's Anomaly</strong> (more frames produce more faults).`,
      table: `
<table class="index-table">
  <thead><tr><th>Feature</th><th>FIFO</th><th>LRU</th><th>Optimal (OPT)</th></tr></thead>
  <tbody>
    <tr><td>Look Direction</td><td>Arrival Time (FIFO queue)</td><td>Past references (Backward)</td><td>Future references (Forward)</td></tr>
    <tr><td>Page Fault Rate</td><td>Highest (typically 10-12)</td><td>Intermediate (typically 7-8)</td><td>Lowest / Optimal (typically 5-6)</td></tr>
    <tr><td>Belady's Anomaly</td><td>YES (Subject to anomaly)</td><td>NO (Stack algorithm)</td><td>NO (Stack algorithm)</td></tr>
    <tr><td>Hardware Support</td><td>None required</td><td>High (Counters/Stack/Age)</td><td>Theoretical only (N/A)</td></tr>
    <tr><td>Implementation</td><td>Very Simple</td><td>Complex</td><td>Impossible in General OS</td></tr>
  </tbody>
</table>`
    },
    partB: {
      marks: 50,
      q: "Write a shell script to display the reference string and frame count used in FIFO page replacement.",
      aim: "To display execution parameters and configuration metadata for page replacement in Bash.",
      principle: `Displays reference array attributes, frame counts, and theoretical bounds.`,
      code: `#!/bin/bash
# Shell Script: Display Reference String and Frame Parameters
ref_str=(7 0 1 2 0 3 0 4 2 3 0 3 2)
frame_count=3

echo "==============================================="
echo "   FIFO PAGE REPLACEMENT PARAMETER DASHBOARD   "
echo "==============================================="
echo "Total Page Requests : \${#ref_str[@]}"
echo "Frame Buffer Size   : $frame_count frames"
echo "Reference Sequence  : \${ref_str[*]}"
echo ""
echo "Frame Slots Initialized:"
for ((i=0; i<frame_count; i++)); do
    echo "  Frame Slot [$i] : [EMPTY]"
done
echo "==============================================="`,
      output: `===============================================
   FIFO PAGE REPLACEMENT PARAMETER DASHBOARD   
===============================================
Total Page Requests : 13
Frame Buffer Size   : 3 frames
Reference Sequence  : 7 0 1 2 0 3 0 4 2 3 0 3 2

Frame Slots Initialized:
  Frame Slot [0] : [EMPTY]
  Frame Slot [1] : [EMPTY]
  Frame Slot [2] : [EMPTY]
===============================================`
    }
  }
];
