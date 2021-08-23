import { defineComponent, reactive, computed, ref, onMounted, useFetch, onActivated, onUnmounted } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function (fixture) {
	const betsHelperResponse = ref([]);
	const homeTeam = ref(null);
	const awayTeam = ref(null);
	const extraInfo = ref(null)
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
		const uniqueMatches = [...new Map([...away, ...home].map(item => [item.fixture.id, item])).values()];

		const isFriendlyMatch  =  uniqueMatches.find(fixture => fixture.league.id == 667);

		if(isFriendlyMatch){ 
			extraInfo.value = "At least one of last the 5 games is a friendly match"
		}
		const getHomeWinnerLength = getHomeFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == homeTeam.value.id && team.winner)).filter(match => match.length).length
		const getHomeLosesLength = getHomeFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == homeTeam.value.id && team.winner == false)).filter(match => match.length).length
		const getHomeDrawsLength = home.length - (getHomeWinnerLength + getHomeLosesLength);
		const getAwayWinnerLength = getAwayFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == awayTeam.value.id && team.winner)).filter(match => match.length).length
		const getAwayLosesLength = getAwayFinishedGames.map(item =>  Object.values(item.teams).filter(team => team.id == awayTeam.value.id && team.winner == false)).filter(match => match.length).length
		const getAwayDrawsLength = away.length - (getAwayWinnerLength + getAwayLosesLength);

		
	
	
		return {
			gameLength: getHomeFinishedGames.length,
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


	const betsHelperFulltime = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { away, home } = betsHelperResponse.value.value;
		const uniqueMatches = [...away, ...home]; 
		const matchesLength = uniqueMatches.length; 
	
		 
		return uniqueMatches?.reduce((acc, stats, index) => {
			getGoals(acc, stats, 1.5, "fulltime", index, matchesLength);
			getGoals(acc, stats, 2.5, "fulltime", index, matchesLength);
			getGoals(acc, stats, 3.5, "fulltime", index, matchesLength);
			getGoals(acc, stats, 4.5, "fulltime", index, matchesLength);
			getGoals(acc, stats, 5.5, "fulltime", index, matchesLength);
			getBothTeamsToScore(acc, stats, "fulltime", index, matchesLength);
			getCleanSheet(acc, stats, index, matchesLength);
			getFirstTeamToScore(acc, stats, index, matchesLength);
			getTotalCorners(acc, stats, 7.5, index, matchesLength);
			getTotalCorners(acc, stats, 8.5, index, matchesLength);
			getTotalCorners(acc, stats, 9.5, index, matchesLength);
			getTotalCorners(acc, stats, 10.5, index, matchesLength);
			getTotalCorners(acc, stats, 11.5, index, matchesLength);
			getTotalCorners(acc, stats, 12.5, index, matchesLength);
			getTotalCards(acc, stats, 2.5, index, matchesLength);
			getTotalCards(acc, stats, 3.5, index, matchesLength);
			getTotalCards(acc, stats, 4.5, index, matchesLength);
			getTotalCards(acc, stats, 5.5, index, matchesLength);
			getTotalCards(acc, stats, 6.5, index, matchesLength);
			getTotalCards(acc, stats, 7.5, index, matchesLength);
			getDrawNoBet(acc, stats, index, matchesLength);
			return acc;
		}, {});
	});

	const betsHelperFirstHalf = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { away, home } = betsHelperResponse.value.value;
		const uniqueMatches = [...away, ...home]; 
		const matchesLength = uniqueMatches.length; 

		return uniqueMatches?.reduce((acc, stats,index) => {
			getGoals(acc, stats, 0.5, "firsthalf",index, matchesLength);
			getGoals(acc, stats, 1.5, "firsthalf",index, matchesLength);
			getGoals(acc, stats, 2.5, "firsthalf",index, matchesLength);
			getGoals(acc, stats, 3.5, "firsthalf",index, matchesLength);
			getBothTeamsToScore(acc, stats, "firsthalf",index, matchesLength);
			getGoalsByTime(acc,stats, "0-15",index, matchesLength)
			getGoalsByTime(acc,stats, "16-30",index, matchesLength);
			getGoalsByTime(acc,stats, "31-45",index, matchesLength);
			return acc;
		}, {});
	});

	const betsHelperSecondHalf = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { away, home } = betsHelperResponse.value.value;
		const uniqueMatches = [...away, ...home]; 
		const matchesLength = uniqueMatches.length; 

		return uniqueMatches?.reduce((acc, stats,index) => {
			getGoals(acc, stats, 0.5, "secondhalf",index, matchesLength);
			getGoals(acc, stats, 1.5, "secondhalf",index, matchesLength);
			getGoals(acc, stats, 2.5, "secondhalf",index, matchesLength);
			getGoals(acc, stats, 3.5, "secondhalf",index, matchesLength);
			getBothTeamsToScore(acc, stats, "secondhalf",index, matchesLength);
			getGoalsByTime(acc,stats, "46-60",index, matchesLength)
			getGoalsByTime(acc,stats, "61-75",index, matchesLength);
			getGoalsByTime(acc,stats, "76-90",index, matchesLength);
			return acc;
		}, {});
	});

	const betsHelperH2HFulltime = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { h2h } = betsHelperResponse.value.value;
		const matchesLength = h2h.length; 
	
		return h2h?.reduce((acc, stats, index) => {
			getGoals(acc, stats, 1.5, "fulltime",index,matchesLength, true);
			getGoals(acc, stats, 2.5, "fulltime",index,matchesLength, true);
			getGoals(acc, stats, 3.5, "fulltime",index,matchesLength, true);
			getGoals(acc, stats, 4.5, "fulltime",index,matchesLength, true);
			getGoals(acc, stats, 5.5, "fulltime",index,matchesLength, true);
			getBothTeamsToScore(acc, stats, "fulltime",index,matchesLength, true);
			getCleanSheet(acc, stats,index,matchesLength, true);
			getFirstTeamToScore(acc, stats,index,matchesLength, true);
			getTotalCorners(acc, stats, 7.5,index,matchesLength, true);
			getTotalCorners(acc, stats, 8.5,index,matchesLength, true);
			getTotalCorners(acc, stats, 9.5,index,matchesLength, true);
			getTotalCorners(acc, stats, 10.5,index,matchesLength, true);
			getTotalCorners(acc, stats, 11.5,index,matchesLength, true);
			getTotalCorners(acc, stats, 12.5,index,matchesLength, true);
			getTotalCards(acc, stats, 2.5,index,matchesLength, true);
			getTotalCards(acc, stats, 3.5,index,matchesLength, true);
			getTotalCards(acc, stats, 4.5,index,matchesLength, true);
			getTotalCards(acc, stats, 5.5,index,matchesLength, true);
			getTotalCards(acc, stats, 6.5,index,matchesLength, true);
			getTotalCards(acc, stats, 7.5,index,matchesLength, true);
			getDrawNoBet(acc, stats,index,matchesLength, true);
			return acc;
		}, {});
	});

	const betsHelperH2HFirstHalf = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { h2h } = betsHelperResponse.value.value;
		const matchesLength = h2h.length; 
		
	
		return h2h?.reduce((acc, stats,index) => {
			getGoals(acc, stats, 0.5, "firsthalf",index, matchesLength);
			getGoals(acc, stats, 1.5, "firsthalf",index, matchesLength);
			getGoals(acc, stats, 2.5, "firsthalf",index, matchesLength);
			getGoals(acc, stats, 3.5, "firsthalf",index, matchesLength);
			getBothTeamsToScore(acc, stats, "firsthalf", index, matchesLength);
			getGoalsByTime(acc,stats, "0-15",index, matchesLength);
			getGoalsByTime(acc,stats, "16-30", index, matchesLength);
			getGoalsByTime(acc,stats, "31-45", index, matchesLength);
			
			return acc;
		}, {});
	});

	const betsHelperH2HSecondHalf = computed(() => {
		if (betsHelperResponse.value.value.length == 0 || betsHelperResponse.value.value == undefined) return;
		const { h2h } = betsHelperResponse.value.value;
		const matchesLength = h2h.length; 

		return h2h?.reduce((acc, stats, index) => {
			getGoals(acc, stats, 0.5, "secondhalf",index, matchesLength);
			getGoals(acc, stats, 1.5, "secondhalf",index, matchesLength);
			getGoals(acc, stats, 2.5, "secondhalf",index, matchesLength);
			getGoals(acc, stats, 3.5, "secondhalf",index, matchesLength);
			getBothTeamsToScore(acc, stats, "secondhalf", index, matchesLength);
			getGoalsByTime(acc,stats, "46-60",index, matchesLength);
			getGoalsByTime(acc,stats, "61-75", index, matchesLength);
			getGoalsByTime(acc,stats, "75-90", index, matchesLength);
		
			return acc;
		}, {});
	});

	const getGoals = (acc,stats, value, time, index, matchesLength, isH2H = false) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		let goalsInGame;

		if(time == "fulltime") goalsInGame = stats.goals.home + stats.goals.away;
		if(time == "firsthalf") goalsInGame = stats.score.halftime.home +  stats.score.halftime.away;
		if(time == "secondhalf") goalsInGame = ( stats.score.fulltime.home +  stats.score.fulltime.away) - stats.score.halftime.home +  stats.score.halftime.away;

		createCategoryObject(acc, "Goals", `+${value}`, homeTeam,awayTeam);
		
		

		const sumToCategory = (acc, value,side, team) => {
			if (acc["Goals"][`+${value}`][side].name == team?.name) {
				if (goalsInGame > value) {
					acc["Goals"][`+${value}`][side].value++;
				}
			}	
		}

		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther = homeTeamSide && awayTeamSide;

		if(isH2H){
			sumToCategory(acc, value,"away",awayTeamSide)
			sumToCategory(acc, value,"home", homeTeamSide)
			return
		}
		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, value,"away",awayTeamSide) :	sumToCategory(acc, value,"home", homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, value,"away",awayTeamSide) : sumToCategory(acc, value,"home",homeTeamSide) 
		}

	};

	const getBothTeamsToScore = (acc, stats, time, index, matchesLength, isH2H = false) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		let goalsHome;
		let goalsAway;
		let isBothTeamsToScore;

		if(time =="fulltime"){
			goalsHome = stats.goals.home;
			goalsAway = stats.goals.away;		
		}

		if(time == "firsthalf"){
			goalsHome = stats.score.halftime.home;
			goalsAway = stats.score.halftime.away;
		}

		if(time == "secondhalf"){
			goalsHome = stats.goals.home - stats.score.halftime.home;
			goalsAway = stats.goals.away- stats.score.halftime.away;
		}
		isBothTeamsToScore = goalsHome > 0 && goalsAway > 0;
	

		createCategoryObject(acc, "Both Teams To Score", `yes`, homeTeam,awayTeam);

		
		const sumToCategory = (acc, value, side, team) => {
			if ((acc["Both Teams To Score"][value][side].name == team?.name) && isBothTeamsToScore) {
				acc["Both Teams To Score"][value][side].value++;
			}	
		}

		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther =homeTeamSide && awayTeamSide


		if(isH2H){
			sumToCategory(acc, "yes","away",awayTeamSide)
			sumToCategory(acc, "yes","home", homeTeamSide)
			return
		}
		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, "yes","away",awayTeamSide) :	sumToCategory(acc, "yes","home", homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, "yes","away",awayTeamSide) : sumToCategory(acc, "yes","home",homeTeamSide) 
		}

	
	};

	const getCleanSheet = (acc, stats,index, matchesLength, isH2H = false) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const goalsHome = stats.goals.home;
		const goalsAway = stats.goals.away;
		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther =homeTeamSide && awayTeamSide;
		const sumToCategory = (acc, value, side,categoryCondition, team) => {
			if ((acc["Clean Sheet"][value][side].name == team?.name) && categoryCondition == 0) {
				acc["Clean Sheet"][value][side].value++;
			}	
		}

		createCategoryObject(acc, "Clean Sheet", `yes`, homeTeam,awayTeam);

		if(isH2H){
			sumToCategory(acc, "yes","away",awayTeamSide)
			sumToCategory(acc, "yes","home", homeTeamSide)
			return
		}
		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, "yes","away", goalsHome,awayTeamSide) :	sumToCategory(acc, "yes","home",goalsAway, homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, "yes","away", goalsHome,awayTeamSide) : sumToCategory(acc, "yes","home", goalsAway,homeTeamSide) 
		}

	
	};
 
	const getFirstTeamToScore = (acc, stats,index, matchesLength, isH2H = false) => {
		
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const firstGoalEvent = stats.events.find(events => events.type == "Goal");
		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther =homeTeamSide && awayTeamSide;

		const sumToCategory = (acc, value, side, team) => {
			if ((acc["First Team To Score"][value][side].name == team?.name) && firstGoalEvent?.team.id == team?.id) {
				acc["First Team To Score"][value][side].value++;
			}	
		}

		

		createCategoryObject(acc, "First Team To Score", `yes`, homeTeam,awayTeam);

		if(isH2H){
			sumToCategory(acc, "yes","away",awayTeamSide)
			sumToCategory(acc, "yes","home", homeTeamSide)
			return
		}

		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, "yes","away",awayTeamSide) :	sumToCategory(acc, "yes","home", homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, "yes","away",awayTeamSide) : sumToCategory(acc, "yes","home",homeTeamSide) 
		}


	};

	const getTotalCorners = (acc, stats, value,index, matchesLength, isH2H = false) => {
	
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const totalCorners =
			stats.statistics.length > 0
				? stats.statistics
						.map(item => item.statistics)
						.map(item2 => item2.filter(item3 => item3.type == "Corner Kicks"))
						.reduce((prev, next) => prev[0].value + next[0].value)
				: "";
		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther =homeTeamSide && awayTeamSide;
		const sumToCategory = (acc, value, side, team) => {
			if ((acc["Total Corners"][value][side].name == team?.name) && totalCorners > value) {
				acc["Total Corners"][value][side].value++;
			}	
		}

		createCategoryObject(acc, "Total Corners", `+${value}`, homeTeam,awayTeam);

			
		if(isH2H){
			sumToCategory(acc, `+${value}`,"away",awayTeamSide)
			sumToCategory(acc, `+${value}`,"home", homeTeamSide)
			return
		}

		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, `+${value}`,"away",awayTeamSide) :	sumToCategory(acc, `+${value}`,"home", homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, `+${value}`,"away",awayTeamSide) : sumToCategory(acc, `+${value}`,"home",homeTeamSide) 
		}

	
	};

	const getTotalCards = (acc, stats, value,index, matchesLength, isH2H = false) => {
		
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const totalCards =
			stats.statistics.length > 0
				? stats.statistics
						.map(item => item.statistics)
						.map(item2 => item2.filter(item3 => item3.type == "Yellow Cards" || item3.type == "Red Cards"))
						.reduce((prev, next) => prev[0].value + next[0].value + prev[1].value + next[1].value)
				: "";
		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther = homeTeamSide && awayTeamSide;

		const sumToCategory = (acc, value, side, team) => {
			if ((acc["Total Cards"][value][side].name == team?.name) && totalCards > value) {
				acc["Total Cards"][value][side].value++;
			}	
		}

		createCategoryObject(acc, "Total Cards", `+${value}`, homeTeam,awayTeam);

	

		if(isH2H){
			sumToCategory(acc, `+${value}`,"away",awayTeamSide)
			sumToCategory(acc, `+${value}`,"home", homeTeamSide)
			return
		}

		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, `+${value}`,"away",awayTeamSide) :	sumToCategory(acc, `+${value}`,"home", homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, `+${value}`,"away",awayTeamSide) : sumToCategory(acc, `+${value}`,"home",homeTeamSide) 
		}
	};

	const getDrawNoBet = (acc, stats,index, matchesLength, isH2H = false) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const goalsHome = stats.goals.home;
		const goalsAway = stats.goals.away;
		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther = homeTeamSide && awayTeamSide;
		const sumToCategory = (acc, value, side, team) => {
			if ((acc["Draw No Bet"][value][side].name == team?.name) && (team?.winner || goalsHome == goalsAway )) {
				acc["Draw No Bet"][value][side].value++;
			}	
		}

		createCategoryObject(acc, "Draw No Bet", `yes`, homeTeam,awayTeam);

		if(isH2H){
			sumToCategory(acc, `yes`,"away",awayTeamSide)
			sumToCategory(acc, `yes`,"home", homeTeamSide)
			return
		}

		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, `yes`,"away",awayTeamSide) :	sumToCategory(acc, `yes`,"home", homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, `yes`,"away",awayTeamSide) : sumToCategory(acc, `yes`,"home",homeTeamSide) 
		}
	
	}; 

	const getGoalsByTime = (acc, stats, time,index,matchesLength, isH2H = false) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		const divideTime = time.split("-")
		const timeInGame = stats.events.filter(events => events.time.elapsed >= +divideTime[0] &&  events.time.elapsed <= +divideTime[1] && (events.detail =="Normal Goal" || events.detail =="Penalty" || events.detail =="Own Goal"));	
		const isAwayGames = index < (matchesLength / 2);
		const isGameBetweenEachOther = homeTeamSide && awayTeamSide;
		const sumToCategory = (acc, value, side, team) => {
			if ((acc["Scored Between"][value][side].name == team?.name) && timeInGame.length) {
				acc["Scored Between"][value][side].value++;
			}	
		}

		createCategoryObject(acc, "Scored Between",`${time}`, homeTeam,awayTeam);

		
		if(isH2H){
			sumToCategory(acc, `${time}`,"away",awayTeamSide)
			sumToCategory(acc, `${time}`,"home", homeTeamSide)
			return
		}

		if(isGameBetweenEachOther){
			isAwayGames ? sumToCategory(acc, `${time}`,"away",awayTeamSide) :	sumToCategory(acc, `${time}`,"home", homeTeamSide)
		}else{
			isAwayGames ? sumToCategory(acc, `${time}`,"away",awayTeamSide) : sumToCategory(acc, `${time}`,"home",homeTeamSide) 
		}

	
	}

	const toWinToNil =(acc,stats) => {
		const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
		const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
		let isThereNoGoal = Object.values(stats.goals).find(goal => !!goal);

		


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
	}



	const createCategoryObject = (acc,category,value,homeTeam,awayTeam) => {
		acc[category] = acc[category] || {};
		acc[category][value] = acc[category][value] || {};
		acc[category][value].home = acc[category][value].home || {};
		acc[category][value].away = acc[category][value].away || {};
		acc[category][value].home.name = homeTeam.value.name;
		acc[category][value].away.name = awayTeam.value.name;
		acc[category][value].home.value = acc[category][value].home.value || 0;
		acc[category][value].away.value = acc[category][value].away.value || 0;
	}

	

	return {
		loadBetsHelper,
		betsHelperFulltime,
		betsHelperFirstHalf,
		betsHelperSecondHalf,
		betsHelperH2HFulltime,
		betsHelperH2HFirstHalf,
		betsHelperH2HSecondHalf,
		getBoardInfo,
		getBoardInfoH2H,
		extraInfo,
		betsHelperResponse,
	};
}
