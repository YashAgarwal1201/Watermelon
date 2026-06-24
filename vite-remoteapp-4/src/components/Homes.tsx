import { createSignal, onCleanup, onMount, For, Show } from "solid-js";
import styles from "../assets/css/Home.module.css";

type HistoryEntry = { expr: string; result: string };

const BUTTONS = [
  ["C", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const Home = () => {
  const [display, setDisplay] = createSignal("0");
  const [expression, setExpression] = createSignal("");
  const [waitingForOperand, setWaitingForOperand] = createSignal(false);
  const [history, setHistory] = createSignal<HistoryEntry[]>([]);
  const [showInfo, setShowInfo] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);

  // ── Core logic ────────────────────────────────────────────────────────
  function inputDigit(digit: string) {
    if (hasError()) clear();
    if (waitingForOperand()) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display() === "0" ? digit : display() + digit);
    }
  }

  function inputDecimal() {
    if (hasError()) return;
    if (waitingForOperand()) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display().includes(".")) {
      setDisplay(display() + ".");
    }
  }

  function inputOperator(op: string) {
    if (hasError()) return;
    const current = parseFloat(display());
    const expr = expression();

    if (expr && !waitingForOperand()) {
      const result = evaluate(expr, current);
      if (result === null) return;
      setDisplay(format(result));
      setExpression(format(result) + " " + op + " ");
    } else {
      setExpression(display() + " " + op + " ");
    }
    setWaitingForOperand(true);
  }

  function evaluate(expr: string, current: number): number | null {
    const parts = expr.trim().split(" ");
    const prev = parseFloat(parts[0]);
    const op = parts[1];
    try {
      if (op === "+") return prev + current;
      if (op === "−") return prev - current;
      if (op === "×") return prev * current;
      if (op === "÷") {
        if (current === 0) {
          setHasError(true);
          setDisplay("Error");
          return null;
        }
        return prev / current;
      }
    } catch {
      setHasError(true);
      setDisplay("Error");
    }
    return null;
  }

  function equals() {
    if (hasError() || !expression() || waitingForOperand()) return;
    const current = parseFloat(display());
    const result = evaluate(expression(), current);
    if (result === null) return;
    const formatted = format(result);
    const entry: HistoryEntry = {
      expr: expression() + display(),
      result: formatted,
    };
    setHistory((h) => [entry, ...h].slice(0, 10));
    setExpression("");
    setDisplay(formatted);
    setWaitingForOperand(true);
  }

  function clear() {
    setDisplay("0");
    setExpression("");
    setWaitingForOperand(false);
    setHasError(false);
  }

  function toggleSign() {
    if (hasError()) return;
    setDisplay(format(parseFloat(display()) * -1));
  }

  function percent() {
    if (hasError()) return;
    setDisplay(format(parseFloat(display()) / 100));
  }

  function format(n: number): string {
    if (!isFinite(n)) return "Error";
    // avoid floating point noise
    const s = parseFloat(n.toPrecision(10)).toString();
    return s;
  }

  // ── Keyboard support ──────────────────────────────────────────────────
  function handleKey(e: KeyboardEvent) {
    if (showInfo()) {
      if (e.key === "Escape") setShowInfo(false);
      return;
    }
    const k = e.key;
    if (k >= "0" && k <= "9") inputDigit(k);
    else if (k === ".") inputDecimal();
    else if (k === "+") inputOperator("+");
    else if (k === "-") inputOperator("−");
    else if (k === "*") inputOperator("×");
    else if (k === "/") {
      e.preventDefault();
      inputOperator("÷");
    } else if (k === "Enter" || k === "=") equals();
    else if (k === "Escape") clear();
    else if (k === "Backspace") {
      if (display().length > 1) setDisplay(display().slice(0, -1));
      else setDisplay("0");
    }
  }

  onMount(() => window.addEventListener("keydown", handleKey));
  onCleanup(() => window.removeEventListener("keydown", handleKey));

  // ── Button handler ────────────────────────────────────────────────────
  function handleButton(label: string) {
    if (label >= "0" && label <= "9") inputDigit(label);
    else if (label === ".") inputDecimal();
    else if (label === "=") equals();
    else if (label === "C") clear();
    else if (label === "+/-") toggleSign();
    else if (label === "%") percent();
    else if (["÷", "×", "−", "+"].includes(label)) inputOperator(label);
  }

  function btnClass(label: string): string {
    if (label === "=") return styles.btnEqual;
    if (["÷", "×", "−", "+"].includes(label)) return styles.btnOp;
    if (["C", "+/-", "%"].includes(label)) return styles.btnUtil;
    if (label === "0") return styles.btnZero;
    return styles.btnNum;
  }

  return (
    <>
      <div class={styles.page}>
        {/* Info button */}
        <button
          class={styles.infoBtn}
          onClick={() => setShowInfo(true)}
          title="About"
        >
          ℹ
        </button>

        <div class={styles.layout}>
          {/* History panel */}
          <div class={styles.historyPanel}>
            <p class={styles.historyLabel}>History</p>
            <Show when={history().length === 0}>
              <p class={styles.historyEmpty}>No calculations yet</p>
            </Show>
            <For each={history()}>
              {(entry) => (
                <div class={styles.historyEntry}>
                  <span class={styles.historyExpr}>{entry.expr}</span>
                  <span class={styles.historyResult}>= {entry.result}</span>
                </div>
              )}
            </For>
          </div>

          {/* Calculator */}
          <div class={styles.calculator}>
            {/* Display */}
            <div class={styles.display}>
              <div class={styles.expression}>{expression() || "\u00A0"}</div>
              <div
                class={styles.value}
                classList={{
                  [styles.valueError]: hasError(),
                  [styles.valueLong]: display().length > 9,
                }}
              >
                {display()}
              </div>
            </div>

            {/* Buttons */}
            <div class={styles.grid}>
              <For each={BUTTONS}>
                {(row) => (
                  <For each={row}>
                    {(label) => (
                      <button
                        class={`${styles.btn} ${btnClass(label)}`}
                        onClick={() => handleButton(label)}
                      >
                        {label}
                      </button>
                    )}
                  </For>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>

      {/* Info modal */}
      <Show when={showInfo()}>
        <div class={styles.backdrop} onClick={() => setShowInfo(false)}>
          <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div class={styles.modalHeader}>
              <h2 class={styles.modalTitle}>About</h2>
              <button
                class={styles.modalClose}
                onClick={() => setShowInfo(false)}
              >
                ✕
              </button>
            </div>
            <div class={styles.modalBody}>
              <p class={styles.modalDesc}>
                A fully functional calculator with keyboard support and
                calculation history. Part of a Module Federation
                proof-of-concept demonstrating cross-framework micro-frontend
                architecture.
              </p>
              <div class={styles.divider} />
              <p class={styles.stackLabel}>Tech Stack</p>
              <ul class={styles.stackList}>
                <li>
                  <span class={styles.stackKey}>Framework</span>
                  <span class={styles.stackVal}>SolidJS + TypeScript</span>
                </li>
                <li>
                  <span class={styles.stackKey}>Build</span>
                  <span class={styles.stackVal}>Vite</span>
                </li>
                <li>
                  <span class={styles.stackKey}>Styling</span>
                  <span class={styles.stackVal}>CSS Modules</span>
                </li>
                <li>
                  <span class={styles.stackKey}>Architecture</span>
                  <span class={styles.stackVal}>Module Federation remote</span>
                </li>
                <li>
                  <span class={styles.stackKey}>Keyboard</span>
                  <span class={styles.stackVal}>
                    Full numpad + operator support
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Home;
