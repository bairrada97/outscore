<template>
	<div class="matchInfo">
		<div class="matchInfo__container">
			<div class="matchInfo__teamsContainer" v-if="match.teams">
				<div class="matchInfo__teams" v-for="team in match.teams" :key="team.id">
					<nuxt-picture loading="lazy" v-if="team.logo" class="matchInfo__teamsLogo" width="48" height="48" sizes="sm:48px md:48px lg:48px" :src="team.logo" :alt="team.name + ' logo'" />
					<h3 class="matchInfo__team">{{ team.name }}</h3>
				</div>
				<div class="matchInfo__statusContainer">
					<div class="matchInfo__scoreContainer">
						<span class="matchInfo__score" v-if="!gameWillNotStart.includes(match.fixture.status.short)" v-for="(score, index) in match.goals" :key="index">{{ score ? score : 0 }}</span>
						<span class="matchInfo__extraInfo" v-if="match.fixture.status.short == 'NS' && seconds > 0">{{ displayTimeLeftForGameStart }}</span>
						<div class="matchInfo__extraInfo" v-if="match.fixture.status.short == 'PEN'">
							Penalties
							<span class="matchInfo__extraInfoContainer">
								<span class="matchInfo__extraScore" v-for="(score, index) in match.score.penalty" :key="index"> {{ score }} </span>
								<span class="matchInfo__extraScore--divider"> - </span>
							</span>
						</div>
						<span class="matchInfo__extraInfo">{{ longShortNames.includes(match.fixture.status.short) ? match.fixture.status.long : match.fixture.status.elapsed }} </span>
					</div>
				</div>
			</div>
			<div class="matchInfo__timerContainer">
				<div class="matchInfo__bar">
					<div class="matchInfo__timerProgress" v-if="match.fixture" :style="{ width: convertMatchCurrentTimeInWidth(match.fixture.status.elapsed) }"></div>
				</div>
				<div class="matchInfo__labelsContainer">
					<span class="matchInfo__label" v-if="match.fixture">{{ getDate(match.fixture.timestamp) }}</span>
					<span class="matchInfo__label">HT</span>
					<span class="matchInfo__label">FT</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { watch, computed, ref, onActivated, onDeactivated } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";

	export default {
		props: {
			match: {
				type: Object
			}
		},
		setup(props) {
			const gameWillNotStart = ["CANC", "PST", "ABD", "WO"];
			const longShortNames = ["CANC", "PST", "ABD", "WO", "FT", "HT"];
			const days = ref(0);
			const hours = ref(0);
			const minutes = ref(0);
			const seconds = ref(0);
			const timer = ref(null);

			const displayTimeLeftForGameStart = computed(() => {
				if (days.value > 0) {
					return days.value + 1 + " days left";
				} else {
					return hours.value + ":" + minutes.value + ":" + seconds.value;
				}
			});

			const getDate = timestamp => {
				let hours = new Date(timestamp * 1000).getHours();
				let minutes = new Date(timestamp * 1000).getMinutes();

				hours = hours < 10 ? "0" + hours : hours;
				minutes = minutes < 10 ? "0" + minutes : minutes;

				return hours + ":" + minutes;
			};

			const convertMatchCurrentTimeInWidth = time => {
				let maxTime = 90;
				return Math.min(Math.max(parseInt((time * 100) / maxTime), 0), 100) + "%";
			};

			onDeactivated(() => {
				clearInterval(timer.value);
			});
			onActivated(() => {
				timer.value = setInterval(function () {
					const gameDate = props.match?.fixture.date;
					if (!gameDate) return;
					const timeLeftForGameStart = new Date(gameDate).getTime() - new Date().getTime();
					days.value = Math.floor(timeLeftForGameStart / (1000 * 60 * 60 * 24));
					hours.value = Math.floor((timeLeftForGameStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					minutes.value = Math.floor((timeLeftForGameStart % (1000 * 60 * 60)) / (1000 * 60));
					seconds.value = Math.floor((timeLeftForGameStart % (1000 * 60)) / 1000);

					hours.value = hours.value < 10 ? "0" + hours.value : hours.value;
					minutes.value = minutes.value < 10 ? "0" + minutes.value : minutes.value;

					if (timeLeftForGameStart < 0) clearInterval(timer.value);
				}, 1000);
			});
			return { getDate, convertMatchCurrentTimeInWidth, gameWillNotStart, displayTimeLeftForGameStart, longShortNames, seconds };
		}
	};
</script>

<style lang="scss" scoped>
	.matchInfo {
		background-color: #797979;
		color: #fff;
		padding: 24px 16px;

		&__teamsContainer {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			justify-content: space-around;
			align-items: center;
			margin-bottom: 16px;
		}

		&__teams {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		&__team {
			font-size: 12px;
			margin-top: 8px;
		}

		&__statusContainer {
			grid-column: 2;
			grid-row: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 4px;
		}

		&__scoreContainer {
			display: grid;
			gap: 5px 16px;
			text-align: center;
		}

		&__score {
			font-size: 20px;
			font-weight: 700;
			grid-row: 1;
		}

		&__extraInfo {
			grid-column: 1/3;
			grid-row: 2;
			text-align: center;
		}

		&__extraInfoContainer {
			display: grid;
		}

		&__extraScore {
			font-size: 14px;
			font-weight: 700;
			grid-row: 1;

			&--divider {
				grid-column: 2;
				grid-row: 1;
			}
		}

		&__bar {
			width: 100%;
			background-color: #fff;
			height: 4px;
		}

		&__timerProgress {
			height: 100%;
			background-color: #212121;
			z-index: 2;
		}

		&__labelsContainer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 8px;
		}

		&__label {
			font-size: 12px;
		}
	}
</style>
