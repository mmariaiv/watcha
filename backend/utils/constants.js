const corsSettings = {
	origin: "http://localhost:5173",
	credentials: true,
};

const regexLinkValidation = /https?:\/\/(w+)?.+\.\w+(\/.+)?/;

module.exports = {
	corsSettings,
	regexLinkValidation,
};
