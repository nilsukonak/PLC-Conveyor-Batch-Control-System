//html elemanlarını id ile alıyorum
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

const product = document.getElementById("product");
const sensorHead = document.getElementById("sensorHead");
const pusher = document.getElementById("pusher");

const systemStatus = document.getElementById("systemStatus");
const conveyorStatus = document.getElementById("conveyorStatus");
const pusherStatus = document.getElementById("pusherStatus");
const stateStatus = document.getElementById("stateStatus");

const productCountText = document.getElementById("productCount");
const progressBar = document.getElementById("progressBar");
const batchComplete = document.getElementById("batchComplete");

let systemRunning = false;
let conveyorRunning = false;

let productCount = 0;
const batchTarget = 10;

let state = 0;

//ürünün yatay konumu
let productPosition = 7;

let animationId = null; //başlangıçta animasyon yok

let processingProduct = false; //ürün anlık işleniyo mu

//ekran güncelleme fonksiyonu
function updateDisplay() {
  systemStatus.textContent = systemRunning ? "RUNNING" : "STOPPED";

  conveyorStatus.textContent = conveyorRunning ? "RUNNING" : "OFF";

  productCountText.textContent = productCount;

  progressBar.style.width = `${(productCount / batchTarget) * 100}%`;

  if (state === 0) {
    stateStatus.textContent = "IDLE";
  }

  if (state === 1) {
    stateStatus.textContent = "CONVEYOR";
  }

  if (state === 2) {
    stateStatus.textContent = "PUSHING";
  }

  if (state === 4) {
    stateStatus.textContent = "BATCH COMPLETE";
  }
}
startBtn.addEventListener("click", () => {
  //batch bittiğinde starta basınca tekrar başlamasın
  if (productCount >= batchTarget) {
    return;
  }

  systemRunning = true;

  state = 1;

  conveyorRunning = true;

  updateDisplay();

  startAnimation();
});

stopBtn.addEventListener("click", () => {
  systemRunning = false;

  conveyorRunning = false;

  state = 0;

  updateDisplay();

  cancelAnimationFrame(animationId);
});

resetBtn.addEventListener("click", () => {
  systemRunning = false;

  conveyorRunning = false;

  processingProduct = false;

  productCount = 0;

  state = 0;

  productPosition = 7;

  product.style.left = productPosition + "%";

  sensorHead.classList.remove("active");

  pusher.classList.remove("active");

  pusherStatus.textContent = "OFF";

  batchComplete.classList.remove("show");

  cancelAnimationFrame(animationId);

  updateDisplay();
});

function startAnimation() {
  cancelAnimationFrame(animationId);

  function moveProduct() {
    if (!systemRunning) {
      return;
    }

    if (conveyorRunning && !processingProduct) {
      productPosition += 0.12;

      product.style.left = productPosition + "%";

      if (productPosition >= 65) {
        processingProduct = true;

        conveyorRunning = false;

        state = 2;

        // Sensör ürünü gördü
        sensorHead.classList.add("active");

        updateDisplay();

        activatePusher();

        return;
      }
    }

    animationId = requestAnimationFrame(moveProduct);
  }

  animationId = requestAnimationFrame(moveProduct);
}

function activatePusher() {
  pusher.classList.add("active");

  pusherStatus.textContent = "ON";

  setTimeout(() => {
    pusher.classList.remove("active");

    pusherStatus.textContent = "OFF";

    sensorHead.classList.remove("active");

    productCount++;

    updateDisplay();

    if (productCount >= batchTarget) {
      state = 4;

      conveyorRunning = false;

      systemRunning = true;

      batchComplete.classList.add("show");

      product.style.left = "110%";

      updateDisplay();

      return;
    }

    productPosition = 7;

    product.style.left = productPosition + "%";

    processingProduct = false;

    state = 1;

    conveyorRunning = true;

    updateDisplay();

    startAnimation();
  }, 500);
}

updateDisplay();
