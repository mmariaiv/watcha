const corsSettings = {
	origin: "http://localhost:5173",
	credentials: true,
};

const regexLinkValidation = /https?:\/\/(w+)?.+\.\w+(\/.+)?/;

const regexNameValidation = /^[a-zа-я\s-]+$/i;

const urlList = [
	"lists=top250&limit=250",
	"lists=series-top250&limit=250",
	"rating.kp=6-10&limit=250",
	"rating.kp=6-10&isSeries=true&limit=250",
	"genres.name=криминал&limit=200",
	"genres.name=комедия&limit=200",
	"genres.name=драма&limit=200",
	"genres.name=детектив&limit=200",
	"genres.name=короткометражка&limit=200",
	"genres.name=фантастика&limit=200",
	"genres.name=ужасы&limit=200",
	"genres.name=триллер&limit=200",
];

module.exports = {
	corsSettings,
	regexLinkValidation,
	urlList,
	regexNameValidation,
};
