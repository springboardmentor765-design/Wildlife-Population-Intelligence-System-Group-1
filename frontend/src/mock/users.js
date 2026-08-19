import { ROLES } from '../utils/constants';

export const mockUsers = [
  {
    id: 'usr-001', name: 'Dr. Anitha Raghavan', email: 'anitha@wildlife.org',
    role: ROLES.RESEARCHER, organization: 'Salim Ali Centre for Ornithology',
    designation: 'Principal Investigator', phone: '+91 98400 11234',
    region: 'Nilgiri Biosphere Reserve', joined: '2024-03-12T09:00:00Z', status: 'active',
    avatarTone: 'moss',
  },
  {
    id: 'usr-002', name: 'Karthik Menon', email: 'karthik@conserve.in',
    role: ROLES.CONSERVATION, organization: 'Western Ghats Conservation Trust',
    designation: 'Field Conservation Lead', phone: '+91 98861 55780',
    region: 'Anamalai Landscape', joined: '2024-06-02T09:00:00Z', status: 'active',
    avatarTone: 'clay',
  },
  {
    id: 'usr-003', name: 'R. Selvaraj IFS', email: 'selvaraj@tnforest.gov.in',
    role: ROLES.FOREST, organization: 'Tamil Nadu Forest Department',
    designation: 'District Forest Officer', phone: '+91 94430 22119',
    region: 'Mudumalai Tiger Reserve', joined: '2023-11-20T09:00:00Z', status: 'active',
    avatarTone: 'bark',
  },
  {
    id: 'usr-004', name: 'Priya Nair', email: 'priya@wildlife.org',
    role: ROLES.ADMIN, organization: 'WPIS Platform Team',
    designation: 'Platform Administrator', phone: '+91 90031 77042',
    region: 'All regions', joined: '2023-08-01T09:00:00Z', status: 'active',
    avatarTone: 'moss',
  },
];

// email -> role shortcut for the demo login screen
export const demoAccounts = mockUsers.map((u) => ({ email: u.email, role: u.role, name: u.name }));
