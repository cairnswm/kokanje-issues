
let KOKANJE = "https://cairns.co.za/kokanje/php";
let ACCESSELF_API = "62e2b6a7-62e2b6b6-473b-8d58-04a2b22b72b0";

if (typeof process !== "undefined" && process?.env) {
  KOKANJE = process.env.REACT_APP_KOKANJE_API;
  ACCESSELF_API = process.env.REACT_APP_ACCESSELF_API_KEY;
}

if (window.location.hostname === "localhost") {
  KOKANJE = "http://localhost/kokanje/php/";
}

export const REACT_APP_KOKANJE_API = KOKANJE;
export const REACT_APP_ACCESSELF_API = ACCESSELF_API;
