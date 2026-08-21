// Intelligent Study Companion AI Coach Logic

export function generateAICoachInsights(userStats = {}, sessions = [], tasks = []) {
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.minutes || 0), 0);
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const streak = userStats.streak || 0;

  const hoursFormatted = (totalMinutes / 60).toFixed(1);

  // Generate dynamic, realistic personalized insights
  const tips = [];

  if (totalMinutes > 120) {
    tips.push({
      type: 'praise',
      title: 'Strong Focus Momentum',
      message: `You've accumulated ${hoursFormatted} hours of deep work! Your focus retention is sharp today.`
    });
    tips.push({
      type: 'advice',
      title: 'Optimal Rest Window',
      message: 'You usually reach maximum productivity in 45-minute blocks. Take a 5-minute stretch walk after your next session.'
    });
  } else if (totalMinutes > 0) {
    tips.push({
      type: 'advice',
      title: 'Building Momentum',
      message: `Great start with ${totalMinutes} focused minutes logged! Try setting a high-priority task for your next 25-minute block.`
    });
  } else {
    tips.push({
      type: 'motivation',
      title: 'Ready for Takeoff',
      message: 'No focus sessions logged yet today. Starting with just 15 minutes of deep focus can trigger your momentum!'
    });
  }

  if (streak >= 3) {
    tips.push({
      type: 'streak',
      title: `${streak}-Day Streak Active! 🔥`,
      message: `Consistency is your secret power. You are in the top 5% of focus consistency this week!`
    });
  }

  if (completedTasksCount > 0) {
    tips.push({
      type: 'insight',
      title: 'Task Velocity',
      message: `You have crossed off ${completedTasksCount} key tasks. Completing your hardest task before 2 PM doubles focus efficiency.`
    });
  }

  return {
    greeting: getGreetingByTime(),
    tips,
    suggestedOrder: getSuggestedTaskOrder(tasks)
  };
}

function getGreetingByTime() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning, Scholar 🌅';
  if (hour < 17) return 'Good Afternoon, Achiever ☀️';
  if (hour < 22) return 'Good Evening, Mastermind 🌙';
  return 'Late Night Focus Champion 🌌';
}

function getSuggestedTaskOrder(tasks) {
  const pending = tasks.filter(t => !t.completed);
  return pending.sort((a, b) => {
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    return (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
  });
}
