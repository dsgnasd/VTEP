import { employees } from '../../data/mockData';
import { adaptEmployee } from '../adapters/registryAdapter';

function delay(value) {
  return Promise.resolve(value);
}

export async function getEmployeeById(id) {
  const employee = employees.find((item) => item.id === id);
  return delay(employee ? adaptEmployee(employee) : null);
}
