const NODE_URL = "https://char-unlike-stat-finance.trycloudflare.com" // сложи твоя Cloudflare URL

let minerAddress = "";
let mining = false;
let credits = 0;

const creditsEl = document.getElementById('credits');
const hsEl = document.getElementById('hs');
const logEl = document.getElementById('log');

document.getElementById('createWallet').onclick = () => {
  minerAddress = "sfc" + Math.floor(Math.random()*1_000_000); 
  const seed = "seed-" + Math.random().toString(36).substring(2);
  alert("Save your seed phrase: " + seed);
  document.getElementById('seedPhrase').textContent = seed;
  document.getElementById('seedPhrase').style.display = "block";
}

document.getElementById('importWallet').onclick = () => {
  const seed = prompt("Enter your seed phrase:");
  minerAddress = "sfc" + Math.floor(Math.random()*1_000_000); 
  alert("Wallet imported!");
}

document.getElementById('startBtn').onclick = () => { mining = true; mineLoop(); }
document.getElementById('stopBtn').onclick = () => { mining = false; }

async function mineLoop() {
  while(mining){
    try {
      const response = await fetch(`${NODE_URL}/mine`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({miner: minerAddress})
      });
      const data = await response.json();
      if(data.status === "success"){
        credits += data.credits;
        creditsEl.textContent = credits;
        hsEl.textContent = Math.floor(Math.random()*10+1) + " H/s";
        const li = document.createElement("li");
        li.textContent = `Block mined: ${data.block.hash.substring(0,10)}...`;
        logEl.appendChild(li);
      }
    } catch(e){
      console.log("Node not reachable", e);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

document.getElementById('sendBtn').onclick = async () => {
  const recipient = document.getElementById('recipient').value;
  const amount = parseInt(document.getElementById('amount').value);
  const res = await fetch(`${NODE_URL}/send`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({sender:minerAddress, recipient, amount})
  });
  const data = await res.json();
  alert(data.message);
}
