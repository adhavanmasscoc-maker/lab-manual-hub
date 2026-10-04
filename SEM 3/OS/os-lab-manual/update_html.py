import re
import os

file_path = r'D:\MATERIALS\REDDIT\SEM 3\OS\os-lab-manual\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add "OS 1: Lab Exam Pattern Questions" to the index table
index_entry = '<tr><td class="sno">OS 1</td><td><a href="#os1">Lab Exam Pattern Questions & Solutions</a></td></tr>\n                        <tr><td class="sno">VIVA</td><td><a href="#viva">Viva Questions</a></td></tr>'
content = content.replace('<tr><td class="sno">1</td><td><a href="#ex1">Installation of Windows Operating System</a></td></tr>',
                          index_entry + '\n                        <tr><td class="sno">1</td><td><a href="#ex1">Installation of Windows Operating System</a></td></tr>')

# 2. Add the OS 1 Content before EX 1
os1_content = """
        <!-- ================= OS 1 ================= -->
        <article class="exp-card" id="os1">
            <div class="exp-header">
                <span class="exp-badge">OS 1</span>
                <h2 class="exp-title">Lab Exam Pattern Questions & Solutions</h2>
            </div>
            
            <div class="sub-sec-title">1. Basic UNIX Commands & Shell Scripting</div>
            <p class="exp-content"><strong>4a, 6a, 7a) Directory/File Commands, CAT, HEAD, TAIL, MORE, GREP</strong></p>
            <div class="exp-content">
                <ul>
                    <li><strong>ls</strong> - Lists directory contents. (Syntax: <code>ls [options]</code>, Ex: <code>ls -l</code>)</li>
                    <li><strong>mkdir</strong> - Creates a directory. (Syntax: <code>mkdir [dir]</code>, Ex: <code>mkdir test</code>)</li>
                    <li><strong>cd</strong> - Changes current directory. (Syntax: <code>cd [dir]</code>, Ex: <code>cd test</code>)</li>
                    <li><strong>cp</strong> - Copies files. (Syntax: <code>cp [src] [dest]</code>, Ex: <code>cp a.txt b.txt</code>)</li>
                    <li><strong>rm</strong> - Removes files. (Syntax: <code>rm [file]</code>, Ex: <code>rm a.txt</code>)</li>
                    <li><strong>cat</strong> - Displays file contents (e.g., <code>cat file.txt</code>).</li>
                    <li><strong>head</strong> - Shows first 10 lines (e.g., <code>head -n 5 file.txt</code>).</li>
                    <li><strong>tail</strong> - Shows last 10 lines (e.g., <code>tail -f log.txt</code>).</li>
                    <li><strong>more</strong> - Paginates text output screen by screen.</li>
                    <li><strong>grep</strong> - Pattern matching in files (e.g., <code>grep 'word' file.txt</code>).</li>
                </ul>
            </div>
            
            <p class="exp-content"><strong>4b, 6b, 7b) Shell Scripts: Greatest of 3, Sum of Odd to N, Fibonacci</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>shell_basics.sh</span></div>
                <pre># Greatest of 3
echo "Enter 3 numbers:"
read a b c
if [ $a -gt $b ] && [ $a -gt $c ]; then echo $a
elif [ $b -gt $a ] && [ $b -gt $c ]; then echo $b
else echo $c; fi

# Sum of odd to N
echo "Enter N:"
read n; sum=0
for ((i=1; i<=n; i+=2)); do sum=$((sum+i)); done
echo $sum

# Fibonacci up to N
echo "Enter limit:"
read n; a=0; b=1
for ((i=0; i<n; i++)); do
  echo -n "$a "
  temp=$((a+b)); a=$b; b=$temp
done</pre>
            </div>

            <div class="sub-sec-title">2. Process Management (fork, wait, exec)</div>
            <p class="exp-content"><strong>8a, 9a, 11a) C Program: Process creation, PIDs, and synchronization</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>process_sync.c</span></div>
                <pre>#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        printf("Child: PID = %d, Parent PID = %d\\n", getpid(), getppid());
    } else if (pid &gt; 0) {
        wait(NULL);
        printf("Parent: PID = %d, Child PID = %d\\n", getpid(), pid);
    }
    return 0;
}</pre>
            </div>

            <p class="exp-content"><strong>8b, 9b, 11b) Shell Script: Background child process and wait</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>wait_sync.sh</span></div>
                <pre>echo "Parent PID: $$"
(
  echo "Child PID: $BASHPID, Parent PID: $PPID"
  sleep 1
) &
child_pid=$!
wait $child_pid
echo "Parent resumed after child completion."</pre>
            </div>

            <div class="sub-sec-title">3. Inter-Process Communication (Pipes)</div>
            <p class="exp-content"><strong>17a) C Program: IPC using pipes</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>ipc_pipe.c</span></div>
                <pre>#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;string.h&gt;

int main() {
    int fd[2];
    pipe(fd);
    if (fork() == 0) { // Child
        close(fd[0]);
        char *msg = "Hello Parent!";
        write(fd[1], msg, strlen(msg) + 1);
        close(fd[1]);
    } else { // Parent
        close(fd[1]);
        char buffer[100];
        read(fd[0], buffer, sizeof(buffer));
        printf("Received: %s\\n", buffer);
        close(fd[0]);
    }
    return 0;
}</pre>
            </div>

            <div class="sub-sec-title">4. CPU Scheduling Algorithms</div>
            <p class="exp-content"><strong>12a, 16a) FCFS Scheduling & Trace (Burst: 5, 3, 8, 6)</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>fcfs.c</span></div>
                <pre>#include &lt;stdio.h&gt;
int main() {
    int bt[] = {5, 3, 8, 6}, wt[4], n = 4;
    float avg_wt = 0;
    wt[0] = 0;
    for(int i=1; i&lt;n; i++) {
        wt[i] = bt[i-1] + wt[i-1];
        avg_wt += wt[i];
    }
    printf("Avg Waiting Time: %.2f\\n", avg_wt/n);
    return 0;
}</pre>
            </div>

            <div class="sub-sec-title">5. Synchronization & Semaphores</div>
            <p class="exp-content"><strong>C Program: Mutual Exclusion using Semaphores</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>semaphore.c</span></div>
                <pre>#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;
#include &lt;semaphore.h&gt;

sem_t sem;

void* thread_func(void* arg) {
    sem_wait(&sem); // Wait/Lock
    printf("Thread in critical section\\n");
    sem_post(&sem); // Signal/Unlock
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
}</pre>
            </div>

            <p class="exp-content"><strong>Shell Script: Mutual exclusion using lock file</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>lockfile.sh</span></div>
                <pre>LOCKFILE="/tmp/mylock"
if mkdir "$LOCKFILE" 2&gt;/dev/null; then
  echo "Critical section accessed by $$"
  sleep 2
  rmdir "$LOCKFILE"
else
  echo "Resource busy!"
fi</pre>
            </div>

            <div class="sub-sec-title">6. Deadlock Management</div>
            <p class="exp-content"><strong>Banker's Algorithm (Need Matrix & Safe Sequence)</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>bankers.c</span></div>
                <pre>#include &lt;stdio.h&gt;
int main() {
    int alloc[3][3] = {{0,1,0}, {2,0,0}, {3,0,2}};
    int max[3][3] = {{7,5,3}, {3,2,2}, {9,0,2}};
    int avail[3] = {3, 3, 2};
    int need[3][3], finish[3] = {0,0,0}, safeSeq[3], ind=0;

    for(int i=0;i&lt;3;i++)
        for(int j=0;j&lt;3;j++)
            need[i][j] = max[i][j] - alloc[i][j];

    for(int k=0;k&lt;3;k++) {
        for(int i=0;i&lt;3;i++) {
            if(finish[i] == 0) {
                int flag = 0;
                for(int j=0;j&lt;3;j++) {
                    if(need[i][j] &gt; avail[j]) flag=1;
                }
                if(flag == 0) {
                    safeSeq[ind++] = i;
                    for(int y=0;y&lt;3;y++) avail[y] += alloc[i][y];
                    finish[i] = 1;
                }
            }
        }
    }
    printf("Safe Sequence: P%d -&gt; P%d -&gt; P%d\\n", safeSeq[0], safeSeq[1], safeSeq[2]);
    return 0;
}</pre>
            </div>

            <div class="sub-sec-title">7. Memory Management & Paging</div>
            <p class="exp-content"><strong>FIFO Page Replacement</strong></p>
            <div class="code-wrapper">
                <div class="code-top"><span>fifo.c</span></div>
                <pre>// FIFO Page Replacement
int pages[] = {1, 2, 3, 4, 1, 2, 5};
int frames[3] = {-1, -1, -1};
int faults = 0, ptr = 0, n = 7;

for(int i=0; i&lt;n; i++) {
    int hit = 0;
    for(int j=0; j&lt;3; j++) {
        if(frames[j] == pages[i]) hit = 1;
    }
    if(!hit) {
        frames[ptr] = pages[i];
        ptr = (ptr + 1) % 3;
        faults++;
    }
}</pre>
            </div>
            
            <div class="box-result">
                Result: Exam pattern questions regarding process management, IPC, scheduling, synchronization, and memory management successfully answered.
            </div>
        </article>
"""

content = content.replace('<!-- ================= EX 1 ================= -->', os1_content + '\n        <!-- ================= EX 1 ================= -->')

# 3. Add VIVA Questions at the end before </div> <!-- container -->
viva_content = """
        <!-- ================= VIVA ================= -->
        <article class="exp-card" id="viva">
            <div class="exp-header">
                <span class="exp-badge">VIVA</span>
                <h2 class="exp-title">Viva Questions & Answers</h2>
            </div>
            <div class="exp-content">
                <ol>
                    <li><strong>What is a system call?</strong><br>It is the mechanism used by an application program to request a service from the operating system kernel.</li>
                    <li><strong>Difference between Process and Thread?</strong><br>A process is a program in execution (heavyweight), whereas a thread is a segment of a process (lightweight). Processes have isolated memory, threads share memory.</li>
                    <li><strong>What is deadlock?</strong><br>A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.</li>
                    <li><strong>Difference between Internal and External Fragmentation?</strong><br>Internal fragmentation occurs when allocated memory is slightly larger than requested. External fragmentation occurs when free memory is separated into small blocks and cannot fulfill a large contiguous request.</li>
                    <li><strong>Why is Optimal page replacement not practical?</strong><br>It requires future knowledge of the reference string, which the OS cannot predict.</li>
                </ol>
            </div>
        </article>
"""

# Find the closing tag of the container to inject the viva section
# It is just before </body> usually.
content = content.replace('    </div>\n\n</body>', viva_content + '\n    </div>\n\n</body>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")
