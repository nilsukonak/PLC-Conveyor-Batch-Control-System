# PLC-Conveyor-Batch-Control-System
# PLC Conveyor Batch Control System

A basic industrial automation project that simulates a conveyor-based batch control system using IEC 61131-3 Structured Text (ST).

The project was developed to practice fundamental PLC programming concepts such as state-based control, rising-edge detection, timers, counters, Start/Stop logic, and batch processing.

A browser-based visual simulation was also created with HTML, CSS, and JavaScript to demonstrate the sequence of the PLC logic visually.

---

## Project Overview

The system represents a simple conveyor production line.

When the operator presses START, the conveyor begins running.

When a product reaches the sensor:

1. The product sensor detects the product.
2. Rising-edge detection ensures that the same product is counted only once.
3. The conveyor stops.
4. The pusher is activated.
5. The pusher remains active for a defined period.
6. The system returns to conveyor operation.
7. The sequence repeats until the batch target is reached.

The batch target is currently set to 10 products.

After the 10th product is processed, the conveyor stops and the system enters the `BATCH COMPLETE` state.

The operator can use RESET to clear the product count and return the system to its initial state. START must then be pressed to begin a new batch.

---

## Control Sequence

```text
IDLE
  |
  | START
  v
CONVEYOR RUNNING
  |
  | Product detected
  v
PUSHING
  |
  | Timer completed
  |
  +---- Product Count < 10 ----> CONVEYOR RUNNING
  |
  +---- Product Count >= 10 ---> BATCH COMPLETE
                                      |
                                      | RESET
                                      v
                                     IDLE
