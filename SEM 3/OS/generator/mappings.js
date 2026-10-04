// Module to enrich Set 1 and Set 2 with step-by-step algorithms, sample inputs, results, and experiment mappings

const set1Mappings = [
  { num: 1, exp: "Ex. 8: Deadlock Detection Algorithm", expId: "ex8", topic: "Deadlocks" },
  { num: 2, exp: "Ex. 12: Page Replacement Algorithms", expId: "ex12", topic: "Virtual Memory" },
  { num: 3, exp: "Ex. 10: Paging Technique", expId: "ex10", topic: "Memory Management" },
  { num: 4, exp: "Ex. 2: UNIX Commands and Shell Programming", expId: "ex2", topic: "UNIX & Shell" },
  { num: 5, exp: "Ex. 12: Page Replacement Algorithms", expId: "ex12", topic: "Virtual Memory" },
  { num: 6, exp: "Ex. 2: UNIX Commands and Shell Programming", expId: "ex2", topic: "UNIX & Shell" },
  { num: 7, exp: "Ex. 2: UNIX Commands and Shell Programming", expId: "ex2", topic: "UNIX & Shell" },
  { num: 8, exp: "Ex. 3: System Calls: Fork, Exit, Getpid, Wait, Close", expId: "ex3", topic: "System Calls" },
  { num: 9, exp: "Ex. 3: System Calls: Fork, Exit, Getpid, Wait, Close", expId: "ex3", topic: "System Calls" },
  { num: 10, exp: "Ex. 3: System Calls: Fork, Exit, Getpid, Wait, Close", expId: "ex3", topic: "System Calls" },
  { num: 11, exp: "Ex. 3: System Calls: Fork, Exit, Getpid, Wait, Close", expId: "ex3", topic: "System Calls" },
  { num: 12, exp: "Ex. 4: CPU Scheduling Algorithms", expId: "ex4", topic: "CPU Scheduling" },
  { num: 13, exp: "Ex. 4: CPU Scheduling Algorithms", expId: "ex4", topic: "CPU Scheduling" },
  { num: 14, exp: "Ex. 4: CPU Scheduling Algorithms", expId: "ex4", topic: "CPU Scheduling" },
  { num: 15, exp: "Ex. 4: CPU Scheduling Algorithms", expId: "ex4", topic: "CPU Scheduling" },
  { num: 16, exp: "Ex. 4: CPU Scheduling Algorithms", expId: "ex4", topic: "CPU Scheduling" },
  { num: 17, exp: "Ex. 5: Inter Process Communication (IPC)", expId: "ex5", topic: "IPC & Pipes" },
  { num: 18, exp: "Ex. 12: Page Replacement Algorithms", expId: "ex12", topic: "Virtual Memory" },
  { num: 19, exp: "Ex. 11: Memory Allocation Methods", expId: "ex11", topic: "Memory Management" },
  { num: 20, exp: "Ex. 10: Paging Technique", expId: "ex10", topic: "Memory Management" }
];

const set2Mappings = [
  { num: 1, exp: "Ex. 5: Inter Process Communication (IPC)", expId: "ex5", topic: "IPC & Pipes" },
  { num: 2, exp: "Ex. 5: Inter Process Communication (IPC)", expId: "ex5", topic: "IPC & Pipes" },
  { num: 3, exp: "Ex. 6: Semaphore Implementation", expId: "ex6", topic: "Semaphores & Mutex" },
  { num: 4, exp: "Ex. 6: Semaphore Implementation", expId: "ex6", topic: "Semaphores & Mutex" },
  { num: 5, exp: "Ex. 6: Semaphore Implementation", expId: "ex6", topic: "Semaphores & Mutex" },
  { num: 6, exp: "Ex. 6: Semaphore Implementation", expId: "ex6", topic: "Semaphores & Mutex" },
  { num: 7, exp: "Ex. 6: Semaphore Implementation", expId: "ex6", topic: "Semaphores & Mutex" },
  { num: 8, exp: "Ex. 7: Banker's Algorithm", expId: "ex7", topic: "Deadlocks" },
  { num: 9, exp: "Ex. 7: Banker's Algorithm", expId: "ex7", topic: "Deadlocks" },
  { num: 10, exp: "Ex. 8: Deadlock Detection Algorithm", expId: "ex8", topic: "Deadlocks" },
  { num: 11, exp: "Ex. 8: Deadlock Detection Algorithm", expId: "ex8", topic: "Deadlocks" },
  { num: 12, exp: "Ex. 9: Threading (POSIX Threads)", expId: "ex9", topic: "Multithreading" },
  { num: 13, exp: "Ex. 9: Threading (POSIX Threads)", expId: "ex9", topic: "Multithreading" },
  { num: 14, exp: "Ex. 10: Paging Technique", expId: "ex10", topic: "Memory Management" },
  { num: 15, exp: "Ex. 11: Memory Allocation Methods", expId: "ex11", topic: "Memory Management" },
  { num: 16, exp: "Ex. 11: Memory Allocation Methods", expId: "ex11", topic: "Memory Management" },
  { num: 17, exp: "Ex. 11: Memory Allocation Methods", expId: "ex11", topic: "Memory Management" },
  { num: 18, exp: "Ex. 11: Memory Allocation Methods", expId: "ex11", topic: "Memory Management" },
  { num: 19, exp: "Ex. 12: Page Replacement Algorithms", expId: "ex12", topic: "Virtual Memory" },
  { num: 20, exp: "Ex. 12: Page Replacement Algorithms", expId: "ex12", topic: "Virtual Memory" }
];

module.exports = {
  set1Mappings,
  set2Mappings
};
