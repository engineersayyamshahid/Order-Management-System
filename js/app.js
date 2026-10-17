/* OrderFlow front-end demo interactions. No server, authentication, or database. */
(() => {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const storageKey = "orderflow-demo-orders-v1";

  function toast(message, type = "success") {
    let region = $("#toastRegion");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.id = "toastRegion";
      region.setAttribute("aria-live", "polite");
      document.body.append(region);
    }
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    region.append(item);
    window.setTimeout(() => item.remove(), 3300);
  }

  function getOrders() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); }
    catch { return []; }
  }
  function saveOrders(orders) {
    try { localStorage.setItem(storageKey, JSON.stringify(orders)); }
    catch { toast("Browser storage is unavailable. Changes may not persist.", "error"); }
  }

  // Demo role selection is navigation only; it is not real authentication.
  const loginForm = $("#loginForm");
  if (loginForm) {
    const roleSelect = $("#loginRole");
    const emailInput = $("#loginEmail");
    $$("[data-demo-role]").forEach(button => button.addEventListener("click", () => {
      const role = button.dataset.demoRole;
      roleSelect.value = role;
      emailInput.value = role === "admin" ? "admin@orderflow.demo" : "employee@orderflow.demo";
      $("#loginPassword").value = "demo1234";
      toast(`${role === "admin" ? "Administrator" : "Employee"} demo selected.`);
    }));
    $$("[data-toggle-password]").forEach(button => button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      button.setAttribute("aria-label", input.type === "password" ? "Show password" : "Hide password");
    }));
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      const role = roleSelect.value;
      location.href = role === "admin" ? "admin-dashboard.html" : "employee-dashboard.html";
    });
  }

  // Mobile navigation.
  const menuToggle = $("#menuToggle");
  const sidebar = $("#sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", event => {
      if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) sidebar.classList.remove("open");
    });
  }

  // Generic demo notices and print.
  $$("[data-toast]").forEach(button => button.addEventListener("click", () => toast(button.dataset.toast)));
  $$("[data-print]").forEach(button => button.addEventListener("click", () => window.print()));

  // Global search is a small convenience: typing filters tables on the current screen.
  const globalSearch = $("[data-global-search]");
  if (globalSearch) globalSearch.addEventListener("input", () => {
    const table = $("table");
    if (!table) return;
    filterTable(table, globalSearch.value, "all");
  });

  // Search and status filters.
  function filterTable(table, query, status) {
    const rows = $$("tbody tr", table);
    let visible = 0;
    rows.forEach(row => {
      const matchesText = row.textContent.toLowerCase().includes((query || "").trim().toLowerCase());
      const statusCell = row.querySelector(".status-pill");
      const rowStatus = statusCell ? statusCell.textContent.trim() : "all";
      const matchesStatus = status === "all" || rowStatus.toLowerCase() === status.toLowerCase();
      row.hidden = !(matchesText && matchesStatus);
      if (!row.hidden) visible++;
    });
    const empty = table.parentElement.querySelector(".empty-state");
    if (empty) empty.hidden = visible !== 0;
  }
  $$("[data-table-search]").forEach(input => {
    const table = $(input.dataset.tableSearch);
    if (table) input.addEventListener("input", () => {
      const filter = $(`[data-table-filter="${input.dataset.tableSearch}"]`);
      filterTable(table, input.value, filter ? filter.value : "all");
    });
  });
  $$("[data-table-filter]").forEach(select => {
    const table = $(select.dataset.tableFilter);
    if (table) select.addEventListener("change", () => {
      const search = $(`[data-table-search="${select.dataset.tableFilter}"]`);
      filterTable(table, search ? search.value : "", select.value);
    });
  });

  // Order form: preview totals, show chosen receipt, then add a local demo record.
  const orderForm = $("#newOrderForm");
  if (orderForm) {
    const amount = $("#orderAmount");
    const received = $("#amountReceived");
    const methodInputs = $$('input[name="paymentMethod"]', orderForm);
    const fileInput = $("#receiptFile");
    const currency = value => "৳" + (Number(value || 0)).toLocaleString("en-PK", { maximumFractionDigits: 0 });
    const selectedMethod = () => (methodInputs.find(input => input.checked) || {}).value || "COD";
    function updateSummary() {
      const total = Math.max(0, Number(amount.value) || 0);
      const paid = Math.max(0, Number(received.value) || 0);
      $("#summaryAmount").textContent = currency(total);
      $("#summaryReceived").textContent = currency(paid);
      $("#summaryBalance").textContent = currency(Math.max(0, total - paid));
      $("#summaryMethod").textContent = selectedMethod() === "COD" ? "Cash on delivery" : selectedMethod();
    }
    [amount, received, ...methodInputs].forEach(input => input.addEventListener("input", updateSummary));
    methodInputs.forEach(input => input.addEventListener("change", () => {
      if (input.value === "COD" && input.checked) received.value = "0";
      if (input.value === "Full Payment" && input.checked && amount.value) received.value = amount.value;
      updateSummary();
    }));
    amount.addEventListener("input", () => {
      if (selectedMethod() === "Full Payment") received.value = amount.value;
      updateSummary();
    });
    fileInput.addEventListener("change", () => {
      $("#fileName").textContent = fileInput.files && fileInput.files.length ? fileInput.files[0].name : "No file selected";
    });
    orderForm.addEventListener("reset", () => window.setTimeout(() => {
      $("#fileName").textContent = "No file selected";
      updateSummary();
    }, 0));
    orderForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!orderForm.reportValidity()) return;
      const total = Number(amount.value);
      const paid = Number(received.value) || 0;
      if (paid > total) {
        received.setCustomValidity("Amount received cannot exceed the order amount.");
        received.reportValidity();
        received.setCustomValidity("");
        return;
      }
      const orders = getOrders();
      const id = `OF-${2050 + orders.length}`;
      const record = {
        id, customer: $("#customerName").value.trim(),
        phone: $("#contactNumber").value.trim(),
        address: $("#customerAddress").value.trim(),
        amount: total, received: paid, method: selectedMethod(),
        description: $("#orderDescription").value.trim(),
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Pending"
      };
      orders.unshift(record);
      saveOrders(orders);
      toast(`Order #${id} added to your local demo records.`);
      orderForm.reset();
      updateSummary();
      window.setTimeout(() => location.href = "my-orders.html", 700);
    });
    updateSummary();
  }

  // Inject locally created demo orders into the order-status table.
  const myOrdersTable = $("#myOrdersTable");
  if (myOrdersTable) {
    const tbody = $("tbody", myOrdersTable);
    const orders = getOrders();
    orders.forEach(order => {
      const row = document.createElement("tr");
      const cells = [
        `<b>#${escapeHtml(order.id)}</b>`,
        escapeHtml(order.customer),
        escapeHtml(order.date),
        `<span class="money">${"৳" + Number(order.amount).toLocaleString("en-PK")}</span>`,
        escapeHtml(order.method === "COD" ? "COD" : order.method.replace(" Payment", "")),
        `<span class="status-pill pending">${escapeHtml(order.status)}</span>`,
        "Submitted from this browser"
      ];
      cells.forEach(value => { const td = document.createElement("td"); td.innerHTML = value; row.append(td); });
      tbody.prepend(row);
    });
    const total = $("#myOrdersTotal");
    if (total && orders.length) total.textContent = String(128 + orders.length);
  }

  // Approval controls update the visible status and browser-local record only.
  const approvalTable = $("#approvalTable");
  if (approvalTable) {
    $$("[data-decision]", approvalTable).forEach(button => button.addEventListener("click", () => {
      const row = button.closest("tr");
      const idMatch = row && row.cells[0] && row.cells[0].textContent.match(/OF-\d+/);
      if (!row || !idMatch) return;
      const decision = button.dataset.decision;
      const statusCell = row.cells[5];
      statusCell.innerHTML = `<span class="status-pill ${decision.toLowerCase()}">${decision}</span>`;
      row.cells[6].innerHTML = '<span class="decision-complete">Reviewed</span>';
      const actions = getOrders();
      const record = actions.find(item => item.id === idMatch[0]);
      if (record) { record.status = decision; saveOrders(actions); }
      const count = $("#pendingCount");
      if (count) {
        const pending = $$("tbody tr", approvalTable).filter(tr => tr.cells[5].textContent.trim() === "Pending").length;
        count.textContent = `${Math.max(0, 42 - (5 - pending))} orders`;
      }
      toast(`${idMatch[0]} marked ${decision.toLowerCase()} in this prototype.`);
    }));
  }

  // Copy tracking numbers with a graceful fallback.
  $$("[data-copy]").forEach(button => button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      toast(`Copied ${value}`);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = value; document.body.append(helper); helper.select();
      const copied = document.execCommand("copy"); helper.remove();
      toast(copied ? `Copied ${value}` : `Tracking number: ${value}`, copied ? "success" : "error");
    }
  }));

  // Small chart range control for the employee dashboard.
  const chartPeriod = $("[data-chart-period]");
  if (chartPeriod) chartPeriod.addEventListener("change", () => {
    const bars = $("[data-chart-bars]");
    if (!bars) return;
    const groups = $$(".bar-group", bars);
    groups.forEach((group, index) => { group.style.display = chartPeriod.value === "quarter" && index < 3 ? "none" : "flex"; });
  });

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }
})();