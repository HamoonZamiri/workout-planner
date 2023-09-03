// https://workout-planner-i8hv.onrender.com deployed
// http://localhost:8081 dev
export let api_base = "";
if (import.meta.env.DEV) {
    api_base = "http://localhost:8081";
}
else {
    api_base = "https://workout-planner-i8hv.onrender.com";
}
