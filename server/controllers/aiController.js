const { memoryStore } = require('../config/db');

// @desc Calculate AI Skill Match score and return top recommended jobs for user
// @route GET /api/ai/recommendations
const getRecommendations = async (req, res) => {
  try {
    const user = memoryStore.users.find(u => u._id === req.user._id);
    const userSkills = (user?.skills || []).map(s => s.toLowerCase());
    const userTitle = (user?.title || '').toLowerCase();
    const userLocation = (user?.location || '').toLowerCase();

    const activeJobs = memoryStore.jobs.filter(j => j.status === 'Active');

    const scoredJobs = activeJobs.map(job => {
      let score = 50;

      const jobSkills = (job.skills || []).map(s => s.toLowerCase());
      const jobTitle = job.title.toLowerCase();

      if (userSkills.length > 0 && jobSkills.length > 0) {
        const matchingSkills = jobSkills.filter(skill =>
          userSkills.some(us => us.includes(skill) || skill.includes(us))
        );
        const matchRatio = matchingSkills.length / Math.max(userSkills.length, 1);
        score += Math.round(matchRatio * 35);
      }

      if (userTitle && (jobTitle.includes(userTitle) || userTitle.includes(jobTitle))) {
        score += 15;
      }

      const matchScore = Math.min(Math.max(score, 65), 98);

      return {
        ...job,
        matchScore,
        matchingSkills: (job.skills || []).filter(s =>
          userSkills.some(us => us.toLowerCase() === s.toLowerCase())
        )
      };
    });

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      recommendations: scoredJobs.slice(0, 6),
      totalMatches: scoredJobs.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating recommendations', error: error.message });
  }
};

// @desc AI Assistant Chat Response Generator with selectable Mood
// @route POST /api/ai/chat
const aiAssistantChat = async (req, res) => {
  const { message, mood = 'Professional' } = req.body;
  const user = req.user;

  if (!message) {
    return res.status(400).json({ message: 'Message prompt is required' });
  }

  const q = message.toLowerCase();
  let reply = '';
  let moodPrefix = '';

  // Tone & Personality based on AI Assistant Mood
  switch (mood) {
    case 'Motivational':
      moodPrefix = '🔥 [Motivational Coach] ';
      if (q.includes('discouraged') || q.includes('reject') || q.includes('hard') || q.includes('stuck')) {
        reply = "Keep pushing forward! Rejection is just redirection to an even bigger opportunity. You have valuable skills, and your dream job in India is right around the corner. Take a deep breath and apply for 3 more positions today!";
      } else if (q.includes('resume') || q.includes('cv')) {
        reply = "Your resume is your personal story of achievement! Highlight your real impact, project outcomes, and key technologies. You've got what it takes to stand out to recruiters across Pan India!";
      } else {
        reply = `You've got this, ${user?.name || 'friend'}! Every application brings you one step closer to success. Stay confident, showcase your strengths, and own your interviews!`;
      }
      break;

    case 'Tech Analyst':
      moodPrefix = '🤖 [Tech Analyst Engine] ';
      if (q.includes('react') || q.includes('frontend')) {
        reply = "Technical Analysis: For React roles in Indian tech hubs (Bengaluru/Hyderabad/Remote), focus on Virtual DOM reconciliation, Custom Hooks, Redux Toolkit/Zustand, SSR with Next.js, and Web Vitals performance tuning.";
      } else if (q.includes('salary') || q.includes('lpa') || q.includes('pay')) {
        reply = "Compensation Metrics: Standard mid-to-senior engineering salaries in Pan India range from ₹12 LPA to ₹25+ LPA depending on system architecture experience, microservices, and cloud deployments (AWS/Docker).";
      } else {
        reply = `Analyzing technical query for ${user?.title || 'Engineer'}. Key skills detected: ${user?.skills?.join(', ') || 'React, Node.js'}. Recommended focus: Data Structures, System Design, and REST API optimization.`;
      }
      break;

    case 'Friendly':
      moodPrefix = '💡 [Friendly Advisor] ';
      if (q.includes('interview') || q.includes('prepare')) {
        reply = "Hey there! For interviews, just be yourself and practice storytelling using the STAR method (Situation, Task, Action, Result). Don't forget to research the company culture before your call!";
      } else if (q.includes('negotiate') || q.includes('offer')) {
        reply = "Negotiating can feel intimidating, but remember it's completely normal! Always research market rates for your city, highlight competing offers politely, and focus on the total package (fixed + bonus + WFH perks).";
      } else {
        reply = `Hey ${user?.name || 'there'}! Happy to help you with your career journey in India. Ask me anything about job hunting, resume tips, or interview prep!`;
      }
      break;

    case 'Professional':
    default:
      moodPrefix = '🎯 [Executive Recruiter] ';
      if (q.includes('resume') || q.includes('cv')) {
        reply = "To optimize your resume for ATS systems in India, ensure your key technical skills (e.g. React, Node.js) are explicitly listed near the top, use metric-driven bullet points, and keep formatting concise.";
      } else if (q.includes('interview') || q.includes('qa')) {
        reply = "Executive Guidance: Review fundamental domain concepts, articulate past project architectures clearly, and prepare 2-3 thoughtful questions about company engineering practices for the interviewer.";
      } else {
        reply = `Greetings ${user?.name || 'Candidate'}. Based on current Pan India hiring trends, top employers seek structured problem solving, clear communication, and verified technical proficiency.`;
      }
      break;
  }

  res.json({
    mood,
    reply: `${moodPrefix}${reply}`,
    timestamp: new Date()
  });
};

module.exports = {
  getRecommendations,
  aiAssistantChat
};
