import { allSkills, employees, projects, teams } from '../../data/mockData';
import { adaptEmployee, adaptRegistryCatalog } from '../adapters/registryAdapter';

function delay(value) {
  return Promise.resolve(value);
}

export async function getRegistryCatalog() {
  return delay(
    adaptRegistryCatalog({
      employees,
      teams,
      projects,
      skills: allSkills,
    })
  );
}

export async function listEmployees() {
  return delay(employees.map(adaptEmployee));
}
