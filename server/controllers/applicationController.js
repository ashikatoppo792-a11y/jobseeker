const { memoryStore } = require('../config/db');

// @desc Submit a new job application
// @route POST /api/applications
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, applicantName, applicantEmail, applicantPhone } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = memoryStore.jobs.find(j => j._id === jobId);
    if (!job) {
      return res.status(404).json({ message: 'Target job listing no longer exists' });
    }

    // Check if already applied
    const existing = memoryStore.applications.find(
      a => a.jobId === jobId && a.seekerId === req.user._id
    );
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted an application for this job.' });
    }

    // File resume or uploaded path
    let resumeUrl = req.user.resumeUrl || '/uploads/resumes/default_resume.pdf';
    let resumeName = req.user.resumeName || `${req.user.name.replace(/\s+/g, '_')}_Resume.pdf`;

    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      resumeName = req.file.originalname;
    }

    const newApplication = {
      _id: 'app_' + Date.now(),
      jobId,
      seekerId: req.user._id,
      employerId: job.employerId,
      applicantName: applicantName || req.user.name,
      applicantEmail: applicantEmail || req.user.email,
      applicantPhone: applicantPhone || req.user.phone || '+1 (555) 000-0000',
      resumeUrl,
      resumeName,
      coverLetter: coverLetter || '',
      status: 'Pending',
      appliedDate: new Date()
    };

    memoryStore.applications.unshift(newApplication);

    // Increment applicantsCount on the job
    job.applicantsCount = (job.applicantsCount || 0) + 1;

    // Send notification to employer
    const employerProfile = memoryStore.employers.find(e => e._id === job.employerId);
    if (employerProfile) {
      memoryStore.notifications.unshift({
        _id: 'n_' + Date.now(),
        userId: employerProfile.userId,
        title: 'New Applicant Received',
        message: `${req.user.name} applied for "${job.title}".`,
        read: false,
        createdAt: new Date()
      });
    }

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: newApplication
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
};

// @desc Get applications submitted by logged-in Job Seeker
// @route GET /api/applications/my-applications
const getMyApplications = async (req, res) => {
  const myApps = memoryStore.applications.filter(a => a.seekerId === req.user._id);

  // Attach job info to each application
  const detailedApps = myApps.map(app => {
    const job = memoryStore.jobs.find(j => j._id === app.jobId) || {
      title: 'Job Post',
      companyName: 'Company',
      location: 'Local',
      salaryCurrency: 'USD',
      minSalary: 50000,
      maxSalary: 80000,
      jobType: 'Full-time'
    };
    return {
      ...app,
      job
    };
  });

  res.json(detailedApps);
};

// @desc Get applications received by logged-in Employer
// @route GET /api/applications/employer-applications
const getEmployerApplications = async (req, res) => {
  const employer = memoryStore.employers.find(e => e.userId === req.user._id);
  if (!employer) {
    return res.status(404).json({ message: 'Employer profile not found' });
  }

  const employerApps = memoryStore.applications.filter(a => a.employerId === employer._id);

  const detailedApps = employerApps.map(app => {
    const job = memoryStore.jobs.find(j => j._id === app.jobId) || { title: 'Unknown Job' };
    const seeker = memoryStore.users.find(u => u._id === app.seekerId) || { skills: [] };
    return {
      ...app,
      jobTitle: job.title,
      skills: seeker.skills || ['React', 'Communication']
    };
  });

  res.json(detailedApps);
};

// @desc Update application status (Employer action: Accept, Reject, Interviewing, etc.)
// @route PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid application status provided' });
  }

  const appIndex = memoryStore.applications.findIndex(a => a._id === req.params.id);
  if (appIndex === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const application = memoryStore.applications[appIndex];
  application.status = status;
  memoryStore.applications[appIndex] = application;

  // Send notification to Job Seeker
  const job = memoryStore.jobs.find(j => j._id === application.jobId);
  memoryStore.notifications.unshift({
    _id: 'n_' + Date.now(),
    userId: application.seekerId,
    title: `Application Status Update: ${status}`,
    message: `Your application for "${job?.title || 'Job'}" was updated to "${status}".`,
    read: false,
    createdAt: new Date()
  });

  res.json(application);
};

module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus
};
