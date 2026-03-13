export function adaptEmployee(employee) {
  return {
    ...employee,
    skills: employee.skills ? [...employee.skills] : [],
    allocations: employee.allocations ? [...employee.allocations] : [],
    achievements: employee.achievements ? [...employee.achievements] : [],
    vacation: employee.vacation ? [...employee.vacation] : [],
  };
}

export function adaptProject(project) {
  return { ...project };
}

export function adaptRegistryCatalog({ employees, teams, projects, skills }) {
  return {
    employees: employees.map(adaptEmployee),
    teams: [...teams],
    projects: projects.map(adaptProject),
    skills: [...skills],
  };
}
