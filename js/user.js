// Candidate / Normal User Portal Logic

const UserPortal = (function() {
  let activeFilters = {
    search: "",
    department: "all",
    workMode: "all",
    type: "all",
    experienceLevel: "all"
  };

  let selectedJob = null;
  let uploadedResumeFile = null;

  function init() {
    setupEventListeners();
    renderJobList();
    renderMyApplications();
  }

  function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById("user-job-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        activeFilters.search = e.target.value;
        renderJobList();
      });
    }

    // Filter dropdowns
    const deptFilter = document.getElementById("filter-department");
    if (deptFilter) {
      deptFilter.addEventListener("change", (e) => {
        activeFilters.department = e.target.value;
        renderJobList();
      });
    }

    const workModeFilter = document.getElementById("filter-workmode");
    if (workModeFilter) {
      workModeFilter.addEventListener("change", (e) => {
        activeFilters.workMode = e.target.value;
        renderJobList();
      });
    }

    const typeFilter = document.getElementById("filter-type");
    if (typeFilter) {
      typeFilter.addEventListener("change", (e) => {
        activeFilters.type = e.target.value;
        renderJobList();
      });
    }

    const expFilter = document.getElementById("filter-experience");
    if (expFilter) {
      expFilter.addEventListener("change", (e) => {
        activeFilters.experienceLevel = e.target.value;
        renderJobList();
      });
    }

    // Clear filters button
    const clearBtn = document.getElementById("clear-filters-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        activeFilters = { search: "", department: "all", workMode: "all", type: "all", experienceLevel: "all" };
        if (searchInput) searchInput.value = "";
        if (deptFilter) deptFilter.value = "all";
        if (workModeFilter) workModeFilter.value = "all";
        if (typeFilter) typeFilter.value = "all";
        if (expFilter) expFilter.value = "all";
        renderJobList();
      });
    }

    // Apply Form Submission
    const applyForm = document.getElementById("job-apply-form");
    if (applyForm) {
      applyForm.addEventListener("submit", handleApplicationSubmit);
    }

    // Resume Dropzone
    const dropzone = document.getElementById("resume-dropzone");
    const fileInput = document.getElementById("resume-file-input");
    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());
      
      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileSelect(e.target.files[0]);
        }
      });

      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileSelect(e.dataTransfer.files[0]);
        }
      });
    }

    // My Applications Email Filter
    const myAppEmailInput = document.getElementById("my-app-email-input");
    const myAppEmailBtn = document.getElementById("my-app-lookup-btn");
    if (myAppEmailBtn && myAppEmailInput) {
      myAppEmailBtn.addEventListener("click", () => {
        const email = myAppEmailInput.value.trim();
        if (email) {
          Store.setActiveUserEmail(email);
          renderMyApplications();
        }
      });
    }
  }

  function handleFileSelect(file) {
    uploadedResumeFile = file;
    const previewContainer = document.getElementById("resume-preview-container");
    const fileNameEl = document.getElementById("resume-filename-text");
    const fileSizeEl = document.getElementById("resume-filesize-text");
    
    if (previewContainer && fileNameEl && fileSizeEl) {
      fileNameEl.textContent = file.name;
      const sizeKb = (file.size / 1024).toFixed(1);
      fileSizeEl.textContent = sizeKb > 1024 ? (sizeKb / 1024).toFixed(2) + " MB" : sizeKb + " KB";
      previewContainer.style.display = "flex";
    }
  }

  function renderJobList() {
    const grid = document.getElementById("user-job-grid");
    const countEl = document.getElementById("jobs-count-badge");
    if (!grid) return;

    // Show only Active jobs for candidates
    const allMatching = Store.getJobs({ ...activeFilters, status: "Active" });

    if (countEl) {
      countEl.textContent = `${allMatching.length} Position${allMatching.length === 1 ? "" : "s"} Available`;
    }

    if (allMatching.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h3>No Open Positions Found</h3>
          <p>We couldn't find any job openings matching your search criteria. Try clearing some filters or searching for other keywords.</p>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('clear-filters-btn').click()">Reset Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = allMatching.map(job => {
      const salaryDisplay = (job.salaryMin && job.salaryMax) 
        ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}/yr`
        : "Competitive Compensation";

      return `
        <div class="job-card ${job.featured ? 'featured' : ''}" data-job-id="${job.id}">
          <div class="job-card-header">
            <div>
              <h3 class="job-card-title">${escapeHtml(job.title)}</h3>
              <div style="font-size: 0.8rem; color: var(--slate-500); margin-top: 2px;">
                ${escapeHtml(job.location)}
              </div>
            </div>
            <span class="job-badge-department">${escapeHtml(job.department)}</span>
          </div>

          <div class="job-card-tags">
            <span class="tag-badge">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              ${escapeHtml(job.type)}
            </span>
            <span class="tag-badge">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              ${escapeHtml(job.workMode)}
            </span>
            <span class="tag-badge">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              ${escapeHtml(job.experienceLevel)}
            </span>
            <span class="tag-badge salary">
              ${escapeHtml(salaryDisplay)}
            </span>
          </div>

          <p class="job-card-description">${escapeHtml(job.description || "Exciting opportunity to join our rapidly growing organization and make an impact.")}</p>

          <div class="job-card-footer">
            <span class="job-posted-time">Posted ${formatRelativeDate(job.postedDate)}</span>
            <div class="job-card-actions">
              <button class="btn btn-secondary btn-sm" onclick="UserPortal.openJobDetails('${job.id}')">
                Details
              </button>
              <button class="btn btn-primary btn-sm" onclick="UserPortal.openApplyModal('${job.id}')">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function openJobDetails(jobId) {
    const job = Store.getJobById(jobId);
    if (!job) return;
    selectedJob = job;

    const modalTitle = document.getElementById("detail-modal-title");
    const modalContent = document.getElementById("detail-modal-body");
    const modalApplyBtn = document.getElementById("detail-modal-apply-btn");

    if (modalTitle) modalTitle.textContent = job.title;
    if (modalApplyBtn) {
      modalApplyBtn.onclick = () => {
        App.closeModal("job-details-modal");
        openApplyModal(job.id);
      };
    }

    const salaryDisplay = (job.salaryMin && job.salaryMax) 
      ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.currency}`
      : "Competitive Compensation";

    if (modalContent) {
      modalContent.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
          <span class="job-badge-department">${escapeHtml(job.department)}</span>
          <span class="tag-badge">${escapeHtml(job.location)}</span>
          <span class="tag-badge">${escapeHtml(job.workMode)}</span>
          <span class="tag-badge">${escapeHtml(job.type)}</span>
          <span class="tag-badge">${escapeHtml(job.experienceLevel)}</span>
          <span class="tag-badge salary">${escapeHtml(salaryDisplay)}</span>
        </div>

        <div class="detail-section">
          <h4>Overview</h4>
          <p style="font-size: 0.95rem; color: var(--slate-700); line-height: 1.6;">${escapeHtml(job.description)}</p>
        </div>

        ${job.responsibilities && job.responsibilities.length ? `
          <div class="detail-section">
            <h4>Key Responsibilities</h4>
            <ul class="detail-list">
              ${job.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
            </ul>
          </div>
        ` : ''}

        ${job.requirements && job.requirements.length ? `
          <div class="detail-section">
            <h4>Requirements & Qualifications</h4>
            <ul class="detail-list">
              ${job.requirements.map(req => `<li>${escapeHtml(req)}</li>`).join("")}
            </ul>
          </div>
        ` : ''}

        ${job.benefits && job.benefits.length ? `
          <div class="detail-section">
            <h4>Perks & Benefits</h4>
            <ul class="detail-list">
              ${job.benefits.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
          </div>
        ` : ''}

        <div style="background: var(--primary-50); border: 1px solid var(--primary-200); border-radius: var(--radius-md); padding: 1rem; margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.8rem; color: var(--slate-500);">Application Deadline</div>
            <div style="font-weight: 700; color: var(--primary-800);">${job.deadline ? formatDate(job.deadline) : "Open until filled"}</div>
          </div>
          <button class="btn btn-primary" onclick="App.closeModal('job-details-modal'); UserPortal.openApplyModal('${job.id}')">
            Apply For This Position
          </button>
        </div>
      `;
    }

    App.openModal("job-details-modal");
  }

  function openApplyModal(jobId) {
    const job = Store.getJobById(jobId);
    if (!job) return;
    selectedJob = job;

    const modalJobTitle = document.getElementById("apply-modal-job-title");
    const jobIdHidden = document.getElementById("apply-job-id-input");
    
    if (modalJobTitle) modalJobTitle.textContent = `Applying for: ${job.title} (${job.department})`;
    if (jobIdHidden) jobIdHidden.value = job.id;

    // Reset uploaded file preview
    uploadedResumeFile = null;
    const previewContainer = document.getElementById("resume-preview-container");
    if (previewContainer) previewContainer.style.display = "none";

    // Auto-fill active user email if previously entered
    const activeEmail = Store.getActiveUserEmail();
    const emailInput = document.getElementById("apply-email-input");
    if (emailInput && activeEmail && !emailInput.value) {
      emailInput.value = activeEmail;
    }

    App.openModal("job-apply-modal");
  }

  function handleApplicationSubmit(e) {
    e.preventDefault();
    if (!selectedJob) return;

    const fullName = document.getElementById("apply-fullname-input").value.trim();
    const email = document.getElementById("apply-email-input").value.trim();
    const phone = document.getElementById("apply-phone-input").value.trim();
    const location = document.getElementById("apply-location-input").value.trim();
    const currentTitle = document.getElementById("apply-title-input").value.trim();
    const experienceYears = document.getElementById("apply-experience-input").value.trim();
    const portfolioUrl = document.getElementById("apply-portfolio-input").value.trim();
    const linkedinUrl = document.getElementById("apply-linkedin-input").value.trim();
    const expectedSalary = document.getElementById("apply-salary-input").value.trim();
    const earliestStartDate = document.getElementById("apply-startdate-input").value.trim();
    const coverLetter = document.getElementById("apply-coverletter-input").value.trim();

    if (!fullName || !email) {
      App.showToast("Please enter your name and email address.", "error");
      return;
    }

    const resumeFileName = uploadedResumeFile ? uploadedResumeFile.name : `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    const resumeFileSize = uploadedResumeFile 
      ? ((uploadedResumeFile.size / 1024).toFixed(1) + " KB")
      : "185 KB";

    const newApp = Store.createApplication({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      fullName: fullName,
      email: email,
      phone: phone,
      location: location,
      currentTitle: currentTitle,
      experienceYears: experienceYears,
      portfolioUrl: portfolioUrl,
      linkedinUrl: linkedinUrl,
      expectedSalary: expectedSalary,
      earliestStartDate: earliestStartDate,
      coverLetter: coverLetter,
      resumeFileName: resumeFileName,
      resumeFileSize: resumeFileSize
    });

    // Reset form
    e.target.reset();
    uploadedResumeFile = null;
    const preview = document.getElementById("resume-preview-container");
    if (preview) preview.style.display = "none";

    App.closeModal("job-apply-modal");
    App.showToast(`Application submitted successfully! Tracking Ref: ${newApp.trackingCode}`, "success");

    // Re-render "My Applications" tab
    renderMyApplications();

    // Show confirmation modal with tracking ref
    showApplicationConfirmation(newApp, selectedJob);
  }

  function showApplicationConfirmation(application, job) {
    const refEl = document.getElementById("conf-tracking-code");
    const jobEl = document.getElementById("conf-job-title");
    const emailEl = document.getElementById("conf-candidate-email");

    if (refEl) refEl.textContent = application.trackingCode;
    if (jobEl) jobEl.textContent = job.title;
    if (emailEl) emailEl.textContent = application.email;

    App.openModal("application-success-modal");
  }

  function renderMyApplications() {
    const container = document.getElementById("my-applications-list");
    const emailInput = document.getElementById("my-app-email-input");
    const badgeEl = document.getElementById("my-apps-badge-count");
    if (!container) return;

    const activeEmail = Store.getActiveUserEmail();
    if (emailInput && activeEmail) {
      emailInput.value = activeEmail;
    }

    const userApps = Store.getMyApplications(activeEmail);

    if (badgeEl) {
      badgeEl.textContent = userApps.length;
    }

    if (!activeEmail) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
            </svg>
          </div>
          <h3>Track Your Job Applications</h3>
          <p>Enter the email address you used when applying to view your real-time status and hiring timeline.</p>
        </div>
      `;
      return;
    }

    if (userApps.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3>No Applications Found for "${escapeHtml(activeEmail)}"</h3>
          <p>Browse our active openings and submit your first application to track your progress right here!</p>
          <button class="btn btn-primary" onclick="App.switchUserView('browse')">Browse Open Jobs</button>
        </div>
      `;
      return;
    }

    const stagesOrder = ["Applied", "Reviewing", "Shortlisted", "Interview Scheduled", "Offer Made", "Hired"];

    container.innerHTML = userApps.map(app => {
      const currentIdx = stagesOrder.indexOf(app.status);
      const isRejected = app.status === "Rejected";

      let statusBadgeClass = "badge-applied";
      if (app.status === "Reviewing") statusBadgeClass = "badge-reviewing";
      if (app.status === "Shortlisted") statusBadgeClass = "badge-shortlisted";
      if (app.status === "Interview Scheduled") statusBadgeClass = "badge-interview";
      if (app.status === "Offer Made") statusBadgeClass = "badge-offer";
      if (app.status === "Hired") statusBadgeClass = "badge-hired";
      if (app.status === "Rejected") statusBadgeClass = "badge-rejected";

      return `
        <div class="job-card" style="margin-bottom: 1.5rem;">
          <div class="job-card-header">
            <div>
              <div style="font-size: 0.8rem; color: var(--primary-600); font-weight: 700; margin-bottom: 2px;">
                Tracking ID: ${app.trackingCode || app.id}
              </div>
              <h3 class="job-card-title">${escapeHtml(app.jobTitle)}</h3>
              <div style="font-size: 0.825rem; color: var(--slate-500); margin-top: 4px;">
                Submitted on ${formatDate(app.appliedDate)} • Expected: ${escapeHtml(app.expectedSalary || "Flexible")}
              </div>
            </div>
            <span class="badge ${statusBadgeClass}">
              <span class="badge-dot"></span>
              ${escapeHtml(app.status)}
            </span>
          </div>

          <!-- Application Progress Timeline -->
          <div class="application-progress-steps">
            ${stagesOrder.map((stage, idx) => {
              let stepClass = "";
              if (!isRejected) {
                if (idx < currentIdx) stepClass = "completed";
                else if (idx === currentIdx) stepClass = "current";
              }
              return `
                <div class="progress-step-item ${stepClass}">
                  <div class="progress-step-circle">
                    ${idx < currentIdx && !isRejected ? "✓" : (idx + 1)}
                  </div>
                  <div class="progress-step-label">${escapeHtml(stage)}</div>
                </div>
              `;
            }).join("")}
          </div>

          ${isRejected ? `
            <div style="background: var(--danger-light); border: 1px solid var(--danger-border); border-radius: var(--radius-md); padding: 0.85rem 1rem; color: var(--danger); font-size: 0.85rem; margin-top: 0.5rem;">
              <strong>Application Status:</strong> Thank you for your interest. While we were impressed with your qualifications, we have decided to move forward with other candidates whose experience more closely matches our current needs.
            </div>
          ` : ''}

          ${app.status === "Interview Scheduled" ? `
            <div style="background: var(--purple-light); border: 1px solid #ddd6fe; border-radius: var(--radius-md); padding: 0.85rem 1rem; color: #5b21b6; font-size: 0.85rem; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <div><strong>Interview Stage Active:</strong> Our recruiting team has scheduled your interview round. Check your email (${escapeHtml(app.email)}) for calendar details and meeting links.</div>
            </div>
          ` : ''}

          <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--slate-500); padding-top: 0.75rem; border-top: 1px solid var(--slate-100);">
            <span>Attached Resume: <strong>${escapeHtml(app.resumeFileName || 'Resume.pdf')}</strong></span>
            <button class="btn btn-outline btn-sm" onclick="UserPortal.viewMyApplicationDetail('${app.id}')">
              View Application Details
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  function viewMyApplicationDetail(appId) {
    const app = Store.getApplicationById(appId);
    if (!app) return;

    const modalTitle = document.getElementById("detail-modal-title");
    const modalContent = document.getElementById("detail-modal-body");
    const modalApplyBtn = document.getElementById("detail-modal-apply-btn");

    if (modalTitle) modalTitle.textContent = `Application: ${app.jobTitle}`;
    if (modalApplyBtn) modalApplyBtn.style.display = "none";

    if (modalContent) {
      modalContent.innerHTML = `
        <div style="background: var(--primary-50); border: 1px solid var(--primary-200); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.8rem; color: var(--primary-700); font-weight: 700;">Tracking Code: ${app.trackingCode}</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--slate-900); margin-top: 0.2rem;">${escapeHtml(app.fullName)}</div>
          <div style="font-size: 0.85rem; color: var(--slate-600);">${escapeHtml(app.email)} • ${escapeHtml(app.phone || 'No phone')} • ${escapeHtml(app.location || 'Location not specified')}</div>
        </div>

        <div class="detail-section">
          <h4>Candidate Information</h4>
          <p><strong>Current Title:</strong> ${escapeHtml(app.currentTitle || 'Not specified')}</p>
          <p><strong>Experience:</strong> ${app.experienceYears} Years</p>
          <p><strong>Expected Compensation:</strong> ${escapeHtml(app.expectedSalary || 'Negotiable')}</p>
          <p><strong>Earliest Start Date:</strong> ${escapeHtml(app.earliestStartDate || 'Flexible')}</p>
          ${app.portfolioUrl ? `<p><strong>Portfolio:</strong> <a href="${escapeHtml(app.portfolioUrl)}" target="_blank">${escapeHtml(app.portfolioUrl)}</a></p>` : ''}
          ${app.linkedinUrl ? `<p><strong>LinkedIn:</strong> <a href="${escapeHtml(app.linkedinUrl)}" target="_blank">${escapeHtml(app.linkedinUrl)}</a></p>` : ''}
        </div>

        <div class="detail-section">
          <h4>Cover Letter / Personal Statement</h4>
          <div style="background: var(--slate-50); padding: 1rem; border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.6; color: var(--slate-700);">
            ${escapeHtml(app.coverLetter || "No cover letter provided.")}
          </div>
        </div>

        <div class="detail-section">
          <h4>Uploaded Resume</h4>
          <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: #ffffff; border: 1px solid var(--primary-200); border-radius: var(--radius-md);">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--primary-500);"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <div>
              <div style="font-weight: 600; font-size: 0.85rem;">${escapeHtml(app.resumeFileName || 'Resume.pdf')}</div>
              <div style="font-size: 0.75rem; color: var(--slate-400);">${escapeHtml(app.resumeFileSize || '150 KB')}</div>
            </div>
          </div>
        </div>
      `;
    }

    App.openModal("job-details-modal");
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

  function formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  }

  function formatRelativeDate(dateStr) {
    if (!dateStr) return "recently";
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return dateStr;
    }
  }

  return {
    init,
    renderJobList,
    renderMyApplications,
    openJobDetails,
    openApplyModal,
    viewMyApplicationDetail
  };
})();

