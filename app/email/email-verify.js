const subject = "Origin Genealogy account verification.";
const body = link => {
  return `Thanks for signing up to Origin Genealogy. To complete your registation click or paste this link into your browser:  ${link}`;
};

module.exports = { subject, body };
