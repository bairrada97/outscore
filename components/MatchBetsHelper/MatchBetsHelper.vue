<template>
	<div class="matchBetsHelper">
		<ul class="matchBetsHelper__list" v-if="betsHelper">
			<li class="matchBetsHelper__item" v-for="(category, index) in betsHelper" :key="index">
				<h3 class="matchBetsHelper__title">{{ index }}</h3>
				<div class="matchBetsHelper__stats" v-for="(subCategory, index) in category" :key="index">
					<CardStats :statistics="subCategory" :team="index" :lastGamesLength="lastGamesLength" />
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import CardStats from "@/components/CardStats/CardStats.vue";
	import useBetsHelper from "@/modules/useBetsHelper";

	export default {
		components: {
			CardStats
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const { loadBetsHelper, betsHelper } = useBetsHelper();
			const { home, away } = props.matchDetail.teams;
			const lastGamesLength = 3;

			const { fetch, fetchState } = useFetch(async () => {
				await loadBetsHelper(home, away);
			});

			fetch();

			return {
				lastGamesLength,
				fetchState,
				betsHelper
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchBetsHelper {
		margin-top: 16px;

		&__title {
			font-size: 14px;
			font-weight: 600;
			text-transform: uppercase;
			padding: 8px 16px;
			background-color: #dadada;
			grid-column: 1/-1;
		}

		&__list {
		}

		&__item {
			display: grid;
			gap: 24px 0;
			margin-bottom: 16px;
			padding-bottom: 16px;
			border: 1px solid rgba(183, 183, 183, 0.3);
		}

		&__stats {
			padding: 0 10px;
		}
	}
</style>
