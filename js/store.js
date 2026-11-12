// Central Data Store for Job Tracking Application
// Utilizes localStorage with fallback memory storage

const Store = (function() {
  const STORAGE_KEYS = {
    JOBS: "jobtrack_jobs_v1",
    APPLICATIONS: "jobtrack_apps_v1",
    USER_EMAIL: "jobtrack_active_user_email"
  };

  const listeners = [];

  function notify() {
    listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error("Store listener error:", e); }
    });
  }

  function load(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.warn("Could not read from localStorage, using default", e);
      return defaultVal;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Could not write to localStorage", e);
    }
  }

  // Initialize data if not yet present
  function init() {
    const existingJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!existingJobs) {
      save(STORAGE_KEYS.JOBS, SEED_JOBS);
    }
    const existingApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!existingApps) {
      save(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    }
  }

  // Initialize immediately
  init();

  return {
    subscribe(fn) {
      listeners.push(fn);
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },

    // --- JOBS API ---
    getJobs(filters = {}) {
      let jobs = load(STORAGE_KEYS.JOBS, SEED_JOBS);

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        jobs = jobs.filter(j => 
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          (j.description && j.description.toLowerCase().includes(q))
        );
      }

      if (filters.department && filters.department !== "all") {
        jobs = jobs.filter(j => j.department === filters.department);
      }

      if (filters.workMode && filters.workMode !== "all") {
        jobs = jobs.filter(j => j.workMode === filters.workMode);
      }

      if (filters.type && filters.type !== "all") {
        jobs = jobs.filter(j => j.type === filters.type);
      }

      if (filters.experienceLevel && filters.experienceLevel !== "all") {
        jobs = jobs.filter(j => j.experienceLevel === filters.experienceLevel);
      }

      if (filters.status && filters.status !== "all") {
        jobs = jobs.filter(j => j.status === filters.status);
      }

      return jobs;
    },

    getJobById(id) {
      const jobs = load(STORAGE_KEYS.JOBS, SEED_JOBS);
      return jobs.find(j => j.id === id) || null;
    },

    createJob(jobData) {
      const jobs = load(STORAGE_KEYS.JOBS, SEED_JOBS);
      const newJob = {
        id: "job-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        title: jobData.title || "Untitled Position",
        department: jobData.department || "General",
        location: jobData.location || "Remote",
        workMode: jobData.workMode || "Remote",
        type: jobData.type || "Full-Time",
        experienceLevel: jobData.experienceLevel || "Mid-Level",
        salaryMin: Number(jobData.salaryMin) || 0,
        salaryMax: Number(jobData.salaryMax) || 0,
        currency: jobData.currency || "USD",
        postedDate: new Date().toISOString().split("T")[0],
        deadline: jobData.deadline || "",
        status: "Active",
        featured: Boolean(jobData.featured),
        description: jobData.description || "",
        responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : (jobData.responsibilities ? jobData.responsibilities.split("\n").filter(Boolean) : []),
        requirements: Array.isArray(jobData.requirements) ? jobData.requirements : (jobData.requirements ? jobData.requirements.split("\n").filter(Boolean) : []),
        benefits: Array.isArray(jobData.benefits) ? jobData.benefits : (jobData.benefits ? jobData.benefits.split("\n").filter(Boolean) : [])
      };

      jobs.unshift(newJob);
      save(STORAGE_KEYS.JOBS, jobs);
      notify();
      return newJob;
    },

    updateJob(id, updates) {
      const jobs = load(STORAGE_KEYS.JOBS, SEED_JOBS);
      const index = jobs.findIndex(j => j.id === id);
      if (index === -1) return null;

      jobs[index] = {
        ...jobs[index],
        ...updates
      };

      save(STORAGE_KEYS.JOBS, jobs);
      notify();
      return jobs[index];
    },

    toggleJobStatus(id) {
      const jobs = load(STORAGE_KEYS.JOBS, SEED_JOBS);
      const job = jobs.find(j => j.id === id);
      if (job) {
        job.status = job.status === "Active" ? "Closed" : "Active";
        save(STORAGE_KEYS.JOBS, jobs);
        notify();
        return job;
      }
      return null;
    },

    deleteJob(id) {
      let jobs = load(STORAGE_KEYS.JOBS, SEED_JOBS);
      jobs = jobs.filter(j => j.id !== id);
      save(STORAGE_KEYS.JOBS, jobs);
      notify();
      return true;
    },

    // --- APPLICATIONS API ---
    getApplications(filters = {}) {
      let apps = load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);

      if (filters.jobId && filters.jobId !== "all") {
        apps = apps.filter(a => a.jobId === filters.jobId);
      }

      if (filters.status && filters.status !== "all") {
        apps = apps.filter(a => a.status === filters.status);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        apps = apps.filter(a => 
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.jobTitle.toLowerCase().includes(q) ||
          (a.location && a.location.toLowerCase().includes(q))
        );
      }

      return apps;
    },

    getApplicationById(id) {
      const apps = load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
      return apps.find(a => a.id === id) || null;
    },

    createApplication(data) {
      const apps = load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
      const trackingCode = "TRK-" + Math.floor(100000 + Math.random() * 900000);
      
      const newApp = {
        id: "app-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
        trackingCode: trackingCode,
        jobId: data.jobId,
        jobTitle: data.jobTitle || "Job Application",
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        location: data.location || "",
        currentTitle: data.currentTitle || "",
        experienceYears: Number(data.experienceYears) || 0,
        portfolioUrl: data.portfolioUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        expectedSalary: data.expectedSalary || "",
        earliestStartDate: data.earliestStartDate || "Flexible",
        appliedDate: new Date().toISOString(),
        status: "Applied",
        rating: 0,
        coverLetter: data.coverLetter || "",
        resumeFileName: data.resumeFileName || "Applicant_Resume.pdf",
        resumeFileSize: data.resumeFileSize || "150 KB",
        notes: []
      };

      apps.unshift(newApp);
      save(STORAGE_KEYS.APPLICATIONS, apps);

      // Save user email to remember active applicant
      if (data.email) {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.email);
      }

      notify();
      return newApp;
    },

    updateApplicationStatus(id, newStatus, noteText = "", rating = null) {
      const apps = load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
      const app = apps.find(a => a.id === id);
      if (!app) return null;

      if (newStatus) {
        app.status = newStatus;
      }

      if (rating !== null && rating !== undefined) {
        app.rating = Number(rating);
      }

      if (noteText && noteText.trim()) {
        if (!app.notes) app.notes = [];
        app.notes.push({
          id: "note-" + Date.now(),
          author: "Admin / Hiring Manager",
          date: new Date().toISOString(),
          text: noteText.trim()
        });
      }

      save(STORAGE_KEYS.APPLICATIONS, apps);
      notify();
      return app;
    },

    deleteApplication(id) {
      let apps = load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
      apps = apps.filter(a => a.id !== id);
      save(STORAGE_KEYS.APPLICATIONS, apps);
      notify();
      return true;
    },

    getMyApplications(email = null) {
      const activeEmail = email || localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || "";
      const apps = load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
      if (!activeEmail) return [];
      return apps.filter(a => a.email.toLowerCase() === activeEmail.toLowerCase().trim());
    },

    getActiveUserEmail() {
      return localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || "";
    },

    setActiveUserEmail(email) {
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email.trim());
      notify();
    },

    // --- ANALYTICS / STATS ---
    getStats() {
      const jobs = load(STORAGE_KEYS.JOBS, SEED_JOBS);
      const apps = load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);

      const activeJobs = jobs.filter(j => j.status === "Active").length;
      const closedJobs = jobs.filter(j => j.status === "Closed").length;

      const stageCounts = {
        "Applied": 0,
        "Reviewing": 0,
        "Shortlisted": 0,
        "Interview Scheduled": 0,
        "Offer Made": 0,
        "Hired": 0,
        "Rejected": 0
      };

      apps.forEach(a => {
        if (stageCounts[a.status] !== undefined) {
          stageCounts[a.status]++;
        } else {
          stageCounts["Applied"]++;
        }
      });

      return {
        totalJobs: jobs.length,
        activeJobs: activeJobs,
        closedJobs: closedJobs,
        totalApplications: apps.length,
        stageCounts: stageCounts
      };
    },

    // Reset data
    resetToDefaults() {
      save(STORAGE_KEYS.JOBS, SEED_JOBS);
      save(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
      notify();
    },

    // Export & Import
    exportJSON() {
      const data = {
        jobs: load(STORAGE_KEYS.JOBS, SEED_JOBS),
        applications: load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS),
        exportedAt: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    },

    importJSON(jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.jobs && Array.isArray(parsed.jobs)) {
          save(STORAGE_KEYS.JOBS, parsed.jobs);
        }
        if (parsed.applications && Array.isArray(parsed.applications)) {
          save(STORAGE_KEYS.APPLICATIONS, parsed.applications);
        }
        notify();
        return true;
      } catch (e) {
        console.error("Failed to import JSON", e);
        return false;
      }
    }
  };
})();

