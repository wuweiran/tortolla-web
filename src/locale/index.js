import cookie from "react-cookies";

const cookieOptions = { path: "/", sameSite: "lax", secure: false };

export const loadLocalePref = () => {
  return cookie.load("locale-pref");
};
export const saveLocalePref = (localeString) => {
  return cookie.save("locale-pref", localeString, cookieOptions);
};
