// Simulates network latency so loading skeletons are visible in mock mode.
export const delay = (ms = 550) => new Promise((r) => setTimeout(r, ms));

export const respond = async (data, ms) => {
  await delay(ms);
  return JSON.parse(JSON.stringify(data));
};

// Flip to true in a mock file to exercise the error states.
export const fail = async (message = 'Service unavailable') => {
  await delay(400);
  throw new Error(message);
};
