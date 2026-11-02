const GRADE_SCALE = [
  { min: 90, letter: 'A', points: 4 },
  { min: 85, letter: 'A-', points: 3.67 },
  { min: 80, letter: 'B+', points: 3.33 },
  { min: 75, letter: 'B', points: 3 },
  { min: 70, letter: 'B-', points: 2.67 },
  { min: 65, letter: 'C+', points: 2.33 },
  { min: 60, letter: 'C', points: 2 },
  { min: 55, letter: 'C-', points: 1.67 },
  { min: 50, letter: 'D', points: 1 },
  { min: 0, letter: 'F', points: 0 }
]

const gradeFromScore = (score) => {
  const value = Number(score)
  if (!Number.isFinite(value) || value < 0 || value > 100) return null

  const entry = GRADE_SCALE.find((candidate) => value >= candidate.min)

  return {
    letter: entry.letter,
    points: entry.points,
    passed: value >= 50
  }
}

const calculateSummary = (grades) => {
  let totalCredits = 0
  let earnedCredits = 0
  let weightedPoints = 0

  for (const grade of grades) {
    const credits = Number(grade.course?.credits)
    const points = Number(grade.gradePoints)

    if (!Number.isFinite(credits) || credits <= 0) continue
    if (!Number.isFinite(points) || points < 0) continue

    totalCredits += credits
    weightedPoints += points * credits
    if (grade.passed) earnedCredits += credits
  }

  return {
    totalCredits,
    earnedCredits,
    gpa: totalCredits
      ? Number((weightedPoints / totalCredits).toFixed(2))
      : null,
    courses: grades.length
  }
}

module.exports = { GRADE_SCALE, gradeFromScore, calculateSummary }
