// Admin Portal Logic: Job Management & Applicant Tracking System (ATS)

const AdminPortal = (function () {
  let activeTab = "pipeline"; // "pipeline" | "jobs"
  let pipelineViewMode = "kanban"; // "kanban" | "table"
  let applicantFilters = {
    jobId: "all",
    status: "all",
    search: ""
  };
  let jobSearchFilter = "";
  let editingJobId = null;
  let activeApplicantId = null;

  function init() {
    setupEventListeners();
    renderStats();
    renderJobsTable();
    renderPipeline();
  }

  function setupEventListeners() {
    // Admin Sub Navigation Tabs
    const tabBtns = document.querySelectorAll(".admin-nav-tab");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.getAttribute("data-tab");
        switchTab(activeTab);
      });
    });

    // Pipeline View Mode Switcher (Kanban vs Table)
    const viewKanbanBtn = document.getElementById("view-kanban-btn");
    const viewTableBtn = document.getElementById("view-table-btn");
    if (viewKanbanBtn && viewTableBtn) {
      viewKanbanBtn.addEventListener("click", () => {
        pipelineViewMode = "kanban";
        viewKanbanBtn.classList.add("active");
        viewTableBtn.classList.remove("active");
        document.getElementById("kanban-view-container").style.display = "block";
        document.getElementById("table-view-container").style.display = "none";
        renderPipeline();
      });

      viewTableBtn.addEventListener("click", () => {
        pipelineViewMode = "table";
        viewTableBtn.classList.add("active");
        viewKanbanBtn.classList.remove("active");
        document.getElementById("kanban-view-container").style.display = "none";
        document.getElementById("table-view-container").style.display = "block";
        renderPipeline();
      });
    }

    // Applicant Filters
    const appJobFilter = document.getElementById("admin-app-job-filter");
    if (appJobFilter) {
      appJobFilter.addEventListener("change", (e) => {
        applicantFilters.jobId = e.target.value;
        renderPipeline();
      });
    }

    const appStatusFilter = document.getElementById("admin-app-status-filter");
    if (appStatusFilter) {
      appStatusFilter.addEventListener("change", (e) => {
        applicantFilters.status = e.target.value;
        renderPipeline();
      });
    }

    const appSearch = document.getElementById("admin-app-search");
    if (appSearch) {
      appSearch.addEventListener("input", (e) => {
        applicantFilters.search = e.target.value;
        renderPipeline();
      });
    }

    // Job Management Search
    const jobSearch = document.getElementById("admin-job-search");
    if (jobSearch) {
      jobSearch.addEventListener("input", (e) => {
        jobSearchFilter = e.target.value;
        renderJobsTable();
      });
    }

    // Post / Edit Job Form Submit
    const postJobForm = document.getElementById("post-job-form");
    if (postJobForm) {
      postJobForm.addEventListener("submit", handleJobFormSubmit);
    }

    // Candidate Modal Status Change
    const modalStatusSelect = document.getElementById("cand-modal-status-select");
    if (modalStatusSelect) {
      modalStatusSelect.addEventListener("change", (e) => {
        if (activeApplicantId) {
          Store.updateApplicationStatus(activeApplicantId, e.target.value);
          App.showToast(`Candidate status updated to "${e.target.value}"`, "success");
          renderPipeline();
          renderStats();
        }
      });
    }

    // Add Recruiter Note Form
    const addNoteForm = document.getElementById("add-note-form");
    if (addNoteForm) {
      addNoteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("new-note-input");
        if (input && input.value.trim() && activeApplicantId) {
          Store.updateApplicationStatus(activeApplicantId, null, input.value.trim());
          input.value = "";
          renderCandidateModal(activeApplicantId);
          App.showToast("Recruiter note logged.", "info");
        }
      });
    }
  }

  function switchTab(tabName) {
    const pipelineSec = document.getElementById("admin-pipeline-section");
    const jobsSec = document.getElementById("admin-jobs-section");

    if (tabName === "pipeline") {
      if (pipelineSec) pipelineSec.style.display = "block";
      if (jobsSec) jobsSec.style.display = "none";
      renderPipeline();
    } else {
      if (pipelineSec) pipelineSec.style.display = "none";
      if (jobsSec) jobsSec.style.display = "block";
      renderJobsTable();
    }
  }

  function renderStats() {
    const stats = Store.getStats();

    const activeEl = document.getElementById("stat-active-jobs");
    const totalEl = document.getElementById("stat-total-jobs");
    const applicantsEl = document.getElementById("stat-total-applicants");
    const interviewEl = document.getElementById("stat-interview-count");
    const hiredEl = document.getElementById("stat-hired-count");

    if (activeEl) activeEl.textContent = stats.activeJobs;
    if (totalEl) totalEl.textContent = stats.totalJobs;
    if (applicantsEl) applicantsEl.textContent = stats.totalApplications;
    if (interviewEl) interviewEl.textContent = stats.stageCounts["Interview Scheduled"] || 0;
    if (hiredEl) hiredEl.textContent = (stats.stageCounts["Hired"] || 0) + (stats.stageCounts["Offer Made"] || 0);

    // Populate Job filter dropdown in Pipeline
    populateJobFilterDropdown();
  }

  function populateJobFilterDropdown() {
    const select = document.getElementById("admin-app-job-filter");
    if (!select) return;

    const currentVal = select.value;
    const jobs = Store.getJobs();

    select.innerHTML = `<option value="all">All Job Positions (${jobs.length})</option>` +
      jobs.map(j => `<option value="${j.id}" ${currentVal === j.id ? 'selected' : ''}>${escapeHtml(j.title)}</option>`).join("");
  }

  // --- JOB OPENINGS MANAGEMENT ---
  function renderJobsTable() {
    const tbody = document.getElementById("admin-jobs-tbody");
    if (!tbody) return;

    let jobs = Store.getJobs({ search: jobSearchFilter });
    const allApps = Store.getApplications();

    if (jobs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--slate-400);">
            No job openings found. Click <strong>"Post New Job"</strong> to publish an opening.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = jobs.map(job => {
      const applicantCount = allApps.filter(a => a.jobId === job.id).length;
      const salaryStr = (job.salaryMin && job.salaryMax)
        ? `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`
        : "Competitive";

      const isActive = job.status === "Active";

      return `
        <tr>
          <td>
            <div class="cell-primary">${escapeHtml(job.title)}</div>
            <div class="cell-sub">${escapeHtml(job.department)} • ${escapeHtml(job.workMode)}</div>
          </td>
          <td>
            <div>${escapeHtml(job.location)}</div>
            <div class="cell-sub">${escapeHtml(job.type)} • ${escapeHtml(job.experienceLevel)}</div>
          </td>
          <td>${escapeHtml(salaryStr)}</td>
          <td>
            <span class="badge ${isActive ? 'badge-active' : 'badge-closed'}">
              <span class="badge-dot" style="background: ${isActive ? 'var(--success)' : '#94a3b8'};"></span>
              ${job.status}
            </span>
          </td>
          <td>
            <a href="javascript:void(0)" onclick="AdminPortal.filterApplicantsByJob('${job.id}')" style="font-weight: 700; color: var(--primary-600); display: inline-flex; align-items: center; gap: 4px;">
              <span>${applicantCount}</span>
              <span style="font-weight: 500; font-size: 0.75rem; color: var(--slate-500);">Applicants</span>
            </a>
          </td>
          <td>
            <div>${job.postedDate}</div>
            <div class="cell-sub">${job.deadline ? `Due ${job.deadline}` : 'No deadline'}</div>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="btn btn-ghost btn-sm" title="${isActive ? 'Pause / Close Job' : 'Reactivate Job'}" onclick="AdminPortal.toggleJobStatus('${job.id}')">
              ${isActive ? '⏸ Close' : '▶ Activate'}
            </button>
            <button class="btn btn-outline btn-sm" onclick="AdminPortal.openEditJobModal('${job.id}')">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="AdminPortal.deleteJob('${job.id}')">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function filterApplicantsByJob(jobId) {
    const tabBtn = document.querySelector('.admin-nav-tab[data-tab="pipeline"]');
    if (tabBtn) tabBtn.click();

    const select = document.getElementById("admin-app-job-filter");
    if (select) {
      select.value = jobId;
      applicantFilters.jobId = jobId;
      renderPipeline();
    }
  }

  function toggleJobStatus(jobId) {
    const job = Store.toggleJobStatus(jobId);
    if (job) {
      App.showToast(`Job "${job.title}" marked as ${job.status}`, "info");
      renderJobsTable();
      renderStats();
    }
  }

  function deleteJob(jobId) {
    const job = Store.getJobById(jobId);
    if (!job) return;

    if (confirm(`Are you sure you want to delete the job opening "${job.title}"?`)) {
      Store.deleteJob(jobId);
      App.showToast(`Job opening deleted.`, "info");
      renderJobsTable();
      renderStats();
      renderPipeline();
    }
  }

  function openPostJobModal() {
    editingJobId = null;
    const form = document.getElementById("post-job-form");
    if (form) form.reset();

    const modalTitle = document.getElementById("post-job-modal-title");
    const submitBtn = document.getElementById("post-job-submit-btn");

    if (modalTitle) modalTitle.textContent = "Post a New Job Opening";
    if (submitBtn) submitBtn.textContent = "Publish Job Opening";

    App.openModal("post-job-modal");
  }

  function openEditJobModal(jobId) {
    const job = Store.getJobById(jobId);
    if (!job) return;
    editingJobId = jobId;

    const modalTitle = document.getElementById("post-job-modal-title");
    const submitBtn = document.getElementById("post-job-submit-btn");

    if (modalTitle) modalTitle.textContent = `Edit Job: ${job.title}`;
    if (submitBtn) submitBtn.textContent = "Save Changes";

    // Pre-populate fields
    document.getElementById("job-title-input").value = job.title || "";
    document.getElementById("job-dept-input").value = job.department || "Engineering";
    document.getElementById("job-location-input").value = job.location || "";
    document.getElementById("job-workmode-input").value = job.workMode || "Remote";
    document.getElementById("job-type-input").value = job.type || "Full-Time";
    document.getElementById("job-exp-input").value = job.experienceLevel || "Mid-Level";
    document.getElementById("job-sal-min-input").value = job.salaryMin || "";
    document.getElementById("job-sal-max-input").value = job.salaryMax || "";
    document.getElementById("job-currency-input").value = job.currency || "USD";
    document.getElementById("job-deadline-input").value = job.deadline || "";
    document.getElementById("job-featured-input").checked = Boolean(job.featured);
    document.getElementById("job-desc-input").value = job.description || "";
    document.getElementById("job-resp-input").value = (job.responsibilities || []).join("\n");
    document.getElementById("job-req-input").value = (job.requirements || []).join("\n");
    document.getElementById("job-benefits-input").value = (job.benefits || []).join("\n");

    App.openModal("post-job-modal");
  }

  function handleJobFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("job-title-input").value.trim();
    const department = document.getElementById("job-dept-input").value;
    const location = document.getElementById("job-location-input").value.trim();
    const workMode = document.getElementById("job-workmode-input").value;
    const type = document.getElementById("job-type-input").value;
    const experienceLevel = document.getElementById("job-exp-input").value;
    const salaryMin = document.getElementById("job-sal-min-input").value;
    const salaryMax = document.getElementById("job-sal-max-input").value;
    const currency = document.getElementById("job-currency-input").value;
    const deadline = document.getElementById("job-deadline-input").value;
    const featured = document.getElementById("job-featured-input").checked;
    const description = document.getElementById("job-desc-input").value.trim();
    const responsibilities = document.getElementById("job-resp-input").value.trim().split("\n").filter(Boolean);
    const requirements = document.getElementById("job-req-input").value.trim().split("\n").filter(Boolean);
    const benefits = document.getElementById("job-benefits-input").value.trim().split("\n").filter(Boolean);

    if (!title || !department || !location) {
      App.showToast("Please fill in Job Title, Department, and Location.", "error");
      return;
    }

    const payload = {
      title,
      department,
      location,
      workMode,
      type,
      experienceLevel,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      currency,
      deadline,
      featured,
      description,
      responsibilities,
      requirements,
      benefits
    };

    if (editingJobId) {
      Store.updateJob(editingJobId, payload);
      App.showToast(`Job opening updated successfully!`, "success");
    } else {
      const created = Store.createJob(payload);
      App.showToast(`New job "${created.title}" published!`, "success");
    }

    App.closeModal("post-job-modal");
    renderJobsTable();
    renderStats();
    renderPipeline();
  }

  // --- APPLICANT PIPELINE (ATS) ---
  function renderPipeline() {
    const apps = Store.getApplications(applicantFilters);

    if (pipelineViewMode === "kanban") {
      renderKanban(apps);
    } else {
      renderApplicantTable(apps);
    }
  }

  function renderKanban(apps) {
    const stages = [
      { key: "Applied", label: "New Applied", color: "#64748b" },
      { key: "Reviewing", label: "Under Review", color: "#0ea5e9" },
      { key: "Shortlisted", label: "Shortlisted", color: "#3b82f6" },
      { key: "Interview Scheduled", label: "Interview", color: "#8b5cf6" },
      { key: "Offer Made", label: "Offer / Hired", color: "#10b981", includeHired: true },
      { key: "Rejected", label: "Archived / Rejected", color: "#ef4444" }
    ];

    const kanbanBoard = document.getElementById("kanban-board-inner");
    if (!kanbanBoard) return;

    kanbanBoard.innerHTML = stages.map(st => {
      let stageApps = [];
      if (st.includeHired) {
        stageApps = apps.filter(a => a.status === "Offer Made" || a.status === "Hired");
      } else {
        stageApps = apps.filter(a => a.status === st.key);
      }

      return `
        <div class="kanban-col" data-stage="${st.key}">
          <div class="kanban-col-header" style="border-bottom-color: ${st.color};">
            <span class="kanban-col-title">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${st.color};"></span>
              ${st.label}
            </span>
            <span class="kanban-col-count">${stageApps.length}</span>
          </div>

          <div class="kanban-cards-list">
            ${stageApps.length === 0 ? `
              <div style="font-size: 0.8rem; color: var(--slate-400); text-align: center; padding: 1.5rem 0.5rem;">
                No candidates in this stage
              </div>
            ` : stageApps.map(app => `
              <div class="kanban-card" onclick="AdminPortal.openCandidateModal('${app.id}')">
                <div class="kanban-card-title">${escapeHtml(app.fullName)}</div>
                <div class="kanban-card-job">${escapeHtml(app.jobTitle)}</div>
                <div style="font-size: 0.75rem; color: var(--slate-500); margin-bottom: 0.4rem;">
                  ${app.experienceYears} yrs exp • ${escapeHtml(app.location || 'Remote')}
                </div>
                <div class="kanban-card-meta">
                  <div class="kanban-card-rating">
                    ${'★'.repeat(app.rating || 0)}${'☆'.repeat(5 - (app.rating || 0))}
                  </div>
                  <span>${formatShortDate(app.appliedDate)}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderApplicantTable(apps) {
    const tbody = document.getElementById("admin-apps-tbody");
    if (!tbody) return;

    if (apps.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--slate-400);">
            No candidate applications matching criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = apps.map(app => {
      let badgeClass = "badge-applied";
      if (app.status === "Reviewing") badgeClass = "badge-reviewing";
      if (app.status === "Shortlisted") badgeClass = "badge-shortlisted";
      if (app.status === "Interview Scheduled") badgeClass = "badge-interview";
      if (app.status === "Offer Made") badgeClass = "badge-offer";
      if (app.status === "Hired") badgeClass = "badge-hired";
      if (app.status === "Rejected") badgeClass = "badge-rejected";

      return `
        <tr>
          <td>
            <div class="cell-primary">${escapeHtml(app.fullName)}</div>
            <div class="cell-sub">${escapeHtml(app.email)} • ${escapeHtml(app.phone || 'No phone')}</div>
          </td>
          <td>
            <div class="cell-primary">${escapeHtml(app.jobTitle)}</div>
            <div class="cell-sub">Ref: ${app.trackingCode}</div>
          </td>
          <td>
            <span class="badge ${badgeClass}">
              <span class="badge-dot"></span>
              ${app.status}
            </span>
          </td>
          <td>
            <div style="color: #f59e0b; font-size: 0.9rem;">
              ${'★'.repeat(app.rating || 0)}${'☆'.repeat(5 - (app.rating || 0))}
            </div>
          </td>
          <td>${formatShortDate(app.appliedDate)}</td>
          <td style="text-align: right;">
            <button class="btn btn-secondary btn-sm" onclick="AdminPortal.openCandidateModal('${app.id}')">
              Review Candidate
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- CANDIDATE EVALUATION MODAL ---
  function openCandidateModal(appId) {
    activeApplicantId = appId;
    renderCandidateModal(appId);
    App.openModal("candidate-eval-modal");
  }

  function renderCandidateModal(appId) {
    const app = Store.getApplicationById(appId);
    if (!app) return;

    document.getElementById("cand-modal-name").textContent = app.fullName;
    document.getElementById("cand-modal-job").textContent = `Applied for: ${app.jobTitle} (Ref: ${app.trackingCode})`;

    // Status selector
    const statusSelect = document.getElementById("cand-modal-status-select");
    if (statusSelect) {
      statusSelect.value = app.status;
    }

    // Rating stars widget
    renderRatingWidget(app.rating || 0);

    // Profile details
    const profileContainer = document.getElementById("cand-modal-profile");
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Email</span>
            <div style="font-weight: 600; color: var(--slate-900);">${escapeHtml(app.email)}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Phone</span>
            <div style="font-weight: 600; color: var(--slate-900);">${escapeHtml(app.phone || 'N/A')}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Location</span>
            <div style="font-weight: 600; color: var(--slate-900);">${escapeHtml(app.location || 'Remote / Unspecified')}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Current Role</span>
            <div style="font-weight: 600; color: var(--slate-900);">${escapeHtml(app.currentTitle || 'N/A')}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Experience</span>
            <div style="font-weight: 600; color: var(--slate-900);">${app.experienceYears} Years</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Expected Salary</span>
            <div style="font-weight: 600; color: #047857;">${escapeHtml(app.expectedSalary || 'Negotiable')}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Availability</span>
            <div style="font-weight: 600; color: var(--slate-900);">${escapeHtml(app.earliestStartDate || 'Immediate')}</div>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--slate-500); text-transform: uppercase;">Applied Date</span>
            <div style="font-weight: 600; color: var(--slate-900);">${formatShortDate(app.appliedDate)}</div>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem;">
          ${app.portfolioUrl ? `
            <a href="${escapeHtml(app.portfolioUrl)}" target="_blank" class="btn btn-secondary btn-sm" style="flex: 1;">
              🌐 View Portfolio / Website
            </a>
          ` : ''}
          ${app.linkedinUrl ? `
            <a href="${escapeHtml(app.linkedinUrl)}" target="_blank" class="btn btn-secondary btn-sm" style="flex: 1;">
              🔗 LinkedIn Profile
            </a>
          ` : ''}
        </div>

        <div class="detail-section">
          <h4>Candidate Resume Document</h4>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.25rem; background: var(--primary-50); border: 1px solid var(--primary-200); border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--primary-600);"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <div>
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--slate-900);">${escapeHtml(app.resumeFileName || 'Resume.pdf')}</div>
                <div style="font-size: 0.75rem; color: var(--slate-500);">${escapeHtml(app.resumeFileSize || '150 KB')} • Attached with application</div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="App.showToast('Simulated: Resume preview loaded in document reader.', 'info')">
              Preview Resume
            </button>
          </div>
        </div>

        <div class="detail-section">
          <h4>Candidate Cover Letter</h4>
          <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--slate-700);">
            ${escapeHtml(app.coverLetter || "No cover letter was submitted with this application.")}
          </div>
        </div>
      `;
    }

    // Render Recruiter Notes
    const notesContainer = document.getElementById("cand-modal-notes-list");
    if (notesContainer) {
      if (!app.notes || app.notes.length === 0) {
        notesContainer.innerHTML = `<div style="font-size: 0.85rem; color: var(--slate-400); text-align: center; padding: 1rem;">No recruiter notes added yet. Use the field below to log candidate feedback.</div>`;
      } else {
        notesContainer.innerHTML = app.notes.map(n => `
          <div class="note-bubble">
            <div class="note-bubble-header">
              <strong>${escapeHtml(n.author || 'Recruiter')}</strong>
              <span>${formatShortDate(n.date)}</span>
            </div>
            <div class="note-bubble-text">${escapeHtml(n.text)}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderRatingWidget(currentRating) {
    const starContainer = document.getElementById("cand-rating-stars");
    if (!starContainer) return;

    starContainer.innerHTML = [1, 2, 3, 4, 5].map(star => `
      <span style="cursor: pointer; font-size: 1.4rem; color: ${star <= currentRating ? '#f59e0b' : '#cbd5e1'}; transition: color 0.15s;" 
            onclick="AdminPortal.setCandidateRating(${star})" 
            title="Rate ${star} star${star > 1 ? 's' : ''}">★</span>
    `).join("");
  }

  function setCandidateRating(stars) {
    if (!activeApplicantId) return;
    Store.updateApplicationStatus(activeApplicantId, null, null, stars);
    renderRatingWidget(stars);
    renderPipeline();
    App.showToast(`Candidate rating set to ${stars} star${stars > 1 ? 's' : ''}`, "info");
  }

  // Quick Action in Candidate Modal
  function quickAdvanceStage(newStage) {
    if (!activeApplicantId) return;
    Store.updateApplicationStatus(activeApplicantId, newStage, `Advanced candidate stage to ${newStage}`);
    renderCandidateModal(activeApplicantId);
    renderPipeline();
    renderStats();
    App.showToast(`Candidate advanced to ${newStage}`, "success");
  }

  // Helpers
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatShortDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return dateStr;
    }
  }

  return {
    init,
    renderStats,
    renderJobsTable,
    renderPipeline,
    openPostJobModal,
    openEditJobModal,
    deleteJob,
    toggleJobStatus,
    filterApplicantsByJob,
    openCandidateModal,
    setCandidateRating,
    quickAdvanceStage
  };
})();

