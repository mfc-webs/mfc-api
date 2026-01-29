
export const logoutMember = (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
};