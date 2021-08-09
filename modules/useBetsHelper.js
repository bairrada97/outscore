import { defineComponent, reactive, computed, ref, onMounted, useFetch, onActivated, onUnmounted } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function (fixture) {
	const betsHelperResponse = ref([]);
	const homeTeam = ref(null);
	const awayTeam = ref(null);
	const currentLeague = fixture.league;
	const extraInfo = ref("")
	const loadBetsHelper = async (home, away) => {
		try {
			await axios.get(`https://api-football-v3.herokuapp.com/api/v3/betshelper/?home=${home.id}&away=${away.id}`)
			.then(response => {
				 const hasDataUpdated = !betsHelperResponse.value.cacheDate || response.data.cacheDate != betsHelperResponse.value.cacheDate;
				 if (hasDataUpdated) store.setBetsHelper(response.data);
			}) 
			.then(() => {
                betsHelperResponse.value = computed(() =>store.getBetsHelper());
				homeTeam.value = home;
				awayTeam.value = away;
            });
		} catch (error) {}
	};

	const getBoardInfoH2H = computed(() => {
		if (betsHelperResponse.value.length == 0 || betsHelperResponse.value == undefined) return;

		const {h2h} = betsHelperResponse.value.value;
		const getFinishedGames = h2h.filter(item => item.fixture.status.short == "FT" || item.fixture.status.short == "AET" || item.fixture.status.short == "PEN")
		const gameLength = getFinishedGames.length;
		const getWinners = getFinishedGames.map(item => Object.values(item.teams).find(team => team.winner));
		const getHomeWinnerLength = getWinners.filter(item => item?.id == homeTeam.value.id).length;
		const getAwayWinnerLength = getWinners.filter(item => item?.id == awayTeam.value.id).length;
		const getDrawLength = gameLength - (getHomeWinnerLength + getAwayWinnerLength)
	
		return {
			gameLength,
			matches: [ 
				{
					description: "Wins",
					number: getHomeWinnerLength,
					color: "#212121",
					background: "#E9E7E7"
				},
				{
					description: "Draw",
					number: getDrawLength,
					color: "#fff",
					background: "#939393"
				},
				{
					description: "Wins",
					number: getAwayWinnerLength,
					color: "#fff",
					background: "#212121"
				},
				
				 
			]
	
		}
	})  

	const getBoardInfo = computed(() => {
		if (betsHelperResponse.value.length == 0 || betsHelperResponse.value == undefined) return;

		const {home,away} = betsHelperResponse.value.value;
		const getHomeFinishedGames = home.filter(item => item.fixture.status.short == "FT" || item.fixture.status.short == "AET" || item.fixture.status.short == "PEN");
		const getAwayFinishedGames = away.filter(item => item.fixture.status.short == "FT" || item.fixture.status.short == "AET" || item.fixture.status.short == "PEN");

		const getHomeWinnerLength = getHomeFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == homeTeam.value.id && team.winner)).filter(match => match.length).length
		const getHomeLosesLength = getHomeFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == homeTeam.value.id && team.winner == false)).filter(match => match.length).length
		const getHomeDrawsLength = home.length - (getHomeWinnerLength + getHomeLosesLength);
		const getAwayWinnerLength = getAwayFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == awayTeam.value.id && team.winner)).filter(match => match.length).length
		const getAwayLosesLength = getAwayFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == awayTeam.value.id && team.winner == false)).filter(match => match.length).length
		const getAwayDrawsLength = away.length - (getAwayWinnerLength + getAwayLosesLength);

		
	
	
		return {
			matches:{
				home:[
				{
					description: "Wins",
					number: getHomeWinnerLength,
					color: "#212121",
					background: "#E9E7E7"
				},
				{
					description: "Draws",
					number: getHomeDrawsLength,
					color: "#212121",
					background: "#E9E7E7"		
				},
				{
					description: "Loses",
					number: getHomeLosesLength,
					color: "#212121",
					background: "#E9E7E7"
				},
				],
				away:[
				{
					description: "Wins",
					number: getAwayWinnerLength,
					color: "#fff",
					background: "#212121"
				},
				{
					description: "Draws",
					number: getAwayDrawsLength,
					color: "#fff",
					background: "#212121"
				},
				{
					description: "Loses",
					number: getAwayLosesLength,
					color: "#fff",
					background: "#212121"
				}
				]
			}
	
		}
	})  

	const betsHelper = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { away, home } = betsHelperResponse.value.value;
		const uniqueMatches = [...new Map([...away, ...home].map(item => [item.fixture.id, item])).values()];
		const isDifferentCompetition  =  [...new Map([...away, ...home].map(item => [item.fixture.id, item])).values()].find(league => league.id !== currentLeague.id);
		if(isDifferentCompetition){
			extraInfo.value = "At least one of last the 5 games is from a different competition from this match"
		}
		return uniqueMatches?.reduce((acc, stats) => {
			getGoals(acc, stats, 1.5);
			getGoals(acc, stats, 2.5);
			getGoals(acc, stats, 3.5);
			getGoals(acc, stats, 4.5);
			getGoals(acc, stats, 5.5);
			getBothTeamsToScore(acc, stats);
			getCleanSheet(acc, stats);
			getFirstTeamToScore(acc, stats);
			getTotalCorners(acc, stats, 7.5);
			getTotalCorners(acc, stats, 8.5);
			getTotalCorners(acc, stats, 9.5);
			getTotalCorners(acc, stats, 10.5);
			getTotalCorners(acc, stats, 11.5);
			getTotalCorners(acc, stats, 12.5);
			getTotalCards(acc, stats, 2.5);
			getTotalCards(acc, stats, 3.5);
			getTotalCards(acc, stats, 4.5);
			getTotalCards(acc, stats, 5.5);
			getTotalCards(acc, stats, 6.5);
			getTotalCards(acc, stats, 7.5);
			getDrawNoBet(acc, stats);
			return acc;
		}, {});
	});

	const betsHelperH2H = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { h2h } = betsHelperResponse.value.value;
		
	
		return h2h?.reduce((acc, stats) => {
			getGoals(acc, stats, 1.5);
			getGoals(acc, stats, 2.5);
			getGoals(acc, stats, 3.5);
			getGoals(acc, stats, 4.5);
			getGoals(acc, stats, 5.5);
			getBothTeamsToScore(acc, stats);
			getCleanSheet(acc, stats);
			getFirstTeamToScore(acc, stats);
			getTotalCorners(acc, stats, 7.5);
			getTotalCorners(acc, stats, 8.5);
			getTotalCorners(acc, stats, 9.5);
			getTotalCorners(acc, stats, 10.5);
			getTotalCorners(acc, stats, 11.5);
			getTotalCorners(acc, stats, 12.5);
			getTotalCards(acc, stats, 2.5);
			getTotalCards(acc, stats, 3.5);
			getTotalCards(acc, stats, 4.5);
			getTotalCards(acc, stats, 5.5);
			getTotalCards(acc, stats, 6.5);
			getTotalCards(acc, stats, 7.5);
			getDrawNoBet(acc, stats);
			return acc;
		}, {});
	});

	const getGoals = (acc, stats, value) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const goalsInGame = stats.goals.home + stats.goals.away;

		acc["goals"] = acc["goals"] || {};
		acc["goals"][`+${value}`] = acc["goals"][`+${value}`] || {};
		acc["goals"][`+${value}`].home = acc["goals"][`+${value}`].home || {};
		acc["goals"][`+${value}`].away = acc["goals"][`+${value}`].away || {};
		acc["goals"][`+${value}`].home.name = homeTeam.value.name;
		acc["goals"][`+${value}`].away.name = awayTeam.value.name;
		acc["goals"][`+${value}`].home.value = acc["goals"][`+${value}`].home.value || 0;
		acc["goals"][`+${value}`].away.value = acc["goals"][`+${value}`].away.value || 0;

		if (acc["goals"][`+${value}`].home.name == homeTeamSide?.name) {
			if (goalsInGame > value) {
				acc["goals"][`+${value}`].home.value++;
			}
		}
		if (acc["goals"][`+${value}`].away.name == awayTeamSide?.name) {
			if (goalsInGame > value) {
				acc["goals"][`+${value}`].away.value++;
			}
		}
	};

	const getBothTeamsToScore = (acc, stats) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const goalsHome = stats.goals.home;
		const goalsAway = stats.goals.away;

		acc["Both Teams To Score"] = acc["Both Teams To Score"] || {};
		acc["Both Teams To Score"][`yes`] = acc["Both Teams To Score"][`yes`] || {};
		acc["Both Teams To Score"][`yes`].home = acc["Both Teams To Score"][`yes`].home || {};
		acc["Both Teams To Score"][`yes`].away = acc["Both Teams To Score"][`yes`].away || {};
		acc["Both Teams To Score"][`yes`].home.name = homeTeam.value.name;
		acc["Both Teams To Score"][`yes`].away.name = awayTeam.value.name;
		acc["Both Teams To Score"][`yes`].home.value = acc["Both Teams To Score"][`yes`].home.value || 0;
		acc["Both Teams To Score"][`yes`].away.value = acc["Both Teams To Score"][`yes`].away.value || 0;

		if (acc["Both Teams To Score"][`yes`].home.name == homeTeamSide?.name) {
			if (goalsHome > 0 && goalsAway > 0) {
				acc["Both Teams To Score"][`yes`].home.value++;
			}
		}
		if (acc["Both Teams To Score"][`yes`].away.name == awayTeamSide?.name) {
			if (goalsHome > 0 && goalsAway > 0) {
				acc["Both Teams To Score"][`yes`].away.value++;
			}
		}
	};

	const getCleanSheet = (acc, stats) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const goalsHome = stats.goals.home;
		const goalsAway = stats.goals.away;

		acc["Clean Sheet"] = acc["Clean Sheet"] || {};
		acc["Clean Sheet"][`yes`] = acc["Clean Sheet"][`yes`] || {};
		acc["Clean Sheet"][`yes`].home = acc["Clean Sheet"][`yes`].home || {};
		acc["Clean Sheet"][`yes`].away = acc["Clean Sheet"][`yes`].away || {};
		acc["Clean Sheet"][`yes`].home.name = homeTeam.value.name;
		acc["Clean Sheet"][`yes`].away.name = awayTeam.value.name;
		acc["Clean Sheet"][`yes`].home.value = acc["Clean Sheet"][`yes`].home.value || 0;
		acc["Clean Sheet"][`yes`].away.value = acc["Clean Sheet"][`yes`].away.value || 0;

		if (acc["Clean Sheet"][`yes`].home.name == homeTeamSide?.name) {
			if (goalsAway == 0) {
				acc["Clean Sheet"][`yes`].home.value++;
			}
		}
		if (acc["Clean Sheet"][`yes`].away.name == awayTeamSide?.name) {
			if (goalsHome == 0) {
				acc["Clean Sheet"][`yes`].away.value++;
			}
		}
	};
 
	const getFirstTeamToScore = (acc, stats) => {
		
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const firstGoalEvent = stats.events.find(events => events.type == "Goal");

		

		acc["First Team To Score"] = acc["First Team To Score"] || {};
		acc["First Team To Score"][`yes`] = acc["First Team To Score"][`yes`] || {};
		acc["First Team To Score"][`yes`].home = acc["First Team To Score"][`yes`].home || {};
		acc["First Team To Score"][`yes`].away = acc["First Team To Score"][`yes`].away || {};
		acc["First Team To Score"][`yes`].home.name = homeTeam.value.name;
		acc["First Team To Score"][`yes`].away.name = awayTeam.value.name;
		acc["First Team To Score"][`yes`].home.value = acc["First Team To Score"][`yes`].home.value || 0;
		acc["First Team To Score"][`yes`].away.value = acc["First Team To Score"][`yes`].away.value || 0;

		if (acc["First Team To Score"][`yes`].home.name == homeTeamSide?.name) {
			if (firstGoalEvent?.team.id == homeTeam.value.id) {
				acc["First Team To Score"][`yes`].home.value++;
			}
		}
		if (acc["First Team To Score"][`yes`].away.name == awayTeamSide?.name) {
			if (firstGoalEvent?.team.id == awayTeam.value.id) {
				acc["First Team To Score"][`yes`].away.value++;
			}
		}
	};

	const getTotalCorners = (acc, stats, value) => {
	
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const totalCorners =
			stats.statistics.length > 0
				? stats.statistics
						.map(item => item.statistics)
						.map(item2 => item2.filter(item3 => item3.type == "Corner Kicks"))
						.reduce((prev, next) => prev[0].value + next[0].value)
				: "";

		acc["Total Corners"] = acc["Total Corners"] || {};
		acc["Total Corners"][`+${value}`] = acc["Total Corners"][`+${value}`] || {};
		acc["Total Corners"][`+${value}`].home = acc["Total Corners"][`+${value}`].home || {};
		acc["Total Corners"][`+${value}`].away = acc["Total Corners"][`+${value}`].away || {};
		acc["Total Corners"][`+${value}`].home.name = homeTeam.value.name;
		acc["Total Corners"][`+${value}`].away.name = awayTeam.value.name;
		acc["Total Corners"][`+${value}`].home.value = acc["Total Corners"][`+${value}`].home.value || 0;
		acc["Total Corners"][`+${value}`].away.value = acc["Total Corners"][`+${value}`].away.value || 0;

		if (acc["Total Corners"][`+${value}`].home.name == homeTeamSide?.name) {
			if (totalCorners > value) {
				acc["Total Corners"][`+${value}`].home.value++;
			}
		}
		if (acc["Total Corners"][`+${value}`].away.name == awayTeamSide?.name) {
			if (totalCorners > value) {
				acc["Total Corners"][`+${value}`].away.value++;
			}
		}
	};

	const getTotalCards = (acc, stats, value) => {
		
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const totalCorners =
			stats.statistics.length > 0
				? stats.statistics
						.map(item => item.statistics)
						.map(item2 => item2.filter(item3 => item3.type == "Yellow Cards" || item3.type == "Red Cards"))
						.reduce((prev, next) => prev[0].value + next[0].value + prev[1].value + next[1].value)
				: "";

		acc["Total Cards"] = acc["Total Cards"] || {};
		acc["Total Cards"][`+${value}`] = acc["Total Cards"][`+${value}`] || {};
		acc["Total Cards"][`+${value}`].home = acc["Total Cards"][`+${value}`].home || {};
		acc["Total Cards"][`+${value}`].away = acc["Total Cards"][`+${value}`].away || {};
		acc["Total Cards"][`+${value}`].home.name = homeTeam.value.name;
		acc["Total Cards"][`+${value}`].away.name = awayTeam.value.name;
		acc["Total Cards"][`+${value}`].home.value = acc["Total Cards"][`+${value}`].home.value || 0;
		acc["Total Cards"][`+${value}`].away.value = acc["Total Cards"][`+${value}`].away.value || 0;

		if (acc["Total Cards"][`+${value}`].home.name == homeTeamSide?.name) {
			if (totalCorners > value) {
				acc["Total Cards"][`+${value}`].home.value++;
			}
		}
		if (acc["Total Cards"][`+${value}`].away.name == awayTeamSide?.name) {
			if (totalCorners > value) {
				acc["Total Cards"][`+${value}`].away.value++;
			}
		}
	};

	const getDrawNoBet = (acc, stats) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const goalsHome = stats.goals.home;
		const goalsAway = stats.goals.away;

			acc["Draw No Bet"] = acc["Draw No Bet"] || {};
			acc["Draw No Bet"][`yes`] = acc["Draw No Bet"][`yes`] || {};
			acc["Draw No Bet"][`yes`].home = acc["Draw No Bet"][`yes`].home || {};
			acc["Draw No Bet"][`yes`].away = acc["Draw No Bet"][`yes`].away || {};
			acc["Draw No Bet"][`yes`].home.name = homeTeam.value.name;
			acc["Draw No Bet"][`yes`].away.name = awayTeam.value.name;
			acc["Draw No Bet"][`yes`].home.value = acc["Draw No Bet"][`yes`].home.value || 0;
			acc["Draw No Bet"][`yes`].away.value = acc["Draw No Bet"][`yes`].away.value || 0;

			if (acc["Draw No Bet"][`yes`].home.name == homeTeamSide?.name) {
				if (homeTeamSide.winner || goalsHome == goalsAway) {
					acc["Draw No Bet"][`yes`].home.value++;
				}
			}
			if (acc["Draw No Bet"][`yes`].away.name == awayTeamSide?.name) {
				if (awayTeamSide.winner || goalsHome == goalsAway) {
					acc["Draw No Bet"][`yes`].away.value++;
				}
			}
		
	}; 

	return {
		loadBetsHelper,
		betsHelper,
		betsHelperH2H,
		getBoardInfo,
		getBoardInfoH2H,
		extraInfo,
		betsHelperResponse,
	};
}
