// Initial seed data for the Job Tracker Application
const SEED_JOBS = [
  {
    id: "job-101",
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    workMode: "Remote",
    type: "Full-Time",
    experienceLevel: "Senior",
    salaryMin: 95000,
    salaryMax: 135000,
    currency: "USD",
    postedDate: "2026-11-01",
    deadline: "2026-12-15",
    status: "Active", // "Active" | "Closed"
    featured: true,
    description: "We are seeking an experienced Senior Full Stack Engineer to lead our core product team. You will be designing scalable web architectures, crafting intuitive UI components, and optimizing backend systems.",
    responsibilities: [
      "Architect and build high-performance, fault-tolerant web applications.",
      "Collaborate cross-functionally with product designers and engineering leads.",
      "Mentor junior and mid-level developers through code reviews and pair programming.",
      "Lead technical design discussions and contribute to system architecture roadmaps."
    ],
    requirements: [
      "5+ years of software development experience with modern JavaScript/TypeScript frameworks.",
      "Deep understanding of RESTful and GraphQL APIs, microservices, and relational databases.",
      "Hands-on experience with cloud infrastructure (AWS/GCP, Docker, CI/CD pipelines).",
      "Demonstrated problem-solving abilities and clear technical communication."
    ],
    benefits: [
      "Competitive base salary + equity compensation package.",
      "100% remote flexibility with home office stipend.",
      "Comprehensive medical, dental, and vision insurance coverage.",
      "Generous learning and professional development budget ($2,500/yr)."
    ]
  },
  {
    id: "job-102",
    title: "Lead UI/UX Product Designer",
    department: "Design",
    location: "New York, NY (Hybrid)",
    workMode: "Hybrid",
    type: "Full-Time",
    experienceLevel: "Lead",
    salaryMin: 110000,
    salaryMax: 145000,
    currency: "USD",
    postedDate: "2026-11-04",
    deadline: "2026-12-05",
    status: "Active",
    featured: true,
    description: "Shape the visual and interactive future of our digital solutions. We are looking for a visionary Lead Product Designer who blends aesthetic excellence with user-centered thinking.",
    responsibilities: [
      "Drive product design strategy across mobile, desktop, and web platforms.",
      "Establish and evolve the unified design system and component libraries.",
      "Conduct user research, synthesize usability feedback, and prototype end-to-end user flows.",
      "Partner with engineering to ensure pixel-perfect design implementation."
    ],
    requirements: [
      "6+ years in digital product design, with a standout portfolio of shipped products.",
      "Mastery of Figma, design tokens, interactive prototyping, and design systems.",
      "Strong foundation in user research, wireframing, and accessibility standards (WCAG).",
      "Exceptional storytelling and stakeholder presentation skills."
    ],
    benefits: [
      "Top-tier compensation and annual performance bonuses.",
      "Flexible hybrid schedule (2 days in-office, 3 days remote).",
      "Wellness stipend, gym reimbursement, and mental health support.",
      "Latest Apple M-series hardware and dual 4K display workspace."
    ]
  },
  {
    id: "job-103",
    title: "Cloud DevOps & Platform Engineer",
    department: "Infrastructure",
    location: "Austin, TX (On-site)",
    workMode: "On-site",
    type: "Full-Time",
    experienceLevel: "Mid-Level",
    salaryMin: 85000,
    salaryMax: 115000,
    currency: "USD",
    postedDate: "2026-11-06",
    deadline: "2026-12-20",
    status: "Active",
    featured: false,
    description: "Join our site reliability and platform engineering team to build resilient, automated cloud infrastructure supporting millions of daily active transactions.",
    responsibilities: [
      "Maintain and enhance Kubernetes clusters, Terraform automation, and observability tools.",
      "Implement robust CI/CD deployment pipelines with zero-downtime releases.",
      "Monitor application performance, latency, and system security posture 24/7.",
      "Troubleshoot infrastructure incidents and conduct root-cause post-mortems."
    ],
    requirements: [
      "3+ years managing production Linux environments and cloud platforms (AWS or Azure).",
      "Proficiency with Docker, Kubernetes, Terraform, and Helm charts.",
      "Strong scripting abilities in Python, Bash, or Go.",
      "Understanding of security compliance, IAM policies, and VPC networking."
    ],
    benefits: [
      "Generous 401(k) matching up to 5%.",
      "Catered daily lunches and snacks at the Austin office.",
      "Annual conference attendance sponsorship.",
      "Flexible PTO policy."
    ]
  },
  {
    id: "job-104",
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "Remote (US / Canada)",
    workMode: "Remote",
    type: "Full-Time",
    experienceLevel: "Mid-Level",
    salaryMin: 75000,
    salaryMax: 100000,
    currency: "USD",
    postedDate: "2026-11-08",
    deadline: "2026-12-10",
    status: "Active",
    featured: false,
    description: "We are on the hunt for a data-driven Product Marketing Manager to craft compelling value propositions, launch major product features, and drive customer acquisition.",
    responsibilities: [
      "Develop go-to-market (GTM) strategies for new product features and enterprise releases.",
      "Create high-converting landing pages, customer case studies, and sales enablement decks.",
      "Analyze market trends, competitive intelligence, and customer segmentation data.",
      "Coordinate product launch campaigns across email, webinars, and social channels."
    ],
    requirements: [
      "3+ years experience in B2B SaaS product marketing or growth marketing.",
      "Exceptional copywriting skills and ability to translate technical features into clear benefits.",
      "Analytical mindset with hands-on experience using analytics tools (Mixpanel, GA4).",
      "Collaborative project management skills."
    ],
    benefits: [
      "Remote-first work environment with flexible working hours.",
      "Monthly home internet and cell phone allowance.",
      "Company retreats twice a year in scenic destinations.",
      "Parental leave up to 16 fully paid weeks."
    ]
  },
  {
    id: "job-105",
    title: "Junior Frontend Developer (React)",
    department: "Engineering",
    location: "Chicago, IL (Hybrid)",
    workMode: "Hybrid",
    type: "Full-Time",
    experienceLevel: "Entry-Level",
    salaryMin: 55000,
    salaryMax: 70000,
    currency: "USD",
    postedDate: "2026-11-09",
    deadline: "2026-12-01",
    status: "Active",
    featured: false,
    description: "Launch your engineering career with our supportive frontend team! You will contribute to user-facing applications, learn modern frontend engineering practices, and ship real features.",
    responsibilities: [
      "Develop responsive and accessible web components using HTML5, CSS3, and React.",
      "Integrate frontend views with backend REST endpoints.",
      "Write unit tests and ensure cross-browser compatibility.",
      "Participate actively in agile sprint planning and daily standups."
    ],
    requirements: [
      "Solid understanding of JavaScript (ES6+), HTML, and modern CSS/SCSS.",
      "Experience with React or similar modern reactive framework (coursework or portfolio projects).",
      "Familiarity with Git version control and GitHub workflow.",
      "Eagerness to learn, ask thoughtful questions, and receive constructive feedback."
    ],
    benefits: [
      "Dedicated mentorship program with a Senior Staff Engineer.",
      "Tuition and certificate reimbursement options.",
      "Friendly team culture with game nights and hackathons.",
      "Comprehensive healthcare and paid time off."
    ]
  }
];

const SEED_APPLICATIONS = [
  {
    id: "app-201",
    jobId: "job-101",
    jobTitle: "Senior Full Stack Engineer",
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 382-9912",
    location: "San Francisco, CA",
    currentTitle: "Senior Software Engineer at Horizon Labs",
    experienceYears: 6,
    portfolioUrl: "https://alexrivera.dev",
    linkedinUrl: "https://linkedin.com/in/alexrivera-sample",
    expectedSalary: "$120,000",
    earliestStartDate: "2026-12-01",
    appliedDate: "2026-11-05T10:14:00Z",
    status: "Interview Scheduled", // "Applied" | "Reviewing" | "Shortlisted" | "Interview Scheduled" | "Offer Made" | "Hired" | "Rejected"
    rating: 5,
    coverLetter: "I have spent the last 6 years building distributed React/Node.js web platforms. Having read your job description, I am thrilled about the opportunity to lead your core product architecture and scale your application.",
    resumeFileName: "Alex_Rivera_Resume_2026.pdf",
    resumeFileSize: "245 KB",
    notes: [
      {
        id: "note-1",
        author: "Sarah (Lead Recruiter)",
        date: "2026-11-06T14:30:00Z",
        text: "Strong technical background. Portfolio demonstrates exceptional React architecture. Initial screening went very smoothly."
      },
      {
        id: "note-2",
        author: "Marcus (Head of Engineering)",
        date: "2026-11-08T16:00:00Z",
        text: "Technical interview scheduled for Tuesday 10 AM. Recommended for architectural assessment."
      }
    ]
  },
  {
    id: "app-202",
    jobId: "job-102",
    jobTitle: "Lead UI/UX Product Designer",
    fullName: "Elena Rostova",
    email: "elena.design@example.com",
    phone: "+1 (555) 491-7788",
    location: "Brooklyn, NY",
    currentTitle: "Senior Product Designer at FinCraft",
    experienceYears: 7,
    portfolioUrl: "https://elenarostova.design",
    linkedinUrl: "https://linkedin.com/in/elena-rostova-design",
    expectedSalary: "$135,000",
    earliestStartDate: "2026-11-25",
    appliedDate: "2026-11-06T11:20:00Z",
    status: "Shortlisted",
    rating: 4,
    coverLetter: "Designing cohesive design systems and delightful SaaS user journeys is my passion. My portfolio showcases multiple enterprise products that achieved 40%+ increases in user retention.",
    resumeFileName: "Elena_Rostova_Design_CV.pdf",
    resumeFileSize: "1.8 MB",
    notes: [
      {
        id: "note-3",
        author: "Sarah (Lead Recruiter)",
        date: "2026-11-07T09:15:00Z",
        text: "Design portfolio is world-class. Excellent use of design tokens and accessibility practices."
      }
    ]
  },
  {
    id: "app-203",
    jobId: "job-103",
    jobTitle: "Cloud DevOps & Platform Engineer",
    fullName: "David Chen",
    email: "david.chen.cloud@example.com",
    phone: "+1 (555) 819-3321",
    location: "Austin, TX",
    currentTitle: "DevOps Engineer at CloudSync",
    experienceYears: 4,
    portfolioUrl: "https://github.com/davidchen-devops",
    linkedinUrl: "https://linkedin.com/in/davidchen-cloud",
    expectedSalary: "$105,000",
    earliestStartDate: "2026-12-15",
    appliedDate: "2026-11-07T15:45:00Z",
    status: "Reviewing",
    rating: 3,
    coverLetter: "Experienced with automated Kubernetes clusters, Terraform, and CI/CD pipelines. Looking to bring my cloud engineering skills to your infrastructure team in Austin.",
    resumeFileName: "David_Chen_DevOps_Resume.pdf",
    resumeFileSize: "180 KB",
    notes: [
      {
        id: "note-4",
        author: "James (DevOps Lead)",
        date: "2026-11-08T11:00:00Z",
        text: "Solid AWS experience. Need to verify production scale of his current Terraform setups."
      }
    ]
  },
  {
    id: "app-204",
    jobId: "job-105",
    jobTitle: "Junior Frontend Developer (React)",
    fullName: "Maya Lin",
    email: "maya.lin.coder@example.com",
    phone: "+1 (555) 203-4499",
    location: "Chicago, IL",
    currentTitle: "Recent CS Graduate & Frontend Intern",
    experienceYears: 1,
    portfolioUrl: "https://mayalin.me",
    linkedinUrl: "https://linkedin.com/in/mayalin-dev",
    expectedSalary: "$62,000",
    earliestStartDate: "Immediate",
    appliedDate: "2026-11-10T08:30:00Z",
    status: "Applied",
    rating: 0,
    coverLetter: "I recently graduated with a degree in Computer Science and completed a 6-month internship focused on React and responsive UI design. I love building intuitive user interfaces!",
    resumeFileName: "Maya_Lin_Resume_2026.pdf",
    resumeFileSize: "115 KB",
    notes: []
  }
];

