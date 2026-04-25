const Groq = require('groq-sdk');
const Task = require('../models/Task');

const getGroq = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY (Groq key) is not set in .env file');
  }
  return new Groq({ apiKey: process.env.OPENAI_API_KEY });
};

const prioritizeTasks = async (req, res, next) => {
  try {
    const { projectId, sprintEnd } = req.body;
    const tasks = await Task.find({ project: projectId, status: { $ne: 'done' } })
      .populate('assignee', 'name')
      .select('title status priority storyPoints dueDate assignee');

    if (tasks.length === 0) {
      return res.json({
        priorityAlert: 'No pending tasks found in this sprint.',
        sprintRisk: 'Add tasks to get a proper sprint analysis.',
        suggestedTask: 'Consider adding tasks for the upcoming sprint.',
        atRiskTasks: [],
        recommendation: 'Create tasks and assign them to team members.'
      });
    }

    const taskSummary = tasks.map(t =>
      `- "${t.title}" | status: ${t.status} | priority: ${t.priority} | points: ${t.storyPoints} | due: ${t.dueDate ? new Date(t.dueDate).toDateString() : 'none'} | assignee: ${t.assignee?.name || 'unassigned'}`
    ).join('\n');

    const prompt = `You are a senior engineering project manager AI assistant.
Sprint ends: ${new Date(sprintEnd).toDateString()}
Today: ${new Date().toDateString()}

Current tasks:
${taskSummary}

Respond ONLY in this JSON format with no extra text, no markdown, no backticks:
{
  "priorityAlert": "one sentence about the most critical blocking task",
  "sprintRisk": "one sentence about sprint completion risk",
  "suggestedTask": "one sentence suggesting a new task that should be added",
  "atRiskTasks": ["task title 1", "task title 2"],
  "recommendation": "one actionable sentence for the team lead"
}`;

    const groq = getGroq();
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 500
    });

    const raw = response.choices[0].message.content.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON response from Groq');
    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    console.error('Groq prioritize error:', err.message);
    next(err);
  }
};

const askAI = async (req, res, next) => {
  try {
    const { question, context } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const prompt = `You are a helpful project management assistant for a software team.
Project context: ${context || 'No context provided'}
User question: ${question}
Answer concisely in 2-3 sentences.`;

    const groq = getGroq();
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 200
    });

    res.json({ answer: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error('Groq askAI error:', err.message);
    next(err);
  }
};

module.exports = { prioritizeTasks, askAI };