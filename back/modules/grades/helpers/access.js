const ROLES = require('../../users/helpers/roles')

const idOf = (value) => {
  if (!value) return null
  if (typeof value === 'object') {
    return value._id ? String(value._id) : null
  }
  return String(value)
}

const isAdmin = (user) => Boolean(user && user.role === ROLES.ADMIN)

const isStudentOwner = (user, grade) =>
  Boolean(
    user &&
      user.role === ROLES.STUDENT &&
      grade &&
      idOf(grade.student) === String(user._id)
  )

const isTeacherOfCourse = (user, grade) => {
  if (!user || user.role !== ROLES.TEACHER || !grade) return false

  const course = grade.course
  if (!course || typeof course !== 'object') return false

  return Boolean(course.teacher && idOf(course.teacher) === String(user._id))
}

const canViewGrade = (user, grade) => {
  if (!user || !grade) return false
  return (
    isAdmin(user) || isStudentOwner(user, grade) || isTeacherOfCourse(user, grade)
  )
}

const canManageGrades = (user) => isAdmin(user)

module.exports = { canViewGrade, canManageGrades }
