// https://workout-planner-i8hv.onrender.com deployed
// http://localhost:8081 dev

let api_base = "";
api_base = import.meta.env.VITE_API_GATEWAY;
const constants = {
  api_base,
} as const;
export default constants;
