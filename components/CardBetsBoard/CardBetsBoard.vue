<template>
	<div class="cardBetsBoard">
		<header>
			<img width="32" height="32" :src="matchDetail.teams.home.logo" alt="" />
			<span>{{ title }}</span>
			<img width="32" height="32" :src="matchDetail.teams.away.logo" alt="" />
		</header>
		<div class="cardBetsBoard__content" v-if="type == 'H2H'">
			<div class="cardBetsBoard__info" v-for="(boardInfo, index) of getBoardInfo.matches" :key="index">
				<span class="cardBetsBoard__number" :style="{ color: boardInfo.color, background: boardInfo.background }">{{ boardInfo.number }}</span>
				<span class="cardBetsBoard__description">{{ boardInfo.description }}</span>
			</div>
		</div>
		<div class="cardBetsBoard__content" v-if="type == 'All'">
			<div class="cardBetsBoard__container" v-for="(boardInfo, index) of getBoardInfo.matches" :key="index">
				<div class="cardBetsBoard__info" v-for="(team, index) of boardInfo" :key="index">
					<span class="cardBetsBoard__number" :style="{ color: team.color, background: team.background }">{{ team.number }}</span>
					<span class="cardBetsBoard__description">{{ team.description }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { watch, computed } from "@nuxtjs/composition-api";
	import store from "@/store.js";

	export default {
		props: {
			matchDetail: {
				type: Object
			},
			getBoardInfo: {
				type: Object
			},
			title: {
				type: String
			},
			type: {
				type: String
			}
		},
		setup(props) {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	.cardBetsBoard {
		background: #797979;
		display: grid;
		padding: 16px;
		color: #fff;
		font-weight: 600;
		gap: 16px 0;
		margin-bottom: 24px;

		header,
		&__content {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__container {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 0 8px;
		}

		&__info {
			display: grid;
			grid-template-columns: 1fr;
			gap: 0 8px;
			text-align: center;
			min-width: 38px;
		}

		&__number {
			grid-column: 1;
			grid-row: 1/3;
			background-color: #e9e7e7;
			color: #212121;
			font-weight: 900;
			font-size: 20px;
			align-self: center;
			justify-self: center;
			padding: 5px 10px;
		}

		&__description {
			font-weight: 400;
			font-size: 12px;
		}
	}
</style>
