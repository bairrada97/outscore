<template>
	<div class="cardStats">
		<div class="cardStats__container">
			<span class="cardStats__teamName">{{ team }}</span>
			<div class="cardStats__statistics" v-for="(stats, index) in statistics" :key="index">
				<span>{{ stats.value || 0 }}{{ lastGamesLength ? `/${lastGamesLength}` : "" }}</span>
				<div class="cardStats__bar">
					<div class="cardStats__statsProgress" :style="{ width: convertStatsInWidth(stats.value) + '%' }" :data-id="index"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { watch, computed, ref } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";

	export default {
		props: {
			team: {
				type: String
			},
			statistics: {
				type: Object
			},
			lastGamesLength: {
				type: Number
			}
		},
		setup(props) {
			const sumOfStatistics = Object.values(props.statistics).reduce((a, b) => parseInt(a.value) + parseInt(b.value));
			const convertStatsInWidth = stat => {
				if (props.lastGamesLength) {
					return stat ? (parseInt(stat) * 100) / props.lastGamesLength : 0;
				} else {
					return stat ? (parseInt(stat) * 100) / sumOfStatistics : 0;
				}
			};

			return {
				convertStatsInWidth
			};
		}
	};
</script>

<style lang="scss" scoped>
	.cardStats {
		font-size: 14px;
		font-weight: 600;
		&__container {
			display: grid;
			grid-template-columns: repeat(6, 1fr);
			gap: 4px;
		}

		&__teamName {
			grid-column: 2/6;
			grid-row: 1;
			justify-self: center;
		}

		&__statistics {
			grid-column: 1/4;
			grid-row: 1;
			direction: rtl;

			&:last-of-type {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				grid-column: 4/-1;
				width: 100%;
				direction: ltr;
			}
		}

		&__bar {
			width: 100%;
			background-color: #e9e7e7;
			height: 8px;
		}

		&__statsProgress {
			height: 100%;
			background-color: var(--color-primary);
			z-index: 2;

			&[data-index="1"] {
				background-color: var(--color-bg--black);
			}
		}
	}
</style>
