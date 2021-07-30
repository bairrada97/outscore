<template>
	<div class="matchLineups" v-if="matchDetail.lineups && matchDetail.lineups.length > 0">
		<div class="matchLineups__container" :data-id="index" v-for="(team, index) in matchDetail.lineups" :key="team.team.id">
			<div class="matchLineups__summary">
				<span class="matchLineups__teamName">{{ team.team.name }}</span>
				<span class="matchLineups__formation">{{ team.formation }}</span>
			</div>
			<div class="matchLineups__fieldGrid" v-if="team.formation">
				<div class="matchLineups__fieldRows" v-for="(grid, index) in getGrid(team.formation)" :key="index">
					<div class="matchLineups__fieldPlayers" :style="{ gridArea: getPlayerGridPosition(player.player.grid) }" v-for="(player, index) in getPlayersFromRow(team.startXI, grid)" :key="index">
						<span class="matchLineups__fieldPlayers__number">{{ player.player.number }}</span>
						<span class="matchLineups__fieldPlayers__name">{{ getPlayerName(player.player.name) }}</span>
					</div>
				</div>
			</div>
		</div>
		<figure v-if="matchDetail.lineups[0].formation">
			<nuxt-img class="matchLineups__field" height="539" src="/field.png" />
		</figure>
		<div class="matchLineups__teamList">
			<div class="matchLineupsCard isOpen" v-for="team in matchDetail.lineups" :key="team.team.id" @click="openTeamLineup(team.team.name)">
				<CardTeamLineup :team="team" :isOpen="getOpenTeamLineup(team.team.name) ? 'isOpen' : ''">
					<div class="matchLineupsCard__teamListContainer" v-if="getOpenTeamLineup(team.team.name)">
						<div class="matchLineupsCard__bench">
							<CardPlayerLineup :player="team.coach" />
						</div>

						<CardPlayerLineup :player="player.player" v-for="player in team.startXI" :key="player.player.id" :statistics="getPlayerStatistics(player.player.id)[0]" />
						<div class="matchLineupsCard__bench">
							<span class="matchLineupsCard__title">Bench</span>
							<CardPlayerLineup :player="player.player" v-for="player in team.substitutes" :key="player.player.id" />
						</div>
					</div>
				</CardTeamLineup>
				<!-- <div class="matchLineupsCard__container">
					<nuxt-img v-if="team.team.logo" class="matchLineupsCard__logo" width="24" height="24" :src="team.team.logo" :alt="team.team.name + ' logo'" />
					<h3 class="matchLineupsCard__name">{{ team.team.name }}</h3>
					<svg class="matchLineupsCard__dropdown" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.41 8.29492L12 12.8749L16.59 8.29492L18 9.70492L12 15.7049L6 9.70492L7.41 8.29492Z" fill="currentcolor" />
					</svg>
					<div class="matchLineupsCard__teamListContainer">
						<span class="matchLineupsCard__coach" v-if="team.coach.name">
							<nuxt-img v-if="team.coach.photo" class="matchLineupsCard__coachPhoto" width="24" height="24" :src="team.coach.photo" :alt="team.coach.name + ' photo'" />
							<span class="matchLineupsCard__coachName">{{ team.coach.name }}</span>
							<span class="matchLineupsCard__coachTag">Coach</span>
						</span>
						<div class="matchLineupsCard__player" v-for="players in team.startXI" :key="players.player.id">
							<nuxt-img v-if="players.photo" class="matchLineupsCard__playerPhoto" width="24" height="24" :src="players.player.photo" :alt="players.player.name + ' photo'" />
							<span class="matchLineupsCard__playerNumber">{{ players.player.number }}</span>
							<span class="matchLineupsCard__playerName">{{ players.player.name }}</span>
							<span class="matchLineupsCard__playerMatchEvent">Coach</span>
						</div>
						<div class="matchLineupsCard__bench">
							<span class="matchLineupsCard__title">Bench</span>
							<div class="matchLineupsCard__player" v-for="players in team.substitutes" :key="players.player.id">
								<nuxt-img v-if="players.photo" class="matchLineupsCard__playerPhoto" width="24" height="24" :src="players.player.photo" :alt="players.player.name + ' photo'" />
								<span class="matchLineupsCard__playerNumber">{{ players.player.number }}</span>
								<span class="matchLineupsCard__playerName">{{ players.player.name }}</span>
								<span class="matchLineupsCard__playerMatchEvent">Coach</span>
							</div>
						</div>
					</div>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";
	import CardTeamLineup from "@/components/CardTeamLineup/CardTeamLineup.vue";
	import CardPlayerLineup from "@/components/CardPlayerLineup/CardPlayerLineup.vue";

	import store from "@/store.js";

	export default {
		components: {
			CardTeamLineup,
			CardPlayerLineup
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const { players } = props.matchDetail;
			const isOpen = ref([]);
			const getGrid = formation => formation?.split("-").length + 1;
			const getPlayerGridPosition = grid => {
				const row = grid.split(":")[0];
				const column = grid.split(":")[1];
				return `${row} / ${column}`;
			};

			const getGridColumns = column => `repeat(${column}, 1fr)`;
			const getPlayersFromRow = (starters, index) => starters.filter(player => player.player.grid.split(":")[0] == index);
			const getPlayerName = name => `${name.charAt(0)}. ${name.split(" ").pop()}`;
			console.log("cenas");
			const getPlayerStatistics = playerID => players.map(team => team.players.find(item => item.player.id == playerID));
			const openTeamLineup = teamName => {
				if (isOpen.value.includes(teamName)) {
					isOpen.value = isOpen.value.filter(name => name != teamName);
				} else {
					isOpen.value.push(teamName);
				}
			};

			const getOpenTeamLineup = teamName => isOpen.value.find(item => item == teamName);

			return {
				getGrid,
				getPlayerGridPosition,
				getPlayersFromRow,
				getPlayerName,
				getGridColumns,
				openTeamLineup,
				getOpenTeamLineup,
				getPlayerStatistics,
				isOpen
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchLineups {
		$this: &;
		padding: 24px 16px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;

		&__container {
			grid-column: 1/-1;
			display: flex;
			gap: 24px 0;
			&[data-id="0"] {
				grid-row: 1;
				flex-direction: column;

				#{$this}__fieldGrid {
					flex-direction: column;
				}
				#{$this}__fieldRows {
					direction: rtl;
				}
			}

			&[data-id="1"] {
				grid-row: 2;
				flex-direction: column-reverse;

				#{$this}__fieldGrid {
					flex-direction: column-reverse;
				}

				#{$this}__fieldRows {
					direction: ltr;
				}
			}
		}

		&__summary {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			font-weight: 600;
		}

		figure {
			position: relative;
			grid-column: 1/-1;
			grid-row: 1/3;
			width: 100%;
			border: 1px solid #dadada;
			z-index: -1;
			display: flex;
			align-items: center;
			margin: 42px auto;
			justify-content: center;
			background-color: #f1f1f1;

			&:after {
				content: "";
				position: absolute;
				width: 100%;
				height: 1px;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: #dadada;
			}
		}

		&__fieldGrid {
			display: flex;
			height: 100%;
		}

		&__fieldRows {
			display: grid;
			height: 100%;
			grid-template-columns: repeat(auto-fit, minmax(1px, 1fr));
		}

		&__fieldPlayers {
			justify-self: center;
			grid-row: auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;

			&__number {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				height: 24px;
				background-color: #fff;
				font-weight: 600;
				font-size: 12px;
				line-height: 15px;
				border-radius: 50%;
			}

			&__name {
				font-size: 12px;
				line-height: 15px;
				border-radius: 50%;
				color: #212121;
				font-weight: 600;
				text-align: center;
			}
		}

		&__teamList {
			margin-top: 24px;
			display: grid;
			grid-template-columns: 1fr;
			grid-column: 1/-1;
		}
	}

	.matchLineupsCard {
		$this: &;

		&__container {
			display: grid;
			grid-template-columns: 40px 1fr auto auto;
			gap: 0 16px;
			padding: 8px 16px;
			align-items: center;
			border-bottom: 1px solid rgba(183, 183, 183, 0.3);
		}

		&__teamListContainer {
			grid-column: 1/6;
			background: white;
			padding: 16px;
			display: grid;
			gap: 16px 0;
		}

		&__coach {
			grid-template-columns: 24px 1fr auto;
			font-weight: 600;
			gap: 0 10px;
			padding-bottom: 16px;
			border-bottom: 1px solid #dcdcdc;
		}

		&__coachName {
			color: #212121;
			width: 100%;
		}

		&__coachTag {
			color: #939393;
		}

		&__bench {
			margin-top: 16px;
			padding-top: 16px;
			border-top: 1px solid #dcdcdc;
			display: grid;
			gap: 16px 0;
		}

		&__title {
			display: block;
		}
	}
</style>
