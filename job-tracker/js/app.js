// Main Application Coordinator & Orchestrator

const App = (function() {
  let activeRole = "user"; // "user" | "admin"
  let activeUserSubView = "browse"; // "browse" | "my-apps"

  function init() {
    setupRoleSwitcher();
    setupUserSubNav();
    setupModalHandlers();
    setupDataControls();

    // Subscribe to store updates to keep both views in sync
    Store.subscribe(() => {
      UserPortal.renderJobList();
      UserPortal.renderMyApplications();
      AdminPortal.renderStats();
      AdminPortal.renderJobsTable();
      AdminPortal.renderPipeline();
    });

    // Initialize portals
    UserPortal.init();
    AdminPortal.init();

    // Default to User view
    switchRole("user");
  }

  function setupRoleSwitcher() {
    const userRoleBtn = document.getElementById("role-btn-user");
    const adminRoleBtn = document.getElementById("role-btn-admin");

    if (userRoleBtn) {
      userRoleBtn.addEventListener("click", () => switchRole("user"));
    }

    if (adminRoleBtn) {
      adminRoleBtn.addEventListener("click", () => switchRole("admin"));
    }
  }

  function switchRole(role) {
    activeRole = role;

    const userRoleBtn = document.getElementById("role-btn-user");
    const adminRoleBtn = document.getElementById("role-btn-admin");
    const userSection = document.getElementById("user-portal-section");
    const adminSection = document.getElementById("admin-portal-section");
    const adminHeaderAction = document.getElementById("admin-header-actions");
    const userHeaderAction = document.getElementById("user-header-actions");

    if (role === "admin") {
      if (adminRoleBtn) adminRoleBtn.classList.add("active");
      if (userRoleBtn) userRoleBtn.classList.remove("active");
      if (adminSection) adminSection.style.display = "block";
      if (userSection) userSection.style.display = "none";
      if (adminHeaderAction) adminHeaderAction.style.display = "flex";
      if (userHeaderAction) userHeaderAction.style.display = "none";
      
      AdminPortal.renderStats();
      AdminPortal.renderJobsTable();
      AdminPortal.renderPipeline();
      showToast("Switched to Admin / Recruiter Portal", "info");
    } else {
      if (userRoleBtn) userRoleBtn.classList.add("active");
      if (adminRoleBtn) adminRoleBtn.classList.remove("active");
      if (userSection) userSection.style.display = "block";
      if (adminSection) adminSection.style.display = "none";
      if (adminHeaderAction) adminHeaderAction.style.display = "none";
      if (userHeaderAction) userHeaderAction.style.display = "flex";

      UserPortal.renderJobList();
      UserPortal.renderMyApplications();
      showToast("Switched to Candidate Portal", "info");
    }
  }

  function setupUserSubNav() {
    const browseTabBtn = document.getElementById("user-subnav-browse");
    const myAppsTabBtn = document.getElementById("user-subnav-myapps");

    if (browseTabBtn) {
      browseTabBtn.addEventListener("click", () => switchUserView("browse"));
    }
    if (myAppsTabBtn) {
      myAppsTabBtn.addEventListener("click", () => switchUserView("my-apps"));
    }
  }

  function switchUserView(view) {
    activeUserSubView = view;
    const browseTabBtn = document.getElementById("user-subnav-browse");
    const myAppsTabBtn = document.getElementById("user-subnav-myapps");
    const browseView = document.getElementById("user-browse-view");
    const myAppsView = document.getElementById("user-myapps-view");

    if (view === "my-apps") {
      if (myAppsTabBtn) myAppsTabBtn.classList.add("active");
      if (browseTabBtn) browseTabBtn.classList.remove("active");
      if (myAppsView) myAppsView.style.display = "block";
      if (browseView) browseView.style.display = "none";
      UserPortal.renderMyApplications();
    } else {
      if (browseTabBtn) browseTabBtn.classList.add("active");
      if (myAppsTabBtn) myAppsTabBtn.classList.remove("active");
      if (browseView) browseView.style.display = "block";
      if (myAppsView) myAppsView.style.display = "none";
      UserPortal.renderJobList();
    }
  }

  // --- MODAL UTILITIES ---
  function setupModalHandlers() {
    // Backdrop click and close buttons
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          closeModal(overlay.id);
        }
      });
    });

    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = btn.closest(".modal-overlay");
        if (modal) closeModal(modal.id);
      });
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeModal = document.querySelector(".modal-overlay.active");
        if (activeModal) closeModal(activeModal.id);
      }
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color:var(--success);"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color:var(--danger);"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color:var(--primary-500);"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${escapeHtml(message)}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  // --- DATA CONTROLS ---
  function setupDataControls() {
    const resetBtn = document.getElementById("reset-demo-data-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all jobs and applications back to the original demo seed data?")) {
          Store.resetToDefaults();
          showToast("Demo data has been reset to defaults.", "info");
        }
      });
    }

    const exportBtn = document.getElementById("export-data-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const jsonStr = Store.exportJSON();
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `jobtrack_data_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Application data exported to JSON file.", "success");
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Auto-init on DOM loaded
  document.addEventListener("DOMContentLoaded", init);

  return {
    init,
    switchRole,
    switchUserView,
    openModal,
    closeModal,
    showToast
  };
})();

