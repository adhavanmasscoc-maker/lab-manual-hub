const labData = [
    {
        title: "1. Basic UNIX Commands & Shell Scripting",
        questions: [
            {
                qTitle: "4a) Explain any five directory-related and file-related UNIX commands with syntax and examples",
                answerText: "<p><b>1. ls</b> - Lists directory contents. (Syntax: <code>ls [options]</code>, Ex: <code>ls -l</code>)<br><b>2. mkdir</b> - Creates a directory. (Syntax: <code>mkdir [dir]</code>, Ex: <code>mkdir test</code>)<br><b>3. cd</b> - Changes current directory. (Syntax: <code>cd [dir]</code>, Ex: <code>cd test</code>)<br><b>4. cp</b> - Copies files. (Syntax: <code>cp [src] [dest]</code>, Ex: <code>cp a.txt b.txt</code>)<br><b>5. rm</b> - Removes files. (Syntax: <code>rm [file]</code>, Ex: <code>rm a.txt</code>)</p>",
                codeBlocks: []
            },
            {
                qTitle: "6a, 7a) Explain CAT, HEAD, TAIL, MORE, GREP commands",
                answerText: "<p><b>cat</b>: Displays file contents (e.g., <code>cat file.txt</code>).<br><b>head</b>: Shows first 10 lines (e.g., <code>head -n 5 file.txt</code>).<br><b>tail</b>: Shows last 10 lines (e.g., <code>tail -f log.txt</code>).<br><b>more</b>: Paginates text output screen by screen.<br><b>grep</b>: Pattern matching in files (e.g., <code>grep 'word' file.txt</code>).</p>",
                codeBlocks: []
            },
            {
                qTitle: "4b, 6b, 7b) Shell Scripts: Greatest of 3, Sum of Odd to N, Fibonacci",
                answerText: "<p>Shell scripts for basic mathematical logic.</p>",
                codeBlocks: [
                    {
                        lang: "Shell",
                        code: `# Greatest of 3
read a b c
if [ $a -gt $b ] && [ $a -gt $c ]; then echo $a
elif [ $b -gt $a ] && [ $b -gt $c ]; then echo $b
else echo $c; fi

# Sum of odd to N
read n; sum=0
for ((i=1; i<=n; i+=2)); do sum=$((sum+i)); done
echo $sum

# Fibonacci up to N
read n; a=0; b=1
for ((i=0; i<n; i++)); do
  echo -n "$a "
  temp=$((a+b)); a=$b; b=$temp
done`
                    }
                ]
            }
        ]
    },
    {
        title: "2. Process Management (fork, wait, exec)",
        questions: [
            {
                qTitle: "8a, 9a, 11a) C Program to illustrate process creation (fork), PIDs, and synchronization (wait)",
                answerText: "<p><code>fork()</code> creates a child process. <code>getpid()</code> and <code>getppid()</code> return process IDs. <code>wait()</code> synchronizes parent to wait for child.</p>",
                codeBlocks: [
                    {
                        lang: "C",
                        code: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        printf("Child: PID = %d, Parent PID = %d\\n", getpid(), getppid());
    } else if (pid > 0) {
        wait(NULL);
        printf("Parent: PID = %d, Child PID = %d\\n", getpid(), pid);
    }
    return 0;
}`
                    }
                ]
            },
            {
                qTitle: "8b, 9b, 11b) Shell script to simulate background child process and wait",
                answerText: "<p>Using <code>&</code> for background process and <code>wait</code> for synchronization.</p>",
                codeBlocks: [
                    {
                        lang: "Shell",
                        code: `echo "Parent PID: $$"
(
  echo "Child PID: $BASHPID, Parent PID: $PPID"
  sleep 1
) &
child_pid=$!
wait $child_pid
echo "Parent resumed after child completion."`
                    }
                ]
            },
            {
                qTitle: "10a, 10b) C Program and Shell script for open/close file",
                answerText: "<p>Using system calls vs file descriptors.</p>",
                codeBlocks: [
                    {
                        lang: "C",
                        code: `#include <fcntl.h>
#include <unistd.h>
int main() {
    int fd = open("test.txt", O_CREAT | O_WRONLY, 0644);
    close(fd);
    return 0;
}`
                    },
                    {
                        lang: "Shell",
                        code: `# Open file descriptor 3 for writing
exec 3> test.txt
echo "Data" >&3
# Close file descriptor
exec 3>&-`
                    }
                ]
            }
        ]
    },
    {
        title: "3. Inter-Process Communication (Pipes)",
        questions: [
            {
                qTitle: "17a, Set 2 1a, 2a) C Program to implement IPC using pipes between parent and child",
                answerText: "<p>The <code>pipe()</code> system call creates a one-way data channel.</p>",
                codeBlocks: [
                    {
                        lang: "C",
                        code: `#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main() {
    int fd[2];
    pipe(fd);
    if (fork() == 0) { // Child
        close(fd[0]); // Close read end
        char *msg = "Hello Parent!";
        write(fd[1], msg, strlen(msg) + 1);
        close(fd[1]);
    } else { // Parent
        close(fd[1]); // Close write end
        char buffer[100];
        read(fd[0], buffer, sizeof(buffer));
        printf("Received: %s\\n", buffer);
        close(fd[0]);
    }
    return 0;
}`
                    }
                ]
            },
            {
                qTitle: "17b, Set 2 1b, 2b) Shell script demonstrating IPC using pipes",
                answerText: "<p>Shell simulates IPC using the pipe operator <code>|</code>.</p>",
                codeBlocks: [
                    {
                        lang: "Shell",
                        code: `echo "Message from process 1" | (read msg; echo "Process 2 received: $msg")`
                    }
                ]
            }
        ]
    },
    {
        title: "4. CPU Scheduling Algorithms",
        questions: [
            {
                qTitle: "12a, 16a) FCFS Scheduling in C & Trace",
                answerText: "<p>For burst times 5, 3, 8, 6. WT[0]=0, WT[1]=5, WT[2]=8, WT[3]=16. Avg WT = 29/4 = 7.25.</p>",
                codeBlocks: [
                    {
                        lang: "C",
                        code: `#include<stdio.h>
int main() {
    int bt[] = {5, 3, 8, 6}, wt[4], tat[4], n = 4;
    float avg_wt = 0;
    wt[0] = 0;
    for(int i=1; i<n; i++) {
        wt[i] = bt[i-1] + wt[i-1];
        avg_wt += wt[i];
    }
    printf("Avg Waiting Time: %.2f\\n", avg_wt/n);
    return 0;
}`
                    }
                ]
            },
            {
                qTitle: "13a, 14a, 15a) SJF, Priority, Round Robin (Conceptual Merged Logic)",
                answerText: "<p><b>SJF</b>: Sorts burst times before assigning CPU.<br><b>Priority</b>: Sorts by priority before execution.<br><b>Round Robin</b>: Uses a time quantum (e.g., 2ms) and cycles through processes.</p>",
                codeBlocks: [
                    {
                        lang: "Shell",
                        code: `# Shell array sorting (SJF Simulation)
bt=(5 3 8 6)
IFS=$'\\n' sorted=($(sort -n <<<"\${bt[*]}"))
unset IFS
echo "Sorted Burst Times for SJF: \${sorted[*]}"`
                    }
                ]
            }
        ]
    },
    {
        title: "5. Synchronization & Semaphores",
        questions: [
            {
                qTitle: "Set 2 - 3a, 4a, 5a) Semaphore syntax and mutual exclusion C Program",
                answerText: "<p><code>sem_init()</code> initializes, <code>sem_wait()</code> decrements (locks), <code>sem_post()</code> increments (unlocks).</p>",
                codeBlocks: [
                    {
                        lang: "C",
                        code: `#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

sem_t sem;

void* thread_func(void* arg) {
    sem_wait(&sem); // Enter critical section
    printf("Thread in critical section\\n");
    sem_post(&sem); // Exit critical section
    return NULL;
}

int main() {
    pthread_t t1, t2;
    sem_init(&sem, 0, 1);
    pthread_create(&t1, NULL, thread_func, NULL);
    pthread_create(&t2, NULL, thread_func, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    sem_destroy(&sem);
    return 0;
}`
                    }
                ]
            },
            {
                qTitle: "Set 2 - 3b, 4b, 5b) Shell script mutual exclusion using lock file",
                answerText: "<p>Uses <code>mkdir</code> or <code>touch</code> as a primitive lock to prevent race conditions.</p>",
                codeBlocks: [
                    {
                        lang: "Shell",
                        code: `LOCKFILE="/tmp/mylock"
if mkdir "$LOCKFILE" 2>/dev/null; then
  echo "Critical section accessed by $$"
  sleep 2
  rmdir "$LOCKFILE"
else
  echo "Resource busy!"
fi`
                    }
                ]
            }
        ]
    },
    {
        title: "6. Deadlock Management",
        questions: [
            {
                qTitle: "Set 2 - 8a, 9a) Banker's Algorithm and Need Matrix C Program",
                answerText: "<p>Need = Max - Allocation. The algorithm checks if available resources can fulfill the Need of any process sequentially to find a Safe Sequence.</p>",
                codeBlocks: [
                    {
                        lang: "C",
                        code: `#include <stdio.h>
int main() {
    int alloc[3][3] = {{0,1,0}, {2,0,0}, {3,0,2}};
    int max[3][3] = {{7,5,3}, {3,2,2}, {9,0,2}};
    int avail[3] = {3, 3, 2};
    int need[3][3], finish[3] = {0,0,0}, safeSeq[3], ind=0;

    for(int i=0;i<3;i++)
        for(int j=0;j<3;j++)
            need[i][j] = max[i][j] - alloc[i][j];

    for(int k=0;k<3;k++) {
        for(int i=0;i<3;i++) {
            if(finish[i] == 0) {
                int flag = 0;
                for(int j=0;j<3;j++) {
                    if(need[i][j] > avail[j]) flag=1;
                }
                if(flag == 0) {
                    safeSeq[ind++] = i;
                    for(int y=0;y<3;y++) avail[y] += alloc[i][y];
                    finish[i] = 1;
                }
            }
        }
    }
    printf("Safe Sequence: P%d -> P%d -> P%d\\n", safeSeq[0], safeSeq[1], safeSeq[2]);
    return 0;
}`
                    }
                ]
            }
        ]
    },
    {
        title: "7. Memory Management & Paging",
        questions: [
            {
                qTitle: "19a, Set 2 17a) Best Fit / First Fit Memory Allocation",
                answerText: "<p>Blocks: 500, 200, 300, 600. Processes: 357, 129, 191.<br><b>First Fit</b>: 357->500, 129->200, 191->300.<br><b>Best Fit</b>: 357->500, 129->200, 191->300.</p>",
                codeBlocks: []
            },
            {
                qTitle: "2a, 18a, 19a) Page Replacement (FIFO, LRU, Optimal)",
                answerText: "<p><b>FIFO</b> replaces the oldest page.<br><b>LRU</b> replaces the least recently used page.<br><b>Optimal</b> replaces the page that will not be used for the longest time in the future.</p>",
                codeBlocks: [
                    {
                        lang: "C",
                        code: `// Snippet for FIFO Page Replacement
int pages[] = {1, 2, 3, 4, 1, 2, 5};
int frames[3] = {-1, -1, -1};
int faults = 0, ptr = 0, n = 7;

for(int i=0; i<n; i++) {
    int hit = 0;
    for(int j=0; j<3; j++) {
        if(frames[j] == pages[i]) hit = 1;
    }
    if(!hit) {
        frames[ptr] = pages[i];
        ptr = (ptr + 1) % 3;
        faults++;
    }
}
printf("Total Page Faults: %d\\n", faults);`
                    }
                ]
            }
        ]
    },
    {
        title: "Viva Questions",
        questions: [
            {
                qTitle: "General OS Viva Questions",
                answerText: "<ul><li><b>What is a system call?</b> It is the mechanism used by an application program to request a service from the operating system kernel.</li><li><b>Difference between Process and Thread?</b> A process is a program in execution (heavyweight), whereas a thread is a segment of a process (lightweight). Processes have isolated memory, threads share memory.</li><li><b>What is deadlock?</b> A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.</li><li><b>Difference between Internal and External Fragmentation?</b> Internal fragmentation occurs when allocated memory is slightly larger than requested. External fragmentation occurs when free memory is separated into small blocks and cannot fulfill a large contiguous request.</li><li><b>Why is Optimal page replacement not practical?</b> It requires future knowledge of the reference string, which the OS cannot predict.</li></ul>",
                codeBlocks: []
            }
        ]
    }
];
