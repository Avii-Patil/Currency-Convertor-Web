    const CURRENCIES = [
      "USD","EUR","GBP","INR","JPY","CAD","AUD","CHF","CNY","SEK",
      "NOK","DKK","NZD","SGD","HKD","MXN","BRL","ZAR","KRW","AED",
      "SAR","TRY","PLN","THB","IDR","MYR","PHP","CZK","HUF","RUB"
    ];

    const fromSel = document.getElementById("from-cur");
    const toSel   = document.getElementById("to-cur");

    CURRENCIES.forEach(c => {
      fromSel.innerHTML += `<option value="${c}">${c}</option>`;
      toSel.innerHTML   += `<option value="${c}">${c}</option>`;
    });
    fromSel.value = "USD";
    toSel.value   = "INR";

    document.getElementById("swap-btn").addEventListener("click", () => {
      const tmp = fromSel.value;
      fromSel.value = toSel.value;
      toSel.value = tmp;
      document.getElementById("result-box").style.display = "none";
      document.getElementById("rate-line").textContent = "";
    });

    document.getElementById("convert-btn").addEventListener("click", async () => {
      const btn    = document.getElementById("convert-btn");
      const errEl  = document.getElementById("error-msg");
      const amount = parseFloat(document.getElementById("amount").value);
      const from   = fromSel.value;
      const to     = toSel.value;

      errEl.textContent = "";
      document.getElementById("result-box").style.display = "none";
      document.getElementById("rate-line").textContent = "";

      if (!amount || amount < 0) {
        errEl.textContent = "Please enter a valid amount.";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Fetching rate…";

      try {
        const res  = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const rate = data.rates[to];
        if (!rate) throw new Error();

        const converted = (amount * rate).toFixed(2);
        document.getElementById("result-amount").textContent =
          `${parseFloat(converted).toLocaleString()} ${to}`;
        document.getElementById("result-label").textContent =
          `${amount} ${from} →`;
        document.getElementById("rate-line").textContent =
          `1 ${from} = ${rate.toFixed(4)} ${to}`;
        document.getElementById("result-box").style.display = "flex";
      } catch {
        errEl.textContent = "Could not fetch rates. Please try again.";
      }

      btn.disabled = false;
      btn.textContent = "Convert";
    });
