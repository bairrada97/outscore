import { reactive, computed } from "@nuxtjs/composition-api";

const state = reactive({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    liveToggle: false,
    liveGames: {},
    selectedGameStatistics: {},
    selectedMatch: {
        match: {},
        awayTeamH2H: [],
        homeTeamH2H: [],
        h2h: [],
        standings: []
    },
    games: {},
    selectedDate: {
        raw: null,
        formated: null
    },
    isCalendarOpen: false,
    selectedTab: "",
    selectedFilter: "",
    betsHelper: {
        away:{},
        home:{},
        h2h: {}
    },
});

const getAwayTeamH2H = () => state.selectedMatch.awayTeamH2H;
const getHomeTeamH2H = () => state.selectedMatch.homeTeamH2H;
const getSelectedTab = () => state.selectedTab;
const getSelectedFilter = () => state.selectedFilter;
const getStandings = () => state.selectedMatch.standings;
const getTimezone = () => state.timezone;
const getTeamsFromStandings = () => state.selectedMatch.teams;

const getH2H = () => {
    return state.selectedMatch.h2h;
};
const setTeamsFromStandings = (response) => state.selectedMatch.teams = response;

const setAwayTeamH2H = response => {
    state.selectedMatch.awayTeamH2H = response;
};
const setHomeTeamH2H = response => {
    state.selectedMatch.homeTeamH2H = response;
};
const setH2H = response => {
    state.selectedMatch.h2h = response;
};

const setStandings = response => {
    state.selectedMatch.standings = response;
};

const setLiveGames = response => {
    state.liveGames = response;
};

const setGames = response => {
    state.games = response;
};

const setGameStatistics = response => {
    state.selectedGameStatistics = response;
};

const setFormatDate = (year, month, day) => {
    const date = new Date(year, month, day);
    state.selectedDate.raw = date;

    const offset = date.getTimezoneOffset();
    let newDate = new Date(date.getTime() - offset * 60 * 1000);
    state.selectedDate.formated = newDate.toISOString().split("T")[0];
};

const setLiveToggle = response => {
    state.liveToggle = !response;
};

const setCalendarOpen = response => {
    state.isCalendarOpen = response;
};

const getCalendarOpen = () => {
    return state.isCalendarOpen;
};
const getLiveGames = () => {
    return state.liveGames;
};

const getGames = () => {
    return state.games;
};

const getGameStatistics = () => {
    return state.selectedGameStatistics;
};

const setSelectedMatch = response => {
    state.selectedMatch.match = response;
};

const getBetsHelper = () => state.betsHelper;
const getSelectedMatch = () => {
    return state.selectedMatch.match;
};


const getSpecificGame = payload => {
    return state.games.response?.find(game => game.fixture.id == payload);
};

const getSelectedDate = () => {
    return state.selectedDate.formated;
};

const getRawSelectedDate = () => {
    return state.selectedDate.raw;
};

const getLiveToggle = () => {
    return state.liveToggle;
};

const setSelectedTab = response => {
    state.selectedTab = response;
};
const setSelectedFilter = response => {
    state.selectedFilter = response;
};
const setBetsHelper = response => {
    state.betsHelper = response;
};

export default {
    state,
    getTimezone,
    setLiveGames,
    getLiveGames,
    setGames,
    getGames,
    getSelectedMatch,
    setGameStatistics,
    getGameStatistics,
    getSpecificGame,
    setSelectedMatch,
    setFormatDate,
    getSelectedDate,
    getRawSelectedDate,
    setLiveToggle,
    getLiveToggle,
    setCalendarOpen,
    getCalendarOpen,
    getAwayTeamH2H,
    getHomeTeamH2H,
    getH2H,
    setAwayTeamH2H,
    setHomeTeamH2H,
    setH2H,
    setSelectedTab,
    getSelectedTab,
    getStandings,
    setStandings,
    setSelectedFilter,
    getSelectedFilter,
    getBetsHelper,
    setBetsHelper,

    setTeamsFromStandings,
   getTeamsFromStandings
};
